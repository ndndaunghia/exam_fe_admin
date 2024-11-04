import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';


import toast from 'react-hot-toast';
import { Question, QuestionListResponse, QuestionRequest, QuestionResponse } from './question.type';
import { deleteQuestion, getQuestionDetail, getQuestions, updateQuestion, upsertQuestion } from './questionApi';
import { QUESTION_CONSTANTS } from '../../constants/Question';

interface QuestionState {
  questions: Question[]; // Mảng các bài giảng
  total: number;
  currentPage: number;
  lastPage: number;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: QuestionState = {
  questions: [], // Mảng bài giảng khởi tạo rỗng
  total: 0,
  currentPage: 1,
  lastPage: 1,
  loading: false,
  error: null,
  success: false,
};

// Async thunk cho việc lấy danh sách bài giảng
export const getQuestionsAsync = createAsyncThunk(
  'question/getQuestions',
  async (
    questionData: { page: number; limit: number; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await getQuestions(
        questionData.token,
        questionData.page,
        questionData.limit,
      );
      // Trả về dữ liệu bài giảng từ phản hồi API
      return response.data.questions;
    } catch (error: any) {
      return rejectWithValue(QUESTION_CONSTANTS.QUESTION_GET_ALL_FAIL);
    }
  },
);

// Async thunk cho việc thêm mới bài giảng
export const upsertQuestionAsync = createAsyncThunk(
  'question/upsertQuestion',
  async (
    questionData: { data: QuestionRequest; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await upsertQuestion(questionData.data, questionData.token);
      return response;
    } catch (error: any) {
      return rejectWithValue(QUESTION_CONSTANTS.QUESTION_ADD_FAIL);
    }
  },
);

// Async thunk cho việc xóa bài giảng
export const deleteQuestionAsync = createAsyncThunk(
  'question/questionDelete',
  async (questionData: { id: number; token: string }, { rejectWithValue }) => {
    try {
      const response = await deleteQuestion(questionData.id, questionData.token);
      return response;
    } catch (error: any) {
      return rejectWithValue(QUESTION_CONSTANTS.QUESTION_DELETE_FAIL);
    }
  },
);

// Async thunk cho việc xem chi tiết bài giảng
export const getQuestionDetailAsync = createAsyncThunk(
  'question/getQuestionDetail',
  async (questionData: { id: number; token: string }, { rejectWithValue }) => {
    try {
      const response = await getQuestionDetail(questionData.id, questionData.token);
      return response;
    } catch (error: any) {
      return rejectWithValue(QUESTION_CONSTANTS.QUESTION_DETAIL_FAIL);
    }
  },
);

// Async thunk cho việc sửa bài giảng
export const updateQuestionAsync = createAsyncThunk(
  'question/updateQuestion',
  async (
    questionData: { id: number; data: QuestionRequest; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await updateQuestion(
        questionData.id,
        questionData.data,
        questionData.token,
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(QUESTION_CONSTANTS.QUESTION_UPDATE_FAIL);
    }
  },
);

const questionSlice = createSlice({
  name: 'question',
  initialState,
  reducers: {
    resetQuestionState(state) {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Lấy danh sách bài giảng
      .addCase(getQuestionsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        getQuestionsAsync.fulfilled,
        (
          state,
          action: PayloadAction<QuestionListResponse['data']['questions']>,
        ) => {
          state.loading = false;
          state.success = true;
          state.questions = action.payload.data; // Gán danh sách bài giảng vào state
          state.total = action.payload.total;
          state.currentPage = action.payload.current_page;
          state.lastPage = action.payload.last_page;
        },
      )
      .addCase(getQuestionsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      // Thêm mới bài giảng
      .addCase(upsertQuestionAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        upsertQuestionAsync.fulfilled,
        (state, action: PayloadAction<QuestionResponse>) => {
          state.loading = false;
          state.success = true;
          state.error = null;
          toast.success(QUESTION_CONSTANTS.QUESTION_ADD_SUCCESS);
        },
      )
      .addCase(upsertQuestionAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      // Xóa bài giảng
      .addCase(deleteQuestionAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteQuestionAsync.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        toast.success(QUESTION_CONSTANTS.QUESTION_DELETE_SUCCESS);
      })
      .addCase(deleteQuestionAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        toast.error(action.payload as string);
      })

      // Sửa bài giảng
      .addCase(updateQuestionAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateQuestionAsync.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
        state.error = null;
        toast.success(QUESTION_CONSTANTS.QUESTION_UPDATE_SUCCESS);
      })
      .addCase(updateQuestionAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
        toast.error(action.payload as string);
      });
  },
});

export const { resetQuestionState } = questionSlice.actions;

export default questionSlice.reducer;
