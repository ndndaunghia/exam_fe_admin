import { Dialog, Transition } from '@headlessui/react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import React, { Fragment, useCallback, useEffect, useState } from 'react';
import EditIcon from '../../icons/EditIcon';
import DeleteIcon from '../../icons/DeleteIcon';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { RootState } from '../../app/store';
import Loader from '../../common/Loader';
import {
  deleteExamAsync,
  getExamsAsync,
  updateExamAsync,
  upsertExamAsync,
} from '../../services/exam/examSlice';
import { Exam, ExamRequest } from '../../services/exam/exam.type';
import { getSubjectsAsync } from '../../services/subject/subjectSlice';
import { COURSE_CONSTANTS } from '../../constants/Course';
import { Subject } from '../../services/subject/subject.type';
import { Link } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';

export const TableExams = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormData] = useState<ExamRequest>({
    subject_id: 0,
    name: '',
    year: new Date().getFullYear(),
    questions: [],
  });
  const [isEdit, setIsEdit] = useState(false);
  const [editingExamId, setEditingExamId] = useState<number | null>(null);
  const [selectedExam, setSelectedExam] = useState<Exam | null>(null);

  const dispatch = useAppDispatch();
  const { exams, loading } = useAppSelector((state: RootState) => state.exam);
  const { subjects } = useAppSelector((state: RootState) => state.subject);
  const token = localStorage.getItem('token') || '';

  const fetchExams = useCallback(() => {
    if (token) {
      dispatch(getExamsAsync({ page: 1, limit: 10, token }));
    }
  }, [dispatch, token]);

  // Handle exam detail view/edit
  const handleViewEdit = async (exam: Exam) => {
    setSelectedExam(exam);
    setIsEdit(true);
    setFormData({
      subject_id: exam.subject_id,
      name: exam.name,
      year: exam.year,
      questions: exam.questions || [],
    });
    setEditingExamId(exam.id);
    setIsOpen(true);
  };

  // Submit form handler
  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (isEdit && editingExamId) {
        await dispatch(
          updateExamAsync({
            id: editingExamId,
            data: formData,
            token,
          }),
        ).unwrap();
      } else {
        await dispatch(
          upsertExamAsync({
            data: formData,
            token,
          }),
        ).unwrap();
      }
      closeModal();
      fetchExams();
    } catch (error) {}
  };

  // Delete handler
  const handleDelete = async (exam: Exam) => {
    if (window.confirm(`Bạn có chắc muốn xóa đề thi "${exam.name}"?`)) {
      try {
        await dispatch(deleteExamAsync({ id: exam.id, token })).unwrap();
        fetchExams();
      } catch (error) {}
    }
  };

  const closeModal = () => {
    setIsOpen(false);
    setIsEdit(false);
    setSelectedExam(null);
    setFormData({
      subject_id: 0,
      name: '',
      year: new Date().getFullYear(),
      questions: [],
    });
  };

  useEffect(() => {
    fetchExams();
    dispatch(getSubjectsAsync({ page: 1, limit: 100, token }));
  }, [fetchExams, dispatch, token]);

  return (
    <>
      <Breadcrumb pageName="Quản lý đề thi" />

      {/* Main table */}
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="p-4 md:p-6 xl:p-7.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Danh sách đề thi
            </h4>
          </div>
        </div>

        <div className="grid grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark">
          <div className="col-span-1 flex items-center">
            <p className="font-medium">ID</p>
          </div>
          <div className="col-span-3 flex items-center">
            <p className="font-medium">Tên đề thi</p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="font-medium">Năm</p>
          </div>
          <div className="col-span-2 flex items-center">
            <p className="font-medium">Thao tác</p>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : (
          exams?.map((exam: Exam) => (
            <div
              key={exam.id}
              className="grid grid-cols-8 border-t border-stroke py-4.5 px-4 dark:border-strokedark"
            >
              <div className="col-span-1 flex items-center">
                <p className="text-sm">{exam.id}</p>
              </div>
              <div className="col-span-3 flex items-center">
                <Link to={`/tables/tables-exams/${exam.id}`}>{exam.name}</Link>
              </div>
              <div className="col-span-2 flex items-center">
                <p className="text-sm">{exam.year}</p>
              </div>
              <div className="col-span-2 flex items-center gap-4">
                <EditIcon onClick={() => handleViewEdit(exam)} />
                <DeleteIcon onClick={() => handleDelete(exam)} />
              </div>
            </div>
          ))
        )}
      </div>

      {/* Add exam button */}
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-5 right-10 bg-primary text-white rounded-full p-4 hover:bg-primary/80 transition-colors"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          className="w-6 h-6"
          stroke="currentColor"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth={2}
            d="M12 4v16m8-8H4"
          />
        </svg>
      </button>

      {/* Exam Form Modal */}
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
                <Dialog.Panel className="w-full max-w-2xl transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl transition-all">
                  <Dialog.Title
                    as="h3"
                    className="text-lg font-medium leading-6 text-gray-900 mb-4"
                  >
                    {isEdit ? 'Chỉnh sửa đề thi' : 'Thêm đề thi mới'}
                  </Dialog.Title>

                  <form onSubmit={handleSubmit} className="space-y-4">
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

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Tên đề thi
                      </label>
                      <input
                        type="text"
                        value={formData.name}
                        onChange={(e) =>
                          setFormData({ ...formData, name: e.target.value })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-700">
                        Năm
                      </label>
                      <input
                        type="number"
                        value={formData.year}
                        onChange={(e) =>
                          setFormData({
                            ...formData,
                            year: Number(e.target.value),
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary focus:ring-primary"
                        required
                      />
                    </div>

                    <div className="flex justify-end gap-4 mt-4">
                      <button
                        type="button"
                        onClick={closeModal}
                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded-md"
                      >
                        Hủy
                      </button>
                      <button
                        type="submit"
                        className="bg-primary text-white px-4 py-2 rounded-md"
                      >
                        {isEdit ? 'Cập nhật' : 'Thêm mới'}
                      </button>
                    </div>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>

      <Toaster position="top-center" />
    </>
  );
};

export default TableExams;
