import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { RootState } from '../../app/store';
import { Course } from '../../services/course/course.type';
import {
  getCourseDetailAsync,
  getCoursesAsync,
} from '../../services/course/courseSlice';
import {
  deleteModuleAsync,
  getModuleDetailAsync,
  getModulesAsync,
  updateModuleAsync,
  upsertModuleAsync,
} from '../../services/module/moduleSlice';

import ModulesList from './ModuleList';
import CourseSummary from './CourseSummary';
import ModuleFormModal from './ModuleFormModal';
import { ModuleRequest } from '../../services/module/module.type';
import toast, { Toaster } from 'react-hot-toast';
import LessonFormModal from './LessonFormModal';
import { LessonRequest } from '../../services/lesson/lesson.type';
import {
  deleteLessonAsync,
  getLessonsAsync,
  updateLessonAsync,
  upsertLessonAsync,
} from '../../services/lesson/lessonSlice';
import { QuestionRequest } from '../../services/question/question.type';
import {
  deleteQuestionAsync,
  getQuestionsAsync,
  updateQuestionAsync,
  upsertQuestionAsync,
} from '../../services/question/questionSlice';
import QuestionFormModal from './QuestionFormModal';
import { getModuleDetail } from '../../services/module/moduleApi';
import { useCloudinaryUpload } from '../../hooks/useCloudinaryUpload';

const initialModuleState: ModuleRequest = {
  course_id: null,
  name: '',
  order: null,
  status: null,
};

const initialLessonState: LessonRequest = {
  module_id: null,
  name: '',
  video_url: null,
  description: null,
  duration: null,
  order: null,
  status: null,
};

const initialQuestionState: QuestionRequest = {
  lesson_id: null,
  name: '',
  description: null,
  image_url: null,
  status: null,
  difficulty: null,
  options: [],
};

export const CourseDetail = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const token = localStorage.getItem('token') || '';

  const { courses, courseDetail, loading } = useAppSelector(
    (state: RootState) => state.course,
  );

  const { uploadImage, isUploading, error } = useCloudinaryUpload({
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESENT_NAME,
  });

  const [imagePreview, setImagePreview] = useState<string | null>('');

  const [isModuleOpen, setIsModuleOpen] = useState(false);
  const [isEditModule, setIsEditModule] = useState(false);
  const [editingModuleId, setEditingModuleId] = useState<number | null>(null);
  const [formModule, setFormModule] =
    useState<ModuleRequest>(initialModuleState);

  const [isLessonOpen, setIsLessonOpen] = useState(false);
  const [isEditLesson, setIsEditLesson] = useState(false);
  const [editingLessonId, setEditingLessonId] = useState<number | null>(null);
  const [formLesson, setFormLesson] =
    useState<LessonRequest>(initialLessonState);

  const [isQuestionOpen, setIsQuestionOpen] = useState(false);
  const [isEditQuestion, setIsEditQuestion] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(
    null,
  );
  const [formQuestion, setFormQuestion] = useState<QuestionRequest>({
    ...initialQuestionState,
  });

  const [course, setCourse] = useState<Course | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<number[]>([]);

  useEffect(() => {
    if (!courses.length) {
      dispatch(getCoursesAsync({ page: 1, limit: 10, token }));
    }
  }, [dispatch, courses.length, token]);

  useEffect(() => {
    if (courses.length && id) {
      const foundCourse = courses.find((c) => c.id === parseInt(id));
      setCourse(foundCourse || null);
      // Set course_id in formModule when course is found
      setFormModule((prev) => ({
        ...prev,
        course_id: foundCourse?.id || null,
      }));
    }
  }, [courses, id]);

  useEffect(() => {
    if (id) {
      // dispatch(getModulesAsync({ page: 1, limit: 10, token }));
      // dispatch(getLessonsAsync({ page: 1, limit: 10, token }));
      // dispatch(getQuestionsAsync({ page: 1, limit: 10, token }));
      dispatch(getCourseDetailAsync({ id: parseInt(id), token }));
    }
  }, [dispatch, id, token]);

  console.log(courseDetail?.data.course);

  // Question
  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file)); // Đặt preview tạm thời

    try {
      const imageUrl = await uploadImage(file); // Chờ upload hoàn tất
      if (imageUrl) {
        setFormQuestion((prev) => ({ ...prev, image_url: imageUrl })); // Đặt image_url sau khi upload thành công
      }
    } catch {
      toast.error('Failed to upload image');
      setImagePreview(null); // Xóa preview nếu upload thất bại
    }
  };

  // const openQuestionModal = (isEditQuestionMode: boolean = false) => {
  //   setIsEditQuestion(isEditQuestionMode);
  //   if (!isEditQuestionMode) {
  //     setFormQuestion({
  //       ...initialQuestionState,
  //       lesson_id: lessons[0]?.id || null,
  //       options: [
  //         { content: '', explanation: '', is_correct: 0 },
  //         { content: '', explanation: '', is_correct: 0 },
  //         { content: '', explanation: '', is_correct: 0 },
  //         { content: '', explanation: '', is_correct: 0 },
  //       ],
  //     });
  //   }
  //   setIsQuestionOpen(true);
  // };

  const closeQuestionModal = () => {
    setIsQuestionOpen(false);
    setFormQuestion(initialQuestionState);
    setIsEditQuestion(false);
  };

  const handleAddQuestion = (lessonId: number) => {
    setFormQuestion({
      ...initialQuestionState,
      lesson_id: lessonId,
      options: [
        { content: '', explanation: '', is_correct: 0 },
        { content: '', explanation: '', is_correct: 0 },
        { content: '', explanation: '', is_correct: 0 },
        { content: '', explanation: '', is_correct: 0 },
      ],
    });
    setIsQuestionOpen(true); // Mở modal
  };

  const handleEditQuestion = (questionId: number) => {
    const questionToEdit = courseDetail?.data?.course?.module
      ?.flatMap((module) => module.lesson || [])
      ?.flatMap((lesson) => lesson.question || [])
      ?.find((q) => q.id === questionId);

    console.log('questionToEdit', questionToEdit);

    if (questionToEdit) {
      setFormQuestion({
        lesson_id: questionToEdit.lesson_id,
        name: questionToEdit.name,
        description: questionToEdit.description,
        image_url: questionToEdit.image_url,
        status: questionToEdit.status,
        difficulty: questionToEdit.difficulty,
        options: questionToEdit.options,
      });
      setIsEditQuestion(true);
      setIsQuestionOpen(true);
      setEditingQuestionId(questionId);
    }
  };

  const handleSubmitQuestion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formattedData: QuestionRequest = {
      lesson_id: formQuestion.lesson_id,
      name: formQuestion.name,
      description: formQuestion.description,
      image_url: formQuestion.image_url,
      status: formQuestion.status,
      difficulty: formQuestion.difficulty,
      options: formQuestion.options,
    };

    console.log('Submitting question:', formattedData);
    try {
      if (isEditQuestion && editingQuestionId) {
        // Call your update API here
        await dispatch(
          updateQuestionAsync({
            data: formattedData,
            token,
            id: editingQuestionId,
          }),
        );
      } else {
        await dispatch(upsertQuestionAsync({ data: formattedData, token }));
      }
      closeQuestionModal();
      // Refresh questions list
      dispatch(getQuestionsAsync({ page: 1, limit: 10, token }));
      if (id) {
        await dispatch(getCourseDetailAsync({ id: parseInt(id), token }));
      }
    } catch (error) {
      console.error('Error submitting question:', error);
    }
    finally {
      dispatch(getQuestionsAsync({ page: 1, limit: 10, token }));
    }
  };

  const handleInputQuestionChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormQuestion((prev) => ({
      ...prev,
      [name]:
        name === 'difficulty' || name === 'status'
          ? value === ''
            ? null
            : parseInt(value)
          : value,
    }));
  };

  const handleDeleteQuestion = async (questionId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa câu hỏi này?')) {
      try {
        // Call your delete API here
        console.log('Deleting question:', questionId);
        await dispatch(deleteQuestionAsync({ id: questionId, token }));
        dispatch(getQuestionsAsync({ page: 1, limit: 10, token }));
        if (id) {
          await dispatch(getCourseDetailAsync({ id: parseInt(id), token }));
        }
      } catch (error) {
        console.error('Error deleting question:', error);
      }
    }
  };
  const handleOptionChange = (index: number, field: string, value: any) => {
    setFormQuestion((prev) => ({
      ...prev,
      options: prev.options.map((option, i) =>
        i === index ? { ...option, [field]: value } : option,
      ),
    }));
  };

  // Lesson
  // const openLessonModal = (isEditLessonMode: boolean = false) => {
  //   setIsEditLesson(isEditLessonMode);
  //   if (!isEditLessonMode) {
  //     setFormLesson({
  //       ...initialLessonState,
  //       module_id: modules[0]?.id || null,
  //     });
  //   }
  //   setIsLessonOpen(true);
  // };

  const closeLessonModal = () => {
    setIsLessonOpen(false);
    setFormLesson(initialLessonState);
    setIsEditLesson(false);
  };

  const handleAddLesson = (moduleId: number) => {
    setFormLesson({
      ...initialLessonState,
      module_id: moduleId,
    });
    setIsLessonOpen(true);
  };

  const handleEditLesson = (lessonId: number) => {
    const lessonToEdit = courseDetail?.data?.course?.module
      ?.flatMap((module) => module.lesson)
      .find((l) => l.id === lessonId);

    if (lessonToEdit) {
      setFormLesson({
        module_id: lessonToEdit.module_id,
        name: lessonToEdit.name,
        video_url: lessonToEdit.video_url,
        description: lessonToEdit.description,
        duration: lessonToEdit.duration,
        order: lessonToEdit.order,
        status: lessonToEdit.status,
      });
      setIsEditLesson(true);
      setIsLessonOpen(true);
      setEditingLessonId(lessonId);
    }
  };

  const handleSubmitLesson = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formattedData: LessonRequest = {
      module_id: formLesson.module_id,
      name: formLesson.name,
      video_url: formLesson.video_url,
      description: formLesson.description,
      duration: formLesson.duration,
      order: formLesson.order,
      status: formLesson.status,
    };

    try {
      if (isEditLesson && editingLessonId) {
        // Call your update API here
        await dispatch(
          updateLessonAsync({
            data: formattedData,
            token,
            id: editingLessonId,
          }),
        );
      } else {
        await dispatch(upsertLessonAsync({ data: formattedData, token }));
      }
      closeLessonModal();
      // Refresh lessons list
      dispatch(getLessonsAsync({ page: 1, limit: 10, token }));
      if (id) {
        await dispatch(getCourseDetailAsync({ id: parseInt(id), token }));
      }
    } catch (error) {
      console.error('Error submitting lesson:', error);
    }
  };

  const handleInputLessonChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormLesson((prev) => ({
      ...prev,
      [name]:
        name === 'order' || name === 'status'
          ? value === ''
            ? null
            : parseInt(value)
          : value,
    }));
  };

  const handleDeleteLesson = async (lessonId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa bài giảng này?')) {
      try {
        // Call your delete API here
        console.log('Deleting lesson:', lessonId);
        await dispatch(deleteLessonAsync({ id: lessonId, token }));
        dispatch(getLessonsAsync({ page: 1, limit: 10, token }));
        if (id) {
          await dispatch(getCourseDetailAsync({ id: parseInt(id), token }));
        }
      } catch (error) {
        console.error('Error deleting lesson:', error);
      }
    }
  };

  // Module
  const openModuleModal = (isEditModuleMode: boolean = false) => {
    setIsEditModule(isEditModuleMode);
    if (!isEditModuleMode) {
      setFormModule({
        ...initialModuleState,
        course_id: course?.id || null,
      });
    }
    setIsModuleOpen(true);
  };

  const closeModuleModal = () => {
    setIsModuleOpen(false);
    setFormModule(initialModuleState);
    setIsEditModule(false);
  };

  // const handleAddLesson = (moduleId: number) => {};

  // const handleAddQuestion = (moduleId: number) => {};

  const handleEditModule = (moduleId: number) => {
    const moduleToEdit = courseDetail?.data?.course?.module?.find(
      (m) => m.id === moduleId,
    );

    if (moduleToEdit) {
      setFormModule({
        course_id: moduleToEdit.course_id,
        name: moduleToEdit.name,
        order: moduleToEdit.order,
        status: moduleToEdit.status,
      });
      setIsEditModule(true);
      setIsModuleOpen(true);
      setEditingModuleId(moduleId);
    }
  };

  const handleSubmitModule = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formattedData: ModuleRequest = {
      course_id: formModule.course_id,
      name: formModule.name,
      order: formModule.order,
      status: formModule.status,
    };

    try {
      if (isEditModule && editingModuleId) {
        // Call your update API here
        await dispatch(
          updateModuleAsync({
            data: formattedData,
            token,
            id: editingModuleId,
          }),
        );
      } else {
        await dispatch(upsertModuleAsync({ data: formattedData, token }));
        if (id) {
          await dispatch(getCourseDetailAsync({ id: parseInt(id), token }));
        }
      }
      closeModuleModal();
      // Refresh modules list
      dispatch(getModulesAsync({ page: 1, limit: 10, token }));
    } catch (error) {
      console.error('Error submitting module:', error);
    }
  };

  const handleInputModuleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = e.target;
    setFormModule((prev) => ({
      ...prev,
      [name]:
        name === 'order' || name === 'status'
          ? value === ''
            ? null
            : parseInt(value)
          : value,
    }));
  };

  const toggleChapter = (chapterId: number) => {
    setExpandedChapters((prev) =>
      prev.includes(chapterId)
        ? prev.filter((id) => id !== chapterId)
        : [...prev, chapterId],
    );
  };

  const toggleAllChapters = () => {
    const modules = courseDetail?.data?.course?.module || [];
    setExpandedChapters(
      expandedChapters.length === modules.length
        ? []
        : modules.map((ch) => ch.id),
    );
  };

  const handleDeleteModule = async (moduleId: number) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa chương này?')) {
      try {
        // Call your delete API here
        console.log('Deleting module:', moduleId);
        await dispatch(deleteModuleAsync({ id: moduleId, token }));
        dispatch(getModulesAsync({ page: 1, limit: 10, token }));
        if (id) {
          await dispatch(getCourseDetailAsync({ id: parseInt(id), token }));
        }
      } catch (error) {
        console.error('Error deleting module:', error);
      }
    }
  };

  if (!course) {
    return <div className="p-4">Loading...</div>;
  }

  return (
    <>
      <Breadcrumb
        pageName={`Course Detail - ${course?.name || 'Loading...'}`}
      />
      <div className="md:px-4 lg:px-8 xl:px-14 2xl:px-22 mt-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 px-2">
            <h3 className="text-2xl font-semibold text-black dark:text-white">
              {course?.name}
            </h3>
            <p className="text-gray-600 my-4 dark:text-white">
              {course?.description}
            </p>
            <ModulesList
              modules={courseDetail?.data?.course?.module || []}
              lessons={
                courseDetail?.data?.course?.module
                  .map((m) => m.lesson)
                  .flat() || []
              }
              questions={
                courseDetail?.data?.course?.module.reduce((acc, module) => {
                  return acc.concat(
                    module.lesson.reduce((lessonAcc, lesson) => {
                      return lessonAcc.concat(lesson.question || []);
                    }, []),
                  );
                }, []) || []
              }
              loading={loading}
              toggleAllChapters={toggleAllChapters}
              expandedChapters={expandedChapters}
              toggleChapter={toggleChapter}
              handleEditModule={handleEditModule}
              handleDeleteModule={handleDeleteModule}
              handleAddLesson={handleAddLesson}
              handleEditLesson={handleEditLesson}
              handleDeleteLesson={handleDeleteLesson}
              handleAddQuestion={handleAddQuestion}
              handleEditQuestion={handleEditQuestion}
              handleDeleteQuestion={handleDeleteQuestion}
            />
            <button
              className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
              onClick={() => openModuleModal(false)}
            >
              Thêm Chương
            </button>
          </div>
          <CourseSummary course={course!} />
        </div>
      </div>
      <ModuleFormModal
        isModuleOpen={isModuleOpen}
        isEditModule={isEditModule}
        formModule={formModule}
        onClose={closeModuleModal}
        handleSubmitModule={handleSubmitModule}
        handleInputModuleChange={handleInputModuleChange}
        closeModuleModal={closeModuleModal}
      />
      <LessonFormModal
        isLessonOpen={isLessonOpen}
        isLessonEdit={isEditLesson}
        formLesson={formLesson}
        onClose={closeLessonModal}
        closeLessonModle={closeLessonModal}
        handleSubmitLesson={handleSubmitLesson}
        handleInputLessonChange={handleInputLessonChange}
      />

      <QuestionFormModal
        imagePreview={imagePreview}
        isUploading={isUploading}
        error={error}
        handleOptionChange={handleOptionChange}
        handleImageChange={handleImageChange}
        isQuestionOpen={isQuestionOpen}
        isQuestionEdit={isEditQuestion}
        formQuestion={formQuestion}
        onClose={closeQuestionModal}
        closeQuestionModle={closeQuestionModal}
        handleSubmitQuestion={handleSubmitQuestion}
        handleInputQuestionChange={handleInputQuestionChange}
      />

      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};
