import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Login from '../auth/Login';
import Register from '../auth/Register';
import MainLayout from '../layouts/MainLayout';
import GudangLayout from '../layouts/GudangLayout';
import App from '../App';
import Gudang from '../pages/Gudang';
import DatabaseBahanBaku from '../pages/gudang/DatabaseBahanBaku';
import Pengaturan from '../pages/gudang/Pengaturan';
import KategoriBarang from '../pages/gudang/pengaturan/KategoriBarang';
import SatuanBarang from '../pages/gudang/pengaturan/SatuanBarang';
import PrivateRoute from './PrivateRoute';

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

