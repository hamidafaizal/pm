import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Navbar from '../components/Navbar'; // Impor Navbar

function GudangLayout() {
  // Layout ini khusus untuk semua halaman di modul Gudang
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  console.log("GudangLayout component rendered, sidebar open:", isSidebarOpen);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    console.log("Sidebar toggled in GudangLayout, new state:", !isSidebarOpen);
  };

  return (
    <div className="relative w-full h-screen bg-[rgb(var(--background-start-rgb))] overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      
      <div className="flex flex-col w-full h-full">
        <Topbar onMenuClick={toggleSidebar} />
        <Navbar /> {/* Tambahkan Navbar di sini */}
        
        <main className="flex-grow p-8 overflow-y-auto">
          {/* Konten halaman Gudang akan dirender di sini */}
          <Outlet />
        </main>
      </div>
    </div>
  );
}

export default GudangLayout;
