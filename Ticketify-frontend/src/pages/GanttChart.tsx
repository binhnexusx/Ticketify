import React, { useState, useRef } from 'react';
import { Booking } from '@/types/gantt';
import { useGanttBookings } from '@/hooks/useGanttBookings';
import { useTimelineNavigation } from '@/hooks/useTimelineNavigation';
import TimelineHeader from '@/components/bookingCheckout/TimelineHeader';
import GanttBookingItem from '@/components/bookingCheckout/GanttBookingItem';
import BookingTooltip from '@/components/bookingCheckout/BookingTooltip';

const GanttChart: React.FC = () => {
  const { bookings, loading, error } = useGanttBookings();
  const { currentStartDate, days, navigateDate, today } = useTimelineNavigation();
  const [hoveredBooking, setHoveredBooking] = useState<Booking | null>(null);
  const [tooltipPosition, setTooltipPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const scrollRef = useRef<HTMLDivElement>(null);

  const handleBookingHover = (booking: Booking | null, position?: { x: number; y: number }) => {
    setHoveredBooking(booking);
    if (position) {
      setTooltipPosition(position);
    }
  };

  const todayOffset = Math.floor(
    (today.getTime() - currentStartDate.getTime()) / (1000 * 60 * 60 * 24)
  );
  const todayLeft = todayOffset >= 0 && todayOffset <= 11 ? todayOffset * 90 : -9999;

  if (loading) {
    return <div className="p-6 text-gray-600">Loading...</div>;
  }

  if (error) {
    return <div className="p-6 text-adminLayout-red-500">{error}</div>;
  }

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <TimelineHeader
        currentStartDate={currentStartDate}
        days={days}
        today={today}
        onNavigateDate={navigateDate}
      />
      <div className="bg-white border border-gray-200 rounded-lg shadow-sm">
        <div className="relative min-h-96">
          <div className="absolute inset-0 grid grid-cols-12">
            {Array.from({ length: 12 }).map((_, index) => (
              <div key={index} className="border-r border-gray-100 last:border-r-0" />
            ))}
          </div>
          <div className="relative p-4 space-y-3">
            {bookings.length === 0 ? (
              <div className="py-10 text-center text-gray-500">No bookings available</div>
            ) : (
              bookings.map((booking, index) => (
                <GanttBookingItem
                  key={booking.id}
                  booking={booking}
                  currentStartDate={currentStartDate}
                  index={index}
                  onClick={handleBookingHover}
                />
              ))
            )}
          </div>
          <div
            className="absolute inset-y-0 bg-blue-500 w-0.5 opacity-50"
            style={{
              left: `${todayLeft}px`,
            }}
          >
            <div className="absolute top-0 w-3 h-3 bg-blue-500 rounded-full -left-1"></div>
          </div>
        </div>
      </div>
      <BookingTooltip
        booking={hoveredBooking}
        visible={!!hoveredBooking}
        position={tooltipPosition}  
      />
    </div>
  );
};

export default GanttChart;
