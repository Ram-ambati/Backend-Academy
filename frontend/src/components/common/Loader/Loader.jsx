import React from 'react';

const Loader = ({ rows = 3 }) => {
  return (
    <div className="loader-page">
      {/* Top header skeleton */}
      <div className="skeleton skeleton-title" />
      <div className="skeleton skeleton-text" style={{ width: '40%' }} />

      {/* Card grid skeletons */}
      {Array.from({ length: rows }).map((_, rowIdx) => (
        <div key={rowIdx} className="loader-row">
          {[1, 2, 3].map((i) => (
            <div key={i} className="skeleton-card">
              <div className="skeleton skeleton-thumb" />
              <div className="skeleton skeleton-text skeleton-text--lg" style={{ width: '75%' }} />
              <div className="skeleton skeleton-text" style={{ width: '55%' }} />
              <div className="skeleton skeleton-text skeleton-text--sm" style={{ width: '40%', marginTop: '0.5rem' }} />
            </div>
          ))}
        </div>
      ))}
    </div>
  );
};

export default Loader;
