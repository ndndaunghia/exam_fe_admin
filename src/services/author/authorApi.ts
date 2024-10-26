import axiosInstance from '../../utils/axiosInstance';
import {
  AuthorDetailResponse,
  AuthorListResponse,
  AuthorRequest,
  AuthorUpdateResponse,
} from './author.type';

// API thêm tác giả
export const upsertAuthor = async (data: AuthorRequest, token: string) => {
  const response = await axiosInstance.post('/authors/upsert', data, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// API xóa tác giả
export const deleteAuthor = async (id: number, token: string) => {
  const response = await axiosInstance.post(`/authors/${id}/delete`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return response.data;
};

// API danh sach tac gia
export const getAuthors = async (
  token: string,
  page: number = 1,
  limit: number = 10,
) => {
  const response = await axiosInstance.get<AuthorListResponse>(`/authors`, {
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

// API chi tiết tác giả
export const getAuthorDetail = async (id: number, token: string) => {
  const response = await axiosInstance.get<AuthorDetailResponse>(
    `/authors/${id}/detail`,
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return response.data;
};

//API sửa tác giả
export const updateAuthor = async (
    id: number,
    data: AuthorRequest,
    token: string,
  ) => {
    const response = await axiosInstance.post<AuthorUpdateResponse>(
      `/authors/upsert/${id}`,
      data,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      },
    );
    return response.data;
  };