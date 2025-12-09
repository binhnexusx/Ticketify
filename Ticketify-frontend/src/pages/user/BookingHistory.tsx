import { StatusFilterDropdown } from '@/components/layout/profile/statusFilter';
import AdminPagination from '@/components/ui/admin-pagination';
import { Card } from '@/components/ui/card';
import { getCurrentUser } from '@/lib/auth';
import { getUserBookings } from '@/services/bookingService';
import { BookingDetail } from '@/types/booking';
import { useEffect, useState } from 'react';
import { API_URL } from '@/lib/axios';
import { useToast } from '@/hooks/use-toast';

export default function BookingHistory() {
  const [bookings, setBookings] = useState<BookingDetail[]>([]);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [filterStatus, setFilterStatus] = useState('all');
  const [loading, setLoading] = useState(false);
  const limit = 5;
  const { toast } = useToast();

  useEffect(() => {
    const fetchBookings = async () => {
      setLoading(true);
      const user = getCurrentUser();
      const userId = user?.id;
      try {
        const status = filterStatus === 'all' ? undefined : filterStatus;
        const res = await getUserBookings(userId, page, limit, status);
        setBookings(res.data);
        setTotal(Number(res.total));
      } catch (error) {
        console.error('Failed to fetch bookings:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchBookings();
  }, [page, filterStatus]);

  const totalPages = Math.ceil(total / limit);

  const handleFilterChange = (value: string) => {
    setFilterStatus(value);
    setPage(1);
  };

  const handleFeedbackBlocked = () => {
  toast({
    variant: "destructive",
    title: "Cannot Leave Feedback Yet",
    description: "You can only leave feedback after your stay",
  });
};

  return (
    <Card className="p-5 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-lg font-bold">Booking History</h2>
          <p className="text-sm text-gray-600">Manage your past and upcoming reservations</p>
        </div>

        <StatusFilterDropdown selected={filterStatus} onChange={handleFilterChange} />
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : bookings.length === 0 ? (
        <p>No bookings found.</p>
      ) : (
        bookings.map((booking) => {
          const room = booking.booking_details?.[0];
          if (!room) return null;

          const status =
            booking.status &&
            ['booked', 'checked_in', 'checked_out', 'cancelled'].includes(booking.status)
              ? (booking.status as 'booked' | 'checked_in' | 'checked_out' | 'cancelled')
              : undefined;
          const deal = room.deal_name
            ? {
                deal_name: room.deal_name,
                discount_rate: room.deal_discount_rate ?? 0,
                // start_date, end_date API không cung cấp, bỏ đi hoặc thêm nếu có
              }
            : undefined;

          return (
            <Card
              key={booking.booking_id}
              variant="history"
              imageUrl={`${API_URL}${room.room_image || '/placeholder.jpg'}`}
              name={room.room_name}
              roomLevel={room.room_level}
              finalPrice={booking.total_discounted_price}
              checkInDate={new Date(booking.check_in_date).toLocaleDateString()}
              checkOutDate={new Date(booking.check_out_date).toLocaleDateString()}
              bookingstatus={status}
              roomId={room.room_id}
              roomDescription={room.room_description}
              roomName={room.room_name}
              bookingDetailId={room.booking_detail_id}
              deal={deal}
              onFeedbackClick={handleFeedbackBlocked}
            />
          );
        })
      )}
      {totalPages > 0 && !loading && bookings.length > 0 && (
          <AdminPagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
      )}
    </Card>
  );
}
