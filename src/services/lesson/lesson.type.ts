import { Module } from '../module/module.type';

export interface Lesson {
  id: number;
  module_id: number;
  name: string;
  video_url: string | null;
  description: string | null;
  duration: number | null;
  order: number;
  status: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  status_string: string;
  module?: Module;
}

export interface LessonRequest {
  module_id: number | null;
  name: string;
  video_url: string | null;
  description: string | null;
  duration: number | null;
  order: number | null;
  status: number | null;
}

export interface LessonListResponse {
  msg: string;
  code: number;
  data: {
    lessons: {
      data: Lesson[];
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
      has_more_pages: boolean;
    };
  };
}

export interface LessonResponse {
  msg: string;
  code: number;
  data: {
    module: Lesson;
  };
}
