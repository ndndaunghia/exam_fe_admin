import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';
import { Author, AuthorListResponse, AuthorRequest } from './author.type';
import {
  deleteAuthor,
  getAuthorDetail,
  getAuthors,
  updateAuthor,
  upsertAuthor,
} from './authorApi';
import { AUTHOR_CONSTANTS } from '../../constants/Author';

interface AuthorState {
  authors: Author[];
  total: number;
  currentPage: number;
  lastPage: number;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: AuthorState = {
  authors: [],
  total: 0,
  currentPage: 1,
  lastPage: 1,
  loading: false,
  error: null,
  success: false,
};

// Async thunk cho việc lấy danh sách tác giả
export const getAuthorsAsync = createAsyncThunk(
  'author/getAuthors',
  async (
    authorData: { page: number; limit: number; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await getAuthors(
        authorData.token,
        authorData.page,
        authorData.limit,
      );
      return response.data.authors;
    } catch (error: any) {
      return rejectWithValue(AUTHOR_CONSTANTS.AUTHOR_GET_ALL_FAIL);
    }
  },
);

// Async thunk cho việc thêm mới tác giả
export const upsertAuthorAsync = createAsyncThunk(
  'author/upsertAuthor',
  async (
    authorData: { data: AuthorRequest; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await upsertAuthor(authorData.data, authorData.token);
      return response;
    } catch (error: any) {
      return rejectWithValue(AUTHOR_CONSTANTS.AUTHOR_ADD_FAIL);
    }
  },
);

// Async thunk cho việc xóa tác giả
export const deleteAuthorAsync = createAsyncThunk(
  'author/deleteAuthor',
  async (authorData: { id: number; token: string }, { rejectWithValue }) => {
    try {
      const response = await deleteAuthor(authorData.id, authorData.token);
      return response;
    } catch (error: any) {
      return rejectWithValue(AUTHOR_CONSTANTS.AUTHOR_DELETE_FAIL);
    }
  },
);

// Async thunk cho việc xem chi tiết tác giả
export const getAuthorDetailAsync = createAsyncThunk(
  'author/getAuthorDetail',
  async (authorData: { id: number; token: string }, { rejectWithValue }) => {
    try {
      const response = await getAuthorDetail(authorData.id, authorData.token);
      return response.data.author;
    } catch (error: any) {
      return rejectWithValue(AUTHOR_CONSTANTS.AUTHOR_DETAIL_FAIL);
    }
  },
);

// Async thunk cho việc sửa tác giả
export const updateAuthorAsync = createAsyncThunk(
  'author/updateAuthor',
  async (
    authorData: { id: number; data: AuthorRequest; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await updateAuthor(
        authorData.id,
        authorData.data,
        authorData.token,
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(AUTHOR_CONSTANTS.AUTHOR_UPDATE_FAIL);
    }
  },
);

const authorSlice = createSlice({
  name: 'author',
  initialState,
  reducers: {
    resetAuthState: (state) => {
      state.loading = false;
      state.error = null;
      state.success = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Lấy danh sách tác giả
      .addCase(getAuthorsAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        getAuthorsAsync.fulfilled,
        (
          state,
          action: PayloadAction<AuthorListResponse['data']['authors']>,
        ) => {
          state.loading = false;
          state.authors = action.payload.data;
          state.total = action.payload.total;
          state.currentPage = action.payload.current_page;
          state.lastPage = action.payload.last_page;
          state.success = true;
        },
      )
      .addCase(getAuthorsAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })
      // Thêm mới tác giả
      .addCase(upsertAuthorAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(upsertAuthorAsync.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(upsertAuthorAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })

      // Xóa tác giả
      .addCase(deleteAuthorAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteAuthorAsync.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(deleteAuthorAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })

      // Xem chi tiết tác giả
      .addCase(getAuthorDetailAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        getAuthorDetailAsync.fulfilled,
        (state, action: PayloadAction<Author>) => {
          state.loading = false;
          state.success = true;
        },
      )
      .addCase(getAuthorDetailAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      })

      // Sửa tác giả
      .addCase(updateAuthorAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(updateAuthorAsync.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(updateAuthorAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.success = false;
      });
  },
});

export const { resetAuthState } = authorSlice.actions;

export default authorSlice.reducer;
