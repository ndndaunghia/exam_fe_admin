import React, { useEffect, useState } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import AddCourseModal from './AddCourseModal';
import { FormDataCourse } from './type';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import {
  addNewCourse,
  deleteCourseById,
  fetchAllCourses,
  getCourseById,
} from '../../services/course/courseSlice';
import EditIcon from '../../icons/EditIcon';
import DeleteIcon from '../../icons/DeleteIcon';
import DeleteConfirmationDialog from '../../components/DeleteConfirmationDialog';
import toast, { Toaster } from 'react-hot-toast';

const TableCourses: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [courseData, setCourseData] = useState<any[]>([]);
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [courseToDelete, setCourseToDelete] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const dispatch = useAppDispatch();

  function closeModal() {
    setIsOpen(false);
  }

  function openModal() {
    setIsOpen(true);
  }

  function handleSubmit(formData: FormDataCourse) {
    try {
      dispatch(addNewCourse(formData)).then((action) => {
        if (addNewCourse.fulfilled.match(action)) {
          setCourseData((prevData) => [...prevData, action.payload]);
          closeModal();
          toast.success('Thêm khóa học thành công');
        } else {
          throw new Error('Thêm khóa học thất bại');
        }
      });
    } catch (error) {
      console.error('Thêm khóa học thất bại', error);
      toast.error('Thêm khóa học thất bại. Vui lòng thử lại');
    }
  }

  function handleDelete(id: string) {
    setCourseToDelete(id);
    setIsDeleteDialogOpen(true);
  }

  async function confirmDelete() {
    if (courseToDelete) {
      setIsDeleting(true);
      try {
        const resultAction = await dispatch(deleteCourseById(courseToDelete));
        if (deleteCourseById.fulfilled.match(resultAction)) {
          // Optimistically update the UI
          setCourseData((prevData) =>
            prevData.filter((course) => course.course_id !== courseToDelete),
          );
          toast.success('Xóa khóa học thành công');
        } else {
          throw new Error('Xóa khóa học thất bại');
        }
      } catch (error) {
        console.error('Xóa khóa học thất bại', error);
        toast.error('Xóa khóa học thất bại. Vui lòng thử lại');
      } finally {
        setIsDeleting(false);
        setCourseToDelete(null);
        setIsDeleteDialogOpen(false);
      }
    }
  }

  useEffect(() => {
    dispatch(fetchAllCourses()).then((action) => {
      if (fetchAllCourses.fulfilled.match(action)) {
        setCourseData(action.payload.data);
      }
    });

    dispatch(getCourseById('8')).then((action) => {
      if (getCourseById.fulfilled.match(action)) {
        console.log('getCourseById', action.payload.data);
      }
    });
  }, [dispatch]);

  return (
    <>
      <Breadcrumb pageName="Table Courses" />
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="py-6 px-4 md:px-6 xl:px-7.5">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Top Products
            </h4>
          </div>
          <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
            <div className="col-span-1 flex items-center">
              <p className="font-medium">ID</p>
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
            <div className="col-span-2 flex items-center">
              <p className="font-medium">Hành động</p>
            </div>
          </div>
          {courseData.map((course) => (
            <div
              key={course.course_id}
              className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
            >
              <div className="col-span-1 flex items-center">
                <p>{course.course_id}</p>
              </div>
              <div className="col-span-2 hidden items-center sm:flex">
                <p>{course.course_name}</p>
              </div>
              <div className="col-span-1 flex items-center">
                <p>{course.subject_name || 'N/A'}</p>
              </div>
              <div className="col-span-1 flex items-center">
                <p>{course.author || 'N/A'}</p>
              </div>
              <div className="col-span-1 flex items-center">
                <p>{course.price}</p>
              </div>
              <div className="col-span-2 hidden items-center sm:flex gap-4">
                <EditIcon onClick={() => console.log('Edit')} />
                <DeleteIcon onClick={() => handleDelete(course.course_id)} />
              </div>
            </div>
          ))}
        </div>
      </div>
      <button
        className="absolute bottom-5 right-10 bg-green-400 rounded-full hover:bg-green-700"
        onClick={openModal}
      >
        <svg
          viewBox="0 0 580 1000"
          fill="currentColor"
          height="4rem"
          width="4rem"
          color="white"
        >
          <path d="M550 450c20 0 30 16.667 30 50s-10 50-30 50H340v210c0 20-16.667 30-50 30s-50-10-50-30V550H30c-20 0-30-16.667-30-50s10-50 30-50h210V240c0-20 16.667-30 50-30s50 10 50 30v210h210" />
        </svg>
      </button>
      <AddCourseModal
        isOpen={isOpen}
        closeModal={closeModal}
        onSubmit={handleSubmit}
      />
      <DeleteConfirmationDialog
        isOpen={isDeleteDialogOpen}
        closeModal={() => setIsDeleteDialogOpen(false)}
        onConfirm={confirmDelete}
        itemName="khóa học này"
      />
      <Toaster position="top-center" reverseOrder={false} />
    </>
  );
};

export default TableCourses;
