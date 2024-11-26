import React, { Fragment, useCallback, useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import EditIcon from '../../icons/EditIcon';
import DeleteIcon from '../../icons/DeleteIcon';
import toast, { Toaster } from 'react-hot-toast';
import {
  deleteCourseAsync,
  getCoursesAsync,
  updateCourseAsync,
  upsertCourseAsync,
} from '../../services/course/courseSlice';
import { RootState } from '../../app/store';
import { Dialog, Transition } from '@headlessui/react';
import { COURSE_CONSTANTS } from '../../constants/Course';
import { Course, CourseRequest } from '../../services/course/course.type';
import { getAuthorsAsync } from '../../services/author/authorSlice';
import { getSubjectsAsync } from '../../services/subject/subjectSlice';
import { useCloudinaryUpload } from '../../hooks/useCloudinaryUpload';
import { Author } from '../../services/author/author.type';
import { Subject } from '../../services/subject/subject.type';
import { Link } from 'react-router-dom';

const initialFormData: CourseRequest = {
  subject_id: null,
  author_id: null,
  name: '',
  thumbnail_url: null,
  description: null,
  price: null,
  duration: null,
  status: null,
};

const TableCourses: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formDataCourse, setFormDataCourse] =
    useState<CourseRequest>(initialFormData);
  const [isEdit, setIsEdit] = useState(false);
  const [editingCourseId, setEditingCourseId] = useState<number | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [confirmDelete, setConfirmDelete] = useState<Course | null>(null); // Dùng để xác nhận xoá

  const dispatch = useAppDispatch();
  const { courses, loading } = useAppSelector(
    (state: RootState) => state.course,
  );
  const { authors } = useAppSelector((state: RootState) => state.author);
  const { subjects } = useAppSelector((state: RootState) => state.subject);

  const { uploadImage, isUploading, error } = useCloudinaryUpload({
    cloudName: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME,
    uploadPreset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESENT_NAME,
  });

  const token = localStorage.getItem('token') || '';

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImagePreview(URL.createObjectURL(file));
    try {
      const imageUrl = await uploadImage(file);
      setFormDataCourse((prev) => ({ ...prev, thumbnail_url: imageUrl }));
    } catch {
      toast.error('Failed to upload image');
      setImagePreview(null);
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setIsEdit(false);
    setFormDataCourse(initialFormData);
    setEditingCourseId(null);
    setImagePreview(null);
  };

  const handleFormAction = async (
    action: 'edit' | 'add' | 'delete',
    course?: Course,
    e: React.FormEvent,
  ) => {
    e.preventDefault();
    try {
      if (action === 'edit' && editingCourseId !== null) {
        await dispatch(
          updateCourseAsync({
            id: editingCourseId,
            data: formDataCourse,
            token,
          }),
        ).unwrap();
        toast.success(COURSE_CONSTANTS.COURSE_UPDATE_SUCCESS);
      } else if (action === 'add') {
        await dispatch(
          upsertCourseAsync({ data: formDataCourse, token }),
        ).unwrap();
        toast.success(COURSE_CONSTANTS.COURSE_ADD_SUCCESS);
      } else if (action === 'delete' && course) {
        await dispatch(deleteCourseAsync({ id: course.id, token })).unwrap();
        toast.success(COURSE_CONSTANTS.COURSE_DELETE_SUCCESS);
      }
      fetchAllCourses();
    } catch (error) {
      toast.error(
        action === 'delete'
          ? COURSE_CONSTANTS.COURSE_DELETE_FAIL
          : COURSE_CONSTANTS.COURSE_ADD_FAIL,
      );
      console.error(`Action ${action} failed`, error);
    }
    closeModal();
  };

  const fetchAllCourses = useCallback(() => {
    if (token) dispatch(getCoursesAsync({ page: 1, limit: 10, token }));
  }, [dispatch, token]);

  const getAuthorName = useCallback(
    (authorId: number | null) => {
      if (!authorId || !authors.length) return 'N/A';
      const author = authors.find((a) => a.id === Number(authorId));
      return author ? author.name : 'N/A';
    },
    [authors],
  );

  const getSubjectName = useCallback(
    (subjectId: number | null) => {
      if (!subjectId || !subjects.length) return 'N/A';
      const subject = subjects.find((s) => s.id === Number(subjectId));
      return subject ? subject.name : 'N/A';
    },
    [subjects],
  );

  useEffect(() => {
    if (token) {
      dispatch(getAuthorsAsync({ page: 1, limit: 100, token }));
      dispatch(getSubjectsAsync({ page: 1, limit: 100, token }));
    }
  }, [dispatch, token]);

  useEffect(() => {
    if (!courses || courses.length === 0) fetchAllCourses();
  }, [fetchAllCourses, courses]);

  return (
    <>
      <Breadcrumb pageName="Table Courses" />
      <div className="flex flex-col gap-10">
        {loading ? (
          <div className="text-center p-10">Đang tải dữ liệu...</div>
        ) : (
          <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
            <div className="py-6 px-4 md:px-6 xl:px-7.5">
              <h4 className="text-xl font-semibold text-black dark:text-white">
                Top Products
              </h4>
            </div>
            <div className="grid grid-cols-9 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
              <div className="col-span-1 flex items-center">
                <p className="font-medium">ID</p>
              </div>
              <div className="col-span-1 flex items-center">
                <p className="font-medium">Hình ảnh</p>
              </div>
              <div className="col-span-2 hidden items-center sm:flex">
                <p className="font-medium">Tên khóa học</p>
              </div>
              <div className="col-span-1 flex items-center">
                <p className="font-medium">Môn học</p>
              </div>
              <div className="col-span-1 flex items-center">
                <p className="font-medium">Tác giả</p>
              </div>
              <div className="col-span-1 flex items-center">
                <p className="font-medium">Giá</p>
              </div>
              <div className="col-span-1 flex items-center">
                <p className="font-medium">Hành động</p>
              </div>
            </div>
            {courses.map((course) => (
              <CourseRow
                key={course.id}
                course={course}
                onEdit={() => {
                  setIsEdit(true);
                  setIsOpen(true);
                  setFormDataCourse({
                    subject_id: course.subject_id,
                    author_id: course.author_id,
                    name: course.name,
                    thumbnail_url: course.thumbnail_url || '',
                    description: course.description || '',
                    price: course.price,
                    duration: course.duration,
                    status: course.status,
                  });
                  setEditingCourseId(course.id);
                }}
                onDelete={() => setConfirmDelete(course)} // Xác nhận xoá
                getAuthorName={getAuthorName}
                getSubjectName={getSubjectName}
              />
            ))}
          </div>
        )}
      </div>
      <button
        className="fixed bottom-5 right-10 bg-green-400 rounded-full hover:bg-green-700 p-4"
        onClick={() => setIsOpen(true)}
      >
        <svg
          viewBox="0 0 580 1000"
          fill="currentColor"
          height="1.5rem"
          width="1.5rem"
          color="white"
        >
          <path d="M550 450c20 0 30 16.667 30 50s-10 50-30 50H340v210c0 20-16.667 30-50 30s-50-10-50-30V550H30c-20 0-30-16.667-30-50s10-50 30-50h210V240c0-20 16.667-30 50-30s50 10 50 30v210h210" />
        </svg>
      </button>
      <CourseModal
        isOpen={isOpen}
        onClose={closeModal}
        onSubmit={(e: any) =>
          handleFormAction(isEdit ? 'edit' : 'add', undefined, e)
        }
        formData={formDataCourse}
        setFormData={setFormDataCourse}
        isEdit={isEdit}
        imagePreview={imagePreview}
        handleImageChange={handleImageChange}
        isUploading={isUploading}
        error={error}
        authors={authors}
        subjects={subjects}
      />
      <DeleteConfirmationDialog
        isOpen={!!confirmDelete}
        onClose={() => setConfirmDelete(null)}
        onConfirm={(e: any) => {
          if (confirmDelete) handleFormAction('delete', confirmDelete, e);
          setConfirmDelete(null);
        }}
        itemName={confirmDelete?.name}
      />
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

const CourseRow = ({
  course,
  onEdit,
  onDelete,
  getAuthorName,
  getSubjectName,
}: any) => (
  <div className="grid grid-cols-9 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
    <div className="col-span-1 flex items-center">
      <p>{course.id}</p>
    </div>
    <div className="col-span-1 flex items-center">
      {course.thumbnail_url && (
        <img
          src={course.thumbnail_url}
          alt="thumbnail"
          className="w-[100px] h-[100px] object-cover rounded-md"
        />
      )}
    </div>
    <div className="col-span-2 hidden items-center sm:flex">
      <Link
        to={`/tables/tables-courses/${course.id}`}
        className="text-sm font-medium text-black dark:text-white hover:text-blue-500 dark:hover:text-blue-400 transition-colors"
      >
        {course.name}
      </Link>
    </div>
    <div className="col-span-1 flex items-center">
      <p className="text-sm font-medium text-black dark:text-white">
        {getSubjectName(course.subject_id)}
      </p>
    </div>
    <div className="col-span-1 flex items-center">
      <p className="text-sm font-medium text-black dark:text-white">
        {getAuthorName(course.author_id)}
      </p>
    </div>
    <div className="col-span-1 flex items-center">
      <p className="text-sm font-medium text-black dark:text-white">
        {Math.floor(course.price)}
      </p>
    </div>
    <div className="col-span-1 hidden items-center sm:flex gap-4">
      <EditIcon onClick={onEdit} />
      <DeleteIcon onClick={onDelete} />
    </div>
  </div>
);

const CourseModal = ({
  isOpen,
  onClose,
  onSubmit,
  formData,
  setFormData,
  isEdit,
  imagePreview,
  handleImageChange,
  isUploading,
  error,
  authors,
  subjects,
}: any) => (
  <Transition appear show={isOpen} as={Fragment}>
    <Dialog as="div" className="relative z-10" onClose={onClose}>
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
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title
                as="h3"
                className="text-lg font-semibold leading-6 text-gray-900 text-center"
              >
                {isEdit
                  ? COURSE_CONSTANTS.COURSE_UPDATE
                  : COURSE_CONSTANTS.COURSE_ADD}
              </Dialog.Title>
              <form onSubmit={onSubmit} className="mt-2 space-y-4">
                {/* Tên khóa học */}
                <div className="mb-4">
                  <label
                    htmlFor="name"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {COURSE_CONSTANTS.COURSE_NAME}
                  </label>
                  <input
                    type="text"
                    name="name"
                    id="name"
                    value={formData.name}
                    onChange={(e) =>
                      setFormData({ ...formData, name: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-700 border-[1px] shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2"
                    required
                  />
                </div>

                {/* Tác giả */}
                <div className="mb-4">
                  <label
                    htmlFor="author_id"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {COURSE_CONSTANTS.COURSE_AUTHOR}
                  </label>
                  <select
                    name="author_id"
                    id="author_id"
                    value={formData.author_id || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        author_id: parseInt(e.target.value),
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-700 border-[1px] shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2"
                    required
                  >
                    <option value="">Chọn tác giả</option>
                    {authors.map((author: Author) => (
                      <option key={author.id} value={author.id}>
                        {author.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Môn học */}
                <div className="mb-4">
                  <label
                    htmlFor="subject_id"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {COURSE_CONSTANTS.COURSE_SUBJECT}
                  </label>
                  <select
                    name="subject_id"
                    id="subject_id"
                    value={formData.subject_id || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        subject_id: parseInt(e.target.value),
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-700 border-[1px] shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2"
                    required
                  >
                    <option value="">Chọn môn học</option>
                    {subjects.map((subject: Subject) => (
                      <option key={subject.id} value={subject.id}>
                        {subject.name}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Ảnh khóa học */}
                <div className="mb-4">
                  <label
                    htmlFor="thumbnail_url"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {COURSE_CONSTANTS.COURSE_IMAGE}
                  </label>
                  {(imagePreview || formData.thumbnail_url) && (
                    <div className="mt-2 mb-2">
                      <img
                        src={imagePreview || formData.thumbnail_url || ''}
                        alt="Preview"
                        className="w-32 h-32 object-cover rounded-md"
                      />
                    </div>
                  )}
                  <div className="mt-1 relative">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageChange}
                      className="mt-1 block w-full rounded-md border-gray-700 border-[1px] shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2"
                    />
                    {isUploading && (
                      <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
                        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                      </div>
                    )}
                  </div>
                  {error && (
                    <p className="mt-1 text-sm text-red-600">{error}</p>
                  )}
                </div>

                {/* Mô tả */}
                <div className="mb-4">
                  <label
                    htmlFor="description"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {COURSE_CONSTANTS.COURSE_DESCRIPTION}
                  </label>
                  <textarea
                    name="description"
                    id="description"
                    value={formData.description || ''}
                    onChange={(e) =>
                      setFormData({ ...formData, description: e.target.value })
                    }
                    className="mt-1 block w-full rounded-md border-gray-700 border-[1px] shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2"
                  />
                </div>

                {/* Giá */}
                <div className="mb-4">
                  <label
                    htmlFor="price"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {COURSE_CONSTANTS.COURSE_PRICE}
                  </label>
                  <input
                    type="number"
                    name="price"
                    id="price"
                    value={
                      formData.price !== null && formData.price !== undefined
                        ? formData.price
                        : ''
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      // Nếu giá trị nhập vào là rỗng thì gán lại giá trị null, nếu không thì chuyển sang số
                      setFormData({
                        ...formData,
                        price: value === '' ? 0 : parseInt(value, 10), // Đảm bảo 0 được xử lý đúng
                      });
                    }}
                    className="mt-1 block w-full rounded-md border-gray-700 border-[1px] shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2"
                    required
                  />
                </div>

                {/* Thời lượng */}
                <div className="mb-4">
                  <label
                    htmlFor="duration"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {COURSE_CONSTANTS.COURSE_DURATION}
                  </label>
                  <input
                    type="text"
                    name="duration"
                    id="duration"
                    value={formData.duration || ''}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        duration: parseInt(e.target.value),
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-700 border-[1px] shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2"
                    required
                  />
                </div>

                {/* Trạng thái */}
                <div className="mb-4">
                  <label
                    htmlFor="status"
                    className="block text-sm font-medium text-gray-700"
                  >
                    {COURSE_CONSTANTS.COURSE_STATUS}
                  </label>
                  <select
                    name="status"
                    id="status"
                    value={
                      formData.status !== null ? formData.status.toString() : ''
                    }
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        status: parseInt(e.target.value),
                      })
                    }
                    className="mt-1 block w-full rounded-md border-gray-700 border-[1px] shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2"
                    required
                  >
                    <option value="">Chọn trạng thái</option>
                    <option value="0">0</option>
                    <option value="1">1</option>
                  </select>
                </div>

                {/* Nút hành động */}
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
                    onClick={onClose}
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
);

const DeleteConfirmationDialog = ({
  isOpen,
  onClose,
  onConfirm,
  itemName,
}: any) => (
  <Transition appear show={isOpen} as={Fragment}>
    <Dialog as="div" className="relative z-10" onClose={onClose}>
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
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100 scale-100"
            leaveTo="opacity-0 scale-95"
          >
            <Dialog.Panel className="w-full max-w-md transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
              <Dialog.Title
                as="h3"
                className="text-lg font-semibold leading-6 text-gray-900 text-center"
              >
                Xác nhận xóa
              </Dialog.Title>
              <div className="mt-4">
                <p className="text-sm text-gray-500">
                  Bạn có chắc chắn muốn xóa khóa học "{itemName}"?
                </p>
              </div>
              <div className="mt-6 flex justify-end gap-2">
                <button
                  onClick={onClose}
                  className="bg-gray-200 px-4 py-2 rounded-md"
                >
                  Hủy
                </button>
                <button
                  onClick={onConfirm}
                  className="bg-red-500 text-white px-4 py-2 rounded-md"
                >
                  Xóa
                </button>
              </div>
            </Dialog.Panel>
          </Transition.Child>
        </div>
      </div>
    </Dialog>
  </Transition>
);

export default TableCourses;
