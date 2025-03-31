const mqtt = require('mqtt');
const Device = require('../models/Device');
const SensorData = require('../models/SensorData');
const History = require('../models/History');
const WaterProcess = require('../models/WaterProcess');
const ActivationCondition = require('../models/ActivationCondition');

class MqttService {
    constructor() {
        this.username = process.env.ADAFRUIT_USERNAME; // Sử dụng từ biến môi trường
        this.key = process.env.ADAFRUIT_KEY;
        this.client = null;
        // Kết nối ngay khi khởi tạo service
        this.connect();
    }

    updateCredentials(username, key) {
        // Update credentials
        this.username = username;
        this.key = key;

        // Disconnect existing connection if any
        if (this.client) {
            this.disconnect();
        }

        // Reconnect with new credentials
        this.connect();
        console.log('MQTT credentials updated and reconnected');
    }

    async createHistory(device, type, oldValue, newValue) {
        try {
            const history = new History({
                deviceId: device._id,
                type: type === 'temperature' ? 'TEMPERATURE' : 'HUMIDITY',
                oldValue,
                newValue
            });
            await history.save();
            console.log(`Created history record for ${device.name}: ${type} changed from ${oldValue} to ${newValue}`);
        } catch (error) {
            console.error('Error creating history:', error);
        }
    }

    connect() {
        try {
            const brokerUrl = 'mqtt://io.adafruit.com';
            
            if (this.client) {
                this.client.end(true); // Force disconnect nếu đã có kết nối
            }

            console.log('Connecting with credentials:', {
                username: this.username,
                key: this.key
            });

            this.client = mqtt.connect(brokerUrl, {
                username: this.username,
                password: this.key,
                reconnectPeriod: 5000, // Thử kết nối lại sau 5s nếu mất kết nối
                connectTimeout: 30000 // Tăng thời gian timeout
            });

            this.client.on('connect', () => {
                console.log('Connected to Adafruit IO MQTT');
                this.subscribeToFeeds();
            });

            this.client.on('error', (error) => {
                console.error('MQTT connection error:', error);
            });

            this.client.on('offline', () => {
                console.log('MQTT client is offline, attempting to reconnect...');
            });

            this.client.on('message', async (topic, message) => {
                await this.handleMessage(topic, message);
            });

        } catch (error) {
            console.error('Error in MQTT connect:', error);
        }
    }

    async publishToDeviceFeed(deviceId, feed, value) {
        try {
            const device = await Device.findById(deviceId);
            if (!device) {
                throw new Error('Device not found');
            }

            const topic = `${device.usernameaio}/feeds/${feed}`;
            this.client.publish(topic, value.toString());
            console.log(`Published to ${topic}: ${value}`);
        } catch (error) {
            console.error('Error publishing to device feed:', error);
            throw error;
        }
    }

    async publishThresholds(deviceId, conditions) {
        try {
            const device = await Device.findById(deviceId);
            if (!device) {
                throw new Error('Device not found');
            }

            // Publish temperature thresholds
            await this.publishToDeviceFeed(deviceId, 'tempstart', conditions.temperature.min.toString());
            await this.publishToDeviceFeed(deviceId, 'tempstop', conditions.temperature.max.toString());
            
            // Publish humidity thresholds
            await this.publishToDeviceFeed(deviceId, 'humidstart', conditions.humidity.min.toString());
            await this.publishToDeviceFeed(deviceId, 'humidstop', conditions.humidity.max.toString());

            console.log(`Published thresholds for device ${device.name}`);
        } catch (error) {
            console.error('Error publishing thresholds:', error);
            throw error;
        }
    }

    subscribeToFeeds() {
        const feeds = [
            'temp', 
            'humid',
            'tempswitch',    // điều khiển theo nhiệt độ
            'humidswitch',   // điều khiển theo độ ẩm
            'pump',          // điều khiển thủ công
            'speed',         // tốc độ bơm
            'tempstart',     // nhiệt độ min
            'tempstop',      // nhiệt độ max
            'humidstart',    // độ ẩm min
            'humidstop'      // độ ẩm max
        ];
        feeds.forEach(feed => {
            const topic = `${this.username}/feeds/${feed}`;
            this.client.subscribe(topic, (err) => {
                if (err) {
                    console.error(`Error subscribing to ${feed}:`, err);
                } else {
                    console.log(`Subscribed to ${feed}`);
                }
            });
        });
    }

    getFeedTypeFromTopic(topic) {
        const feed = topic.split('/').pop();
        const feedMap = {
            'temp': 'temperature',
            'humid': 'humidity',
            'tempswitch': 'tempControlled',
            'humidswitch': 'humidControlled', 
            'pump': 'manualControl',
            'speed': 'pumpSpeed',
            'tempstart': 'tempStart',
            'tempstop': 'tempStop',
            'humidstart': 'humidStart',
            'humidstop': 'humidStop'
        };
        return feedMap[feed] || feed;
    }

    async handleMessage(topic, message) {
        try {
            const value = message.toString();
            const feedType = this.getFeedTypeFromTopic(topic);
            const device = await Device.findOne({ usernameaio: topic.split('/')[0] });

            if (!device) return;

            // Handle sensor data
            if (feedType === 'temperature' || feedType === 'humidity') {
                const oldValue = device.feeds[feedType];
                
                if (oldValue !== value) {
                    device.feeds[feedType] = value;
                    await device.save();

                    await this.createHistory(device, feedType, oldValue, value);
                }

                let sensorData = await SensorData.findOne({ deviceId: device._id });
                if (!sensorData) {
                    sensorData = new SensorData({
                        deviceId: device._id,
                        timestamp: new Date()
                    });
                }

                if (feedType === 'temperature') {
                    sensorData.tempvalue = value;
                } else if (feedType === 'humidity') {
                    sensorData.humidvalue = value;
                }

                sensorData.timestamp = new Date();
                await sensorData.save();
            }

            // Handle water process controls
            if (['tempControlled', 'humidControlled', 'manualControl', 'pumpSpeed'].includes(feedType)) {
                const waterProcess = await WaterProcess.findOne({ deviceId: device._id });
                if (waterProcess) {
                    if (feedType === 'pumpSpeed') {
                        waterProcess[feedType] = parseInt(value);
                    } else {
                        waterProcess[feedType] = value === '1';
                    }
                    await waterProcess.save();
                }
            }

            // Handle activation condition thresholds
            if (['tempStart', 'tempStop', 'humidStart', 'humidStop'].includes(feedType)) {
                const condition = await ActivationCondition.findOne({ deviceId: device._id });
                if (condition) {
                    if (feedType.startsWith('temp')) {
                        const key = feedType === 'tempStart' ? 'min' : 'max';
                        condition.conditions.temperature[key] = parseFloat(value);
                    } else {
                        const key = feedType === 'humidStart' ? 'min' : 'max';
                        condition.conditions.humidity[key] = parseFloat(value);
                    }
                    await condition.save();
                }
            }

        } catch (error) {
            console.error('Error processing MQTT message:', error);
        }
    }

    disconnect() {
        if (this.client) {
            this.client.end();
            console.log('Disconnected from MQTT broker');
        }
    }
}

module.exports = new MqttService();