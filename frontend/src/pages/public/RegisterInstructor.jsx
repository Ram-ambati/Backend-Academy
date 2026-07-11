import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerInstructor } from '../../api/auth.api';
import useAuthStore from '../../stores/useAuthStore';
import { useToast } from '../../components/common/Toast/Toast';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';

const RegisterInstructor = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', credentials: '', bio: '' });
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.login);
  const { addToast } = useToast();

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { token, user } = await registerInstructor(formData);
      setAuth(token, user);
      addToast({ type: 'success', title: 'Registration Successful', message: `Welcome to the Faculty!` });
      navigate('/instructor'); // Instructor lands on their dashboard
    } catch (err) {
      addToast({ type: 'error', title: 'Registration Failed', message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-muted)', padding: '2rem' }}>
      <Card style={{ width: '100%', maxWidth: '600px', padding: '2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '1.5rem', color: 'var(--text-dark)' }}>
          Instructor Application
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Share your backend expertise with the world.
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
            <Input label="Full Name" type="text" id="name" value={formData.name} onChange={handleChange} required placeholder="Dr. Jane Doe" />
            <Input label="Email Address" type="email" id="email" value={formData.email} onChange={handleChange} required placeholder="instructor@example.com" />
          </div>
          
          <Input label="Password" type="password" id="password" value={formData.password} onChange={handleChange} required placeholder="Choose a strong password" />
          
          <Input label="Credentials / Expertise" type="text" id="credentials" value={formData.credentials} onChange={handleChange} placeholder="e.g. Senior Software Engineer at Google" required />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-dark)' }}>Short Bio</label>
            <textarea 
              id="bio" 
              value={formData.bio} 
              onChange={handleChange}
              rows={4}
              placeholder="Tell students a bit about your teaching style and background..."
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border)', background: 'var(--white)', fontSize: '0.9375rem', outline: 'none', fontFamily: 'inherit', resize: 'vertical' }}
            />
          </div>
          
          <Button variant="primary" type="submit" isLoading={isLoading} style={{ marginTop: '1rem' }}>
            Submit Application
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default RegisterInstructor;
