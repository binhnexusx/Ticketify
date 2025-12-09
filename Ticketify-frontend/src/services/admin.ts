import api from './api';
import type {
  DashboardStatus,
  DashboardDeal,
  DashboardFeedback,
  GuestList,
  Pagination,
  Rate,
} from '@/types/admin';

export const getDashboardStatus = async (): Promise<DashboardStatus> => {
  const res = await api.get('/api/admin/dashboard-status');
  return res.data;
};

export const getDashboardDeals = async (): Promise<DashboardDeal[]> => {
  const res = await api.get('/api/admin/dashboard-deals');
  return res.data;
};

export const getDashboardFeedback = async (): Promise<DashboardFeedback[]> => {
  const res = await api.get('/api/admin/dashboard-feedback');
  return res.data;
};

export const getDashboardTop5mostBookedRooms = async (
  month: string,
  year: number
): Promise<
  {
    room_id: number;
    room_name: string;
    total_bookings: string;
  }[]
> => {
  const res = await api.get('/api/admin/dashboard-most-booked', {
    params: { month, year },
  });
  return res.data;
};

export const getDashboardHotelFeedback = async (): Promise<DashboardFeedback[]> => {
  const res = await api.get('/api/admin/dashboard-hotel-feedback');
  return res.data;
};

export const getGuestList = async (
  page: number,
  perPage: number
): Promise<{ data: GuestList[]; pagination: Pagination }> => {
  const res = await api.get('/api/admin/guest-list', {
    params: {
      page,
      limit: perPage,
    },
  });
  return {
    data: res.data.guests,
    pagination: res.data.pagination,
  };
};

export const updateUserStatus = async (user_id: number, status: string) => {
  const res = await api.patch(`/api/admin/users/${user_id}/status`, { status });
  return res.data;
};

export const getRate = async (
  page: number,
  perPage: number,
  month: string,
  year: number
): Promise<{ rate: Rate[]; pagination: Pagination; best_seller_room: string; total_room:number; total_renevue: number}> => {
  const res = await api.get('/api/admin/rate', {
    params: {
      page,
      limit: perPage,
      month,
      year,
    },
  });

  return {
    rate: res.data.rate,
    pagination: res.data.pagination,
    best_seller_room: res.data.best_seller_room?.room_number ?? '',
    total_room: res.data.total_room,
    total_renevue: res.data.total_nenevue
  };
};

export const getRateByRoomId = async (roomId: number, month: string, year: number): Promise<Rate[]> => {
  const res = await api.get(`/api/admin/rate-detail/${roomId}`, {
    params :{
      month,
      year,
    },
  });
  return res.data;
};
