import React from 'react';
import { Pencil } from 'lucide-react';
import Badge from '../../common/Badge/Badge.jsx';

const UserCard = ({
  name = 'Ram Ambati',
  email = 'ram@example.com',
  role = 'Student',
  initials = 'RA',
  joinDate = '2025-01-15',
  onEdit,
}) => {
  const roleVariant = {
    Student: 'green',
    Instructor: 'gold',
    Admin: 'pink',
  }[role] || 'gray';

  const formatted = new Date(joinDate).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });

  return (
    <div className="user-card">
      <div className="user-card-avatar">{initials}</div>
      <div className="user-card-info">
        <div className="user-card-name">{name}</div>
        <div className="user-card-email">{email}</div>
        <div className="user-card-meta">
          <Badge variant={roleVariant}>{role}</Badge>
          <span className="user-card-joined">Joined {formatted}</span>
        </div>
      </div>
      {onEdit && (
        <button className="user-card-edit-btn" onClick={onEdit} title="Edit profile">
          <Pencil size={14} />
        </button>
      )}
    </div>
  );
};

export default UserCard;
