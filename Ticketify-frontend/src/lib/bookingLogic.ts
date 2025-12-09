import dayjs from 'dayjs';
import { toTzDate, isDateTimeDisabled, DisabledRange } from '@/utils/dateUtils';

export function calculateNights(checkInDate?: string | '', checkOutDate?: string | ''): number {
  if (!checkInDate || !checkOutDate) return 0;
  return dayjs(checkOutDate).startOf('day').diff(dayjs(checkInDate).startOf('day'), 'day');
}

export function canUpdateCheckIn(
  newCheckIn: Date,
  currentCheckOut?: string,
  disabledDates: DisabledRange[] = []
): { valid: boolean; error?: string } {
  const checkInDateTime = toTzDate(newCheckIn, 14);

  if (currentCheckOut) {
    const currCheckOut = toTzDate(new Date(currentCheckOut), 12);

    if (currCheckOut < checkInDateTime) {
      return { valid: true };
    }

    if (isDateTimeDisabled(checkInDateTime, currCheckOut, disabledDates)) {
      return { valid: false, error: 'Room is partially booked during the selected dates.' };
    }
  } else {
    if (isDateTimeDisabled(checkInDateTime, checkInDateTime, disabledDates)) {
      return { valid: false, error: 'Selected check-in date is already booked, please choose another date.' };
    }
  }

  return { valid: true };
}

export function canUpdateCheckOut(
  newCheckOut: Date,
  currentCheckIn?: string,
  disabledDates: DisabledRange[] = []
): { valid: boolean; error?: string } {
  const checkOutDateTime = toTzDate(newCheckOut, 12);

  if (currentCheckIn) {
    const currCheckIn = toTzDate(new Date(currentCheckIn), 14);

    if (checkOutDateTime < currCheckIn) {
      return { valid: false, error: 'Check-out date must be after check-in date.' };
    }

    if (isDateTimeDisabled(currCheckIn, checkOutDateTime, disabledDates)) {
      return { valid: false, error: 'Room is partially booked during the selected dates.' };
    }
  } else {
    if (isDateTimeDisabled(checkOutDateTime, checkOutDateTime, disabledDates)) {
      return { valid: false, error: 'Selected check-out date is already booked, please choose another date.' };
    }
  }

  return { valid: true };
}
