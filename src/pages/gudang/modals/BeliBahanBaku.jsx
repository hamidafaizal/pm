import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import Button from '../../../components/Button.jsx';
import { supabase } from '../../../supabase/client.js';

function BeliBahanBaku({ isOpen, onClose }) {
  // --- STATE MANAGEMENT ---
  const [kategoriList, setKategoriList] = useState([]);
  const [barangList, setBarangList] = useState([]);
  const [subkategoriValues, setSubkategoriValues] = useState({});
  
  const [selectedKategoriId, setSelectedKategoriId] = useState('');
  const [selectedKategoriData, setSelectedKategoriData] = useState(null);
  const [selectedBarangId, setSelectedBarangId] = useState('');
  const [selectedBarangData, setSelectedBarangData] = useState(null);
  
  // State untuk input form
  const [jumlah, setJumlah] = useState('');
  const [selectedSubkategori, setSelectedSubkategori] = useState({});

  const [loadingKategori, setLoadingKategori] = useState(false);
  const [loadingBarang, setLoadingBarang] = useState(false);
  const [isSaving, setIsSaving] = useState(false); // State untuk proses simpan
  
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState(''); // State untuk pesan sukses

  console.log("Modal BeliBahanBaku dirender, status isOpen:", isOpen);

  // --- DATA FETCHING & LOGIC ---

  // 1. Fetch Kategori saat modal pertama kali dibuka
  useEffect(() => {
    if (isOpen) {
      console.log("Modal terbuka, memulai fetch data kategori...");
      const fetchKategori = async () => {
        setLoadingKategori(true);
        setError('');
        try {
          const { data, error: fetchError } = await supabase
            .from('kategori_barang')
            .select('id, nama, subkategori');

          if (fetchError) throw fetchError;
          console.log("Data kategori berhasil diambil:", data);
          setKategoriList(data);
        } catch (err) {
          console.error("Error fetching kategori:", err.message);
          setError("Gagal memuat data kategori.");
        } finally {
          setLoadingKategori(false);
        }
      };

      fetchKategori();
      // Reset semua state form setiap kali modal dibuka
      setSelectedKategoriId('');
      setSelectedKategoriData(null);
      setBarangList([]);
      setSubkategoriValues({});
      setSelectedBarangId('');
      setSelectedBarangData(null);
      setJumlah('');
      setSelectedSubkategori({});
      setSuccessMessage('');
    }
  }, [isOpen]);

  // 2. Fetch Barang berdasarkan Kategori yang dipilih
  useEffect(() => {
    if (selectedKategoriId) {
      console.log(`Kategori dipilih: ${selectedKategoriId}, memulai fetch data barang...`);
      const fetchBarang = async () => {
        setLoadingBarang(true);
        setError('');
        setBarangList([]);
        try {
          const { data, error: fetchError } = await supabase
            .from('bahan_baku')
            .select('id, nama, atribut, satuan_barang ( nama )')
            .eq('kategori_barang_id', selectedKategoriId);

          if (fetchError) throw fetchError;
          console.log("Data barang berhasil diambil:", data);
          setBarangList(data);
        } catch (err) {
          console.error("Error fetching barang:", err.message);
          setError("Gagal memuat data barang.");
        } finally {
          setLoadingBarang(false);
        }
      };
      fetchBarang();
    }
  }, [selectedKategoriId]);

  // 3. Proses subkategori setelah data barang berhasil diambil
  useEffect(() => {
    if (barangList.length > 0 && selectedKategoriData?.subkategori) {
      console.log("Memproses subkategori untuk kategori:", selectedKategoriData.nama);
      const newSubkategoriValues = {};
      selectedKategoriData.subkategori.forEach(subNama => {
        const uniqueValues = new Set();
        barangList.forEach(barang => {
          if (barang.atribut && barang.atribut[subNama]) {
            uniqueValues.add(barang.atribut[subNama]);
          }
        });
        newSubkategoriValues[subNama] = Array.from(uniqueValues);
      });
      console.log("Opsi subkategori yang dihasilkan:", newSubkategoriValues);
      setSubkategoriValues(newSubkategoriValues);
    }
  }, [barangList, selectedKategoriData]);

  if (!isOpen) return null;

  // --- HANDLERS ---
  const handleKategoriChange = (e) => {
    const kategoriId = e.target.value;
    console.log("Handler: Kategori berubah ke ID:", kategoriId);
    setSelectedKategoriId(kategoriId);
    const fullKategori = kategoriList.find(k => k.id === kategoriId) || null;
    setSelectedKategoriData(fullKategori);
    setBarangList([]);
    setSubkategoriValues({});
    setSelectedBarangId('');
    setSelectedBarangData(null);
    setJumlah('');
    setSelectedSubkategori({});
  };

  const handleBarangChange = (e) => {
    const barangId = e.target.value;
    console.log("Handler: Barang berubah ke ID:", barangId);
    setSelectedBarangId(barangId);
    const fullBarangData = barangList.find(b => b.id.toString() === barangId) || null;
    console.log("Data barang lengkap yang dipilih:", fullBarangData);
    setSelectedBarangData(fullBarangData);
  };

  const handleSubkategoriChange = (subNama, value) => {
    setSelectedSubkategori(prev => ({ ...prev, [subNama]: value }));
  };

  // Fungsi untuk menyimpan data pembelian
  const handleSave = async () => {
    console.log("Tombol Simpan di modal Beli Bahan Baku diklik.");
    // Validasi input
    if (!selectedBarangId || !jumlah) {
      setError("Nama barang dan jumlah wajib diisi.");
      return;
    }
    
    setIsSaving(true);
    setError('');
    setSuccessMessage('');

    // Membersihkan subkategori terpilih dari nilai kosong
    const subkategoriTerpilihFinal = {};
    for (const key in selectedSubkategori) {
      if (selectedSubkategori[key]) {
        subkategoriTerpilihFinal[key] = selectedSubkategori[key];
      }
    }

    const dataToInsert = {
      bahan_baku_id: selectedBarangId,
      jumlah: parseFloat(jumlah),
      subkategori_terpilih: Object.keys(subkategoriTerpilihFinal).length > 0 ? subkategoriTerpilihFinal : null,
    };

    console.log("Mencoba menyimpan data:", dataToInsert);

    try {
      const { error: insertError } = await supabase.from('beli_bahan_baku').insert([dataToInsert]);
      if (insertError) throw insertError;
      
      console.log("Data berhasil disimpan!");
      setSuccessMessage("Pembelian berhasil disimpan!");
      
      // Tutup modal setelah 1.5 detik
      setTimeout(() => {
        onClose();
      }, 1500);

    } catch (err) {
      console.error("Error saat menyimpan data:", err.message);
      setError(`Gagal menyimpan: ${err.message}`);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm p-4">
      <div className="glass-container w-full max-w-lg">
        <div className="flex justify-between items-center pb-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Beli Bahan Baku</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white"><X size={24} /></button>
        </div>

        <div className="py-6 space-y-4">
          {/* --- Area Notifikasi --- */}
          {error && <p className="text-red-400 text-sm p-3 bg-red-500/10 rounded-lg">{error}</p>}
          {successMessage && <p className="text-green-400 text-sm p-3 bg-green-500/10 rounded-lg">{successMessage}</p>}
          
          {/* Dropdown Kategori */}
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="kategori-beli">Kategori</label>
            <select
              id="kategori-beli" value={selectedKategoriId} onChange={handleKategoriChange}
              className="w-full px-3 py-2 bg-transparent border border-gray-600 rounded-lg focus:outline-none focus:border-gray-400"
              disabled={loadingKategori}>
              <option value="">{loadingKategori ? 'Memuat...' : 'Pilih Kategori'}</option>
              {kategoriList.map((kategori) => (<option key={kategori.id} value={kategori.id}>{kategori.nama}</option>))}
            </select>
          </div>

          {/* Dropdown Nama Barang */}
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="nama-barang-beli">Nama Barang</label>
            <select id="nama-barang-beli" name="nama-barang-beli"
              value={selectedBarangId} onChange={handleBarangChange}
              className="w-full px-3 py-2 bg-transparent border border-gray-600 rounded-lg focus:outline-none focus:border-gray-400"
              disabled={!selectedKategoriId || loadingBarang}>
              {loadingBarang ? (<option>Memuat barang...</option>)
                : !selectedKategoriId ? (<option value="">Pilih Kategori Terlebih Dahulu</option>)
                : barangList.length > 0 ? (
                  <>
                    <option value="">Pilih Nama Barang</option>
                    {barangList.map((barang) => (<option key={barang.id} value={barang.id}>{barang.nama}</option>))}
                  </>
                ) : (<option value="">Tidak ada barang di kategori ini</option>)}
            </select>
          </div>

          {/* Dropdown Subkategori Dinamis */}
          {Object.keys(subkategoriValues).map(subNama => (
            subkategoriValues[subNama].length > 0 && (
              <div key={subNama}>
                <label className="block text-sm font-medium mb-2" htmlFor={`sub-${subNama}`}>{subNama}</label>
                <select id={`sub-${subNama}`} name={`sub-${subNama}`}
                  value={selectedSubkategori[subNama] || ''}
                  onChange={(e) => handleSubkategoriChange(subNama, e.target.value)}
                  className="w-full px-3 py-2 bg-transparent border border-gray-600 rounded-lg focus:outline-none focus:border-gray-400"
                  disabled={!selectedBarangId}>
                  <option value="">Pilih {subNama}</option>
                  {subkategoriValues[subNama].map(value => (<option key={value} value={value}>{value}</option>))}
                </select>
              </div>
            )
          ))}

          {/* Input Jumlah dengan Informasi Satuan */}
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="jumlah-beli">Jumlah</label>
            <div className="flex items-center gap-3">
              <input type="number" id="jumlah-beli" name="jumlah-beli"
                value={jumlah}
                onChange={(e) => setJumlah(e.target.value)}
                className="w-full px-3 py-2 bg-transparent border border-gray-600 rounded-lg focus:outline-none focus:border-gray-400"
                placeholder="Masukkan jumlah"
                disabled={!selectedBarangId}
              />
              {selectedBarangData && (
                <span className="text-gray-400 font-medium whitespace-nowrap">
                  {selectedBarangData.satuan_barang?.nama || 'N/A'}
                </span>
              )}
            </div>
          </div>
        </div>

        <div className="pt-4 border-t border-gray-700 flex justify-end">
          <Button onClick={handleSave} size="md" icon={<Save size={18} />} disabled={isSaving}>
            {isSaving ? 'Menyimpan...' : 'Simpan'}
          </Button>
        </div>
      </div>
    </div>
  );
}

export default BeliBahanBaku;

