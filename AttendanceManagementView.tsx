/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CheckCircle,
  Clock,
  AlertTriangle,
  History,
  Download,
  Filter,
  Check,
  X,
  FileSpreadsheet,
  ShieldAlert,
  AlertCircle
} from 'lucide-react';
import { AttendanceSession, AttendanceStatus } from '../../types';
import { BduAcademicService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';

export const AttendanceManagementView: React.FC = () => {
  const { currentUser, canTakeAttendance, canExportData } = useAuth();
  const [sessions, setSessions] = useState<AttendanceSession[]>(() => BduAcademicService.getAttendanceSessions());
  const [selectedSessionId, setSelectedSessionId] = useState<string>(sessions[0]?.id || '');

  // Audit modal state for editing attendance with reason
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [editingStudentMssv, setEditingStudentMssv] = useState<string>('');
  const [editingStudentName, setEditingStudentName] = useState<string>('');
  const [currentStatus, setCurrentStatus] = useState<AttendanceStatus>('PRESENT');
  const [newStatus, setNewStatus] = useState<AttendanceStatus>('PRESENT');
  const [editReason, setEditReason] = useState<string>('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const currentSession = sessions.find(s => s.id === selectedSessionId) || sessions[0];

  const refreshSessions = () => {
    setSessions(BduAcademicService.getAttendanceSessions());
  };

  // Quick mark status directly (if allowed) or open audit edit
  const handleMarkStatus = (studentMssv: string, studentName: string, oldStat: AttendanceStatus, targetStat: AttendanceStatus) => {
    if (!canTakeAttendance) {
      alert('Chỉ Giảng viên phụ trách lớp hoặc Giáo vụ mới có quyền điểm danh!');
      return;
    }

    if (currentSession?.isLocked) {
      alert('Buổi học này đã bị khóa điểm danh!');
      return;
    }

    // Open audit modal to provide reason as required by BDU regulations
    setEditingStudentMssv(studentMssv);
    setEditingStudentName(studentName);
    setCurrentStatus(oldStat);
    setNewStatus(targetStat);
    setEditReason(targetStat === 'EXCUSED_ABSENT' ? 'Sinh viên gửi đơn xin phép nghỉ qua cổng học vụ' : 'Cập nhật lại trạng thái điểm danh buổi học');
    setErrorMsg(null);
    setIsEditModalOpen(true);
  };

  const handleConfirmEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentSession) return;

    if (!editReason.trim()) {
      setErrorMsg('Theo quy chế BDU: Bắt buộc phải nhập Lý do chỉnh sửa điểm danh!');
      return;
    }

    const res = BduAcademicService.updateAttendanceRecord(
      currentSession.id,
      editingStudentMssv,
      newStatus,
      editReason,
      currentUser.name
    );

    if (!res.success) {
      setErrorMsg(res.error || 'Lỗi khi cập nhật điểm danh');
      return;
    }

    refreshSessions();
    setIsEditModalOpen(false);
  };

  // Calculate attendance statistics for this session's class
  const totalStudents = currentSession?.records.length || 0;
  const presentCount = currentSession?.records.filter(r => r.status === 'PRESENT').length || 0;
  const lateCount = currentSession?.records.filter(r => r.status === 'LATE').length || 0;
  const excusedCount = currentSession?.records.filter(r => r.status === 'EXCUSED_ABSENT').length || 0;
  const unexcusedCount = currentSession?.records.filter(r => r.status === 'UNEXCUSED_ABSENT').length || 0;

  const attendancePercent = totalStudents > 0 ? Math.round(((presentCount + lateCount) / totalStudents) * 100) : 100;

  // Export attendance sheet
  const handleExportAttendance = () => {
    if (!currentSession) return;

    const headers = ['MSSV', 'Họ và tên', 'Trạng thái điểm danh', 'Ghi chú'];
    const rows = currentSession.records.map(r => [
      r.mssv,
      r.studentName,
      r.status === 'PRESENT' ? 'Có mặt' : r.status === 'LATE' ? 'Đi trễ' : r.status === 'EXCUSED_ABSENT' ? 'Vắng có phép' : 'Vắng không phép',
      r.note || ''
    ]);

    BduAcademicService.exportToCSV(
      `Bang_diem_danh_${currentSession.classSectionCode}_Buoi_${currentSession.sessionNumber}`,
      headers,
      rows
    );
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Quản Lý Chuyên Cần & Điểm Danh (LUỒNG 4)
            </h2>
            <span className="px-2 py-0.5 text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200 rounded-md">
              Học kỳ 1 (2026-2027)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Ghi nhận điểm danh, tự động cảnh báo cấm thi khi vắng &gt; 20% số tiết, lưu vết Audit Log
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canExportData && (
            <button
              onClick={handleExportAttendance}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Xuất Báo Cáo Buổi Này</span>
            </button>
          )}
        </div>
      </div>

      {/* Select Session Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-700">Chọn Lớp & Buổi học:</span>
          <select
            value={selectedSessionId}
            onChange={e => setSelectedSessionId(e.target.value)}
            className="px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E] bg-white font-semibold text-slate-800"
          >
            {sessions.map(s => (
              <option key={s.id} value={s.id}>
                {s.classSectionCode} - {s.courseName} (Buổi {s.sessionNumber}/{s.totalSessions} - {s.date})
              </option>
            ))}
          </select>
        </div>

        {currentSession && (
          <div className="flex items-center gap-4 text-xs text-slate-600">
            <span>Phòng: <strong className="text-slate-900">{currentSession.room}</strong></span>
            <span>•</span>
            <span>Giảng viên: <strong className="text-slate-900">{currentSession.lecturerName}</strong></span>
          </div>
        )}
      </div>

      {/* Summary KPI Cards for this session */}
      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
        <div className="bg-white p-3.5 rounded-xl border border-slate-200 text-center">
          <span className="text-[10px] font-bold text-slate-400 uppercase">Sĩ số danh sách</span>
          <div className="text-xl font-extrabold text-slate-900 mt-0.5">{totalStudents}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-emerald-200 text-center bg-emerald-50/30">
          <span className="text-[10px] font-bold text-emerald-700 uppercase">Có mặt</span>
          <div className="text-xl font-extrabold text-emerald-700 mt-0.5">{presentCount}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-amber-200 text-center bg-amber-50/30">
          <span className="text-[10px] font-bold text-amber-700 uppercase">Đi trễ</span>
          <div className="text-xl font-extrabold text-amber-700 mt-0.5">{lateCount}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-blue-200 text-center bg-blue-50/30">
          <span className="text-[10px] font-bold text-blue-700 uppercase">Vắng có phép</span>
          <div className="text-xl font-extrabold text-blue-700 mt-0.5">{excusedCount}</div>
        </div>

        <div className="bg-white p-3.5 rounded-xl border border-rose-200 text-center bg-rose-50/30">
          <span className="text-[10px] font-bold text-rose-700 uppercase">Vắng không phép</span>
          <div className="text-xl font-extrabold text-rose-700 mt-0.5">{unexcusedCount}</div>
        </div>
      </div>

      {/* Main Attendance Table */}
      {currentSession && (
        <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
          <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Danh Sách Sinh Viên & Kết Quả Điểm Danh Buổi {currentSession.sessionNumber}
            </h3>
            <span className="text-xs font-bold text-[#C8102E]">
              Tỷ lệ chuyên cần buổi này: {attendancePercent}%
            </span>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                <tr>
                  <th className="px-4 py-3">STT</th>
                  <th className="px-4 py-3">MSSV</th>
                  <th className="px-4 py-3">Họ và tên</th>
                  <th className="px-4 py-3 text-center">Trạng thái hiện tại</th>
                  <th className="px-4 py-3">Cảnh báo chuyên cần</th>
                  <th className="px-4 py-3 text-center">Thao tác đổi trạng thái</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentSession.records.map((rec, idx) => {
                  // If absent without excuse, simulate check against 20% threshold
                  const isCriticalAbsence = rec.status === 'UNEXCUSED_ABSENT';

                  return (
                    <tr key={rec.mssv} className="hover:bg-slate-50">
                      <td className="px-4 py-3 text-slate-400 font-mono">{idx + 1}</td>
                      <td className="px-4 py-3 font-mono font-bold text-[#C8102E]">{rec.mssv}</td>
                      <td className="px-4 py-3 font-semibold text-slate-900">{rec.studentName}</td>
                      <td className="px-4 py-3 text-center">
                        {rec.status === 'PRESENT' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                            Có mặt
                          </span>
                        )}
                        {rec.status === 'LATE' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">
                            Đi trễ
                          </span>
                        )}
                        {rec.status === 'EXCUSED_ABSENT' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">
                            Vắng có phép
                          </span>
                        )}
                        {rec.status === 'UNEXCUSED_ABSENT' && (
                          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">
                            Vắng không phép
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3">
                        {isCriticalAbsence ? (
                          <div className="flex items-center gap-1.5 text-rose-700 font-bold text-[11px]">
                            <ShieldAlert className="w-3.5 h-3.5 text-rose-600" />
                            <span>Vắng 3 buổi (&gt;20%) - Nguy cơ CẤM THI</span>
                          </div>
                        ) : (
                          <span className="text-slate-400 text-[11px]">Bình thường (Đủ điều kiện thi)</span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-center">
                        {canTakeAttendance && (
                          <div className="inline-flex items-center gap-1">
                            <button
                              onClick={() => handleMarkStatus(rec.mssv, rec.studentName, rec.status, 'PRESENT')}
                              className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
                                rec.status === 'PRESENT' ? 'bg-emerald-600 text-white border-emerald-600' : 'bg-white text-emerald-700 border-emerald-300 hover:bg-emerald-50'
                              }`}
                            >
                              Có mặt
                            </button>
                            <button
                              onClick={() => handleMarkStatus(rec.mssv, rec.studentName, rec.status, 'LATE')}
                              className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
                                rec.status === 'LATE' ? 'bg-amber-600 text-white border-amber-600' : 'bg-white text-amber-700 border-amber-300 hover:bg-amber-50'
                              }`}
                            >
                              Trễ
                            </button>
                            <button
                              onClick={() => handleMarkStatus(rec.mssv, rec.studentName, rec.status, 'EXCUSED_ABSENT')}
                              className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
                                rec.status === 'EXCUSED_ABSENT' ? 'bg-blue-600 text-white border-blue-600' : 'bg-white text-blue-700 border-blue-300 hover:bg-blue-50'
                              }`}
                            >
                              Có phép
                            </button>
                            <button
                              onClick={() => handleMarkStatus(rec.mssv, rec.studentName, rec.status, 'UNEXCUSED_ABSENT')}
                              className={`px-2 py-1 rounded text-[10px] font-bold border transition-colors ${
                                rec.status === 'UNEXCUSED_ABSENT' ? 'bg-rose-600 text-white border-rose-600' : 'bg-white text-rose-700 border-rose-300 hover:bg-rose-50'
                              }`}
                            >
                              Không phép
                            </button>
                          </div>
                        )}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Audit Log for Attendance Modifications */}
      {currentSession && currentSession.auditLogs && (
        <div className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center gap-2 mb-3">
            <History className="w-4 h-4 text-[#C8102E]" />
            <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Nhật Ký Chỉnh Sửa Điểm Danh (Audit Trail Buổi Này)
            </h4>
          </div>

          {currentSession.auditLogs.length === 0 ? (
            <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
              Chưa có thao tác chỉnh sửa nào ngoài giờ điểm danh ban đầu.
            </div>
          ) : (
            <div className="space-y-2">
              {currentSession.auditLogs.map(log => (
                <div key={log.id} className="p-3 rounded-lg border border-slate-200 bg-slate-50/80 text-xs flex items-center justify-between">
                  <div>
                    <span className="font-semibold text-slate-800">
                      MSSV {log.studentMssv}: {log.oldStatus} → {log.newStatus}
                    </span>
                    <span className="text-slate-500 block text-[11px] mt-0.5">
                      Lý do: {log.reason}
                    </span>
                  </div>
                  <div className="text-right text-[11px] text-slate-400">
                    <div>{log.updatedBy}</div>
                    <div>{log.timestamp}</div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Audit Edit Reason Modal */}
      {isEditModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Xác Nhận & Ghi Nhật Ký Điểm Danh
              </h3>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {errorMsg && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                <span>{errorMsg}</span>
              </div>
            )}

            <form onSubmit={handleConfirmEdit} className="space-y-3 text-xs">
              <div className="p-3 rounded-lg bg-slate-50 border border-slate-100">
                <div className="font-bold text-slate-800">{editingStudentName} ({editingStudentMssv})</div>
                <div className="text-slate-500 mt-1">
                  Đổi trạng thái: <strong className="text-slate-700">{currentStatus}</strong> → <strong className="text-[#C8102E]">{newStatus}</strong>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">
                  Lý do chỉnh sửa (Bắt buộc theo quy chế đảm bảo chất lượng BDU) *:
                </label>
                <textarea
                  required
                  rows={3}
                  value={editReason}
                  onChange={e => setEditReason(e.target.value)}
                  placeholder="Nhập lý do cụ thể..."
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#C8102E] hover:bg-[#A50D25] text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Ghi Nhận & Lưu Audit Log
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
