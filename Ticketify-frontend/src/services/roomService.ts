import api from '@/lib/axios';
import { Room, RoomHome } from '@/types/room';
import { RoomWithDetails, RoomListResponse } from '@/types/index';
import { FilterOptions, RoomFilters, FilteredRoom, ApiResponse } from '@/types/room';

export const getAllRooms = async (params?: {
  page?: number;
  perPage?: number;
  status?: string;
}): Promise<{ data: Room[]; total: number; totalPages: number }> => {
  const res = await api.get('/api/admin/rooms', { params });
  return {
    data: res.data.data,
    total: res.data.pagination?.totalItems ?? 0,
    totalPages: res.data.pagination?.totalPages ?? 1,
  };
};

export const getRoomById = async (id: string): Promise<Room> => {
  const res = await api.get(`/api/admin/rooms/${id}`);
  return res.data.room;
};

export const getRoomDetail = async (id: string): Promise<any> => {
  const res = await api.get(`/api/rooms/${id}/detail`);
  return res.data;
};

export const createRoom = async (newRoom: any) => {
  const formData = new FormData();
  formData.append('name', String(newRoom.name || ''));
  formData.append('status', String(newRoom.status || 'available'));
  formData.append('description', String(newRoom.description || ''));
  formData.append('room_type_id', String(parseInt(newRoom.room_type_id, 10)));
  formData.append('room_level_id', String(parseInt(newRoom.room_level_id, 10)));
  formData.append('floor_id', String(parseInt(newRoom.floor_id, 10)));
  const amenitiesArray = Array.isArray(newRoom.amenities) ? newRoom.amenities.filter(Boolean) : [];

  amenitiesArray.forEach((amenity: string) => {
    formData.append('amenities[]', amenity);
  });
  if (newRoom.images && newRoom.images.length > 0) {
    Array.from(newRoom.images as FileList).forEach((file, idx) => {
      const ext = file.name.substring(file.name.lastIndexOf('.'));
      const baseName = String(newRoom.name || 'room');
      const newFileName =
        newRoom.images.length > 1 ? `${baseName}-${idx + 1}${ext}` : `${baseName}${ext}`;
      const renamedFile = new File([file], newFileName, { type: file.type });
      formData.append('image_url', renamedFile);
    });
  }
  const res = await api.post('/api/admin/rooms', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const updateRoom = async (id: number, updatedRoom: any) => {
  const formData = new FormData();
  formData.append('name', String(updatedRoom.name || ''));
  formData.append('status', String(updatedRoom.status || 'available'));
  formData.append('description', String(updatedRoom.description || ''));
  formData.append('room_type_id', String(parseInt(updatedRoom.room_type_id, 10)));
  formData.append('room_level_id', String(parseInt(updatedRoom.room_level_id, 10)));
  formData.append('floor_id', String(Number(updatedRoom.floor_id)));
  const amenitiesArray = Array.isArray(updatedRoom.amenities)
    ? updatedRoom.amenities.filter(Boolean)
    : [];

  amenitiesArray.forEach((amenity: string) => {
    formData.append('amenities[]', amenity);
  });
  if (updatedRoom.images && updatedRoom.images.length > 0) {
    Array.from(updatedRoom.images as FileList).forEach((file, idx) => {
      const ext = file.name.substring(file.name.lastIndexOf('.'));
      const baseName = String(updatedRoom.name || 'room');
      const newFileName =
        updatedRoom.images.length > 1 ? `${baseName}-${idx + 1}${ext}` : `${baseName}${ext}`;
      const renamedFile = new File([file], newFileName, { type: file.type });
      formData.append('image_url', renamedFile);
    });
  }
  const res = await api.put(`/api/admin/rooms/${id}`, formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return res.data;
};

export const deleteRoom = async (id: number) => {
  const res = await api.delete(`/api/admin/rooms/${id}`);
  return res.data;
};

export const searchAvailableRooms = async (params: {
  check_in: string;
  check_out: string;
  room_type: string;
  rooms: number;
  people: number;
  deal: string;
}) => {
  const res = await api.post('/api/rooms/search', params);
  return res.data;
};

export const getFilterOptions = async (): Promise<FilterOptions> => {
  try {
    const res = await api.get<ApiResponse<FilterOptions>>('/api/rooms/filter-options');
    return res.data.data;
  } catch (error) {
    console.error('Error fetching filter options:', error);
    throw new Error('Failed to fetch filter options');
  }
};
export const getAllDeals = async () => {
  const res = await api.get('/api/deals');
  return res.data;
};

export const assignDealToRoom = async (roomId: number, dealId: number) => {
  const res = await api.post(`/api/admin/rooms/${roomId}/deal`, { deal_id: dealId });
  return res.data;
};

export const getRoomsByStatus = async (
  status: string,
  params?: { page?: number; perPage?: number }
): Promise<{ data: Room[]; total: number; totalPages: number }> => {
  const res = await api.get(`/api/admin/rooms/status/${status}`, { params });
  return {
    data: res.data.data,
    total: res.data.pagination?.totalItems ?? 0,
    totalPages: res.data.pagination?.totalPages ?? 1,
  };
};

export const removeDealFromRoom = async (roomId: number) => {
  const res = await api.put(`/api/admin/rooms/${roomId}/remove-deal`);
  return res.data;
};

export const filterRooms = async (
  filters: RoomFilters
): Promise<{ rooms: FilteredRoom[]; hasDeals: boolean }> => {
  try {
    const queryParams = new URLSearchParams();

    Object.entries(filters).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== '') {
        queryParams.append(key, value.toString());
      }
    });

    const res = await api.get(`/api/rooms/filter?${queryParams.toString()}`);
    return res.data.data;
  } catch (error) {
    console.error('Error filtering rooms:', error);
    throw error;
  }
};
