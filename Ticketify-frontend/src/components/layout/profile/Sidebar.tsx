import React, { FC, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  User,
  Settings,
  Star,
  Sliders,
  ChevronRight,
  Notebook,
  Heart,
} from "lucide-react";
import { removeAuthData, getAccessToken } from "@/lib/auth";
import LogoutDialog from "@/components/common/logoutDialog";
import { useAppDispatch, useAppSelector } from "@/redux/store";
import { fetchUser } from "@/redux/userSlice";

const navItems = [
  { icon: <User size={16} />, text: "My Account", to: "/user/profile" },
  {
    icon: <Notebook size={16} />,
    text: "Booking Histories",
    to: "/user/bookingHistories",
  },
  { icon: <Heart size={16} />, text: "Favourite Rooms", to: "/user/favouriteRooms" },
  { icon: <Sliders size={16} />, text: "Preferences", to: "/user/preferences" },
  { icon: <Star size={16} />, text: "Feedback", to: "/user/feedback" },
  { icon: <Settings size={16} />, text: "Settings", to: "/user/setting" },
];

type Props = {
  currentPath: string;
};

const Sidebar: FC<Props> = ({ currentPath }) => {
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { data: user } = useAppSelector((state) => state.user);
  const [isLogoutDialogOpen, setLogoutDialogOpen] = useState(false);

  const token = getAccessToken();

  useEffect(() => {
    if (token) {
      dispatch(fetchUser());
    }
  }, [dispatch, token]);

  const onLogoutConfirm = () => {
    removeAuthData();
    navigate("/login");
    setLogoutDialogOpen(false);
  };

  if (!user) return null;

  return (
    <aside className="w-[420px] bg-[#F9F9F9] p-6 flex flex-col gap-6 ml-[100px]">
      <div className="p-4 bg-white rounded-lg shadow-sm">
        <p className="font-semibold text-[#000]">
          Hi, <span>{user.name}</span>
        </p>
        <p className="text-[#000] truncate" title={user.email.toLowerCase()}>
          {user.email.length <= 20
            ? user.email
            : user.email.slice(0, 30) + "..."}
        </p>
      </div>

      <p className="mb-4 text-sm text-gray-500">
        Manage your profile, rewards, and preferences for all our brands in one
        place.
      </p>

      <nav className="flex flex-col gap-3">
        {navItems.map((item) => (
          <button
            key={item.to}
            onClick={() => navigate(item.to)}
            className={`flex items-center justify-between gap-3 px-4 py-2 rounded-lg border border-gray-200 bg-white
              ${
                currentPath === item.to
                  ? "text-root-primary-500 font-medium"
                  : "hover:bg-gray-100 text-gray-700"
              }`}
          >
            <div className="flex items-center gap-2">
              {item.icon}
              {item.text}
            </div>
            <ChevronRight size={16} />
          </button>
        ))}
      </nav>

      <button
          onClick={() => setLogoutDialogOpen(true)}
          className="flex items-center gap-3 px-4 py-2 font-bold bg-white border border-gray-200 rounded-lg hover:bg-gray-100 text-root-primary-500"
        >
        Sign Out
      </button>

      <LogoutDialog
        isOpen={isLogoutDialogOpen}
        onClose={() => setLogoutDialogOpen(false)}
        onConfirm={onLogoutConfirm}
      />
    </aside>
  );
};

export default Sidebar;
