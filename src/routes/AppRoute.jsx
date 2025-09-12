import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../auth/Login.jsx';
import Register from '../auth/Register.jsx';
import MainLayout from '../layouts/MainLayout.jsx';
import GudangLayout from '../layouts/GudangLayout.jsx';
import App from '../App.jsx';
import Gudang from '../pages/Gudang.jsx';
import DatabaseBahanBaku from '../pages/gudang/DatabaseBahanBaku.jsx';
import BahanBaku from '../pages/gudang/BahanBaku.jsx'; // Impor komponen BahanBaku
import Pengaturan from '../pages/gudang/Pengaturan.jsx';
import KategoriBarang from '../pages/gudang/pengaturan/KategoriBarang.jsx';
import SatuanBarang from '../pages/gudang/pengaturan/SatuanBarang.jsx';
import PrivateRoute from './PrivateRoute.jsx';

function AppRoute() {
  // Komponen yang mengatur semua routing aplikasi
  console.log("AppRoute component rendered");
  return (
    <BrowserRouter>
      <Routes>
        {/* Rute publik untuk autentikasi */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Rute yang dilindungi */}
        <Route element={<PrivateRoute />}>
          {/* Rute dengan layout utama (tanpa navbar) */}
          <Route path="/" element={<MainLayout />}>
            <Route index element={<App />} />
          </Route>

          {/* Rute dengan layout Gudang (dengan navbar) */}
          <Route path="/gudang" element={<GudangLayout />}>
            <Route index element={<Gudang />} />
            <Route path="database-bahan-baku" element={<DatabaseBahanBaku />} />
            <Route path="bahan-baku" element={<BahanBaku />} /> {/* Rute baru untuk Bahan Baku */}
            <Route path="pengaturan" element={<Pengaturan />} />
            <Route path="pengaturan/kategori-barang" element={<KategoriBarang />} />
            <Route path="pengaturan/satuan-barang" element={<SatuanBarang />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default AppRoute;

