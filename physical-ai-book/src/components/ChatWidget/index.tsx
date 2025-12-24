import React, { useState, useRef, useEffect } from 'react';
import styles from './styles.module.css';

interface Message {
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
  sources?: Array<{
    chapter: string;
    section?: string;
    snippet: string;
  }>;
}

interface ChatWidgetProps {
  apiEndpoint?: string;
}

export default function ChatWidget({ apiEndpoint = 'http://localhost:8000/api/chatbot/query' }: ChatWidgetProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const sendMessage = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage: Message = {
      role: 'user',
      content: input,
      timestamp: new Date()
    };

    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);

    try {
      const response = await fetch(apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          query: input
        })
      });

      const data = await response.json();

      if (data.success && data.data) {
        const assistantMessage: Message = {
          role: 'assistant',
          content: data.data.response_text || data.error || 'No response available',
          timestamp: new Date(),
          sources: data.data.retrieved_chunks?.map((chunk: any) => ({
            chapter: chunk.chapter_title || 'Unknown',
            section: chunk.section_heading,
            snippet: chunk.snippet || chunk.text?.substring(0, 200) || ''
          }))
        };
        setMessages(prev => [...prev, assistantMessage]);
      } else {
        throw new Error(data.error || 'Failed to get response');
      }
    } catch (error) {
      const errorMessage: Message = {
        role: 'assistant',
        content: `Error: ${error.message}. Please try again.`,
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  return (
    <>
      {/* Chat Toggle Button */}
      <button
        className={styles.chatToggle}
        onClick={() => setIsOpen(!isOpen)}
        aria-label="Toggle chat widget"
      >
        {isOpen ? '✕' : '💬'}
      </button>

      {/* Chat Widget */}
      {isOpen && (
        <div className={styles.chatWidget}>
          <div className={styles.chatHeader}>
            <h3>Physical AI Assistant</h3>
            <button
              className={styles.closeButton}
              onClick={() => setIsOpen(false)}
              aria-label="Close chat"
            >
              ✕
            </button>
          </div>

          <div className={styles.chatMessages}>
            {messages.length === 0 && (
              <div className={styles.welcomeMessage}>
                <p>👋 Welcome! Ask me anything about Physical AI and Humanoid Robotics.</p>
                <p className={styles.exampleQuestions}>
                  Try: "What is ROS 2?" or "Explain VSLAM"
                </p>
              </div>
            )}

            {messages.map((msg, idx) => (
              <div
                key={idx}
                className={`${styles.message} ${styles[msg.role]}`}
              >
                <div className={styles.messageContent}>
                  {msg.content}
                </div>
                {msg.sources && msg.sources.length > 0 && (
                  <div className={styles.sources}>
                    <details>
                      <summary>Sources ({msg.sources.length})</summary>
                      <ul>
                        {msg.sources.map((source, i) => (
                          <li key={i}>
                            <strong>{source.chapter}</strong>
                            {source.section && ` - ${source.section}`}
                            <br />
                            <span className={styles.snippet}>{source.snippet}</span>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </div>
                )}
                <div className={styles.timestamp}>
                  {msg.timestamp.toLocaleTimeString()}
                </div>
              </div>
            ))}

            {isLoading && (
              <div className={`${styles.message} ${styles.assistant}`}>
                <div className={styles.messageContent}>
                  <span className={styles.typing}>Thinking...</span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          <div className={styles.chatInput}>
            <textarea
              value={input}
              onChange={(e) => setInput(e.target.value)}
              onKeyPress={handleKeyPress}
              placeholder="Ask a question..."
              rows={2}
              disabled={isLoading}
            />
            <button
              onClick={sendMessage}
              disabled={isLoading || !input.trim()}
              aria-label="Send message"
            >
              {isLoading ? '⏳' : '➤'}
            </button>
          </div>
        </div>
      )}
    </>
  );
}
