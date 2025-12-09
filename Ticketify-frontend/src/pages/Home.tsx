import React, { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import SearchBar from '@/components/common/SearchBar';
import { useRooms } from '@/hooks/useRooms';
import { Card } from '@/components/ui/card';
import { getAccessToken } from '@/lib/auth';
import LandingPage from './LandingPage';
import Loading from '@/components/common/Loading';
import { motion } from 'framer-motion';
import { RoomSearchFormValues } from '@/types/index';
import { API_URL } from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';

const Home: React.FC = () => {
  const token = getAccessToken();
  const navigate = useNavigate();
  const { rooms, loading } = useRooms(1, 12);
  const { toast } = useToast();

  const handleSearch = useCallback(
    (params: RoomSearchFormValues) => {
      const queryParams: Record<string, string> = {
        check_in: params.check_in.toISOString(),
        check_out: params.check_out.toISOString(),
        people: params.people?.toString() || '1',
      };

      if (params.room_level) {
        queryParams.room_level = params.room_level.toString();
      }

      const queryString = new URLSearchParams(queryParams).toString();
      navigate(`/rooms?${queryString}`);
    },
    [navigate]
  );

  const hasToken = () => {
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');
    return !!token;
  };

  const handleTokenCheck = () => {
    if (!hasToken()) {
      toast({
        title: 'Not logged in',
        description: 'Please log in to continue.',
        variant: 'destructive',
      });
      setTimeout(() => {
        navigate('/login');
      }, 1000);
      return false;
    }
    return true;
  };

  // truyền param cho room detail
  const handleCardClick = (roomId: number) => {
    navigate(`/rooms/${roomId}`);
  };

  if (token) return <LandingPage />;

  return (
    <>
      <img
        src="/public/assets/images/banner-guest.png"
        alt="Banner"
        className="block w-full h-auto"
      />
      {/* Truyền handleSearch vào SearchBar */}
      <SearchBar onSearch={handleSearch} />
      <section className="flex-col items-center mx-10 mb-16">
        <h2 className="mb-2 text-3xl font-bold">Explore Stays In Trending Destinations</h2>
        <p className="mb-8 text-lg font-semibold">Find hot Stays!</p>

        <motion.div
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-[2rem]"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: 'easeOut' }}
        >
          {loading ? (
            Array.from({ length: 4 }).map((_, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Loading variant="card" size="md" cardVariant="vertical" className="mt-6" />
              </motion.div>
            ))
          ) : rooms.length > 0 ? (
            rooms.map((room, index) => (
              <motion.div
                key={room.room_id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1, duration: 0.4 }}
              >
                <Card
                  variant="vertical"
                  name={room.name}
                  description={room.description}
                  imageUrl={`${API_URL}${room.images?.[0] || '/placeholder.jpg'}`}
                  roomType={room.room_type_name}
                  roomLevel={room.room_level_name}
                  onClick={() => handleCardClick(room.room_id)}
                  className="cursor-pointer"
                  handleTokenCheck={handleTokenCheck}
                />
              </motion.div>
            ))
          ) : (
            <p className="text-lg text-gray-500 col-span-full">No rooms available.</p>
          )}
        </motion.div>
      </section>
    </>
  );
};

export default Home;
