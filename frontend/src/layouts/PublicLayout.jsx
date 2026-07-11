import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const PublicLayout = () => {
  return (
    <div className="public-layout" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column' }}>
      {/* We can put a simpler Navbar here later if needed, for now just Outlet */}
      <main style={{ flex: 1 }}>
        <Outlet />
      </main>
    </div>
  );
};

export default PublicLayout;
