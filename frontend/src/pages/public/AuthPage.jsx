import React, { useState, useCallback, useEffect } from 'react';
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
  if (!email || email.trim() === '') return 'Email is required.';
  if (email.trim().length > 100) return 'Email cannot exceed 100 characters.';
  if (!EMAIL_REGEX.test(email.trim())) return 'Invalid email format';
  return '';
};

const validateName = (name, isRegister) => {
  if (!isRegister) return '';
  if (!name || name.trim() === '') return 'Full Name is required.';
  if (name.trim().length > 20) return 'Full Name cannot exceed 20 characters.';
  return '';
};

const validatePassword = (password, isRegister) => {
  if (!password) return 'Password is required.';
  if (isRegister && password.length < 6) return 'Password must be at least 6 characters.';
  if (isRegister && password.length > 50) return 'Password cannot exceed 50 characters.';
  return '';
};

const validateConfirmPassword = (password, confirmPassword, isRegister) => {
  if (!isRegister) return '';
  if (!confirmPassword) return 'Please confirm your password.';
  if (password !== confirmPassword) return 'Passwords do not match.';
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

  /* ── Expired Session Handling ── */
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get('expired') === 'true') {
      addToast({
        type: 'error',
        title: 'Session Expired',
        message: 'Your session has expired. Please log in again.'
      });
      navigate('/auth/login', { replace: true });
    }
  }, [location, navigate, addToast]);

  /* ── Form State ── */
  const [form, setForm] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
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
    setForm((prev) => {
      const nextForm = { ...prev, [field]: value };
      
      // Live validation on touched fields
      if (field === 'name') {
        setErrors((errs) => ({ ...errs, name: validateName(value, isRegister) }));
      }
      if (field === 'email') {
        setErrors((errs) => ({ ...errs, email: validateEmail(value) }));
      }
      if (field === 'password' || field === 'confirmPassword') {
        setErrors((errs) => ({ 
          ...errs, 
          password: validatePassword(nextForm.password, isRegister),
          confirmPassword: validateConfirmPassword(nextForm.password, nextForm.confirmPassword, isRegister)
        }));
      }
      return nextForm;
    });
    setApiError(''); 
  }, [isRegister]);

  const handleBlur = useCallback((field) => () => {
    setTouched((prev) => ({ ...prev, [field]: true }));
    if (field === 'name') {
      setErrors((prev) => ({ ...prev, name: validateName(form.name, isRegister) }));
    }
    if (field === 'email') {
      setErrors((prev) => ({ ...prev, email: validateEmail(form.email) }));
    }
    if (field === 'password' || field === 'confirmPassword') {
      setErrors((prev) => ({ 
        ...prev, 
        password: validatePassword(form.password, isRegister),
        confirmPassword: validateConfirmPassword(form.password, form.confirmPassword, isRegister)
      }));
    }
  }, [form, isRegister]);

  const setRole = useCallback((role) => {
    setForm((prev) => ({ ...prev, role }));
  }, []);

  /* ── Mode Toggle ── */
  const toggleMode = useCallback(() => {
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

    // Client-side validation gate
    const nameErr = validateName(form.name, isRegister);
    const emailErr = validateEmail(form.email);
    const passErr = validatePassword(form.password, isRegister);
    const confirmPassErr = validateConfirmPassword(form.password, form.confirmPassword, isRegister);
    if (nameErr || emailErr || passErr || confirmPassErr) {
      setErrors({ name: nameErr, email: emailErr, password: passErr, confirmPassword: confirmPassErr });
      setTouched({ name: true, email: true, password: true, confirmPassword: true });
      return;
    }

    setIsLoading(true);

    try {
      let result;
      const cleanEmail = form.email.trim().toLowerCase();
      const cleanName = form.name.trim();

      if (isRegister) {
        if (form.role === 'INSTRUCTOR') {
          result = await registerInstructor({
            name: cleanName,
            email: cleanEmail,
            password: form.password,
            credentials: form.credentials,
            bio: form.bio,
          });
        } else {
          result = await registerStudent({
            name: cleanName,
            email: cleanEmail,
            password: form.password,
            experience: form.experience,
          });
        }
      } else {
        result = await login(cleanEmail, form.password);
      }

      const { token, refreshToken, user } = result;

      // ── Auth Handoff: Zustand → Router ──
      setAuth(token, user, refreshToken);

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
      const errorMessage = err.message || 'Something went wrong. Please try again.';

      addToast({
        type: 'error',
        title: isRegister ? 'Registration Failed' : 'Authentication Failed',
        message: errorMessage,
        duration: 6000,
      });
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

      <main className="auth-main auth-main--split">
        {/* ── Left Side Text (Split Layout) ── */}
        <div className="auth-split-left">
          <a className="auth-brand" href="/">
            <div className="navbar-logo"><GraduationCap size={28} /></div>
            <span className="navbar-brand-name" style={{ fontSize: '1.5rem' }}>
              Backend<span>Academy</span>
            </span>
          </a>
          <div className="auth-split-text">
            <h1 className="auth-split-title">
              {isRegister ? 'Master Backend Engineering' : 'Welcome Back'}
            </h1>
            <p className="auth-split-desc">
              {isRegister 
                ? 'Join thousands of developers building production-grade systems from first principles. Start learning today.'
                : 'Log in to continue your journey and pick up right where you left off.'}
            </p>
          </div>

          {/* ── Role Selector (Register only) moved to left side ── */}
          {isRegister && (
            <div className="auth-role-selector" style={{ marginTop: '1rem' }}>
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
        </div>

        {/* ── Right Side Form ── */}
        <div className="auth-split-right">
          <Card className="auth-card">
            <div className="auth-card-inner">
              {/* ── Header ── */}
              <div className="auth-header">
                <h2 className="auth-title">
                  {isRegister ? 'Create your account' : 'Log in'}
                </h2>
                <p className="auth-subtitle">
                  {isRegister
                    ? 'Get started by creating your account below.'
                    : 'Enter your credentials to access your account.'}
                </p>
              </div>

              {/* ── Form ── */}
              <form className="auth-form" onSubmit={handleSubmit} noValidate>

              {/* ── Name (Register only) ── */}
              {isRegister && (
                <Input
                  label="Full Name"
                  id="auth-name"
                  type="text"
                  placeholder="Ram Ambati"
                  value={form.name}
                  onChange={handleChange('name')}
                  onBlur={handleBlur('name')}
                  error={touched.name ? errors.name : ''}
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

              {/* ── Confirm Password (Register only) ── */}
              {isRegister && (
                <Input
                  label="Confirm Password"
                  id="auth-confirm-password"
                  type="password"
                  placeholder="Repeat your password"
                  value={form.confirmPassword}
                  onChange={handleChange('confirmPassword')}
                  onBlur={handleBlur('confirmPassword')}
                  error={touched.confirmPassword ? errors.confirmPassword : ''}
                  required
                />
              )}

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
                disabled={isLoading}
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
        </div>
      </main>
    </div>
  );
};

export default AuthPage;
