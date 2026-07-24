import React, { useState, useRef, useEffect } from 'react';
import { Bot, Trash2, Settings } from 'lucide-react';
import ChatMessage from '../ChatMessage/ChatMessage.jsx';
import TypingIndicator from '../TypingIndicator/TypingIndicator.jsx';
import PromptBox from '../PromptBox/PromptBox.jsx';

const INITIAL_MESSAGES = [
  {
    id: 1,
    role: 'ai',
    content: 'Hi! I\'m your AI tutor for Backend Academy. Ask me anything about the current lesson — concepts, code examples, or best practices!',
    timestamp: Date.now() - 60000,
  },
];

const ChatWindow = ({
  user = { initials: 'RA' },
  onSendMessage,       // optional: async (message) => string (AI reply)
}) => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);

  /* Scroll ONLY internal chat container on message update, NOT window */
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  const handleSend = async (text) => {
    const userMsg = { id: Date.now(), role: 'user', content: text, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      let reply = 'Great question! Let me think through that...';
      if (onSendMessage) {
        reply = await onSendMessage(text);
      } else {
        // Demo: echo reply after 1.5s
        await new Promise((r) => setTimeout(r, 1500));
        reply = `Here's what I know about "${text}": This is a placeholder AI response. Connect your RAG backend to get real answers!`;
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
        <div className="chat-window-avatar"><Bot size={20} /></div>
        <div className="chat-window-info">
          <div className="chat-window-title">AI RAG Tutor</div>
          <div className="chat-window-status">
            <span className="chat-window-status-dot" />
            Online · Ready to help
          </div>
        </div>
        <div className="chat-window-actions">
          <button className="chat-window-action-btn" onClick={handleClear} title="Clear chat"><Trash2 size={16} /></button>
          <button className="chat-window-action-btn" title="Settings"><Settings size={16} /></button>
        </div>
      </div>

      {/* Messages (Internal Scroll Container) */}
      <div className="chat-messages" ref={chatContainerRef}>
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
      </div>

      {/* Prompt */}
      <PromptBox onSend={handleSend} isLoading={isTyping} />
    </div>
  );
};

export default ChatWindow;
