export interface Question {
  id: number;
  lesson_id: number | null;
  name: string;
  description: string | null;
  image_url: string | null;
  status: number;
  difficulty: number;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  status_string: string;
  difficulty_string: string;
  options: Option[];
}

export interface QuestionRequest {
  lesson_id: number | null;
  name: string;
  description: string | null;
  image_url: string | null;
  status: number | null;
  difficulty: number | null;
  options: Option[];
}

export interface Option {
  id?: number;
  question_id?: number;
  content: string;
  explanation: string | null;
  is_correct: number;
  created_at?: string;
  updated_at?: string;
  deleted_at?: string | null;
  is_correct_string?: string;
}

export interface QuestionListResponse {
  msg: string;
  code: number;
  data: {
    questions: {
      data: Question[];
      total: number;
      per_page: number;
      current_page: number;
      last_page: number;
      has_more_pages: boolean;
    };
  };
}

export interface QuestionResponse {
  msg: string;
  code: number;
  data: {
    question: Question;
  };
}
