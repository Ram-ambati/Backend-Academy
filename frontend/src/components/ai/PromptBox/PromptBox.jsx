import React, { useState, useRef } from 'react';
import { Send, Loader2 } from 'lucide-react';

const SUGGESTIONS = [
  'Explain this concept',
  'Show me an example',
  'Why does this work?',
  'What are best practices?',
];

const PromptBox = ({
  onSend,
  isLoading = false,
  placeholder = 'Ask the AI tutor anything...',
  showSuggestions = true,
}) => {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed || isLoading) return;
    onSend?.(trimmed);
    setValue('');
    textareaRef.current?.focus();
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  const handleSuggestion = (text) => {
    setValue(text);
    textareaRef.current?.focus();
  };

  // Auto-resize textarea
  const handleInput = (e) => {
    setValue(e.target.value);
    e.target.style.height = 'auto';
    e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
  };

  return (
    <div className="prompt-box">
      {showSuggestions && !value && (
        <div className="prompt-box-suggestions">
          {SUGGESTIONS.map((s) => (
            <button
              key={s}
              className="prompt-suggestion-btn"
              onClick={() => handleSuggestion(s)}
            >
              {s}
            </button>
          ))}
        </div>
      )}

      <div className="prompt-box-form">
        <textarea
          ref={textareaRef}
          className="prompt-box-textarea"
          placeholder={placeholder}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          rows={1}
          disabled={isLoading}
          aria-label="Message input"
        />
        <div className="prompt-box-actions">
          <button
            className="prompt-box-send"
            onClick={handleSend}
            disabled={!value.trim() || isLoading}
            aria-label="Send message"
            title="Send (Enter)"
          >
            {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Send size={18} />}
          </button>
        </div>
      </div>
      <div className="prompt-box-hint">Enter to send · Shift+Enter for new line</div>
    </div>
  );
};

export default PromptBox;
