import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../services/auth/authSlice';
import subjectSlice from '../services/subject/subjectSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    subject: subjectSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;