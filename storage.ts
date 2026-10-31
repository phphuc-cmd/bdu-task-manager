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
  AttendanceStatus,
  StudentStatus,
  ScheduleShift,
  DayOfWeek
} from '../types';
import {
  INITIAL_STUDENTS,
  INITIAL_SCHEDULE,
  INITIAL_EXAMS,
  INITIAL_ATTENDANCE_SESSIONS,
  INITIAL_ANNOUNCEMENTS,
  INITIAL_REQUESTS,
  INITIAL_TASKS,
  INITIAL_STAFF
} from './mockData';

const STORAGE_KEYS = {
  STUDENTS: 'bdu_academic_students_v1',
  SCHEDULE: 'bdu_academic_schedule_v1',
  EXAMS: 'bdu_academic_exams_v1',
  ATTENDANCE: 'bdu_academic_attendance_v1',
  ANNOUNCEMENTS: 'bdu_academic_announcements_v1',
  REQUESTS: 'bdu_academic_requests_v1',
  TASKS: 'bdu_academic_tasks_v1',
  STAFF: 'bdu_academic_staff_v1',
};

function safeGet<T>(key: string, defaultValue: T): T {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : defaultValue;
  } catch (error) {
    console.warn(`Error reading localStorage key ${key}:`, error);
    return defaultValue;
  }
}

function safeSet<T>(key: string, value: T): void {
  try {
    localStorage.setItem(key, JSON.stringify(value));
  } catch (error) {
    console.error(`Error saving localStorage key ${key}:`, error);
  }
}

export class BduAcademicService {
  // Students
  static getStudents(): Student[] {
    return safeGet<Student[]>(STORAGE_KEYS.STUDENTS, INITIAL_STUDENTS);
  }

  static saveStudents(students: Student[]): void {
    safeSet(STORAGE_KEYS.STUDENTS, students);
  }

  static getStudentById(id: string): Student | undefined {
    return this.getStudents().find(s => s.id === id);
  }

  static getStudentByMssv(mssv: string): Student | undefined {
    return this.getStudents().find(s => s.mssv.trim().toLowerCase() === mssv.trim().toLowerCase());
  }

  static isMssvUnique(mssv: string, excludeId?: string): boolean {
    const trimmed = mssv.trim().toLowerCase();
    const students = this.getStudents();
    return !students.some(s => s.mssv.trim().toLowerCase() === trimmed && s.id !== excludeId);
  }

  static addStudent(studentData: Omit<Student, 'id' | 'statusHistory'>, operatorName: string): { success: boolean; error?: string; student?: Student } {
    if (!studentData.mssv || !studentData.fullName || !studentData.major || !studentData.classCode) {
      return { success: false, error: 'Vui lòng điền đầy đủ các thông tin bắt buộc (MSSV, Họ tên, Ngành, Lớp).' };
    }

    if (!this.isMssvUnique(studentData.mssv)) {
      return { success: false, error: `Mã số sinh viên ${studentData.mssv} đã tồn tại trong hệ thống. Vui lòng kiểm tra lại!` };
    }

    const newStudent: Student = {
      ...studentData,
      id: `stu-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      statusHistory: [
        {
          id: `hist-${Date.now()}`,
          previousStatus: studentData.status,
          newStatus: studentData.status,
          changedAt: new Date().toLocaleString('vi-VN'),
          changedBy: operatorName,
          reason: 'Tạo mới hồ sơ sinh viên trên hệ thống'
        }
      ]
    };

    const students = this.getStudents();
    students.unshift(newStudent);
    this.saveStudents(students);
    return { success: true, student: newStudent };
  }

  static updateStudent(
    id: string, 
    updates: Partial<Omit<Student, 'id' | 'statusHistory'>>, 
    operatorName: string, 
    statusChangeReason?: string,
    decisionNumber?: string
  ): { success: boolean; error?: string; student?: Student } {
    const students = this.getStudents();
    const index = students.findIndex(s => s.id === id);
    if (index === -1) {
      return { success: false, error: 'Không tìm thấy hồ sơ sinh viên!' };
    }

    const current = students[index];

    // Check MSSV uniqueness if changing
    if (updates.mssv && updates.mssv !== current.mssv) {
      if (!this.isMssvUnique(updates.mssv, id)) {
        return { success: false, error: `Mã số sinh viên ${updates.mssv} bị trùng với sinh viên khác.` };
      }
    }

    // Strict Rule: Check status change
    let statusHistory = [...current.statusHistory];
    if (updates.status && updates.status !== current.status) {
      // Rule: "Không được tự động chuyển sinh viên vắng học thành thôi học"
      // If moving to DROPPED_OUT, require explicit decision number or reason
      if (updates.status === 'DROPPED_OUT' && !decisionNumber && !statusChangeReason) {
        return { 
          success: false, 
          error: 'Quy chế học vụ: Chuyển sang tình trạng Thôi học bắt buộc phải có Số Quyết định hoặc Lý do cụ thể của Hội đồng kỷ luật/Ban Giám hiệu.' 
        };
      }

      statusHistory.unshift({
        id: `hist-${Date.now()}`,
        previousStatus: current.status,
        newStatus: updates.status,
        changedAt: new Date().toLocaleString('vi-VN'),
        changedBy: operatorName,
        reason: statusChangeReason || `Cập nhật trạng thái từ ${current.status} sang ${updates.status}`,
        decisionNumber
      });
    }

    const updatedStudent: Student = {
      ...current,
      ...updates,
      statusHistory
    };

    students[index] = updatedStudent;
    this.saveStudents(students);
    return { success: true, student: updatedStudent };
  }

  // Schedule Management & Conflict Detection
  static getSchedule(): ScheduleItem[] {
    return safeGet<ScheduleItem[]>(STORAGE_KEYS.SCHEDULE, INITIAL_SCHEDULE);
  }

  static saveSchedule(items: ScheduleItem[]): void {
    safeSet(STORAGE_KEYS.SCHEDULE, items);
  }

  /**
   * Conflict Detection Engine:
   * 1. Room conflict: Same day + same shift + same room
   * 2. Lecturer conflict: Same day + same shift + same lecturer
   * 3. Class section conflict: Same day + same shift + same targetClass
   */
  static checkScheduleConflict(
    item: {
      dayOfWeek: DayOfWeek;
      shift: ScheduleShift;
      room: string;
      lecturerId: string;
      targetClass: string;
    },
    excludeId?: string
  ): { hasConflict: boolean; message?: string; conflictType?: 'ROOM' | 'LECTURER' | 'CLASS' } {
    const schedule = this.getSchedule();

    for (const s of schedule) {
      if (s.id === excludeId) continue;

      if (s.dayOfWeek === item.dayOfWeek && s.shift === item.shift) {
        // Room conflict
        if (s.room.trim().toLowerCase() === item.room.trim().toLowerCase()) {
          return {
            hasConflict: true,
            conflictType: 'ROOM',
            message: `Trùng phòng học! Phòng "${item.room}" đã được xếp cho lớp [${s.classSectionCode} - ${s.courseName}] vào ${item.dayOfWeek}, ${item.shift}.`
          };
        }

        // Lecturer conflict
        if (s.lecturerId === item.lecturerId) {
          return {
            hasConflict: true,
            conflictType: 'LECTURER',
            message: `Trùng lịch giảng viên! Giảng viên "${s.lecturerName}" đã có lịch dạy lớp [${s.classSectionCode}] vào ${item.dayOfWeek}, ${item.shift}.`
          };
        }

        // Target Class conflict
        if (s.targetClass.trim().toLowerCase() === item.targetClass.trim().toLowerCase()) {
          return {
            hasConflict: true,
            conflictType: 'CLASS',
            message: `Trùng thời khóa biểu lớp! Lớp sinh hoạt [${item.targetClass}] đã có môn [${s.courseName}] vào ${item.dayOfWeek}, ${item.shift}.`
          };
        }
      }
    }

    return { hasConflict: false };
  }

  static addScheduleItem(itemData: Omit<ScheduleItem, 'id'>): { success: boolean; error?: string; item?: ScheduleItem } {
    const conflict = this.checkScheduleConflict({
      dayOfWeek: itemData.dayOfWeek,
      shift: itemData.shift,
      room: itemData.room,
      lecturerId: itemData.lecturerId,
      targetClass: itemData.targetClass
    });

    if (conflict.hasConflict) {
      return { success: false, error: conflict.message };
    }

    const newItem: ScheduleItem = {
      ...itemData,
      id: `sched-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    };

    const schedule = this.getSchedule();
    schedule.push(newItem);
    this.saveSchedule(schedule);
    return { success: true, item: newItem };
  }

  static updateScheduleItem(id: string, updates: Partial<Omit<ScheduleItem, 'id'>>): { success: boolean; error?: string; item?: ScheduleItem } {
    const schedule = this.getSchedule();
    const index = schedule.findIndex(s => s.id === id);
    if (index === -1) return { success: false, error: 'Không tìm thấy lịch học cần cập nhật!' };

    const current = schedule[index];
    const candidate = { ...current, ...updates };

    const conflict = this.checkScheduleConflict({
      dayOfWeek: candidate.dayOfWeek,
      shift: candidate.shift,
      room: candidate.room,
      lecturerId: candidate.lecturerId,
      targetClass: candidate.targetClass
    }, id);

    if (conflict.hasConflict) {
      return { success: false, error: conflict.message };
    }

    schedule[index] = candidate;
    this.saveSchedule(schedule);
    return { success: true, item: candidate };
  }

  static deleteScheduleItem(id: string): { success: boolean } {
    const schedule = this.getSchedule().filter(s => s.id !== id);
    this.saveSchedule(schedule);
    return { success: true };
  }

  // Exams
  static getExams(): ExamItem[] {
    return safeGet<ExamItem[]>(STORAGE_KEYS.EXAMS, INITIAL_EXAMS);
  }

  static saveExams(exams: ExamItem[]): void {
    safeSet(STORAGE_KEYS.EXAMS, exams);
  }

  static checkExamConflict(
    exam: {
      examDate: string;
      examShift: string;
      room: string;
      proctor1Id: string;
      proctor2Id: string;
    },
    excludeId?: string
  ): { hasConflict: boolean; message?: string } {
    const exams = this.getExams();

    for (const e of exams) {
      if (e.id === excludeId || e.status === 'CANCELLED') continue;

      if (e.examDate === exam.examDate && e.examShift === exam.examShift) {
        // Room conflict
        if (e.room.trim().toLowerCase() === exam.room.trim().toLowerCase()) {
          return {
            hasConflict: true,
            message: `Trùng phòng thi! Phòng "${exam.room}" đã được bố trí cho ca thi môn [${e.courseName}] ngày ${exam.examDate}, ${exam.examShift}.`
          };
        }

        // Proctor 1 conflict
        if (e.proctor1Id === exam.proctor1Id || e.proctor2Id === exam.proctor1Id) {
          return {
            hasConflict: true,
            message: `Trùng lịch cán bộ coi thi 1! Cán bộ đã có lịch coi thi môn [${e.courseName}] cùng thời điểm.`
          };
        }

        // Proctor 2 conflict
        if (e.proctor1Id === exam.proctor2Id || e.proctor2Id === exam.proctor2Id) {
          return {
            hasConflict: true,
            message: `Trùng lịch cán bộ coi thi 2! Cán bộ đã có lịch coi thi môn [${e.courseName}] cùng thời điểm.`
          };
        }
      }
    }

    return { hasConflict: false };
  }

  static addExam(examData: Omit<ExamItem, 'id'>): { success: boolean; error?: string; exam?: ExamItem } {
    if (examData.proctor1Id === examData.proctor2Id) {
      return { success: false, error: 'Cán bộ coi thi 1 và Cán bộ coi thi 2 không được trùng nhau!' };
    }

    const conflict = this.checkExamConflict({
      examDate: examData.examDate,
      examShift: examData.examShift,
      room: examData.room,
      proctor1Id: examData.proctor1Id,
      proctor2Id: examData.proctor2Id
    });

    if (conflict.hasConflict) {
      return { success: false, error: conflict.message };
    }

    const newExam: ExamItem = {
      ...examData,
      id: `exam-${Date.now()}-${Math.floor(Math.random() * 1000)}`
    };

    const exams = this.getExams();
    exams.push(newExam);
    this.saveExams(exams);
    return { success: true, exam: newExam };
  }

  // Attendance
  static getAttendanceSessions(): AttendanceSession[] {
    return safeGet<AttendanceSession[]>(STORAGE_KEYS.ATTENDANCE, INITIAL_ATTENDANCE_SESSIONS);
  }

  static saveAttendanceSessions(sessions: AttendanceSession[]): void {
    safeSet(STORAGE_KEYS.ATTENDANCE, sessions);
  }

  static updateAttendanceRecord(
    sessionId: string,
    studentMssv: string,
    newStatus: AttendanceStatus,
    reason: string,
    updatedByName: string
  ): { success: boolean; error?: string } {
    const sessions = this.getAttendanceSessions();
    const sessionIndex = sessions.findIndex(s => s.id === sessionId);
    if (sessionIndex === -1) return { success: false, error: 'Không tìm thấy buổi điểm danh!' };

    const session = sessions[sessionIndex];
    if (session.isLocked) {
      return { success: false, error: 'Buổi học này đã khóa điểm danh, chỉ Ban Chủ nhiệm hoặc Giáo vụ trưởng mới có quyền mở khóa.' };
    }

    const recIndex = session.records.findIndex(r => r.mssv === studentMssv);
    if (recIndex === -1) return { success: false, error: 'Không tìm thấy sinh viên trong danh sách lớp!' };

    const oldRecord = session.records[recIndex];
    const oldStatus = oldRecord.status;

    // Record audit trail if status really changed
    if (oldStatus !== newStatus) {
      session.auditLogs.unshift({
        id: `audit-${Date.now()}`,
        timestamp: new Date().toLocaleString('vi-VN'),
        updatedBy: updatedByName,
        studentMssv,
        oldStatus,
        newStatus,
        reason: reason || 'Chỉnh sửa chuyên cần định kỳ'
      });
      oldRecord.status = newStatus;
    }

    sessions[sessionIndex] = session;
    this.saveAttendanceSessions(sessions);
    return { success: true };
  }

  // Announcements
  static getAnnouncements(): Announcement[] {
    return safeGet<Announcement[]>(STORAGE_KEYS.ANNOUNCEMENTS, INITIAL_ANNOUNCEMENTS);
  }

  static saveAnnouncements(announcements: Announcement[]): void {
    safeSet(STORAGE_KEYS.ANNOUNCEMENTS, announcements);
  }

  static addAnnouncement(data: Omit<Announcement, 'id' | 'createdAt' | 'readByUsers'>): Announcement {
    const newAnn: Announcement = {
      ...data,
      id: `ann-${Date.now()}`,
      createdAt: new Date().toLocaleString('vi-VN'),
      readByUsers: []
    };
    const announcements = this.getAnnouncements();
    announcements.unshift(newAnn);
    this.saveAnnouncements(announcements);
    return newAnn;
  }

  static approveAndPublishAnnouncement(id: string, approverId: string, approverName: string): { success: boolean; error?: string } {
    const announcements = this.getAnnouncements();
    const index = announcements.findIndex(a => a.id === id);
    if (index === -1) return { success: false, error: 'Không tìm thấy thông báo!' };

    const ann = announcements[index];
    ann.status = 'PUBLISHED';
    ann.approvedBy = approverId;
    ann.approvedByName = approverName;
    ann.approvedAt = new Date().toLocaleString('vi-VN');
    ann.publishedAt = new Date().toLocaleString('vi-VN');

    announcements[index] = ann;
    this.saveAnnouncements(announcements);
    return { success: true };
  }

  static markAnnouncementRead(id: string, userId: string): void {
    const announcements = this.getAnnouncements();
    const index = announcements.findIndex(a => a.id === id);
    if (index !== -1) {
      const ann = announcements[index];
      if (!ann.readByUsers.includes(userId)) {
        ann.readByUsers.push(userId);
        announcements[index] = ann;
        this.saveAnnouncements(announcements);
      }
    }
  }

  // Requests / Student Administrative Documents
  static getRequests(): StudentRequest[] {
    return safeGet<StudentRequest[]>(STORAGE_KEYS.REQUESTS, INITIAL_REQUESTS);
  }

  static saveRequests(requests: StudentRequest[]): void {
    safeSet(STORAGE_KEYS.REQUESTS, requests);
  }

  static addRequest(data: Omit<StudentRequest, 'id' | 'requestCode' | 'submittedAt' | 'timeline'>): StudentRequest {
    const dateCode = new Date().getFullYear();
    const count = this.getRequests().length + 1;
    const requestCode = `BDU-NN-${dateCode}-${String(count).padStart(3, '0')}`;

    const newReq: StudentRequest = {
      ...data,
      id: `req-${Date.now()}`,
      requestCode,
      submittedAt: new Date().toLocaleString('vi-VN'),
      timeline: [
        {
          id: `tl-${Date.now()}`,
          timestamp: new Date().toLocaleString('vi-VN'),
          actorName: data.studentName,
          actorRole: 'Sinh viên',
          action: 'Nộp đơn trực tuyến trên Cổng học vụ'
        }
      ]
    };

    const requests = this.getRequests();
    requests.unshift(newReq);
    this.saveRequests(requests);
    return newReq;
  }

  static updateRequestStatus(
    id: string, 
    status: StudentRequest['status'], 
    actorName: string, 
    actorRole: string, 
    comment?: string,
    assignedStaffName?: string
  ): { success: boolean; error?: string } {
    const requests = this.getRequests();
    const index = requests.findIndex(r => r.id === id);
    if (index === -1) return { success: false, error: 'Không tìm thấy hồ sơ yêu cầu!' };

    const req = requests[index];
    req.status = status;
    if (assignedStaffName) req.assignedStaffName = assignedStaffName;
    if (comment) req.decisionNote = comment;

    req.timeline.push({
      id: `tl-${Date.now()}`,
      timestamp: new Date().toLocaleString('vi-VN'),
      actorName,
      actorRole,
      action: `Cập nhật trạng thái: ${status}`,
      comment
    });

    requests[index] = req;
    this.saveRequests(requests);
    return { success: true };
  }

  // Tasks
  static getTasks(): FacultyTask[] {
    return safeGet<FacultyTask[]>(STORAGE_KEYS.TASKS, INITIAL_TASKS);
  }

  static saveTasks(tasks: FacultyTask[]): void {
    safeSet(STORAGE_KEYS.TASKS, tasks);
  }

  static addTask(data: Omit<FacultyTask, 'id' | 'taskCode'>): FacultyTask {
    const count = this.getTasks().length + 1;
    const taskCode = `CV-${new Date().getFullYear()}-${String(count).padStart(2, '0')}`;

    const newTask: FacultyTask = {
      ...data,
      id: `task-${Date.now()}`,
      taskCode
    };

    const tasks = this.getTasks();
    tasks.unshift(newTask);
    this.saveTasks(tasks);
    return newTask;
  }

  static updateTaskProgress(id: string, progressPercent: number, submissionNote?: string, evidenceAttachment?: string): { success: boolean } {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return { success: false };

    const task = tasks[index];
    task.progressPercent = progressPercent;
    if (submissionNote) task.submissionNote = submissionNote;
    if (evidenceAttachment) task.evidenceAttachment = evidenceAttachment;
    
    if (progressPercent >= 100 && task.status !== 'ACCEPTED') {
      task.status = 'SUBMITTED';
    } else if (progressPercent > 0 && task.status === 'TODO') {
      task.status = 'IN_PROGRESS';
    }

    tasks[index] = task;
    this.saveTasks(tasks);
    return { success: true };
  }

  static acceptTask(id: string, feedback: string, score: 'Xuất sắc' | 'Đạt yêu cầu' | 'Cần chỉnh sửa'): { success: boolean } {
    const tasks = this.getTasks();
    const index = tasks.findIndex(t => t.id === id);
    if (index === -1) return { success: false };

    const task = tasks[index];
    task.status = 'ACCEPTED';
    task.progressPercent = 100;
    task.acceptanceFeedback = feedback;
    task.acceptanceScore = score;
    task.completedAt = new Date().toLocaleString('vi-VN');

    tasks[index] = task;
    this.saveTasks(tasks);
    return { success: true };
  }

  // Faculty Staff
  static getStaff(): FacultyStaff[] {
    return safeGet<FacultyStaff[]>(STORAGE_KEYS.STAFF, INITIAL_STAFF);
  }

  // Utilities: UTF-8 BOM CSV Export
  static exportToCSV(filename: string, headers: string[], rows: (string | number)[][]): void {
    // Add UTF-8 BOM \uFEFF so Excel displays Vietnamese correctly
    const bom = '\uFEFF';
    const csvContent = [
      headers.map(h => `"${String(h).replace(/"/g, '""')}"`).join(','),
      ...rows.map(row => row.map(cell => `"${String(cell ?? '').replace(/"/g, '""')}"`).join(','))
    ].join('\r\n');

    const blob = new Blob([bom + csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `${filename}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  }

  // CSV Import Parser
  static importStudentsCSV(content: string, operatorName: string): { imported: number; errors: string[] } {
    const lines = content.split(/\r?\n/).filter(line => line.trim().length > 0);
    if (lines.length < 2) {
      return { imported: 0, errors: ['Tệp CSV không có dữ liệu hoặc thiếu dòng tiêu đề.'] };
    }

    const errors: string[] = [];
    let imported = 0;
    const currentStudents = this.getStudents();
    const existingMssvs = new Set(currentStudents.map(s => s.mssv.trim().toLowerCase()));

    // Skip header line
    for (let i = 1; i < lines.length; i++) {
      const line = lines[i].trim();
      if (!line) continue;

      // Simple CSV split handling quotes
      const parts = line.split(',').map(p => p.trim().replace(/^["']|["']$/g, ''));
      if (parts.length < 5) {
        errors.push(`Dòng ${i + 1}: Thiếu cột dữ liệu (cần ít nhất MSSV, Họ tên, Khóa, Ngành, Lớp).`);
        continue;
      }

      const [mssv, fullName, cohort, major, classCode, email, phone, gpa] = parts;

      if (!mssv || !fullName || !major || !classCode) {
        errors.push(`Dòng ${i + 1}: Dữ liệu bắt buộc không hợp lệ (MSSV hoặc Họ tên trống).`);
        continue;
      }

      if (existingMssvs.has(mssv.toLowerCase())) {
        errors.push(`Dòng ${i + 1}: MSSV "${mssv}" đã tồn tại trên hệ thống.`);
        continue;
      }

      existingMssvs.add(mssv.toLowerCase());

      const newStudent: Student = {
        id: `stu-${Date.now()}-${i}`,
        mssv,
        fullName,
        dateOfBirth: '2005-01-01',
        gender: 'Nữ',
        cohort: cohort || 'K24',
        major: (major as any) || 'Ngôn ngữ Anh',
        classCode,
        email: email || `${mssv}@student.bdu.edu.vn`,
        phone: phone || '0900.000.000',
        status: 'STUDYING',
        gpa: parseFloat(gpa) || 3.0,
        drl: 80,
        creditsEarned: 30,
        totalCreditsRequired: 135,
        homeTown: 'Bình Dương',
        address: 'Thủ Dầu Một, Bình Dương',
        admissionDate: '2024-09-01',
        statusHistory: [
          {
            id: `hist-${Date.now()}-${i}`,
            previousStatus: 'STUDYING',
            newStatus: 'STUDYING',
            changedAt: new Date().toLocaleString('vi-VN'),
            changedBy: operatorName,
            reason: 'Nhập dữ liệu sinh viên từ file danh sách Excel/CSV'
          }
        ]
      };

      currentStudents.unshift(newStudent);
      imported++;
    }

    if (imported > 0) {
      this.saveStudents(currentStudents);
    }

    return { imported, errors };
  }

  // Reset to initial clean university data
  static resetToDefault(): void {
    localStorage.removeItem(STORAGE_KEYS.STUDENTS);
    localStorage.removeItem(STORAGE_KEYS.SCHEDULE);
    localStorage.removeItem(STORAGE_KEYS.EXAMS);
    localStorage.removeItem(STORAGE_KEYS.ATTENDANCE);
    localStorage.removeItem(STORAGE_KEYS.ANNOUNCEMENTS);
    localStorage.removeItem(STORAGE_KEYS.REQUESTS);
    localStorage.removeItem(STORAGE_KEYS.TASKS);
    localStorage.removeItem(STORAGE_KEYS.STAFF);
    window.location.reload();
  }
}
