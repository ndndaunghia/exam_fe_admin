import axiosInstance from '../../utils/axiosInstance';
import { ModuleListResponse, ModuleRequest, ModuleResponse } from './module.type';

//API thêm module
export const upsertModule = async (data: ModuleRequest, token: string) => {
  const response = await axiosInstance.post<ModuleResponse>(
    '/modules/upsert',
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

// API xóa module
export const deleteModule = async (id: number, token: string) => {
  const response = await axiosInstance.post(`/modules/${id}/delete`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// API sửa module
export const updateModule= async (
  id: number,
  data: ModuleRequest,
  token: string,
) => {
  const response = await axiosInstance.post<ModuleResponse>(
    `/modules/upsert/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

//API xem chi tiết module
export const getModuleDetail = async (id: number, token: string) => {
  const response = await axiosInstance.get<ModuleResponse>(`/modules/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

//API lấy danh sách module
export const getModules = async (
  token: string,
  page: number = 1,
  limit: number = 10,
) => {
  const response = await axiosInstance.get<ModuleListResponse>('/modules', {
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

