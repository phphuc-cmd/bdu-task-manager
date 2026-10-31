/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import {
  Student,
  ScheduleItem,
  ExamItem,
  AttendanceSession,
  Announcement,
  StudentRequest,
  FacultyTask,
  FacultyStaff,
  UserProfile
} from '../types';

export const INITIAL_STAFF: FacultyStaff[] = [
  {
    id: 'staff-1',
    staffCode: 'BDU-GV001',
    fullName: 'TS. Nguyễn Văn Hùng',
    degree: 'Tiến sĩ',
    role: 'DEAN',
    position: 'Trưởng Khoa',
    department: 'Khoa Ngoại ngữ',
    email: 'hungnv@bdu.edu.vn',
    phone: '0913.456.789',
    teachingHoursThisSemester: 120,
    assignedCourses: ['Dẫn luận ngôn ngữ', 'Văn hóa Anh - Mỹ'],
    activeTasksCount: 3
  },
  {
    id: 'staff-2',
    staffCode: 'BDU-GV002',
    fullName: 'ThS. Trần Thị Kim Oanh',
    degree: 'Thạc sĩ',
    role: 'ACADEMIC_AFFAIRS',
    position: 'Giáo vụ Khoa',
    department: 'Văn phòng Khoa Ngoại ngữ',
    email: 'oanhttk@bdu.edu.vn',
    phone: '0982.112.334',
    teachingHoursThisSemester: 45,
    assignedCourses: ['Thực hành tiếng Anh 1'],
    activeTasksCount: 5
  },
  {
    id: 'staff-3',
    staffCode: 'BDU-GV003',
    fullName: 'ThS. Lê Hoàng Minh',
    degree: 'Thạc sĩ',
    role: 'LECTURER',
    position: 'Trưởng Bộ môn Anh',
    department: 'Bộ môn Ngôn ngữ Anh',
    email: 'minhlh@bdu.edu.vn',
    phone: '0908.776.543',
    teachingHoursThisSemester: 210,
    assignedCourses: ['Ngữ pháp nâng cao', 'Biên dịch 1', 'Tiếng Anh thương mại'],
    activeTasksCount: 2
  },
  {
    id: 'staff-4',
    staffCode: 'BDU-GV004',
    fullName: 'ThS. Vương Mỹ Linh',
    degree: 'Thạc sĩ',
    role: 'LECTURER',
    position: 'Trưởng Bộ môn Trung - Hàn',
    department: 'Bộ môn Ngôn ngữ Trung - Hàn',
    email: 'linhvm@bdu.edu.vn',
    phone: '0934.887.665',
    teachingHoursThisSemester: 180,
    assignedCourses: ['Hán ngữ sơ cấp 1', 'Khẩu ngữ Trung Quốc'],
    activeTasksCount: 1
  },
  {
    id: 'staff-5',
    staffCode: 'BDU-GV005',
    fullName: 'TS. Phan Thanh Trúc',
    degree: 'Tiến sĩ',
    role: 'LECTURER',
    position: 'Giảng viên Cơ hữu',
    department: 'Bộ môn Ngôn ngữ Anh',
    email: 'tructp@bdu.edu.vn',
    phone: '0977.345.221',
    teachingHoursThisSemester: 195,
    assignedCourses: ['Kỹ năng Nói & Thuyết trình', 'Âm vị học tiếng Anh'],
    activeTasksCount: 2
  }
];

export const INITIAL_STUDENTS: Student[] = [
  {
    id: 'stu-1',
    mssv: '240501001',
    fullName: 'Nguyễn Thị Phương Anh',
    dateOfBirth: '2005-04-12',
    gender: 'Nữ',
    cohort: 'K24',
    major: 'Ngôn ngữ Anh',
    classCode: '24DTA01',
    email: '240501001@student.bdu.edu.vn',
    phone: '0834.123.456',
    status: 'STUDYING',
    gpa: 3.65,
    drl: 92,
    creditsEarned: 48,
    totalCreditsRequired: 135,
    homeTown: 'Bình Dương',
    address: '504 Đại lộ Bình Dương, TP. Thủ Dầu Một',
    admissionDate: '2024-09-05',
    advisorLecturerId: 'staff-3',
    statusHistory: [
      {
        id: 'hist-1',
        previousStatus: 'STUDYING',
        newStatus: 'STUDYING',
        changedAt: '2024-09-05 08:30:00',
        changedBy: 'ThS. Trần Thị Kim Oanh (Giáo vụ)',
        reason: 'Nhập học đợt 1 năm học 2024-2025',
        decisionNumber: 'QĐ-BDU-1052/ĐH'
      }
    ]
  },
  {
    id: 'stu-2',
    mssv: '240501002',
    fullName: 'Lê Hoàng Khang',
    dateOfBirth: '2005-08-23',
    gender: 'Nam',
    cohort: 'K24',
    major: 'Ngôn ngữ Anh',
    classCode: '24DTA01',
    email: '240501002@student.bdu.edu.vn',
    phone: '0912.889.900',
    status: 'STUDYING',
    gpa: 3.20,
    drl: 85,
    creditsEarned: 45,
    totalCreditsRequired: 135,
    homeTown: 'Bình Phước',
    address: 'Ký túc xá BDU, TP. Thủ Dầu Một',
    admissionDate: '2024-09-05',
    advisorLecturerId: 'staff-3',
    statusHistory: [
      {
        id: 'hist-2',
        previousStatus: 'STUDYING',
        newStatus: 'STUDYING',
        changedAt: '2024-09-05 08:30:00',
        changedBy: 'ThS. Trần Thị Kim Oanh (Giáo vụ)',
        reason: 'Nhập học chính thức'
      }
    ]
  },
  {
    id: 'stu-3',
    mssv: '230501015',
    fullName: 'Trần Minh Quân',
    dateOfBirth: '2004-11-03',
    gender: 'Nam',
    cohort: 'K23',
    major: 'Ngôn ngữ Anh',
    classCode: '23DTA02',
    email: '230501015@student.bdu.edu.vn',
    phone: '0978.665.443',
    status: 'ACADEMIC_WARN',
    gpa: 1.82,
    drl: 65,
    creditsEarned: 62,
    totalCreditsRequired: 135,
    homeTown: 'Đồng Nai',
    address: 'P. Phú Hòa, TP. Thủ Dầu Một',
    admissionDate: '2023-09-10',
    advisorLecturerId: 'staff-5',
    statusHistory: [
      {
        id: 'hist-3',
        previousStatus: 'STUDYING',
        newStatus: 'ACADEMIC_WARN',
        changedAt: '2026-02-15 14:00:00',
        changedBy: 'TS. Nguyễn Văn Hùng (Trưởng Khoa)',
        reason: 'Cảnh báo học vụ lần 1 do GPA học kỳ 1 năm học 2025-2026 dưới 2.0',
        decisionNumber: 'TB-CBHV-04/BDU'
      }
    ]
  },
  {
    id: 'stu-4',
    mssv: '240502018',
    fullName: 'Phạm Ngọc Trâm',
    dateOfBirth: '2005-02-17',
    gender: 'Nữ',
    cohort: 'K24',
    major: 'Ngôn ngữ Trung Quốc',
    classCode: '24DTT01',
    email: '240502018@student.bdu.edu.vn',
    phone: '0903.441.982',
    status: 'STUDYING',
    gpa: 3.80,
    drl: 95,
    creditsEarned: 50,
    totalCreditsRequired: 135,
    homeTown: 'Tây Ninh',
    address: 'Khu phố 3, P. Hiệp Thành, TP. Thủ Dầu Một',
    admissionDate: '2024-09-05',
    advisorLecturerId: 'staff-4',
    statusHistory: []
  },
  {
    id: 'stu-5',
    mssv: '230502008',
    fullName: 'Đỗ Hữu Tài',
    dateOfBirth: '2004-06-30',
    gender: 'Nam',
    cohort: 'K23',
    major: 'Ngôn ngữ Trung Quốc',
    classCode: '23DTT01',
    email: '230502008@student.bdu.edu.vn',
    phone: '0945.772.113',
    status: 'RESERVED',
    gpa: 2.95,
    drl: 78,
    creditsEarned: 60,
    totalCreditsRequired: 135,
    homeTown: 'Bình Dương',
    address: 'TX. Bến Cát, Bình Dương',
    admissionDate: '2023-09-10',
    advisorLecturerId: 'staff-4',
    statusHistory: [
      {
        id: 'hist-5',
        previousStatus: 'STUDYING',
        newStatus: 'RESERVED',
        changedAt: '2025-10-20 09:15:00',
        changedBy: 'TS. Nguyễn Văn Hùng (Trưởng Khoa)',
        reason: 'Nghỉ học tạm thời 1 học kỳ để điều trị y tế',
        decisionNumber: 'QĐ-BL-22/BDU'
      }
    ]
  },
  {
    id: 'stu-6',
    mssv: '240503005',
    fullName: 'Vũ Thảo Vy',
    dateOfBirth: '2005-12-05',
    gender: 'Nữ',
    cohort: 'K24',
    major: 'Ngôn ngữ Hàn Quốc',
    classCode: '24DTH01',
    email: '240503005@student.bdu.edu.vn',
    phone: '0888.991.223',
    status: 'STUDYING',
    gpa: 3.52,
    drl: 88,
    creditsEarned: 46,
    totalCreditsRequired: 135,
    homeTown: 'TP. Hồ Chí Minh',
    address: 'P. Dĩ An, TP. Dĩ An, Bình Dương',
    admissionDate: '2024-09-05',
    advisorLecturerId: 'staff-4',
    statusHistory: []
  }
];

export const INITIAL_SCHEDULE: ScheduleItem[] = [
  {
    id: 'sched-1',
    courseCode: 'ENG201',
    courseName: 'Ngữ pháp Nâng cao Tiếng Anh',
    classSectionCode: '24DTA01_ENG201',
    credits: 3,
    dayOfWeek: 'Thứ Hai',
    shift: 'Tiết 1-3 (07:00 - 09:15)',
    room: 'P.A204',
    lecturerId: 'staff-3',
    lecturerName: 'ThS. Lê Hoàng Minh',
    targetClass: '24DTA01',
    enrolledStudentsCount: 38,
    maxStudents: 45,
    type: 'CHÍNH_KHÓA',
    startDate: '2026-09-01',
    endDate: '2026-12-20'
  },
  {
    id: 'sched-2',
    courseCode: 'ENG205',
    courseName: 'Kỹ năng Nói & Thuyết trình',
    classSectionCode: '24DTA01_ENG205',
    credits: 3,
    dayOfWeek: 'Thứ Ba',
    shift: 'Tiết 4-6 (09:30 - 11:45)',
    room: 'Lab Ngoại Ngữ 1',
    lecturerId: 'staff-5',
    lecturerName: 'TS. Phan Thanh Trúc',
    targetClass: '24DTA01',
    enrolledStudentsCount: 35,
    maxStudents: 40,
    type: 'THỰC_HÀNH',
    startDate: '2026-09-01',
    endDate: '2026-12-20'
  },
  {
    id: 'sched-3',
    courseCode: 'CHN102',
    courseName: 'Hán ngữ Cơ sở 2',
    classSectionCode: '24DTT01_CHN102',
    credits: 4,
    dayOfWeek: 'Thứ Tư',
    shift: 'Tiết 1-3 (07:00 - 09:15)',
    room: 'P.B102',
    lecturerId: 'staff-4',
    lecturerName: 'ThS. Vương Mỹ Linh',
    targetClass: '24DTT01',
    enrolledStudentsCount: 42,
    maxStudents: 50,
    type: 'CHÍNH_KHÓA',
    startDate: '2026-09-01',
    endDate: '2026-12-20'
  },
  {
    id: 'sched-4',
    courseCode: 'ENG302',
    courseName: 'Biên dịch 1',
    classSectionCode: '23DTA02_ENG302',
    credits: 3,
    dayOfWeek: 'Thứ Năm',
    shift: 'Tiết 7-9 (12:45 - 15:00)',
    room: 'P.A205',
    lecturerId: 'staff-3',
    lecturerName: 'ThS. Lê Hoàng Minh',
    targetClass: '23DTA02',
    enrolledStudentsCount: 40,
    maxStudents: 45,
    type: 'CHÍNH_KHÓA',
    startDate: '2026-09-01',
    endDate: '2026-12-20'
  },
  {
    id: 'sched-5',
    courseCode: 'ENG101',
    courseName: 'Thực hành Tiếng Anh 1 (Học bù)',
    classSectionCode: '24DTA01_ENG101_BU',
    credits: 2,
    dayOfWeek: 'Thứ Bảy',
    shift: 'Tiết 4-6 (09:30 - 11:45)',
    room: 'P.A103',
    lecturerId: 'staff-2',
    lecturerName: 'ThS. Trần Thị Kim Oanh',
    targetClass: '24DTA01',
    enrolledStudentsCount: 38,
    maxStudents: 45,
    type: 'HỌC_BÙ',
    startDate: '2026-11-01',
    endDate: '2026-11-01',
    note: 'Học bù do giảng viên công tác ngày 20/10'
  }
];

export const INITIAL_EXAMS: ExamItem[] = [
  {
    id: 'exam-1',
    courseCode: 'ENG201',
    courseName: 'Ngữ pháp Nâng cao Tiếng Anh',
    classSectionCode: '24DTA01_ENG201',
    examDate: '2026-11-15',
    examShift: 'Ca 1 (07:30 - 09:00)',
    room: 'P.A204',
    studentCount: 38,
    format: 'Tự luận',
    proctor1Id: 'staff-5',
    proctor1Name: 'TS. Phan Thanh Trúc',
    proctor2Id: 'staff-2',
    proctor2Name: 'ThS. Trần Thị Kim Oanh',
    status: 'SCHEDULED'
  },
  {
    id: 'exam-2',
    courseCode: 'CHN102',
    courseName: 'Hán ngữ Cơ sở 2',
    classSectionCode: '24DTT01_CHN102',
    examDate: '2026-11-16',
    examShift: 'Ca 2 (09:30 - 11:00)',
    room: 'P.B102',
    studentCount: 42,
    format: 'Trắc nghiệm máy',
    proctor1Id: 'staff-3',
    proctor1Name: 'ThS. Lê Hoàng Minh',
    proctor2Id: 'staff-4',
    proctor2Name: 'ThS. Vương Mỹ Linh',
    status: 'SCHEDULED'
  },
  {
    id: 'exam-3',
    courseCode: 'ENG205',
    courseName: 'Kỹ năng Nói & Thuyết trình',
    classSectionCode: '24DTA01_ENG205',
    examDate: '2026-11-18',
    examShift: 'Ca 3 (13:30 - 16:30)',
    room: 'Lab Ngoại Ngữ 1',
    studentCount: 35,
    format: 'Vấn đáp (Oral Exam)',
    proctor1Id: 'staff-1',
    proctor1Name: 'TS. Nguyễn Văn Hùng',
    proctor2Id: 'staff-5',
    proctor2Name: 'TS. Phan Thanh Trúc',
    status: 'SCHEDULED'
  }
];

export const INITIAL_ATTENDANCE_SESSIONS: AttendanceSession[] = [
  {
    id: 'att-session-1',
    classSectionCode: '24DTA01_ENG201',
    courseName: 'Ngữ pháp Nâng cao Tiếng Anh',
    sessionNumber: 8,
    totalSessions: 15,
    date: '2026-10-26',
    shift: 'Tiết 1-3 (07:00 - 09:15)',
    room: 'P.A204',
    lecturerName: 'ThS. Lê Hoàng Minh',
    isLocked: false,
    records: [
      {
        studentId: 'stu-1',
        mssv: '240501001',
        studentName: 'Nguyễn Thị Phương Anh',
        status: 'PRESENT',
        note: 'Tham gia tích cực'
      },
      {
        studentId: 'stu-2',
        mssv: '240501002',
        studentName: 'Lê Hoàng Khang',
        status: 'LATE',
        note: 'Đến muộn 15 phút'
      },
      {
        studentId: 'stu-3',
        mssv: '230501015',
        studentName: 'Trần Minh Quân',
        status: 'UNEXCUSED_ABSENT',
        note: 'Vắng không lý do'
      }
    ],
    auditLogs: [
      {
        id: 'log-1',
        timestamp: '2026-10-26 10:15:00',
        updatedBy: 'ThS. Lê Hoàng Minh',
        studentMssv: '240501002',
        oldStatus: 'UNEXCUSED_ABSENT',
        newStatus: 'LATE',
        reason: 'Sinh viên nộp giấy trễ xe buýt tuyến BDU-Bến Cát'
      }
    ]
  },
  {
    id: 'att-session-2',
    classSectionCode: '24DTA01_ENG205',
    courseName: 'Kỹ năng Nói & Thuyết trình',
    sessionNumber: 7,
    totalSessions: 15,
    date: '2026-10-27',
    shift: 'Tiết 4-6 (09:30 - 11:45)',
    room: 'Lab Ngoại Ngữ 1',
    lecturerName: 'TS. Phan Thanh Trúc',
    isLocked: false,
    records: [
      {
        studentId: 'stu-1',
        mssv: '240501001',
        studentName: 'Nguyễn Thị Phương Anh',
        status: 'PRESENT'
      },
      {
        studentId: 'stu-2',
        mssv: '240501002',
        studentName: 'Lê Hoàng Khang',
        status: 'PRESENT'
      },
      {
        studentId: 'stu-3',
        mssv: '230501015',
        studentName: 'Trần Minh Quân',
        status: 'EXCUSED_ABSENT',
        note: 'Có giấy phép khám bệnh'
      }
    ],
    auditLogs: []
  }
];

export const INITIAL_ANNOUNCEMENTS: Announcement[] = [
  {
    id: 'ann-1',
    title: 'Thông báo về việc tổ chức Hội thảo Ngôn ngữ ứng dụng BDU 2026',
    content: 'Ban Chủ nhiệm Khoa Ngoại ngữ trân trọng thông báo đến toàn thể giảng viên và sinh viên về việc tham dự Hội thảo Quốc tế "Applied Linguistics and Digital Transformation in Higher Education". Thời gian: 08:00 ngày 25/11/2026 tại Hội trường Nhà B.',
    summary: 'Hội thảo Quốc tế về ứng dụng công nghệ trong giảng dạy ngoại ngữ tại Trường ĐH Bình Dương.',
    category: 'Hoạt động Khoa',
    status: 'PUBLISHED',
    priority: 'IMPORTANT',
    target: 'ALL',
    authorId: 'staff-2',
    authorName: 'ThS. Trần Thị Kim Oanh (Giáo vụ)',
    approvedBy: 'staff-1',
    approvedByName: 'TS. Nguyễn Văn Hùng (Trưởng Khoa)',
    approvedAt: '2026-10-28 09:30:00',
    createdAt: '2026-10-27 14:00:00',
    publishedAt: '2026-10-28 10:00:00',
    readByUsers: ['staff-1', 'staff-3', 'stu-1'],
    attachments: [
      { name: 'Ke_hoach_Hoi_thao_BDU_2026.pdf', size: '1.4 MB', url: '#' }
    ]
  },
  {
    id: 'ann-2',
    title: 'Đăng ký xét học bổng khuyến khích học tập Học kỳ 1 (2026 - 2027)',
    content: 'Khoa Ngoại ngữ thông báo tiếp nhận hồ sơ xét cấp học bổng khuyến khích học tập dành cho sinh viên có GPA từ 3.2 trở lên và ĐRL từ 80 trở lên. Thời hạn nộp đơn trực tuyến trên hệ thống: trước ngày 15/11/2026.',
    summary: 'Thông báo xét cấp học bổng Khuyến khích học tập HK1 cho sinh viên đạt GPA ≥ 3.2.',
    category: 'Học bổng',
    status: 'PUBLISHED',
    priority: 'NORMAL',
    target: 'STUDENTS',
    authorId: 'staff-2',
    authorName: 'ThS. Trần Thị Kim Oanh (Giáo vụ)',
    approvedBy: 'staff-1',
    approvedByName: 'TS. Nguyễn Văn Hùng (Trưởng Khoa)',
    approvedAt: '2026-10-29 08:00:00',
    createdAt: '2026-10-28 16:20:00',
    publishedAt: '2026-10-29 08:30:00',
    readByUsers: ['stu-1', 'stu-2'],
    attachments: [
      { name: 'Mau_don_xin_hoc_bong_BDU.docx', size: '120 KB', url: '#' }
    ]
  },
  {
    id: 'ann-3',
    title: 'Kế hoạch kiểm tra tiến độ đồ án tốt nghiệp Khóa 23',
    content: 'Đề nghị toàn thể giảng viên hướng dẫn và sinh viên K23 nộp báo cáo sơ bộ đợt 1 trước ngày 10/11/2026. Hội đồng Khoa sẽ họp đánh giá vào ngày 18/11/2026.',
    summary: 'Kế hoạch kiểm tra tiến độ đồ án tốt nghiệp K23 Khoa Ngoại ngữ.',
    category: 'Đồ án & Thực tập',
    status: 'PENDING_APPROVAL',
    priority: 'IMPORTANT',
    target: 'COHORT',
    targetDetail: 'Khóa 23 (K23)',
    authorId: 'staff-3',
    authorName: 'ThS. Lê Hoàng Minh (Bộ môn Anh)',
    createdAt: '2026-10-30 11:00:00',
    readByUsers: []
  }
];

export const INITIAL_REQUESTS: StudentRequest[] = [
  {
    id: 'req-1',
    requestCode: 'BDU-NN-2026-042',
    studentId: 'stu-1',
    mssv: '240501001',
    studentName: 'Nguyễn Thị Phương Anh',
    studentClass: '24DTA01',
    studentEmail: '240501001@student.bdu.edu.vn',
    studentPhone: '0834.123.456',
    requestType: 'Đơn cấp giấy chứng nhận sinh viên',
    title: 'Xin cấp giấy chứng nhận sinh viên tạm hoãn nghĩa vụ quân sự / vay vốn',
    content: 'Em kính gửi Ban Chủ nhiệm Khoa và Phòng Giáo vụ cấp cho em 02 bản Giấy xác nhận sinh viên để bổ sung hồ sơ vay vốn tín dụng học tập ngân hàng chính sách xã hội.',
    attachmentName: 'CMND_Va_So_Ho_Khau.pdf',
    submittedAt: '2026-10-29 10:15:00',
    status: 'APPROVED',
    assignedStaffId: 'staff-2',
    assignedStaffName: 'ThS. Trần Thị Kim Oanh',
    decisionNote: 'Đã duyệt cấp 02 bản giấy xác nhận. Sinh viên nhận tại Văn phòng Khoa (P.102 Nhà A) sau 14h00.',
    timeline: [
      {
        id: 'tl-1',
        timestamp: '2026-10-29 10:15:00',
        actorName: 'Nguyễn Thị Phương Anh',
        actorRole: 'Sinh viên',
        action: 'Nộp đơn trực tuyến'
      },
      {
        id: 'tl-2',
        timestamp: '2026-10-29 11:30:00',
        actorName: 'ThS. Trần Thị Kim Oanh',
        actorRole: 'Giáo vụ Khoa',
        action: 'Tiếp nhận và kiểm tra hồ sơ hợp lệ'
      },
      {
        id: 'tl-3',
        timestamp: '2026-10-29 15:45:00',
        actorName: 'TS. Nguyễn Văn Hùng',
        actorRole: 'Trưởng Khoa',
        action: 'Phê duyệt chính thức',
        comment: 'Đồng ý cấp giấy xác nhận theo quy chế.'
      }
    ]
  },
  {
    id: 'req-2',
    requestCode: 'BDU-NN-2026-043',
    studentId: 'stu-3',
    mssv: '230501015',
    studentName: 'Trần Minh Quân',
    studentClass: '23DTA02',
    studentEmail: '230501015@student.bdu.edu.vn',
    studentPhone: '0978.665.443',
    requestType: 'Đơn xin phúc khảo điểm thi',
    title: 'Phúc khảo điểm thi học kỳ môn Biên dịch 1 (ENG302)',
    content: 'Em kính xin phúc khảo bài thi kết thúc môn Biên dịch 1, điểm hiện tại là 4.5. Em thấy phần dịch thuật thương mại của em bám sát đề và từ vựng chuẩn.',
    attachmentName: 'Bien_lai_le_phi_phuc_khao.jpg',
    submittedAt: '2026-10-30 08:30:00',
    status: 'IN_REVIEW',
    assignedStaffId: 'staff-2',
    assignedStaffName: 'ThS. Trần Thị Kim Oanh',
    timeline: [
      {
        id: 'tl-4',
        timestamp: '2026-10-30 08:30:00',
        actorName: 'Trần Minh Quân',
        actorRole: 'Sinh viên',
        action: 'Nộp đơn phúc khảo'
      },
      {
        id: 'tl-5',
        timestamp: '2026-10-30 09:15:00',
        actorName: 'ThS. Trần Thị Kim Oanh',
        actorRole: 'Giáo vụ Khoa',
        action: 'Chuyển thông tin cho Giảng viên chấm thi và Trưởng bộ môn',
        comment: 'Đã nhận lệ phí và đối soát túi bài thi.'
      }
    ]
  }
];

export const INITIAL_TASKS: FacultyTask[] = [
  {
    id: 'task-1',
    taskCode: 'CV-2026-01',
    title: 'Rà soát và chuẩn hóa Ngân hàng đề thi Học kỳ 1 (2026-2027)',
    description: 'Thực hiện biên soạn 03 đề thi chính thức và 02 đề thi dự bị kèm ma trận và đáp án chi tiết môn Ngữ pháp Nâng cao.',
    category: 'Soạn đề thi',
    assignerId: 'staff-1',
    assignerName: 'TS. Nguyễn Văn Hùng (Trưởng Khoa)',
    assigneeId: 'staff-3',
    assigneeName: 'ThS. Lê Hoàng Minh',
    collaborators: ['TS. Phan Thanh Trúc'],
    startDate: '2026-10-15',
    dueDate: '2026-11-05',
    progressPercent: 85,
    status: 'IN_PROGRESS',
    priority: 'HIGH'
  },
  {
    id: 'task-2',
    taskCode: 'CV-2026-02',
    title: 'Chuẩn bị hồ sơ tự đánh giá AUN-QA CTĐT Ngôn ngữ Anh',
    description: 'Thu thập minh chứng Tiêu chí 4 (Đội ngũ giảng viên) và Tiêu chí 6 (Hỗ trợ sinh viên).',
    category: 'Kiểm định chất lượng',
    assignerId: 'staff-1',
    assignerName: 'TS. Nguyễn Văn Hùng (Trưởng Khoa)',
    assigneeId: 'staff-2',
    assigneeName: 'ThS. Trần Thị Kim Oanh',
    collaborators: ['ThS. Vương Mỹ Linh'],
    startDate: '2026-10-01',
    dueDate: '2026-11-20',
    progressPercent: 60,
    status: 'IN_PROGRESS',
    priority: 'CRITICAL'
  },
  {
    id: 'task-3',
    taskCode: 'CV-2026-03',
    title: 'Tổ chức Vòng sơ loại Cuộc thi Hùng biện Tiếng Anh BDU Voice 2026',
    description: 'Phối hợp Đoàn Thanh niên và CLB Tiếng Anh tổ chức casting, chấm điểm sơ khảo cho 120 thí sinh.',
    category: 'Hội thảo khoa học',
    assignerId: 'staff-1',
    assignerName: 'TS. Nguyễn Văn Hùng',
    assigneeId: 'staff-5',
    assigneeName: 'TS. Phan Thanh Trúc',
    startDate: '2026-10-10',
    dueDate: '2026-10-28',
    progressPercent: 100,
    status: 'ACCEPTED',
    priority: 'MEDIUM',
    evidenceAttachment: 'Bao_cao_tong_ket_BDU_Voice.pdf',
    acceptanceFeedback: 'Tổ chức chuyên nghiệp, số lượng sinh viên tham gia vượt chỉ tiêu 25%.',
    acceptanceScore: 'Xuất sắc',
    completedAt: '2026-10-28 17:00:00'
  }
];

export const DEMO_USERS: Record<string, UserProfile> = {
  DEAN: {
    id: 'staff-1',
    name: 'TS. Nguyễn Văn Hùng',
    code: 'BDU-GV001',
    email: 'hungnv@bdu.edu.vn',
    role: 'DEAN',
    department: 'Ban Chủ nhiệm Khoa Ngoại ngữ',
    phone: '0913.456.789'
  },
  ACADEMIC_AFFAIRS: {
    id: 'staff-2',
    name: 'ThS. Trần Thị Kim Oanh',
    code: 'BDU-GV002',
    email: 'oanhttk@bdu.edu.vn',
    role: 'ACADEMIC_AFFAIRS',
    department: 'Văn phòng Giáo vụ Khoa',
    phone: '0982.112.334'
  },
  LECTURER: {
    id: 'staff-3',
    name: 'ThS. Lê Hoàng Minh',
    code: 'BDU-GV003',
    email: 'minhlh@bdu.edu.vn',
    role: 'LECTURER',
    department: 'Bộ môn Ngôn ngữ Anh',
    phone: '0908.776.543'
  },
  STUDENT: {
    id: 'stu-1',
    name: 'Nguyễn Thị Phương Anh',
    code: '240501001',
    email: '240501001@student.bdu.edu.vn',
    role: 'STUDENT',
    department: 'Khóa 24 - Lớp 24DTA01',
    phone: '0834.123.456'
  }
};
