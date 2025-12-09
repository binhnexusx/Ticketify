import React from 'react';
import { BookingTooltipProps } from '@/types/gantt';

const BookingTooltip: React.FC<BookingTooltipProps> = ({ booking, visible, position }) => {
  if (!visible || !booking) return null;

  return (
    <div
      className="fixed z-50 p-3 bg-white border border-gray-300 rounded-lg shadow-lg pointer-events-none"
      style={{
        left: `${position.x}px`,
        top: `${position.y - 10}px`,
        transform: 'translateX(-50%) translateY(-100%)', 
        maxWidth: '280px',
      }}
    >
      <div className="space-y-1 text-sm">
        <div className="font-semibold text-gray-900">{booking.name}</div>
        <div className="text-gray-600">
          <span className="font-medium">Room:</span> {booking.room}
        </div>
        <div className="text-gray-600">
          <span className="font-medium">Check-in:</span> {booking.startDate.toLocaleDateString()}
        </div>
        <div className="text-gray-600">
          <span className="font-medium">Check-out:</span> {booking.endDate.toLocaleDateString()}
        </div>
        <div className="text-gray-600">
          <span className="font-medium">Status:</span>
          <span
            className={`ml-1 px-2 py-0.5 text-xs rounded-full ${
              booking.status === 'due-in'
                ? 'bg-adminLayout-frontdesk-bgLightPeach text-adminLayout-frontdesk-primaryOrange'
                : booking.status === 'checked-in'
                  ? 'bg-green-100 text-green-800'
                  : booking.status === 'due-out'
                    ? 'bg-red-100 text-red-800'
                    : booking.status === 'checked-out'
                      ? 'bg-blue-100 text-blue-800'
                      : 'bg-gray-100 text-gray-800'
            }`}
          >
            {booking.status.replace('-', ' ')}
          </span>
        </div>
      </div>
      {/* Tooltip arrow pointing down */}
      <div
        className="absolute w-0 h-0 border-t-4 border-l-4 border-r-4 border-transparent left-1/2 top-full border-t-white"
        style={{ transform: 'translateX(-50%)' }}
      />
    </div>
  );
};

export default BookingTooltip;
