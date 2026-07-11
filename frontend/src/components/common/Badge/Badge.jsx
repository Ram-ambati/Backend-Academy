import React from 'react';

const Badge = ({
  children,
  variant = 'gold',   // gold | green | pink | gray | dark | solid-gold | solid-green | solid-pink
  size = '',          // '' | sm | lg
  dot = false,
  className = '',
}) => {
  return (
    <span className={`badge badge--${variant}${size ? ` badge--${size}` : ''} ${className}`}>
      {dot && <span className="badge-dot" />}
      {children}
    </span>
  );
};

export default Badge;
