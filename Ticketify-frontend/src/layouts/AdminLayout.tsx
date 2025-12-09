import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from '../components/layout/admin/Sidebar';
import Header from '../components/layout/admin/Header';
import { Toaster } from '@/components/ui/toaster';

const AdminLayout: React.FC = () => {
  return (
    <div className="flex flex-auto h-screen">
      <Sidebar />
      <div className="flex flex-col flex-1">
        <Header />
        <main className="flex-1 overflow-auto bg-adminLayout-dashboard-50">
          <Outlet />
          <Toaster />
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
