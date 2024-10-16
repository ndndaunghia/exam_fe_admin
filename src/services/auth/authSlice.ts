import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { AuthRequest, AuthState, ListUserResponse, User } from './auth.type';
import { fetchUserData, getListUser, login } from './authApi';

const initialState: AuthState = {
  user: null,
  users: [],
  token: localStorage.getItem('token'),
  loading: false,
  error: null,
};

export const loginAsync = createAsyncThunk(
  'auth/login',
  async (credentials: AuthRequest, { rejectWithValue }) => {
    try {
      const response = await login(credentials);
      const data = response.data;
      localStorage.setItem('token', data.token);
      localStorage.setItem('userId', data.user.id.toString());
      return data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Đăng nhập thất bại',
      );
    }
  },
);

export const fetchUserDataAsync = createAsyncThunk(
  'auth/fetchUserData',
  async (_, { rejectWithValue }) => {
    try {
      const token = localStorage.getItem('token');
      const userId = localStorage.getItem('userId');
      if (!token || !userId) {
        return rejectWithValue('Token hoặc userId không tồn tại');
      } else {
        const response = await fetchUserData(userId, token);
        return response.data;
      }
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Lấy dữ liệu người dùng thất bại',
      );
    }
  },
);

export const getListUserAsync = createAsyncThunk(
  'auth/getListUser',
  async (
    credentials: { page: number; limit: number; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await getListUser(
        credentials.token,
        credentials.page,
        credentials.limit,
      );
      console.log('API response:', response);  // Kiểm tra dữ liệu trả về từ API
      return response.data.users ? response.data.users.data : [];  // Kiểm tra kỹ payload trước khi trả về
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || 'Lấy danh sách người dùng thất bại',
      );
    }
  },
);


const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout(state) {
      state.user = null;
      state.token = null;
      localStorage.removeItem('token');
      localStorage.removeItem('userId');
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(loginAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginAsync.fulfilled,
        (state, action: PayloadAction<{ user: User; token: string }>) => {
          state.loading = false;
          state.user = action.payload.user;
          state.token = action.payload.token;
        },
      )
      .addCase(loginAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch user data
      .addCase(fetchUserDataAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        fetchUserDataAsync.fulfilled,
        (state, action: PayloadAction<{ user: User; token: string }>) => {
          state.loading = false;
          state.user = action.payload.user;
        },
      )
      .addCase(fetchUserDataAsync.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.token = null;
        state.error = action.payload as string;
      })

      // Get list user
      .addCase(getListUserAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(getListUserAsync.fulfilled, (state, action: PayloadAction<User[]>) => {
        state.loading = false;
        state.users = action.payload ? action.payload : [];  // Đảm bảo gán một mảng hợp lệ vào state.users
      })
      .addCase(getListUserAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout } = authSlice.actions;

export default authSlice.reducer;
