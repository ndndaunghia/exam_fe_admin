// Kiểu dữ liệu cho mỗi môn học
export interface Subject {
  id: number;
  name: string;
  thumbnail_url: string | null;
  description: string | null;
  created_at: string;
  updated_at: string;
  deleted_at: string | null;
}

// Yêu cầu gửi lên API (không thay đổi)
export interface SubjectRequest {
  name: string;
  thumbnail_url: string | null;
  description: string | null;
}

// Phản hồi của API khi lấy danh sách môn học
export interface SubjectListResponse {
  msg: string;
  code: number;
  data: {
    subjects: {
      data: Subject[]; // Mảng các môn học
      total: number; // Tổng số môn học
      per_page: number; // Số môn học trên mỗi trang
      current_page: number; // Trang hiện tại
      last_page: number; // Trang cuối cùng
      has_more_pages: boolean; // Còn trang tiếp theo không
    };
  };
}

// Phản hồi của API khi thao tác với một môn học (như tạo, cập nhật, xóa)
export interface SubjectResponse {
  msg: string;
  code: number;
  data: {
    subject: Subject; // Dữ liệu của một môn học
  };
}
