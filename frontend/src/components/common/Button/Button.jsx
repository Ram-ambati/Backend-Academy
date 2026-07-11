import React from 'react';

const Button = ({
  children,
  variant = 'primary',   // primary | secondary | danger | outline-gold | outline-green | outline-pink | ghost
  size = 'md',           // xs | sm | md | lg | xl
  isLoading = false,
  disabled = false,
  icon = null,
  iconRight = null,
  onClick,
  type = 'button',
  className = '',
  ...rest
}) => {
  return (
    <button
      type={type}
      className={`btn btn--${variant} btn--${size}${isLoading ? ' btn--loading' : ''} ${className}`}
      disabled={disabled || isLoading}
      onClick={onClick}
      {...rest}
    >
      {isLoading ? (
        <span className="btn-spinner" />
      ) : (
        icon && <span className="btn-icon-left">{icon}</span>
      )}
      {children}
      {!isLoading && iconRight && <span className="btn-icon-right">{iconRight}</span>}
    </button>
  );
};

export default Button;
