import React from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { ModuleRequest } from '../../services/module/module.type';
import { COURSE_CONSTANTS } from '../../constants/Course';

interface ModuleFormModalProps {
  isModuleOpen: boolean;
  isEditModule: boolean;
  formModule: ModuleRequest;
  onClose: () => void;
  closeModuleModal: () => void;
  handleSubmitModule: (e: React.FormEvent<HTMLFormElement>) => void;
  handleInputModuleChange: (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => void;
}

const ModuleFormModal: React.FC<ModuleFormModalProps> = ({
  isModuleOpen,
  isEditModule,
  formModule,
  onClose,
  closeModuleModal,
  handleSubmitModule,
  handleInputModuleChange,
}) => {
  return (
    <Transition appear show={isModuleOpen} as={React.Fragment}>
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
                  {isEditModule ? 'Cập nhật chương' : 'Thêm chương mới'}
                </Dialog.Title>
                <form onSubmit={handleSubmitModule} className="mt-4">
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
                      onChange={handleInputModuleChange}
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
                      onChange={handleInputModuleChange}
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
                      onChange={handleInputModuleChange}
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
                      {isEditModule
                        ? COURSE_CONSTANTS.COURSE_UPDATE
                        : COURSE_CONSTANTS.COURSE_ADD}
                    </button>
                    <button
                      type="button"
                      className="bg-red-500 text-white px-4 py-2 rounded-md"
                      onClick={closeModuleModal}
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

export default ModuleFormModal;
