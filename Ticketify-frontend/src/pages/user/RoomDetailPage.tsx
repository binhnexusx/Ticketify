import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useSearchParams } from 'react-router-dom';
import { motion } from 'framer-motion';

import { getRoomById } from '@/services/bookingService';
import { RoomData } from '@/types/room';
import { API_URL } from '@/constants/api';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { useDispatch } from 'react-redux';
import { setRoomDetail } from '@/redux/room/roomSlice';
import Loading from '@/components/common/Loading';
import { Bed, BedDoubleIcon, LandmarkIcon, LayersIcon, Star } from 'lucide-react';
import { formatDate } from '@/utils/formatDate';
import { formatCurrency } from '@/utils/currency';
import { getToken } from '@/utils/storage';

export default function RoomDetailPage() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { toast } = useToast();

  const [room, setRoom] = useState<RoomData | null>(null);
  const [showAll, setShowAll] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [searchParams] = useSearchParams();
  const checkInDate = searchParams.get('check_in');
  const checkOutDate = searchParams.get('check_out');
  const guest = searchParams.get('max_people');

  const token = getToken();
  const isLoggedIn = !!token;

  useEffect(() => {
    if (!id) return;

    const loadRoom = async () => {
      setIsSubmitting(true);
      try {
        const room = await getRoomById(id);
        setRoom(room);
      } catch (err) {
        console.error(err);
        toast({
          title: 'Error loading room',
          description: 'Something went wrong while fetching room data.',
          variant: 'destructive',
        });
      } finally {
        setIsSubmitting(false);
      }
    };

    loadRoom();
  }, [id, toast]);
  const handleBookNow = () => {
    if (!room) return;

    // if (!checkInDate || !checkOutDate) {
    //   toast({
    //     title: 'Missing dates',
    //     description: 'Please select check-in and check-out dates.',
    //     variant: 'destructive',
    //   });
    //   return;
    // }

    setIsSubmitting(true);

    const bookingInfo = {
      room,
      checkInDate,
      checkOutDate,
      guest: guest ? Number(guest) : room?.max_people,
    };

    dispatch(setRoomDetail(bookingInfo));

    localStorage.setItem('roomDetail', JSON.stringify(bookingInfo));
    toast({
      description: 'Go to booking checkout page to complete booking!',
    });
    setTimeout(() => {
      navigate('/booking-checkout');
    }, 300);
  };

  // <Loading variant="spinner" size="lg" />
  if (!room) {
    return <Loading variant="spinner" size="lg" />;
  }
  const imagesToShow = showAll ? room.images : room.images.slice(0, 5);

  const pricePerNight = Number(room?.price || 0);
  const discount = pricePerNight * (room?.discount_rate || 0);
  const finalPrice = pricePerNight - discount;

  return (
    <Card className="relative w-full max-w-6xl pb-4 mx-auto mt-10 mb-12 overflow-hidden border-none rounded-md shadow-sm">
      <CardContent className="p-0">
        <div>
          <section className="relative grid grid-cols-4 grid-rows-2 gap-1 h-[400px] md:h-[480px]">
            {imagesToShow.map((src, idx) => (
              <motion.div
                key={idx}
                className={idx === 0 ? 'col-span-2 row-span-2 overflow-hidden' : 'overflow-hidden'}
                whileHover={{ scale: 1.01 }}
                transition={{ type: 'spring', stiffness: 200 }}
              >
                <img
                  src={`${API_URL}${src}`}
                  alt={`room-img-${idx}`}
                  className="object-cover w-full h-full rounded-md"
                />
              </motion.div>
            ))}
          </section>
        </div>
        <section className="grid gap-6 px-4 mt-4 md:grid-rows-2">
          <div className="space-y-4 text-sm leading-relaxed">
            <h3 className="text-base font-semibold md:text-lg text-primary"># {room.name}</h3>
            <div className="flex items-center gap-20 text-sm text-gray-600">
              <div>
                <span className="flex gap-2 font-bold">
                  <LayersIcon className=" text-root-primary-500" size={18} />
                  {room.floor_name}
                </span>
              </div>
              <div>
                <span className="flex items-end gap-2 font-bold">
                  <BedDoubleIcon className=" text-root-primary-500" size={19} />
                  Type: {room.room_type}
                </span>
              </div>
              <div>
                <span className="flex gap-2 font-bold">
                  <LandmarkIcon className=" text-root-primary-500" size={18} />
                  Level: {room.room_level}
                </span>
              </div>
            </div>
            <p>{room.description}</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3">
            {/* Amenities */}
            <div className="md:col-span-2">
              <h4 className="mb-4 text-base font-semibold md:text-lg text-primary">Amenities</h4>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-y-2">
                {room.amenities.map((amenity) => (
                  <div key={amenity.name} className="flex items-center gap-2">
                    <img
                      src={`${API_URL}${amenity.icon}`}
                      alt={amenity.name}
                      className="object-contain w-5 h-5"
                    />
                    <span>{amenity.name}</span>
                  </div>
                ))}
              </ul>
            </div>

            <div className="flex flex-col items-end justify-end pt-4 pb-3 border-t md:border-t-0">
              <div>
                {(room?.discount_rate ?? 0) > 0 && (
                  <>
                    <span className="text-sm text-red-500">
                      {((room.discount_rate ?? 0) * 100).toFixed(0)}% off
                    </span>
                    <span className="ml-3 line-through text-md text-root-gray-500">
                      {formatCurrency(room.price)}
                    </span>
                    <span className="ml-1">/night</span>
                  </>
                )}

                {/* {(room?.discount_rate ?? 0) === 0 && (
                  <span className="text-md">
                    {formatCurrency(room.price)}
                    <span className="ml-1">/night</span>
                  </span>
                )} */}
              </div>

              <div>
                <span className="text-xl font-bold text-root-state-Success_Dark">
                  ${finalPrice}
                </span>
                <span className="ml-1 font-bold">/night</span>
              </div>

              <Button
                onClick={handleBookNow}
                className="h-10 mt-2 w-36"
                type="button"
                disabled={!isLoggedIn || isSubmitting}
              >
                {isSubmitting ? <Loading variant="spinner" size="md" /> : 'Book Now'}
              </Button>
            </div>
          </div>

          <section className="mt-2">
            <div className="flex justify-between gap-2">
              <h4 className="mt-2 mb-3 text-lg font-semibold">Guest Reviews</h4>
              <span className="flex items-center gap-2">
                {/* <div className="flex text-lg text-yellow-500">{'★'.repeat(5)}</div>
                <div className="text-sm font-medium text-gray-600">5</div> */}
                <div className="text-sm text-gray-500">({room.feedbacks?.length || 0} Reviews)</div>
              </span>
            </div>

            {room.feedbacks?.length ? (
              room.feedbacks.map((fb, idx) => (
                <div key={idx} className="py-5 border-b">
                  <h5 className="text-sm font-bold">{fb.user_name}</h5>
                  <div className="flex items-center gap-1 mb-1">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        size={16}
                        fill={i < fb.rating ? '#facc15' : 'none'}
                        className={i < fb.rating ? 'text-yellow-500' : 'text-gray-300'}
                      />
                    ))}
                    <p className="ml-2 text-sm text-gray-500">
                      {formatDate(new Date(fb.created_at), 'DD-MM-YYYY')}{' '}
                    </p>
                  </div>

                  <p className="mt-1 text-sm text-gray-700">{fb.comment}</p>
                </div>
              ))
            ) : (
              <p className="text-sm text-gray-500">Room wasn't feedback yet.</p>
            )}
          </section>
        </section>
      </CardContent>
    </Card>
  );
}
