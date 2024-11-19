import React, { useState, useRef, useEffect } from "react";
import { startTranscription } from "../utils/deepgram";

const Transcriber = ({ onBeforeStart }) => {
  const [transcription, setTranscription] = useState("");
  const [isTranscribing, setIsTranscribing] = useState(false);
  const [error, setError] = useState("");
  const transcriptionRef = useRef(null);
  const socketRef = useRef(null);

  useEffect(() => {
    if (transcriptionRef.current) {
      transcriptionRef.current.scrollTop = transcriptionRef.current.scrollHeight;
    }
  }, [transcription]);

  const handleStart = async () => {
    if (onBeforeStart && !onBeforeStart()) {
      return;
    }

    try {
      setError("");
      const deepgramKey = localStorage.getItem("deepgramKey");
      if (!deepgramKey) {
        throw new Error("Deepgram API key not found");
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        audio: true,
        video: false 
      });
      
      setIsTranscribing(true);
      
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
    setIsTranscribing(false);
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
          onClick={() => navigator.clipboard.writeText(transcription)}
          disabled={!transcription}
        >
          <span className="material-icons">content_copy</span>
          Copy
        </button>
      </div>

      <div className="transcription-content" ref={transcriptionRef}>
        {transcription || 'Transcription will appear here...'}
      </div>

      {error && (
        <div className="error-toast">
          <span className="material-icons">error</span>
          {error}
        </div>
      )}
    </div>
  );
};

export default Transcriber;
