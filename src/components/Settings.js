import React, { useState } from "react";

const Settings = ({ onClose }) => {
  const [deepgramKey, setDeepgramKey] = useState(
    localStorage.getItem("deepgramKey") || ""
  );
  const [chatGPTKey, setChatGPTKey] = useState(
    localStorage.getItem("chatGPTKey") || ""
  );

  const saveKeys = () => {
    localStorage.setItem("deepgramKey", deepgramKey);
    localStorage.setItem("chatGPTKey", chatGPTKey);
    onClose();
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={e => e.stopPropagation()}>
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
                type="password"
                value={deepgramKey}
                onChange={(e) => setDeepgramKey(e.target.value)}
                placeholder="Enter your Deepgram API key"
                autoComplete="off"
              />
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
                type="password"
                value={chatGPTKey}
                onChange={(e) => setChatGPTKey(e.target.value)}
                placeholder="Enter your ChatGPT API key"
                autoComplete="off"
              />
            </div>
          </div>
        </div>

        <div className="modal-footer">
          <button className="cancel-button" onClick={onClose}>
            Cancel
          </button>
          <button className="save-button" onClick={saveKeys}>
            Save Keys
          </button>
        </div>
      </div>
    </div>
  );
};

export default Settings;
