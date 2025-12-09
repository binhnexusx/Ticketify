import React, { useState, useEffect } from 'react';
import dayjs from 'dayjs';
import AdminPagination from '@/components/ui/admin-pagination';
import { getRate, getRateByRoomId } from '@/services/admin';
import { Rate } from '@/types/admin';
import { Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

const months = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
].map((label, index) => ({ label, value: (index + 1).toString() }));

const currentYear = dayjs().year();
const years = Array.from({ length: 6 }, (_, i) => (currentYear + i).toString());

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

export default function RateAdmin() {
  const [currentPage, setCurrentPage] = useState(1);
  const [rate, setRate] = useState<Rate[]>([]);
  const [loading, setLoading] = useState(false);
  const [month, setMonth] = useState((dayjs().month() + 1).toString());
  const [year, setYear] = useState(dayjs().year().toString());

  const [totalPages, setTotalPages] = useState(1);
  const [bestSeller, setBestSeller] = useState('');
  const [totalRoom, setTotalRoom] = useState(0);
  const [totalRevenue, setTotalRevenue] = useState(0);
  const perPage = 10;

  const [openDialog, setOpenDialog] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Rate[] | null>(null);

  useEffect(() => {
    const fetchRate = async () => {
      try {
        setLoading(true);
        const res = await getRate(currentPage, perPage, month, Number(year));
        setRate(res.rate);
        setBestSeller(res.best_seller_room || 'No room');
        setTotalPages(res.pagination?.totalPages || 1);
        setTotalRoom(res.total_room || 0);
        setTotalRevenue(res.total_renevue || 0);
      } catch (err) {
        console.error('Failed to fetch rate:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRate();
  }, [currentPage, perPage, month, year]);

  const handleViewDetail = async (roomId: number) => {
    try {
      const res = await getRateByRoomId(roomId, month, Number(year));
      console.log('Rate detail:', res);
      setSelectedRoom(res);
      setOpenDialog(true);
    } catch (err) {
      console.error('Error fetching rate detail:', err);
    }
  };

  return (
    <div className="p-4 space-y-6 bg-white">
      {/* Filter controls */}
      <div className="flex items-center gap-4">
        <Select value={month} onValueChange={setMonth}>
          <SelectTrigger className="justify-center gap-3 pt-3 border-2 w-28 border-adminLayout-grey-300 items_center">
            <SelectValue placeholder="Select month" />
          </SelectTrigger>
          <SelectContent>
            {months.map(({ label, value }) => (
              <SelectItem key={value} value={value}>
                {label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={year} onValueChange={setYear}>
          <SelectTrigger className="justify-center gap-3 pt-3 border-2 w-28 border-adminLayout-grey-300 items_center">
            <SelectValue placeholder="Select year" />
          </SelectTrigger>
          <SelectContent>
            {years.map((y) => (
              <SelectItem key={y} value={y}>
                {y}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Statistic summary */}
      <div className="font-medium rounded-lg bg-adminLayout-grey-250 text-adminLayout-grey-600">
        <div className="flex justify-between p-6 text-center">
          <div>
            <div className="mb-1 text-sm text-gray-500">Best-seller room</div>
            <div className="text-2xl font-semibold text-adminLayout-primary-600">{bestSeller}</div>
          </div>
          <div>
            <div className="mb-1 text-sm text-gray-500">Total Rooms</div>
            <div className="text-2xl font-semibold text-adminLayout-primary-600">{totalRoom}</div>
          </div>
          <div>
            <div className="mb-1 text-sm text-gray-500">Total Revenue</div>
            <div className="text-2xl font-semibold text-adminLayout-primary-600">
              {formatUSD(totalRevenue)}
            </div>
          </div>
        </div>
      </div>

      {/* Data table */}
      <div className="overflow-hidden border rounded-xl border-adminLayout-grey-250">
        <table className="min-w-full text-sm text-left bg-white table-fixed">
          <thead className="border bg-adminLayout-grey-10 text-adminLayout-grey-20">
            <tr>
              <th className="p-3">Room Number</th>
              <th className="p-3">Room Type</th>
              <th className="p-3">Room Level</th>
              <th className="p-3">Original Price</th>
              <th className="p-3">Number of Booking</th>
              <th className="p-3">Total Revenue</th>
              <th className="p-3">Action</th>
            </tr>
          </thead>
          <tbody className="text-adminLayout-grey-30">
            {loading ? (
              <tr>
                <td colSpan={6} className="p-4 text-center text-gray-400">
                  <span className="animate-pulse">Loading data...</span>
                </td>
              </tr>
            ) : (
              rate.map((item) => (
                <tr key={item.room_id} className="border-t">
                  <td className="p-3">{item.room_number}</td>
                  <td className="p-3">{item.room_type}</td>
                  <td className="p-3">{item.room_level}</td>
                  <td className="p-3">{formatUSD(item.original_price)}</td>
                  <td className="p-3">{item.number_of_booking}</td>
                  <td className="p-3">{formatUSD(item.total_revenue)}</td>
                  <td className="p-3">
                    <Button
                      variant="ghost"
                      size="icon"
                      title="View detail of room"
                      onClick={() => handleViewDetail(item.room_id)}
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

      {/* Pagination */}
      <AdminPagination
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <Dialog open={openDialog} onOpenChange={setOpenDialog}>
        <DialogContent className="max-w-4xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-semibold">Room Detail</DialogTitle>
            <DialogDescription className="text-gray-500">Detailed booking list</DialogDescription>
          </DialogHeader>
          {selectedRoom && selectedRoom.length > 0 ? (
            <div className="overflow-x-auto border border-gray-200 shadow-sm rounded-xl">
              <table className="min-w-full text-sm">
                <thead>
                  <tr className="text-left text-gray-700 bg-gray-100">
                    <th className="px-4 py-3 font-medium">Booking ID</th>
                    <th className="px-4 py-3 font-medium">Deal</th>
                    <th className="px-4 py-3 font-medium">Date of stay</th>
                    <th className="px-4 py-3 font-medium">Number of days of stay</th>
                    <th className="px-4 py-3 font-medium text-right">Price</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200">
                  {selectedRoom.map((b, index) => (
                    <tr key={b.booking_id} className="transition-colors hover:bg-gray-50">
                      <td className="px-4 py-3">{index + 1}</td>
                      <td className="px-4 py-3">{b.deal_name || 'No deal'}</td>
                      <td className="px-4 py-3">{b.date_of_stay}</td>
                      <td className="px-4 py-3">{b.number_of_days}</td>
                      <td className="px-4 py-3 font-medium text-right text-green-600">
                        {formatUSD(b.price)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="py-4 text-center text-gray-500">No data</p>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
