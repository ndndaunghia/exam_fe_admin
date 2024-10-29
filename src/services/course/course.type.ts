export interface Course {
  id: number;
  subject_id: number;
  name: string;
  thumbnail_url: string | null;
  author_id: number;
  total_purchases: number;
  description: string | null;
  price: number;
  duration: number | null;
  status: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  status_string: string;
  subject: string | null;
}

export interface CourseRequest {
  subject_id: number | null;
  author_id: number | null;
  name: string;
  thumbnail_url: string | null;
  description: string | null;
  price: number | null;
  duration: number | null;
  status: number | null;
}

export interface CourseListResponse {
  msg: string;
  code: number;
  data: {
    courses: {
      data: Course[];
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
      has_more_pages: boolean;
    };
  };
}

export interface CourseResponse {
  msg: string;
  code: number;
  data: {
    course: Course;
  };
}

export interface CourseUpdateResponse {
  msg: string;
  code: number;
  data: {
    message: string;
  };
}
