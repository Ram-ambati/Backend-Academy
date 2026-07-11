import React from 'react';

const STATUS_ICON = {
  completed: '✅',
  active:    '▶️',
  locked:    '🔒',
  pending:   '⭕',
};

const LessonCard = ({
  number = 1,
  title = 'Introduction to Spring Boot',
  duration = '12 min',
  type = 'video',   // video | reading | quiz
  status = 'pending',  // pending | active | completed | locked
  onClick,
}) => {
  const typeIcon = { video: '🎬', reading: '📄', quiz: '📝' }[type] ?? '📄';

  return (
    <div
      className={`lesson-card${status === 'active' ? ' active' : ''}${status === 'completed' ? ' completed' : ''}${status === 'locked' ? ' locked' : ''}`}
      onClick={status !== 'locked' ? onClick : undefined}
      role={status !== 'locked' ? 'button' : undefined}
      tabIndex={status !== 'locked' ? 0 : undefined}
    >
      <div className="lesson-card-icon-wrap">{typeIcon}</div>

      <div className="lesson-card-body">
        <div className="lesson-card-number">Lesson {number}</div>
        <div className="lesson-card-title">{title}</div>
        <div className="lesson-card-meta">
          <span>⏱ {duration}</span>
        </div>
      </div>

      <span className="lesson-card-status" title={status}>
        {STATUS_ICON[status]}
      </span>
    </div>
  );
};

export default LessonCard;
