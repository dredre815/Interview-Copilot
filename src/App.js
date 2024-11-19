import React, { useState, useEffect, useRef } from "react";
import Navigation from "./components/Navigation";
import Transcriber from "./components/Transcriber";
import ChatGPTInterface from "./components/ChatGPTInterface";
import Settings from "./components/Settings";

const App = () => {
  const [error, setError] = useState("");
  const [showSettings, setShowSettings] = useState(false);
  const [theme, setTheme] = useState('light');
  const sendToAssistant = useRef(null);

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light');
  };

  const checkApiKeys = () => {
    const deepgramKey = localStorage.getItem("deepgramKey");
    const chatGPTKey = localStorage.getItem("chatGPTKey");
    
    if (!deepgramKey || !chatGPTKey) {
      setError("Please configure your API keys in Settings first");
      setShowSettings(true);
      return false;
    }
    setError("");
    return true;
  };

  const handleSendToChat = (text) => {
    if (sendToAssistant.current) {
      sendToAssistant.current.sendMessage(text);
    }
  };

  return (
    <div className="app-wrapper">
      <Navigation 
        currentTheme={theme}
        onThemeToggle={toggleTheme}
        onSettingsClick={() => setShowSettings(true)}
      />
      
      <main className="main-content">
        <div className="panel transcription-panel">
          <div className="panel-header">
            <h2>
              <span className="material-icons">record_voice_over</span>
              Real-time Transcription
            </h2>
          </div>
          <Transcriber 
            onBeforeStart={checkApiKeys} 
            onSendToChat={handleSendToChat} 
          />
        </div>
        
        <div className="panel chat-panel">
          <div className="panel-header">
            <h2>
              <span className="material-icons">smart_toy</span>
              AI Assistant
            </h2>
          </div>
          <ChatGPTInterface ref={sendToAssistant} />
        </div>
      </main>
      
      {showSettings && <Settings onClose={() => setShowSettings(false)} />}
      
      {error && (
        <div className="error-toast" role="alert">
          <span className="material-icons">error</span>
          {error}
          <button 
            className="toast-close"
            onClick={() => setError("")}
            aria-label="Close error message"
          >
            <span className="material-icons">close</span>
          </button>
        </div>
      )}
    </div>
  );
};

export default App;
