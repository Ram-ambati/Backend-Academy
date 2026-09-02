import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle, Bot } from 'lucide-react';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';
import ProgressBar from '../../components/course/ProgressBar/ProgressBar';
import VideoPlayer from '../../components/course/VideoPlayer/VideoPlayer';
import MarkdownViewer from '../../components/course/MarkdownViewer/MarkdownViewer';
import CodeSnippet from '../../components/course/CodeSnippet/CodeSnippet';
import LessonList from '../../components/course/LessonList/LessonList';
import ChatWindow from '../../components/ai/ChatWindow/ChatWindow';
import Loader from '../../components/common/Loader/Loader';
import useAuthStore from '../../stores/useAuthStore';
import { getCourseLessons } from '../../api/lesson.api';
import { completeLesson, getMyEnrollments } from '../../api/enrollment.api';
import { useToast } from '../../components/common/Toast/Toast';

const LessonViewer = () => {
  const { courseId, lessonId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  const user = useAuthStore(state => state.user);

  const [lessons, setLessons] = useState([]);
  const [enrollment, setEnrollment] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isCompleting, setIsCompleting] = useState(false);
  const [isAiChatCollapsed, setIsAiChatCollapsed] = useState(false);
  const [chatWidth, setChatWidth] = useState(420);
  const [isDragging, setIsDragging] = useState(false);
  const [hasScrolled, setHasScrolled] = useState(false);

  const containerRef = React.useRef(null);

  // Handle resizing the AI Chat panel
  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging) return;
      // Calculate new width: Screen width - mouse X position - 24px right padding
      let newWidth = window.innerWidth - e.clientX - 24;
      // Constrain width between 280px and 50% of the screen
      if (newWidth < 280) newWidth = 280;
      if (newWidth > window.innerWidth * 0.5) newWidth = window.innerWidth * 0.5;
      setChatWidth(newWidth);
    };

    const handleMouseUp = () => setIsDragging(false);

    if (isDragging) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
      // Disable text selection while dragging
      document.body.style.userSelect = 'none';
    } else {
      document.body.style.userSelect = '';
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
      document.body.style.userSelect = '';
    };
  }, [isDragging]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [fetchedLessons, enrollments] = await Promise.all([
          getCourseLessons(courseId),
          getMyEnrollments()
        ]);
        setLessons(fetchedLessons);
        const currentEnrollment = enrollments.find(e => e.courseId === parseInt(courseId));
        setEnrollment(currentEnrollment);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [courseId]);

  // Scroll to top when lesson changes
  useEffect(() => {
    if (containerRef.current) {
      containerRef.current.scrollTo(0, 0);
    }
  }, [lessonId]);

  if (isLoading) return <div style={{ padding: '2rem' }}><Loader rows={3} /></div>;
  if (!lessons || lessons.length === 0) return <div style={{ padding: '2rem' }}>No lessons available.</div>;

  const currentLessonId = parseInt(lessonId);
  const activeLessonIndex = lessons.findIndex(l => l.id === currentLessonId);
  
  // Fallback to the first lesson if URL is invalid
  const activeLesson = activeLessonIndex >= 0 ? lessons[activeLessonIndex] : lessons[0];
  const activeIndex = activeLessonIndex >= 0 ? activeLessonIndex : 0;

  const handleLessonChange = (newLessonId) => {
    navigate(`/learn/${courseId}/${newLessonId}`);
  };

  const handleComplete = async () => {
    setIsCompleting(true);
    try {
      await completeLesson(activeLesson.id);
      showToast('Lesson marked as complete!', 'success');
      
      // Fetch fresh enrollment to get accurate progress percentage
      const enrollments = await getMyEnrollments();
      const currentEnrollment = enrollments.find(e => e.courseId === parseInt(courseId));
      setEnrollment(currentEnrollment);

      // Auto-advance to next lesson if available
      if (activeIndex < lessons.length - 1) {
        handleLessonChange(lessons[activeIndex + 1].id);
      }
    } catch (err) {
      console.error(err);
      showToast('Failed to mark lesson complete.', 'error');
    } finally {
      setIsCompleting(false);
    }
  };

  // Auto-collapse left sidebar on first scroll
  const handleContentScroll = () => {
    if (!hasScrolled) {
      setHasScrolled(true);
      window.dispatchEvent(new CustomEvent('autoCollapseSidebar'));
    }
  };

  return (
    <div style={{ display: 'flex', flex: 1, overflow: 'hidden', gap: '1.5rem' }}>
      {/* Center Panel (Canvas) */}
      <div 
        ref={containerRef} 
        onScroll={handleContentScroll}
        style={{ flex: 1, overflowY: 'auto', scrollBehavior: 'smooth', background: 'var(--white)', borderRadius: 'var(--radius-xl)', padding: '2rem', boxShadow: 'var(--shadow-sm)' }}
      >
        {/* Prev / Topic / Next Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', background: 'var(--bg-soft)', borderRadius: 'var(--radius-lg)', marginBottom: '2rem' }}>
          <Button 
            size="sm" 
            variant="outline-gold" 
            icon={<ChevronLeft size={16} />}
            disabled={activeIndex === 0}
            onClick={() => handleLessonChange(lessons[activeIndex - 1].id)}
          >
            Prev
          </Button>
          <div style={{ flex: 1, textAlign: 'center' }}>
            <span style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-dark)' }}>
              Lesson {activeIndex + 1} — {activeLesson.title}
            </span>
          </div>
          <Button 
            size="sm" 
            variant="outline-green" 
            iconRight={<ChevronRight size={16} />}
            disabled={activeIndex === lessons.length - 1}
            onClick={() => handleLessonChange(lessons[activeIndex + 1].id)}
          >
            Next
          </Button>
        </div>

        {/* Progress */}
        <div style={{ marginBottom: '2rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ flex: 1 }}>
            <ProgressBar value={enrollment?.progressPercentage || 0} label="Course Progress" size="md" color="gold" />
          </div>
          <Button 
            variant="primary" 
            size="sm" 
            icon={<CheckCircle size={16} />} 
            onClick={handleComplete}
            disabled={isCompleting}
          >
            {isCompleting ? 'Saving...' : 'Mark as Complete'}
          </Button>
        </div>

        {/* Video */}
        {activeLesson.videoUrl && (
          <VideoPlayer 
            videoId={activeLesson.videoUrl.split('/').pop()} 
            title={activeLesson.title} 
            caption={`${activeLesson.title} — ${activeLesson.duration}`} 
          />
        )}

        {/* Markdown Content */}
        <Card title="Lesson Content" subtitle={activeLesson.title} style={{ marginTop: '2rem' }}>
          <MarkdownViewer content={activeLesson.content || 'No content provided for this lesson.'} />
        </Card>

        {/* Lesson List */}
        <Card title="Course Lessons" subtitle={`${lessons.length} lessons in total`} style={{ marginTop: '2rem' }}>
          <LessonList 
            lessons={lessons.map(l => ({ ...l, status: 'active' }))} 
            activeLesson={activeLesson.id} 
            onLessonClick={(lesson) => handleLessonChange(lesson.id)} 
          />
        </Card>
      </div>

      {/* Resizer Handle */}
      {!isAiChatCollapsed && (
        <div style={{ position: 'relative', width: 0, zIndex: 10 }}>
          <div 
            onMouseDown={() => setIsDragging(true)}
            style={{ 
              position: 'absolute',
              top: 0,
              bottom: 0,
              left: '-12px',
              width: '24px', 
              cursor: 'col-resize', 
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center'
            }}
          >
            <div style={{
              width: '2px',
              height: '100%',
              background: isDragging ? 'var(--gold)' : 'var(--border)',
              transition: 'background 0.2s',
              borderRadius: '2px'
            }} />
          </div>
        </div>
      )}

      {/* AI Chat Panel */}
      <div style={{ 
        width: isAiChatCollapsed ? '64px' : `${chatWidth}px`, 
        transition: isDragging ? 'none' : 'width 0.3s ease',
        flexShrink: 0, 
        borderRadius: 'var(--radius-xl)', 
        boxShadow: 'var(--shadow-sm)', 
        background: 'var(--white)', 
        display: 'flex', 
        flexDirection: 'column', 
        overflow: 'hidden' 
      }}>
        {isAiChatCollapsed ? (
          <div 
            onClick={() => setIsAiChatCollapsed(false)}
            style={{ 
              flex: 1, 
              display: 'flex', 
              flexDirection: 'column', 
              alignItems: 'center', 
              padding: '1rem 0',
              cursor: 'pointer'
            }}
          >
            <button 
              style={{
                width: '40px', height: '40px', borderRadius: '50%', background: 'var(--bg-soft)',
                border: 'none', color: 'var(--gold)', display: 'flex', alignItems: 'center', justifyContent: 'center',
                transition: 'var(--transition)',
                flexShrink: 0
              }}
              title="Open AI Tutor"
            >
              <Bot size={20} />
            </button>
            <div style={{ 
              writingMode: 'vertical-rl', 
              textOrientation: 'mixed', 
              transform: 'rotate(180deg)',
              color: 'var(--text-muted)', 
              fontSize: '0.875rem', 
              fontWeight: 700, 
              letterSpacing: '0.1em', 
              textTransform: 'uppercase',
              opacity: 0.8,
              margin: 'auto 0'
            }}>
              Nexus AI is here to help
            </div>
          </div>
        ) : (
          <ChatWindow 
            user={user} 
            courseId={courseId}
            lessonTitle={activeLesson?.title}
            onClose={() => setIsAiChatCollapsed(true)} 
          />
        )}
      </div>
    </div>
  );
};

export default LessonViewer;
