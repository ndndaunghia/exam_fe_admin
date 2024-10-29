import React, { Fragment, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { RootState } from '../../app/store';
import { Course } from '../../services/course/course.type';
import { getCoursesAsync } from '../../services/course/courseSlice';
import {
  getModulesAsync,
  updateModuleAsync,
  upsertModuleAsync,
} from '../../services/module/moduleSlice';
import { FiPlus, FiMinus, FiVideo } from 'react-icons/fi';
import { BsClock, BsPersonVideo3 } from 'react-icons/bs';
import EditIcon from '../../icons/EditIcon';
import DeleteIcon from '../../icons/DeleteIcon';
import { Dialog, Transition } from '@headlessui/react';
import { ModuleRequest } from '../../services/module/module.type';
import { COURSE_CONSTANTS } from '../../constants/Course';
import { Toaster } from 'react-hot-toast';

const initialModuleState: ModuleRequest = {
  course_id: null,
  name: '',
  order: null,
  status: null,
};

export const CourseDetail = () => {
  const { id } = useParams();
  const dispatch = useAppDispatch();
  const [isOpen, setIsOpen] = useState(false);
  const [course, setCourse] = useState<Course | null>(null);
  const [expandedChapters, setExpandedChapters] = useState<number[]>([]);
  const [editingModuleId, setEditingModuleId] = useState<number | null>(null);
  const [formModule, setFormModule] =
    useState<ModuleRequest>(initialModuleState);
  const [isEdit, setIsEdit] = useState(false);
  const { courses } = useAppSelector((state: RootState) => state.course);
  const { modules, loading: loadingModules } = useAppSelector(
    (state: RootState) => state.module,
  );
  const token = localStorage.getItem('token') || '';

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
      dispatch(getModulesAsync({ page: 1, limit: 10, token }));
    }
  }, [dispatch, id, token]);

  const openModal = (isEditMode: boolean = false) => {
    setIsEdit(isEditMode);
    if (!isEditMode) {
      setFormModule({
        ...initialModuleState,
        course_id: course?.id || null,
      });
    }
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setFormModule(initialModuleState);
    setIsEdit(false);
  };

  const handleAddLesson = (moduleId: number) => {};

  const handleAddQuestion = (moduleId: number) => {};

  const handleEditModule = (moduleId: number) => {
    const moduleToEdit = modules.find((m) => m.id === moduleId);
    if (moduleToEdit) {
      setFormModule({
        course_id: moduleToEdit.course_id,
        name: moduleToEdit.name,
        order: moduleToEdit.order,
        status: moduleToEdit.status,
      });
      setIsEdit(true);
      setIsOpen(true);
      setEditingModuleId(moduleId);
    }
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    const formattedData: ModuleRequest = {
      course_id: formModule.course_id,
      name: formModule.name,
      order: formModule.order,
      status: formModule.status,
    };

    try {
      if (isEdit && editingModuleId) {
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
      }
      closeModal();
      // Refresh modules list
      dispatch(getModulesAsync({ page: 1, limit: 10, token }));
    } catch (error) {
      console.error('Error submitting module:', error);
    }
  };

  const handleInputChange = (
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
        // await dispatch(deleteModuleAsync({ moduleId, token }));
        // Refresh modules list
        dispatch(getModulesAsync({ page: 1, limit: 10, token }));
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
      <Breadcrumb pageName={`Course Detail - ${course.name}`} />
      <div className="md:px-4 lg:px-8 xl:px-14 2xl:px-22 mt-12">
        {/* Course Content Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-2 px-2">
            <h3 className="text-2xl font-semibold text-black dark:text-white">
              {course.name}
            </h3>
            <p className="text-gray-600 my-4 dark:text-white">
              {course.description}
            </p>

            {/* Modules Header */}
            <div className="mt-10">
              <h4 className="text-xl font-semibold dark:text-white">
                Nội dung khóa học
              </h4>
              <div className="flex justify-between my-2 dark:text-white">
                <ul className="flex gap-2">
                  <li className="hidden lg:block">
                    <strong>{modules.length}</strong> chương
                  </li>
                  <li className="hidden lg:block">|</li>
                  <li>
                    <strong>{course.duration}</strong> bài học
                  </li>
                  <li className="hidden md:block">|</li>
                  <li className="hidden md:block">
                    Thời lượng <strong>{course.duration}</strong>
                  </li>
                </ul>
                <div>
                  <span
                    className="text-primary font-bold cursor-pointer"
                    onClick={toggleAllChapters}
                  >
                    {expandedChapters.length === modules.length
                      ? 'Thu gọn tất cả'
                      : 'Mở rộng tất cả'}
                  </span>
                </div>
              </div>
            </div>

            {/* Modules List */}
            <div className="mt-10 flex flex-col gap-4">
              {loadingModules ? (
                <div>Loading modules...</div>
              ) : (
                modules.map((module) => (
                  <div key={module.id}>
                    <div
                      onClick={() => toggleChapter(module.id)}
                      className="flex justify-between items-center cursor-pointer bg-orange-200 p-4 rounded-md"
                    >
                      <span>{module.name}</span>
                      <div className="flex items-center gap-2">
                        <EditIcon onClick={() => handleEditModule(module.id)} />
                        <DeleteIcon
                          onClick={() => handleDeleteModule(module.id)}
                        />
                        {expandedChapters.includes(module.id) ? (
                          <FiMinus />
                        ) : (
                          <FiPlus />
                        )}
                      </div>
                    </div>
                    {expandedChapters.includes(module.id) && (
                      <div className="ml-6 mt-2 flex gap-4">
                        <button
                          onClick={() => handleAddLesson(module.id)}
                          className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600"
                        >
                          Thêm bài giảng
                        </button>
                        <button
                          onClick={() => handleAddQuestion(module.id)}
                          className="bg-purple-500 text-white px-3 py-1 rounded-md hover:bg-purple-600"
                        >
                          Thêm câu hỏi
                        </button>
                      </div>
                    )}
                  </div>
                ))
              )}
              {/* Add Chapter Button */}
              <button
                className="mt-6 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-700"
                onClick={() => openModal(false)}
              >
                Thêm Chương
              </button>
            </div>
          </div>

          {/* Course Summary and Image */}
          <div className="md:col-span-1 px-2 flex justify-center dark:text-white">
            <div className="">
              <div className="rounded-xl">
                <img
                  src={
                    course.thumbnail_url || 'https://via.placeholder.com/150'
                  }
                  alt="Course Thumbnail"
                  className="w-full h-full object-cover hover:opacity-80 rounded-xl"
                />
              </div>
              <div className="flex flex-col items-center justify-center">
                <h4 className="text-primary-light my-4">{course.price}đ</h4>
                <button className="bg-secondary-light text-white px-6 py-3 rounded-md hover:bg-secondary">
                  MUA NGAY
                </button>
                <ul className="my-10 hidden md:flex md:flex-col md:justify-start md:items-start">
                  <li className="flex justify-center items-center gap-2 my-2">
                    <FiVideo />
                    {course.duration || 0} bài học
                  </li>
                  <li className="flex justify-center items-center gap-2 my-2">
                    <BsClock />
                    Thời lượng {course.duration}
                  </li>
                  <li className="flex justify-center items-center gap-2 my-2">
                    <BsPersonVideo3 />
                    Học mọi lúc mọi nơi
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Module Form Modal */}
      <Transition appear show={isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeModal}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black bg-opacity-25" />
          </Transition.Child>

          <div className="fixed inset-0 overflow-y-auto">
            <div className="flex min-h-full items-center justify-center p-4 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 scale-95"
                enterTo="opacity-100 scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 scale-100"
                leaveTo="opacity-0 scale-95"
              >
                <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-semibold leading-6 text-gray-900 text-center"
                  >
                    {isEdit ? 'Cập nhật chương' : 'Thêm chương mới'}
                  </Dialog.Title>

                  <form onSubmit={handleSubmit} className="mt-4">
                    {/* Course ID - Read only */}
                    <div className="mb-4">
                      <label
                        htmlFor="course_id"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Mã khóa học
                      </label>
                      <input
                        type="text"
                        name="course_id"
                        id="course_id"
                        value={formModule.course_id || ''}
                        className="mt-1 block w-full rounded-md border-gray-700 border-[1px] bg-gray-100 px-2 py-2"
                        disabled
                      />
                    </div>

                    {/* Module Name */}
                    <div className="mb-4">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Tên chương
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formModule.name}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-700 border-[1px] shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2"
                        required
                      />
                    </div>

                    {/* Order */}
                    <div className="mb-4">
                      <label
                        htmlFor="order"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Thứ tự
                      </label>
                      <input
                        type="number"
                        name="order"
                        id="order"
                        value={formModule.order || ''}
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-700 border-[1px] shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2"
                        min="1"
                        required
                      />
                    </div>

                    {/* Status */}
                    <div className="mb-4">
                      <label
                        htmlFor="status"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Trạng thái
                      </label>
                      <select
                        name="status"
                        id="status"
                        value={
                          formModule.status !== null
                            ? formModule.status.toString()
                            : ''
                        }
                        onChange={handleInputChange}
                        className="mt-1 block w-full rounded-md border-gray-700 border-[1px] shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2"
                        required
                      >
                        <option value="">Chọn trạng thái</option>
                        <option value="1">1</option>
                        <option value="0">0</option>
                      </select>
                    </div>
                    <div className="flex justify-between">
                      <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded-md"
                      >
                        {isEdit
                          ? COURSE_CONSTANTS.COURSE_UPDATE
                          : COURSE_CONSTANTS.COURSE_ADD}
                      </button>
                      <button
                        type="button"
                        className="bg-red-500 text-white px-4 py-2 rounded-md"
                        onClick={closeModal}
                      >
                        Hủy
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};
