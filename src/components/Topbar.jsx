import React, { useState } from 'react';
import ProfileModal from './modals/Profile';
import { Menu } from 'lucide-react';

function Topbar({ onMenuClick }) {
  // State untuk mengontrol visibilitas modal profil
  const [isProfileModalOpen, setProfileModalOpen] = useState(false);
  console.log("Topbar component rendered, profile modal open:", isProfileModalOpen);

  // Fungsi untuk toggle modal profil
  const toggleProfileModal = () => {
    setProfileModalOpen(!isProfileModalOpen);
    console.log("Profile modal toggled, new state:", !isProfileModalOpen);
  };

  return (
    <>
      <header className="glass-container !p-4 w-full flex items-center justify-between !rounded-none !border-l-0 !border-r-0 !border-t-0">
        {/* Sisi Kiri Topbar */}
        <div className="flex items-center space-x-4">
          {/* Tombol Hamburger */}
          <button className="text-white" onClick={onMenuClick}>
            <Menu size={24} />
          </button>
          {/* Logo Aplikasi */}
          <img src="/logopm.svg" alt="App Logo" className="h-8" />
        </div>

        {/* Sisi Kanan Topbar */}
        <div className="flex items-center space-x-4">
          {/* Searchbar */}
          <div className="relative">
            <input
              type="text"
              placeholder="Search..."
              className="custom-btn !py-2 !px-4 rounded-full w-64 bg-transparent border border-gray-600 focus:outline-none"
            />
          </div>
          {/* Avatar Profile */}
          <div 
            className="w-10 h-10 bg-gray-500 rounded-full flex items-center justify-center cursor-pointer"
            onClick={toggleProfileModal}
          >
            <span className="text-white font-bold">U</span>
          </div>
        </div>
      </header>

      {/* Render Komponen Modal Profil */}
      <ProfileModal isOpen={isProfileModalOpen} onClose={toggleProfileModal} />
    </>
  );
}

export default Topbar;
