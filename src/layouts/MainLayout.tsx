import React from 'react';
import { Outlet } from 'react-router-dom';
import Navbar from '../components/Navbar';
import Sidebar from '../components/Sidebar';
import Footer from '../components/Footer';
import { useAuth } from '../context/AuthContext';

export default function MainLayout() {
  const { user } = useAuth();

  return (
    <div className="min-h-screen bg-[#FFF9F2] flex flex-col">
      <Navbar />
      <div className="flex flex-1 overflow-hidden">
        {user && <Sidebar role={user.role} />}
        <main className="flex-1 flex flex-col overflow-y-auto">
          <div className="p-4 md:p-8 max-w-7xl mx-auto w-full flex-1">
            <Outlet />
          </div>
          <Footer />
        </main>
      </div>
    </div>
  );
}
