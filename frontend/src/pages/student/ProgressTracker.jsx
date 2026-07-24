import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getStudentEnrollments } from '../../api/course.api';
import Card from '../../components/common/Card/Card';
import ProgressBar from '../../components/course/ProgressBar/ProgressBar';
import StatisticsCard from '../../components/profile/StatisticsCard/StatisticsCard';
import Loader from '../../components/common/Loader/Loader';
import { TrendingUp, Award, BookOpen, Clock, Flame, CheckCircle } from 'lucide-react';

const ProgressTracker = () => {
  const { data: enrollments = [], isLoading } = useQuery({
    queryKey: ['studentEnrollments'],
    queryFn: getStudentEnrollments,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div style={{ padding: '2rem' }}>
        <Loader rows={3} />
      </div>
    );
  }

  const completedCount = enrollments.filter((c) => c.progress === 100).length;
  const inProgressCount = enrollments.filter((c) => c.progress > 0 && c.progress < 100).length;
  const overallAvgProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((acc, curr) => acc + curr.progress, 0) / enrollments.length)
    : 0;

  return (
    <div style={{ padding: '2rem', maxWidth: '1100px', margin: '0 auto', width: '100%' }}>
      {/* Page Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <TrendingUp size={28} style={{ color: 'var(--green)' }} /> Learning Progress Analytics
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Comprehensive view of completed modules, skill achievements, and active course completion rates.
        </p>
      </div>

      {/* Top Stats Overview */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(220px, 1fr))', gap: '1.25rem', marginBottom: '2rem' }}>
        <StatisticsCard
          label="Overall Progress"
          value={`${overallAvgProgress}%`}
          icon={<TrendingUp size={20} />}
          iconColor="green"
          progress={{ value: overallAvgProgress, color: 'green' }}
        />
        <StatisticsCard
          label="Completed Courses"
          value={completedCount.toString()}
          icon={<Award size={20} />}
          iconColor="gold"
        />
        <StatisticsCard
          label="In Progress"
          value={inProgressCount.toString()}
          icon={<BookOpen size={20} />}
          iconColor="pink"
        />
        <StatisticsCard
          label="Active Streak"
          value="12 days"
          icon={<Flame size={20} />}
          iconColor="gold"
          trend={{ direction: 'up', label: 'Top 5% student' }}
        />
      </div>

      {/* Course-by-Course Progress Breakdown */}
      <div style={{ marginBottom: '2.5rem' }}>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1rem' }}>
          Active Course Progress Breakdown
        </h2>

        {enrollments.length === 0 ? (
          <Card style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-muted)' }}>
            No progress recorded yet. Enroll in a course to start tracking your completion rate!
          </Card>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {enrollments.map((course) => (
              <Card key={course.id} style={{ padding: '1.25rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div>
                    <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-dark)', margin: 0 }}>
                      {course.title}
                    </h3>
                    <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                      {course.category} • {course.lessons} lessons total
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.125rem', fontWeight: 800, color: course.progress === 100 ? 'var(--green)' : 'var(--gold-hover)' }}>
                      {course.progress}%
                    </span>
                  </div>
                </div>
                <ProgressBar
                  value={course.progress}
                  color={course.progress === 100 ? 'green' : 'gold'}
                  size="md"
                  showValue={false}
                />
              </Card>
            ))}
          </div>
        )}
      </div>

      {/* Skill Badges & Milestones */}
      <div>
        <h2 style={{ fontSize: '1.375rem', fontWeight: 700, color: 'var(--text-dark)', marginBottom: '1rem' }}>
          Milestone Badges
        </h2>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.25rem' }}>
          <Card style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: 'var(--green-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--green)', flexShrink: 0 }}>
              <CheckCircle size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-dark)' }}>First Principles Master</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Completed 1st REST API module</div>
            </div>
          </Card>

          <Card style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: 'var(--gold-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--gold)', flexShrink: 0 }}>
              <Flame size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-dark)' }}>10-Day Streak Warrior</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Studied 10 consecutive days</div>
            </div>
          </Card>

          <Card style={{ padding: '1.25rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
            <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-lg)', background: 'var(--pink-light)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--pink)', flexShrink: 0 }}>
              <Clock size={24} />
            </div>
            <div>
              <div style={{ fontWeight: 700, fontSize: '0.9375rem', color: 'var(--text-dark)' }}>30 Hours Club</div>
              <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)' }}>Completed 30+ hours of video & code</div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default ProgressTracker;
