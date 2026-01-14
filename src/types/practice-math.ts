/**
 * Vai trò của người dùng
 */
export type Role = "ADMIN" | "USER";

/**
 * Thông tin người dùng
 */
export interface User {
  id: string;
  email: string;
  fullName: string;
  className?: string;
  role: Role;
  createdAt: string;
}

export type UserResponseDto = User;

/**
 * Dữ liệu câu hỏi trong đề thi
 */
export interface Question {
  id: string;
  content: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

/**
 * Thông tin đề thi
 */
export interface Exam {
  id: string;
  title: string;
  description?: string;
  duration: number; // Phút
  createdAt: string;
  questions?: Question[];
}

/**
 * Kết quả thi của người dùng
 */
export interface Result {
  id: string;
  userId: string;
  examId: string;
  score: number;
  answers: number[];
  startedAt: string;
  submittedAt: string;
  exam?: Exam;
}

/**
 * DTO cho việc đăng ký
 */
export interface RegisterDto {
  email: string;
  password: string;
  fullName: string;
}

/**
 * DTO cho việc đăng nhập
 */
export interface LoginDto {
  email: string;
  password: string;
}

/**
 * Phản hồi xác thực
 */
export interface AuthResponse {
  accessToken: string;
}
