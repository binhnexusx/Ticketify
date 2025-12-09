import React, { useEffect } from 'react';
import { Link, NavLink } from 'react-router-dom';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent } from '@/components/ui/dropdown-menu';
import { Button } from '@/components/ui/button';
import CustomerProfile from '@/components/layout/CustomerProfile';
import { getAccessToken } from '@/lib/auth';
import { API_URL } from '@/constants/api';
import { useAppDispatch, useAppSelector } from '@/redux/store';
import { fetchUser } from '@/redux/userSlice';

const Header: React.FC = () => {
  const dispatch = useAppDispatch();
  const { data: user, loading } = useAppSelector((state) => state.user);
  const token = getAccessToken();

  useEffect(() => {
    if (token) {
      dispatch(fetchUser());
    }
  }, [dispatch, token]);

  return (
    <header className="shadow-sm bg-neutral-100">
      <nav className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl md:h-66 md:px-10">
        {/* Logo */}
        <NavLink to="/" aria-label="Home">
          <img
            src="/public/assets/images/logo.png"
            alt="EasyStay24 Logo"
            className="w-auto h-12 md:h-66 md:w-91"
          />
        </NavLink>

        {token && user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 cursor-pointer focus:outline-none">
                <Avatar className="w-10 h-10">
                  <AvatarImage
                    src={user.avatar_url ? `${API_URL}${user.avatar_url}` : '/public/assets/images/avatar.png'}
                    alt={`${user.first_name} ${user.last_name}`}
                  />
                  <AvatarFallback>{user.first_name?.[0] ?? 'U'}</AvatarFallback>
                </Avatar>
                <div className="text-sm leading-tight text-left">
                  <p className="font-bold text-root-primary-600">Your account</p>
                  <p className="text-root-primary-500">
                    {user.first_name} {user.last_name}
                  </p>
                </div>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="p-0 mt-2 w-100 me-10">
              <CustomerProfile />
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <div className="flex gap-4">
            <Link to="/login">
              <Button variant="outline" className="px-16 py-2 text-base">
                Sign in
              </Button>
            </Link>
            <Link to="/register">
              <Button variant="outline" className="px-16 py-2 text-base">
                Register
              </Button>
            </Link>
          </div>
        )}
      </nav>
    </header>
  );
};

export default Header;
