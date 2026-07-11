import React from 'react';
import LessonCard from '../LessonCard/LessonCard.jsx';

const LessonList = ({
  lessons = [],
  activeLesson = null,
  onLessonClick,
}) => {
  if (!lessons.length) {
    return (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-muted)', fontSize: '0.875rem' }}>
        No lessons available.
      </div>
    );
  }

  return (
    <div className="lesson-list">
      {lessons.map((lesson, i) => (
        <LessonCard
          key={lesson.id ?? i}
          number={i + 1}
          title={lesson.title}
          duration={lesson.duration}
          type={lesson.type}
          status={lesson.id === activeLesson ? 'active' : lesson.status}
          onClick={() => onLessonClick?.(lesson)}
        />
      ))}
    </div>
  );
};

export default LessonList;
