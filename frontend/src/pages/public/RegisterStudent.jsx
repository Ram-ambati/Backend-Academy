import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { registerStudent } from '../../api/auth.api';
import useAuthStore from '../../stores/useAuthStore';
import { useToast } from '../../components/common/Toast/Toast';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';

const RegisterStudent = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '', experience: 'Beginner', faculty: '' });
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.login);
  const { addToast } = useToast();

  const handleChange = (e) => setFormData({ ...formData, [e.target.id]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { token, user } = await registerStudent(formData);
      setAuth(token, user);
      addToast({ type: 'success', title: 'Registration Successful', message: `Welcome to Backend Academy!` });
      navigate('/courses'); // Student lands on courses catalog
    } catch (err) {
      addToast({ type: 'error', title: 'Registration Failed', message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-muted)', padding: '2rem' }}>
      <Card style={{ width: '100%', maxWidth: '500px', padding: '2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '0.5rem', fontSize: '1.5rem', color: 'var(--text-dark)' }}>
          Student Registration
        </h2>
        <p style={{ textAlign: 'center', color: 'var(--text-muted)', marginBottom: '2rem' }}>
          Start your backend engineering journey today.
        </p>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input label="Full Name" type="text" id="name" value={formData.name} onChange={handleChange} required placeholder="Ram Ambati" />
          <Input label="Email Address" type="email" id="email" value={formData.email} onChange={handleChange} required placeholder="student@example.com" />
          <Input label="Password" type="password" id="password" value={formData.password} onChange={handleChange} required placeholder="Choose a strong password" />
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.375rem' }}>
            <label style={{ fontSize: '0.875rem', fontWeight: 600, color: 'var(--text-dark)' }}>Experience Level</label>
            <select 
              id="experience" 
              value={formData.experience} 
              onChange={handleChange}
              style={{ width: '100%', padding: '0.75rem', borderRadius: 'var(--radius-md)', border: '1.5px solid var(--border)', background: 'var(--white)', fontSize: '0.9375rem', outline: 'none' }}
            >
              <option value="Junior">Junior (Beginner)</option>
              <option value="Intermediate">Intermediate</option>
              <option value="Expert">Expert (Advanced)</option>
            </select>
          </div>

          <Input label="Faculty / Domain" type="text" id="faculty" value={formData.faculty} onChange={handleChange} placeholder="e.g. Computer Science, Self-Taught" />
          
          <Button variant="primary" type="submit" isLoading={isLoading} style={{ marginTop: '1rem' }}>
            Create Student Account
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default RegisterStudent;
