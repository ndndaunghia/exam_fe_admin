import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../services/auth/authSlice';
import subjectSlice from '../services/subject/subjectSlice';
import authorSlice from '../services/author/authorSlice';
import courseSlice from '../services/course/courseSlice';
import moduleSlice from '../services/module/moduleSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    subject: subjectSlice,
    author: authorSlice,
    course: courseSlice,
    module: moduleSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;