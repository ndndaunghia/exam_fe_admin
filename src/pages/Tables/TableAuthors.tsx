import { Dialog, Transition } from '@headlessui/react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { Fragment, useCallback, useEffect, useState } from 'react';
import EditIcon from '../../icons/EditIcon';
import DeleteIcon from '../../icons/DeleteIcon';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { RootState } from '../../app/store';
import {
  deleteAuthorAsync,
  getAuthorsAsync,
  updateAuthorAsync,
  upsertAuthorAsync,
} from '../../services/author/authorSlice';
import { Author, AuthorRequest } from '../../services/author/author.type';
import { AUTHOR_CONSTANTS } from '../../constants/Author';
import Loader from '../../common/Loader';

export const TableAuthors = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formAuthorData, setFormAuthorData] = useState<AuthorRequest>({
    name: '',
    avatar_url: null,
    email: '',
    phone_number: '',
    description: null,
  });
  const [isEdit, setIsEdit] = useState(false);
  const [editingAuthorId, setEditingAuthorId] = useState<number | null>(null);

  const dispatch = useAppDispatch();

  // Lấy danh sách tác giả từ Redux store
  const { authors, loading } = useAppSelector(
    (state: RootState) => state.author,
  );

  // Lấy token từ localStorage
  const token = localStorage.getItem('token') || '';

  const fetchAuthors = useCallback(() => {
    if (token) {
      dispatch(getAuthorsAsync({ page: 1, limit: 10, token }));
    }
  }, [dispatch]);



  // Mở form thêm hoặc chỉnh sửa tác giả
  function handleEdit(item: Author) {
    setIsEdit(true);
    setIsOpen(true);
    setFormAuthorData({
      name: item.name,
      avatar_url: item.avatar_url || '',
      email: item.email,
      phone_number: item.phone_number,
      description: item.description || '',
    });
    setEditingAuthorId(item.id);
  }

  // Đóng form modal
  function closeModal() {
    setIsOpen(false);
    setIsEdit(false);
    setFormAuthorData({
      name: '',
      avatar_url: null,
      email: '',
      phone_number: '',
      description: null,
    });
    setEditingAuthorId(null);
  }

  // Xử lý sự kiện submit form
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    console.log('formAuthorData:', formAuthorData);
    try {
      if (isEdit && editingAuthorId !== null) {
        await dispatch(
          updateAuthorAsync({
            id: editingAuthorId,
            data: formAuthorData,
            token,
          }),
        ).unwrap();
      } else {
        await dispatch(
          upsertAuthorAsync({
            data: formAuthorData,
            token,
          }),
        ).unwrap();
      }
      dispatch(getAuthorsAsync({ page: 1, limit: 10, token }));
      closeModal();
    } catch (error) {
      console.error('Thao tác với tác giả thất bại:', error);
    }
  }

  // Xử lý sự kiện xóa tác giả
  async function handleDelete(item: Author) {
    if (
      window.confirm(`Bạn có chắc chắn muốn xóa tác giả "${item.name}" không?`)
    ) {
      try {
        await dispatch(deleteAuthorAsync({ id: item.id, token })).unwrap();
        // Gọi lại danh sách tác giả sau khi xóa
        dispatch(getAuthorsAsync({ page: 1, limit: 10, token }));
      } catch (error) {
        console.error('Xóa tác giả thất bại:', error);
      }
    }
  }

  useEffect(() => {
    // Gọi API lấy danh sách tác giả khi component mount
    if (!authors || authors.length === 0) {
      fetchAuthors();
    }
  }, [dispatch]);

  return (
    <>
      <Breadcrumb pageName="Bảng tác giả" />
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="py-6 px-4 md:px-6 xl:px-7.5">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Danh sách tác giả
            </h4>
          </div>

          <div className="grid grid-cols-9 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
            <div className="col-span-1 flex items-center">
              <p className="font-medium">{AUTHOR_CONSTANTS.AUTHOR_ID}</p>
            </div>
            <div className="col-span-1 hidden items-center sm:flex">
              <p className="font-medium">{AUTHOR_CONSTANTS.AUTHOR_IMAGE}</p>
            </div>
            <div className="col-span-2 hidden items-center sm:flex">
              <p className="font-medium">{AUTHOR_CONSTANTS.AUTHOR_NAME}</p>
            </div>
            <div className="col-span-2 hidden items-center sm:flex">
              <p className="font-medium">{AUTHOR_CONSTANTS.AUTHOR_EMAIL}</p>
            </div>
            <div className="col-span-1 hidden items-center sm:flex">
              <p className="font-medium">{AUTHOR_CONSTANTS.AUTHOR_PHONE}</p>
            </div>
            <div className="col-span-1 hidden items-center sm:flex">
              <p className="font-medium">
                {AUTHOR_CONSTANTS.AUTHOR_MODIFICATION}
              </p>
            </div>
          </div>

          {loading ? (
            <Loader />
          ) : (
            authors?.map((item: Author) => (
              <div
                key={item.id}
                className="grid grid-cols-9 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5"
              >
                <div className="col-span-1 flex items-center">
                  <p className="font-medium">{item.id}</p>
                </div>
                <div className="col-span-1 flex items-center">
                  {item.avatar_url && (
                    <img
                      src={item.avatar_url}
                      alt={item.name}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  )}
                </div>
                <div className="col-span-2 flex items-center">
                  <p className="font-medium">{item.name}</p>
                </div>
                <div className="col-span-2 flex items-center">
                  <p className="font-medium">{item.email}</p>
                </div>
                <div className="col-span-1 flex items-center">
                  <p className="font-medium">{item.phone_number}</p>
                </div>

                <div className="col-span-1 hidden items-center sm:flex gap-4">
                  <EditIcon onClick={() => handleEdit(item)} />
                  <DeleteIcon onClick={() => handleDelete(item)} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Nút thêm tác giả */}
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

      {/* Form thêm hoặc chỉnh sửa tác giả */}
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
                    className="text-lg font-semibold text-center leading-6 text-gray-900 "
                  >
                    {isEdit
                      ? AUTHOR_CONSTANTS.AUTHOR_UPDATE_TITLE
                      : AUTHOR_CONSTANTS.AUTHOR_ADD_TITLE}
                  </Dialog.Title>
                  <form onSubmit={handleSubmit} className="mt-2">
                    <div className="mb-4">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        {AUTHOR_CONSTANTS.AUTHOR_NAME}
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formAuthorData.name}
                        onChange={(e) =>
                          setFormAuthorData({
                            ...formAuthorData,
                            name: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-700 border-[1px] shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700"
                      >
                        {AUTHOR_CONSTANTS.AUTHOR_EMAIL}
                      </label>
                      <input
                        type="email"
                        name="email"
                        id="email"
                        value={formAuthorData.email}
                        onChange={(e) =>
                          setFormAuthorData({
                            ...formAuthorData,
                            email: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-700 border-[1px] shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="phone_number"
                        className="block text-sm font-medium text-gray-700"
                      >
                        {AUTHOR_CONSTANTS.AUTHOR_PHONE}
                      </label>
                      <input
                        type="tel"
                        name="phone_number"
                        id="phone_number"
                        value={formAuthorData.phone_number}
                        onChange={(e) =>
                          setFormAuthorData({
                            ...formAuthorData,
                            phone_number: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-700 border-[1px] shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="avatar_url"
                        className="block text-sm font-medium text-gray-700"
                      >
                        {AUTHOR_CONSTANTS.AUTHOR_IMAGE}
                      </label>
                      <input
                        type="file"
                        name="avatar_url"
                        id="avatar_url"
                        value={formAuthorData.avatar_url || ''}
                        onChange={(e) =>
                          setFormAuthorData({
                            ...formAuthorData,
                            avatar_url: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-700 border-[1px] shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2"
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="description"
                        className="block text-sm font-medium text-gray-700"
                      >
                        {AUTHOR_CONSTANTS.AUTHOR_DESCRIPTION}
                      </label>
                      <textarea
                        name="description"
                        id="description"
                        value={formAuthorData.description || ''}
                        onChange={(e) =>
                          setFormAuthorData({
                            ...formAuthorData,
                            description: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-700 border-[1px] shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2"
                      />
                    </div>

                    <div className="flex justify-between">
                      <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded-md"
                      >
                        {isEdit
                          ? AUTHOR_CONSTANTS.AUTHOR_UPDATE
                          : AUTHOR_CONSTANTS.AUTHOR_ADD}
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
    </>
  );
};
