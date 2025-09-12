import React, { useState, useEffect } from "react";
import { useOutletContext } from "react-router-dom";
import { Plus } from "lucide-react";
import { supabase } from "../../supabase/client.js";
import Button from "../../components/Button.jsx";

export default function DatabaseBahanBaku() {
  const { onAdd } = useOutletContext();
  const [kategoriList, setKategoriList] = useState([]);
  const [bahanBakuList, setBahanBakuList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fungsi untuk melacak klik tombol Tambah Bahan Baku
  const handleTambah = () => {
    console.log("Tombol Tambah Bahan Baku diklik");
    if (onAdd) {
      onAdd();
    } else {
      console.error("Fungsi onAdd tidak ditemukan di context.");
    }
  };

  // Fungsi untuk mengambil data kategori
  const fetchKategori = async () => {
    const { data, error } = await supabase
      .from('kategori_barang')
      .select('id, nama');
    if (error) {
      throw error;
    }
    return data;
  };

  // Fungsi untuk mengambil data bahan baku
  const fetchBahanBaku = async () => {
    const { data, error } = await supabase
      .from('bahan_baku')
      .select(`
        *,
        satuan_barang (
          nama
        ),
        kategori_barang (
          nama
        )
      `);
    if (error) {
      throw error;
    }
    return data;
  };

  // Memuat semua data saat komponen di-mount
  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      setError(null);
      try {
        const kategoriData = await fetchKategori();
        const bahanBakuData = await fetchBahanBaku();
        setKategoriList(kategoriData);
        setBahanBakuList(bahanBakuData);
        console.log("Data loaded successfully:", { kategoriData, bahanBakuData });
      } catch (err) {
        console.error("Error loading data:", err.message);
        setError("Gagal memuat data. Silakan coba lagi.");
      } finally {
        setLoading(false);
      }
    };
    loadData();
  }, []);

  // Mengelompokkan bahan baku berdasarkan kategori
  const groupedBahanBaku = bahanBakuList.reduce((acc, item) => {
    const kategoriNama = item.kategori_barang.nama;
    if (!acc[kategoriNama]) {
      acc[kategoriNama] = [];
    }
    acc[kategoriNama].push(item);
    return acc;
  }, {});

  return (
    <div className="p-4 md:p-6">
      {/* Header + Button Aksi */}
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-xl font-semibold tracking-tight">
          Database Bahan Baku
        </h1>
        <Button onClick={handleTambah} size="lg" reveal icon={<Plus size={20} />}>
          Tambah Bahan Baku
        </Button>
      </div>

      {/* Konten Halaman: Loading, Error, atau Data */}
      {loading ? (
        <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center">
          <p className="text-base font-medium">Memuat data...</p>
        </div>
      ) : error ? (
        <div className="rounded-2xl border border-dashed border-red-500 p-8 text-center">
          <p className="text-base font-medium text-red-400">Terjadi kesalahan</p>
          <p className="mt-1 text-sm text-red-400">{error}</p>
        </div>
      ) : Object.keys(groupedBahanBaku).length === 0 ? (
        <div className="rounded-2xl border border-dashed border-gray-300 p-8 text-center">
          <p className="text-base font-medium">Belum ada data bahan baku</p>
          <p className="mt-1 text-sm text-gray-500">
            Klik <span className="font-semibold">“Tambah Bahan Baku”</span> untuk menambahkan data baru.
          </p>
        </div>
      ) : (
        // Tampilan tabel bahan baku per kategori
        <div className="space-y-8">
          {Object.keys(groupedBahanBaku).map((kategoriNama) => {
            const firstItem = groupedBahanBaku[kategoriNama][0];
            const subkategoriKey = firstItem.atribut ? Object.keys(firstItem.atribut)[0] : 'Subkategori';
            
            return (
              <div key={kategoriNama}>
                <h2 className="text-xl font-semibold mb-4">{kategoriNama}</h2>
                <div className="glass-container !p-0 overflow-hidden">
                  <table className="w-full text-left table-auto">
                    <thead>
                      <tr className="bg-gray-800/50 text-gray-400">
                        <th className="py-3 px-4 font-normal text-sm">{kategoriNama === 'Jenis Kain' ? 'Nama Kain' : 'Nama Barang'}</th>
                        <th className="py-3 px-4 font-normal text-sm">{subkategoriKey}</th>
                        <th className="py-3 px-4 font-normal text-sm">Satuan</th>
                        <th className="py-3 px-4 font-normal text-sm text-right">Harga</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupedBahanBaku[kategoriNama].map((item, index) => (
                        <tr key={item.id} className={`${index % 2 === 0 ? 'bg-gray-900/10' : ''} hover:bg-gray-800/20 transition-colors`}>
                          <td className="py-2.5 px-4 text-sm">{item.nama}</td>
                          <td className="py-2.5 px-4 text-sm">{item.atribut?.[subkategoriKey] || 'N/A'}</td>
                          <td className="py-2.5 px-4 text-sm">{item.satuan_barang?.nama || 'N/A'}</td>
                          <td className="py-2.5 px-4 text-sm text-right">Rp{item.harga}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
