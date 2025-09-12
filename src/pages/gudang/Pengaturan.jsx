import { Link } from 'react-router-dom';
import { Layers, Ruler } from 'lucide-react';

function PengaturanGudang() {
  return (
    <div className="p-4 md:p-6">
      {/* Header Halaman */}
      <div className="mb-8">
        <h1 className="text-2xl font-semibold tracking-tight">Pengaturan Gudang</h1>
        <p className="mt-2 text-sm text-gray-400">
          Pilih salah satu menu di bawah untuk mengelola atribut item di gudang.
        </p>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
        {/* Tombol diubah menjadi komponen Link */}
        <Link
          to="/gudang/pengaturan/kategori-barang"
          className="glass-container !p-2 flex flex-col items-center justify-center gap-2 text-center aspect-square hover:!border-gray-400 transition-colors"
        >
          <Layers size={28} />
          <span className="text-sm font-semibold">Kategori Barang</span>
        </Link>
        <Link
          to="/gudang/pengaturan/satuan-barang"
          className="glass-container !p-2 flex flex-col items-center justify-center gap-2 text-center aspect-square hover:!border-gray-400 transition-colors"
        >
          <Ruler size={28} />
          <span className="text-sm font-semibold">Satuan Barang</span>
        </Link>
      </div>
    </div>
  );
}

export default PengaturanGudang;

