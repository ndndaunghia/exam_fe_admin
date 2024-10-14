import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import Cookies from 'js-cookie';
import axiosInstance from '../../utils/axiosInstance';
import { FormDataCourse } from '../../pages/Tables/type';

interface CourseState {
  courses: any[];
  status: 'idle' | 'loading' | 'succeeded' | 'failed';
  error: string | null;
}

const initialState: CourseState = {
  courses: [],
  status: 'idle',
  error: null,
};

export const fetchAllCourses = createAsyncThunk(
  'courses/getAllCourses',
  async (_, { rejectWithValue }) => {
    try {
      const accessToken = Cookies.get('accessToken');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axiosInstance.get(
        '/courses/getAllCourses',
        config,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const addNewCourse = createAsyncThunk(
  'courses/addCourse',
  async (courseData: FormDataCourse, { rejectWithValue }) => {
    try {
      const accessToken = Cookies.get('accessToken');
      console.log('accessToken', accessToken);

      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axiosInstance.post(
        '/courses/addCourse',
        courseData,
        config,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const getCourseById = createAsyncThunk(
  'courses/getCourse',
  async (courseId: string, { rejectWithValue }) => {
    try {
      const accessToken = Cookies.get('accessToken');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axiosInstance.get(
        `/courses/getCourse/${courseId}`,
        config,
      );
      console.log('response', response.data);

      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

export const deleteCourseById = createAsyncThunk(
  'courses/deleteCourse',
  async (courseId: string, { rejectWithValue }) => {
    try {
      const accessToken = Cookies.get('accessToken');
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${accessToken}`,
        },
      };
      const response = await axiosInstance.delete(
        `/courses/deleteCourse/${courseId}`,
        config,
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(error.response.data);
    }
  },
);

const courseSlice = createSlice({
  name: 'courses',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchAllCourses.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAllCourses.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.courses = action.payload;
      })
      .addCase(fetchAllCourses.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(addNewCourse.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(addNewCourse.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.courses.push(action.payload);
      })
      .addCase(addNewCourse.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(getCourseById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(getCourseById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.courses = action.payload;
      })
      .addCase(getCourseById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      })
      .addCase(deleteCourseById.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(deleteCourseById.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.courses = state.courses.filter(
          (course) => course.course_id !== action.payload,
        );
      })
      .addCase(deleteCourseById.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.payload as string;
      });
  },
});

export default courseSlice.reducer;
