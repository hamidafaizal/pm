import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';

function MainLayout() {
  // Komponen ini berfungsi sebagai layout utama (Sidebar + Topbar)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  console.log("MainLayout component rendered, sidebar open:", isSidebarOpen);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    console.log("Sidebar toggled, new state:", !isSidebarOpen);
  };

  return (
    <div className="relative w-full h-screen bg-[rgb(var(--background-start-rgb))] overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      
      <div className="flex flex-col w-full h-full">
        <Topbar onMenuClick={toggleSidebar} />
        
        <main className="flex-grow p-8">
          {/* Konten halaman (seperti Dashboard) akan dirender di sini */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default MainLayout;
