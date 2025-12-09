import { Booking, BookingPosition } from '../types/gantt';

export const getStatusColor = (status: string): string => {
  switch (status) {
    case 'due-in':
      return 'bg-adminLayout-frontdesk-bgLightPeach text-adminLayout-frontdesk-primaryOrange';
    case 'checked-out':
      return 'bg-adminLayout-frontdesk-bgLightBlue text-adminLayout-frontdesk-primaryBlue';
    case 'due-out':
      return 'bg-adminLayout-frontdesk-bgErrorLight text-adminLayout-frontdesk-errorRed';
    case 'checked-in':
      return 'bg-adminLayout-frontdesk-bgSuccessLight text-adminLayout-frontdesk-successGreen';
    case 'cancelled':
      return 'bg-gray-200 text-gray-800 border-gray-300';
    default:
      return 'bg-adminLayout-grey-200 text-adminLayout-grey-800';
  }
};

export const getBookingPosition = (
  booking: Booking,
  currentStartDate: Date
): BookingPosition | null => {
  if (!booking.startDate || !booking.endDate || booking.endDate < booking.startDate) {
    return null;
  }

  const dayWidth = 90;

  const startOfCurrentDate = new Date(currentStartDate);
  startOfCurrentDate.setHours(0, 0, 0, 0);

  const startDay = Math.max(
    0,
    Math.floor((booking.startDate.getTime() - startOfCurrentDate.getTime()) / (1000 * 60 * 60 * 24))
  );
  const endDay = Math.min(
    11,
    Math.ceil((booking.endDate.getTime() - startOfCurrentDate.getTime()) / (1000 * 60 * 60 * 24))
  );

  if (startDay > 11 || endDay < 0) return null;

  const left = startDay * dayWidth;
  const width = (endDay - startDay) * dayWidth;

  return { left, width };
};

export const months = [
  'Jan',
  'Feb',
  'Mar',
  'Apr',
  'May',
  'Jun',
  'Jul',
  'Aug',
  'Sep',
  'Oct',
  'Nov',
  'Dec',
];

export const statusButtons = ['Due In', 'Checked In', 'Due Out', 'Checked Out', 'Cancelled'];

export const getStatusButtonClassName = (index: number): string => {
  switch (index) {
    case 0:
      return 'bg-adminLayout-frontdesk-bgLightPeach text-adminLayout-frontdesk-primaryOrange';
    case 1:
      return 'bg-adminLayout-frontdesk-bgSuccessLight text-adminLayout-frontdesk-successGreen';
    case 2:
      return 'bg-adminLayout-frontdesk-bgErrorLight text-adminLayout-frontdesk-errorRed';
    case 3:
      return 'bg-adminLayout-frontdesk-bgLightBlue text-adminLayout-frontdesk-primaryBlue';
    case 4:
      return 'bg-gray-200 text-gray-800 border-gray-300';
    default:
      return 'bg-gray-100 text-gray-700 border border-gray-200';
  }
};
