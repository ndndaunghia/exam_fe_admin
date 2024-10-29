import { Course } from "../course/course.type";

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
  course?: Course;
}

export interface ModuleRequest {
  course_id: number | null;
  name: string;
  order: number | null;
  status: number | null;
}

export interface ModuleListResponse {
  msg: string;
  code: number;
  data: {
    modules: {
      data: Module[];
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
      has_more_pages: boolean;
    };
  };
}

export interface ModuleResponse {
  msg: string;
  code: number;
  data: {
    module: Module;
  };
}