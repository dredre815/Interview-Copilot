import React, { useState, useRef, useEffect } from "react";
import { startTranscription, getAudioStream } from "../utils/deepgram";
import DeviceSelector from "./DeviceSelector";

const Transcriber = ({ onBeforeStart }) => {
  const [transcription, setTranscription] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState("");
  const [showDeviceSelector, setShowDeviceSelector] = useState(false);
  const transcriptionRef = useRef(null);
  const socketRef = useRef(null);
  const [selectedText, setSelectedText] = useState("");
  const cleanupRef = useRef(null);

  useEffect(() => {
    if (transcriptionRef.current) {
      transcriptionRef.current.scrollTop = transcriptionRef.current.scrollHeight;
    }
  }, [transcription]);

  const handleStart = async () => {
    if (onBeforeStart && !onBeforeStart()) {
      return;
    }
    setShowDeviceSelector(true);
  };

  const handleDeviceSelect = async (device) => {
    try {
      setError("");
      setShowDeviceSelector(false);
      
      const deepgramKey = localStorage.getItem("deepgramKey");
      if (!deepgramKey) {
        throw new Error("Deepgram API key not found");
      }

      const { stream, cleanup } = await getAudioStream(device);
      setIsTranscribing(true);
      cleanupRef.current = cleanup;

      socketRef.current = await startTranscription(
        deepgramKey,
        stream,
        (text) => setTranscription(prev => prev + " " + text)
      );
    } catch (error) {
      console.error("Error starting transcription:", error);
      setError(error.message);
      setIsTranscribing(false);
    }
  };

  const handleStop = () => {
    if (socketRef.current) {
      socketRef.current.close();
      socketRef.current = null;
    }
    
    if (cleanupRef.current) {
      cleanupRef.current();
      cleanupRef.current = null;
    }
    
    setIsTranscribing(false);
  };

  const handleTextSelection = () => {
    const selection = window.getSelection();
    const selectedText = selection.toString();
    if (selectedText) {
      setSelectedText(selectedText);
    }
  };

  const sendToChat = () => {
    // 实现发送选中文本到聊天框的功能
  };

  return (
    <div className="transcription-panel">
      <div className="transcription-controls">
        <button 
          className={`record-button ${isTranscribing ? 'recording' : ''}`}
          onClick={isTranscribing ? handleStop : handleStart}
        >
          <span className="material-icons">
            {isTranscribing ? 'stop_circle' : 'mic'}
          </span>
          {isTranscribing ? 'Stop Recording' : 'Start Recording'}
        </button>
        
        <button 
          className="button secondary"
          onClick={() => setTranscription('')}
          disabled={!transcription}
        >
          <span className="material-icons">delete</span>
          Clear
        </button>
        
        <button 
          className="button secondary"
          onClick={() => navigator.clipboard.writeText(selectedText || transcription)}
          disabled={!transcription}
        >
          <span className="material-icons">content_copy</span>
          Copy Selected
        </button>
        
        <button 
          className="button primary"
          onClick={sendToChat}
          disabled={!selectedText}
        >
          <span className="material-icons">send</span>
          Send to Chat
        </button>
      </div>

      <div 
        className="transcription-content" 
        ref={transcriptionRef}
        onMouseUp={handleTextSelection}
      >
        {transcription || 'Transcription will appear here...'}
      </div>

      {error && (
        <div className="error-toast">
          <span className="material-icons">error</span>
          {error}
        </div>
      )}

      {showDeviceSelector && (
        <DeviceSelector
          onSelect={handleDeviceSelect}
          onCancel={() => setShowDeviceSelector(false)}
        />
      )}
    </div>
  );
};

export default Transcriber;
