import { configureStore } from '@reduxjs/toolkit';
import authSlice from '../services/auth/authSlice';
import subjectSlice from '../services/subject/subjectSlice';
import authorSlice from '../services/author/authorSlice';
import courseSlice from '../services/course/courseSlice';
import moduleSlice from '../services/module/moduleSlice';
import lessonSlice from '../services/lesson/lessonSlice';
import questionSlice from '../services/question/questionSlice';
import examSlice from '../services/exam/examSlice';
import examQuestionSlice from '../services/exam_question/examQuestionSlice';

export const store = configureStore({
  reducer: {
    auth: authSlice,
    subject: subjectSlice,
    author: authorSlice,
    course: courseSlice,
    module: moduleSlice,
    lesson: lessonSlice,
    question: questionSlice,
    exam: examSlice,
    examQuestion: examQuestionSlice,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
