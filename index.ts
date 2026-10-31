/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

export type UserRole = 'DEAN' | 'ACADEMIC_AFFAIRS' | 'LECTURER' | 'STUDENT';

export interface UserProfile {
  id: string;
  name: string;
  code: string; // Mã CBGV hoặc MSSV
  email: string;
  role: UserRole;
  avatarUrl?: string;
  department: string;
  phone: string;
}

export type StudentStatus = 
  | 'STUDYING'       // Đang học
  | 'RESERVED'       // Bảo lưu
  | 'ACADEMIC_WARN'  // Cảnh báo học vụ
  | 'SUSPENDED'      // Đình chỉ có thời hạn
  | 'DROPPED_OUT'    // Thôi học (Quyết định chính thức của trường)
  | 'GRADUATED';     // Đã tốt nghiệp

export interface StatusHistoryEntry {
  id: string;
  previousStatus: StudentStatus;
  newStatus: StudentStatus;
  changedAt: string;
  changedBy: string;
  reason: string;
  decisionNumber?: string; // Số quyết định
}

export interface Student {
  id: string;
  mssv: string;
  fullName: string;
  dateOfBirth: string;
  gender: 'Nam' | 'Nữ' | 'Khác';
  cohort: string; // Khóa: K24, K25, K26, K27...
  major: 'Ngôn ngữ Anh' | 'Ngôn ngữ Trung Quốc' | 'Ngôn ngữ Hàn Quốc' | 'Ngôn ngữ Nhật';
  classCode: string; // Lớp: 24DTA01, 24DTT01, 25DTA02...
  email: string;
  phone: string;
  status: StudentStatus;
  gpa: number; // Thang 4.0
  drl: number; // Điểm rèn luyện
  creditsEarned: number;
  totalCreditsRequired: number;
  homeTown: string;
  address: string;
  admissionDate: string;
  advisorLecturerId?: string; // Giảng viên cố vấn học tập
  statusHistory: StatusHistoryEntry[];
}

export type ScheduleShift = 
  | 'Tiết 1-3 (07:00 - 09:15)' 
  | 'Tiết 4-6 (09:30 - 11:45)' 
  | 'Tiết 7-9 (12:45 - 15:00)' 
  | 'Tiết 10-12 (15:15 - 17:30)' 
  | 'Ca tối (18:00 - 20:45)';

export type DayOfWeek = 'Thứ Hai' | 'Thứ Ba' | 'Thứ Tư' | 'Thứ Năm' | 'Thứ Sáu' | 'Thứ Bảy' | 'Chủ Nhật';

export interface ScheduleItem {
  id: string;
  courseCode: string;
  courseName: string;
  classSectionCode: string; // Mã lớp học phần: 24DTA01_ENG101
  credits: number;
  dayOfWeek: DayOfWeek;
  shift: ScheduleShift;
  room: string; // Phòng học: P.A101, Lab Ngoại Ngữ 2, Hội trường B...
  lecturerId: string;
  lecturerName: string;
  targetClass: string;
  enrolledStudentsCount: number;
  maxStudents: number;
  type: 'CHÍNH_KHÓA' | 'HỌC_BÙ' | 'THỰC_HÀNH';
  startDate: string;
  endDate: string;
  note?: string;
}

export interface ExamItem {
  id: string;
  courseCode: string;
  courseName: string;
  classSectionCode: string;
  examDate: string; // YYYY-MM-DD
  examShift: string; // Ca 1 (07:30), Ca 2 (09:45), Ca 3 (13:30), Ca 4 (15:30)
  room: string;
  studentCount: number;
  format: 'Tự luận' | 'Vấn đáp (Oral Exam)' | 'Trắc nghiệm máy' | 'Tiểu luận môn học';
  proctor1Id: string;
  proctor1Name: string;
  proctor2Id: string;
  proctor2Name: string;
  status: 'SCHEDULED' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED';
}

export type AttendanceStatus = 'PRESENT' | 'LATE' | 'EXCUSED_ABSENT' | 'UNEXCUSED_ABSENT';

export interface AttendanceRecordItem {
  studentId: string;
  mssv: string;
  studentName: string;
  status: AttendanceStatus;
  note?: string;
}

export interface AttendanceAuditLog {
  id: string;
  timestamp: string;
  updatedBy: string;
  studentMssv: string;
  oldStatus: AttendanceStatus;
  newStatus: AttendanceStatus;
  reason: string;
}

export interface AttendanceSession {
  id: string;
  classSectionCode: string;
  courseName: string;
  sessionNumber: number; // Buổi 1, 2, 3...
  totalSessions: number; // Tổng 15 buổi
  date: string;
  shift: ScheduleShift;
  room: string;
  lecturerName: string;
  records: AttendanceRecordItem[];
  auditLogs: AttendanceAuditLog[];
  isLocked: boolean; // Khóa sau khi nộp
}

export type AnnouncementStatus = 'PENDING_APPROVAL' | 'APPROVED' | 'PUBLISHED' | 'CANCELLED';
export type AnnouncementPriority = 'NORMAL' | 'IMPORTANT' | 'URGENT';
export type AnnouncementTarget = 'ALL' | 'COHORT' | 'CLASS' | 'LECTURERS' | 'STUDENTS';

export interface Announcement {
  id: string;
  title: string;
  content: string;
  summary: string;
  category: 'Học vụ' | 'Thi cử' | 'Học bổng' | 'Hoạt động Khoa' | 'Đồ án & Thực tập';
  status: AnnouncementStatus;
  priority: AnnouncementPriority;
  target: AnnouncementTarget;
  targetDetail?: string; // Ví dụ: K24, Lớp 24DTA01
  authorId: string;
  authorName: string;
  approvedBy?: string;
  approvedByName?: string;
  approvedAt?: string;
  createdAt: string;
  publishedAt?: string;
  attachments?: { name: string; size: string; url: string }[];
  readByUsers: string[]; // Danh sách userId đã đọc
}

export type StudentRequestType = 
  | 'Đơn xin nghỉ học tạm thời (Bảo lưu)' 
  | 'Đơn xin phúc khảo điểm thi' 
  | 'Đơn cấp giấy chứng nhận sinh viên' 
  | 'Đơn xin miễn giảm học phần / Công nhận tín chỉ' 
  | 'Đơn đăng ký học lại / Học cải thiện'
  | 'Đơn chuyển ngành / Chuyển lớp';

export type StudentRequestStatus = 
  | 'SUBMITTED'     // Tiếp nhận
  | 'IN_REVIEW'     // Đang thụ lý
  | 'NEED_INFO'     // Yêu cầu bổ sung
  | 'APPROVED'      // Đã phê duyệt
  | 'REJECTED'      // Từ chối
  | 'COMPLETED';    // Hoàn tất

export interface RequestTimelineEvent {
  id: string;
  timestamp: string;
  actorName: string;
  actorRole: string;
  action: string;
  comment?: string;
}

export interface StudentRequest {
  id: string;
  requestCode: string; // VD: BDU-NN-2026-089
  studentId: string;
  mssv: string;
  studentName: string;
  studentClass: string;
  studentEmail: string;
  studentPhone: string;
  requestType: StudentRequestType;
  title: string;
  content: string;
  attachmentName?: string;
  submittedAt: string;
  status: StudentRequestStatus;
  assignedStaffId?: string;
  assignedStaffName?: string;
  decisionNote?: string;
  timeline: RequestTimelineEvent[];
}

export type TaskStatus = 'TODO' | 'IN_PROGRESS' | 'SUBMITTED' | 'ACCEPTED' | 'OVERDUE';
export type TaskPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL';

export interface FacultyTask {
  id: string;
  taskCode: string;
  title: string;
  description: string;
  category: 'Soạn đề thi' | 'Kiểm định chất lượng' | 'Đề cương chi tiết' | 'Hội thảo khoa học' | 'Tư vấn tuyển sinh' | 'Chấm thi học kỳ';
  assignerId: string;
  assignerName: string;
  assigneeId: string;
  assigneeName: string;
  collaborators?: string[];
  startDate: string;
  dueDate: string;
  progressPercent: number; // 0 - 100
  status: TaskStatus;
  priority: TaskPriority;
  submissionNote?: string;
  evidenceAttachment?: string;
  acceptanceFeedback?: string;
  acceptanceScore?: 'Xuất sắc' | 'Đạt yêu cầu' | 'Cần chỉnh sửa';
  completedAt?: string;
}

export interface FacultyStaff {
  id: string;
  staffCode: string; // CB001, CB002...
  fullName: string;
  degree: 'Tiến sĩ' | 'Thạc sĩ' | 'Cử nhân' | 'Phó Giáo sư, Tiến sĩ';
  role: UserRole;
  position: 'Trưởng Khoa' | 'Phó Trưởng Khoa' | 'Trưởng Bộ môn Anh' | 'Trưởng Bộ môn Trung - Hàn' | 'Giáo vụ Khoa' | 'Giảng viên Cơ hữu';
  department: string;
  email: string;
  phone: string;
  teachingHoursThisSemester: number;
  assignedCourses: string[];
  activeTasksCount: number;
}
