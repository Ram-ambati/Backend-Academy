import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/layout/Navbar/Navbar';

const AdminLayout = () => {
  return (
    <div className="app-shell" style={{ display: 'flex', flexDirection: 'column', height: '100vh' }}>
      <Navbar />
      <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
        {/* Simplified Admin Sidebar */}
        <aside style={{ width: '260px', background: 'var(--white)', borderRight: '1.5px solid var(--border)', padding: '1rem' }}>
          <h3 style={{ color: 'var(--text-muted)', fontSize: '0.75rem', textTransform: 'uppercase', marginBottom: '1rem' }}>Admin Console</h3>
          <ul style={{ listStyle: 'none', padding: 0, margin: 0, display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
            <li style={{ padding: '0.5rem', background: 'var(--bg-muted)', borderRadius: 'var(--radius-md)', fontWeight: 600 }}>Dashboard</li>
            <li style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>Users</li>
            <li style={{ padding: '0.5rem', borderRadius: 'var(--radius-md)', color: 'var(--text-muted)' }}>Courses</li>
          </ul>
        </aside>
        <main style={{ flex: 1, overflowY: 'auto', background: 'var(--bg-muted)' }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
