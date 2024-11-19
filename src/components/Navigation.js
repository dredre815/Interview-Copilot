import React from "react";
import "../styles/components.css";

const Navigation = ({ onSettingsClick, onThemeToggle, currentTheme }) => {
  return (
    <nav className="navigation">
      <div className="nav-content">
        <div className="nav-brand">
          <span className="material-icons">assistant</span>
          <h1>Interview Copilot</h1>
        </div>
        <div className="nav-actions">
          <button 
            onClick={onThemeToggle} 
            className="nav-button"
            aria-label="Toggle theme"
          >
            <span className="material-icons">
              {currentTheme === 'light' ? 'dark_mode' : 'light_mode'}
            </span>
            <span className="button-text">
              {currentTheme === 'light' ? 'Dark' : 'Light'}
            </span>
          </button>
          <button 
            onClick={onSettingsClick} 
            className="nav-button"
            aria-label="Open settings"
          >
            <span className="material-icons">settings</span>
            <span className="button-text">Settings</span>
          </button>
        </div>
      </div>
    </nav>
  );
};

export default Navigation;
