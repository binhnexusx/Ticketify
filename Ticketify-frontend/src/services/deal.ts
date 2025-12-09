import api from './api'
import { Deal, Deals, PaginatedDealResponse } from '@/types/deal'

export const getDealList = async (
  page = 1,
  limit = 10
): Promise<PaginatedDealResponse> => {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  }).toString();

  const res = await api.get(`/api/deals?${query}`);
  return res.data;
};

export const getActiveDeals = async (): Promise<Deals[]> => {
  const res = await api.get('/api/deals/active');
  return res.data;
};

export const getDealById = async (id: number): Promise<Deal> => {
  const res = await api.get(`/api/deals/${id}`);
  return res.data;
};

export const getDealByRoomTypeId = async (roomTypeId: number): Promise<Deals[]> => {
  const res = await api.get(`/api/deals/room_type/${roomTypeId}`);
  return res.data;
};

export const getDealsFiltered = async (
  status?: string,
  startDate?: string,
  endDate?: string,
  page = 1,
  limit = 10
): Promise<PaginatedDealResponse> => {
  const query = new URLSearchParams({
    page: String(page),
    limit: String(limit),
  });

  if (status) query.append("status", status);
  if (startDate) query.append("startDate", startDate);
  if (endDate) query.append("endDate", endDate);

  const res = await api.get(`/api/deals/filter?${query.toString()}`);

  // 📜 Log toàn bộ dữ liệu API trả về
  console.log("📦 API getDealsFiltered response:", res);

  return {
    items: res.items,
    total: res.total,
    totalPages: res.totalPages,
    page: res.page,
    limit: res.limit,
  };
};



export const createDeal = async (dealData: Partial<Deal>): Promise<Deal> => {
  const res = await api.post('/api/deals', dealData);
  return res.data;
};

export const updateDeal = async (id: number, dealData: Partial<Deal>): Promise<Deal> => {
  const res = await api.put(`/api/deals/${id}`, dealData);
  return res.data;
};

export const deleteDeal = async (id: number): Promise<void> => {
  await api.delete(`/api/deals/${id}`);
};

export const getDealSummary = async (): Promise<any> => {
  const res = await api.get('/api/deals/summary');
  return res.data;
};
