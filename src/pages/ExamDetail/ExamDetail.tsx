import React, { Fragment, useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Dialog, Transition } from '@headlessui/react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { RootState } from '../../app/store';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import EditIcon from '../../icons/EditIcon';
import DeleteIcon from '../../icons/DeleteIcon';
import Loader from '../../common/Loader';
import { QuestionRequest } from '../../services/question/question.type';
import { FaDownload, FaUpload } from 'react-icons/fa6';
import toast, { Toaster } from 'react-hot-toast';
import * as XLSX from 'xlsx';
import {
  deleteExamQuestionAsync,
  getExamQuestionsAsync,
  updateExamQuestionAsync,
  upsertExamQuestionAsync,
} from '../../services/exam_question/examQuestionSlice';
import { useCloudinaryUpload } from '../../hooks/useCloudinaryUpload';
import axios from 'axios';

const initialQuestionState: QuestionRequest = {
  exam_id: null,
  name: '',
  description: null,
  image_url: null,
  status: null,
  difficulty: null,
  options: [],
};

const ExamDetail = () => {
  const { id } = useParams<{ id: string }>();
  const [isQuestionOpen, setIsQuestionOpen] = useState(false);
  const [isEditQuestion, setIsEditQuestion] = useState(false);
  const [editingQuestionId, setEditingQuestionId] = useState<number | null>(
    null,
  );
  const [formData, setFormData] =
    useState<QuestionRequest>(initialQuestionState);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  const [isLoading, setIsLoading] = useState(false);

  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadName = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESENT_NAME;

  const dispatch = useAppDispatch();
  const { examQuestions, loading } = useAppSelector(
    (state: RootState) => state.examQuestion,
  );

  const token = localStorage.getItem('token') || '';

  const fetchExamQuestions = useCallback(() => {
    if (token && id) {
      dispatch(getExamQuestionsAsync({ page: 1, limit: 100, token }));
    }
  }, [dispatch, token, id]);

  useEffect(() => {
    fetchExamQuestions();
  }, [fetchExamQuestions]);

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];

    if (file) {
      setIsLoading(true);

      const cloudFormData = new FormData();
      cloudFormData.append('file', file);
      cloudFormData.append('upload_preset', uploadName);
      fetch(`https://api.cloudinary.com/v1_1/${cloudName}/image/upload`, {
        method: 'POST',
        body: cloudFormData,
      })
        .then((response) => response.json())
        .then((data) => {
          console.log(data);

          setIsLoading(false);
          console.log(data);
          setImagePreview(data.secure_url);
          setFormData((prevData) => ({
            ...prevData,
            image_url: data.secure_url,
          }));
        });
    }
  };

  const handleInputQuestionChange = (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement
    >,
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const closeQuestionModal = () => {
    setIsQuestionOpen(false);
    setFormData(initialQuestionState);
    setIsEditQuestion(false);
    setImagePreview(null);
  };

  const handleEditQuestion = (question: any) => {
    setFormData({
      exam_id: question.exam_id,
      name: question.name,
      description: question.description,
      image_url: question.image_url,
      status: question.status,
      difficulty: question.difficulty,
      options: question.options,
    });
    setIsEditQuestion(true);
    setIsQuestionOpen(true);
    setEditingQuestionId(question.id);
  };

  const handleOptionChange = (index: number, field: string, value: any) => {
    setFormData((prev) => ({
      ...prev,
      options: prev.options.map((option, i) =>
        i === index ? { ...option, [field]: value } : option,
      ),
    }));
  };

  const handleSubmitQuestion = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      if (isEditQuestion && editingQuestionId) {
        await dispatch(
          updateExamQuestionAsync({
            id: editingQuestionId,
            data: { ...formData, exam_id: Number(id) || null },
            token,
          }),
        ).unwrap();
      } else {
        console.log('formData', formData);

        await dispatch(
          upsertExamQuestionAsync({
            data: { ...formData, exam_id: Number(id) || null },
            token,
          }),
        ).unwrap();
      }
      closeQuestionModal();
      fetchExamQuestions();
    } catch (error) {
      console.error('Error submitting question:', error);
    }
  };

  const handleDelete = async (questionId: number) => {
    if (window.confirm('Are you sure you want to delete this question?')) {
      try {
        await dispatch(
          deleteExamQuestionAsync({
            id: questionId,
            token,
          }),
        ).unwrap();
        fetchExamQuestions();
      } catch (error) {
        console.error('Error deleting question:', error);
      }
    }
  };

  const handleXLSXUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('exam_id', id || ''); // Use the exam ID from the URL

    try {
      const token = localStorage.getItem('token') || '';
      const response = await axios.post(
        'http://127.0.0.1:8000/api/v1.0/admin/exam-questions/import',
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        },
      );

      // Show success toast
      toast.success('XLSX imported successfully');

      // Refresh the exam questions
      fetchExamQuestions();
    } catch (error) {
      // Show error toast
      toast.error('Failed to import XLSX');
      console.error('XLSX upload error:', error);
    }
  };

  const generateExcelTemplate = () => {
    // Define the structure of your template
    const templateData = [
      [
        'Tên câu hỏi',
        'Mô tả',
        'Độ khó',
        'Đáp án 1',
        'Giải thích 1',
        'Đáp án 2',
        'Giải thích 2',
        'Đáp án 3',
        'Giải thích 3',
        'Đáp án 4',
        'Giải thích 4',
        'Đáp án đúng'
      ]
    ];

    // Create workbook and worksheet
    const worksheet = XLSX.utils.aoa_to_sheet(templateData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, 'Câu hỏi');

    // Generate and download file
    XLSX.writeFile(workbook, `exam_question_template.xlsx`);
  };

  return (
    <>
      <Breadcrumb pageName={`Exam Details: ${id}`} />

      {/* <div className="mt-4 mr-auto">
        <button onClick={generateExcelTemplate}>
          <FaDownload size={28}/>
        </button>
      </div> */}
      <div className="mt-4">
        
        <label
          htmlFor="xlsx-download"
          onClick={generateExcelTemplate}
          className="fixed bottom-5 right-44 bg-green-500 text-white rounded-full p-4 hover:bg-blue-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
            />
          </svg>
        </label>
      </div>
      <div className="mt-4">
        <input
          type="file"
          accept=".xlsx"
          onChange={handleXLSXUpload}
          className="hidden"
          id="xlsx-upload"
        />
        <label
          htmlFor="xlsx-upload"
          className="fixed bottom-5 right-28 bg-blue-500 text-white rounded-full p-4 hover:bg-blue-600 transition-colors"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            className="w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
            />
          </svg>
        </label>
      </div>
      <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
        <div className="p-4 md:p-6 xl:p-7.5">
          <div className="flex items-center justify-between">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Danh sách câu hỏi
            </h4>
          </div>
        </div>

        <div className="grid grid-cols-12 border-t border-stroke py-4.5 px-4 dark:border-strokedark">
          <div className="col-span-2 flex items-center">
            <p className="font-medium">ID</p>
          </div>
          <div className="col-span-6 flex items-center">
            <p className="font-medium">Nội dung</p>
          </div>

          <div className="col-span-2 flex items-center">
            <p className="font-medium">Hành động</p>
          </div>
        </div>

        {loading ? (
          <Loader />
        ) : (
          examQuestions
            ?.filter((question) => question.exam_id === Number(id))
            ?.map((question) => (
              <div
                key={question.id}
                className="grid grid-cols-12 border-t border-stroke py-4.5 px-4 dark:border-strokedark"
              >
                <div className="col-span-2 flex items-center">
                  <p className="text-sm">{question.id}</p>
                </div>
                <div className="col-span-6 flex items-center">
                  <p className="text-sm">{question.name}</p>
                </div>

                <div className="col-span-2 flex items-center gap-4">
                  <EditIcon onClick={() => handleEditQuestion(question)} />
                  <DeleteIcon onClick={() => handleDelete(question.id)} />
                </div>
              </div>
            ))
        )}
      </div>

      <button
        onClick={() => {
          setFormData({
            ...initialQuestionState,
            exam_id: Number(id) || null,
            options: [
              { content: '', explanation: '', is_correct: 0 },
              { content: '', explanation: '', is_correct: 0 },
              { content: '', explanation: '', is_correct: 0 },
              { content: '', explanation: '', is_correct: 0 },
            ],
          });
          setIsQuestionOpen(true);
        }}
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

      <Transition appear show={isQuestionOpen} as={Fragment}>
        <Dialog as="div" className="relative z-10" onClose={closeQuestionModal}>
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
                  <div className="p-1 max-h-[60vh] overflow-y-auto">
                    <Dialog.Title
                      as="h3"
                      className="text-lg font-semibold leading-6 text-gray-900 text-center"
                    >
                      {isEditQuestion ? 'Update Question' : 'Add New Question'}
                    </Dialog.Title>
                    <form onSubmit={handleSubmitQuestion} className="mt-4">
                      <div className="mb-4">
                        <label
                          htmlFor="exam_id"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Exam ID
                        </label>
                        <input
                          type="text"
                          name="exam_id"
                          id="exam_id"
                          value={id || ''}
                          className="mt-1 block w-full rounded-md border-gray-700 border-[1px] shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2"
                          disabled
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="name"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Nội dung câu hỏi
                        </label>
                        <textarea
                          name="name"
                          id="name"
                          value={formData.name}
                          onChange={handleInputQuestionChange}
                          className="mt-1 block w-full rounded-md border-gray-700 border-[1px] shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2"
                          required
                          rows={4}
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="description"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Mô tả
                        </label>
                        <textarea
                          name="description"
                          id="description"
                          value={formData.description || ''}
                          onChange={handleInputQuestionChange}
                          className="mt-1 block w-full rounded-md border-gray-300 px-2 py-2 border-[1px] shadow-sm focus:border-black"
                        />
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="image_url"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Hình ảnh
                        </label>
                        {(imagePreview || formData.image_url) && (
                          <div className="mt-2 mb-2">
                            <img
                              src={imagePreview || formData.image_url || ''}
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
                          {isLoading && (
                            <div className="absolute inset-0 flex items-center justify-center bg-white bg-opacity-50">
                              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
                            </div>
                          )}
                        </div>
                        {/* {error && (
                          <p className="mt-1 text-sm text-red-600">{error}</p>
                        )} */}
                      </div>

                      <div className="mb-4">
                        <label
                          htmlFor="difficulty"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Độ khó
                        </label>
                        <select
                          name="difficulty"
                          id="difficulty"
                          value={formData.difficulty?.toString() || ''}
                          onChange={handleInputQuestionChange}
                          className="mt-1 block w-full rounded-md border-gray-700 border-[1px] shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2"
                        >
                          <option value="">Chọn độ khó</option>
                          <option value="1">Dễ</option>
                          <option value="2">Vừa</option>
                          <option value="3">Khó</option>
                        </select>
                      </div>
                      {/* Options section */}
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700">
                          Đáp án
                        </label>
                        {formData.options.map((option, index) => (
                          <div key={index} className="mb-3">
                            <div className="flex items-center space-x-2">
                              <input
                                type="text"
                                value={option.content}
                                onChange={(e) =>
                                  handleOptionChange(
                                    index,
                                    'content',
                                    e.target.value,
                                  )
                                }
                                placeholder={`Answer ${index + 1}`}
                                className="mt-1 block w-2/3 rounded-md border-gray-300 px-2 py-1 border-[1px] shadow-sm focus:border-black"
                                required
                              />
                              <input
                                type="checkbox"
                                checked={option.is_correct === 1}
                                onChange={(e) =>
                                  handleOptionChange(
                                    index,
                                    'is_correct',
                                    e.target.checked ? 1 : 0,
                                  )
                                }
                                className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                              />
                              <label className="text-sm text-gray-600">
                                Đúng
                              </label>
                            </div>
                            <textarea
                              value={option.explanation || ''}
                              onChange={(e) =>
                                handleOptionChange(
                                  index,
                                  'explanation',
                                  e.target.value,
                                )
                              }
                              placeholder="Giải thích"
                              className="mt-2 block w-full rounded-md border-gray-300 px-2 py-1 border-[1px] shadow-sm focus:border-black"
                            />
                          </div>
                        ))}
                      </div>

                      {/* Status section */}
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
                          value={formData.status?.toString() || ''}
                          onChange={handleInputQuestionChange}
                          className="mt-1 block w-full rounded-md border-gray-700 border-[1px] shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2"
                          required
                        >
                          <option value="">Trạng thái</option>
                          <option value="1">Kích hoạt</option>
                          <option value="0">ẨnÏ</option>
                        </select>
                      </div>

                      {/* Form buttons */}
                      <div className="flex justify-between mt-4">
                        <button
                          type="submit"
                          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600 transition-colors"
                        >
                          {isEditQuestion ? 'Cập nhật câu hỏi' : 'Thêm câu hỏi'}
                        </button>
                        <button
                          type="button"
                          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition-colors"
                          onClick={closeQuestionModal}
                        >
                          Huỷ
                        </button>
                      </div>
                    </form>
                  </div>
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

export default ExamDetail;
