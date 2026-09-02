import React, { useState, useRef, useEffect } from 'react';
import { Bot, Trash2, Settings, ChevronRight } from 'lucide-react';
import ChatMessage from '../ChatMessage/ChatMessage.jsx';
import TypingIndicator from '../TypingIndicator/TypingIndicator.jsx';
import PromptBox from '../PromptBox/PromptBox.jsx';
import { askAiTutor } from '../../../api/ai.api';

const INITIAL_MESSAGES = [];

const ChatWindow = ({
  user,
  courseId,
  lessonTitle,
  onSendMessage,       // optional: async (message) => string (AI reply)
  onClose,             // optional: callback to collapse the window
}) => {
  const [messages, setMessages] = useState(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const chatContainerRef = useRef(null);

  const firstName = user?.name ? user.name.split(' ')[0] : 'Student';
  const userInitials = user?.initials || user?.name?.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() || 'ME';

  /* Scroll ONLY internal chat container on message update, NOT window */
  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    const handleClear = () => setMessages([]);
    window.addEventListener('clearAiChat', handleClear);
    return () => window.removeEventListener('clearAiChat', handleClear);
  }, []);

  const handleSend = async (text) => {
    const userMsg = { id: Date.now(), role: 'user', content: text, timestamp: Date.now() };
    setMessages((prev) => [...prev, userMsg]);
    setIsTyping(true);

    try {
      let reply = 'Great question! Let me think through that...';
      if (onSendMessage) {
        reply = await onSendMessage(text);
      } else {
        try {
          // Send the last 6 messages as history to give the AI context
          const history = messages.slice(-6).map(m => ({ role: m.role, content: m.content }));
          const res = await askAiTutor(text, courseId, lessonTitle, history);
          reply = res.answer;
        } catch (err) {
          console.error('AI Error:', err);
          reply = 'Sorry, I am having trouble connecting to my brain right now. Please try again later.';
        }
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
          <div className="chat-window-title">Nexus AI Tutor</div>
          <div className="chat-window-status">
            <span className="chat-window-status-dot" />
            Online · Ready to help
          </div>
        </div>
        <div className="chat-window-actions">
          <button className="chat-window-action-btn" onClick={handleClear} title="Clear chat"><Trash2 size={16} /></button>
          <button className="chat-window-action-btn" title="Settings"><Settings size={16} /></button>
          {onClose && (
            <button className="chat-window-action-btn" onClick={onClose} title="Collapse AI"><ChevronRight size={16} /></button>
          )}
        </div>
      </div>

      {/* Messages / Empty State */}
      {messages.length === 0 ? (
        <div style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 600, color: 'var(--text-dark)', marginBottom: '2rem' }}>
            Hey {firstName}. Ready to dive in?
          </h2>
          <div style={{ width: '100%', maxWidth: '768px' }}>
            <PromptBox onSend={handleSend} isLoading={isTyping} />
          </div>
        </div>
      ) : (
        <div className="chat-messages" ref={chatContainerRef}>
          {messages.map((msg) => (
            <ChatMessage
              key={msg.id}
              role={msg.role}
              content={msg.content}
              timestamp={msg.timestamp}
              avatarInitials={userInitials}
            />
          ))}
          {isTyping && <TypingIndicator />}
        </div>
      )}

      {/* Prompt (Bottom) */}
      {messages.length > 0 && (
        <PromptBox onSend={handleSend} isLoading={isTyping} />
      )}
    </div>
  );
};

export default ChatWindow;
