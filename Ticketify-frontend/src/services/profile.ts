import api from './api';
import { store } from '@/redux/store';
import { fetchUser } from '@/redux/userSlice';
import { UserData } from '@/types/auth';
import type {
  HotelFeedback,
  Favorite,
  Pagination,
  FavoriteRoomResponse,
  RoomFeedback,
} from '@/types/profile';

export const submitHotelFeedback = async (payload: {
  user_id: number;
  rating: number;
  comment: string;
}): Promise<HotelFeedback> => {
  const res = await api.post('/api/profile/hotel-feedback', payload);
  return res.data;
};

  export const submitRoomFeedback = async (payload: {
    room_id: number;
    room_name: string;
    booking_detail_id: number; 
    room_description: string;
    rating: number;
    comment: string;
  }): Promise<RoomFeedback> => {
    const res = await api.post('/api/profile/room-feedback', payload);
    return res.data;
  };

export const updateUser = async (id: number, data: FormData | Partial<UserData>) => {
  const headers = data instanceof FormData ? { 'Content-Type': 'multipart/form-data' } : undefined;

  const res = await api.put(`/api/users/${id}`, data, { headers });
  store.dispatch(fetchUser());
  return res.data?.data || res.data;
};

export const getUser = async (id: number): Promise<UserData> => {
  const res = await api.get(`/api/users/${id}`);
  return res.data;
};

export const getFavoriteRoom = async (
  page: number,
  perPage: number
): Promise<{ favorite_room: Favorite[]; pagination: Pagination; total_room: number }> => {
  const res = await api.get('/api/profile/favorite_rooms', {
    params: {
      page,
      limit: perPage,
    },
  });
  return {
    total_room: res.data.total_room,
    favorite_room: res.data.favorite_room,
    pagination: res.data.pagination,
  };
};

export const deleteFavoriteRoom = async (room_id: string): Promise<FavoriteRoomResponse> => {
  const res = await api.delete(`/api/profile/delete-favorite-room/${room_id}`);
  return res.data;
};

export const addFavoriteRoom = async (room_id: string): Promise<FavoriteRoomResponse> => {
  const res = await api.post(`/api/profile/add-favorite-room/${room_id}`);
  return res.data;
};
