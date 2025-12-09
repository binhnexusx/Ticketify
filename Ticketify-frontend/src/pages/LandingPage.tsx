import React, { useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '@/components/common/SearchBar';
import { Card } from '@/components/ui/card';
import Loading from '@/components/common/Loading';
import { motion } from 'framer-motion';
import { RoomSearchFormValues } from '@/types/index';
import { useHomepage } from '@/hooks/useHomepage';
import { Star, MapPin, Users, Award } from 'lucide-react';
import { API_URL } from '@/lib/axios';
import { useFavoriteRoom } from '@/hooks/useHomepage';

export default function LandingPage() {
  const navigate = useNavigate();
  const { rooms, topAmenities, topFeedbacks, loading, error } = useHomepage();
  const { handleAdd, handleDelete, addFavorite } = useFavoriteRoom();

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

  const handleCardClick = (roomId: number) => {
    navigate(`/rooms/${roomId}`);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-slate-100">
      <div className="relative mb-8 overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900/20 to-slate-800/10"></div>
        <img
          src={`public/assets/images/banner-guest.png`}
          alt="Luxury Hotel Experience"
          className="w-full h-[60vh] object-cover"
        />

        <div className="absolute inset-0 flex flex-col items-center justify-center px-4 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: 'easeOut' }}
            className="max-w-4xl mx-auto"
          >
            <h1 className="mb-4 text-4xl font-bold leading-tight text-white md:text-6xl">
              Discover Your Perfect
              <span className="block text-transparent bg-gradient-to-r from-amber-400 to-orange-500 bg-clip-text">
                Getaway
              </span>
            </h1>
            <p className="max-w-2xl mx-auto text-lg font-light md:text-xl text-white/90">
              Experience luxury and comfort in the world's most beautiful destinations
            </p>
          </motion.div>
        </div>
      </div>

      <div className="container relative z-10 px-4 mx-auto mb-12 -mt-4">
        <SearchBar onSearch={handleSearch} />
      </div>

      <div className="container px-4 pb-16 mx-auto">
        <section className="mb-20">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="mb-16 text-center"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-sm font-medium rounded-full bg-amber-100 text-amber-800">
              <Award className="w-4 h-4" />
              Premium Collection
            </div>
            <h2 className="mb-4 text-4xl font-bold md:text-5xl text-slate-800">
              Trending Destinations
            </h2>
            <p className="max-w-2xl mx-auto text-xl text-slate-600">
              Handpicked accommodations in the most sought-after locations
            </p>
          </motion.div>

          {error && (
            <div className="p-4 mb-8 border border-red-200 rounded-lg bg-red-50">
              <p className="font-medium text-red-600">{error}</p>
            </div>
          )}

          <motion.div
            className="flex flex-wrap justify-center max-w-5xl gap-8 mx-auto"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: 'easeOut', delay: 0.2 }}
          >
            {loading ? (
              Array.from({ length: 3 }).map((_, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="w-full sm:w-80"
                >
                  <Loading variant="card" size="md" cardVariant="vertical" />
                </motion.div>
              ))
            ) : rooms.length > 0 ? (
              rooms.map((room, index) => (
                <motion.div
                  key={room.room_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  whileHover={{ y: -8 }}
                  className="w-full group sm:w-80"
                >
                  <Card
                    variant="vertical"
                    name={room.name}
                    description={room.description}
                    imageUrl={`${API_URL}${room.images?.[0] || '/placeholder.jpg'}`}
                    roomType={room.room_type_name}
                    roomLevel={room.room_level_name}
                    onClick={() => handleCardClick(room.room_id)}
                    onAdd={async () => handleAdd(room.room_id)}
                    onRemove={async () => handleDelete(room.room_id)}
                    className="h-full overflow-hidden transition-all duration-300 bg-white border-0 shadow-lg cursor-pointer rounded-2xl group-hover:shadow-2xl"
                  />
                </motion.div>
              ))
            ) : (
              <div className="py-16 text-center col-span-full">
                <div className="flex items-center justify-center w-16 h-16 mx-auto mb-4 rounded-full bg-slate-100">
                  <MapPin className="w-8 h-8 text-slate-400" />
                </div>
                <p className="text-xl text-slate-500">No rooms available at the moment</p>
                <p className="mt-2 text-slate-400">Check back soon for new listings</p>
              </div>
            )}
          </motion.div>
        </section>

        {topAmenities.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
            className="mb-20"
          >
            <div className="p-8 border shadow-xl bg-gradient-to-br from-white to-slate-50 rounded-3xl md:p-16 border-slate-100">
              <div className="mb-12 text-center">
                <h3 className="mb-4 text-3xl font-bold md:text-4xl text-slate-800">
                  Premium Amenities
                </h3>
                <p className="max-w-2xl mx-auto text-lg text-slate-600">
                  Every stay includes access to our world-class facilities and services
                </p>
              </div>

              <div className="grid max-w-4xl grid-cols-2 gap-8 mx-auto md:grid-cols-4">
                {topAmenities.map((amenity, index) => (
                  <motion.div
                    key={amenity.amenity_id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: index * 0.1, duration: 0.3 }}
                    whileHover={{
                      scale: 1.05,
                      y: -5,
                    }}
                    className="flex flex-col items-center gap-4 p-6 transition-all duration-300 bg-white border shadow-md cursor-pointer rounded-2xl hover:bg-gradient-to-br hover:from-blue-50 hover:to-indigo-50 group hover:shadow-xl border-slate-100 hover:border-blue-200"
                  >
                    <div className="flex items-center justify-center w-16 h-16 transition-all duration-300 shadow-lg bg-gradient-to-br from-slate-100 to-slate-200 group-hover:from-blue-100 group-hover:to-indigo-200 rounded-2xl group-hover:shadow-xl group-hover:rotate-3">
                      <img
                        src={`${API_URL}${amenity.icon}`}
                        alt={amenity.name}
                        className="object-contain w-8 h-8 transition-transform duration-300 group-hover:scale-110"
                      />
                    </div>
                    <span className="text-sm font-semibold leading-tight text-center transition-colors duration-300 text-slate-700 group-hover:text-indigo-700">
                      {amenity.name}
                    </span>
                    <div className="w-0 group-hover:w-12 h-0.5 bg-gradient-to-r from-blue-400 to-indigo-500 transition-all duration-300 rounded-full"></div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.section>
        )}

        {topFeedbacks.length > 0 && (
          <motion.section
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className="mb-20"
          >
            <div className="mb-12 text-center">
              <div className="inline-flex items-center gap-2 px-4 py-2 mb-4 text-sm font-medium text-green-800 bg-green-100 rounded-full">
                <Star className="w-4 h-4 fill-current" />
                Guest Reviews
              </div>
              <h3 className="mb-4 text-3xl font-bold md:text-4xl text-slate-800">
                What Our Guests Say
              </h3>
              <p className="max-w-2xl mx-auto text-lg text-slate-600">
                Real experiences from real guests who've stayed with us
              </p>
            </div>

            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
              {topFeedbacks.map((feedback, index) => (
                <motion.div
                  key={feedback.hotel_feedback_id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  className="p-6 transition-shadow duration-300 bg-white border shadow-lg rounded-2xl border-slate-100 hover:shadow-xl"
                >
                  <div className="flex items-center gap-4 mb-4">
                    <div className="relative">
                      <img
                        src={`${API_URL}${feedback.avatar_url}`}
                        alt={feedback.full_name}
                        className="object-cover border-2 rounded-full w-14 h-14 border-slate-100"
                      />
                      <div className="absolute flex items-center justify-center w-5 h-5 bg-green-500 border-2 border-white rounded-full -bottom-1 -right-1">
                        <div className="w-2 h-2 bg-white rounded-full"></div>
                      </div>
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-slate-800">{feedback.full_name}</h4>
                      <p className="text-sm text-slate-500">
                        {new Date(feedback.submitted_at).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'long',
                          day: 'numeric',
                        })}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-center gap-1 mb-3">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`w-4 h-4 ${
                          i < feedback.rating ? 'text-amber-400 fill-current' : 'text-slate-300'
                        }`}
                      />
                    ))}
                    <span className="ml-2 text-sm font-medium text-slate-600">
                      {feedback.rating}/5
                    </span>
                  </div>

                  <blockquote className="leading-relaxed text-slate-600">
                    "{feedback.comment}"
                  </blockquote>
                </motion.div>
              ))}
            </div>
          </motion.section>
        )}

        <motion.section
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center"
        ></motion.section>
      </div>
    </div>
  );
}
