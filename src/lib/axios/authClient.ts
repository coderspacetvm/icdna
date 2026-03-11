import axios, { AxiosError, AxiosInstance, InternalAxiosRequestConfig, AxiosResponse } from 'axios';
import Cookies from 'js-cookie';
import { nkey } from '@/lib/config/cookiesConfig';
import {  TokenErrorResponse } from '@/types/apiRelatedTypes';
import { processQueue, addToFailedQueue, clearAuthCookies, setIsRefreshing, getIsRefreshing } from './interceptors';

const DEFAULT_TIMEOUT = 30000;

const authClient: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_URL,
  timeout: DEFAULT_TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
    'X-Requested-With': 'XMLHttpRequest',
  },
});

authClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = Cookies.get(nkey.auth_token);
    if (token) config.headers['Authorization'] = `Bearer ${token}`;
    return config;
  },
  (error: AxiosError) => Promise.reject(error)
);

authClient.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError<TokenErrorResponse>) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    if (error.response?.data.status === 'AccessTokenExpired' && !originalRequest._retry) {
      if (getIsRefreshing()) {
        try {
          const token = await new Promise<string>((resolve, reject) => {
            addToFailedQueue({ resolve, reject });
          });
          originalRequest.headers['Authorization'] = `Bearer ${token}`;
          return authClient(originalRequest);
        } catch (err) {
          return Promise.reject(err);
        }
      }

      originalRequest._retry = true;
      setIsRefreshing(true);

      try {
        const refreshToken = Cookies.get(nkey.refresh_token);
        const accessToken = Cookies.get(nkey.auth_token);

        if (!refreshToken || !accessToken) throw new Error('No refresh token available');

        const res = await axios.post<any>(`${process.env.BASE_URL}/urls_refresh_token`, {
          refreshToken,
          accessToken,
        });

        if (res.data.success) {
          Cookies.set(nkey.auth_token, res.data.accessToken);
          Cookies.set(nkey.refresh_token, res.data.refreshToken);
          Cookies.set(nkey.refresh_token_expiry, res.data.refreshTokenExpiryTime);

          originalRequest.headers['Authorization'] = `Bearer ${res.data.accessToken}`;
          processQueue(null, res.data.accessToken);
          return authClient(originalRequest);
        } else {
          throw new Error('Failed to refresh');
        }
      } catch (err) {
        processQueue(err, null);
        clearAuthCookies();
        return Promise.reject(err);
      } finally {
        setIsRefreshing(false);
      }
    }

    return Promise.reject(error);
  }
);

export default authClient;
