import React from 'react';

const Spinner = ({
  size = 'md',      // xs | sm | md | lg | xl
  color = 'gold',   // gold | green | pink | gray | white
  label = '',
  className = '',
}) => {
  if (label) {
    return (
      <div className={`spinner-wrapper ${className}`}>
        <div className={`spinner spinner--${size} spinner--${color}`} role="status" aria-label="Loading" />
        <span className="spinner-label">{label}</span>
      </div>
    );
  }

  return (
    <div
      className={`spinner spinner--${size} spinner--${color} ${className}`}
      role="status"
      aria-label="Loading"
    />
  );
};

export default Spinner;
