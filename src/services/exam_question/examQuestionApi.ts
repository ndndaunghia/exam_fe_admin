import axiosInstance from '../../utils/axiosInstance';
import {
  QuestionListResponse,
  QuestionRequest,
  QuestionResponse,
} from '../question/question.type';

export const upsertExamQuestion = async (
  data: QuestionRequest,
  token: string,
) => {
  const response = await axiosInstance.post<QuestionResponse>(
    '/exam-questions/upsert',
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

export const deleteExamQuestion = async (id: number, token: string) => {
  const response = await axiosInstance.post(`/exam-questions/${id}/delete`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

export const updateExamQuestion = async (
  id: number,
  data: QuestionRequest,
  token: string,
) => {
  const response = await axiosInstance.post<QuestionResponse>(
    `/exam-questions/upsert/${id}`,
    data,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

export const getExamQuestionDetail = async (id: number, token: string) => {
  const response = await axiosInstance.get<QuestionResponse>(
    `/exam-questions/${id}/detail`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

//API lấy danh sách question
export const getExamQuestions = async (
  token: string,
  page: number = 1,
  limit: number = 10,
) => {
  const response = await axiosInstance.get<QuestionListResponse>(
    '/exam-questions',
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
      params: {
        page,
        limit,
      },
    },
  );
  return response.data;
};
