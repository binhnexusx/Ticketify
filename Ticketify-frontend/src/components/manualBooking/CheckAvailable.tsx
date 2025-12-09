import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { format, isBefore, addDays } from 'date-fns';
import { useEffect, useMemo, useState } from 'react';
import { cn } from '@/lib/utils';
import { Calendar } from '@/components/ui/date';
import { Button } from '@/components/ui/btn';
import { Label } from '@/components/ui/label';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Card, CardContent } from '@/components/ui/card';
import { CalendarIcon } from 'lucide-react';
import BookingFormModal from './BookingForm';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { RoomAvailable } from '@/types/room';
import AdminPagination from '@/components/ui/admin-pagination';
import { API_URL } from '@/lib/axios';

const schema = z
  .object({
    roomType: z.enum(['all', 'single', 'double', 'triple']),
    checkIn: z.date(),
    checkOut: z.date(),
  })
  .refine((data) => isBefore(data.checkIn, data.checkOut), {
    message: 'Check-out must be after check-in',
    path: ['checkOut'],
  });

type FormValues = z.infer<typeof schema>;

const roomTypeMap = {
  all: null,
  single: 'single',
  double: 'double',
  triple: 'triple',
};

export default function CheckAvailable() {
  const {
    setValue,
    watch,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      roomType: 'all',
      checkIn: new Date(),
      checkOut: addDays(new Date(), 1),
    },
  });

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const [allRooms, setAllRooms] = useState<RoomAvailable[]>([]);
  const [filteredRooms, setFilteredRooms] = useState<RoomAvailable[]>([]);
  const [isBookingOpen, setIsBookingOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<RoomAvailable | null>(null);

  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const roomType = watch('roomType');
  const checkIn = watch('checkIn');
  const checkOut = watch('checkOut');

  const roomTypeOptions = useMemo(
    () => [
      { label: 'All room', value: 'all' },
      { label: 'Single', value: 'single' },
      { label: 'Double', value: 'double' },
      { label: 'Triple', value: 'triple' },
    ],
    []
  );

  useEffect(() => {
    const p = searchParams.get('room_type') as FormValues['roomType'] | null;
    if (p && p !== roomType) {
      setValue('roomType', p);
    }
  }, []);

  const buildAndCallAPI = async (type: FormValues['roomType'], ci: Date, co: Date) => {
    const params = new URLSearchParams({
      check_in_date: format(ci, 'yyyy-MM-dd'),
      check_out_date: format(co, 'yyyy-MM-dd'),
      status: 'available',
      page: '1',
      perPage: '1000',
    });
    if (roomTypeMap[type]) {
      params.append('room_type', roomTypeMap[type]!);
    }
    const url = `${API_URL}/api/front-desk/check-available/filter?${params.toString()}`;

    const res = await fetch(url);
    const json = await res.json();

    let fetched = json.data?.rooms || [];
    fetched = fetched.map((r: any) => ({ ...r, id: r.room_id }));
    setAllRooms(fetched);
    setFilteredRooms(fetched);
    setCurrentPage(1);
  };

  const onSubmit = async (data: FormValues) => {
    const params = new URLSearchParams({
      check_in: format(data.checkIn, 'yyyy-MM-dd'),
      check_out: format(data.checkOut, 'yyyy-MM-dd'),
    });
    if (roomTypeMap[data.roomType]) params.append('room_type', data.roomType);
    navigate({ search: params.toString() });

    localStorage.setItem(
      `filter_booking`,
      JSON.stringify({
        check_in: params.get('check_in'),
        check_out: params.get('check_out'),
        room_type: params.get('room_type'),
      })
    );

    await buildAndCallAPI(data.roomType, data.checkIn, data.checkOut);
  };

  const handleRoomTypeFilter = (t: FormValues['roomType']) => {
    setValue('roomType', t);
    setCurrentPage(1);
    if (t === 'all') {
      setFilteredRooms(allRooms);
    } else {
      setFilteredRooms(allRooms.filter((r) => r.roomType.toLowerCase() === t));
    }
  };

  const handleBookNow = (r: RoomAvailable) => {
    setSelectedRoom(r);
    setIsBookingOpen(true);
  };

  const onBookingSubmit = () => {
    setIsBookingOpen(false);
    setSelectedRoom(null);
  };

  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentRooms = filteredRooms.slice(indexOfFirstItem, indexOfLastItem);

  return (
    <div className="px-4 mx-auto mt-8 max-w-7xl">
      <Card>
        <form onSubmit={handleSubmit(onSubmit)}>
          <CardContent className="py-6 space-y-6">
            <div className="flex flex-wrap gap-3">
              {roomTypeOptions.map((opt) => {
                const amount =
                  opt.value === 'all'
                    ? allRooms.length
                    : allRooms.filter((r) => r.roomType.toLowerCase() === opt.value).length;

                return (
                  <Button
                    key={opt.value}
                    type="button"
                    variant="outline"
                    className={cn(
                      'rounded-full px-4 text-sm',
                      roomType === opt.value
                        ? 'bg-adminLayout-primary-100 text-adminLayout-primary-600 border-adminLayout-primary-500'
                        : 'text-gray-600'
                    )}
                    onClick={() => handleRoomTypeFilter(opt.value as any)}
                  >
                    {`${opt.label} (${amount})`}
                  </Button>
                );
              })}
            </div>

            <div className="grid items-end grid-cols-1 gap-4 md:grid-cols-4">
              <div>
                <Label>Check in</Label>
                <Popover>
                  <PopoverTrigger asChild className="border shadow-none">
                    <Button variant="outline" className="justify-start w-full">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {checkIn ? format(checkIn, 'dd/MM/yyyy') : 'Pick'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={checkIn}
                      onSelect={(d) => d && setValue('checkIn', d)}
                      disabled={(d) =>
                        d < new Date(new Date().setHours(0, 0, 0)) ||
                        (checkOut && !isBefore(d, checkOut))
                      }
                    />
                  </PopoverContent>
                </Popover>
                {errors.checkIn && <p className="text-xs text-red-500">{errors.checkIn.message}</p>}
              </div>

              <div>
                <Label>Check out</Label>
                <Popover>
                  <PopoverTrigger asChild className="border shadow-none">
                    <Button variant="outline" className="justify-start w-full">
                      <CalendarIcon className="w-4 h-4 mr-2" />
                      {checkOut ? format(checkOut, 'dd/MM/yyyy') : 'Pick'}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent>
                    <Calendar
                      mode="single"
                      selected={checkOut}
                      onSelect={(d) => d && setValue('checkOut', d)}
                      disabled={(d) => d < (checkIn || new Date())}
                    />
                  </PopoverContent>
                </Popover>
                {errors.checkOut && (
                  <p className="text-xs text-red-500">{errors.checkOut.message}</p>
                )}
              </div>

              <div className="flex justify-end md:col-span-2">
                <Button type="submit">Check availability</Button>
              </div>
            </div>
          </CardContent>
        </form>
      </Card>

      <div className="mt-10 overflow-x-auto border rounded-lg">
        <table className="min-w-full text-sm">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 font-semibold">Room Number</th>
              <th className="px-4 py-2 font-semibold">Room Type</th>
              <th className="px-4 py-2 font-semibold">Room Level</th>
              <th className="px-4 py-2 font-semibold">Floor</th>
              <th className="px-4 py-2 font-semibold">Amenities</th>
              <th className="px-4 py-2 font-semibold">Price</th>
              <th className="px-4 py-2 font-semibold">Status</th>
              <th className="px-4 py-2 font-semibold">Action</th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y">
            {currentRooms.length === 0 ? (
              <tr>
                <td colSpan={8} className="px-4 py-6 text-center text-gray-500">
                  No available rooms found.
                </td>
              </tr>
            ) : (
              currentRooms.map((r) => (
                <tr key={r.id}>
                  <td className="px-4 py-2">{r.name}</td>
                  <td className="px-4 py-2">{r.roomType}</td>
                  <td className="px-4 py-2">{r.roomLevel}</td>
                  <td className="px-4 py-2">{r.floor}</td>
                  <td className="px-4 py-2">
                    {Array.isArray(r.amenities) ? r.amenities.map((a) => a.name).join(', ') : '—'}
                  </td>
                  <td className="px-4 py-2">${r.price}</td>
                  <td className="px-4 py-2">
                    <Button
                      size="sm"
                      className="rounded-full shadow-none bg-adminLayout-primary-50 text-adminLayout-primary-400 hover:bg-adminLayout-primary-100"
                    >
                      {r.status || 'available'}
                    </Button>
                  </td>
                  <td className="px-4 py-2">
                    <Button
                      size="sm"
                      className="font-bold rounded-full shadow-none bg-adminLayout-primary-50 text-adminLayout-primary-400 hover:bg-adminLayout-primary-100"
                      onClick={() => handleBookNow(r)}
                    >
                      Book Now
                    </Button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>

        {filteredRooms.length > 0 && (
          <AdminPagination
            currentPage={currentPage}
            totalPages={Math.ceil(filteredRooms.length / itemsPerPage)}
            onPageChange={(page) => setCurrentPage(page)}
          />
        )}
      </div>

      <BookingFormModal
        open={isBookingOpen}
        onClose={() => setIsBookingOpen(false)}
        selectedRoom={selectedRoom}
        onSubmit={onBookingSubmit}
        defaultRoomNumber={selectedRoom?.name || ''}
      />
    </div>
  );
}
