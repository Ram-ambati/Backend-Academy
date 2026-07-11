import React, { useState } from 'react';

const ICONS = {
  info:    'ℹ️',
  success: '✅',
  warning: '⚠️',
  error:   '❌',
};

const Alert = ({
  type = 'info',    // info | success | warning | error
  title = '',
  children,
  dismissible = false,
  onDismiss,
  className = '',
}) => {
  const [visible, setVisible] = useState(true);

  if (!visible) return null;

  const handleClose = () => {
    setVisible(false);
    onDismiss?.();
  };

  return (
    <div className={`alert alert--${type} ${className}`} role="alert">
      <span className="alert-icon">{ICONS[type]}</span>
      <div className="alert-content">
        {title && <div className="alert-title">{title}</div>}
        {children && <div className="alert-desc">{children}</div>}
      </div>
      {dismissible && (
        <button className="alert-close" onClick={handleClose} aria-label="Dismiss">✕</button>
      )}
    </div>
  );
};

export default Alert;
