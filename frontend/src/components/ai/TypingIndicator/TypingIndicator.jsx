import React from 'react';

const TypingIndicator = ({ label = 'AI is thinking…' }) => (
  <div className="typing-indicator">
    <div className="typing-indicator-avatar">🤖</div>
    <div className="typing-indicator-bubble">
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-label">{label}</span>
    </div>
  </div>
);

export default TypingIndicator;
