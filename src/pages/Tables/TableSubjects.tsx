import { Dialog, Transition } from '@headlessui/react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { Fragment, useEffect, useState } from 'react';
import EditIcon from '../../icons/EditIcon';
import DeleteIcon from '../../icons/DeleteIcon';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { getSubjectsAsync, upsertSubjectAsync, deleteSubjectAsync, updateSubjectAsync } from '../../services/subject/subjectSlice';
import { RootState } from '../../app/store';
import { Subject, SubjectRequest } from '../../services/subject/subject.type';

interface FormDataCourse {
  name: string;
  thumbnail_url?: string;
  description?: string;
}

export const TableSubjects = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [formData, setFormDataCourse] = useState<FormDataCourse>({
    name: '',
    thumbnail_url: '',
    description: '',
  });
  const [isEdit, setIsEdit] = useState(false);
  const [editingSubjectId, setEditingSubjectId] = useState<number | null>(null);

  const dispatch = useAppDispatch();

  // Lấy danh sách môn học từ Redux store
  const { subjects, loading } = useAppSelector((state: RootState) => state.subject);

  // Lấy token từ localStorage
  const token = localStorage.getItem('token') || '';

  useEffect(() => {
    // Gọi API lấy danh sách môn học khi component mount
    dispatch(getSubjectsAsync({ page: 1, limit: 10, token }));
  }, [dispatch, token]);

  // Mở form thêm hoặc chỉnh sửa môn học
  function handleEdit(item: Subject) {
    setIsEdit(true);
    setIsOpen(true);
    setFormDataCourse({
      name: item.name,
      thumbnail_url: item.thumbnail_url || '',
      description: item.description || '',
    });
    setEditingSubjectId(item.id);
  }

  // Đóng form modal
  function closeModal() {
    setIsOpen(false);
    setIsEdit(false);
    setFormDataCourse({ name: '', thumbnail_url: '', description: '' });
    setEditingSubjectId(null);
  }

  // Xử lý sự kiện submit form
  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();

    const formattedData: SubjectRequest = {
      name: formData.name,
      thumbnail_url: formData.thumbnail_url ?? null,  // Sử dụng `??` để chuyển đổi undefined thành null
      description: formData.description ?? null, // Tương tự cho description nếu cần
    };

    if (isEdit && editingSubjectId !== null) {
      // Xử lý cập nhật môn học
      try {
        await dispatch(
          updateSubjectAsync({
            data: formattedData,
            token,
            id: editingSubjectId,
          })
        ).unwrap();
        // Gọi lại danh sách môn học sau khi cập nhật
        dispatch(getSubjectsAsync({ page: 1, limit: 10, token }));
      } catch (error) {
        console.error('Cập nhật môn học thất bại:', error);
      }
    } else {
      // Xử lý thêm mới môn học
      try {
        await dispatch(
          upsertSubjectAsync({
            data: formattedData,
            token,
          }),
        ).unwrap();
        // Gọi lại danh sách môn học sau khi thêm mới
        dispatch(getSubjectsAsync({ page: 1, limit: 10, token }));
      } catch (error) {
        console.error('Thêm mới môn học thất bại:', error);
      }
    }
    closeModal();
  }

  // Xử lý sự kiện xóa môn học
  async function handleDelete(item: Subject) {
    if (window.confirm(`Bạn có chắc chắn muốn xóa môn học "${item.name}" không?`)) {
      try {
        await dispatch(deleteSubjectAsync({ id: item.id, token })).unwrap();
        // Gọi lại danh sách môn học sau khi xóa
        dispatch(getSubjectsAsync({ page: 1, limit: 10, token }));
      } catch (error) {
        console.error('Xóa môn học thất bại:', error);
      }
    }
  }

  return (
    <>
      <Breadcrumb pageName="Table Subjects" />
      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white shadow-default dark:border-strokedark dark:bg-boxdark">
          <div className="py-6 px-4 md:px-6 xl:px-7.5">
            <h4 className="text-xl font-semibold text-black dark:text-white">
              Danh sách môn học
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

          {loading ? (
            <div className="flex justify-center py-10">Đang tải dữ liệu...</div>
          ) : (
            subjects?.map((item: Subject) => (
              <div key={item.id} className="grid grid-cols-6 border-t border-stroke py-4.5 px-4 dark:border-strokedark sm:grid-cols-8 md:px-6 2xl:px-7.5">
                <div className="col-span-1 flex items-center">
                  <p className="font-medium">{item.id}</p>
                </div>
                <div className="col-span-3 hidden items-center sm:flex">
                  <div className="flex items-center gap-2">
                    {item.thumbnail_url && (
                      <img src={item.thumbnail_url} alt={item.name} className="w-10 h-10 rounded-full object-cover" />
                    )}
                    <p className="font-medium">{item.name}</p>
                  </div>
                </div>
                <div className="col-span-2 hidden items-center sm:flex gap-4">
                  <EditIcon onClick={() => handleEdit(item)} />
                  <DeleteIcon onClick={() => handleDelete(item)} />
                </div>
              </div>
            ))
          )}
        </div>
      </div>

      {/* Nút thêm môn học */}
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

      {/* Form thêm hoặc chỉnh sửa môn học */}
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
                    {isEdit ? 'Cập nhật môn học' : 'Thêm môn học mới'}
                  </Dialog.Title>
                  <form onSubmit={handleSubmit} className="mt-2">
                    <div className="mb-4">
                      <label
                        htmlFor="name"
                        className="block text-sm font-medium text-gray-700"
                      >
                        Tên môn học
                      </label>
                      <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={(e) =>
                          setFormDataCourse({
                            ...formData,
                            name: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2"
                        required
                      />
                    </div>

                    <div className="mb-4">
                      <label
                        htmlFor="thumbnail_url"
                        className="block text-sm font-medium text-gray-700"
                      >
                        URL Thumbnail
                      </label>
                      <input
                        type="text"
                        name="thumbnail_url"
                        id="thumbnail_url"
                        value={formData.thumbnail_url}
                        onChange={(e) =>
                          setFormDataCourse({
                            ...formData,
                            thumbnail_url: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2"
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
                        value={formData.description}
                        onChange={(e) =>
                          setFormDataCourse({
                            ...formData,
                            description: e.target.value,
                          })
                        }
                        className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-black focus:ring focus:ring-indigo-200 focus:ring-opacity-50 px-2 py-2"
                      />
                    </div>

                    <div className="flex justify-between">
                      <button
                        type="submit"
                        className="bg-green-500 text-white px-4 py-2 rounded-md"
                      >
                        {isEdit ? 'Cập nhật' : 'Thêm môn học'}
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
