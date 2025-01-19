import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Loader from '../../common/Loader';

interface User {
  id: number;
  name: string;
  email: string;
  type_string: string;
}

interface Course {
  id: number;
  name: string;
  price: string;
  duration: number;
  status_string: string;
}

interface PurchaseHistory {
  id: number;
  user_id: number;
  course_id: number;
  created_at: string;
  courses: Course;
  user: User[];
}

interface PaginationData {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

const PurchasedCoursesTable = () => {
  const [purchases, setPurchases] = useState<PurchaseHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
  });

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('vi-VN', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPrice = (price: string) => {
    return new Intl.NumberFormat('vi-VN', {
      style: 'currency',
      currency: 'VND'
    }).format(Number(price));
  };

  const fetchPurchases = async (page: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://127.0.0.1:8000/api/v1.0/admin/purchased-courses',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: page,
            limit: 10
          }
        }
      );
      
      if (response.data.code === 200) {
        setPurchases(response.data.data.data);
        setPagination({
          total: response.data.data.total,
          per_page: response.data.data.per_page,
          current_page: response.data.data.current_page,
          last_page: response.data.data.last_page,
        });
      }
    } catch (error) {
      console.error('Error fetching purchases:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPurchases(1);
  }, []);

  const handlePageChange = (page: number) => {
    fetchPurchases(page);
  };

  return (
    <>
      <Breadcrumb pageName="Lịch sử mua khóa học" />

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                  ID
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Người dùng
                </th>
                <th className="min-w-[200px] py-4 px-4 font-medium text-black dark:text-white">
                  Khóa học
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Giá
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Thời gian mua
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    <Loader />
                  </td>
                </tr>
              ) : (
                purchases.map((purchase) => (
                  <tr key={purchase.id}>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {purchase.id}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex flex-col">
                        <span className="font-medium">{purchase.user[0].name}</span>
                        <span className="text-sm text-gray-500">{purchase.user[0].email}</span>
                      </div>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      <div className="flex flex-col">
                        <span className="font-medium">{purchase.courses.name}</span>
                        <span className="text-sm text-gray-500">
                          Thời lượng: {purchase.courses.duration} phút
                        </span>
                      </div>
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {formatPrice(purchase.courses.price)}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {formatDate(purchase.created_at)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex justify-center gap-2 mt-4 mb-4">
          {Array.from({ length: pagination.last_page }, (_, i) => i + 1).map(
            (page) => (
              <button
                key={page}
                onClick={() => handlePageChange(page)}
                className={`px-3 py-1 rounded ${
                  pagination.current_page === page
                    ? 'bg-primary text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {page}
              </button>
            )
          )}
        </div>
      </div>
    </>
  );
};

export default PurchasedCoursesTable;