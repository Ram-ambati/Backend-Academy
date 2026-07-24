import React from 'react';
import { CheckCircle, PlayCircle, Lock, Circle, Play, FileText, PenLine, Clock } from 'lucide-react';

const STATUS_ICON = {
  completed: CheckCircle,
  active:    PlayCircle,
  locked:    Lock,
  pending:   Circle,
};

const TYPE_ICON = {
  video:   Play,
  reading: FileText,
  quiz:    PenLine,
};

const LessonCard = ({
  number = 1,
  title = 'Introduction to Spring Boot',
  duration = '12 min',
  type = 'video',   // video | reading | quiz
  status = 'pending',  // pending | active | completed | locked
  onClick,
}) => {
  const TypeIcon = TYPE_ICON[type] || FileText;
  const StatusIcon = STATUS_ICON[status] || Circle;

  return (
    <div
      className={`lesson-card${status === 'active' ? ' active' : ''}${status === 'completed' ? ' completed' : ''}${status === 'locked' ? ' locked' : ''}`}
      onClick={status !== 'locked' ? onClick : undefined}
      role={status !== 'locked' ? 'button' : undefined}
      tabIndex={status !== 'locked' ? 0 : undefined}
    >
      <div className="lesson-card-icon-wrap"><TypeIcon size={18} /></div>

      <div className="lesson-card-body">
        <div className="lesson-card-number">Lesson {number}</div>
        <div className="lesson-card-title">{title}</div>
        <div className="lesson-card-meta">
          <span><Clock size={12} /> {duration}</span>
        </div>
      </div>

      <span className="lesson-card-status" title={status}>
        <StatusIcon size={18} />
      </span>
    </div>
  );
};

export default LessonCard;
