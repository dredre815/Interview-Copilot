import React, { useState, useEffect } from 'react';
import Portal from './Portal';

const DeviceSelector = ({ onSelect, onCancel }) => {
  const [devices, setDevices] = useState({
    speakers: [],
    microphones: []
  });
  const [selectedDevices, setSelectedDevices] = useState({
    speaker: null,
    microphone: null
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const getDevices = async () => {
      try {
        // request permission to get device list
        await navigator.mediaDevices.getUserMedia({ audio: true });
        
        const deviceList = await navigator.mediaDevices.enumerateDevices();
        const audioDevices = {
          speakers: deviceList
            .filter(device => device.kind === 'audiooutput')
            .map(device => ({
              id: device.deviceId,
              label: device.label || `Speaker (${device.deviceId.slice(0, 8)})`,
              type: 'speaker'
            })),
          microphones: deviceList
            .filter(device => device.kind === 'audioinput')
            .map(device => ({
              id: device.deviceId,
              label: device.label || `Microphone (${device.deviceId.slice(0, 8)})`,
              type: 'microphone'
            }))
        };

        // add system audio option
        audioDevices.speakers.unshift({
          id: 'system-audio',
          label: 'System Audio (All Desktop Sound)',
          type: 'speaker'
        });

        setDevices(audioDevices);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

    getDevices();
  }, []);

  const handleDeviceSelect = (device) => {
    setSelectedDevices(prev => ({
      ...prev,
      [device.type]: device
    }));
  };

  const handleConfirm = () => {
    if (!selectedDevices.speaker && !selectedDevices.microphone) {
      setError('Please select at least one audio source');
      return;
    }
    onSelect(selectedDevices);
  };

  return (
    <Portal>
      <div className="device-selector-overlay">
        <div className="device-selector-modal">
          <div className="device-selector-header">
            <h2>Select Audio Sources</h2>
          </div>

          {/* Info Section */}
          <div className="device-info-section">
            <div className="device-note">
              <div className="note-header">
                <span className="material-icons">info</span>
                <h3>When selecting System Audio:</h3>
              </div>
              <ul>
                <li>Check "Allow this time" in the dialog</li>
                <li>Select the window you want to capture</li>
                <li>Chrome/Edge browsers recommended</li>
              </ul>
            </div>
          </div>

          {loading && (
            <div className="loading-state">
              <span className="material-icons spinning">sync</span>
              <p>Loading available devices...</p>
            </div>
          )}

          {error && (
            <div className="error-state">
              <span className="material-icons">error</span>
              <p>{error}</p>
            </div>
          )}

          <div className="device-sections">
            {/* System Audio Section */}
            <div className="device-section">
              <h3>System Audio</h3>
              <div className="device-list">
                {devices.speakers.map((device) => (
                  <button
                    key={device.id}
                    className={`device-option ${
                      selectedDevices.speaker?.id === device.id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleDeviceSelect({ ...device, type: "speaker" })
                    }
                  >
                    <span className="device-icon material-icons">
                      {device.id === "system-audio" ? "computer" : "speaker"}
                    </span>
                    <div className="device-info">
                      <div className="device-label">{device.label}</div>
                      <div className="device-type">System Audio</div>
                    </div>
                    {selectedDevices.speaker?.id === device.id && (
                      <span className="device-selected material-icons">
                        check_circle
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Microphone Section */}
            <div className="device-section">
              <h3>Microphone</h3>
              <div className="device-list">
                {devices.microphones.map((device) => (
                  <button
                    key={device.id}
                    className={`device-option ${
                      selectedDevices.microphone?.id === device.id
                        ? "selected"
                        : ""
                    }`}
                    onClick={() =>
                      handleDeviceSelect({ ...device, type: "microphone" })
                    }
                  >
                    <span className="device-icon material-icons">mic</span>
                    <div className="device-info">
                      <div className="device-label">{device.label}</div>
                      <div className="device-type">Microphone</div>
                    </div>
                    {selectedDevices.microphone?.id === device.id && (
                      <span className="device-selected material-icons">
                        check_circle
                      </span>
                    )}
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="device-selector-footer">
            <button className="button secondary" onClick={onCancel}>
              Cancel
            </button>
            <button
              className="button primary"
              onClick={handleConfirm}
              disabled={!selectedDevices.speaker && !selectedDevices.microphone}
            >
              Start Recording
            </button>
          </div>
        </div>
      </div>
    </Portal>
  );
};

export default DeviceSelector; 