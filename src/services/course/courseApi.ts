import axiosInstance from '../../utils/axiosInstance';
import { CourseListResponse, CourseRequest, CourseResponse, CourseUpdateResponse } from './course.type';

//API thêm khoa' học
export const upsertCourse = async (data: CourseRequest, token: string) => {
  const response = await axiosInstance.post<CourseResponse>(
    '/courses/upsert',
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

// API xóa khoa' học
export const deleteCourse = async (id: number, token: string) => {
  const response = await axiosInstance.post(`/courses/${id}/delete`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// API sửa khoa' học
export const updateCourse= async (
  id: number,
  data: CourseRequest,
  token: string,
) => {
  const response = await axiosInstance.post<CourseUpdateResponse>(
    `/courses/upsert/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

//API xem chi tiết khoa' học
export const getCourseDetail = async (id: number, token: string) => {
  const response = await axiosInstance.get<CourseResponse>(`/courses/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

//API lấy danh sách khoa' học
export const getCourses = async (
  token: string,
  page: number = 1,
  limit: number = 10,
) => {
  const response = await axiosInstance.get<CourseListResponse>('/courses', {
    headers: {
      Authorization: `Bearer ${token}`, // Truyền token vào headers
    },
    params: {
      page, // Tham số phân trang
      limit, // Số lượng khoa' học trên mỗi trang
    },
  });
  return response.data;
};

