import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getCourseById } from '../../api/course.api';
import { ArrowLeft, User, Clock, BookOpen, Star } from 'lucide-react';
import Loader from '../../components/common/Loader/Loader';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';
import Badge from '../../components/common/Badge/Badge';

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const [course, setCourse] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchCourse = async () => {
      try {
        const data = await getCourseById(courseId);
        setCourse(data);
      } catch (err) {
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  if (isLoading) return <div style={{ padding: '2rem' }}><Loader rows={3} /></div>;
  if (!course) return <div style={{ padding: '2rem', textAlign: 'center' }}>Course not found.</div>;

  return (
    <div style={{ padding: '2rem', maxWidth: '900px', margin: '0 auto' }}>
      <Button variant="ghost" onClick={() => navigate('/courses')} style={{ marginBottom: '1rem' }}>
        <ArrowLeft size={16} style={{ marginRight: '6px' }} /> Back to Courses
      </Button>
      
      <Card style={{ padding: '2rem', marginBottom: '2rem' }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', gap: '2rem' }}>
          <div style={{ background: 'var(--bg-muted)', padding: '1.5rem', borderRadius: 'var(--radius-lg)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)' }}>
            <BookOpen size={48} strokeWidth={1.5} />
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
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><User size={16} /> {course.instructor.name}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Clock size={16} /> {course.duration}</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><BookOpen size={16} /> {course.lessons} lessons</span>
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}><Star size={16} fill="currentColor" color="var(--gold)" /> {course.rating} / 5.0</span>
            </div>
            
            <Button variant="primary" size="lg" onClick={() => navigate(`/learn/${course.id}/1`)}>
              Start Learning
            </Button>
          </div>
        </div>
      </Card>

      <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1rem' }}>Course Syllabus</h2>
      <Card>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>Module 1: Introduction</div>
        <div style={{ padding: '1rem 1.5rem', borderBottom: '1px solid var(--border)' }}>Module 2: Core Concepts</div>
        <div style={{ padding: '1rem 1.5rem' }}>Module 3: Advanced Topics</div>
      </Card>
    </div>
  );
};

export default CourseDetail;
