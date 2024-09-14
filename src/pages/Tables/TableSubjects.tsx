import { Dialog, Transition } from '@headlessui/react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { Fragment, useState } from 'react';

interface FormData {
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
  const [formData, setFormData] = useState<FormData>({ subject: '' });
  const [isEdit, setIsEdit] = useState(false);

  function handleEdit(item: FormData) {
    setIsEdit(!isEdit);
    setIsOpen(true);
    setFormData({ subject: item.subject });
  }

  function closeModal() {
    setIsOpen(false);
    setIsEdit(false);
    setFormData({ subject: '' });
  }

  function openModal() {
    setIsOpen(true);
  }

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log(formData);
    closeModal();
  }

  function handleDelete(item: FormData) {
    console.log(item)
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
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    width="24px"
                    height="24px"
                    className="cursor-pointer"
                    onClick={() => handleEdit(item)}
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M21.2799 6.40005L11.7399 15.94C10.7899 16.89 7.96987 17.33 7.33987 16.7C6.70987 16.07 7.13987 13.25 8.08987 12.3L17.6399 2.75002C17.8754 2.49308 18.1605 2.28654 18.4781 2.14284C18.7956 1.99914 19.139 1.92124 19.4875 1.9139C19.8359 1.90657 20.1823 1.96991 20.5056 2.10012C20.8289 2.23033 21.1225 2.42473 21.3686 2.67153C21.6147 2.91833 21.8083 3.21243 21.9376 3.53609C22.0669 3.85976 22.1294 4.20626 22.1211 4.55471C22.1128 4.90316 22.0339 5.24635 21.8894 5.5635C21.7448 5.88065 21.5375 6.16524 21.2799 6.40005V6.40005Z"
                        stroke="#259AE6"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                      <path
                        d="M11 4H6C4.93913 4 3.92178 4.42142 3.17163 5.17157C2.42149 5.92172 2 6.93913 2 8V18C2 19.0609 2.42149 20.0783 3.17163 20.8284C3.92178 21.5786 4.93913 22 6 22H17C19.21 22 20 20.2 20 18V13"
                        stroke="#259AE6"
                        strokeWidth="1"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      ></path>
                    </g>
                  </svg>
                  <svg
                    width="24px"
                    height="24px"
                    viewBox="0 0 24 24"
                    fill="none"
                    xmlns="http://www.w3.org/2000/svg"
                    transform="rotate(0)"
                    className="cursor-pointer"
                    onClick={() => handleDelete(item)}
                  >
                    <g id="SVGRepo_bgCarrier" stroke-width="0"></g>
                    <g
                      id="SVGRepo_tracerCarrier"
                      stroke-linecap="round"
                      stroke-linejoin="round"
                    ></g>
                    <g id="SVGRepo_iconCarrier">
                      <path
                        d="M10 11V17"
                        stroke="#D34053"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                      <path
                        d="M14 11V17"
                        stroke="#D34053"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                      <path
                        d="M4 7H20"
                        stroke="#D34053"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                      <path
                        d="M6 7H12H18V18C18 19.6569 16.6569 21 15 21H9C7.34315 21 6 19.6569 6 18V7Z"
                        stroke="#D34053"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                      <path
                        d="M9 5C9 3.89543 9.89543 3 11 3H13C14.1046 3 15 3.89543 15 5V7H9V5Z"
                        stroke="#D34053"
                        stroke-width="2"
                        stroke-linecap="round"
                        stroke-linejoin="round"
                      ></path>
                    </g>
                  </svg>
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
