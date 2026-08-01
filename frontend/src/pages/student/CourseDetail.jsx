import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById } from '../../api/course.api';
import { getCourseLessons } from '../../api/lesson.api';
import { enrollStudent } from '../../api/enrollment.api';
import { ArrowLeft, User, Clock, BookOpen, Star } from 'lucide-react';
import Loader from '../../components/common/Loader/Loader';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';
import Badge from '../../components/common/Badge/Badge';
import { useToast } from '../../components/common/Toast/Toast';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { showToast } = useToast();
  
  const [course, setCourse] = useState(null);
  const [lessons, setLessons] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isEnrolling, setIsEnrolling] = useState(false);

  useEffect(() => {
    const fetchCourseData = async () => {
      try {
        const [courseData, lessonsData] = await Promise.all([
          getCourseById(courseId),
          getCourseLessons(courseId)
        ]);
        setCourse({ ...courseData, lessonsCount: lessonsData.length });
        setLessons(lessonsData);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourseData();
  }, [courseId]);

  const handleStartLearning = async () => {
    if (lessons.length === 0) {
      showToast('This course has no lessons yet.', 'warning');
      return;
    }
    
    setIsEnrolling(true);
    try {
      await enrollStudent(course.id);
      navigate(`/learn/${course.id}/${lessons[0].id}`);
    } catch (err) {
      console.error(err);
      showToast('Failed to start learning. Please try again.', 'error');
    } finally {
      setIsEnrolling(false);
    }
  };

  if (isLoading) return <div style={{ padding: '2rem' }}><Loader rows={3} /></div>;
  if (!course) {
    return (
      <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
        <Button variant="ghost" onClick={() => navigate('/courses')} style={{ marginBottom: '1rem' }}>
          <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Back to Courses
        </Button>
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--white)', borderRadius: 'var(--radius-xl)', border: '1.5px solid var(--border)', marginTop: '2rem' }}>
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', color: 'var(--text-light)' }}>
            <BookOpen size={48} strokeWidth={1.5} />
          </div>
          <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
            Course Not Found
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '1rem', marginBottom: '1.5rem' }}>
            The course you're looking for doesn't exist or has been removed.
          </p>
          <Button variant="primary" onClick={() => navigate('/courses')}>
            Browse All Courses
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <Button variant="ghost" onClick={() => navigate('/courses')} style={{ marginBottom: '1rem' }}>
        <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Back to Courses
      </Button>
      
      <Card style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem' }}>
          <div style={{ background: 'var(--bg-muted)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
            {course.thumbnailUrl ? (
              <img src={course.thumbnailUrl} alt={course.title} style={{ width: '80px', height: '80px', objectFit: 'cover', borderRadius: '8px' }} />
            ) : (
              <BookOpen size={48} strokeWidth={1.5} />
            )}
          </div>
          <div style={{ flex: 1 }}>
            <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem' }}>
              <Badge variant="gold">{course.category}</Badge>
              <Badge variant="green">{course.level}</Badge>
            </div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
              {course.title}
            </h1>
            <p style={{ color: 'var(--text-muted)', fontSize: '1.125rem', marginBottom: '1.5rem' }}>
              {course.description}
            </p>
            <div style={{ display: 'flex', gap: '1.5rem', color: 'var(--text-muted)', fontSize: '0.9375rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><User size={16} /> {course.instructorName || 'Instructor'}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={16} /> {course.duration}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><BookOpen size={16} /> {course.lessonsCount || 0} lessons</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Star size={16} fill="currentColor" color="var(--gold)" /> {course.rating} / 5.0</span>
            </div>
            
            <Button variant="primary" size="lg" onClick={handleStartLearning} disabled={isEnrolling || lessons.length === 0}>
              {isEnrolling ? 'Enrolling...' : (lessons.length === 0 ? 'No lessons yet' : 'Start Learning')}
            </Button>
          </div>
        </div>
      </Card>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1rem' }}>Course Syllabus</h2>
      <Card>
        {lessons.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            This course doesn't have any lessons yet.
          </div>
        ) : (
          lessons.map((lesson, index) => (
            <div key={lesson.id} style={{ padding: '1rem 1.5rem', borderBottom: index < lessons.length - 1 ? '1px solid var(--border)' : 'none', display: 'flex', alignItems: 'center', gap: '1rem' }}>
              <span style={{ color: 'var(--text-light)', fontWeight: 'bold' }}>{index + 1}</span>
              <span style={{ flex: 1 }}>{lesson.title}</span>
              <span style={{ color: 'var(--text-muted)', fontSize: '0.875rem' }}>{lesson.duration}</span>
            </div>
          ))
        )}
      </Card>
    </div>
  );
};

export default CourseDetail;
