import React from 'react';
import { useNavigate } from 'react-router-dom';
import Card from '../../components/common/Card/Card';
import Button from '../../components/common/Button/Button';
import StatisticsCard from '../../components/profile/StatisticsCard/StatisticsCard';
import useAuthStore from '../../stores/useAuthStore';

const InstructorDashboard = () => {
  const navigate = useNavigate();
  const user = useAuthStore(state => state.user);

  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '1.5rem' }}>
        Welcome back, {user?.name}
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatisticsCard label="Active Courses" value="2" icon="📚" iconColor="gold" />
        <StatisticsCard label="Total Students" value="1,245" icon="👥" iconColor="green" trend={{ direction: 'up', label: '+45 this week' }} />
        <StatisticsCard label="Avg Rating" value="4.8" icon="⭐" iconColor="pink" />
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-dark)' }}>Your Courses</h2>
        <Button variant="primary" icon="➕" onClick={() => navigate('/instructor/courses/new')}>
          Create New Course
        </Button>
      </div>

      <Card style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        No courses created yet. Click the button above to get started!
      </Card>
    </div>
  );
};

export default InstructorDashboard;
