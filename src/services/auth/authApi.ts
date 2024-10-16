import axiosInstance from '../../utils/axiosInstance';
import { AuthRequest, AuthResponse, ListUserResponse } from './auth.type';

//API login
export const login = async (data: AuthRequest) => {
  const response = await axiosInstance.post<AuthResponse>('/login', data);
  return response.data;
};

// API fetch user data
export const fetchUserData = async (userId: string, token: string) => {
  const response = await axiosInstance.get<AuthResponse>(
    `/users/${userId}/detail`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

// Api get list user
export const getListUser = async (
  token: string,
  page: number = 1,
  limit: number = 10,
) => {
  const response = await axiosInstance.get(`/users`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
    params: {
      page,
      limit,
    },
  });
  return response.data;
};
