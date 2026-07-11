import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { login } from '../../api/auth.api';
import useAuthStore from '../../stores/useAuthStore';
import { useToast } from '../../components/common/Toast/Toast';
import Input from '../../components/common/Input/Input';
import Button from '../../components/common/Button/Button';
import Card from '../../components/common/Card/Card';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();
  const setAuth = useAuthStore(state => state.login);
  const { addToast } = useToast();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { token, user } = await login(email, password);
      
      // Update Zustand store
      setAuth(token, user);
      
      addToast({ type: 'success', title: 'Welcome back!', message: `Logged in as ${user.name}` });

      // Role-based routing
      if (user.role === 'ADMIN') {
        navigate('/admin');
      } else if (user.role === 'INSTRUCTOR') {
        navigate('/instructor');
      } else {
        navigate('/courses'); // Student lands on courses catalog
      }

    } catch (err) {
      addToast({ type: 'error', title: 'Login Failed', message: err.message });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'var(--bg-muted)' }}>
      <Card style={{ width: '100%', maxWidth: '400px', padding: '2rem' }}>
        <h2 style={{ textAlign: 'center', marginBottom: '2rem', fontSize: '1.5rem', color: 'var(--text-dark)' }}>
          Sign In
        </h2>
        
        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
          <Input 
            label="Email Address" 
            type="email" 
            id="email" 
            value={email} 
            onChange={(e) => setEmail(e.target.value)} 
            required 
            placeholder="student@test.com"
          />
          <Input 
            label="Password" 
            type="password" 
            id="password" 
            value={password} 
            onChange={(e) => setPassword(e.target.value)} 
            required 
            placeholder="password"
          />
          
          <Button variant="primary" type="submit" isLoading={isLoading} style={{ marginTop: '0.5rem' }}>
            Sign In
          </Button>
        </form>

        <div style={{ marginTop: '1.5rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-muted)' }}>
          <p>Demo accounts (pwd: password):</p>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: '0.5rem' }}>
            <li><code>student@test.com</code></li>
            <li><code>instructor@test.com</code></li>
            <li><code>admin@test.com</code></li>
          </ul>
        </div>
      </Card>
    </div>
  );
};

export default Login;
