import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
import Cookies from 'js-cookie';
import axiosInstance from '../../utils/axiosInstance';

interface AuthState {
  user: {
    _id: number | null;
    username: string;
    email: string;
    role: string;
  } | null;
  token: string | null;
  isAuthenticated: boolean;
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

// Initial state
const initialState: AuthState = {
  user: null,
  token: null,
  isAuthenticated: false,
  status: 'idle',
  error: null,
};

// Async thunk for login
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (
    credentials: { username: string; password: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await axiosInstance.post('/user/login', credentials);
      // Save token to localStorage
      //   localStorage.setItem('token', response.data.token);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const fetchUserData = createAsyncThunk(
  'auth/fetchUserData',
  async (userId: string, { rejectWithValue }) => {
    try {
      const accessToken = Cookies.get('accessToken');
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

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.user = null;
      state.token = null;
      state.isAuthenticated = false;
      Cookies.remove('accessToken');
      Cookies.remove('refreshToken');
      localStorage.removeItem('userId');
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.data;
        state.token = action.payload.token;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.isAuthenticated = false;
      })
      .addCase(fetchUserData.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUserData.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.user = action.payload.data;
        state.isAuthenticated = true;
      })
      .addCase(fetchUserData.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
        state.isAuthenticated = false;
      });
  },
});

export const { logout } = authSlice.actions;
export default authSlice.reducer;
