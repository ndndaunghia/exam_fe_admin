import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { LessonRequest } from '../../services/lesson/lesson.type';
import { LESSON_CONSTANTS } from '../../constants/Lesson';

interface LessonFormModalProps {
  isLessonOpen: boolean;
  isLessonEdit: boolean;
  formLesson: LessonRequest;
  onClose: () => void;
  closeLessonModle: () => void;
  handleSubmitLesson: (e: React.FormEvent<HTMLFormElement>) => void;
  handleInputLessonChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

const LessonFormModal: React.FC<LessonFormModalProps> = ({
  isLessonOpen,
  isLessonEdit,
  formLesson,
  onClose,
  closeLessonModle,
  handleSubmitLesson,
  handleInputLessonChange,
}) => {
  return (
    <Transition appear show={isLessonOpen} as={React.Fragment}>
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
                <Dialog.Title
                  as="h3"
                  className="text-lg font-semibold leading-6 text-gray-900 text-center"
                >
                  {isLessonEdit ? 'Cập nhật chương' : 'Thêm chương mới'}
                </Dialog.Title>
                <form onSubmit={handleSubmitLesson} className="mt-4">
                  {/* Course ID - Read only */}
                  <div className="mb-4">
                    <label
                      htmlFor="module_id"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Mã bài giảng
                    </label>
                    <input
                      type="text"
                      name="module_id"
                      id="module_id"
                      value={formLesson.module_id || ''}
                      className="mt-1 block w-full rounded-md border-gray-700 border-[1px] bg-gray-100 px-2 py-2"
                      disabled
                    />
                  </div>

                  {/* Lesson Name */}
                  <div className="mb-4">
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Tên bài giảng
                    </label>
                    <input
                      type="text"
                      name="name"
                      id="name"
                      value={formLesson.name}
                      onChange={handleInputLessonChange}
                      className="mt-1 block w-full rounded-md border-gray-700 border-[1px] shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="video_url"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Video URL
                    </label>
                    <input
                      type="text"
                      name="video_url"
                      id="video_url"
                      value={formLesson.video_url || ''}
                      onChange={handleInputLessonChange}
                      className="mt-1 block w-full rounded-md border-gray-700 border-[1px] shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="description"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Mô tả
                    </label>
                    <input
                      type="text"
                      name="description"
                      id="description"
                      value={formLesson.description || ''}
                      onChange={handleInputLessonChange}
                      className="mt-1 block w-full rounded-md border-gray-700 border-[1px] shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2"
                      required
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="duration"
                      className="block text-sm font-medium text-gray-700"
                    >
                      Thời lượng
                    </label>
                    <input
                      type="number"
                      name="duration"
                      id="duration"
                      value={formLesson.duration || ''}
                      onChange={handleInputLessonChange}
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
                      value={formLesson.order || ''}
                      onChange={handleInputLessonChange}
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
                        formLesson.status !== null
                          ? formLesson.status.toString()
                          : ''
                      }
                      onChange={handleInputLessonChange}
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
                      {isLessonEdit
                        ? LESSON_CONSTANTS.LESSON_UPDATE
                        : LESSON_CONSTANTS.LESSON_ADD}
                    </button>
                    <button
                      type="button"
                      className="bg-red-500 text-white px-4 py-2 rounded-md"
                      onClick={closeLessonModle}
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
};

export default LessonFormModal;
