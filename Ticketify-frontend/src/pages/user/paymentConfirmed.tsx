import React, { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Link } from 'react-router-dom';
import { ArrowLeftFromLine, CalendarDays } from 'lucide-react';
import { getIdBookings} from '@/services/bookingService'; // đổi từ getUserBookings
import type { BookingDetail } from '@/types/booking';
import { formatDate } from '@/utils/formatDate';
import { useToast } from '@/hooks/use-toast';
import { formatCurrency } from '@/utils/currency';

const PaymentConfirmed = () => {
  const [booking, setBooking] = useState<BookingDetail | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    const fetchBooking = async () => {
      const id = localStorage.getItem('lastBookingId');
      if (!id) {
        toast({
          variant: 'destructive',
          title: 'Missing booking ID',
          description: 'No booking found. Please try again.',
        });
        return;
      }

      try {
        const res = await getIdBookings(Number(id));
        setBooking(res); 
      } catch (error) {
        console.error('❌ Fetch booking failed:', error);
        toast({
          variant: 'destructive',
          title: 'Failed to fetch booking',
          description: 'Something went wrong. Please try again later.',
        });
      }
    };

    fetchBooking();
  }, []);

  if (!booking) {
    return <p className="text-center mt-10">Loading booking info...</p>;
  }
  return (
    <div className="max-w-7xl mx-auto p-6 space-y-10 rounded-md mt-6 mb-6">
      <div className="space-y-1">
        <h2 className="text-xl font-semibold">
          Your Hotel Reservation <span className="text-root-primary-500 font-bold">Booked</span>
        </h2>
        <p className="text-sm">
          Contact EasySet24 If you Need to Change in Basic Information with{' '}
          <strong>{booking.booking_id}</strong> Booking Number.
        </p>
      </div>

      <Card className="shadow-sm border border-gray-300 bg-root-gray-100 rounded-md p-6">
        <CardContent className="p-0">
          <div className="relative w-full overflow-hidden">
            <img
              src="/assets/images/banner-confirm-booked.png"
              alt="Booking Banner"
              className="w-full h-[300px] object-cover"
            />
            <div className="absolute top-4 left-4 p-4">
              <h3 className="text-lg font-bold drop-shadow">
                Booking No. {booking.booking_id} Details
              </h3>
              <p className="text-sm">Check your information here!</p>
            </div>

            <div className="grid grid-cols-6 text-center text-sm font-semibold text-white bg-root-gray-400">
              <div className="py-2 border-r border-white">Stays</div>
              <div className="py-2 border-r border-white flex justify-center items-center gap-1">
                <CalendarDays className="w-4 h-4" />
                Check-In
              </div>
              <div className="py-2 border-r border-white flex justify-center items-center gap-1">
                <CalendarDays className="w-4 h-4" />
                Check-Out
              </div>
              <div className="py-2 border-r border-white">Room Type</div>
              <div className="py-2 border-r border-white">Room Level</div>
              <div className="py-2">Total Price</div>
            </div>

            {Array.isArray(booking.booking_details) && booking.booking_details.length > 0 ? (
              booking.booking_details.map((detail, index) => (
                <div
                  key={index}
                  className="grid grid-cols-6 text-center text-sm font-medium border-b bg-white"
                >
                  <div className="py-2 border-r font-bold">{booking.nights} night(s)</div>
                  <div className="py-2 border-r font-bold">
                    {booking.check_in_date ? formatDate(new Date(booking.check_in_date)) : '--'}
                  </div>
                  <div className="py-2 border-r font-bold">
                    {booking.check_out_date ? formatDate(new Date(booking.check_out_date)) : '--'}
                  </div>
                  <div className="py-2 border-r font-bold">{detail.room_type || '--'}</div>
                  <div className="py-2 border-r font-bold">{detail.room_level || '--'}</div>
                  <div className="py-2 font-bold">
                    {formatCurrency(booking.total_discounted_price) || formatCurrency(booking.total_price)}
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center text-sm text-gray-500 p-4">No booking details found.</div>
            )}
          </div>

          <Link to="/">
            <Button className="flex items-center gap-2 w-60 bg-root-primary-600 text-white hover:bg-root-primary-700 mt-6">
              <span className="flex gap-3">
                <ArrowLeftFromLine className="w-4 h-4" />
                Return To Home Page
              </span>
            </Button>
          </Link>
        </CardContent>
      </Card>

      <div className="space-y-1">
        <h4 className="text-base font-bold">Cancellation Policy</h4>
        <p className="text-sm font-medium">Pay Attention</p>
        <p className="text-sm">
          This booking is considered final and may only be canceled by the hotel in cases of
          unforeseen circumstances or natural disasters.
        </p>
      </div>
    </div>
  );
};

export default PaymentConfirmed;
