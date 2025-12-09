import React, { useEffect, useState } from "react";
import { Outlet, useLocation, useNavigate } from "react-router-dom";
import { getUser } from "@/services/profile";
import { removeAuthData, getCurrentUser } from "@/lib/auth";
import { UserData } from "@/types/auth";
import Sidebar from "./profile/Sidebar";
import { logout } from "@/services/auth";
import { Toaster } from '@/components/ui/toaster';

const ProfileLayout: React.FC = () => {
  const [user, setUser] = useState<UserData | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const currentUser = getCurrentUser();
    if (!currentUser?.id) {
      navigate("/login");
      return;
    }

    const fetchUser = async () => {
      try {
        const res = await getUser(currentUser.id);
        setUser(res);
      } catch (error) {
        console.error("Failed to fetch user:", error);
        navigate("/login");
      }
    };

    fetchUser();
  }, [navigate]);

  const handleLogout = async () => {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      try {
        await logout(refreshToken);
      } catch (error) {
        console.error("Logout API failed:", error);
      }
    }
    removeAuthData();
    navigate("/login");
  };

  if (!user) return null;

  return (
    <div className="flex min-h-screen bg-root-gray-100">
      <Sidebar
        user={user}
        currentPath={location.pathname}
        onLogout={handleLogout}
      />
      <main className="flex-1 p-6 mr-[100px]">
        <Outlet context={{ user, setUser }} />
      </main>
      <Toaster />
    </div>
  );
};

export default ProfileLayout;
