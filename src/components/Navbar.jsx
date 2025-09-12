import React from 'react';
import { NavLink } from 'react-router-dom';

function Navbar() {
  // Komponen Navbar untuk navigasi di dalam halaman tertentu
  console.log("Navbar component rendered");

  const navItems = [
    { name: 'Database Bahan Baku', path: '/gudang/database-bahan-baku' },
    { name: 'Bahan Baku', path: '/gudang/bahan-baku' },
    { name: 'Bahan Jadi', path: '/gudang/bahan-jadi' },
    { name: 'Pengaturan', path: '/gudang/pengaturan' }, // Link baru ditambahkan
  ];

  return (
    <nav className="w-full bg-transparent border-b border-gray-700">
      <div className="px-8">
        <div className="flex items-center h-16">
          <div className="flex items-center space-x-1">
            {navItems.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                end // Tambahkan prop 'end' untuk path yang lebih spesifik jika diperlukan
                className={({ isActive }) =>
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-white bg-gray-700'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                {item.name}
              </NavLink>
            ))}
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;

