import { Dialog, Transition } from '@headlessui/react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { Fragment, useState } from 'react';
import EditIcon from '../../icons/EditIcon';
import DeleteIcon from '../../icons/DeleteIcon';

interface FormDataCourse {
  subject: string;
}

const fakeData = [
  {
    id: 1,
    subject: 'Toán',
  },
  {
    id: 2,
    subject: 'Lý',
  },
  {
    id: 3,
    subject: 'Hóa',
  },
  {
    id: 4,
    subject: 'Sinh',
  },
  {
    id: 5,
    subject: 'Văn',
  },
];

export const TableSubjects = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormDataCourse] = useState<FormDataCourse>({
    subject: '',
  });
  const [isEdit, setIsEdit] = useState(false);

  function handleEdit(item: FormDataCourse) {
    setIsEdit(!isEdit);
    setIsOpen(true);
    setFormDataCourse({ subject: item.subject });
  }

  function closeModal() {
    setIsOpen(false);
    setIsEdit(false);
    setFormDataCourse({ subject: '' });
  }

  function openModal() {
    setIsOpen(true);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormDataCourse({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(formData);
    closeModal();
  }

  function handleDelete(item: FormDataCourse) {
    console.log(item);
  }

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
            <div className="col-span-3 hidden items-center sm:flex">
              <p className="font-medium">Tên môn học</p>
            </div>
            <div className="col-span-2 hidden items-center sm:flex">
              <p className="font-medium">Tùy chỉnh</p>
            </div>
          </div>

          {fakeData.map((item) => {
            return (
              <div className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                <div className="col-span-1 flex items-center">
                  <p className="font-medium">{item.id}</p>
                </div>
                <div className="col-span-3 hidden items-center sm:flex">
                  <p className="font-medium">{item.subject}</p>
                </div>
                <div className="col-span-2 hidden items-center sm:flex gap-4">
                  <EditIcon onClick={() => handleEdit(item)} />
                  <DeleteIcon onClick={() => handleDelete(item)} />
                </div>
              </div>
            );
          })}
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
                    className="text-lg font-medium leading-6 text-gray-900"
                  >
                    Thêm môn học mới
                  </Dialog.Title>
                  <form onSubmit={handleSubmit} className="mt-2">
                    <>
                      <div className="mb-4">
                        <label
                          htmlFor="subject"
                          className="block text-sm font-medium text-gray-700"
                        >
                          Môn học
                        </label>
                        <input
                          type="text"
                          name="subject"
                          id="subject"
                          value={formData.subject}
                          onChange={handleChange}
                          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2 border-gray-300 border-[2px]"
                          required
                        />
                      </div>

                      <div className="flex justify-between">
                        <button
                          type="submit"
                          className="bg-green-500 text-white px-4 py-2 rounded-md"
                        >
                          {isEdit ? 'Cập nhật' : 'Thêm môn học'}
                        </button>
                      </div>
                    </>
                  </form>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition>
    </>
  );
};
