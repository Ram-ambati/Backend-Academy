import React from 'react';
import Card from '../../components/common/Card/Card';

const UserManagement = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '1.5rem' }}>
        User Management
      </h1>
      <Card style={{ padding: '2rem' }}>
        <p style={{ color: 'var(--text-muted)' }}>User table will go here (mock data).</p>
      </Card>
    </div>
  );
};

export default UserManagement;
