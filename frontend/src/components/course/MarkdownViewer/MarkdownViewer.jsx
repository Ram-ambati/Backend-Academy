import React from 'react';

/**
 * Lightweight MarkdownViewer — converts basic markdown to HTML.
 * For production, replace the parser with 'marked' or 'react-markdown'.
 */
const parseMarkdown = (md) => {
  if (!md) return '';
  return md
    // headings
    .replace(/^#{6}\s+(.+)$/gm, '<h6>$1</h6>')
    .replace(/^#{5}\s+(.+)$/gm, '<h5>$1</h5>')
    .replace(/^#{4}\s+(.+)$/gm, '<h4>$1</h4>')
    .replace(/^#{3}\s+(.+)$/gm, '<h3>$1</h3>')
    .replace(/^#{2}\s+(.+)$/gm, '<h2>$1</h2>')
    .replace(/^#\s+(.+)$/gm,    '<h1>$1</h1>')
    // horizontal rule
    .replace(/^[-*_]{3,}$/gm, '<hr />')
    // blockquote
    .replace(/^>\s+(.+)$/gm, '<blockquote>$1</blockquote>')
    // bold + italic
    .replace(/\*\*\*(.+?)\*\*\*/g, '<strong><em>$1</em></strong>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    // inline code
    .replace(/`([^`]+)`/g, '<code>$1</code>')
    // links
    .replace(/\[(.+?)\]\((.+?)\)/g, '<a href="$2" target="_blank" rel="noopener noreferrer">$1</a>')
    // images
    .replace(/!\[(.+?)\]\((.+?)\)/g, '<img src="$2" alt="$1" />')
    // unordered list
    .replace(/^\s*[-*+]\s+(.+)$/gm, '<li>$1</li>')
    .replace(/(<li>.*<\/li>(\n|$))+/g, '<ul>$&</ul>')
    // ordered list
    .replace(/^\s*\d+\.\s+(.+)$/gm, '<li>$1</li>')
    // paragraphs (blank line separated)
    .replace(/\n{2,}/g, '</p><p>')
    .replace(/^(?!<[a-z])/, '<p>')
    .replace(/$(?!<\/[a-z])/, '</p>');
};

const MarkdownViewer = ({ content = '', className = '' }) => {
  const html = parseMarkdown(content);

  return (
    <div
      className={`markdown-viewer ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
};

export default MarkdownViewer;
