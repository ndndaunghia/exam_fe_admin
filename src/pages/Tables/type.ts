export interface Lesson {
  type: 'video' | 'quiz';
  content: string;
  options?: string[];
  correctAnswer?: string;
  correctAnswers?: boolean[];
  detailAnswer?: string;
}

export interface Chapter {
  name: string;
  lessons: Lesson[];
}

export interface FormDataCourse {
  course_id?: string;
  courseName: string;
  courseDescription?: string;
  chapters: Chapter[];
  author: string;
  price: string;
  thumbnail?: string;
  subject: string;
}