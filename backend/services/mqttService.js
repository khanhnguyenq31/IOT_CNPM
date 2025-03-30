const mqtt = require('mqtt');
const Device = require('../models/Device');
const SensorData = require('../models/SensorData');
const History = require('../models/History');

class MqttService {
    constructor() {
        this.username = 'nhatnguyenminh2004';
        this.key = process.env.ADAFRUIT_KEY;
        this.client = null;
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
        const brokerUrl = 'mqtt://io.adafruit.com';
        this.client = mqtt.connect(brokerUrl, {
            username: this.username,
            password: this.key
        });

        this.client.on('connect', () => {
            console.log('Connected to Adafruit IO MQTT');
            this.subscribeToFeeds();
        });

        this.client.on('message', async (topic, message) => {
            try {
                const value = message.toString();
                const feedType = this.getFeedTypeFromTopic(topic);
                
                // Get all devices with credentials
                const devices = await Device.find({
                    usernameaio: { $exists: true },
                    keyaio: { $exists: true }
                });
                
                for (const device of devices) {
                    // Get old value before updating
                    const oldValue = device.feeds[feedType];
                    
                    // Update device feed value
                    if (oldValue !== value) {
                        device.feeds[feedType] = value;
                        await device.save();

                        // Create history record for the change
                        await this.createHistory(device, feedType, oldValue, value);
                    }

                    // Find or update sensor data
                    let sensorData = await SensorData.findOne({ deviceId: device._id });
                    if (!sensorData) {
                        sensorData = new SensorData({
                            deviceId: device._id,
                            timestamp: new Date()
                        });
                    }

                    // Update sensor values based on feed type
                    if (feedType === 'temperature') {
                        sensorData.tempvalue = value;
                    } else if (feedType === 'humidity') {
                        sensorData.humidvalue = value;
                    }

                    sensorData.timestamp = new Date();
                    await sensorData.save();
                }
                
                console.log(`Updated ${feedType} value: ${value}`);
            } catch (error) {
                console.error('Error processing MQTT message:', error);
            }
        });
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
        const feeds = ['temp', 'humid'];
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
            'humid': 'humidity'
        };
        return feedMap[feed] || feed;
    }

    disconnect() {
        if (this.client) {
            this.client.end();
            console.log('Disconnected from MQTT broker');
        }
    }
}

module.exports = new MqttService();