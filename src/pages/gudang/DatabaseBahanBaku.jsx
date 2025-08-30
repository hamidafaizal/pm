import React from 'react';
import { Pencil, Trash2 } from 'lucide-react'; // Impor ikon

// Data dummy untuk tabel
const dummyData = [
  { id: 1, jenis: 'Katun Combed 30s', warna: 'Hitam', harga: 'Rp 120.000', satuan: 'kg' },
  { id: 2, jenis: 'Katun Combed 24s', warna: 'Putih', harga: 'Rp 115.000', satuan: 'kg' },
  { id: 3, jenis: 'Fleece CVC', warna: 'Abu Misty', harga: 'Rp 135.000', satuan: 'kg' },
  { id: 4, jenis: 'Baby Terry', warna: 'Biru Navy', harga: 'Rp 125.000', satuan: 'kg' },
  { id: 5, jenis: 'Benang Jahit', warna: 'Merah', harga: 'Rp 5.000', satuan: 'ons' },
];

function DatabaseBahanBaku() {
  // Halaman untuk menampilkan database bahan baku
  console.log("DatabaseBahanBaku page rendered");

  return (
    <div className="bg-gray-800 p-6 rounded-lg shadow-lg">
      <h1 className="text-2xl font-bold mb-6">Database Bahan Baku</h1>
      
      <div className="overflow-x-auto">
        <table className="min-w-full text-sm text-left text-gray-300">
          <thead className="text-xs text-gray-400 uppercase bg-gray-700">
            <tr>
              <th scope="col" className="px-6 py-3">
                Jenis Kain
              </th>
              <th scope="col" className="px-6 py-3">
                Warna Kain
              </th>
              <th scope="col" className="px-6 py-3">
                Harga Kain
              </th>
              <th scope="col" className="px-6 py-3">
                Satuan
              </th>
              <th scope="col" className="px-6 py-3 text-center">
                Aksi
              </th>
            </tr>
          </thead>
          <tbody>
            {dummyData.map((item) => (
              <tr key={item.id} className="bg-gray-800 border-b border-gray-700 hover:bg-gray-600">
                <th scope="row" className="px-6 py-4 font-medium text-white whitespace-nowrap">
                  {item.jenis}
                </th>
                <td className="px-6 py-4">
                  {item.warna}
                </td>
                <td className="px-6 py-4">
                  {item.harga}
                </td>
                <td className="px-6 py-4">
                  {item.satuan}
                </td>
                <td className="px-6 py-4 text-center">
                  <div className="flex justify-center space-x-4">
                    <button className="text-blue-400 hover:text-blue-300">
                      <Pencil size={18} />
                    </button>
                    <button className="text-red-500 hover:text-red-400">
                      <Trash2 size={18} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default DatabaseBahanBaku;
