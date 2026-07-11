import React from 'react';

const ChatMessage = ({
  role = 'ai',      // 'ai' | 'user'
  content = '',
  timestamp = null,
  avatarInitials = 'AI',
}) => {
  const isUser = role === 'user';
  const time = timestamp
    ? new Date(timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    : '';

  return (
    <div className={`chat-message chat-message--${isUser ? 'user' : 'ai'}`}>
      {/* Avatar */}
      <div className="chat-message-avatar">
        {isUser ? avatarInitials : '🤖'}
      </div>

      {/* Bubble */}
      <div className="chat-message-content">
        <div className="chat-message-bubble">{content}</div>
        {time && <div className="chat-message-time">{time}</div>}
      </div>
    </div>
  );
};

export default ChatMessage;
