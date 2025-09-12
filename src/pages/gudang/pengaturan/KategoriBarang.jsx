import React, { useState, useEffect } from 'react';
import { supabase } from '../../../supabase/client.js';
import Button from '../../../components/Button.jsx';
import { Plus, X, Save, Edit, Trash2 } from 'lucide-react';

function KategoriBarang() {
  // State untuk form tambah baru
  const [namaKategori, setNamaKategori] = useState('');
  const [subkategoriList, setSubkategoriList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: '', text: '' });

  // State untuk data list
  const [kategoriData, setKategoriData] = useState([]);
  const [listLoading, setListLoading] = useState(true);

  // State untuk mode edit dan delete
  const [editingId, setEditingId] = useState(null);
  const [editFormData, setEditFormData] = useState({ nama: '', subkategori: [] });
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);

  // Fungsi untuk mengambil data dari Supabase
  const fetchKategori = async () => {
    setListLoading(true);
    const { data, error } = await supabase
      .from('kategori_barang')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching data:', error);
      setMessage({ type: 'error', text: 'Gagal memuat data kategori.' });
    } else {
      setKategoriData(data);
    }
    setListLoading(false);
  };

  // Mengambil data saat komponen pertama kali dimuat
  useEffect(() => {
    fetchKategori();
  }, []);

  // --- FUNGSI UNTUK FORM TAMBAH BARU ---
  const handleAddSubkategori = () => {
    setSubkategoriList([...subkategoriList, { id: Date.now(), name: '' }]);
  };

  const handleRemoveSubkategori = (id) => {
    setSubkategoriList(subkategoriList.filter(item => item.id !== id));
  };
  
  const handleSubkategoriChange = (id, value) => {
    setSubkategoriList(
      subkategoriList.map(item => (item.id === id ? { ...item, name: value } : item))
    );
  };

  const handleSave = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage({ type: '', text: '' });

    if (!namaKategori.trim()) {
      setMessage({ type: 'error', text: 'Nama kategori tidak boleh kosong.' });
      setLoading(false);
      return;
    }

    const subkategoriNames = subkategoriList
      .map(item => item.name.trim())
      .filter(name => name !== '');

    const { error } = await supabase.from('kategori_barang').insert([{
      nama: namaKategori,
      subkategori: subkategoriNames.length > 0 ? subkategoriNames : null,
    }]);

    if (error) {
      setMessage({ type: 'error', text: `Gagal menyimpan: ${error.message}` });
    } else {
      setMessage({ type: 'success', text: 'Kategori berhasil disimpan!' });
      setNamaKategori('');
      setSubkategoriList([]);
      fetchKategori(); 
    }
    setLoading(false);
  };

  // --- FUNGSI UNTUK EDIT DAN DELETE ---

  const handleEditClick = (kategori) => {
    setEditingId(kategori.id);
    setEditFormData({ 
      nama: kategori.nama, 
      subkategori: kategori.subkategori ? kategori.subkategori.map((name, index) => ({ id: `existing-${index}`, name })) : [] 
    });
    setDeleteConfirmId(null);
  };

  const handleCancelEdit = () => {
    setEditingId(null);
  };
  
  // --- FUNGSI BARU UNTUK MENGELOLA SUBKATEGORI DALAM MODE EDIT ---
  const handleEditAddSubkategori = () => {
    setEditFormData(prev => ({
      ...prev,
      subkategori: [...prev.subkategori, { id: `new-${Date.now()}`, name: '' }]
    }));
  };

  const handleEditRemoveSubkategori = (id) => {
    setEditFormData(prev => ({
      ...prev,
      subkategori: prev.subkategori.filter(item => item.id !== id)
    }));
  };

  const handleEditSubkategoriChange = (id, value) => {
    setEditFormData(prev => ({
      ...prev,
      subkategori: prev.subkategori.map(item => 
        item.id === id ? { ...item, name: value } : item
      )
    }));
  };
  // --- END FUNGSI BARU ---

  const handleUpdate = async (id) => {
    setLoading(true);
    const subkategoriNames = editFormData.subkategori
      .map(item => item.name.trim())
      .filter(name => name !== '');

    const { error } = await supabase
      .from('kategori_barang')
      .update({ 
        nama: editFormData.nama,
        subkategori: subkategoriNames.length > 0 ? subkategoriNames : null
      })
      .eq('id', id);

    if (error) {
      setMessage({ type: 'error', text: `Update gagal: ${error.message}` });
    } else {
      setMessage({ type: 'success', text: 'Kategori berhasil diperbarui.' });
      setEditingId(null);
      fetchKategori();
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    setLoading(true);
    const { error } = await supabase
      .from('kategori_barang')
      .delete()
      .eq('id', id);

    if (error) {
      setMessage({ type: 'error', text: `Hapus gagal: ${error.message}` });
    } else {
      setMessage({ type: 'success', text: 'Kategori berhasil dihapus.' });
      setDeleteConfirmId(null);
      fetchKategori();
    }
    setLoading(false);
  };

  return (
    <div className="flex flex-col h-full p-4 md:p-6">
      {/* FORM TAMBAH KATEGORI */}
      <div className="flex-shrink-0">
        <div className="mb-6">
          <h1 className="text-xl font-semibold tracking-tight">Tambah Kategori Barang Baru</h1>
          <p className="mt-1 text-sm text-gray-500">Isi detail kategori di bawah ini.</p>
        </div>
        <div className="glass-container max-w-2xl">
          {message.text && (
            <div className={`p-3 rounded-lg mb-4 text-sm ${message.type === 'success' ? 'bg-green-500/20 text-green-300' : 'bg-red-500/20 text-red-300'}`}>
              {message.text}
            </div>
          )}
          <form className="space-y-6" onSubmit={handleSave}>
            <div>
              <label className="block text-sm font-medium mb-2" htmlFor="nama-kategori">Nama Kategori</label>
              <input id="nama-kategori" type="text" placeholder="Masukkan nama kategori barang" className="w-full px-3 py-2 bg-transparent border border-gray-600 rounded-lg focus:outline-none focus:border-gray-400" value={namaKategori} onChange={(e) => setNamaKategori(e.target.value)} />
            </div>
            {subkategoriList.map((subkategori, index) => (
              <div key={subkategori.id}>
                <label className="block text-sm font-medium mb-2" htmlFor={`subkategori-${subkategori.id}`}>Subkategori {index + 1}</label>
                <div className="flex items-center space-x-2">
                  <input id={`subkategori-${subkategori.id}`} type="text" placeholder="Masukkan nama subkategori" className="w-full px-3 py-2 bg-transparent border border-gray-600 rounded-lg focus:outline-none focus:border-gray-400" value={subkategori.name} onChange={(e) => handleSubkategoriChange(subkategori.id, e.target.value)} />
                  <Button type="button" size="icon" onClick={() => handleRemoveSubkategori(subkategori.id)} aria-label="Hapus Subkategori" className="!p-2.5"><X size={16} /></Button>
                </div>
              </div>
            ))}
            <div className="pt-4 flex justify-between items-center border-t border-gray-700">
              <Button type="button" onClick={handleAddSubkategori} icon={<Plus size={16} />}>Tambah Subkategori</Button>
              <Button type="submit" size="lg" icon={<Save size={18} />} disabled={loading}>{loading ? 'Menyimpan...' : 'Simpan'}</Button>
            </div>
          </form>
        </div>
      </div>

      {/* DAFTAR KATEGORI (SCROLLABLE AREA) */}
      <div className="flex-grow mt-8 flex flex-col min-h-0">
        <div className="mb-6">
          <h2 className="text-xl font-semibold tracking-tight">Daftar Kategori Tersimpan</h2>
          <p className="mt-1 text-sm text-gray-500">Berikut adalah data kategori yang sudah ada di database.</p>
        </div>
        <div className="glass-container flex-grow overflow-y-auto custom-scrollbar">
          {listLoading ? (<p className="text-center text-gray-400">Memuat data...</p>) : 
           kategoriData.length === 0 ? (
            <div className="text-center py-8"><p className="font-medium">Belum ada data kategori.</p><p className="text-sm text-gray-500">Silakan tambahkan data baru menggunakan form di atas.</p></div>
          ) : (
            <div className="space-y-4">
              {kategoriData.map((kategori) => (
                <div key={kategori.id} className="p-4 rounded-lg bg-white/5">
                  {editingId === kategori.id ? (
                    // --- Tampilan Mode Edit ---
                    <div className="space-y-4">
                      <div>
                        <label className="text-xs text-gray-400">Nama Kategori</label>
                        <input type="text" value={editFormData.nama} onChange={(e) => setEditFormData({...editFormData, nama: e.target.value})} className="w-full mt-1 px-3 py-2 bg-transparent border border-gray-600 rounded-lg"/>
                      </div>
                      
                      <div>
                        <label className="text-xs text-gray-400">Subkategori</label>
                        {editFormData.subkategori.map((sub, index) => (
                           <div key={sub.id} className="flex items-center space-x-2 mt-2">
                             <input type="text" value={sub.name} onChange={(e) => handleEditSubkategoriChange(sub.id, e.target.value)} className="w-full px-3 py-2 bg-transparent border border-gray-600 rounded-lg"/>
                             <Button size="icon" onClick={() => handleEditRemoveSubkategori(sub.id)} className="!p-2.5" aria-label="Hapus subkategori"><X size={16}/></Button>
                           </div>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-2 border-t border-gray-700/50">
                        <Button onClick={handleEditAddSubkategori} icon={<Plus size={16}/>}>Tambah</Button>
                        <div className="flex space-x-2">
                          <Button onClick={handleCancelEdit}>Batal</Button>
                          <Button onClick={() => handleUpdate(kategori.id)} disabled={loading}>{loading ? '...' : 'Simpan'}</Button>
                        </div>
                      </div>
                    </div>
                  ) : (
                    // --- Tampilan Mode Normal ---
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-semibold text-base">{kategori.nama}</h3>
                        {kategori.subkategori && kategori.subkategori.length > 0 ? (
                          <div className="flex flex-wrap gap-2 mt-2">
                            {kategori.subkategori.map((sub, index) => (<span key={index} className="text-xs bg-gray-700 text-gray-300 px-2 py-1 rounded-full">{sub}</span>))}
                          </div>
                        ) : (<p className="text-xs text-gray-500 mt-1">Tidak ada subkategori</p>)}
                      </div>
                      <div className="flex space-x-2 flex-shrink-0">
                        {deleteConfirmId === kategori.id ? (
                          <>
                           <Button size="sm" onClick={() => handleDelete(kategori.id)} className="!bg-red-500/50" disabled={loading}>{loading ? '...' : 'Yakin?'}</Button>
                           <Button size="sm" onClick={() => setDeleteConfirmId(null)}>Batal</Button>
                          </>
                        ) : (
                          <>
                           <Button size="icon" className="!p-2" onClick={() => handleEditClick(kategori)}><Edit size={16}/></Button>
                           <Button size="icon" className="!p-2" onClick={() => setDeleteConfirmId(kategori.id)}><Trash2 size={16}/></Button>
                          </>
                        )}
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

export default KategoriBarang;

