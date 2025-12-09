import axios, { AxiosError, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { API_URL } from '@/constants/api';
import { toast } from '@/hooks/use-toast';
import { getAccessToken, getRefreshToken, setAccessToken, resetSession } from '@/lib/auth';

interface CustomAxiosRequestConfig extends InternalAxiosRequestConfig {
  silentError?: boolean;
  _retry?: boolean;
}

const api = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 10000,
});

let isRefreshing = false;
let failedQueue: any[] = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

api.interceptors.request.use(
  (config: CustomAxiosRequestConfig) => {
    const token = getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

api.interceptors.response.use(
  (response: AxiosResponse) => response.data,
  async (error: AxiosError<any>) => {
    const originalRequest = error.config as CustomAxiosRequestConfig;
    const { response } = error;

    if (response?.status === 401 && !originalRequest._retry) {
      const refreshToken = getRefreshToken();

      if (!refreshToken) {
        resetSession();
        // window.location.href = '/login'; 
        return Promise.reject(error);
      }

      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({
            resolve: (token: string) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              resolve(api(originalRequest));
            },
            reject: (err: any) => reject(err),
          });
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const res = await axios.post(`${API_URL}/api/refresh-token`, {
          refreshToken,
        });

        const newAccessToken = res.data?.accessToken;
        console.log('🎯 Refresh thành công, token mới:', newAccessToken);

        setAccessToken(newAccessToken);
        processQueue(null, newAccessToken);

        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        console.error('❌ Refresh token thất bại:', refreshError);
        processQueue(refreshError, null);
        resetSession();
        // window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    if (response?.status === 403) {
      console.warn('⚠️ 403 Forbidden – Token có thể không đủ quyền hoặc đã hết hạn');
    }

    if (response?.status === 410) { 
      resetSession();
      // window.location.href = '/login';
      return Promise.reject(error);
    }

    if (!originalRequest?.silentError) {
      const msg = response?.data?.message || error.message || 'Server error';
      toast({ variant: 'destructive', description: msg });
    }

    return Promise.reject(error);
  }
);

export default api;
