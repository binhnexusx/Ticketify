import api from './api';
import { CreatePaymentDTO, Payment } from '@/types/index';

export const handlePayment = async (
  payload: CreatePaymentDTO
) => {
  console.log('Processing payment with payload:', payload);
  const res = await api.post('/api/payment/success', payload);
  return res.data;
};

export const getPaymentMethod = async (booking_id: number) => {
  const res = await api.get(`/api/payment/${booking_id}`);
  return res.data;
};

export const updatePaymentMethod = async (
  booking_id: number,
  data: {
    card_name: string;
    card_number: string;
    exp_date: Date;
    method: string;
    paid_at?: string;
  }
) => {
  console.log("PUT /api/payment/", booking_id, data);
  const payload = {
    ...data,
    exp_date: data.exp_date,
  };
  const res = await api.put(`/api/payment/${booking_id}`, payload);
  return res.data;
};
