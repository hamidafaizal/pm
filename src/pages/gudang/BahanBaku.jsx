import React, { useState } from 'react';
import Button from '../../components/Button.jsx';
import { ShoppingCart } from 'lucide-react';
import BeliBahanBaku from './modals/BeliBahanBaku.jsx'; // Impor modal baru

function BahanBaku() {
  // Halaman untuk manajemen Bahan Baku
  console.log("Halaman Bahan Baku dirender.");

  // State untuk mengontrol visibilitas modal
  const [isBeliModalOpen, setIsBeliModalOpen] = useState(false);
  console.log("Status modal Beli Bahan Baku:", isBeliModalOpen);

  // Fungsi untuk membuka modal
  const handleOpenBeliModal = () => {
    console.log("Membuka modal Beli Bahan Baku.");
    setIsBeliModalOpen(true);
  };

  // Fungsi untuk menutup modal
  const handleCloseBeliModal = () => {
    console.log("Menutup modal Beli Bahan Baku.");
    setIsBeliModalOpen(false);
  };
  
  return (
    <>
      <div className="p-4 md:p-6">
        {/* Header Halaman */}
        <div className="mb-6 flex items-center justify-between gap-3">
          <h1 className="text-xl font-semibold tracking-tight">
            Stok Bahan Baku
          </h1>
          {/* Tombol memicu fungsi untuk membuka modal */}
          <Button size="lg" reveal icon={<ShoppingCart size={20} />} onClick={handleOpenBeliModal}>
            Beli Bahan Baku
          </Button>
        </div>

        {/* Konten lainnya akan ditambahkan di sini */}
        <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center">
          <p className="text-base font-medium">Konten halaman bahan baku</p>
          <p className="mt-1 text-sm text-gray-500">
            Fitur untuk mengelola stok bahan baku akan ditampilkan di sini.
          </p>
        </div>
      </div>

      {/* Render komponen modal */}
      <BeliBahanBaku 
        isOpen={isBeliModalOpen}
        onClose={handleCloseBeliModal}
      />
    </>
  );
}

export default BahanBaku;

