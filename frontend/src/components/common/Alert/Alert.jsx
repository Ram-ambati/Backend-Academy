import React, { useState } from 'react';
import { Info, CheckCircle, AlertTriangle, XCircle, X } from 'lucide-react';

const ICONS = {
  info:    Info,
  success: CheckCircle,
  warning: AlertTriangle,
  error:   XCircle,
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

  const IconComponent = ICONS[type] || Info;

  return (
    <div className={`alert alert--${type} ${className}`} role="alert">
      <span className="alert-icon"><IconComponent size={16} /></span>
      <div className="alert-content">
        {title && <div className="alert-title">{title}</div>}
        {children && <div className="alert-desc">{children}</div>}
      </div>
      {dismissible && (
        <button className="alert-close" onClick={handleClose} aria-label="Dismiss"><X size={16} /></button>
      )}
    </div>
  );
};

export default Alert;
