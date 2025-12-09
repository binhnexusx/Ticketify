import React, { useEffect, useState } from 'react';
import { GuestList } from '@/types/admin';
import { getGuestList, updateUserStatus } from '@/services/admin';
import AdminPagination from '@/components/ui/admin-pagination';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useToast } from '@/hooks/use-toast';

export default function User() {
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [guests, setGuests] = useState<GuestList[]>([]);
  const [updatingId, setUpdatingId] = useState<number | null>(null);
  const { toast } = useToast();

  const perPage = 10;

  const fetchGuest = async () => {
    try {
      setLoading(true);
      const res = await getGuestList(currentPage, perPage);
      setGuests(res.data);
      setTotalPages(res.pagination.totalPages);
    } catch (error) {
      console.error('Failed to fetch guest list:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to load guest list. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGuest();
  }, [currentPage]);

  const handleToggleStatus = async (guestId: number, selectedStatus: string) => {
    const newStatus = selectedStatus.toLowerCase();
    try {
      setUpdatingId(guestId);
      await updateUserStatus(guestId, newStatus);

      const updatedGuests = guests.map((guest) =>
        guest.guest_number === guestId ? { ...guest, status: selectedStatus } : guest
      );
      setGuests(updatedGuests);

      toast({
        title: 'Success',
        description: `Guest status updated to "${selectedStatus}".`,
      });
    } catch (error) {
      console.error('Failed to update user status:', error);
      toast({
        variant: 'destructive',
        title: 'Error',
        description: 'Failed to update status. Please try again.',
      });
    } finally {
      setUpdatingId(null);
    }
  };

  return (
    <div className="p-4 bg-white">
      <div className="overflow-hidden border rounded-xl border-adminLayout-grey-250">
        <table className="min-w-full text-sm text-left bg-white table-fixed">
          <thead className="border bg-adminLayout-grey-10 text-adminLayout-grey-20">
            <tr>
              <th className="p-3 font-medium">Guest ID</th>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Email</th>
              <th className="p-3 font-medium">Phone</th>
              <th className="p-3 font-medium">Number Of Booking</th>
              <th className="p-3 font-medium">Status</th>
            </tr>
          </thead>
          <tbody className="text-adminLayout-grey-30">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-400">
                  Loading...
                </td>
              </tr>
            ) : guests.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-400">
                  No guests found.
                </td>
              </tr>
            ) : (
              guests.map((guest) => (
                <tr key={guest.guest_number} className="border-t">
                  <td className="p-3">{guest.guest_number}</td>
                  <td className="p-3">{guest.name}</td>
                  <td className="p-3">{guest.email}</td>
                  <td className="p-3">{guest.phone}</td>
                  <td className="p-3">{guest.booking_count}</td>
                  <td className="p-3">
                    <Select
                      value={guest.status}
                      onValueChange={(value) => handleToggleStatus(guest.guest_number, value)}
                      disabled={updatingId === guest.guest_number}
                    >
                      <SelectTrigger
                        className={`w-[120px] text-xs rounded-full font-medium items_center justify-center gap-3 pt-3
                         ${guest.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}
                      >
                        <SelectValue placeholder="Select status" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Blocked">Blocked</SelectItem>
                      </SelectContent>
                    </Select>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
