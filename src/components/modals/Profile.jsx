import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X, User, Settings, LogOut } from 'lucide-react';
import { supabase } from '../../supabase/client';

// --- Data Menu dengan Ikon ---
const menuItems = [
  { name: 'Profil Kamu', icon: <User size={16} className="mr-3" /> },
  { name: 'Pengaturan', icon: <Settings size={16} className="mr-3" /> },
];

function ProfileModal({ isOpen, onClose }) {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [isRendered, setIsRendered] = useState(false);
  const [isActive, setIsActive] = useState(false); // State baru untuk mengontrol kelas animasi

  useEffect(() => {
    let openTimer;
    let closeTimer;

    if (isOpen) {
      setIsRendered(true); // 1. Render komponen
      
      // 2. Beri jeda sesaat agar komponen ter-render dalam keadaan tersembunyi
      openTimer = setTimeout(() => {
        setIsActive(true); // 3. Aktifkan animasi masuk
      }, 10);

      const fetchUser = async () => {
        const { data: { user } } = await supabase.auth.getUser();
        setUser(user);
        console.log("User data fetched for profile modal:", user);
      };
      fetchUser();

    } else {
      setIsActive(false); // 1. Aktifkan animasi keluar
      // 2. Tunggu animasi selesai sebelum unmount
      closeTimer = setTimeout(() => setIsRendered(false), 300);
    }

    // Cleanup timers
    return () => {
      clearTimeout(openTimer);
      clearTimeout(closeTimer);
    };
  }, [isOpen]);

  console.log("Profile panel component rendered, isOpen:", isOpen);

  const handleLogout = async () => {
    console.log("Attempting to log out");
    try {
      const { error } = await supabase.auth.signOut();
      if (error) throw error;
      console.log("Logout successful, navigating to login");
      navigate('/login');
    } catch (error) {
      console.error("Logout error:", error.message);
    }
  };

  if (!isRendered) {
    return null;
  }

  return (
    <div
      className={`glass-container !p-0 w-72 h-screen absolute top-0 right-0 z-30 flex flex-col transform transition-transform duration-300 ease-in-out ${isActive ? 'translate-x-0' : 'translate-x-full'}`}
    >
      {/* Header Panel */}
      <div className="flex justify-between items-center p-3 border-b border-gray-700">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 bg-gray-500 rounded-full flex items-center justify-center">
            <span className="text-white font-bold">
              {user?.user_metadata?.display_name?.charAt(0).toUpperCase() || 'U'}
            </span>
          </div>
          <span className="font-semibold text-sm">
            {user?.user_metadata?.display_name || 'Loading...'}
          </span>
        </div>
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={20} />
        </button>
      </div>

      {/* Menu Navigasi Panel */}
      <nav className="flex-grow p-2">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name}>
              <a href="#" className="flex items-center px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-gray-700 group">
                {item.icon}
                {item.name}
              </a>
            </li>
          ))}
        </ul>
        <hr className="my-2 border-gray-700" />
        <ul>
          <li>
            <button onClick={handleLogout} className="w-full text-left flex items-center px-3 py-2 rounded-md text-sm text-gray-300 hover:bg-gray-700 group">
              <LogOut size={16} className="mr-3" />
              Keluar
            </button>
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default ProfileModal;
