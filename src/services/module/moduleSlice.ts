import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';


import { Module, ModuleListResponse, ModuleRequest, ModuleResponse } from './module.type';
import { deleteModule, getModuleDetail, getModules, updateModule, upsertModule } from './moduleApi';
import { MODULE_CONSTANTS } from '../../constants/Module';

interface ModuleState {
  modules: Module[]; // Mảng các module
  total: number;
  currentPage: number;
  lastPage: number;
  loading: boolean;
  error: string | null;
  success: boolean;
}

const initialState: ModuleState = {
  modules: [], // Mảng module khởi tạo rỗng
  total: 0,
  currentPage: 1,
  lastPage: 1,
  loading: false,
  error: null,
  success: false,
};

// Async thunk cho việc lấy danh sách module
export const getModulesAsync = createAsyncThunk(
  'module/getModules',
  async (
    moduleData: { page: number; limit: number; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await getModules(
        moduleData.token,
        moduleData.page,
        moduleData.limit,
      );
      // Trả về dữ liệu module từ phản hồi API
      return response.data.modules;
    } catch (error: any) {
      return rejectWithValue(MODULE_CONSTANTS.MODULE_GET_ALL_FAIL);
    }
  },
);

// Async thunk cho việc thêm mới module
export const upsertModuleAsync = createAsyncThunk(
  'module/upsertModule',
  async (
    moduleData: { data: ModuleRequest; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await upsertModule(moduleData.data, moduleData.token);
      return response;
    } catch (error: any) {
      return rejectWithValue(MODULE_CONSTANTS.MODULE_ADD_FAIL);
    }
  },
);

// Async thunk cho việc xóa module
export const deleteModuleAsync = createAsyncThunk(
  'module/moduleDelete',
  async (moduleData: { id: number; token: string }, { rejectWithValue }) => {
    try {
      const response = await deleteModule(moduleData.id, moduleData.token);
      return response;
    } catch (error: any) {
      return rejectWithValue(MODULE_CONSTANTS.MODULE_DELETE_FAIL);
    }
  },
);

// Async thunk cho việc xem chi tiết module
export const getModuleDetailAsync = createAsyncThunk(
  'module/getModuleDetail',
  async (moduleData: { id: number; token: string }, { rejectWithValue }) => {
    try {
      const response = await getModuleDetail(
        moduleData.id,
        moduleData.token,
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(MODULE_CONSTANTS.MODULE_DETAIL_FAIL);
    }
  },
);

// Async thunk cho việc sửa module
export const updateModuleAsync = createAsyncThunk(
  'module/updateModule',
  async (
    moduleData: { id: number; data: ModuleRequest; token: string },
    { rejectWithValue },
  ) => {
    try {
      const response = await updateModule(
        moduleData.id,
        moduleData.data,
        moduleData.token,
      );
      return response;
    } catch (error: any) {
      return rejectWithValue(MODULE_CONSTANTS.MODULE_UPDATE_FAIL);
    }
  },
);

const moduleSlice = createSlice({
  name: 'module',
  initialState,
  reducers: {
    resetModuleState(state) {
      state.success = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Lấy danh sách module
      .addCase(getModulesAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        getModulesAsync.fulfilled,
        (
          state,
          action: PayloadAction<ModuleListResponse['data']['modules']>,
        ) => {
          state.loading = false;
          state.success = true;
          state.modules = action.payload.data; // Gán danh sách module vào state
          state.total = action.payload.total;
          state.currentPage = action.payload.current_page;
          state.lastPage = action.payload.last_page;
        },
      )
      .addCase(getModulesAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Thêm mới module
      .addCase(upsertModuleAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        upsertModuleAsync.fulfilled,
        (state, action: PayloadAction<ModuleResponse>) => {
          state.loading = false;
          state.success = true;
        },
      )
      .addCase(upsertModuleAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Xóa module
      .addCase(deleteModuleAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(deleteModuleAsync.fulfilled, (state) => {
        state.loading = false;
        state.success = true;
      })
      .addCase(deleteModuleAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Sửa module
      .addCase(updateModuleAsync.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.success = false;
      })
      .addCase(
        updateModuleAsync.fulfilled,
        (state, action: PayloadAction<ModuleResponse>) => {
          state.loading = false;
          state.success = true;
        },
      )
      .addCase(updateModuleAsync.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { resetModuleState } = moduleSlice.actions;

export default moduleSlice.reducer;
