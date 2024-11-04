import axiosInstance from '../../utils/axiosInstance';
import { QuestionListResponse, QuestionRequest, QuestionResponse } from './question.type';

//API thêm question
export const upsertQuestion = async (data: QuestionRequest, token: string) => {
  const response = await axiosInstance.post<QuestionResponse>(
    '/questions/upsert',
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

// API xóa question
export const deleteQuestion = async (id: number, token: string) => {
  const response = await axiosInstance.post(`/questions/${id}/delete`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// API sửa question
export const updateQuestion= async (
  id: number,
  data: QuestionRequest,
  token: string,
) => {
  const response = await axiosInstance.post<QuestionResponse>(
    `/questions/upsert/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

//API xem chi tiết question
export const getQuestionDetail = async (id: number, token: string) => {
  const response = await axiosInstance.get<QuestionResponse>(`/questions/${id}/detail`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

//API lấy danh sách question
export const getQuestions = async (
  token: string,
  page: number = 1,
  limit: number = 10,
) => {
  const response = await axiosInstance.get<QuestionListResponse>('/questions', {
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

