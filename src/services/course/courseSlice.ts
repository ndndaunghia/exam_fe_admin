import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { Course, CourseListResponse, CourseRequest, CourseResponse } from './course.type';
import { deleteCourse, getCourseDetail, getCourses, updateCourse, upsertCourse } from './courseApi';
import { COURSE_CONSTANTS } from '../../constants/Course';

interface CourseState {
  courses: Course[]; // Mảng các khoá học
  total: number;
  currentPage: number;
  lastPage: number;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: CourseState = {
  courses: [], // Mảng khoá học khởi tạo rỗng
  total: 0,
  currentPage: 1,
  lastPage: 1,
  loading: false,
  error: null,
  success: false,
};

// Async thunk cho việc lấy danh sách khoá học
export const getCoursesAsync = createAsyncThunk(
  'course/getCourses',
  async (
    courseData: { page: number; limit: number; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await getCourses(
        courseData.token,
        courseData.page,
        courseData.limit,
      );
      // Trả về dữ liệu khoá học từ phản hồi API
      return response.data.courses;
    } catch (error: any) {
      return rejectWithValue(COURSE_CONSTANTS.COURSE_GET_ALL_FAIL);
    }
  },
);

// Async thunk cho việc thêm mới khoá học
export const upsertCourseAsync = createAsyncThunk(
  'course/upsertCourse',
  async (
    courseData: { data: CourseRequest; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await upsertCourse(courseData.data, courseData.token);
      return response;
    } catch (error: any) {
      return rejectWithValue(COURSE_CONSTANTS.COURSE_ADD_FAIL);
    }
  },
);

// Async thunk cho việc xóa khoá học
export const deleteCourseAsync = createAsyncThunk(
  'course/courseDelete',
  async (courseData: { id: number; token: string }, { rejectWithValue }) => {
    try {
      const response = await deleteCourse(courseData.id, courseData.token);
      return response;
    } catch (error: any) {
      return rejectWithValue(COURSE_CONSTANTS.COURSE_DELETE_FAIL);
    }
  },
);

// Async thunk cho việc xem chi tiết khoá học
export const getCourseDetailAsync = createAsyncThunk(
  'course/getCourseDetail',
  async (courseData: { id: number; token: string }, { rejectWithValue }) => {
    try {
      const response = await getCourseDetail(
        courseData.id,
        courseData.token,
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(COURSE_CONSTANTS.COURSE_DETAIL_FAIL);
    }
  },
);

// Async thunk cho việc sửa khoá học
export const updateCourseAsync = createAsyncThunk(
  'course/updateCourse',
  async (
    courseData: { id: number; data: CourseRequest; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await updateCourse(
        courseData.id,
        courseData.data,
        courseData.token,
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(COURSE_CONSTANTS.COURSE_UPDATE_FAIL);
    }
  },
);

const subjectSlice = createSlice({
  name: 'course',
  initialState,
  reducers: {
    resetCourseState(state) {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Lấy danh sách khoá học
      .addCase(getCoursesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        getCoursesAsync.fulfilled,
        (
          state,
          action: PayloadAction<CourseListResponse['data']['courses']>,
        ) => {
          state.loading = false;
          state.success = true;
          state.courses = action.payload.data; // Gán danh sách khoá học vào state
          state.total = action.payload.total;
          state.currentPage = action.payload.current_page;
          state.lastPage = action.payload.last_page;
        },
      )
      .addCase(getCoursesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Thêm mới khoá học
      .addCase(upsertCourseAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        upsertCourseAsync.fulfilled,
        (state, action: PayloadAction<CourseResponse>) => {
          state.loading = false;
          state.success = true;
        },
      )
      .addCase(upsertCourseAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Xóa khoá học
      .addCase(deleteCourseAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteCourseAsync.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(deleteCourseAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Sửa khoá học
      .addCase(updateCourseAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        updateCourseAsync.fulfilled,
        (state, action: PayloadAction<CourseResponse>) => {
          state.loading = false;
          state.success = true;
        },
      )
      .addCase(updateCourseAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetCourseState } = subjectSlice.actions;

export default subjectSlice.reducer;
