import React from 'react';
import CourseCard from '../CourseCard/CourseCard.jsx';

const CourseGrid = ({
  courses = [],
  columns = 3,   // 2 | 3 | 4
  onCourseClick,
  emptyMessage = 'No courses found.',
}) => {
  if (!courses.length) {
    return (
      <div style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
        <div style={{ fontSize: '2.5rem', marginBottom: '0.75rem' }}>📭</div>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className={`course-grid course-grid--${columns}`}>
      {courses.map((course, i) => (
        <CourseCard key={course.id ?? i} {...course} onClick={() => onCourseClick?.(course)} />
      ))}
    </div>
  );
};

export default CourseGrid;
