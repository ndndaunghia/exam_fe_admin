import { Course } from '../course/course.type';
export interface Author {
  id: number;
  name: string;
  avatar_url: string | null;
  email: string;
  phone_number: string;
  description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  courses_count: number;
  courses?: Course[];
}

export interface AuthorRequest {
  name: string;
  avatar_url: string | null;
  email: string;
  phone_number: string;
  description: string | null;
}

export interface AuthorUpdateResponse {
  msg: string;
  code: number;
  data: {
    message: string;
  };
}

export interface AuthorListResponse {
  msg: string;
  code: number;
  data: {
    authors: {
      data: Author[];
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
      has_more_pages: boolean;
    };
  };
}

export interface AuthorDetailResponse {
  msg: string;
  code: number;
  data: {
    author: Author;
  };
}
