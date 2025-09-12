import React, { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/Sidebar';
import Topbar from '../components/Topbar';
import Navbar from '../components/Navbar';
import TambahBahanBaku from '../pages/gudang/modals/TambahBahanBaku';

function GudangLayout() {
  // Layout ini khusus untuk semua halaman di modul Gudang
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);
  const [isTambahBahanBakuModalOpen, setIsTambahBahanBakuModalOpen] = useState(false);
  
  console.log("GudangLayout component rendered, sidebar open:", isSidebarOpen);
  console.log("Tambah Bahan Baku modal open:", isTambahBahanBakuModalOpen);

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
    console.log("Sidebar toggled in GudangLayout, new state:", !isSidebarOpen);
  };
  
  const handleOpenTambahBahanBakuModal = () => {
    console.log("Attempting to open Tambah Bahan Baku modal");
    setIsTambahBahanBakuModalOpen(true);
  };

  const handleCloseTambahBahanBakuModal = () => {
    console.log("Attempting to close Tambah Bahan Baku modal");
    setIsTambahBahanBakuModalOpen(false);
  };

  return (
    <div className="relative w-full h-screen bg-[rgb(var(--background-start-rgb))] overflow-hidden">
      <Sidebar isOpen={isSidebarOpen} onClose={toggleSidebar} />
      
      <div className="flex flex-col w-full h-full">
        <Topbar onMenuClick={toggleSidebar} />
        <Navbar />
        
        <main className="flex-grow p-8 overflow-y-auto">
          {/* Konten halaman Gudang akan dirender di sini, dengan context */}
          <Outlet context={{ onAdd: handleOpenTambahBahanBakuModal }} />
        </main>
      </div>

      {/* Render komponen modal */}
      <TambahBahanBaku
        isOpen={isTambahBahanBakuModalOpen}
        onClose={handleCloseTambahBahanBakuModal}
      />
    </div>
  );
}

export default GudangLayout;
