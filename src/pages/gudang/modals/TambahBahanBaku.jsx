import React from 'react';
import { X } from 'lucide-react';

function TambahBahanBaku({ isOpen, onClose }) {
  // console.log untuk melacak status modal
  console.log("TambahBahanBaku modal rendered, isOpen:", isOpen);

  if (!isOpen) {
    return null;
  }

  const handleKainClick = () => {
    // console.log untuk melacak klik tombol Kain
    console.log("Tombol Kain diklik");
    onClose();
    // Tambahkan logika selanjutnya di sini, misalnya navigasi ke formulir Kain
  };

  const handleSablonClick = () => {
    // console.log untuk melacak klik tombol Sablon
    console.log("Tombol Sablon diklik");
    onClose();
    // Tambahkan logika selanjutnya di sini, misalnya navigasi ke formulir Sablon
  };

  const handlePackingClick = () => {
    // console.log untuk melacak klik tombol Packing
    console.log("Tombol Packing diklik");
    onClose();
    // Tambahkan logika selanjutnya, misalnya navigasi ke formulir Packing
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm p-4">
      <div className="glass-container w-full max-w-lg">
        {/* Header Modal */}
        <div className="flex justify-between items-center pb-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Tambah Bahan Baku</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        {/* Konten Modal */}
        <div className="py-6">
          <p className="text-gray-300 mb-6">Pilih jenis bahan baku yang ingin Anda tambahkan:</p>
          <div className="flex justify-around space-x-4">
            <button
              onClick={handleKainClick}
              className="custom-btn px-4 py-2 rounded-lg"
            >
              Kain
            </button>
            <button
              onClick={handleSablonClick}
              className="custom-btn px-4 py-2 rounded-lg"
            >
              Sablon
            </button>
            <button
              onClick={handlePackingClick}
              className="custom-btn px-4 py-2 rounded-lg"
            >
              Packing
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TambahBahanBaku;
