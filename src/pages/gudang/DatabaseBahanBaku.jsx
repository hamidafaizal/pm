import React from "react";
import Button from "../../components/Button.jsx"; // Mengubah jalur impor agar sesuai
import { Plus } from "lucide-react"; // Import ikon Plus
import { useOutletContext } from "react-router-dom"; // Import hook untuk mendapatkan context dari layout

export default function DatabaseBahanBaku() {
  const { onAdd } = useOutletContext();
  console.log("onAdd function from context:", onAdd);

  const handleTambah = () => {
    // console.log untuk melacak klik tombol
    console.log("Tombol Tambah Bahan Baku diklik");
    if (onAdd) {
      onAdd();
    } else {
      console.error("Fungsi onAdd tidak ditemukan di context.");
    }
  };

  return (
    <div className="p-4 md:p-6">
      {/* Header + Button Aksi */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold tracking-tight">
          Database Bahan Baku
        </h1>

        {/* Tombol reusable: idle ikon "+", hover/focus menampilkan label */}
        <Button onClick={handleTambah} size="lg" reveal icon={<Plus size={20} />}>
          Tambah Bahan Baku
        </Button>
      </div>

      {/* Empty State */}
      <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center">
        <p className="text-base font-medium">Belum ada data bahan baku</p>
        <p className="mt-1 text-sm text-gray-500">
          Klik <span className="font-semibold">“Tambah Bahan Baku”</span> untuk menambahkan data baru.
        </p>
      </div>
    </div>
  );
}
