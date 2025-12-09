import { useEffect, useState } from 'react';
import { useDispatch } from 'react-redux';
import { toTzDate, flattenDateRanges, DisabledRange } from '@/utils/dateUtils';
import { canUpdateCheckIn, canUpdateCheckOut } from '@/lib/bookingLogic';
import {
  getRoomDetailFromLocalStorage,
  persistRoomDetailToLocalStorage,
  clearRoomDetailFromLocalStorage,
} from '@/utils/storage';
import { setRoomDetail } from '@/redux/room/roomSlice';
import { fetchDisabledDates } from '@/services/bookingService';
import { RoomData } from '@/types/room';

type UseBookingDatesProps = {
  room: RoomData | null;
  guest: number;
  checkInDate: string;
  checkOutDate: string;
};

export function useBookingDates({
  room,
  guest,
  checkInDate,
  checkOutDate,
}: UseBookingDatesProps) {
  const dispatch = useDispatch();
  const [disabledDates, setDisabledDates] = useState<DisabledRange[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Update Redux + localStorage
  const update = (newCheckIn?: string, newCheckOut?: string) => {
    dispatch(
      setRoomDetail({
        room,
        guest,
        checkInDate: newCheckIn || '',
        checkOutDate: newCheckOut || '',
      })
    );
    persistRoomDetailToLocalStorage(room, guest, newCheckIn || '', newCheckOut || '');
  };

const handleCheckInChange = (date: Date | null) => {
  if (!date) return;

  const checkIn = toTzDate(date, 14);
  const out = checkOutDate ? toTzDate(new Date(checkOutDate), 12) : null;

  console.log('handleCheckInChange:', { date, checkIn, checkOutDate, out });

  const result = canUpdateCheckIn(date, checkOutDate, disabledDates);
  if (!result.valid) {
    setErrorMessage(result.error!);
    return;
  }

  if (out && out < checkIn) {
    update(checkIn.toISOString(), undefined);
  } else {
    update(checkIn.toISOString(), out ? out.toISOString() : undefined);
  }
  setErrorMessage(null);
};


  const handleCheckOutChange = (date: Date | null) => {
    if (!date) return;

    const result = canUpdateCheckOut(date, checkInDate, disabledDates);
    if (!result.valid) {
      setErrorMessage(result.error!);
      return;
    }

    const checkOut = toTzDate(date, 12);
    if (checkInDate) {
      const checkIn = toTzDate(new Date(checkInDate), 14);
      update(checkIn.toISOString(), checkOut.toISOString());
    } else {
      update(undefined, checkOut.toISOString());
    }
    setErrorMessage(null);
  };

  // Load lại từ localStorage nếu có
  useEffect(() => {
    const saved = getRoomDetailFromLocalStorage();
    if (saved?.room?.room_id) {
      dispatch(setRoomDetail(saved));
    }
  }, [dispatch]);

  // Reset khi chọn phòng khác
  useEffect(() => {
    const saved = getRoomDetailFromLocalStorage();
    if (room?.room_id && saved?.room?.room_id && saved.room.room_id !== room.room_id) {
      clearRoomDetailFromLocalStorage();
      dispatch(
        setRoomDetail({
          room,
          guest: 1,
          checkInDate: '',
          checkOutDate: '',
        })
      );
    }
  }, [room?.room_id]);

  // Fetch ngày bị disable (ngay khi có room_id)
  useEffect(() => {
    if (!room?.room_id) return;
    (async () => {
      try {
        const raw = await fetchDisabledDates(room.room_id);
        const ranges = flattenDateRanges(raw);
        setDisabledDates(ranges);
      } catch (err) {
        console.error('Failed to fetch disabled dates', err);
      }
    })();
  }, [room?.room_id]);

  // Sync lại localStorage nếu thông tin ngày thay đổi
  useEffect(() => {
    const saved = getRoomDetailFromLocalStorage();
    if (
      saved &&
      (
        saved.room?.room_id !== room?.room_id ||
        saved.checkInDate !== checkInDate ||
        saved.checkOutDate !== checkOutDate
      )
    ) {
      clearRoomDetailFromLocalStorage();
      persistRoomDetailToLocalStorage(room, guest, checkInDate, checkOutDate);
    }
  }, [room, guest, checkInDate, checkOutDate]);

  return {
    handleCheckInChange,
    handleCheckOutChange,
    errorMessage,
    disabledDates,
  };
}
