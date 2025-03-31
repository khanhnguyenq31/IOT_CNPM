import React from "react";
import AddButton from "@/components/addbutton";
import DeviceButton from "@/components/device";

// Example devices data
const exampleDevices = [
  { id: 1, name: "Device 1", location: "Ho Chi Minh, Vietnam" },
  { id: 2, name: "Device 2", location: "Hanoi, Vietnam" },
  { id: 3, name: "Device 3", location: "Da Nang, Vietnam" },
];

const DevicesMain = () => {
  const handleAddClick = () => {
    alert("Add Button clicked! Add a new device here.");
  };

  const handleDeviceButtonClick = (deviceName: string, location: string) => {
    alert(`Device ${deviceName} located in ${location} clicked!`);
  };

  return (
    <div className="flex flex-wrap gap-4">
      {/* Add Button */}
      <AddButton onClick={handleAddClick} />

      {/* Dynamically Render DeviceButtons */}
      {exampleDevices.map((device) => (
        <DeviceButton
          key={device.id} // Ensure a unique key for each device
          deviceName={device.name}
          location={device.location}
          onClick={() => handleDeviceButtonClick(device.name, device.location)} // Pass dynamic data to the handler
        />
      ))}
    </div>
  );
};

export default DevicesMain;
