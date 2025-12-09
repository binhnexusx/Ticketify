import React, { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import {
  User,
  CreditCard,
  HelpCircle,
  Settings,
  LogOut,
  ChevronRight,
  type LucideIcon,
  Notebook,
  Heart,
} from "lucide-react";
import { getUser } from "@/services/profile";
import { API_URL } from "@/constants/api";
import { removeAuthData } from "@/lib/auth";
import { useNavigate, Link } from "react-router-dom";
import LogoutDialog from "@/components/common/logoutDialog";

interface MenuItemProps {
  icon: LucideIcon;
  label: string;
  href: string;
}

interface ApiUser {
  user_id: number;
  first_name: string;
  last_name: string;
  email: string;
  avatar_url?: string;
}

const menuItems: MenuItemProps[] = [
  { icon: User, label: "My Account", href: "/user/profile" },
  { icon: Notebook, label: "Booking History", href: "/user/bookingHistories" },
  { icon: Heart, label: "Favorite Rooms", href: "/user/favouriteRooms" },
  { icon: Settings, label: "Settings", href: "/user/setting" },
];

const MenuItem: React.FC<MenuItemProps> = ({ icon: Icon, label, href }) => (
  <Link
    to={href}
    className="flex items-center justify-between w-full px-4 py-3 text-sm text-black transition-colors duration-200 border-b hover:bg-root-primary-500 hover:text-white"
  >
    <span className="flex items-center gap-3">
      <Icon className="w-5 h-5" />
      {label}
    </span>
    <ChevronRight className="w-4 h-4" />
  </Link>
);

export default function CustomerProfile() {
  const [user, setUser] = useState<ApiUser | null>(null);
  const [isLogoutDialogOpen, setLogoutDialogOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const localUser =
          localStorage.getItem("user") || sessionStorage.getItem("user");
        if (!localUser) return;

        const parsed = JSON.parse(localUser);
        const userId = parsed.user_id || parsed.id;
        if (!userId) return;

        const res = await getUser(userId);
        setUser(res);
      } catch (err) {
        console.error("❌ Lỗi lấy user:", err);
      }
    };

    fetchUser();
  }, []);

  const onLogoutConfirm = () => {
    removeAuthData();
    navigate('/login');
    setLogoutDialogOpen(false);
  };

  return (
    <>
      <Card className="w-full max-w-xs sm:max-w-sm md:w-[250px] rounded-none overflow-visible mx-auto">
        {/* Avatar + Email */}
        <div className="flex items-center gap-3 px-4 pt-4 pb-3">
          <img
            src={
              user?.avatar_url
                ? `${API_URL}${user.avatar_url}`
                : "/public/assets/images/avatar.png"
            }
            alt="avatar"
            className="object-cover w-12 h-12 rounded-full"
          />
          <p
            className="text-sm font-medium text-gray-700 break-all"
            title={user?.email}
          >
            {user?.email
              ? user.email.length > 19
                ? user.email.slice(0, 16) + "..."
                : user.email
              : "No email"}
          </p>
        </div>

        <div className="border-t" />

        {/* Menu items */}
        <div className="flex flex-col">
          {menuItems.map((item) => (
            <MenuItem key={item.label} {...item} />
          ))}
        </div>

        <div className="border-t" />

        {/* Nút mở dialog logout */}
        <button
          onClick={() => setLogoutDialogOpen(true)}
          className="flex items-center w-full gap-3 px-4 py-3 text-sm font-semibold transition-colors duration-200 text-root-primary-500 hover:text-white hover:bg-root-primary-500"
          type="button"
        >
          <LogOut className="w-5 h-5" />
          <span>Sign Out</span>
        </button>
      </Card>

      {/* Dialog logout */}
      <LogoutDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        onConfirm={onLogoutConfirm}
      />
    </>
  );
}
