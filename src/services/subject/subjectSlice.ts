import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { SubjectRequest, SubjectResponse } from './Subject.type';
import {
  deleteSubject,
  getSubjectDetail,
  getSubjects,
  upsertSubject,
} from './subjectApi';

interface SubjectState {
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: SubjectState = {
  loading: false,
  error: null,
  success: false,
};

// Async thunk cho việc thêm mới môn học
export const upsertSubjectAsync = createAsyncThunk(
  'subject/upsertSubject',
  async (
    subjectData: { data: SubjectRequest; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await upsertSubject(subjectData.data, subjectData.token);
      return response;
    } catch (error: any) {
      return rejectWithValue('Thêm mới môn học thất bại');
    }
  },
);

// Async thunk cho việc xóa môn học
export const deleteSubjectAsync = createAsyncThunk(
  'subject/deleteSubject',
  async (subjectData: { id: number; token: string }, { rejectWithValue }) => {
    try {
      const response = await deleteSubject(subjectData.id, subjectData.token);
      return response;
    } catch (error: any) {
      return rejectWithValue('Xóa môn học thất bại');
    }
  },
);

// Async thunk cho việc sửa môn học
export const updateSubjectAsync = createAsyncThunk(
  'subject/updateSubject',
  async (
    subjectData: { id: number; data: SubjectRequest; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await upsertSubject(subjectData.data, subjectData.token);
      return response;
    } catch (error: any) {
      return rejectWithValue('Sửa môn học thất bại');
    }
  },
);

// Async thunk cho việc xem chi tiết môn học
export const getSubjectDetailAsync = createAsyncThunk(
  'subject/getSubjectDetail',
  async (subjectData: { id: number; token: string }, { rejectWithValue }) => {
    try {
      const response = await getSubjectDetail(
        subjectData.id,
        subjectData.token,
      );
      return response;
    } catch (error: any) {
      return rejectWithValue('Xem chi tiết môn học thất bại');
    }
  },
);

// Async thunk cho việc lấy danh sách môn học
export const getSubjectsAsync = createAsyncThunk(
  'subject/getSubjects',
  async (
    subjectData: { page: number; limit: number; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await getSubjects(
        subjectData.token,
        subjectData.page,
        subjectData.limit,
      );
      return response;
    } catch (error: any) {
      return rejectWithValue('Lấy danh sách môn học thất bại');
    }
  },
);

const subjectSlice = createSlice({
  name: 'subject',
  initialState,
  reducers: {
    resetSubjectState(state) {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Thêm mới môn học
      .addCase(upsertSubjectAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        upsertSubjectAsync.fulfilled,
        (state, action: PayloadAction<SubjectResponse>) => {
          state.loading = false;
          state.success = true;
        },
      )
      .addCase(upsertSubjectAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Xóa môn học
      .addCase(deleteSubjectAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteSubjectAsync.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(deleteSubjectAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Sửa môn học
      .addCase(updateSubjectAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateSubjectAsync.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateSubjectAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Xem chi tiết môn học
      .addCase(getSubjectDetailAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getSubjectDetailAsync.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(getSubjectDetailAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Lấy danh sách môn học
      .addCase(getSubjectsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(getSubjectsAsync.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(getSubjectsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetSubjectState } = subjectSlice.actions;

export default subjectSlice.reducer;
