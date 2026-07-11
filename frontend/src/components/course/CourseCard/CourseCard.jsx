import React from 'react';
import Badge from '../../common/Badge/Badge.jsx';

const CourseCard = ({
  title = 'Spring Boot Masterclass',
  description = 'Learn Spring Boot from scratch with hands-on projects.',
  category = 'Backend',
  level = 'Intermediate',
  thumbnail = null,
  emoji = '⚙️',
  lessons = 24,
  duration = '8h 30m',
  rating = 4.8,
  instructor = { name: 'Dr. Ram A', initials: 'RA' },
  progress = 0,
  onClick,
}) => {
  const levelVariant = {
    Beginner: 'green',
    Intermediate: 'gold',
    Advanced: 'pink',
  }[level] || 'gray';

  return (
    <div className="course-card" onClick={onClick} role="button" tabIndex={0}>
      {/* Thumbnail */}
      <div className="course-card-thumb">
        {thumbnail ? (
          <img src={thumbnail} alt={title} loading="lazy" />
        ) : (
          <div className="course-card-thumb-placeholder">{emoji}</div>
        )}
        <div className="course-card-level">
          <Badge variant={levelVariant}>{level}</Badge>
        </div>
        <button className="course-card-bookmark" onClick={(e) => e.stopPropagation()} aria-label="Bookmark">
          🔖
        </button>
      </div>

      {/* Body */}
      <div className="course-card-body">
        <div className="course-card-category">{category}</div>
        <div className="course-card-title">{title}</div>
        <div className="course-card-desc">{description}</div>

        <div className="course-card-meta">
          <span className="course-card-meta-item">📖 {lessons} lessons</span>
          <span className="course-card-meta-item">⏱ {duration}</span>
        </div>

        {progress > 0 && (
          <div style={{ marginTop: '0.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.25rem' }}>
              <span>Progress</span>
              <span style={{ color: 'var(--gold-hover)', fontWeight: 600 }}>{progress}%</span>
            </div>
            <div className="progress-bar-track progress-bar-track--sm">
              <div
                className="progress-bar-fill progress-bar-fill--gold"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div className="course-card-footer">
        <div className="course-card-instructor">
          <div className="course-card-instructor-avatar">{instructor.initials}</div>
          <span className="course-card-instructor-name">{instructor.name}</span>
        </div>
        <div className="course-card-rating">
          ⭐ {rating}
        </div>
      </div>
    </div>
  );
};

export default CourseCard;
