import React from 'react';

const ProgressBar = ({
  value = 0,       // 0–100
  label = '',
  showValue = true,
  size = 'md',     // sm | md | lg
  color = 'gold',  // gold | green | pink
  animated = true,
}) => {
  const clamped = Math.min(100, Math.max(0, value));

  return (
    <div className="progress-bar">
      {(label || showValue) && (
        <div className="progress-bar-header">
          {label && <span className="progress-bar-label">{label}</span>}
          {showValue && <span className="progress-bar-value">{clamped}%</span>}
        </div>
      )}
      <div className={`progress-bar-track progress-bar-track--${size}`}>
        <div
          className={`progress-bar-fill progress-bar-fill--${color}`}
          style={{ width: `${clamped}%` }}
          role="progressbar"
          aria-valuenow={clamped}
          aria-valuemin={0}
          aria-valuemax={100}
        />
      </div>
    </div>
  );
};

export default ProgressBar;
