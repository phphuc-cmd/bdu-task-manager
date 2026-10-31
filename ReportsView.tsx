/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  BarChart3,
  Download,
  Filter,
  CheckCircle2,
  AlertTriangle,
  TrendingUp,
  FileSpreadsheet,
  Users,
  GraduationCap
} from 'lucide-react';
import { BduAcademicService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';

export const ReportsView: React.FC = () => {
  const { canExportData } = useAuth();
  const students = BduAcademicService.getStudents();
  const schedule = BduAcademicService.getSchedule();
  const staff = BduAcademicService.getStaff();
  const requests = BduAcademicService.getRequests();
  const tasks = BduAcademicService.getTasks();

  const [reportType, setReportType] = useState<'attendance' | 'academic' | 'teaching' | 'requests'>('academic');

  // Academic breakdown
  const excellentStudents = students.filter(s => s.gpa >= 3.6).length;
  const goodStudents = students.filter(s => s.gpa >= 3.2 && s.gpa < 3.6).length;
  const fairStudents = students.filter(s => s.gpa >= 2.5 && s.gpa < 3.2).length;
  const averageStudents = students.filter(s => s.gpa >= 2.0 && s.gpa < 2.5).length;
  const warnStudents = students.filter(s => s.gpa < 2.0 || s.status === 'ACADEMIC_WARN').length;

  const handleExportSummaryReport = () => {
    const headers = ['MSSV', 'Họ và tên', 'Ngành', 'Lớp', 'GPA', 'ĐRL', 'Tình trạng', 'Tín chỉ'];
    const rows = students.map(s => [
      s.mssv,
      s.fullName,
      s.major,
      s.classCode,
      s.gpa,
      s.drl,
      s.status,
      s.creditsEarned
    ]);

    BduAcademicService.exportToCSV(`Bao_cao_hoc_vu_tong_hop_Khoa_Ngoai_Ngu_BDU_${Date.now()}`, headers, rows);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Báo Cáo & Thống Kê Học Vụ Khoa Ngoại Ngữ
            </h2>
            <span className="px-2 py-0.5 text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200 rounded-md">
              Học kỳ 1 (2026-2027)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Tổng hợp dữ liệu đào tạo, chất lượng học tập, định mức giảng dạy và hiệu suất học vụ
          </p>
        </div>

        {canExportData && (
          <button
            onClick={handleExportSummaryReport}
            className="flex items-center gap-1.5 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Download className="w-4 h-4" />
            <span>Xuất Báo Cáo Toàn Diện</span>
          </button>
        )}
      </div>

      {/* Report Selector Pills */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => setReportType('academic')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            reportType === 'academic'
              ? 'bg-[#C8102E] text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Phân Loại Học Lực & GPA
        </button>
        <button
          onClick={() => setReportType('teaching')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            reportType === 'teaching'
              ? 'bg-[#C8102E] text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Định Mức Giờ Giảng Giảng Viên
        </button>
        <button
          onClick={() => setReportType('requests')}
          className={`px-4 py-2 rounded-xl text-xs font-bold transition-all ${
            reportType === 'requests'
              ? 'bg-[#C8102E] text-white shadow-xs'
              : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
          }`}
        >
          Tỷ Lệ Xử Lý Đơn Từ & Hồ Sơ SV
        </button>
      </div>

      {/* Academic report section */}
      {reportType === 'academic' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Phổ Điểm GPA & Đánh Giá Học Lực Toàn Khoa
            </h3>

            <div className="space-y-3">
              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Xuất sắc (GPA ≥ 3.6):</span>
                  <span className="font-bold text-emerald-600">{excellentStudents} sinh viên ({Math.round((excellentStudents/students.length)*100)}%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${(excellentStudents/students.length)*100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Giỏi (3.2 ≤ GPA &lt; 3.6):</span>
                  <span className="font-bold text-blue-600">{goodStudents} sinh viên ({Math.round((goodStudents/students.length)*100)}%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-blue-500 rounded-full" style={{ width: `${(goodStudents/students.length)*100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Khá (2.5 ≤ GPA &lt; 3.2):</span>
                  <span className="font-bold text-slate-700">{fairStudents} sinh viên ({Math.round((fairStudents/students.length)*100)}%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-slate-500 rounded-full" style={{ width: `${(fairStudents/students.length)*100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Trung bình (2.0 ≤ GPA &lt; 2.5):</span>
                  <span className="font-bold text-amber-600">{averageStudents} sinh viên ({Math.round((averageStudents/students.length)*100)}%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-amber-500 rounded-full" style={{ width: `${(averageStudents/students.length)*100}%` }} />
                </div>
              </div>

              <div>
                <div className="flex justify-between text-xs font-semibold text-slate-700 mb-1">
                  <span>Yếu / Cảnh báo học vụ (GPA &lt; 2.0):</span>
                  <span className="font-bold text-rose-600">{warnStudents} sinh viên ({Math.round((warnStudents/students.length)*100)}%)</span>
                </div>
                <div className="w-full h-2.5 bg-slate-100 rounded-full overflow-hidden">
                  <div className="h-full bg-rose-500 rounded-full" style={{ width: `${(warnStudents/students.length)*100}%` }} />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Khuyến Nghị Học Vụ BDU
            </h3>
            <div className="space-y-3 text-xs text-slate-600">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-bold text-slate-800 block mb-0.5">Tư vấn sinh viên cảnh báo:</span>
                Cần xếp lịch gặp gỡ cố vấn học tập cho sinh viên có GPA &lt; 2.0 trước tuần thi kết thúc học phần.
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <span className="font-bold text-slate-800 block mb-0.5">Xét học bổng khuyến khích:</span>
                Có {excellentStudents + goodStudents} sinh viên đạt điều kiện nộp hồ sơ xét học bổng khuyến khích học tập HK1.
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Teaching Hours Report */}
      {reportType === 'teaching' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs overflow-hidden">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-4">
            Khối Lượng Giảng Dạy & Nhiệm Vụ Giảng Viên Khoa Ngoại Ngữ
          </h3>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">Mã CBGV</th>
                  <th className="px-4 py-3">Giảng viên</th>
                  <th className="px-4 py-3">Học vị / Bộ môn</th>
                  <th className="px-4 py-3 text-center">Giờ chuẩn HK1</th>
                  <th className="px-4 py-3 text-center">Nhiệm vụ đang phụ trách</th>
                  <th className="px-4 py-3 text-center">Trạng thái định mức</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {staff.map(s => {
                  const isSufficient = s.teachingHoursThisSemester >= 120;

                  return (
                    <tr key={s.id} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-mono font-bold text-[#C8102E]">{s.staffCode}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{s.fullName}</td>
                      <td className="px-4 py-3 text-slate-600">{s.degree} - {s.department}</td>
                      <td className="px-4 py-3 text-center font-bold text-slate-800 font-mono">
                        {s.teachingHoursThisSemester} giờ
                      </td>
                      <td className="px-4 py-3 text-center font-bold text-blue-700">
                        {s.activeTasksCount} nhiệm vụ
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                          isSufficient ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                        }`}>
                          {isSufficient ? 'Đạt định mức' : 'Đang hoàn thành'}
                        </span>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Requests Resolution Report */}
      {reportType === 'requests' && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs space-y-4">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
            Hiệu Suất Giải Quyết Hồ Sơ Đơn Từ Trực Tuyến
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="p-4 rounded-xl bg-blue-50 border border-blue-200 text-center">
              <span className="text-xs text-blue-800 font-semibold uppercase">Tổng đơn tiếp nhận</span>
              <div className="text-2xl font-extrabold text-blue-900 mt-1">{requests.length}</div>
            </div>
            <div className="p-4 rounded-xl bg-emerald-50 border border-emerald-200 text-center">
              <span className="text-xs text-emerald-800 font-semibold uppercase">Đã phê duyệt / Hoàn tất</span>
              <div className="text-2xl font-extrabold text-emerald-900 mt-1">
                {requests.filter(r => r.status === 'APPROVED' || r.status === 'COMPLETED').length}
              </div>
            </div>
            <div className="p-4 rounded-xl bg-amber-50 border border-amber-200 text-center">
              <span className="text-xs text-amber-800 font-semibold uppercase">Đang thụ lý</span>
              <div className="text-2xl font-extrabold text-amber-900 mt-1">
                {requests.filter(r => r.status === 'SUBMITTED' || r.status === 'IN_REVIEW').length}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
