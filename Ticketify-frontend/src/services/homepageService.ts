import axios from 'axios';
import { HomepageResponse } from '@/types/index';
import { API_URL } from '@/lib/axios';

export const fetchHomepageData = async (): Promise<HomepageResponse> => {
  try {
    const response = await axios.get<HomepageResponse>(`${API_URL}/api/homepage`);
    return response.data;
  } catch (error) {
    throw new Error('Failed to fetch homepage data');
  }
};
