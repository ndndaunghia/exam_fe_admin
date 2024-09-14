export interface User {
    _id: string;
    username: string;
    email: string;
    fullName: string | null;
    phone: string | null;
    // userToken: string | null;
  }
  
  export interface AuthState {
    user: User | null;
    userToken: string | null;
    isLoading: boolean;
    error: string | null;
  }
  
  export interface LoginCredentials {
    username: string;
    password: string;
  }
  export interface RegisterCredentials extends LoginCredentials {
    email: string;
    confirmPassword: string | undefined;
  }
  
  export interface UserData {
    _id: string;
    username: string;
    email: string;
    fullName: string | null;
    phone: string | null;
    userToken: string;
  }
  
  export interface LoginResponse {
    data: UserData;
  }
  
  export interface RegisterResponse {
    data: UserData;
  }