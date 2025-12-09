export interface Booking {
  id: string;
  name: string;
  startDate: Date;
  endDate: Date;
  status: 'due-in' | 'checked-out' | 'due-out' | 'checked-in' | 'cancelled';
  room: string;
}

export interface BookingPosition {
  left: number;
  width: number;
}

export interface UseBookingDataReturn {
  bookings: Booking[];
  loading: boolean;
  error: string | null;
}

export interface UseTimelineNavigationReturn {
  currentStartDate: Date;
  days: Date[];
  navigateDate: (direction: 'prev' | 'next') => void;
  today: Date;
}

export interface TimelineHeaderProps {
  currentStartDate: Date;
  days: Date[];
  today: Date;
  onNavigateDate: (direction: 'prev' | 'next') => void;
}

export interface GanttBookingItemProps {
  booking: Booking;
  currentStartDate: Date;
  index: number;
  onClick: (booking: Booking | null, position?: { x: number; y: number }) => void;
}

export interface BookingTooltipProps {
  booking: Booking;
  visible: boolean;
  position: { x: number; y: number };
}

export type BookingStatus = Booking['status'];
export type NavigationDirection = 'prev' | 'next';
