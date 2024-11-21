import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import toast from 'react-hot-toast';

import { QUESTION_CONSTANTS } from '../../constants/Question';
import {
  deleteExamQuestion,
  getExamQuestionDetail,
  getExamQuestions,
  updateExamQuestion,
  upsertExamQuestion,
} from './examQuestionApi';
import {
  Question,
  QuestionListResponse,
  QuestionRequest,
  QuestionResponse,
} from '../question/question.type';

interface QuestionState {
  examQuestions: Question[];
  total: number;
  currentPage: number;
  lastPage: number;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: QuestionState = {
  examQuestions: [],
  total: 0,
  currentPage: 1,
  lastPage: 1,
  loading: false,
  error: null,
  success: false,
};

// Async thunk cho việc lấy danh sách bài giảng
export const getExamQuestionsAsync = createAsyncThunk(
  'examQuestion/getExamQuestions',
  async (
    examQuestionData: { page: number; limit: number; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await getExamQuestions(
        examQuestionData.token,
        examQuestionData.page,
        examQuestionData.limit,
      );
      return response.data.questions;
    } catch (error: any) {
      return rejectWithValue(QUESTION_CONSTANTS.QUESTION_GET_ALL_FAIL);
    }
  },
);

export const upsertExamQuestionAsync = createAsyncThunk(
  'examQuestion/upsertExamQuestion',
  async (
    examQuestionData: { data: QuestionRequest; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await upsertExamQuestion(
        examQuestionData.data,
        examQuestionData.token,
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(QUESTION_CONSTANTS.QUESTION_ADD_FAIL);
    }
  },
);

export const deleteExamQuestionAsync = createAsyncThunk(
  'examQuestion/examQuestionDelete',
  async (
    examQuestionData: { id: number; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await deleteExamQuestion(
        examQuestionData.id,
        examQuestionData.token,
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(QUESTION_CONSTANTS.QUESTION_DELETE_FAIL);
    }
  },
);

// Async thunk cho việc xem chi tiết bài giảng
export const getExamQuestionDetailAsync = createAsyncThunk(
  'examQuestion/getExamQuestionDetail',
  async (
    examQuestionData: { id: number; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await getExamQuestionDetail(
        examQuestionData.id,
        examQuestionData.token,
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(QUESTION_CONSTANTS.QUESTION_DETAIL_FAIL);
    }
  },
);

// Async thunk cho việc sửa bài giảng
export const updateExamQuestionAsync = createAsyncThunk(
  'examQuestion/updateExamQuestion',
  async (
    examQuestionData: { id: number; data: QuestionRequest; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await updateExamQuestion(
        examQuestionData.id,
        examQuestionData.data,
        examQuestionData.token,
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(QUESTION_CONSTANTS.QUESTION_UPDATE_FAIL);
    }
  },
);

const examQuestionSlice = createSlice({
  name: 'examQuestion',
  initialState,
  reducers: {
    resetExamQuestionState(state) {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Lấy danh sách bài giảng
      .addCase(getExamQuestionsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        getExamQuestionsAsync.fulfilled,
        (
          state,
          action: PayloadAction<QuestionListResponse['data']['questions']>,
        ) => {
          state.loading = false;
          state.success = true;
          state.examQuestions = action.payload.data;
          state.total = action.payload.total;
          state.currentPage = action.payload.current_page;
          state.lastPage = action.payload.last_page;
        },
      )
      .addCase(getExamQuestionsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      .addCase(upsertExamQuestionAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        upsertExamQuestionAsync.fulfilled,
        (state, action: PayloadAction<QuestionResponse>) => {
          state.loading = false;
          state.success = true;
          state.error = null;
          toast.success(QUESTION_CONSTANTS.QUESTION_ADD_SUCCESS);
        },
      )
      .addCase(upsertExamQuestionAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      .addCase(deleteExamQuestionAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteExamQuestionAsync.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        toast.success(QUESTION_CONSTANTS.QUESTION_DELETE_SUCCESS);
      })
      .addCase(deleteExamQuestionAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      .addCase(updateExamQuestionAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateExamQuestionAsync.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        toast.success(QUESTION_CONSTANTS.QUESTION_UPDATE_SUCCESS);
      })
      .addCase(updateExamQuestionAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
        toast.error(action.payload as string);
      });
  },
});

export const { resetExamQuestionState } = examQuestionSlice.actions;

export default examQuestionSlice.reducer;
