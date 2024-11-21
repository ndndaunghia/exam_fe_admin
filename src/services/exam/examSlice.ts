import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Exam, ExamListResponse, ExamRequest, ExamResponse } from './exam.type';
import {
  deleteExam,
  getExamDetail,
  getExams,
  updateExam,
  upsertExam,
} from './examApi';
import { EXAM_CONSTANTS } from '../../constants/Exam';
import toast from 'react-hot-toast';

interface ExamState {
  exams: Exam[]; // Mảng các bài thi
  total: number;
  currentPage: number;
  lastPage: number;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ExamState = {
  exams: [],
  total: 0,
  currentPage: 1,
  lastPage: 1,
  loading: false,
  error: null,
  success: false,
};

export const getExamsAsync = createAsyncThunk(
  'exam/getExams',
  async (
    examData: { page: number; limit: number; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await getExams(
        examData.token,
        examData.page,
        examData.limit,
      );
      // Trả về dữ liệu bài giảng từ phản hồi API
      return response.data;
    } catch (error: any) {
      return rejectWithValue(EXAM_CONSTANTS.EXAM_GET_ALL_FAIL);
    }
  },
);

// Async thunk cho việc thêm mới bài giảng
export const upsertExamAsync = createAsyncThunk(
  'exam/upsertExam',
  async (
    examData: { data: ExamRequest; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await upsertExam(examData.data, examData.token);
      return response;
    } catch (error: any) {
      return rejectWithValue(EXAM_CONSTANTS.EXAM_ADD_FAIL);
    }
  },
);

// Async thunk cho việc xóa bài giảng
export const deleteExamAsync = createAsyncThunk(
  'exam/examDelete',
  async (examData: { id: number; token: string }, { rejectWithValue }) => {
    try {
      const response = await deleteExam(examData.id, examData.token);
      return response;
    } catch (error: any) {
      return rejectWithValue(EXAM_CONSTANTS.EXAM_DELETE_FAIL);
    }
  },
);

// Async thunk cho việc xem chi tiết bài giảng
export const getExamDetailAsync = createAsyncThunk(
  'exam/getExamDetail',
  async (examData: { id: number; token: string }, { rejectWithValue }) => {
    try {
      const response = await getExamDetail(examData.id, examData.token);
      return response;
    } catch (error: any) {
      return rejectWithValue(EXAM_CONSTANTS.EXAM_DETAIL_FAIL);
    }
  },
);

// Async thunk cho việc sửa bài giảng
export const updateExamAsync = createAsyncThunk(
  'exam/updateExam',
  async (
    examData: { id: number; data: ExamRequest; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await updateExam(
        examData.id,
        examData.data,
        examData.token,
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(EXAM_CONSTANTS.EXAM_UPDATE_FAIL);
    }
  },
);

const examSlice = createSlice({
  name: 'exam',
  initialState,
  reducers: {
    resetExamState(state) {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Lấy danh sách bài giảng
      .addCase(getExamsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        getExamsAsync.fulfilled,
        (state, action: PayloadAction<ExamListResponse['data']>) => {
          state.loading = false;
          state.success = true;
          state.exams = action.payload.data;
          state.total = action.payload.total;
          state.currentPage = action.payload.current_page;
          state.lastPage = action.payload.last_page;
        },
      )
      .addCase(getExamsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      // Thêm mới bài giảng
      .addCase(upsertExamAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        upsertExamAsync.fulfilled,
        (state, action: PayloadAction<ExamResponse>) => {
          state.loading = false;
          state.success = true;
          state.error = null;
          toast.success(EXAM_CONSTANTS.EXAM_ADD_SUCCESS);
        },
      )
      .addCase(upsertExamAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      // Xóa bài giảng
      .addCase(deleteExamAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteExamAsync.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        toast.success(EXAM_CONSTANTS.EXAM_DELETE_SUCCESS);
      })
      .addCase(deleteExamAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      // Sửa bài giảng
      .addCase(updateExamAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateExamAsync.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        toast.success(EXAM_CONSTANTS.EXAM_UPDATE_SUCCESS);
      })
      .addCase(updateExamAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
        toast.error(action.payload as string);
      });
  },
});

export const { resetExamState } = examSlice.actions;

export default examSlice.reducer;
