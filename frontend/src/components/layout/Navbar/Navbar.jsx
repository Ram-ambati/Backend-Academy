import React, { useState } from 'react';

const Navbar = ({ user = { name: 'Ram A', initials: 'RA', role: 'Student' }, onMenuToggle }) => {
  const [activeLink, setActiveLink] = useState('Courses');

  const navLinks = [
    { label: 'Dashboard', icon: '🏠' },
    { label: 'Courses', icon: '📚' },
    { label: 'Lessons', icon: '📖' },
    { label: 'Progress', icon: '📈' },
  ];

  return (
    <nav className="navbar">
      {/* Brand */}
      <a className="navbar-brand" href="/">
        <div className="navbar-logo">🎓</div>
        <span className="navbar-brand-name">
          Backend<span>Academy</span>
        </span>
      </a>

      <div className="navbar-divider" />

      {/* Nav Links */}
      <ul className="navbar-links">
        {navLinks.map((link) => (
          <li key={link.label}>
            <a
              className={`navbar-link${activeLink === link.label ? ' active' : ''}`}
              onClick={() => setActiveLink(link.label)}
              href="#"
            >
              <span className="nav-icon">{link.icon}</span>
              {link.label}
            </a>
          </li>
        ))}
      </ul>

      {/* Right Section */}
      <div className="navbar-right">
        <button className="navbar-search-btn" title="Search">🔍</button>

        <button className="navbar-notification-btn" title="Notifications">
          🔔
          <span className="navbar-notif-dot" />
        </button>

        <div className="navbar-avatar-wrapper" title={user.name}>
          <div className="navbar-avatar">{user.initials}</div>
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
  );
};

export default Navbar;
