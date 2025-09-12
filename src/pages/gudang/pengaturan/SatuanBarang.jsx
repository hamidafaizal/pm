import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabase/client.js';
import Button from '../../../components/Button.jsx';
import { Save, Edit, Trash2, X } from 'lucide-react';

function SatuanBarang() {
  const [satuanList, setSatuanList] = useState([]);
  const [namaSatuan, setNamaSatuan] = useState('');
  const [loading, setLoading] = useState(false);
  const [notification, setNotification] = useState({ show: false, message: '', type: '' });

  // State untuk mode edit
  const [editingId, setEditingId] = useState(null);
  const [editingNama, setEditingNama] = useState('');

  // Fungsi untuk menampilkan notifikasi sementara
  const showNotification = (message, type) => {
    setNotification({ show: true, message, type });
    setTimeout(() => {
      setNotification({ show: false, message: '', type: '' });
    }, 3000);
  };

  // Mengambil data dari Supabase saat komponen dimuat
  const fetchSatuan = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('satuan_barang')
      .select('id, nama')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching satuan:', error);
      showNotification(`Gagal memuat data: ${error.message}`, 'error');
    } else {
      setSatuanList(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchSatuan();
  }, []);

  // Handler untuk menyimpan satuan baru
  const handleSave = async (e) => {
    e.preventDefault();
    if (!namaSatuan.trim()) {
      showNotification('Nama satuan tidak boleh kosong.', 'error');
      return;
    }

    const { data, error } = await supabase
      .from('satuan_barang')
      .insert([{ nama: namaSatuan }])
      .select();

    if (error) {
      showNotification(`Gagal menyimpan: ${error.message}`, 'error');
    } else {
      showNotification('Satuan berhasil disimpan!', 'success');
      setSatuanList([data[0], ...satuanList]);
      setNamaSatuan('');
    }
  };

  // Handler untuk menghapus satuan
  const handleDelete = async (id) => {
    if (window.confirm('Apakah Anda yakin ingin menghapus satuan ini?')) {
      const { error } = await supabase
        .from('satuan_barang')
        .delete()
        .eq('id', id);

      if (error) {
        showNotification(`Gagal menghapus: ${error.message}`, 'error');
      } else {
        showNotification('Satuan berhasil dihapus.', 'success');
        setSatuanList(satuanList.filter((item) => item.id !== id));
      }
    }
  };

  // Handler untuk memulai mode edit
  const handleEdit = (item) => {
    setEditingId(item.id);
    setEditingNama(item.nama);
  };

  // Handler untuk menyimpan perubahan setelah edit
  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!editingNama.trim()) {
      showNotification('Nama satuan tidak boleh kosong.', 'error');
      return;
    }

    const { data, error } = await supabase
      .from('satuan_barang')
      .update({ nama: editingNama })
      .eq('id', editingId)
      .select();

    if (error) {
      showNotification(`Gagal memperbarui: ${error.message}`, 'error');
    } else {
      showNotification('Satuan berhasil diperbarui.', 'success');
      setSatuanList(
        satuanList.map((item) => (item.id === editingId ? data[0] : item))
      );
      setEditingId(null);
    }
  };

  return (
    <div className="p-4 md:p-6 h-full flex flex-col">
      {/* Notifikasi */}
      {notification.show && (
        <div className={`fixed top-20 right-5 p-4 rounded-lg text-white ${notification.type === 'success' ? 'bg-green-500' : 'bg-red-500'}`}>
          {notification.message}
        </div>
      )}

      {/* Area Formulir (Sticky) */}
      <div className="flex-shrink-0">
        <div className="mb-6">
          <h1 className="text-2xl font-semibold tracking-tight">Tambah Satuan Barang</h1>
          <p className="mt-2 text-sm text-gray-400">
            Gunakan formulir ini untuk menambah satuan baru (e.g., Pcs, Lusin, Meter).
          </p>
        </div>

        <form onSubmit={handleSave} className="glass-container !p-4 mb-6">
          <div className="flex items-end gap-4">
            <div className="flex-grow">
              <label htmlFor="nama-satuan" className="block text-sm font-medium mb-2">Nama Satuan</label>
              <input
                id="nama-satuan"
                type="text"
                value={namaSatuan}
                onChange={(e) => setNamaSatuan(e.target.value)}
                placeholder="Masukkan nama satuan barang"
                className="w-full px-3 py-2 bg-transparent border border-gray-600 rounded-lg focus:outline-none focus:border-gray-400"
              />
            </div>
            <Button type="submit" size="md" icon={<Save size={18} />}>
              Simpan
            </Button>
          </div>
        </form>
      </div>

      {/* Area Daftar (Scrollable) */}
      <div className="flex-grow flex flex-col min-h-0">
        <div className="mb-4">
          <h2 className="text-xl font-semibold tracking-tight">Daftar Satuan Tersimpan</h2>
          <p className="mt-1 text-sm text-gray-400">
            Berikut adalah data satuan yang sudah ada di database.
          </p>
        </div>

        <div className="flex-grow overflow-y-auto pr-2 -mr-2">
          {loading ? (
            <p className="text-center text-gray-400">Memuat data...</p>
          ) : satuanList.length === 0 ? (
            <p className="text-center text-gray-400">Belum ada data satuan.</p>
          ) : (
            <div className="space-y-3">
              {satuanList.map((item) => (
                <div key={item.id}>
                  {editingId === item.id ? (
                    <form onSubmit={handleUpdate} className="glass-container !p-3 flex items-center gap-2">
                      <input
                        type="text"
                        value={editingNama}
                        onChange={(e) => setEditingNama(e.target.value)}
                        className="flex-grow px-3 py-1.5 bg-transparent border border-gray-600 rounded-lg focus:outline-none focus:border-gray-400"
                      />
                      <Button type="submit" size="icon" aria-label="Simpan Perubahan"><Save size={18} /></Button>
                      <Button type="button" onClick={() => setEditingId(null)} size="icon" aria-label="Batal"><X size={18} /></Button>
                    </form>
                  ) : (
                    <div className="glass-container !p-3 flex justify-between items-center">
                      <span className="font-medium">{item.nama}</span>
                      <div className="flex items-center gap-2">
                        <Button onClick={() => handleEdit(item)} size="icon" aria-label="Edit Satuan"><Edit size={16} /></Button>
                        <Button onClick={() => handleDelete(item.id)} size="icon" aria-label="Hapus Satuan"><Trash2 size={16} /></Button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default SatuanBarang;

