import React, { useState } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Navbar from '../components/layout/Navbar/Navbar';
import Sidebar from '../components/layout/Sidebar/Sidebar';
import Footer from '../components/layout/Footer/Footer';

const AppLayout = () => {
  const [sidebarItem, setSidebarItem] = useState('');
  const location = useLocation();
  const isLearningPage = location.pathname.startsWith('/learn');

  return (
    <div className="app-shell">
      <Navbar />
      <div className="app-body">
        <Sidebar activeItem={sidebarItem} onItemClick={setSidebarItem} />
        <main className="app-main" style={{ padding: 0 }}>
          <Outlet />
        </main>
      </div>
      {!isLearningPage && <Footer />}
    </div>
  );
};

export default AppLayout;
