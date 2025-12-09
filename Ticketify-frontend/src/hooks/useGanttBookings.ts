import { useState, useEffect } from 'react';
import { Booking, UseBookingDataReturn, BookingStatus } from '../types/gantt';
import { API_URL } from '@/lib/axios';

export const useGanttBookings = (): UseBookingDataReturn => {
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBookings = async () => {
      try {
        const response = await fetch(`${API_URL}/api/bookings/all`);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }

        const result = await response.json();
        if (!result || !result.data) {
          throw new Error('Invalid API response: missing data field');
        }

        if (!Array.isArray(result.data)) {
          throw new Error('Invalid API response: data is not an array');
        }

        const mappedBookings: Booking[] = result.data
          .filter((item: any, index: number) => {
            console.log(`🔍 Processing booking ${index}:`, item);

            if (!item.check_in_date || !item.check_out_date) {
              console.warn(`⚠️ Skipping booking ${index}: missing dates`);
              return false;
            }

            const checkInDate = new Date(item.check_in_date);
            const checkOutDate = new Date(item.check_out_date);

            if (isNaN(checkInDate.getTime()) || isNaN(checkOutDate.getTime())) {
              console.warn(`⚠️ Skipping booking ${index}: invalid dates`);
              return false;
            }

            if (checkOutDate < checkInDate) {
              console.warn(`⚠️ Skipping booking ${index}: checkout before checkin`);
              return false;
            }

            return true;
          })
          .map((item: any, index: number) => {
            const today = new Date();
            today.setHours(0, 0, 0, 0);

            const uniqueId = `${item.booking_id || 'unknown'}-${index}`;
            const checkInDate = new Date(item.check_in_date);
            const checkOutDate = new Date(item.check_out_date);
            checkInDate.setHours(0, 0, 0, 0);
            checkOutDate.setHours(0, 0, 0, 0);

            let mappedStatus: BookingStatus;
            if (item.status === 'cancelled') {
              mappedStatus = 'cancelled';
            } else if (today < checkInDate || item.status === 'booked') {
              mappedStatus = 'due-in';
            } else if (
              today.toDateString() === checkOutDate.toDateString() &&
              item.status === 'checked_in'
            ) {
              mappedStatus = 'due-out';
            } else if (
              today >= checkInDate &&
              today < checkOutDate &&
              item.status === 'checked_in'
            ) {
              mappedStatus = 'checked-in';
            } else {
              mappedStatus = 'checked-out';
            }

            const mappedBooking = {
              id: uniqueId,
              name: item.user_name || item.name || 'Unknown Guest',
              startDate: checkInDate,
              endDate: checkOutDate,
              status: mappedStatus,
              room: item.room_name || item.room || `Room ${item.room_id || 'Unknown'}`,
            };

            console.log(`✅ Mapped booking ${index}:`, mappedBooking);
            return mappedBooking;
          });

        console.log('🎉 Final mapped bookings:', mappedBookings);
        setBookings(mappedBookings);
        setLoading(false);
      } catch (err: any) {
        console.error('💥 Error fetching bookings:', err);
        console.error('💥 Error stack:', err.stack);

        let errorMessage = 'Failed to load timeline. Please try again later.';

        if (err.name === 'TypeError' && err.message.includes('fetch')) {
          errorMessage =
            'Network error: Cannot connect to server. Please check if the API is running.';
        } else if (err.message.includes('HTTP')) {
          errorMessage = `Server error: ${err.message}`;
        } else if (err.message.includes('Invalid API response')) {
          errorMessage = `Data error: ${err.message}`;
        }

        setError(errorMessage);
        setLoading(false);
      }
    };

    fetchBookings();
  }, []);

  return { bookings, loading, error };
};
