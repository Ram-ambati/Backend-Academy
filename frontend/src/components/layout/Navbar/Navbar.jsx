import React, { useState, useRef, useEffect } from 'react';
import { NavLink, Link, useNavigate } from 'react-router-dom';
import { GraduationCap, Home, BookOpen, Bot, TrendingUp, Search, Bell, LogOut, User, ShieldAlert } from 'lucide-react';
import useAuthStore from '../../../stores/useAuthStore';
import Modal from '../../common/Modal/Modal';
import Button from '../../common/Button/Button';
import Badge from '../../common/Badge/Badge';

const Navbar = ({ onMenuToggle }) => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();

  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const profileWrapperRef = useRef(null);

  /* Close profile dropdown when clicking outside */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileWrapperRef.current && !profileWrapperRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    setIsProfileOpen(false);
    logout();
    navigate('/auth/login', { replace: true });
  };

  const dashboardPath = user?.role === 'INSTRUCTOR' ? '/instructor' : '/dashboard';

  const navLinks = [
    { label: 'Dashboard', path: dashboardPath, icon: Home },
    { label: 'Courses', path: '/courses', icon: BookOpen },
    { label: 'AI Tutor', path: '/ai-tutor', icon: Bot },
    { label: 'Progress', path: '/progress', icon: TrendingUp },
  ];

  const userInitials = user?.initials || user?.name?.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() || 'ST';
  const roleVariant = {
    STUDENT: 'green',
    INSTRUCTOR: 'gold',
    ADMIN: 'pink',
  }[user?.role] || 'gray';

  return (
    <>
      <nav className="navbar">
        {/* Brand */}
        <Link className="navbar-brand" to={dashboardPath}>
          <div className="navbar-logo"><GraduationCap size={18} /></div>
          <span className="navbar-brand-name">
            Backend<span>Academy</span>
          </span>
        </Link>

        <div className="navbar-divider" />

        {/* Nav Links with NavLink for active route indicator */}
        <ul className="navbar-links">
          {navLinks.map((link) => (
            <li key={link.label}>
              <NavLink
                to={link.path}
                className={({ isActive }) => `navbar-link${isActive ? ' active' : ''}`}
              >
                <span className="nav-icon"><link.icon size={16} /></span>
                {link.label}
              </NavLink>
            </li>
          ))}
        </ul>

        {/* Right Section */}
        <div className="navbar-right">
          <button className="navbar-search-btn" title="Search" onClick={() => navigate('/courses')}>
            <Search size={16} />
          </button>

          <button className="navbar-notification-btn" title="Notifications">
            <Bell size={16} />
            <span className="navbar-notif-dot" />
          </button>

          {/* Clickable Profile Avatar & Floating Profile Card */}
          <div className="navbar-avatar-wrapper" ref={profileWrapperRef}>
            <div
              className="navbar-avatar"
              onClick={() => setIsProfileOpen((prev) => !prev)}
              title={`${user?.name || 'User'} (${user?.role || 'STUDENT'})`}
              role="button"
              tabIndex={0}
            >
              {userInitials}
            </div>

            {/* Profile Dropdown Card */}
            {isProfileOpen && (
              <div className="profile-dropdown-card" onClick={(e) => e.stopPropagation()}>
                <div className="profile-dropdown-header">
                  <div className="profile-dropdown-avatar">{userInitials}</div>
                  <div className="profile-dropdown-info">
                    <div className="profile-dropdown-name">{user?.name || 'Student Account'}</div>
                    <div className="profile-dropdown-email">{user?.email || 'student@backendacademy.com'}</div>
                    <div style={{ marginTop: '0.2rem' }}>
                      <Badge variant={roleVariant} size="sm">{user?.role || 'STUDENT'}</Badge>
                    </div>
                  </div>
                </div>

                <div className="profile-dropdown-menu">
                  <NavLink
                    to={dashboardPath}
                    className="profile-dropdown-item"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <Home size={16} /> Dashboard
                  </NavLink>
                  <NavLink
                    to="/courses"
                    className="profile-dropdown-item"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <BookOpen size={16} /> Course Catalog
                  </NavLink>
                  <NavLink
                    to="/progress"
                    className="profile-dropdown-item"
                    onClick={() => setIsProfileOpen(false)}
                  >
                    <TrendingUp size={16} /> Progress Analytics
                  </NavLink>
                  <button
                    type="button"
                    className="profile-dropdown-item profile-dropdown-item--danger"
                    onClick={() => {
                      setIsProfileOpen(false);
                      setIsLogoutModalOpen(true);
                    }}
                    style={{ marginTop: '0.25rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border)' }}
                  >
                    <LogOut size={16} /> Log Out
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Mobile Toggle */}
        <button
          className="navbar-mobile-toggle"
          onClick={onMenuToggle}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </nav>

      {/* Logout Confirmation Modal */}
      <Modal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        title="Confirm Logout"
        size="sm"
        footer={
          <>
            <Button variant="ghost" onClick={() => setIsLogoutModalOpen(false)}>
              Cancel
            </Button>
            <Button variant="danger" onClick={handleConfirmLogout}>
              <LogOut size={16} /> Log Out
            </Button>
          </>
        }
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', padding: '0.5rem 0' }}>
          <div style={{ width: '48px', height: '48px', borderRadius: 'var(--radius-full)', background: 'var(--pink-light)', color: 'var(--pink)', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
            <ShieldAlert size={24} />
          </div>
          <div>
            <p style={{ margin: 0, fontSize: '0.9375rem', fontWeight: 600, color: 'var(--text-dark)' }}>
              Are you sure you want to log out?
            </p>
            <p style={{ margin: '0.25rem 0 0', fontSize: '0.8125rem', color: 'var(--text-muted)' }}>
              You will need to sign in again to access your courses and progress.
            </p>
          </div>
        </div>
      </Modal>
    </>
  );
};

export default Navbar;
