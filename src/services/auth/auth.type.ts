export interface User {
  id: number;
  name: string;
  avatar_url: string | null;
  email: string;
  course_id: number | null;
  user_type: number;
  email_verified_at: string;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
  type_string: string;
}

export interface AuthResponse {
  msg: string;
  code: number;
  data: {
    user: User;
    token: string;
  };
}

export interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
}
