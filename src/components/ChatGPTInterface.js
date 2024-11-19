import React, { useState, useRef, useEffect, forwardRef, useImperativeHandle } from "react";
import { askChatGPT } from "../utils/chatgpt";
import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

const ChatGPTInterface = forwardRef((props, ref) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  useImperativeHandle(ref, () => ({
    sendMessage: (text) => {
      if (!text.trim()) return;
      
      // Set the input text
      setInput(text);
      
      // Trigger the submit
      handleSubmit(null, text);
    }
  }));

  const handleSubmit = async (e, textOverride = null) => {
    e?.preventDefault();
    const text = textOverride || input;
    
    if (!text.trim() || isLoading) return;

    const newMessage = { type: 'user', content: text };
    setMessages(prev => [...prev, newMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await askChatGPT(localStorage.getItem("chatGPTKey"), text);
      setMessages(prev => [...prev, { type: 'ai', content: response }]);
    } catch (error) {
      setMessages(prev => [...prev, { type: 'error', content: error.message }]);
    } finally {
      setIsLoading(false);
    }
  };

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      props.sendMessage(input);
    }
  };

  return (
    <div className="chat-panel">
      <div className="chat-messages">
        {messages.map((message, index) => (
          <div key={index} className={`message ${message.type}`}>
            <div className="message-header">
              {message.type === 'ai' ? (
                <>
                  <span className="material-icons">smart_toy</span>
                  Assistant
                </>
              ) : (
                <>
                  <span className="material-icons">person</span>
                  You
                </>
              )}
            </div>
            <div className="message-content">
              {message.type === 'ai' ? (
                <ReactMarkdown
                  components={{
                    code({node, inline, className, children, ...props}) {
                      const match = /language-(\w+)/.exec(className || '');
                      return !inline && match ? (
                        <SyntaxHighlighter
                          style={oneDark}
                          language={match[1]}
                          PreTag="div"
                          {...props}
                        >
                          {String(children).replace(/\n$/, '')}
                        </SyntaxHighlighter>
                      ) : (
                        <code className={className} {...props}>
                          {children}
                        </code>
                      )
                    }
                  }}
                >
                  {message.content}
                </ReactMarkdown>
              ) : (
                message.content
              )}
            </div>
          </div>
        ))}
        {isLoading && (
          <div className="message ai">
            <div className="message-header">
              <span className="material-icons">smart_toy</span>
              Assistant
            </div>
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
            placeholder="Message ChatGPT..."
            rows={1}
            onInput={(e) => {
              e.target.style.height = 'auto';
              e.target.style.height = Math.min(e.target.scrollHeight, 200) + 'px';
            }}
          />
          <button 
            className="send-button"
            onClick={props.sendMessage}
            disabled={isLoading || !input.trim()}
            title="Send message"
          >
            <span className="material-icons">
              {isLoading ? 'hourglass_empty' : 'send'}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
});

export default ChatGPTInterface;
