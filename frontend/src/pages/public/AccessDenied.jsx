import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldAlert } from 'lucide-react';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';

const AccessDenied = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-muted)', padding: '2rem' }}>
      <Card style={{ textAlign: 'center', padding: '3rem 2rem', maxWidth: '400px' }}>
        <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'center', color: 'var(--pink)' }}>
          <ShieldAlert size={64} strokeWidth={1.5} />
        </div>
        <h1 style={{ fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '0.5rem' }}>Access Denied</h1>
        <p style={{ color: 'var(--text-muted)', marginBottom: '2rem' }}>
          You do not have permission to view this page. If you believe this is an error, please contact an administrator.
        </p>
        <Button variant="primary" onClick={() => navigate(-1)} style={{ width: '100%' }}>
          Go Back
        </Button>
      </Card>
    </div>
  );
};

export default AccessDenied;
