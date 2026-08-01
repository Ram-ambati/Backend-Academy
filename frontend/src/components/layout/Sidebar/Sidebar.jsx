import React, { useState, useRef, useEffect } from 'react';
import { NavLink, useNavigate, useLocation } from 'react-router-dom';
import {
  Home,
  BookOpen,
  Book,
  Settings,
  Database,
  Shield,
  Globe,
  FlaskConical,
  Bot,
  TrendingUp,
  ChevronLeft,
  ChevronRight,
  LogOut,
  ShieldAlert,
  PlayCircle
} from 'lucide-react';
import useAuthStore from '../../../stores/useAuthStore';
import Modal from '../../common/Modal/Modal';
import Button from '../../common/Button/Button';
import Badge from '../../common/Badge/Badge';
import { getCourseLessons } from '../../../api/lesson.api';

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuthStore();

  const [collapsed, setCollapsed] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  // Dynamic Course State
  const [currentCourseId, setCurrentCourseId] = useState(null);
  const [currentLessons, setCurrentLessons] = useState([]);

  const sidebarFooterRef = useRef(null);

  /* Close profile card when clicking outside */
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (sidebarFooterRef.current && !sidebarFooterRef.current.contains(event.target)) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Parse URL to find if we're in a course context
  useEffect(() => {
    const match = location.pathname.match(/\/(courses|learn)\/(\d+)/);
    if (match && match[2]) {
      const parsedId = parseInt(match[2], 10);
      if (parsedId !== currentCourseId) {
        setCurrentCourseId(parsedId);
      }
    } else {
      setCurrentCourseId(null);
    }
  }, [location.pathname, currentCourseId]);

  // Fetch lessons when course context changes
  useEffect(() => {
    if (currentCourseId) {
      getCourseLessons(currentCourseId)
        .then(setLessons => setCurrentLessons(setLessons))
        .catch(console.error);
    } else {
      setCurrentLessons([]);
    }
  }, [currentCourseId]);

  const handleConfirmLogout = () => {
    setIsLogoutModalOpen(false);
    setIsProfileOpen(false);
    logout();
    navigate('/auth/login', { replace: true });
  };

  const userInitials = user?.initials || user?.name?.split(' ').map((n) => n[0]).join('').substring(0, 2).toUpperCase() || 'ST';
  const userRole = user?.role || 'STUDENT';
  const roleVariant = {
    STUDENT: 'green',
    INSTRUCTOR: 'gold',
    ADMIN: 'pink',
  }[userRole] || 'gray';

  /* ── 1. Getting Started section ── */
  const gettingStartedItems = [
    { icon: Home, label: 'Dashboard', path: userRole === 'INSTRUCTOR' ? '/instructor' : '/dashboard' },
    { icon: BookOpen, label: 'All Courses', path: '/courses' },
  ];

  /* ── 3. Explore section ── */
  const exploreItems = [
    { icon: Bot, label: 'AI Tutor', path: '/ai-tutor' },
    { icon: TrendingUp, label: 'Progress', path: '/progress' },
  ];

  return (
    <>
      <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
        {/* Header */}
        <div className="sidebar-header">
          <span className="sidebar-title">Navigation</span>
          <button
            className="sidebar-toggle"
            onClick={() => setCollapsed((c) => !c)}
            title={collapsed ? 'Expand' : 'Collapse'}
          >
            {collapsed ? <ChevronRight size={14} /> : <ChevronLeft size={14} />}
          </button>
        </div>

        {/* Section 1: Getting Started */}
        <div className="sidebar-section">
          <div className="sidebar-section-label">Getting Started</div>
          {gettingStartedItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <span className="sidebar-nav-icon"><item.icon size={16} /></span>
              <span className="sidebar-nav-label">{item.label}</span>
            </NavLink>
          ))}
          <div className="sidebar-divider" />
        </div>

        {/* Section 2: Current Course (Dynamic) */}
        {currentCourseId && currentLessons.length > 0 && (
          <div className="sidebar-section">
            <div className="sidebar-section-label">Course Lessons</div>
            {currentLessons.map((lesson) => (
              <NavLink
                key={lesson.id}
                to={`/learn/${currentCourseId}/${lesson.id}`}
                className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
                title={collapsed ? lesson.title : undefined}
              >
                <span className="sidebar-nav-icon"><PlayCircle size={16} /></span>
                <span className="sidebar-nav-label" style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {lesson.title}
                </span>
              </NavLink>
            ))}
            <div className="sidebar-divider" />
          </div>
        )}

        {/* Section 3: Explore */}
        <div className="sidebar-section">
          <div className="sidebar-section-label">Explore</div>
          {exploreItems.map((item) => (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) => `sidebar-nav-item${isActive ? ' active' : ''}`}
              title={collapsed ? item.label : undefined}
            >
              <span className="sidebar-nav-icon"><item.icon size={16} /></span>
              <span className="sidebar-nav-label">{item.label}</span>
            </NavLink>
          ))}
          <div className="sidebar-divider" />
        </div>

        {/* User Profile Footer — Clicking opens same Profile Card */}
        <div className="sidebar-footer" ref={sidebarFooterRef} style={{ position: 'relative' }}>
          <div
            className="sidebar-user-mini"
            onClick={() => setIsProfileOpen((prev) => !prev)}
            title={`${user?.name || 'User'} (${userRole})`}
            role="button"
            tabIndex={0}
          >
            <div className="sidebar-user-avatar">{userInitials}</div>
            <div className="sidebar-user-info">
              <div className="sidebar-user-name">{user?.name || 'Student Account'}</div>
              <div className="sidebar-user-role">{userRole}</div>
            </div>
          </div>

          {/* Floating Profile Card */}
          {isProfileOpen && (
            <div
              className="profile-dropdown-card"
              style={{ bottom: 'calc(100% + 12px)', top: 'auto', left: '0', right: 'auto' }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="profile-dropdown-header">
                <div className="profile-dropdown-avatar">{userInitials}</div>
                <div className="profile-dropdown-info">
                  <div className="profile-dropdown-name">{user?.name || 'Student Account'}</div>
                  <div className="profile-dropdown-email">{user?.email || 'student@backendacademy.com'}</div>
                  <div style={{ marginTop: '0.2rem' }}>
                    <Badge variant={roleVariant} size="sm">{userRole}</Badge>
                  </div>
                </div>
              </div>

              <div className="profile-dropdown-menu">
                <NavLink
                  to="/dashboard"
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
      </aside>

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
          <div
            style={{
              width: '48px',
              height: '48px',
              borderRadius: 'var(--radius-full)',
              background: 'var(--pink-light)',
              color: 'var(--pink)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              flexShrink: 0,
            }}
          >
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

export default Sidebar;
