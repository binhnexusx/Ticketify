import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '@/redux/store';
import { Card, CardHeader, CardContent } from '@/components/ui/card';
import DateSelector from '@/components/ui/dateSelector';
import { useBookingDates } from '@/hooks/useBookingDates';
import { toTzDate } from '@/utils/dateUtils';
import { calculateNights } from '@/lib/bookingLogic';
import dayjs from 'dayjs';
import { spawn } from 'child_process';
import { EditIcon, Pencil } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@radix-ui/react-tooltip';
import { Button } from '../ui/button';

const BookingDetailsCard = () => {
  const { room, checkInDate, checkOutDate, guest } = useSelector(
    (state: RootState) => state.roomDetail
  );

  if (!room) return <div>Please select a room first.</div>;

  const startDate = checkInDate ? new Date(checkInDate) : null;
  const endDate = checkOutDate ? new Date(checkOutDate) : null;
  const nights = calculateNights(checkInDate, checkOutDate);

  const { handleCheckInChange, handleCheckOutChange, errorMessage, disabledDates } =
    useBookingDates({
      room,
      guest,
      checkInDate,
      checkOutDate,
    });

  return (
    <Card className="mt-2">
      <CardHeader className="text-base font-semibold p-4 pt-3">
        <div className="flex justify-between items-center">
          <span>Your Booking Details</span>

          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <Button
                variant="outline"
                  type="button"
                  onClick={() => {
                    const el = document.getElementById('booking-date-section');
                    el?.scrollIntoView({ behavior: 'smooth'});
                  }}
                  className=" hover:text-blue-500 transition-colors border-none"
                  aria-label="Edit Booking Dates"
                >
                  <Pencil size={16} className="text-root-primary-500" />
                </Button>
              </TooltipTrigger>
              <TooltipContent>
                <p className='text-sm'>Edit dates</p>
              </TooltipContent>
            </Tooltip>
          </TooltipProvider>
        </div>
      </CardHeader>

      <CardContent className="text-sm space-y-4 pl-4">
        <div id="booking-date-section" className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <DateSelector
            label="Check-In"
            selectedDate={startDate}
            minDate={toTzDate(new Date(), 0)}
            onChange={handleCheckInChange}
            errorMessage={errorMessage}
            disabledDates={disabledDates}
          />
          <DateSelector
            label="Check-Out"
            selectedDate={endDate}
            minDate={startDate ? dayjs(startDate).add(1, 'day').toDate() : toTzDate(new Date(), 0)}
            onChange={handleCheckOutChange}
            errorMessage={errorMessage}
            disabledDates={disabledDates}
          />
        </div>

        <ul className="list-disc list-inside pt-2">
          <li>You will stay {nights > 0 ? nights : '0'} nights</li>
          <li>You selected a {room?.room_level || 'N/A'} room</li>
          <li>Guests: {guest}</li>
        </ul>
      </CardContent>
    </Card>
  );
};

export default BookingDetailsCard;
