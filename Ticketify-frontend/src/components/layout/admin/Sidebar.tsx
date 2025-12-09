import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { removeAuthData } from '@/lib/auth';
import {
  House,
  CalendarCheck,
  NotebookPen,
  Bookmark,
  Tag,
  CircleDollarSign,
  User,
  LogOut,
} from 'lucide-react';
import LogoutDialog from '@/components/common/logoutDialog';

export default function Sidebar() {
  const navigate = useNavigate();
  const [isLogoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const navItems = [
    { to: '/admin/dashboard', label: 'Dashboard', icon: House },
    { to: '/admin/front-desk', label: 'Front Desk', icon: NotebookPen },
    { to: '/admin/guests', label: 'Guests', icon: User },
    { to: '/admin/rooms', label: 'Rooms', icon: Bookmark },
    { to: '/admin/bookings', label: 'Bookings', icon: CalendarCheck },
    { to: '/admin/deals', label: 'Deals', icon: Tag },
    { to: '/admin/rate', label: 'Rate', icon: CircleDollarSign },
  ];

  const onLogoutConfirm = () => {
    removeAuthData();
    navigate('/login');
    setLogoutDialogOpen(false);
  };

  return (
    <aside className="h-full p-6 font-medium bg-white">
      <div className="mb-6">
        <img src="/public/assets/images/logo.png" alt="Logo" className="h-10" />
      </div>
      <nav className="space-y-3">
        {navItems.map(({ to, label, icon: Icon }) => (
          <NavLink
            key={to}
            to={to}
            className={({ isActive }) =>
              `flex items-center gap-3 p-2 rounded-md
              ${
                isActive
                  ? 'bg-adminLayout-primary-50 text-adminLayout-primary-600 font-medium'
                  : 'text-adminLayout-grey-700 hover:text-adminLayout-primary-600'
              }`
            }
          >
            <Icon className="w-5 h-5" />
            {label}
          </NavLink>
        ))}
        <button
          onClick={() => setLogoutDialogOpen(true)}
          className="flex items-center gap-3 p-2 transition-colors rounded-md text-adminLayout-grey-700 hover:text-adminLayout-primary-600"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </nav>

      <LogoutDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        onConfirm={onLogoutConfirm}
      />
    </aside>
  );
}
