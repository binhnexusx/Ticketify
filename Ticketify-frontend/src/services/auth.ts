import axios from 'axios';
import api from './api';
import type { LoginPayload, LoginResponse, RegisterPayload, RegisterResponse } from '@/types/auth';
import { API_URL } from '@/constants/api';

export const login = async (data: LoginPayload): Promise<LoginResponse> => {
  const res = await api.post('/api/login', data);
  return res.data;
};

export const register = async (data: RegisterPayload): Promise<RegisterResponse> => {
  const res = await api.post('/api/register', data);
  return res.data;
};
export const logout = async (refreshToken: string) => {
  const res = await api.post('/api/logout', { refreshToken });
  return res.data;
};

export const requestEmailChange = async (data: { userId: number; newEmail: string }) => {
  const res = await api.post('/api/request-email-change', data);
  return res.data;
};
export const verifyEmailChange = async (data: {
  userId: number;
  newEmail: string;
  otp: number;
}) => {
  const res = await api.post('/api/verify-email-change', data);
  return res.data;
};

export const changePassword = async (data: {
  userId: number;
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}) => {
  const res = await api.post('/api/change-password', data);
  return res.data;
};

export const sendForgotPasswordOTP = async (email: string) => {
  const res = await api.post('/api/forgot-password', { email });
  return res.data;
};

export const verifyForgotPasswordOTP = async (email: string, otp: string) => {
  try {
    const res = await api.post('/api/verify-otp', { email, otp });
    return res;
  } catch (error: any) {
    console.error('❌ OTP verification failed:', error.response?.data || error);
    return {
      status: 'error',
      message: error.response?.data?.message || 'Failed to verify OTP',
    };
  }
};

export const resetPasswordWithToken = async (
  email: string | null,
  resetToken: string | null,
  newPassword: string
) => {
  const res = await api.post('/api/reset-password', { email, resetToken, newPassword });
  return res;
};
