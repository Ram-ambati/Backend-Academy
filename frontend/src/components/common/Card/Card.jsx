import React from 'react';

const Card = ({
  children,
  title,
  subtitle,
  headerRight,
  footer,
  variant = '',       // '' | gold | green | pink
  hoverable = false,
  className = '',
  bodyPadding = true,
}) => {
  const variantClass = variant ? ` card--${variant}` : '';
  const hoverClass = hoverable ? ' card--hoverable' : '';

  const hasHeader = title || subtitle || headerRight;

  return (
    <div className={`card${variantClass}${hoverClass} ${className}`}>
      {hasHeader && (
        <div className="card-header">
          <div>
            {title && <div className="card-title">{title}</div>}
            {subtitle && <div className="card-subtitle">{subtitle}</div>}
          </div>
          {headerRight && <div>{headerRight}</div>}
        </div>
      )}

      <div className={`card-body${!bodyPadding ? ' card-body--no-pad' : ''}`}>
        {children}
      </div>

      {footer && <div className="card-footer">{footer}</div>}
    </div>
  );
};

export default Card;
