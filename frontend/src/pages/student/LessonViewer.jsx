import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, CheckCircle } from 'lucide-react';
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

  const containerRef = React.useRef(null);

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
      
      // Update local progress dynamically (simplified calculation)
      setEnrollment(prev => prev ? { 
        ...prev, 
        progressPercentage: Math.min(100, prev.progressPercentage + (100 / lessons.length)) 
      } : prev);

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

  return (
    <div style={{ display: 'flex', height: 'calc(100vh - 64px)', overflow: 'hidden' }}>
      {/* Center Panel (Scrolls) */}
      <div ref={containerRef} style={{ flex: 1, overflowY: 'auto', padding: '1.25rem', scrollBehavior: 'smooth' }}>
        {/* Prev / Topic / Next Bar */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.75rem 1rem', background: 'var(--white)', borderRadius: 'var(--radius-lg)', border: '1.5px solid var(--border)', boxShadow: 'var(--shadow-sm)', marginBottom: '1.25rem' }}>
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
        <div style={{ marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
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
            {isCompleting ? 'Saving...' : 'Complete Lesson'}
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
        <Card title="Lesson Content" subtitle={activeLesson.title} style={{ marginTop: '1.25rem' }}>
          <MarkdownViewer content={activeLesson.content || 'No content provided for this lesson.'} />
        </Card>

        {/* Lesson List */}
        <Card title="Course Lessons" subtitle={`${lessons.length} lessons in total`} style={{ marginTop: '1.25rem' }}>
          <LessonList 
            lessons={lessons.map(l => ({ ...l, status: 'active' }))} 
            activeLesson={activeLesson.id} 
            onLessonClick={(lesson) => handleLessonChange(lesson.id)} 
          />
        </Card>
      </div>

      {/* AI Chat Panel (Fixed) */}
      <div style={{ width: '320px', flexShrink: 0, height: '100%', borderLeft: '1.5px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
        <ChatWindow user={{ initials: user?.initials || 'ME' }} />
      </div>
    </div>
  );
};

export default LessonViewer;
