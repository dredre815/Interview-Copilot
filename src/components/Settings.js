import React, { useState } from "react";

const Settings = ({ onClose }) => {
  const [deepgramKey, setDeepgramKey] = useState(
    localStorage.getItem("deepgramKey") || ""
  );
  const [chatGPTKey, setChatGPTKey] = useState(
    localStorage.getItem("chatGPTKey") || ""
  );
  const [showKeys, setShowKeys] = useState(false);

  const saveKeys = () => {
    localStorage.setItem("deepgramKey", deepgramKey);
    localStorage.setItem("chatGPTKey", chatGPTKey);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content settings-modal" onClick={e => e.stopPropagation()}>
        <div className="modal-header">
          <div className="modal-title">
            <span className="material-icons">settings</span>
            <h2>API Configuration</h2>
          </div>
          <button className="icon-button" onClick={onClose}>
            <span className="material-icons">close</span>
          </button>
        </div>

        <div className="modal-body">
          <div className="api-section">
            <div className="section-header">
              <span className="material-icons">key</span>
              <h3>Deepgram API Key</h3>
            </div>
            <div className="api-instructions">
              <p>To get your Deepgram API key:</p>
              <ol>
                <li>
                  <a href="https://console.deepgram.com/signup" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="instruction-link">
                    <span className="material-icons">launch</span>
                    Go to Deepgram Console
                  </a>
                </li>
                <li>Create a free account</li>
                <li>Navigate to API Keys section</li>
                <li>Create a new API key</li>
              </ol>
            </div>
            <div className="input-group">
              <input
                type={showKeys ? "text" : "password"}
                value={deepgramKey}
                onChange={(e) => setDeepgramKey(e.target.value)}
                placeholder="Enter your Deepgram API key"
              />
              <button 
                className="icon-button"
                onClick={() => setShowKeys(!showKeys)}
                aria-label={showKeys ? "Hide API key" : "Show API key"}
              >
                <span className="material-icons">
                  {showKeys ? 'visibility_off' : 'visibility'}
                </span>
              </button>
            </div>
          </div>

          <div className="api-section">
            <div className="section-header">
              <span className="material-icons">smart_toy</span>
              <h3>ChatGPT API Key</h3>
            </div>
            <div className="api-instructions">
              <p>To get your OpenAI API key:</p>
              <ol>
                <li>
                  <a href="https://platform.openai.com/signup" 
                     target="_blank" 
                     rel="noopener noreferrer"
                     className="instruction-link">
                    <span className="material-icons">launch</span>
                    Go to OpenAI Platform
                  </a>
                </li>
                <li>Create an account or sign in</li>
                <li>Navigate to API Keys section</li>
                <li>Create a new secret key</li>
              </ol>
            </div>
            <div className="input-group">
              <input
                type={showKeys ? "text" : "password"}
                value={chatGPTKey}
                onChange={(e) => setChatGPTKey(e.target.value)}
                placeholder="Enter your ChatGPT API key"
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="button secondary" onClick={onClose}>Cancel</button>
          <button className="button primary" onClick={saveKeys}>
            <span className="material-icons">save</span>
            Save Keys
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
