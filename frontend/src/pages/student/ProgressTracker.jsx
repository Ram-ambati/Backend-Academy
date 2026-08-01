import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { getMyEnrollments } from '../../api/enrollment.api';
import Card from '../../components/common/Card/Card';
import ProgressBar from '../../components/course/ProgressBar/ProgressBar';
import StatisticsCard from '../../components/profile/StatisticsCard/StatisticsCard';
import Loader from '../../components/common/Loader/Loader';
import { TrendingUp, Award, BookOpen, Clock, Flame, CheckCircle } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

const ProgressTracker = () => {
  const navigate = useNavigate();
  
  const { data: enrollments = [], isLoading } = useQuery({
    queryKey: ['studentEnrollments'],
    queryFn: getMyEnrollments,
    staleTime: 1000 * 60 * 5,
  });

  if (isLoading) {
    return (
      <div style={{ padding: '2rem' }}>
        <Loader rows={3} />
      </div>
    );
  }

  const completedCount = enrollments.filter((c) => c.progressPercentage === 100).length;
  const inProgressCount = enrollments.filter((c) => c.progressPercentage > 0 && c.progressPercentage < 100).length;
  const overallAvgProgress = enrollments.length > 0
    ? Math.round(enrollments.reduce((acc, curr) => acc + curr.progressPercentage, 0) / enrollments.length)
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
              <Card 
                key={course.courseId} 
                style={{ padding: '1.25rem', cursor: 'pointer' }}
                onClick={() => navigate(`/courses/${course.courseId}`)}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '0.75rem', flexWrap: 'wrap', gap: '0.5rem' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    {course.courseThumbnailUrl ? (
                      <img src={course.courseThumbnailUrl} alt={course.courseTitle} style={{ width: '48px', height: '48px', objectFit: 'cover', borderRadius: '6px' }} />
                    ) : (
                      <div style={{ width: '48px', height: '48px', borderRadius: '6px', background: 'var(--bg-muted)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                        <BookOpen size={24} color="var(--text-muted)" />
                      </div>
                    )}
                    <div>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-dark)', margin: 0 }}>
                        {course.courseTitle}
                      </h3>
                      <div style={{ fontSize: '0.8125rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>
                        Enrolled: {new Date(course.enrolledAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <span style={{ fontSize: '1.125rem', fontWeight: 800, color: course.progressPercentage === 100 ? 'var(--green)' : 'var(--gold-hover)' }}>
                      {Math.round(course.progressPercentage)}%
                    </span>
                  </div>
                </div>
                <ProgressBar
                  value={course.progressPercentage}
                  color={course.progressPercentage === 100 ? 'green' : 'gold'}
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
