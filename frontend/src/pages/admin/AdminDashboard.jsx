import React from 'react';
import { Users, UserCog, BookOpen } from 'lucide-react';
import Card from '../../components/common/Card/Card';
import StatisticsCard from '../../components/profile/StatisticsCard/StatisticsCard';

const AdminDashboard = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '1.5rem' }}>
        Admin Overview
      </h1>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <StatisticsCard label="Total Users" value="8,405" icon={<Users size={20} />} iconColor="gold" trend={{ direction: 'up', label: '+124 this week' }} />
        <StatisticsCard label="Active Instructors" value="42" icon={<UserCog size={20} />} iconColor="green" />
        <StatisticsCard label="Total Courses" value="156" icon={<BookOpen size={20} />} iconColor="pink" trend={{ direction: 'up', label: '+3 this week' }} />
      </div>

      <Card style={{ padding: '2rem' }}>
        <h2 style={{ fontSize: '1.25rem', fontWeight: 700, marginBottom: '1rem' }}>Platform Activity (Placeholder)</h2>
        <div style={{ height: '200px', background: 'var(--bg-muted)', borderRadius: 'var(--radius-md)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
          Chart Area
        </div>
      </Card>
    </div>
  );
};

export default AdminDashboard;
