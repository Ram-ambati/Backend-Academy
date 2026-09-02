import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { getMyEnrollments } from '../../api/enrollment.api';
import useAuthStore from '../../stores/useAuthStore';
import { BookOpen, CheckCircle, Clock, Flame, Play, RotateCcw, ArrowRight } from 'lucide-react';

/* ── Components ── */
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';
import Loader from '../../components/common/Loader/Loader';
import Badge from '../../components/common/Badge/Badge';
import StatisticsCard from '../../components/profile/StatisticsCard/StatisticsCard';
import CourseCard from '../../components/course/CourseCard/CourseCard';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const user = useAuthStore((state) => state.user);

  /* ── React Query fetch enrollments ── */
  const {
    data: enrollments = [],
    isLoading,
  } = useQuery({
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

  const completedCount = enrollments.filter(e => e.progressPercentage === 100).length;
  const inProgressCount = enrollments.filter(e => e.progressPercentage > 0 && e.progressPercentage < 100).length;

  return (
    <div style={{ padding: '2rem', maxWidth: '1200px', margin: '0 auto', width: '100%' }}>
      {/* Header */}
      <div style={{ marginBottom: '2rem' }}>
        <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
          Welcome back, {user?.name || 'Student'}!
        </h1>
        <p style={{ color: 'var(--text-muted)', fontSize: '1rem' }}>
          Track your course progress, resume active lessons, and master backend engineering.
        </p>
      </div>

      {/* Progress Stat Cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(240px, 1fr))', gap: '1.25rem', marginBottom: '2.5rem' }}>
        <StatisticsCard
          label="Enrolled Courses"
          value={enrollments.length.toString()}
          icon={<BookOpen size={20} />}
          iconColor="gold"
          trend={{ direction: 'up', label: 'Active learning' }}
        />
        <StatisticsCard
          label="In Progress"
          value={inProgressCount.toString()}
          icon={<Clock size={20} />}
          iconColor="pink"
        />
        <StatisticsCard
          label="Completed Courses"
          value={completedCount.toString()}
          icon={<CheckCircle size={20} />}
          iconColor="green"
        />
        <StatisticsCard
          label="Learning Streak"
          value="12 days"
          icon={<Flame size={20} />}
          iconColor="gold"
          trend={{ direction: 'flat', label: 'Keep it up!' }}
        />
      </div>

      {/* Enrollments Section */}
      <div>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-dark)' }}>
            Your Learning Journey
          </h2>
          {enrollments.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => navigate('/courses')}>
              Explore Catalog <ArrowRight size={16} />
            </Button>
          )}
        </div>

        {/* Step 2: Empty State (Zero Data UX) */}
        {enrollments.length === 0 ? (
          <Card style={{ padding: '4rem 2rem', textAlign: 'center' }}>
            <div style={{ marginBottom: '1.5rem', display: 'flex', justifyContent: 'center', color: 'var(--gold)' }}>
              <BookOpen size={64} strokeWidth={1.5} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>
              Welcome to Backend Academy, {user?.name || 'Developer'}!
            </h3>
            <p style={{ color: 'var(--text-muted)', fontSize: '1rem', maxWidth: '480px', margin: '0 auto 2rem', lineHeight: 1.6 }}>
              Your learning journey starts here. You aren't enrolled in any courses yet.
            </p>
            <Button variant="primary" size="lg" onClick={() => navigate('/courses')}>
              Explore the Catalog <ArrowRight size={18} />
            </Button>
          </Card>
        ) : (
          /* Step 3: Enrolled Course Cards Grid */
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem' }}>
            {enrollments.map((enrollment) => {
              const isCompleted = enrollment.progressPercentage === 100;
              return (
                <div key={enrollment.id} style={{ display: 'flex', flexDirection: 'column' }}>
                  <Card hoverable={true} style={{ display: 'flex', flexDirection: 'column', height: '100%', padding: 0 }}>
                    {/* Thumbnail */}
                    <div style={{ height: '160px', width: '100%', background: 'var(--bg-muted)', borderTopLeftRadius: 'var(--radius-xl)', borderTopRightRadius: 'var(--radius-xl)', overflow: 'hidden', position: 'relative' }}>
                      {enrollment.courseThumbnailUrl ? (
                        <img src={enrollment.courseThumbnailUrl} alt={enrollment.courseTitle} style={{ width: '100%', height: '100%', objectFit: 'cover' }} />
                      ) : (
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%', color: 'var(--text-light)' }}>
                          <BookOpen size={48} opacity={0.2} />
                        </div>
                      )}
                      <div style={{ position: 'absolute', top: '1rem', right: '1rem' }}>
                        <Badge variant={isCompleted ? 'solid-green' : 'gold'}>
                          {isCompleted ? 'Completed' : `${Math.round(enrollment.progressPercentage)}% Completed`}
                        </Badge>
                      </div>
                    </div>

                    {/* Card Content */}
                    <div style={{ padding: '1.25rem', flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                      <h3 style={{ fontSize: '1.125rem', fontWeight: 700, color: 'var(--text-dark)', margin: 0, lineHeight: 1.4 }}>
                        {enrollment.courseTitle}
                      </h3>

                      {/* Progress Bar */}
                      <div style={{ marginTop: 'auto', paddingTop: '0.75rem' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', color: 'var(--text-muted)', marginBottom: '0.5rem' }}>
                          <span>Progress</span>
                          <span style={{ fontWeight: 700, color: isCompleted ? 'var(--green)' : 'var(--gold-hover)' }}>
                            {Math.round(enrollment.progressPercentage)}%
                          </span>
                        </div>
                        <div className="progress-bar-track progress-bar-track--sm">
                          <div
                            className={`progress-bar-fill progress-bar-fill--${isCompleted ? 'green' : 'gold'}`}
                            style={{ width: `${enrollment.progressPercentage}%` }}
                          />
                        </div>
                      </div>
                    </div>

                    {/* Action Footer */}
                    <div style={{ padding: '0.875rem 1.25rem', borderTop: '1px solid var(--border-light)', background: 'var(--bg-soft)', display: 'flex', justifyContent: 'flex-end', borderBottomLeftRadius: 'var(--radius-xl)', borderBottomRightRadius: 'var(--radius-xl)' }}>
                      {isCompleted ? (
                        <Button
                          variant="outline-green"
                          size="sm"
                          onClick={() => navigate(`/learn/${enrollment.courseId}/1`)}
                        >
                          <RotateCcw size={14} /> Review Course
                        </Button>
                      ) : (
                        <Button
                          variant="primary"
                          size="sm"
                          onClick={() => navigate(`/learn/${enrollment.courseId}/1`)}
                        >
                          <Play size={14} /> Resume Course
                        </Button>
                      )}
                    </div>
                  </Card>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};

export default StudentDashboard;
