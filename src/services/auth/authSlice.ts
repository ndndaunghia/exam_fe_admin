import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthResponse, AuthState, User } from './auth.type';
import axiosInstance from '../../utils/axiosInstance';
interface LoginCredentials {
  email: string;
  password: string;
}

const initialState: AuthState = {
  user: null,
  token: null,
  loading: false,
  error: null,
};

// Thunk để xử lý đăng nhập
export const login = createAsyncThunk(
  '/login',
  async (credentials: LoginCredentials, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post<AuthResponse>(
        '/login',
        credentials
      );
      const data = response.data;
      // Lưu token vào localStorage nếu cần
      localStorage.setItem('token', data.data.token);
      return data.data;
    } catch (error: any) {
      // Xử lý lỗi và trả về rejectWithValue
      return rejectWithValue(
        error.response?.data?.message || 'Đăng nhập thất bại'
      );
    }
  }
);

// Tạo authSlice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
    },
  },
  extraReducers: (builder) => {
    builder
      // Xử lý trạng thái pending của login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      // Xử lý khi login thành công
      .addCase(
        login.fulfilled,
        (state, action: PayloadAction<{ user: User; token: string }>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
        }
      )
      // Xử lý khi login thất bại
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const fetchUserData = createAsyncThunk(
  'auth/fetchUserData',
  async (userId: string, { rejectWithValue }) => {
    try {
      const accessToken = "";
      if (!accessToken) {
        return rejectWithValue('No access token found');
      }

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      };

      const response = await axiosInstance.get(
        `/user/getUserData/${userId}`,
        config,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const { logout } = authSlice.actions;

export default authSlice.reducer;
