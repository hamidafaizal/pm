import React, { useState, useEffect } from 'react';
import { X, Save } from 'lucide-react';
import { supabase } from '../../../supabase/client.js';
import Button from '../../../components/Button.jsx';

function TambahBahanBaku({ isOpen, onClose, onSaveSuccess }) {
  const [kategoriList, setKategoriList] = useState([]);
  const [satuanList, setSatuanList] = useState([]);
  const [selectedKategori, setSelectedKategori] = useState(null);
  // State untuk menyimpan semua data form, termasuk harga
  const [formData, setFormData] = useState({
    nama_barang: '',
    satuan_barang_id: '',
    harga: ''
  });
  const [loading, setLoading] = useState({ kategori: false, satuan: false, save: false });
  const [error, setError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // Fungsi untuk melacak render komponen
  console.log("TambahBahanBaku component rendered");

  useEffect(() => {
    if (isOpen) {
      const fetchData = async () => {
        setLoading({ kategori: true, satuan: true, save: false });
        setError('');
        setSuccessMessage('');
        try {
          const { data: kategoriData, error: kategoriError } = await supabase
            .from('kategori_barang')
            .select('id, nama, subkategori');
          if (kategoriError) throw kategoriError;
          setKategoriList(kategoriData);

          const { data: satuanData, error: satuanError } = await supabase
            .from('satuan_barang')
            .select('id, nama');
          if (satuanError) throw satuanError;
          setSatuanList(satuanData);
        } catch (err) {
          console.error("Error fetching data:", err.message);
          setError('Gagal memuat data: ' + err.message);
        } finally {
          setLoading({ kategori: false, satuan: false, save: false });
        }
      };

      fetchData();
      setSelectedKategori(null);
      setFormData({});
    }
  }, [isOpen]);

  // Fungsi untuk melacak perubahan kategori
  const handleCategoryChange = (e) => {
    const kategoriId = e.target.value;
    const kategori = kategoriList.find(kat => kat.id.toString() === kategoriId);
    setSelectedKategori(kategori || null);
    setFormData({
      ...formData,
      kategori_barang_id: kategoriId
    });
    console.log("Kategori changed to:", kategoriId);
  };

  // Fungsi untuk menangani input form
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevData => ({ ...prevData, [name]: value }));
    console.log("Form data updated:", { [name]: value });
  };

  // Fungsi untuk menangani penyimpanan data ke database
  const handleSave = async () => {
    console.log("Attempting to save data...");
    // Menghapus validasi untuk jumlah
    if (!formData.nama_barang || !formData.satuan_barang_id) {
        setError("Nama barang dan satuan wajib diisi.");
        console.error("Validation failed: Missing required fields.");
        return;
    }
    setLoading(prev => ({ ...prev, save: true }));
    setError('');
    setSuccessMessage('');

    try {
        const atribut = {};
        selectedKategori?.subkategori?.forEach(sub => {
            if(formData[sub]) {
                atribut[sub] = formData[sub];
            }
        });

        const newBahanBaku = {
            nama: formData.nama_barang,
            kategori_barang_id: selectedKategori.id,
            satuan_barang_id: formData.satuan_barang_id,
            harga: parseFloat(formData.harga),
            atribut: atribut
        };

        console.log("Inserting new bahan baku:", newBahanBaku);
        const { error: insertError } = await supabase.from('bahan_baku').insert([newBahanBaku]);
        if (insertError) throw insertError;
        
        console.log("Data successfully saved!");
        setSuccessMessage('Data berhasil disimpan!');
        if (onSaveSuccess) onSaveSuccess();
        
        setTimeout(() => {
            onClose();
        }, 1500);

    } catch (err) {
        console.error("Error saving data:", err.message);
        setError('Gagal menyimpan data: ' + err.message);
    } finally {
        setLoading(prev => ({ ...prev, save: false }));
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900 bg-opacity-50 backdrop-blur-sm p-4">
      <div className="glass-container w-full max-w-lg">
        <div className="flex justify-between items-center pb-4 border-b border-gray-700">
          <h2 className="text-xl font-semibold">Tambah Bahan Baku</h2>
          <button onClick={onClose} className="text-gray-400 hover:text-white">
            <X size={24} />
          </button>
        </div>

        <div className="py-6 space-y-4">
          <p className="text-gray-300">Pilih kategori untuk bahan baku yang ingin Anda tambahkan:</p>
          
          <div>
            <label className="block text-sm font-medium mb-2" htmlFor="kategori">Kategori Barang</label>
            <select
              id="kategori"
              name="kategori"
              onChange={handleCategoryChange}
              className="w-full px-3 py-2 bg-transparent border border-gray-600 rounded-lg focus:outline-none focus:border-gray-400"
              disabled={loading.kategori}
              value={selectedKategori ? selectedKategori.id : ''}
            >
              {loading.kategori ? <option>Memuat...</option> : (
                <>
                  <option value="">Pilih Kategori</option>
                  {kategoriList.map((kat) => (
                    <option key={kat.id} value={kat.id}>{kat.nama}</option>
                  ))}
                </>
              )}
            </select>
          </div>
          
          {selectedKategori && (
            <>
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="nama_barang">Nama Barang</label>
                <input
                  type="text"
                  id="nama_barang"
                  name="nama_barang"
                  value={formData.nama_barang || ''}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 bg-transparent border border-gray-600 rounded-lg focus:outline-none focus:border-gray-400"
                  placeholder="Masukkan nama barang"
                />
              </div>

              {selectedKategori.subkategori?.map((sub, index) => (
                <div key={index}>
                  <label className="block text-sm font-medium mb-2" htmlFor={sub}>{sub}</label>
                  <input
                    type="text"
                    id={sub}
                    name={sub}
                    value={formData[sub] || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-transparent border border-gray-600 rounded-lg focus:outline-none focus:border-gray-400"
                    placeholder={`Masukkan ${sub.toLowerCase()}`}
                  />
                </div>
              ))}
              
              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="harga">Harga (Rp)</label>
                <div className="flex items-center space-x-2">
                    <span className="text-gray-300">Rp</span>
                    <input
                      type="number"
                      id="harga"
                      name="harga"
                      value={formData.harga || ''}
                      onChange={handleInputChange}
                      className="w-full px-3 py-2 bg-transparent border border-gray-600 rounded-lg focus:outline-none focus:border-gray-400"
                      placeholder="Masukkan harga"
                    />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2" htmlFor="satuan_barang_id">Satuan Barang</label>
                <div className="flex items-center space-x-2">
                  <select
                    id="satuan_barang_id"
                    name="satuan_barang_id"
                    value={formData.satuan_barang_id || ''}
                    onChange={handleInputChange}
                    className="w-full px-3 py-2 bg-transparent border border-gray-600 rounded-lg focus:outline-none focus:border-gray-400"
                    disabled={loading.satuan}
                  >
                    {loading.satuan ? <option>Memuat...</option> : (
                      <>
                        <option value="">Pilih Satuan</option>
                        {satuanList.map((satuan) => (
                          <option key={satuan.id} value={satuan.id}>{satuan.nama}</option>
                        ))}
                      </>
                    )}
                  </select>
                </div>
              </div>
            </>
          )}
        </div>

        <div className="pt-4 border-t border-gray-700 flex justify-end items-center space-x-4">
            {error && <p className="text-red-400 text-sm flex-grow">{error}</p>}
            {successMessage && <p className="text-green-400 text-sm flex-grow">{successMessage}</p>}
            <Button
                onClick={handleSave}
                disabled={loading.save || !selectedKategori}
                className="custom-btn"
                size="md"
            >
                <Save size={16} className="mr-2"/>
                {loading.save ? 'Menyimpan...' : 'Simpan'}
            </Button>
        </div>

      </div>
    </div>
  );
}

export default TambahBahanBaku;
