import React, { useState } from 'react';

const Sidebar = ({
  activeItem = 'Introduction',
  onItemClick,
  user = { name: 'Ram Ambati', role: 'Student', initials: 'RA' },
}) => {
  const [collapsed, setCollapsed] = useState(false);

  const sections = [
    {
      label: 'Getting Started',
      items: [
        { icon: '🏠', label: 'Dashboard', badge: null },
        { icon: '📚', label: 'All Courses', badge: null },
      ],
    },
    {
      label: 'Current Course',
      items: [
        { icon: '📖', label: 'Introduction', badge: null },
        { icon: '⚙️', label: 'Spring Boot Basics', badge: null },
        { icon: '🗄️', label: 'Database Design', badge: '3' },
        { icon: '🔐', label: 'Security & Auth', badge: null },
        { icon: '🌐', label: 'REST API Design', badge: null },
        { icon: '🧪', label: 'Testing', badge: null },
      ],
    },
    {
      label: 'Explore',
      items: [
        { icon: '🤖', label: 'AI Tutor', badge: null },
        { icon: '📊', label: 'Progress', badge: null },
        { icon: '🏆', label: 'Achievements', badge: '2' },
      ],
    },
  ];

  return (
    <aside className={`sidebar${collapsed ? ' collapsed' : ''}`}>
      {/* Header */}
      <div className="sidebar-header">
        <span className="sidebar-title">Navigation</span>
        <button
          className="sidebar-toggle"
          onClick={() => setCollapsed((c) => !c)}
          title={collapsed ? 'Expand' : 'Collapse'}
        >
          {collapsed ? '›' : '‹'}
        </button>
      </div>

      {/* Sections */}
      {sections.map((section) => (
        <div key={section.label} className="sidebar-section">
          <div className="sidebar-section-label">{section.label}</div>
          {section.items.map((item) => (
            <a
              key={item.label}
              className={`sidebar-nav-item${activeItem === item.label ? ' active' : ''}`}
              onClick={() => onItemClick?.(item.label)}
              href="#"
              title={collapsed ? item.label : undefined}
            >
              <span className="sidebar-nav-icon">{item.icon}</span>
              <span className="sidebar-nav-label">{item.label}</span>
              {item.badge && (
                <span className="sidebar-nav-badge">{item.badge}</span>
              )}
            </a>
          ))}
          <div className="sidebar-divider" />
        </div>
      ))}

      {/* User Footer */}
      <div className="sidebar-footer">
        <div className="sidebar-user-mini" title={user.name}>
          <div className="sidebar-user-avatar">{user.initials}</div>
          <div className="sidebar-user-info">
            <div className="sidebar-user-name">{user.name}</div>
            <div className="sidebar-user-role">{user.role}</div>
          </div>
        </div>
      </div>
    </aside>
  );
};

export default Sidebar;
