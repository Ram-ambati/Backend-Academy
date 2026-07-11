import React, { useState } from 'react';

/**
 * Applies basic syntax color classes to common patterns.
 * For production, use Prism.js or highlight.js.
 */
const tokenize = (code, lang) => {
  if (!lang || lang === 'text') return code;

  return code
    // Comments
    .replace(/(\/\/[^\n]*|\/\*[\s\S]*?\*\/|#[^\n]*)/g, '<span class="tok-comment">$1</span>')
    // Strings
    .replace(/(["'`])(?:(?!\1)[^\\]|\\.)*\1/g, '<span class="tok-string">$&</span>')
    // Keywords
    .replace(/\b(import|export|from|const|let|var|function|class|return|if|else|for|while|do|switch|case|break|continue|new|this|async|await|try|catch|finally|throw|typeof|instanceof|void|delete|in|of|true|false|null|undefined|public|private|protected|static|final|void|int|String|boolean|long|double|float|extends|implements|interface|package|abstract|@Bean|@Service|@Repository|@Controller|@Autowired|@Override|@Entity)\b/g, '<span class="tok-keyword">$1</span>')
    // Numbers
    .replace(/\b(\d+\.?\d*)\b/g, '<span class="tok-number">$1</span>');
};

const CodeSnippet = ({
  code = '',
  language = 'java',
  filename = '',
  showLineNumbers = true,
  showCopy = true,
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      // fallback
      const ta = document.createElement('textarea');
      ta.value = code;
      document.body.appendChild(ta);
      ta.select();
      document.execCommand('copy');
      document.body.removeChild(ta);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const lines = code.split('\n');
  const highlighted = tokenize(code, language);

  return (
    <div className="code-snippet">
      {/* Header */}
      <div className="code-snippet-header">
        <div className="code-snippet-dots">
          <span className="code-snippet-dot code-snippet-dot--red" />
          <span className="code-snippet-dot code-snippet-dot--yellow" />
          <span className="code-snippet-dot code-snippet-dot--green" />
        </div>

        <span className="code-snippet-lang">
          {filename || language}
        </span>

        {showCopy && (
          <button
            className={`code-snippet-copy${copied ? ' copied' : ''}`}
            onClick={handleCopy}
          >
            {copied ? '✓ Copied!' : '⧉ Copy'}
          </button>
        )}
      </div>

      {/* Body */}
      <div className="code-snippet-body">
        <pre className="code-snippet-pre">
          {showLineNumbers && (
            <div className="code-snippet-line-numbers">
              {lines.map((_, i) => (
                <span key={i} className="code-snippet-line-num">{i + 1}</span>
              ))}
            </div>
          )}
          <code
            className="code-snippet-code"
            dangerouslySetInnerHTML={{ __html: highlighted }}
          />
        </pre>
      </div>
    </div>
  );
};

export default CodeSnippet;
