import React from 'react';
import { Bot } from 'lucide-react';

const TypingIndicator = ({ label = 'AI is thinking...' }) => (
  <div className="typing-indicator">
    <div className="typing-indicator-avatar"><Bot size={16} /></div>
    <div className="typing-indicator-bubble">
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-dot" />
      <span className="typing-label">{label}</span>
    </div>
  </div>
);

export default TypingIndicator;
