import axiosInstance from '../../utils/axiosInstance';
import { LessonListResponse, LessonRequest, LessonResponse } from './lesson.type';

//API thêm lesson
export const upsertLesson = async (data: LessonRequest, token: string) => {
  const response = await axiosInstance.post<LessonResponse>(
    '/lessons/upsert',
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

// API xóa lesson
export const deleteLesson = async (id: number, token: string) => {
  const response = await axiosInstance.post(`/lessons/${id}/delete`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// API sửa lesson
export const updateLesson= async (
  id: number,
  data: LessonRequest,
  token: string,
) => {
  const response = await axiosInstance.post<LessonResponse>(
    `/lessons/upsert/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

//API xem chi tiết lesson
export const getLessonDetail = async (id: number, token: string) => {
  const response = await axiosInstance.get<LessonResponse>(`/lessons/${id}/detail`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

//API lấy danh sách lesson
export const getLessons = async (
  token: string,
  page: number = 1,
  limit: number = 10,
) => {
  const response = await axiosInstance.get<LessonListResponse>('/lessons', {
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

