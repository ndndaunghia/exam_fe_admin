import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Breadcrumb from '../../components/Breadcrumbs/Breadcrumb';
import Loader from '../../common/Loader';

interface ExamHistory {
  id: number;
  user_id: number;
  score: string;
  correct_answers: number;
  total_questions: number;
  exam: {
    name: string;
  };
}

interface PaginationData {
  total: number;
  per_page: number;
  current_page: number;
  last_page: number;
}

const ExamHistoryTable = () => {
  const [examHistories, setExamHistories] = useState<ExamHistory[]>([]);
  const [loading, setLoading] = useState(true);
  const [pagination, setPagination] = useState<PaginationData>({
    total: 0,
    per_page: 10,
    current_page: 1,
    last_page: 1,
  });

  const fetchExamHistories = async (page: number) => {
    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      const response = await axios.get(
        'http://127.0.0.1:8000/api/v1.0/admin/exam-histories',
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
          params: {
            page: page,
            limit: 10,
          },
        },
      );

      console.log('API Response:', response.data); // Thêm log để debug

      if (response.data.code === 200) {
        setExamHistories(response.data.data.data);
        setPagination({
          total: response.data.data.total,
          per_page: response.data.data.per_page,
          current_page: response.data.data.current_page,
          last_page: response.data.data.last_page,
        });
      }
    } catch (error) {
      console.error('Error fetching exam histories:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchExamHistories(1);
  }, []);

  const handlePageChange = (page: number) => {
    fetchExamHistories(page);
  };

  return (
    <>
      <Breadcrumb pageName="Lịch sử làm bài" />

      <div className="rounded-sm border border-stroke bg-white px-5 pt-6 pb-2.5 shadow-default dark:border-strokedark dark:bg-boxdark sm:px-7.5 xl:pb-1">
        <div className="max-w-full overflow-x-auto">
          <table className="w-full table-auto">
            <thead>
              <tr className="bg-gray-2 text-left dark:bg-meta-4">
                <th className="min-w-[100px] py-4 px-4 font-medium text-black dark:text-white">
                  ID người dùng
                </th>
                <th className="min-w-[150px] py-4 px-4 font-medium text-black dark:text-white">
                  Tên bài thi
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Điểm số
                </th>
                <th className="min-w-[120px] py-4 px-4 font-medium text-black dark:text-white">
                  Số câu đúng
                </th>
              </tr>
            </thead>
            <tbody>
              {loading ? (
                <tr>
                  <td colSpan={4} className="text-center py-4">
                    <Loader />
                  </td>
                </tr>
              ) : (
                examHistories.map((history) => (
                  <tr key={history.id}>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {history.user_id}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {history.exam.name}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {history.score}
                    </td>
                    <td className="border-b border-[#eee] py-5 px-4 dark:border-strokedark">
                      {history.correct_answers}/{history.total_questions}
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
                    : 'bg-gray-100 text-gray-600'
                }`}
              >
                {page}
              </button>
            ),
          )}
        </div>
      </div>
    </>
  );
};

export default ExamHistoryTable;
