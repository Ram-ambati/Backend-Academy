import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar/Navbar';
import Sidebar from '../components/layout/Sidebar/Sidebar';
import Footer from '../components/layout/Footer/Footer';

const AppLayout = () => {
  const [sidebarItem, setSidebarItem] = useState('');
  const location = useLocation();
  const isLearningPage = location.pathname.startsWith('/learn');
  const isAiPage = location.pathname === '/ai-tutor';
  const isFullScreenPage = isLearningPage || isAiPage;

  return (
    <div className="app-shell">
      <Navbar />
      <div className="app-body">
        <Sidebar activeItem={sidebarItem} onItemClick={setSidebarItem} />
        <main className="app-main" style={{ padding: 0, overflowY: isFullScreenPage ? 'hidden' : 'auto' }}>
          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minHeight: isFullScreenPage ? 0 : 'auto' }}>
            <Outlet />
          </div>
          {!isFullScreenPage && <Footer />}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;
