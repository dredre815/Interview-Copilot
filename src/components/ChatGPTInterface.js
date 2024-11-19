import React, { useState, useRef, useEffect } from "react";
import { askChatGPT } from "../utils/chatgpt";

const ChatGPTInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSubmit = async () => {
    if (!input.trim() || isLoading) return;

    const newMessage = { type: 'user', content: input };
    setMessages(prev => [...prev, newMessage]);
    setInput("");
    setIsLoading(true);

    try {
      const response = await askChatGPT(localStorage.getItem("chatGPTKey"), input);
      setMessages(prev => [...prev, { type: 'ai', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { type: 'error', content: error.message }]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <div className="chat-panel">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            <div className="message-header">
              <span>{message.type === 'ai' ? '🤖 AI' : '👤 You'}</span>
              <div className="message-actions">
                <button className="icon-button" onClick={() => navigator.clipboard.writeText(message.content)}>
                  <span className="material-icons">content_copy</span>
                </button>
              </div>
            </div>
            <div className="message-content">{message.content}</div>
          </div>
        ))}
        {isLoading && (
          <div className="message ai loading">
            <div className="typing-indicator">
              <span></span>
              <span></span>
              <span></span>
            </div>
          </div>
        )}
        <div ref={messagesEndRef} />
      </div>
      
      <div className="chat-input">
        <div className="input-wrapper">
          <textarea
            className="chat-textarea"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Type your message or paste transcription here..."
          />
          <button 
            className="send-button"
            onClick={handleSubmit}
            disabled={isLoading || !input.trim()}
          >
            <span className="material-icons">send</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatGPTInterface;
