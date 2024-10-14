import axiosInstance from '../../utils/axiosInstance';
import { SubjectListResponse, SubjectRequest, SubjectResponse } from './Subject.type';

//API thêm môn học
export const upsertSubject = async (data: SubjectRequest, token: string) => {
  const response = await axiosInstance.post<SubjectResponse>(
    '/subjects/upsert',
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

// API xóa môn học
export const deleteSubject = async (id: number, token: string) => {
  const response = await axiosInstance.delete(`/subjects/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// API sửa môn học
export const updateSubject = async (
  id: number,
  data: SubjectRequest,
  token: string,
) => {
  const response = await axiosInstance.put<SubjectResponse>(
    `/subjects/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

//API xem chi tiết môn học
export const getSubjectDetail = async (id: number, token: string) => {
  const response = await axiosInstance.get<SubjectResponse>(`/subjects/${id}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

//API lấy danh sách môn học
export const getSubjects = async (token: string, page: number = 1, limit: number = 10) => {
    const response = await axiosInstance.get<SubjectListResponse>(
      '/subjects', 
      {
        headers: {
          Authorization: `Bearer ${token}`,  // Truyền token vào headers
        },
        params: {
          page,  // Tham số phân trang
          limit, // Số lượng môn học trên mỗi trang
        },
      }
    );
    return response.data;
  };
  