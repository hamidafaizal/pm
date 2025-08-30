import React, { useState, useEffect } from 'react';
import { Navigate, Outlet } from 'react-router-dom';
import { supabase } from '../supabase/client';

function PrivateRoute() {
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Cek sesi yang sedang aktif
    const getSession = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setSession(session);
      setLoading(false);
      console.log("Initial session check:", session);
    };
    
    getSession();

    // Dengarkan perubahan status autentikasi
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      console.log("Auth state changed, new session:", session);
    });

    // Berhenti mendengarkan saat komponen unmount
    return () => subscription.unsubscribe();
  }, []);

  if (loading) {
    // Tampilkan loading screen atau null selagi memeriksa sesi
    return null; 
  }

  // Jika ada sesi (sudah login), tampilkan konten. Jika tidak, arahkan ke login.
  return session ? <Outlet /> : <Navigate to="/login" />;
}

export default PrivateRoute;
