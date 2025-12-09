import api from './api';
import {
  ApiResponse,
  BookingData,
  BookingDetail,
  BookingResponse,
  CreateBookingPayload,
} from '@/types/booking';
import { RoomData } from '@/types/room';

export const getRoomById = async (id: string): Promise<RoomData> => {
  const res = await api.get<ApiResponse<RoomData>, ApiResponse<RoomData>>(
    `/api/rooms/${id}/details`
  );
  console.log('Room =', res.data);
  return res.data;
};

export const createBooking = async (payload: CreateBookingPayload): Promise<BookingData> => {
  const res = await api.post<BookingData>('/api/bookings', payload);
  console.log('createBooking =', res.data);
  return res.data;
};

export const getIdBookings = async (booking_id: number): Promise<BookingDetail> => {
  const res = await api.get(`/api/bookings/${booking_id}`);
  console.log('he', res.data);
  return res.data;
};
export const getUserBookings = async (
  user_id: number,
  page: number = 1,
  limit: number = 10,
  status?: string
): Promise<BookingResponse> => {
  const params: any = { page, limit };
  if (status && status !== 'all') {
    params.status = status;
  }

  const res = await api.get(`/api/bookings/user/${user_id}`, { params });
  console.log('api', res.data);
  return res.data;
};

export const fetchDisabledDates = async (roomId: number) => {
  const response = await api.get(`/api/rooms/${roomId}/disabled-dates`);
  console.log('dta date:', response.data);
  return response.data as { from: string; to: string }[];
};
