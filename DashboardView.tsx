/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Users,
  CalendarDays,
  FileText,
  AlertTriangle,
  GraduationCap,
  Clock,
  CheckCircle,
  TrendingUp,
  ArrowUpRight,
  ShieldAlert,
  BellRing,
  BookOpen
} from 'lucide-react';
import { BduAcademicService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';

interface DashboardViewProps {
  onNavigateTab: (tabId: string) => void;
}

export const DashboardView: React.FC<DashboardViewProps> = ({ onNavigateTab }) => {
  const { currentUser, activeRole } = useAuth();

  const students = BduAcademicService.getStudents();
  const schedule = BduAcademicService.getSchedule();
  const attendanceSessions = BduAcademicService.getAttendanceSessions();
  const requests = BduAcademicService.getRequests();
  const tasks = BduAcademicService.getTasks();
  const announcements = BduAcademicService.getAnnouncements();

  // Metrics
  const totalStudents = students.length;
  const studyingStudents = students.filter(s => s.status === 'STUDYING').length;
  const academicWarnStudents = students.filter(s => s.status === 'ACADEMIC_WARN').length;
  const reservedStudents = students.filter(s => s.status === 'RESERVED').length;

  const pendingRequests = requests.filter(r => r.status === 'SUBMITTED' || r.status === 'IN_REVIEW');
  const activeTasks = tasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'TODO');
  const publishedAnnouncements = announcements.filter(a => a.status === 'PUBLISHED');

  // Overall attendance calculation
  let totalAttendChecks = 0;
  let totalPresentCount = 0;
  attendanceSessions.forEach(sess => {
    sess.records.forEach(rec => {
      totalAttendChecks++;
      if (rec.status === 'PRESENT' || rec.status === 'LATE') {
        totalPresentCount++;
      }
    });
  });
  const overallAttendanceRate = totalAttendChecks > 0 ? Math.round((totalPresentCount / totalAttendChecks) * 100) : 92;

  // Major distribution
  const majorStats = {
    'Ngôn ngữ Anh': students.filter(s => s.major === 'Ngôn ngữ Anh').length,
    'Ngôn ngữ Trung Quốc': students.filter(s => s.major === 'Ngôn ngữ Trung Quốc').length,
    'Ngôn ngữ Hàn Quốc': students.filter(s => s.major === 'Ngôn ngữ Hàn Quốc').length,
  };

  return (
    <div className="space-y-6">
      {/* Welcome Banner */}
      <div className="relative overflow-hidden bg-gradient-to-r from-[#C8102E] via-[#A50D25] to-slate-900 rounded-2xl p-6 sm:p-8 text-white shadow-md">
        <div className="relative z-10 max-w-2xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/15 text-white text-xs font-semibold backdrop-blur-xs mb-3 border border-white/20">
            <span>KHOA NGOẠI NGỮ – ĐẠI HỌC BÌNH DƯƠNG</span>
          </div>
          <h1 className="text-xl sm:text-3xl font-extrabold tracking-tight">
            Xin chào, {currentUser.name}!
          </h1>
          <p className="mt-2 text-white/80 text-xs sm:text-sm leading-relaxed">
            Hệ thống quản trị học vụ và đào tạo trực tuyến. Đang vận hành theo tiêu chuẩn kiểm định chất lượng giáo dục đại học.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <button
              onClick={() => onNavigateTab('students')}
              className="px-4 py-2 bg-white text-[#C8102E] hover:bg-slate-100 rounded-xl text-xs font-bold transition-all shadow-xs"
            >
              Tra cứu Sinh viên
            </button>
            <button
              onClick={() => onNavigateTab('schedule')}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition-all border border-white/30 backdrop-blur-xs"
            >
              Thời khóa biểu tuần
            </button>
            <button
              onClick={() => onNavigateTab('attendance')}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-xl text-xs font-bold transition-all border border-white/30 backdrop-blur-xs"
            >
              Điểm danh & Chuyên cần
            </button>
          </div>
        </div>

        {/* Decorative background shape */}
        <div className="absolute right-0 bottom-0 translate-x-10 translate-y-10 w-72 h-72 rounded-full bg-white/5 pointer-events-none blur-2xl" />
      </div>

      {/* Primary KPI Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Students */}
        <div 
          onClick={() => onNavigateTab('students')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-red-200 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Tổng số sinh viên
            </span>
            <div className="w-9 h-9 rounded-lg bg-red-50 text-[#C8102E] flex items-center justify-center group-hover:scale-105 transition-transform">
              <Users className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{totalStudents}</span>
            <span className="text-xs text-emerald-600 font-semibold flex items-center">
              <TrendingUp className="w-3.5 h-3.5 mr-0.5" /> {studyingStudents} đang học
            </span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Bảo lưu: {reservedStudents}</span>
            <span className="text-amber-600 font-medium">Cảnh báo HV: {academicWarnStudents}</span>
          </div>
        </div>

        {/* Card 2: Attendance Rate */}
        <div 
          onClick={() => onNavigateTab('attendance')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-emerald-200 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Tỷ lệ chuyên cần chung
            </span>
            <div className="w-9 h-9 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CheckCircle className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{overallAttendanceRate}%</span>
            <span className="text-xs text-slate-500 font-medium">Toàn khóa</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>{attendanceSessions.length} buổi đã ghi nhận</span>
            <span className="text-emerald-600 font-semibold">Đạt chuẩn</span>
          </div>
        </div>

        {/* Card 3: Pending Requests */}
        <div 
          onClick={() => onNavigateTab('requests')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-blue-200 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Hồ sơ học vụ cần xử lý
            </span>
            <div className="w-9 h-9 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <FileText className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{pendingRequests.length}</span>
            <span className="text-xs text-blue-600 font-semibold">Đơn trực tuyến</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>Tổng hồ sơ: {requests.length}</span>
            <span className="text-[#C8102E] font-semibold flex items-center gap-0.5">
              Xử lý ngay <ArrowUpRight className="w-3 h-3" />
            </span>
          </div>
        </div>

        {/* Card 4: Schedule Today */}
        <div 
          onClick={() => onNavigateTab('schedule')}
          className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs hover:border-purple-200 hover:shadow-md transition-all cursor-pointer group"
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold uppercase tracking-wider text-slate-500">
              Lớp học phần đang mở
            </span>
            <div className="w-9 h-9 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center group-hover:scale-105 transition-transform">
              <CalendarDays className="w-5 h-5" />
            </div>
          </div>
          <div className="mt-3 flex items-baseline gap-2">
            <span className="text-2xl sm:text-3xl font-extrabold text-slate-900">{schedule.length}</span>
            <span className="text-xs text-slate-500">Lớp tín chỉ</span>
          </div>
          <div className="mt-3 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
            <span>3 ngành đào tạo</span>
            <span className="text-purple-600 font-medium">Học kỳ 1 (2026-2027)</span>
          </div>
        </div>
      </div>

      {/* Main Grid: Schedule today & Urgent Announcements */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Today's Schedule Overview */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                Thời Khóa Biểu Giảng Dạy & Học Tập Tuần Này
              </h3>
              <p className="text-xs text-slate-500">Khoa Ngoại ngữ – Khu giảng đường Nhà A & Nhà B</p>
            </div>
            <button
              onClick={() => onNavigateTab('schedule')}
              className="text-xs font-bold text-[#C8102E] hover:underline flex items-center gap-1"
            >
              Xem chi tiết <ArrowUpRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="space-y-3">
            {schedule.slice(0, 4).map(item => (
              <div
                key={item.id}
                className="p-3.5 rounded-xl border border-slate-100 bg-slate-50/70 hover:bg-slate-50 transition-colors flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-red-100 text-[#C8102E] font-bold text-xs flex flex-col items-center justify-center shrink-0 border border-red-200">
                    <span>{item.dayOfWeek.replace('Thứ ', 'T')}</span>
                    <span className="text-[10px] font-mono">{item.courseCode}</span>
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-bold text-slate-900">{item.courseName}</h4>
                    <div className="flex flex-wrap items-center gap-2 mt-1 text-[11px] text-slate-500">
                      <span className="font-semibold text-slate-700">Lớp: {item.targetClass}</span>
                      <span>•</span>
                      <span>{item.shift}</span>
                      <span>•</span>
                      <span className="font-medium text-slate-700 bg-white px-2 py-0.5 rounded border border-slate-200">
                        {item.room}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="text-left sm:text-right shrink-0">
                  <div className="text-xs font-semibold text-slate-800">{item.lecturerName}</div>
                  <div className="text-[10px] text-slate-400 mt-0.5">Sĩ số: {item.enrolledStudentsCount}/{item.maxStudents} SV</div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right: Urgent Faculty Announcements & Alerts */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-2">
                <BellRing className="w-4 h-4 text-[#C8102E]" />
                <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
                  Thông Báo Mới Phát Hành
                </h3>
              </div>
              <button
                onClick={() => onNavigateTab('announcements')}
                className="text-xs font-bold text-[#C8102E] hover:underline"
              >
                Tất cả
              </button>
            </div>

            <div className="space-y-3">
              {publishedAnnouncements.slice(0, 3).map(ann => (
                <div 
                  key={ann.id}
                  onClick={() => onNavigateTab('announcements')}
                  className="p-3 rounded-lg border border-slate-100 hover:border-slate-200 cursor-pointer transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-red-50 text-[#C8102E] border border-red-200">
                      {ann.category}
                    </span>
                    <span className="text-[10px] text-slate-400">{ann.publishedAt || ann.createdAt}</span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-800 mt-1 line-clamp-1">{ann.title}</h5>
                  <p className="text-[11px] text-slate-500 mt-0.5 line-clamp-2 leading-relaxed">
                    {ann.summary}
                  </p>
                </div>
              ))}
            </div>
          </div>

          {/* Quick Notice about Academic Rule */}
          <div className="mt-4 p-3 rounded-xl bg-amber-50 border border-amber-200 text-amber-900 text-xs">
            <div className="flex items-center gap-1.5 font-bold mb-1">
              <ShieldAlert className="w-4 h-4 text-amber-600 shrink-0" />
              <span>Quy chế học vụ BDU 2026:</span>
            </div>
            <p className="text-[11px] text-amber-800 leading-relaxed">
              Sinh viên vắng quá 20% số tiết sẽ bị cấm thi học phần. Tuyệt đối không tự ý chuyển sinh viên vắng nhiều thành thôi học nếu chưa có Quyết định chính thức.
            </p>
          </div>
        </div>
      </div>

      {/* Distribution by Major & Academic Warning watchlist */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Major Distribution */}
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
            Quy Mô Đào Tạo Theo Ngành
          </h3>
          <div className="space-y-4">
            {Object.entries(majorStats).map(([major, count]) => {
              const pct = totalStudents > 0 ? Math.round((count / totalStudents) * 100) : 0;
              return (
                <div key={major}>
                  <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                    <span>{major}</span>
                    <span>{count} sinh viên ({pct}%)</span>
                  </div>
                  <div className="w-full h-2 rounded-full bg-slate-100 overflow-hidden">
                    <div 
                      className="h-full bg-[#C8102E] rounded-full transition-all duration-500" 
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Academic Warning Watchlist */}
        <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider text-amber-700 flex items-center gap-1.5">
                <AlertTriangle className="w-4 h-4" />
                Danh Sách Theo Dõi Cảnh Báo Học Vụ & Chuyên Cần
              </h3>
              <p className="text-xs text-slate-500">
                Các sinh viên cần cố vấn học tập gặp gỡ và tư vấn cải thiện điểm
              </p>
            </div>
            <button
              onClick={() => onNavigateTab('students')}
              className="text-xs font-bold text-slate-700 hover:text-[#C8102E]"
            >
              Xem toàn bộ danh sách
            </button>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
                <tr>
                  <th className="px-3 py-2.5">MSSV</th>
                  <th className="px-3 py-2.5">Họ và tên</th>
                  <th className="px-3 py-2.5">Lớp</th>
                  <th className="px-3 py-2.5 text-center">GPA</th>
                  <th className="px-3 py-2.5">Tình trạng học vụ</th>
                  <th className="px-3 py-2.5 text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {students.filter(s => s.status === 'ACADEMIC_WARN' || s.gpa < 2.0).map(s => (
                  <tr key={s.id} className="hover:bg-slate-50">
                    <td className="px-3 py-2.5 font-mono font-bold text-[#C8102E]">{s.mssv}</td>
                    <td className="px-3 py-2.5 font-semibold text-slate-900">{s.fullName}</td>
                    <td className="px-3 py-2.5 text-slate-600">{s.classCode}</td>
                    <td className="px-3 py-2.5 text-center font-bold text-rose-600">{s.gpa.toFixed(2)}</td>
                    <td className="px-3 py-2.5">
                      <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                        Cảnh báo học vụ
                      </span>
                    </td>
                    <td className="px-3 py-2.5 text-right">
                      <button
                        onClick={() => onNavigateTab('students')}
                        className="text-xs text-blue-600 hover:underline font-semibold"
                      >
                        Hồ sơ SV
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
