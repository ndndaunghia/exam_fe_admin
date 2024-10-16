import { memo, useCallback, useEffect, useMemo } from 'react';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { getListUserAsync } from '../../services/auth/authSlice';
import Loader from '../../common/Loader';
import { RootState } from '../../app/store';

const TableUsers = () => {
  const dispatch = useAppDispatch();

  const { users, loading, error } = useAppSelector(
    (state: RootState) => state.auth,
  );

  const fetchUsers = useCallback(() => {
    const token = localStorage.getItem('token') || ''; 
    if (token) {
      dispatch(getListUserAsync({ page: 1, limit: 10, token }));
    }
  }, [dispatch]); 

  useEffect(() => {
    if (!users || users.length === 0) {
      fetchUsers();
    }
  }, [fetchUsers, users]);

  return (
    <>
      <Breadcrumb pageName="Danh sách người dùng" />

      <div className="flex flex-col gap-10">
        <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
          <h4 className="mb-6 text-xl font-semibold text-black dark:text-white">
            Danh sách
          </h4>

          <div className="flex flex-col">
            <div className="grid rounded-sm bg-gray-2 dark:bg-meta-4 sm:grid-cols-5">
              <div className="p-2.5 xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  ID
                </h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Tên người dùng
                </h5>
              </div>
              <div className="p-2.5 text-center xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Email
                </h5>
              </div>
              <div className="hidden p-2.5 text-center sm:block xl:p-5">
                <h5 className="text-sm font-medium uppercase xsm:text-base">
                  Vai trò
                </h5>
              </div>
            </div>

            {loading ? (
              <Loader />
            ) : (
              users.map((user, key) => (
                <div
                  className={`grid grid-cols-3 sm:grid-cols-5 ${
                    key === users.length - 1
                      ? ''
                      : 'border-b border-stroke dark:border-strokedark'
                  }`}
                  key={key}
                >
                  <div className="flex items-center gap-3 p-2.5 xl:p-5">
                    <p className="hidden text-black dark:text-white sm:block">
                      {user.id}
                    </p>
                  </div>

                  <div className="flex items-center justify-center p-2.5 xl:p-5">
                    <p className="text-black dark:text-white">{user.name}K</p>
                  </div>

                  <div className="flex items-center justify-center p-2.5 xl:p-5">
                    <p className="text-meta-3">${user.email}</p>
                  </div>

                  <div className="hidden items-center justify-center p-2.5 sm:flex xl:p-5">
                    <p className="text-black dark:text-white">
                      {user.type_string}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default memo(TableUsers);
