import React from 'react';
import { Link } from 'react-router-dom'; // Impor Link
import { LayoutDashboard, CircleDollarSign, Warehouse, Compass, Store, X } from 'lucide-react';

// --- Data Menu dengan Ikon dan Link ---
const menuItems = [
  { name: 'Dashboard', icon: <LayoutDashboard size={20} className="mr-3" />, path: '/' },
  { name: 'Keuangan', icon: <CircleDollarSign size={20} className="mr-3" />, path: '#' },
  { name: 'Gudang', icon: <Warehouse size={20} className="mr-3" />, path: '/gudang' },
];

const secondaryMenuItems = [
    { name: 'Explore', icon: <Compass size={20} className="mr-3" />, path: '#' },
    { name: 'Marketplace', icon: <Store size={20} className="mr-3" />, path: '#' },
]

function Sidebar({ isOpen, onClose }) {
  // Komponen Sidebar untuk navigasi
  console.log("Sidebar component rendered, isOpen:", isOpen);

  return (
    <aside 
      className={`glass-container !p-0 absolute top-0 left-0 z-20 h-screen w-72 transform transition-transform duration-300 ease-in-out flex flex-col ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}
    >
      {/* --- Header Sidebar --- */}
      <div className="flex justify-between items-center p-4 border-b border-gray-700">
        <img src="/logopm.svg" alt="App Logo" className="h-8 w-8" />
        <button onClick={onClose} className="text-gray-400 hover:text-white">
          <X size={24} />
        </button>
      </div>

      {/* --- Navigasi Utama --- */}
      <nav className="flex-grow p-4">
        <ul>
          {menuItems.map((item) => (
            <li key={item.name} className="mb-1">
              <Link
                to={item.path}
                className="flex items-center p-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 group"
                onClick={onClose}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
        
        <hr className="my-4 border-gray-700" />

        <ul>
          {secondaryMenuItems.map((item) => (
            <li key={item.name} className="mb-1">
              <Link
                to={item.path}
                className="flex items-center p-2 rounded-md text-gray-300 hover:bg-gray-700 hover:text-white transition-colors duration-200 group"
                onClick={onClose}
              >
                {item.icon}
                <span className="font-medium">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}

export default Sidebar;
