import { Question } from '../question/question.type';

export interface Exam {
  id: number;
  subject_id: number;
  name: string;
  year: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  questions?: Question[];
}

export interface ExamRequest {
  subject_id: number;
  name: string;
  year: number;
  questions?: Question[];
}

export interface ExamListResponse {
  msg: string;
  code: number;
  data: {
    data: Exam[];
    total: number;
    per_page: number;
    current_page: number;
    last_page: number;
    has_more_pages: boolean;
  };
}

export interface ExamResponse {
  msg: string;
  code: number;
  data: Exam;
}
