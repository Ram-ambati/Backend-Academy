import React from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { vs } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { AlertCircle, Lightbulb, Info, AlertTriangle, ShieldAlert } from 'lucide-react';
import './MarkdownViewer.css';

const MarkdownViewer = ({ content = '', className = '' }) => {
  return (
    <div className={`markdown-viewer ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          code({ node, inline, className, children, ...props }) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                style={vs}
                language={match[1]}
                PreTag="div"
                className="markdown-code-block"
                {...props}
              >
                {String(children).replace(/\n$/, '')}
              </SyntaxHighlighter>
            ) : (
              <code className={`markdown-inline-code ${className || ''}`} {...props}>
                {children}
              </code>
            );
          },
          blockquote({ node, children, ...props }) {
            // Check for GitHub style alerts: [!NOTE], [!TIP], [!IMPORTANT], [!WARNING], [!CAUTION]
            let isAlert = false;
            let alertType = '';
            let alertContent = children;

            if (
              node.children && 
              node.children.length > 0 && 
              node.children[0].type === 'paragraph' && 
              node.children[0].children && 
              node.children[0].children.length > 0
            ) {
              const firstChild = node.children[0].children[0];
              if (firstChild.type === 'text' && firstChild.value) {
                const match = firstChild.value.match(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i);
                if (match) {
                  isAlert = true;
                  alertType = match[1].toLowerCase();
                  
                  // Clone the children but remove the alert tag from the first text node
                  const cleanChildren = React.Children.map(children, (child, index) => {
                    if (index === 0 && React.isValidElement(child)) {
                      // We need to carefully strip the [!ALERT] tag from the first paragraph
                      return React.cloneElement(child, {}, React.Children.map(child.props.children, (textChild, tIndex) => {
                         if (tIndex === 0 && typeof textChild === 'string') {
                           return textChild.replace(/^\[!(NOTE|TIP|IMPORTANT|WARNING|CAUTION)\]/i, '').trim();
                         }
                         return textChild;
                      }));
                    }
                    return child;
                  });
                  alertContent = cleanChildren;
                }
              }
            }

            if (isAlert) {
              const alertStyles = {
                note: { icon: <Info size={20} />, color: 'var(--blue)' },
                tip: { icon: <Lightbulb size={20} />, color: 'var(--green)' },
                important: { icon: <AlertCircle size={20} />, color: 'var(--gold)' },
                warning: { icon: <AlertTriangle size={20} />, color: 'var(--orange)' },
                caution: { icon: <ShieldAlert size={20} />, color: 'var(--red)' }
              };
              
              const style = alertStyles[alertType] || alertStyles.note;
              
              return (
                <div className={`markdown-alert markdown-alert-${alertType}`}>
                  <div className="markdown-alert-header" style={{ color: style.color }}>
                    {style.icon}
                    <span>{alertType.charAt(0).toUpperCase() + alertType.slice(1)}</span>
                  </div>
                  <div className="markdown-alert-content">
                    {alertContent}
                  </div>
                </div>
              );
            }
            
            return <blockquote {...props}>{children}</blockquote>;
          }
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  );
};

export default MarkdownViewer;
