import React from 'react';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';

const Landing = () => {
  const navigate = useNavigate();

  return (
    <div style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-muted)', padding: '2rem' }}>
      
      <div style={{ textAlign: 'center', maxWidth: '600px', marginBottom: '3rem' }}>
        <h1 style={{ fontSize: '3rem', fontWeight: 800, color: 'var(--text-dark)', marginBottom: '1rem', lineHeight: 1.2 }}>
          Master <span style={{ color: 'var(--gold)' }}>Backend</span> Engineering
        </h1>
        <p style={{ fontSize: '1.125rem', color: 'var(--text-muted)' }}>
          Learn Spring Boot, Database Design, and DevOps with our AI-powered RAG Tutor. 
          Hands-on coding, expert instructors, and a curriculum designed for the real world.
        </p>
      </div>

      <div style={{ width: '100%', maxWidth: '800px', display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }}>
        
        <Card style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>🎓</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>I am a Student</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Learn backend development, build projects, and get AI-assisted help.
          </p>
          <Button variant="primary" style={{ width: '100%' }} onClick={() => navigate('/register/student')}>
            Start Learning
          </Button>
        </Card>

        <Card style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👨‍🏫</div>
          <h2 style={{ fontSize: '1.5rem', marginBottom: '0.5rem' }}>I am an Instructor</h2>
          <p style={{ color: 'var(--text-muted)', marginBottom: '1.5rem' }}>
            Create courses, upload lessons, and share your backend expertise.
          </p>
          <Button variant="outline-gold" style={{ width: '100%' }} onClick={() => navigate('/register/instructor')}>
            Start Teaching
          </Button>
        </Card>

      </div>

      <div style={{ marginTop: '3rem', color: 'var(--text-muted)' }}>
        Already have an account?{' '}
        <button 
          onClick={() => navigate('/login')}
          style={{ background: 'none', border: 'none', color: 'var(--gold)', fontWeight: 'bold', cursor: 'pointer', textDecoration: 'underline' }}
        >
          Sign In
        </button>
      </div>
    </div>
  );
};

export default Landing;
