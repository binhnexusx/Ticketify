import axios from 'axios';

export const API_URL = 'https://bride-post-remembered-og.trycloudflare.com';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
