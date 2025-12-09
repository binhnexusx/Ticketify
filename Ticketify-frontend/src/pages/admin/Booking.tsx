import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Eye } from 'lucide-react';
import Pagination from '@/components/ui/pagination';
import AdminPagination from '@/components/ui/admin-pagination';

import { fetchUserList, fetchCheckInStatus, fetchCheckOutStatus } from '@/services/guest';

type Guest = {
  reservationId: string;
  name: string;
  email?: string;
  phone?: string;
  roomNumber: string;
  totalAmount: number | string;
  status: string;
  checkInDate?: string;
  checkOutDate?: string;
  bookedDate?: string;
};

const statusClasses: Record<string, string> = {
  checked_in: 'bg-[#E8F1FD] text-blue-500',
  checked_out: 'bg-[#FEECEB] text-red-400',
  booked: 'bg-[#E7F8F0] text-green-500',
  cancelled: 'bg-[#FEF4E6] text-yellow-500',
};

const itemsPerPage = 10;

const formatUSD = (value: number | string) => {
  const num = Number(value);
  if (isNaN(num)) return '$0';

  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  })
    .format(num)
    .replace(/\.00$/, '');
};

export default function BookingPage() {
  const [currentPage, setCurrentPage] = useState(1);
  const [tab, setTab] = useState<'Check in' | 'Check out' | ''>('');
  const [guests, setGuests] = useState<Guest[]>([]);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<Guest | null>(null);

  useEffect(() => {
    setLoading(true);

    const fetchData = async () => {
      setLoading(true);
      try {
        let res;
        if (tab === 'Check in') {
          res = await fetchCheckInStatus();
          const checkinUsers = res.data?.users || [];
          const guestsMapped = checkinUsers.flatMap((user: any) =>
            user.bookings.flatMap((booking: any) =>
              booking.booking_details.map((detail: any) => ({
                reservationId: booking.booking_id?.toString() || '',
                name: user.name,
                email: user.email,
                phone: user.phone || '',
                roomNumber: detail.room?.name || '',
                totalAmount: booking.total_price || 0,
                status: booking.status || 'checked_in',
                checkInDate: detail.check_in_date || '',
                checkOutDate: detail.check_out_date || '',
                bookedDate: booking.created_at || '',
              }))
            )
          );

          // Sắp xếp theo reservationId giảm dần
          guestsMapped.sort((a, b) => Number(a.reservationId) - Number(b.reservationId));

          setGuests(guestsMapped);
          setTotalPages(res.data?.pagination?.totalPages || 1);
        } else if (tab === 'Check out') {
          res = await fetchCheckOutStatus();
          const checkoutUsers = res.data?.users || [];
          const guestsMapped = checkoutUsers.flatMap((user: any) =>
            user.bookings.flatMap((booking: any) =>
              booking.booking_details.map((detail: any) => ({
                reservationId: booking.booking_id?.toString() || '',
                name: user.name || user.email,
                email: user.email,
                phone: user.phone || '',
                roomNumber: detail.room?.name || '',
                totalAmount: booking.total_price || 0,
                status: booking.status || 'checked_out',
                checkInDate: detail.check_in_date || '',
                checkOutDate: detail.check_out_date || '',
                bookedDate: booking.created_at || '',
              }))
            )
          );

          // Sắp xếp theo reservationId giảm dần
          guestsMapped.sort((a, b) => Number(a.reservationId) - Number(b.reservationId));

          setGuests(guestsMapped);
          setTotalPages(res.data?.pagination?.totalPages || 1);
        } else {
          res = await fetchUserList({ page: currentPage, perpage: itemsPerPage });
          const users = res.data?.users || [];
          const guestsMapped: Guest[] = [];

          users.forEach((user: any) => {
            (user.bookings || []).forEach((booking: any) => {
              (booking.booking_details || []).forEach((detail: any) => {
                guestsMapped.push({
                  reservationId: booking.booking_id?.toString() || '',
                  name: user.name || user.email,
                  email: user.email,
                  phone: user.phone || '',
                  roomNumber: detail.room?.name || '',
                  totalAmount: booking.total_price,
                  status: booking.status,
                  checkInDate: detail.check_in_date || '',
                  checkOutDate: detail.check_out_date || '',
                  bookedDate: booking.created_at || '',
                });
              });
            });
          });

          // Sắp xếp theo reservationId giảm dần
          guestsMapped.sort((a, b) => Number(a.reservationId) - Number(b.reservationId));

          setGuests(guestsMapped);
          setTotalPages(res.data?.pagination?.totalPages || 1);
        }
      } catch (error) {
        console.error('Lỗi khi fetch dữ liệu:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [tab, currentPage]);

  return (
    <div className="p-4 bg-white">
      <Dialog open={!!selectedBooking} onOpenChange={() => setSelectedBooking(null)}>
        <DialogContent className="max-w-3xl p-0 bg-[#F7F9FB]">
          {selectedBooking && (
            <div className="p-6 space-y-6">
              <div className="flex flex-col gap-4 p-6 bg-white shadow-sm rounded-xl">
                <div className="text-3xl font-bold text-blue-600">
                  # {selectedBooking.roomNumber}
                </div>
                <div className="grid grid-cols-4 gap-4 mt-4 text-center">
                  <div className="flex flex-col items-center">
                    <span className="mb-1 text-2xl">
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        stroke="#5D6679"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <path d="M16 2v4M8 2v4M3 10h18" />
                      </svg>
                    </span>
                    <div className="text-xs text-gray-400">Check-in</div>
                    <div className="font-medium text-gray-700">
                      {selectedBooking.checkInDate
                        ? new Date(selectedBooking.checkInDate).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })
                        : '-'}
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="mb-1 text-2xl">
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        stroke="#5D6679"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <rect x="3" y="4" width="18" height="18" rx="2" />
                        <path d="M16 2v4M8 2v4M3 10h18" />
                      </svg>
                    </span>
                    <div className="text-xs text-gray-400">Check-out</div>
                    <div className="font-medium text-gray-700">
                      {selectedBooking.checkOutDate
                        ? new Date(selectedBooking.checkOutDate).toLocaleDateString('vi-VN', {
                            day: '2-digit',
                            month: '2-digit',
                            year: 'numeric',
                          })
                        : '-'}
                    </div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="mb-1 text-2xl">
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        stroke="#5D6679"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M3 7V6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v1" />
                        <path d="M3 7v11a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V7" />
                        <path d="M16 11V9a4 4 0 0 0-8 0v2" />
                      </svg>
                    </span>
                    <div className="text-xs text-gray-400">Room</div>
                    <div className="font-medium text-gray-700">#{selectedBooking.roomNumber}</div>
                  </div>
                  <div className="flex flex-col items-center">
                    <span className="mb-1 text-2xl">
                      <svg
                        width="24"
                        height="24"
                        fill="none"
                        stroke="#5D6679"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <circle cx="12" cy="12" r="10" />
                        <path d="M12 8v4l3 3" />
                      </svg>
                    </span>
                    <div className="text-xs text-gray-400">Total</div>
                    <div className="font-medium text-gray-700">
                      {formatUSD(selectedBooking.totalAmount)}
                    </div>
                  </div>
                </div>
              </div>
              <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
                <div className="relative flex-1 p-6 bg-white shadow-sm rounded-xl">
                  <div className="mb-4 text-2xl font-bold text-blue-600">Guest Information</div>

                  <div className="mb-2">
                    <span className="font-semibold text-gray-700">Guest Name:</span>{' '}
                    <span
                      className="inline-block max-w-xs text-gray-600 truncate align-middle"
                      title={selectedBooking.name}
                    >
                      {selectedBooking.name}
                    </span>
                  </div>

                  <div className="mb-2">
                    <span className="font-semibold text-gray-700">Email:</span>{' '}
                    <span
                      className="inline-block max-w-xs text-gray-600 truncate align-middle"
                      title={selectedBooking.email || '-'}
                    >
                      {selectedBooking.email || '-'}
                    </span>
                  </div>

                  <div>
                    <span className="font-semibold text-gray-700">Phone:</span>{' '}
                    <span
                      className="inline-block max-w-xs text-gray-600 truncate align-middle"
                      title={selectedBooking.phone || '-'}
                    >
                      {selectedBooking.phone || '-'}
                    </span>
                  </div>
                </div>
                <div className="relative flex flex-col items-center justify-center flex-1 p-6 bg-white shadow-sm rounded-xl">
                  <div className="mb-4 text-2xl font-bold text-blue-600">Status</div>
                  <div>
                    <span
                      className={`inline-block px-4 py-2 rounded-full text-base font-semibold shadow-sm ${statusClasses[selectedBooking.status] || 'bg-gray-100 text-gray-500'}`}
                    >
                      {selectedBooking.status.replace(/_/g, ' ')}
                      <svg
                        className="inline ml-1 -mt-1"
                        width="16"
                        height="16"
                        fill="none"
                        stroke="#5D6679"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      >
                        <path d="M6 9l2 2 4-4" />
                      </svg>
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
      <div className="flex items-center gap-2 mb-6">
        <Button
          variant="outline"
          className={`rounded-full px-6 py-2 font-semibold transition-colors ${
            tab === 'Check in'
              ? 'bg-white text-adminLayout-primary-600 border-adminLayout-primary-500 shadow-sm'
              : 'bg-white text-adminLayout-grey-500 border-adminLayout-grey-300 hover:text-adminLayout-primary-10 hover:border-adminLayout-primary-500 hover:bg-[#E8F1FD]'
          }`}
          style={{
            boxShadow: tab === 'Check in' ? '0 2px 8px 0 rgba(16, 30, 54, 0.04)' : undefined,
          }}
          onClick={() => {
            setCurrentPage(1);
            setTab((prev) => (prev === 'Check in' ? '' : 'Check in'));
          }}
        >
          Check in
        </Button>

        <Button
          variant="outline"
          className={`rounded-full px-6 py-2 font-semibold transition-colors ${
            tab === 'Check out'
              ? 'bg-white text-adminLayout-primary-600 border-adminLayout-primary-500 shadow-sm'
              : 'bg-white text-adminLayout-grey-500 border-adminLayout-grey-300 hover:text-adminLayout-primary-10 hover:border-adminLayout-primary-500 hover:bg-[#E8F1FD]'
          }`}
          style={{
            boxShadow: tab === 'Check out' ? '0 2px 8px 0 rgba(16, 30, 54, 0.04)' : undefined,
          }}
          onClick={() => {
            setCurrentPage(1);
            setTab((prev) => (prev === 'Check out' ? '' : 'Check out'));
          }}
        >
          Check out
        </Button>
      </div>

      <div className="overflow-hidden border rounded-xl border-adminLayout-grey-250">
        <table className="min-w-full text-sm text-left bg-white table-fixed">
          <thead className="border bg-adminLayout-grey-10 text-adminLayout-grey-20">
            <tr>
              <th className="p-3 font-medium">Reservation ID</th>
              <th className="p-3 font-medium">Name</th>
              <th className="p-3 font-medium">Room Number</th>
              <th className="p-3 font-medium">Total amount</th>
              <th className="p-3 font-medium">Status</th>
              <th className="p-3 font-medium">Action</th>
            </tr>
          </thead>
          <tbody className="text-adminLayout-grey-30">
            {loading ? (
              <tr>
                <td colSpan={6} className="py-8 text-center">
                  Loading...
                </td>
              </tr>
            ) : guests.length === 0 ? (
              <tr>
                <td colSpan={6} className="py-8 text-center">
                  No data
                </td>
              </tr>
            ) : (
              guests.map((guest, idx) => (
                <tr
                  key={guest.reservationId + idx}
                  className={`border-b ${
                    tab === 'Check in' || tab === 'Check out' ? 'hover:bg-adminLayout-grey-50' : ''
                  }`}
                >
                  <td className="p-3 font-medium">{guest.reservationId}</td>
                  <td className="p-3">{guest.name}</td>
                  <td className="p-3">{guest.roomNumber}</td>
                  <td className="p-3">{formatUSD(guest.totalAmount)}</td>
                  <td className="p-3">
                    <span
                      className={`text-xs px-2 py-1 rounded-full ${
                        statusClasses[guest.status] || 'bg-gray-100 text-gray-500'
                      }`}
                    >
                      {guest.status.replace(/_/g, ' ')}
                    </span>
                  </td>
                  <td className="p-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setSelectedBooking(guest)}
                      title="Xem chi tiết booking"
                    >
                      <Eye className="w-5 h-5 text-gray-500" />
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {tab === '' && (
        <div className="flex items-center justify-between mt-6 text-sm">
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.max(currentPage - 1, 1))}
            className="text-adminLayout-grey-400 border-adminLayout-grey-200 min-w-[90px] flex items-center gap-2"
            disabled={currentPage === 1}
          >
            Previous
          </Button>
          <div className="space-x-2">
            {[...Array(totalPages)].map((_, i) => {
              const page = i + 1;
              return (
                <Button
                  key={page}
                  variant={currentPage === page ? 'default' : 'outline'}
                  className={
                    currentPage === page
                      ? 'bg-adminLayout-primary-50 text-adminLayout-primary-600 border-adminLayout-primary-500 font-semibold rounded-md w-9 h-9 p-0 '
                      : 'text-adminLayout-grey-400 border-none rounded-md w-9 h-9 p-0'
                  }
                  onClick={() => setCurrentPage(page)}
                >
                  {page}
                </Button>
              );
            })}
          </div>
          <Button
            variant="outline"
            onClick={() => setCurrentPage(Math.min(currentPage + 1, totalPages))}
            className="text-adminLayout-grey-400 border-adminLayout-grey-200 min-w-[90px] flex items-center gap-1"
            disabled={currentPage === totalPages}
          >
            Next
          </Button>
        </div>
      )}
    </div>
  );
}
