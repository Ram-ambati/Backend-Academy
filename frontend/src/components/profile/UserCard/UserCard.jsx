import React from 'react';
import Badge from '../../common/Badge/Badge.jsx';

const UserCard = ({
  name = 'Ram Ambati',
  role = 'Backend Student',
  initials = 'RA',
  avatarUrl = null,
  tags = ['Spring Boot', 'Java', 'SQL'],
  stats = [
    { label: 'Courses', value: 6 },
    { label: 'Lessons', value: 48 },
    { label: 'Streak', value: '12d' },
  ],
  onEditProfile,
}) => {
  return (
    <div className="user-card">
      {/* Banner */}
      <div className="user-card-banner">
        <div className="user-card-avatar-wrap">
          <div className="user-card-avatar">
            {avatarUrl ? <img src={avatarUrl} alt={name} /> : initials}
          </div>
        </div>
      </div>

      {/* Body */}
      <div className="user-card-body">
        <div className="user-card-name">{name}</div>
        <div className="user-card-role">{role}</div>

        <div className="user-card-tags">
          {tags.map((tag) => (
            <Badge key={tag} variant="gold" size="sm">{tag}</Badge>
          ))}
        </div>

        <div className="user-card-stats">
          {stats.map((s) => (
            <div key={s.label} className="user-card-stat">
              <span className="user-card-stat-value">{s.value}</span>
              <span className="user-card-stat-label">{s.label}</span>
            </div>
          ))}
        </div>

        {onEditProfile && (
          <div className="user-card-actions">
            <button className="btn btn--outline-gold btn--sm" onClick={onEditProfile}>
              ✏️ Edit Profile
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserCard;
