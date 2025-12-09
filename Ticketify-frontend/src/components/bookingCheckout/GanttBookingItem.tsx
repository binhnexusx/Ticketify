import React from 'react';
import { GanttBookingItemProps } from '@/types/gantt';
import { getStatusColor, getBookingPosition } from '@/utils/ganttUtils';

const GanttBookingItem: React.FC<GanttBookingItemProps> = ({
  booking,
  currentStartDate,
  index,
  onClick,
}) => {
  const position = getBookingPosition(booking, currentStartDate);

  if (!position) return null;

  const handleMouseEnter = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    onClick(booking, {
      x: rect.left + position.left + position.width / 2,
      y: rect.top,
    });
  };

  const handleMouseLeave = () => {
    onClick(null);
  };

  return (
    <div
      className="relative h-12 group"
      style={{ marginTop: index > 0 ? '8px' : '0' }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      <div
        className={`absolute top-0 h-12 rounded-lg shadow-sm cursor-pointer transition-all duration-200 hover:shadow-md hover:scale-105 ${getStatusColor(booking.status)}`}
        style={{
          left: `${position.left}px`,
          width: `${position.width}px`,
        }}
      >
        <div className="flex items-center justify-between h-full px-3">
          <span className="text-sm font-medium truncate">{booking.name}</span>
          <span className="text-xs opacity-75">{booking.room}</span>
        </div>
      </div>
    </div>
  );
};

export default GanttBookingItem;
