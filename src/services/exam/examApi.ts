import axiosInstance from '../../utils/axiosInstance';
import { ExamListResponse, ExamRequest, ExamResponse } from './exam.type';

export const upsertExam = async (data: ExamRequest, token: string) => {
  const response = await axiosInstance.post<ExamResponse>(
    '/exams/upsert',
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};
export const deleteExam = async (id: number, token: string) => {
  const response = await axiosInstance.post(`/exams/${id}/delete`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// API sửa exam
export const updateExam = async (
  id: number,
  data: ExamRequest,
  token: string,
) => {
  const response = await axiosInstance.post<ExamResponse>(
    `/exams/upsert/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

//API xem chi tiết exam
export const getExamDetail = async (id: number, token: string) => {
  const response = await axiosInstance.get<ExamResponse>(
    `/exams/${id}/detail`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

//API lấy danh sách exam
export const getExams = async (
  token: string,
  page: number = 1,
  limit: number = 10,
) => {
  const response = await axiosInstance.get<ExamListResponse>('/exams', {
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
