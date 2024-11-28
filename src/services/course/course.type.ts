import { Option } from '../question/question.type';
import { Subject } from '../subject/subject.type';

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
  subject: Subject;
  module?: Module[];
}

export interface Module {
  id: number;
  course_id: number;
  name: string;
  order: number;
  status: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  status_string: string;
  lesson?: Lesson[];
}

export interface Lesson {
  id: number;
  module_id: number;
  name: string;
  video_url: string | null;
  description: string | null;
  order: number;
  duration: number;
  status: number;
  is_unlocked: boolean;
  is_checked: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  status_string: string;
  is_unlocked_string: string;
  is_checked_string: string;
  question?: Question[];
}
export interface Question {
  id: number;
  lesson_id: number;
  name: string;
  image_url: string | null;
  description: string | null;
  status: number;
  is_unlocked: number;
  is_checked: boolean;
  difficulty: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  status_string: string;
  difficulty_string: string;
  is_unlocked_string: string;
  is_checked_string: string;
  options?: Option[];
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

export interface CourseDetailResponse {
  msg: string;
  code: number;
  data: {
    course: Course;
  };
}
