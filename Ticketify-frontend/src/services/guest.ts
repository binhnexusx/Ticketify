import axios from '@/lib/axios';

export const fetchUserList = async (params?: { page?: number; perpage?: number }) => {
  const response = await axios.get('/api/admin/booking-list', { params });
  return response.data;
};
export const fetchCheckInStatus = async () => {
  const response = await axios.get('/api/admin/checkin-guests');
  return response.data;
};
export const fetchCheckOutStatus = async () => {
  const response = await axios.get('/api/admin/checkout-guests');
  return response.data;
};
