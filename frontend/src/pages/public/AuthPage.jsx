import React, { useState, useCallback } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { login, registerStudent, registerInstructor } from '../../api/auth.api';
import useAuthStore from '../../stores/useAuthStore';
import { useToast } from '../../components/common/Toast/Toast';
import { GraduationCap, BookOpen, UserCog } from 'lucide-react';

/* ── Design System Components ── */
import Button from '../../components/common/Button/Button';
import Input from '../../components/common/Input/Input';
import Card from '../../components/common/Card/Card';
import Alert from '../../components/common/Alert/Alert';
import Badge from '../../components/common/Badge/Badge';

/* =====================================================
   EMAIL VALIDATION
   ===================================================== */
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

const validateEmail = (email) => {
  if (!email) return '';
  if (!EMAIL_REGEX.test(email)) return 'Invalid email format';
  return '';
};

const validatePassword = (password, isRegister) => {
  if (!password) return '';
  if (isRegister && password.length < 6) return 'Password must be at least 6 characters';
  return '';
};

/* =====================================================
   AUTH PAGE (Login + Register)
   ===================================================== */
const AuthPage = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const setAuth = useAuthStore((state) => state.login);
  const { addToast } = useToast();

  /* ── Derive mode from route path ── */
  const isRegister = location.pathname.includes('register');

  /* ── Form State ── */
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    role: 'STUDENT', // STUDENT | INSTRUCTOR
    experience: 'Junior',
    credentials: '',
    bio: '',
  });

  const [errors, setErrors] = useState({});
  const [apiError, setApiError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [touched, setTouched] = useState({});

  /* ── Handlers ── */
  const handleChange = useCallback((field) => (e) => {
    const value = e.target.value;
    setForm((prev) => ({ ...prev, [field]: value }));
    setApiError(''); // Clear API error when user corrects input

    // Live validation on touched fields
    if (field === 'email') {
      setErrors((prev) => ({ ...prev, email: validateEmail(value) }));
    }
    if (field === 'password') {
      setErrors((prev) => ({ ...prev, password: validatePassword(value, isRegister) }));
    }
  }, [isRegister]);

  const handleBlur = useCallback((field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === 'email') {
      setErrors((prev) => ({ ...prev, email: validateEmail(form.email) }));
    }
    if (field === 'password') {
      setErrors((prev) => ({ ...prev, password: validatePassword(form.password, isRegister) }));
    }
  }, [form.email, form.password, isRegister]);

  const setRole = useCallback((role) => {
    setForm((prev) => ({ ...prev, role }));
  }, []);

  /* ── Mode Toggle ── */
  const toggleMode = useCallback(() => {
    setApiError('');
    setErrors({});
    setTouched({});
    if (isRegister) {
      navigate('/auth/login', { replace: true });
    } else {
      navigate('/auth/register', { replace: true });
    }
  }, [isRegister, navigate]);

  /* ── Submit ── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setApiError('');

    // Client-side validation gate
    const emailErr = validateEmail(form.email);
    const passErr = validatePassword(form.password, isRegister);
    if (emailErr || passErr) {
      setErrors({ email: emailErr, password: passErr });
      setTouched({ email: true, password: true });
      return;
    }

    setIsLoading(true);

    try {
      let result;

      if (isRegister) {
        if (form.role === 'INSTRUCTOR') {
          result = await registerInstructor({
            name: form.name,
            email: form.email,
            password: form.password,
            credentials: form.credentials,
            bio: form.bio,
          });
        } else {
          result = await registerStudent({
            name: form.name,
            email: form.email,
            password: form.password,
            experience: form.experience,
          });
        }
      } else {
        result = await login(form.email, form.password);
      }

      const { token, user } = result;

      // ── Auth Handoff: Zustand → Router ──
      setAuth(token, user);

      addToast({
        type: 'success',
        title: isRegister ? 'Welcome to Backend Academy!' : 'Welcome back!',
        message: isRegister
          ? `Your ${user.role?.toLowerCase()} account is ready.`
          : `Logged in as ${user.name}`,
      });

      // ── Role-based routing fork ──
      if (user.role === 'ADMIN') {
        navigate('/admin', { replace: true });
      } else if (user.role === 'INSTRUCTOR') {
        navigate('/instructor', { replace: true });
      } else {
        navigate('/dashboard', { replace: true });
      }
    } catch (err) {
      // ── Error Routing ──
      const status = err?.response?.status;

      if (status >= 500) {
        // Server error → Global toast (our fault)
        addToast({
          type: 'error',
          title: 'Server Error',
          message: 'Something went wrong on our end. Please try again later.',
          duration: 6000,
        });
      } else {
        // Client error (401, 400, 409) → Inline alert (their input)
        setApiError(err.message || 'Something went wrong. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  /* ── Render ── */
  return (
    <div className="auth-page">
      {/* ── Background decoration ── */}
      <div className="auth-bg" aria-hidden="true">
        <div className="auth-bg-orb auth-bg-orb--gold" />
        <div className="auth-bg-orb auth-bg-orb--green" />
      </div>

      <main className="auth-main">
        {/* ── Brand ── */}
        <a className="auth-brand" href="/">
          <div className="navbar-logo"><GraduationCap size={20} /></div>
          <span className="navbar-brand-name">
            Backend<span>Academy</span>
          </span>
        </a>

        {/* ── Auth Card ── */}
        <Card className="auth-card">
          <div className="auth-card-inner">
            {/* ── Header ── */}
            <div className="auth-header">
              <h2 className="auth-title">
                {isRegister ? 'Create your account' : 'Welcome back'}
              </h2>
              <p className="auth-subtitle">
                {isRegister
                  ? 'Join Backend Academy and start building production-grade systems.'
                  : 'Log in to your account to continue learning.'}
              </p>
            </div>

            {/* ── API Error Alert ── */}
            {apiError && (
              <Alert
                type="error"
                title={isRegister ? 'Registration Failed' : 'Authentication Failed'}
                dismissible={true}
                onDismiss={() => setApiError('')}
              >
                {apiError}
              </Alert>
            )}

            {/* ── Form ── */}
            <form className="auth-form" onSubmit={handleSubmit} noValidate>

              {/* ── Role Selector (Register only) ── */}
              {isRegister && (
                <div className="auth-role-selector">
                  <span className="auth-role-label">I want to…</span>
                  <div className="auth-role-buttons">
                    <button
                      type="button"
                      className={`auth-role-btn${form.role === 'STUDENT' ? ' auth-role-btn--active auth-role-btn--student' : ''}`}
                      onClick={() => setRole('STUDENT')}
                    >
                      <span className="auth-role-btn-icon"><BookOpen size={22} /></span>
                      <span className="auth-role-btn-text">Learn</span>
                      <span className="auth-role-btn-desc">Student</span>
                    </button>
                    <button
                      type="button"
                      className={`auth-role-btn${form.role === 'INSTRUCTOR' ? ' auth-role-btn--active auth-role-btn--instructor' : ''}`}
                      onClick={() => setRole('INSTRUCTOR')}
                    >
                      <span className="auth-role-btn-icon"><UserCog size={22} /></span>
                      <span className="auth-role-btn-text">Teach</span>
                      <span className="auth-role-btn-desc">Instructor</span>
                    </button>
                  </div>
                </div>
              )}

              {/* ── Name (Register only) ── */}
              {isRegister && (
                <Input
                  label="Full Name"
                  id="auth-name"
                  type="text"
                  placeholder="Ram Ambati"
                  value={form.name}
                  onChange={handleChange('name')}
                  required
                />
              )}

              {/* ── Email ── */}
              <Input
                label="Email Address"
                id="auth-email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange('email')}
                onBlur={handleBlur('email')}
                error={touched.email ? errors.email : ''}
                required
              />

              {/* ── Password ── */}
              <Input
                label="Password"
                id="auth-password"
                type="password"
                placeholder={isRegister ? 'Choose a strong password' : 'Enter your password'}
                value={form.password}
                onChange={handleChange('password')}
                onBlur={handleBlur('password')}
                error={touched.password ? errors.password : ''}
                hint={isRegister ? 'At least 6 characters' : ''}
                required
              />

              {/* ── Student-specific fields ── */}
              {isRegister && form.role === 'STUDENT' && (
                <div className="auth-field-group">
                  <label className="input-label" htmlFor="auth-experience">Experience Level</label>
                  <select
                    id="auth-experience"
                    className="auth-select"
                    value={form.experience}
                    onChange={handleChange('experience')}
                  >
                    <option value="Junior">Junior (Beginner)</option>
                    <option value="Intermediate">Intermediate</option>
                    <option value="Expert">Expert (Advanced)</option>
                  </select>
                </div>
              )}

              {/* ── Instructor-specific fields ── */}
              {isRegister && form.role === 'INSTRUCTOR' && (
                <>
                  <Input
                    label="Credentials / Expertise"
                    id="auth-credentials"
                    type="text"
                    placeholder="e.g. Senior Engineer at Google"
                    value={form.credentials}
                    onChange={handleChange('credentials')}
                    required
                  />
                  <div className="auth-field-group">
                    <label className="input-label" htmlFor="auth-bio">Short Bio</label>
                    <textarea
                      id="auth-bio"
                      className="auth-textarea"
                      placeholder="Tell students about your teaching style…"
                      value={form.bio}
                      onChange={handleChange('bio')}
                      rows={3}
                    />
                  </div>
                </>
              )}

              {/* ── Submit ── */}
              <Button
                variant="primary"
                size="lg"
                type="submit"
                isLoading={isLoading}
                className="auth-submit-btn"
              >
                {isRegister ? 'Create Account' : 'Sign In'}
              </Button>
            </form>

            {/* ── Footer: Mode Toggle + Forgot Password ── */}
            <div className="auth-footer">
              <p className="auth-footer-text">
                {isRegister ? 'Already have an account?' : 'Don\'t have an account?'}{' '}
                <button
                  type="button"
                  className="auth-footer-link"
                  onClick={toggleMode}
                >
                  {isRegister ? 'Sign in' : 'Sign up'}
                </button>
              </p>
              {!isRegister && (
                <button type="button" className="auth-footer-forgot">
                  Forgot password?
                </button>
              )}
            </div>

            {/* ── Demo credentials (dev only) ── */}
            <div className="auth-demo-hint">
              <Badge variant="gray" size="sm">Demo</Badge>
              <span>
                Use <code>student@test.com</code> / <code>instructor@test.com</code> / <code>admin@test.com</code> with password <code>password</code>
              </span>
            </div>
          </div>
        </Card>
      </main>
    </div>
  );
};

export default AuthPage;
