import { auth } from '@/src/shared/lib/firebase';
import axios from 'axios';

export const publicClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const privateClient = axios.create({
  baseURL: process.env.EXPO_PUBLIC_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

privateClient.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

privateClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      const user = auth.currentUser;
      if (user) {
        const token = await user.getIdToken(true);
        error.config.headers.Authorization = `Bearer ${token}`;
        return privateClient.request(error.config);
      }
    }
    return Promise.reject(error);
  }
);