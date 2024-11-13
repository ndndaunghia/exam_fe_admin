import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { QuestionRequest } from '../../services/question/question.type';

interface QuestionFormModalProps {
  isQuestionOpen: boolean;
  isQuestionEdit: boolean;
  isUploading: boolean;
  error: string | null;
  imagePreview: string | null;
  formQuestion: QuestionRequest;
  onClose: () => void;
  closeQuestionModle: () => void;
  handleSubmitQuestion: (e: React.FormEvent<HTMLFormElement>) => void;
  handleInputQuestionChange: (
    e: React.ChangeEvent<
      HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement
    >,
  ) => void;
  handleOptionChange: (index: number, field: string, value: any) => void;
  handleImageChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const QuestionFormModal: React.FC<QuestionFormModalProps> = ({
  isQuestionOpen,
  isQuestionEdit,
  isUploading,
  error,
  imagePreview,
  formQuestion,
  onClose,
  closeQuestionModle,
  handleSubmitQuestion,
  handleInputQuestionChange,
  handleOptionChange,
  handleImageChange,
}) => {
  return (
    <Transition appear show={isQuestionOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-10" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
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
              as={React.Fragment}
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
                    {isQuestionEdit ? 'Cập nhật câu hỏi' : 'Thêm câu hỏi mới'}
                  </Dialog.Title>
                  <form onSubmit={handleSubmitQuestion} className="mt-4">
                    <div className="mb-4">
                      <label
                        htmlFor="lesson_id"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Mã bài giảng
                      </label>
                      <input
                        type="text"
                        name="lesson_id"
                        id="lesson_id"
                        value={formQuestion.lesson_id || ''}
                        className="mt-1 block w-full rounded-md border-gray-700 border-[1px] shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2"
                        disabled
                      />
                    </div>
                    {/* Question Name */}
                    <div className="mb-4">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Tên câu hỏi
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formQuestion.name}
                        onChange={handleInputQuestionChange}
                        className="mt-1 block w-full rounded-md border-gray-700 border-[1px] shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2"
                        required
                      />
                    </div>

                    {/* Description */}
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
                        value={formQuestion.description || ''}
                        onChange={handleInputQuestionChange}
                        className="mt-1 block w-full rounded-md border-gray-300 px-2 py-2 border-[1px] shadow-sm focus:border-black"
                      />
                    </div>

                    {/* Image URL */}
                    <div className="mb-4">
                      <label
                        htmlFor="image_url"
                        className="block text-sm font-medium text-gray-700"
                      >
                        URL Hình ảnh
                      </label>
                      {(imagePreview || formQuestion.image_url) && (
                        <div className="mt-2 mb-2">
                          <img
                            src={imagePreview || formQuestion.image_url || ''}
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

                    {/* Difficulty */}
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
                        value={formQuestion.difficulty?.toString() || ''}
                        onChange={handleInputQuestionChange}
                        className="mt-1 block w-full rounded-md border-gray-700 border-[1px] shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2"
                      >
                        <option value="">Chọn độ khó</option>
                        <option value="1">Dễ</option>
                        <option value="2">Trung bình</option>
                        <option value="3">Khó</option>
                      </select>
                    </div>

                    {/* Options */}
                    <div className="mb-4">
                      <label className="block text-sm font-medium text-gray-700">
                        Đáp án
                      </label>
                      {formQuestion.options.map((option, index) => (
                        <div key={index} className="mb-3">
                          <div className="flex items-center space-x-2">
                            <input
                              type="text"
                              name={`option-${index}-content`}
                              value={option.content}
                              onChange={(e) =>
                                handleOptionChange(
                                  index,
                                  'content',
                                  e.target.value,
                                )
                              }
                              placeholder={`Đáp án ${index + 1}`}
                              className="mt-1 block w-2/3 rounded-md border-gray-300 px-2 py-1 border-[1px] shadow-sm focus:border-black"
                            />
                            <input
                              type="checkbox"
                              checked={option.is_correct === 1}
                              onChange={() =>
                                handleOptionChange(
                                  index,
                                  'is_correct',
                                  option.is_correct === 1 ? 0 : 1,
                                )
                              }
                              className="form-checkbox h-4 w-4 text-indigo-600 transition duration-150 ease-in-out"
                            />
                            <label className="text-sm text-gray-600">
                              Đúng
                            </label>
                          </div>
                          <textarea
                            name={`option-${index}-explanation`}
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
                        value={formQuestion.status?.toString() || ''}
                        onChange={handleInputQuestionChange}
                        className="mt-1 block w-full rounded-md border-gray-700 border-[1px] shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2"
                        required
                      >
                        <option value="">Chọn trạng thái</option>
                        <option value="1">Kích hoạt</option>
                        <option value="0">Vô hiệu hóa</option>
                      </select>
                    </div>

                    <div className="flex justify-between mt-4">
                      <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded-md"
                      >
                        {isQuestionEdit ? 'Cập nhật câu hỏi' : 'Thêm câu hỏi'}
                      </button>
                      <button
                        type="button"
                        className="bg-red-500 text-white px-4 py-2 rounded-md"
                        onClick={closeQuestionModle}
                      >
                        Hủy
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
  );
};

export default QuestionFormModal;
