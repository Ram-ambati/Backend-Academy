import React, { useState, useRef, useEffect } from 'react';
import ChatMessage from '../ChatMessage/ChatMessage.jsx';
import TypingIndicator from '../TypingIndicator/TypingIndicator.jsx';
import PromptBox from '../PromptBox/PromptBox.jsx';

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: 'ai',
    content: '👋 Hi! I\'m your AI tutor for Backend Academy. Ask me anything about the current lesson — concepts, code examples, or best practices!',
    timestamp: Date.now() - 60000,
  },
];

const ChatWindow = ({
  user = { initials: 'RA' },
  onSendMessage,       // optional: async (message) => string (AI reply)
}) => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(scrollToBottom, [messages, isTyping]);

  const handleSend = async (text) => {
    const userMsg = { id: Date.now(), role: 'user', content: text, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      let reply = 'Great question! Let me think through that…';
      if (onSendMessage) {
        reply = await onSendMessage(text);
      } else {
        // Demo: echo reply after 1.5s
        await new Promise((r) => setTimeout(r, 1500));
        reply = `Here's what I know about "${text}": This is a placeholder AI response. Connect your RAG backend to get real answers! 🚀`;
      }

      setMessages((prev) => [
        ...prev,
        { id: Date.now() + 1, role: 'ai', content: reply, timestamp: Date.now() },
      ]);
    } finally {
      setIsTyping(false);
    }
  };

  const handleClear = () => setMessages(INITIAL_MESSAGES);

  return (
    <div className="chat-window">
      {/* Header */}
      <div className="chat-window-header">
        <div className="chat-window-avatar">🤖</div>
        <div className="chat-window-info">
          <div className="chat-window-title">AI RAG Tutor</div>
          <div className="chat-window-status">
            <span className="chat-window-status-dot" />
            Online · Ready to help
          </div>
        </div>
        <div className="chat-window-actions">
          <button className="chat-window-action-btn" onClick={handleClear} title="Clear chat">🗑</button>
          <button className="chat-window-action-btn" title="Settings">⚙</button>
        </div>
      </div>

      {/* Messages */}
      <div className="chat-messages">
        {messages.map((msg) => (
          <ChatMessage
            key={msg.id}
            role={msg.role}
            content={msg.content}
            timestamp={msg.timestamp}
            avatarInitials={user.initials}
          />
        ))}
        {isTyping && <TypingIndicator />}
        <div ref={messagesEndRef} />
      </div>

      {/* Prompt */}
      <PromptBox onSend={handleSend} isLoading={isTyping} />
    </div>
  );
};

export default ChatWindow;
