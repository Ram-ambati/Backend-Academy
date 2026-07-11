import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button/Button';

const NotFound = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-muted)', padding: '2rem' }}>
      <div style={{ fontSize: '6rem', fontWeight: 900, color: 'var(--gold)', lineHeight: 1 }}>404</div>
      <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '1rem', marginTop: '1rem' }}>Page Not Found</h1>
      <p style={{ color: 'var(--text-muted)', marginBottom: '2rem', textAlign: 'center', maxWidth: '400px' }}>
        The page you are looking for doesn't exist or has been moved.
      </p>
      <Button variant="primary" onClick={() => navigate('/')}>
        Go to Homepage
      </Button>
    </div>
  );
};

export default NotFound;
