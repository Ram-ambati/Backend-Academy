import React from 'react';
import { Bot } from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vscDarkPlus } from 'react-syntax-highlighter/dist/esm/styles/prism';

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
        {isUser ? avatarInitials : <Bot size={18} />}
      </div>

      {/* Bubble */}
      <div className="chat-message-content">
        <div className="chat-message-bubble">
          {isUser ? (
            content
          ) : (
            <div style={{ padding: '4px',borderRadius:'4px' }}>
              <ReactMarkdown
                remarkPlugins={[remarkGfm]}
                components={{
                code({ node, inline, className, children, ...props }) {
                  const match = /language-(\w+)/.exec(className || '');
                  return !inline && match ? (
                    <SyntaxHighlighter
                      {...props}
                      children={String(children).replace(/\n$/, '')}
                      style={vscDarkPlus}
                      language={match[1]}
                      PreTag="div"
                      customStyle={{ borderRadius: '8px', margin: '0.5rem 0' }}
                    />
                  ) : (
                    <code {...props} className={className || ''} style={{ background: 'rgba(0,0,0,0.1)', padding: '2px 4px', borderRadius: '4px', fontSize: '0.9em' }}>
                      {children}
                    </code>
                  );
                },
                h1: ({ children }) => <h1 style={{ fontSize: '1.4rem', margin: '1rem 0 0.5rem', fontWeight: 600 }}>{children}</h1>,
                h2: ({ children }) => <h2 style={{ fontSize: '1.2rem', margin: '1rem 0 0.5rem', fontWeight: 600 }}>{children}</h2>,
                h3: ({ children }) => <h3 style={{ fontSize: '1.1rem', margin: '0.8rem 0 0.4rem', fontWeight: 600 }}>{children}</h3>,
                p: ({ children }) => <p style={{ margin: '0.5rem 0', lineHeight: 1.5 }}>{children}</p>,
                ul: ({ children }) => <ul style={{ marginLeft: '1.5rem', marginBottom: '0.5rem' }}>{children}</ul>,
                ol: ({ children }) => <ol style={{ marginLeft: '1.5rem', marginBottom: '0.5rem' }}>{children}</ol>,
                li: ({ children }) => <li style={{ margin: '0.25rem 0' }}>{children}</li>,
                a: ({ children, href }) => <a href={href} target="_blank" rel="noopener noreferrer" style={{ color: 'var(--primary-color)', textDecoration: 'underline' }}>{children}</a>,
              }}
            >
              {content}
              </ReactMarkdown>
            </div>
          )}
        </div>
        {time && <div className="chat-message-time">{time}</div>}
      </div>
    </div>
  );
};

export default ChatMessage;
