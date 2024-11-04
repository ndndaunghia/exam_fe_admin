import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import {
  Lesson,
  LessonListResponse,
  LessonRequest,
  LessonResponse,
} from './lesson.type';
import {
  deleteLesson,
  getLessonDetail,
  getLessons,
  updateLesson,
  upsertLesson,
} from './lessonApi';
import { LESSON_CONSTANTS } from '../../constants/Lesson';
import toast from 'react-hot-toast';

interface LessonState {
  lessons: Lesson[]; // Mảng các bài giảng
  total: number;
  currentPage: number;
  lastPage: number;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: LessonState = {
  lessons: [], // Mảng bài giảng khởi tạo rỗng
  total: 0,
  currentPage: 1,
  lastPage: 1,
  loading: false,
  error: null,
  success: false,
};

// Async thunk cho việc lấy danh sách bài giảng
export const getLessonsAsync = createAsyncThunk(
  'lesson/getLessons',
  async (
    lessonData: { page: number; limit: number; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await getLessons(
        lessonData.token,
        lessonData.page,
        lessonData.limit,
      );
      // Trả về dữ liệu bài giảng từ phản hồi API
      return response.data.lessons;
    } catch (error: any) {
      return rejectWithValue(LESSON_CONSTANTS.LESSON_GET_ALL_FAIL);
    }
  },
);

// Async thunk cho việc thêm mới bài giảng
export const upsertLessonAsync = createAsyncThunk(
  'lesson/upsertLesson',
  async (
    lessonData: { data: LessonRequest; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await upsertLesson(lessonData.data, lessonData.token);
      return response;
    } catch (error: any) {
      return rejectWithValue(LESSON_CONSTANTS.LESSON_ADD_FAIL);
    }
  },
);

// Async thunk cho việc xóa bài giảng
export const deleteLessonAsync = createAsyncThunk(
  'lesson/lessonDelete',
  async (lessonData: { id: number; token: string }, { rejectWithValue }) => {
    try {
      const response = await deleteLesson(lessonData.id, lessonData.token);
      return response;
    } catch (error: any) {
      return rejectWithValue(LESSON_CONSTANTS.LESSON_DELETE_FAIL);
    }
  },
);

// Async thunk cho việc xem chi tiết bài giảng
export const getLessonDetailAsync = createAsyncThunk(
  'lesson/getLessonDetail',
  async (lessonData: { id: number; token: string }, { rejectWithValue }) => {
    try {
      const response = await getLessonDetail(lessonData.id, lessonData.token);
      return response;
    } catch (error: any) {
      return rejectWithValue(LESSON_CONSTANTS.LESSON_DETAIL_FAIL);
    }
  },
);

// Async thunk cho việc sửa bài giảng
export const updateLessonAsync = createAsyncThunk(
  'lesson/updateLesson',
  async (
    lessonData: { id: number; data: LessonRequest; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await updateLesson(
        lessonData.id,
        lessonData.data,
        lessonData.token,
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(LESSON_CONSTANTS.LESSON_UPDATE_FAIL);
    }
  },
);

const lessonSlice = createSlice({
  name: 'lesson',
  initialState,
  reducers: {
    resetLessonState(state) {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Lấy danh sách bài giảng
      .addCase(getLessonsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        getLessonsAsync.fulfilled,
        (
          state,
          action: PayloadAction<LessonListResponse['data']['lessons']>,
        ) => {
          state.loading = false;
          state.success = true;
          state.lessons = action.payload.data; // Gán danh sách bài giảng vào state
          state.total = action.payload.total;
          state.currentPage = action.payload.current_page;
          state.lastPage = action.payload.last_page;
        },
      )
      .addCase(getLessonsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      // Thêm mới bài giảng
      .addCase(upsertLessonAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        upsertLessonAsync.fulfilled,
        (state, action: PayloadAction<LessonResponse>) => {
          state.loading = false;
          state.success = true;
          state.error = null;
          toast.success(LESSON_CONSTANTS.LESSON_ADD_SUCCESS);
        },
      )
      .addCase(upsertLessonAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      // Xóa bài giảng
      .addCase(deleteLessonAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteLessonAsync.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        toast.success(LESSON_CONSTANTS.LESSON_DELETE_SUCCESS);
      })
      .addCase(deleteLessonAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      // Sửa bài giảng
      .addCase(updateLessonAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateLessonAsync.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        toast.success(LESSON_CONSTANTS.LESSON_UPDATE_SUCCESS);
      })
      .addCase(updateLessonAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
        toast.error(action.payload as string);
      });
  },
});

export const { resetLessonState } = lessonSlice.actions;

export default lessonSlice.reducer;
