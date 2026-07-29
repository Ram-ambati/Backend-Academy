import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { BookOpen, Users, Star, Plus } from 'lucide-react';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import StatisticsCard from '../../components/profile/StatisticsCard/StatisticsCard';
import CourseGrid from '../../components/course/CourseGrid/CourseGrid';
import Loader from '../../components/common/Loader/Loader';
import useAuthStore from '../../stores/useAuthStore';
import { getMyCourses } from '../../api/course.api';

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);

  const { data, isLoading, isError } = useQuery({
    queryKey: ['instructorCourses', user?.id],
    queryFn: () => getMyCourses({ page: 0, size: 50 }), // fetch up to 50 for now
    enabled: !!user?.id
  });

  const courses = data?.content || [];

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '1.5rem' }}>
        Welcome back, {user?.name}
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatisticsCard label="Active Courses" value={courses.length.toString()} icon={<BookOpen size={20} />} iconColor="gold" />
        <StatisticsCard label="Total Students" value="1,245" icon={<Users size={20} />} iconColor="green" trend={{ direction: 'up', label: '+45 this week' }} />
        <StatisticsCard label="Avg Rating" value="4.8" icon={<Star size={20} fill="currentColor" />} iconColor="pink" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-dark)' }}>Your Courses</h2>
        <Button variant="primary" icon={<Plus size={16} />} onClick={() => navigate('/instructor/courses/new')}>
          Create New Course
        </Button>
      </div>

      {isLoading ? (
        <Loader rows={1} />
      ) : isError ? (
        <Card style={{ padding: '2rem', textAlign: 'center', color: 'var(--error)' }}>
          Failed to load courses. Please try again.
        </Card>
      ) : courses.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--white)', borderRadius: 'var(--radius-xl)', border: '1.5px solid var(--border)' }}>
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', color: 'var(--text-light)' }}>
            <BookOpen size={48} strokeWidth={1.5} />
          </div>
          <h3 style={{ fontSize: '1.25rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
            No courses created yet
          </h3>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.875rem', marginBottom: '1.5rem' }}>
            Start sharing your expertise with students. Click the button above to create your first course!
          </p>
        </div>
      ) : (
        <CourseGrid 
          courses={courses} 
          columns={3} 
          onCourseClick={(course) => navigate(`/instructor/courses/${course.id}/edit`)} 
        />
      )}
    </div>
  );
};

export default InstructorDashboard;
