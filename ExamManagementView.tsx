/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CalendarCheck2,
  Plus,
  Clock,
  MapPin,
  Users,
  AlertTriangle,
  CheckCircle2,
  X,
  Printer,
  FileSpreadsheet,
  Download,
  ShieldCheck
} from 'lucide-react';
import { ExamItem } from '../../types';
import { BduAcademicService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';

export const ExamManagementView: React.FC = () => {
  const { canManageSchedule, canExportData } = useAuth();
  const [exams, setExams] = useState<ExamItem[]>(() => BduAcademicService.getExams());
  const staffList = BduAcademicService.getStaff();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [filterFormat, setFilterFormat] = useState('ALL');

  // Form State
  const [courseCode, setCourseCode] = useState('ENG201');
  const [courseName, setCourseName] = useState('Ngữ pháp Nâng cao Tiếng Anh');
  const [classSectionCode, setClassSectionCode] = useState('24DTA01_ENG201');
  const [examDate, setExamDate] = useState('2026-11-20');
  const [examShift, setExamShift] = useState('Ca 1 (07:30 - 09:00)');
  const [room, setRoom] = useState('P.A204');
  const [studentCount, setStudentCount] = useState(38);
  const [format, setFormat] = useState<ExamItem['format']>('Tự luận');
  const [proctor1Id, setProctor1Id] = useState(staffList[0]?.id || 'staff-1');
  const [proctor2Id, setProctor2Id] = useState(staffList[1]?.id || 'staff-2');

  const [conflictError, setConflictError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const refreshExams = () => {
    setExams(BduAcademicService.getExams());
  };

  const handleOpenAdd = () => {
    setCourseCode('ENG302');
    setCourseName('Biên dịch 1');
    setClassSectionCode('23DTA02_ENG302');
    setExamDate('2026-11-22');
    setExamShift('Ca 2 (09:30 - 11:00)');
    setRoom('P.A205');
    setStudentCount(40);
    setFormat('Tự luận');
    setProctor1Id(staffList[2]?.id || 'staff-3');
    setProctor2Id(staffList[4]?.id || 'staff-5');
    setConflictError(null);
    setSuccessMessage(null);
    setIsModalOpen(true);
  };

  const handleSaveExam = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictError(null);
    setSuccessMessage(null);

    const p1 = staffList.find(s => s.id === proctor1Id);
    const p2 = staffList.find(s => s.id === proctor2Id);

    const examData: Omit<ExamItem, 'id'> = {
      courseCode,
      courseName,
      classSectionCode,
      examDate,
      examShift,
      room,
      studentCount,
      format,
      proctor1Id,
      proctor1Name: p1 ? p1.fullName : 'Cán bộ coi thi 1',
      proctor2Id,
      proctor2Name: p2 ? p2.fullName : 'Cán bộ coi thi 2',
      status: 'SCHEDULED'
    };

    const res = BduAcademicService.addExam(examData);
    if (!res.success) {
      setConflictError(res.error || 'Lỗi trùng lịch phòng thi hoặc giám thị');
      return;
    }

    setSuccessMessage('Xếp lịch thi thành công! Dữ liệu đã được lưu trữ.');
    refreshExams();
    setTimeout(() => {
      setIsModalOpen(false);
      setSuccessMessage(null);
    }, 900);
  };

  const handleExportExams = () => {
    const headers = [
      'Mã HP',
      'Tên học phần',
      'Lớp HP',
      'Ngày thi',
      'Ca thi',
      'Phòng thi',
      'Số SV',
      'Hình thức thi',
      'Giám thị 1',
      'Giám thị 2'
    ];

    const rows = exams.map(e => [
      e.courseCode,
      e.courseName,
      e.classSectionCode,
      e.examDate,
      e.examShift,
      e.room,
      e.studentCount,
      e.format,
      e.proctor1Name,
      e.proctor2Name
    ]);

    BduAcademicService.exportToCSV(`Lich_thi_Khoa_Ngoai_Ngu_BDU_${Date.now()}`, headers, rows);
  };

  const filteredExams = exams.filter(e => {
    return filterFormat === 'ALL' || e.format === filterFormat;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Quản Lý Lịch Thi & Phân Công Coi Thi Học Kỳ
            </h2>
            <span className="px-2 py-0.5 text-xs font-bold bg-amber-50 text-amber-800 border border-amber-200 rounded-md">
              Đợt thi Học kỳ 1 (2026-2027)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Kiểm tra xung đột phòng thi, ngăn chặn trùng giám thị 1 & 2, xuất danh sách phòng thi
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canManageSchedule && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#C8102E] hover:bg-[#A50D25] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Xếp Lịch Thi Mới</span>
            </button>
          )}

          {canExportData && (
            <button
              onClick={handleExportExams}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 transition-colors"
            >
              <Download className="w-4 h-4" />
              <span>Xuất Lịch Thi</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex items-center justify-between">
        <div className="flex items-center gap-3">
          <span className="text-xs font-bold text-slate-700">Lọc theo hình thức thi:</span>
          <select
            value={filterFormat}
            onChange={e => setFilterFormat(e.target.value)}
            className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
          >
            <option value="ALL">Tất cả hình thức</option>
            <option value="Tự luận">Tự luận</option>
            <option value="Vấn đáp (Oral Exam)">Vấn đáp (Oral Exam)</option>
            <option value="Trắc nghiệm máy">Trắc nghiệm máy</option>
            <option value="Tiểu luận môn học">Tiểu luận môn học</option>
          </select>
        </div>
        <div className="text-xs text-slate-500">
          Tổng số ca thi: <strong className="text-slate-800">{filteredExams.length}</strong> ca
        </div>
      </div>

      {/* Exam Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredExams.map(exam => (
          <div
            key={exam.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-red-200 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between">
                <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-slate-100 text-slate-700">
                  {exam.courseCode}
                </span>
                <span className="text-[11px] font-bold px-2 py-0.5 rounded bg-blue-50 text-blue-800 border border-blue-200">
                  {exam.format}
                </span>
              </div>

              <h4 className="text-sm font-bold text-slate-900 mt-2 line-clamp-1">{exam.courseName}</h4>
              <div className="text-xs text-slate-500 mt-0.5">Lớp: {exam.classSectionCode}</div>

              <div className="mt-4 space-y-2 text-xs border-t border-slate-100 pt-3">
                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-slate-400" /> Ngày & Ca thi:
                  </span>
                  <span className="font-bold text-slate-800">{exam.examDate} ({exam.examShift.split(' ')[0]})</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-[#C8102E]" /> Phòng thi:
                  </span>
                  <span className="font-bold text-slate-900 bg-red-50 text-[#C8102E] px-2 py-0.5 rounded border border-red-200">
                    {exam.room}
                  </span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-slate-500 flex items-center gap-1.5">
                    <Users className="w-3.5 h-3.5 text-slate-400" /> Sĩ số thí sinh:
                  </span>
                  <span className="font-semibold text-slate-800">{exam.studentCount} sinh viên</span>
                </div>
              </div>
            </div>

            {/* Proctors Section */}
            <div className="mt-4 pt-3 border-t border-slate-100 bg-slate-50/70 -mx-5 -mb-5 p-4 rounded-b-xl">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                Cán bộ coi thi phân công:
              </span>
              <div className="space-y-1 text-xs">
                <div className="text-slate-700">
                  1. <span className="font-semibold">{exam.proctor1Name}</span>
                </div>
                <div className="text-slate-700">
                  2. <span className="font-semibold">{exam.proctor2Name}</span>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Exam Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Xếp Lịch Thi & Phân Công Cán Bộ Coi Thi
                </h3>
                <p className="text-xs text-slate-500">
                  Tự động kiểm tra trùng phòng thi và trùng lịch giám thị
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {conflictError && (
              <div className="p-3 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-600 shrink-0 mt-0.5" />
                <span>{conflictError}</span>
              </div>
            )}

            {successMessage && (
              <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                <span>{successMessage}</span>
              </div>
            )}

            <form onSubmit={handleSaveExam} className="space-y-3 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mã học phần *</label>
                  <input
                    type="text"
                    required
                    value={courseCode}
                    onChange={e => setCourseCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tên môn học *</label>
                  <input
                    type="text"
                    required
                    value={courseName}
                    onChange={e => setCourseName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Ngày thi (YYYY-MM-DD) *</label>
                  <input
                    type="date"
                    required
                    value={examDate}
                    onChange={e => setExamDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Ca thi *</label>
                  <select
                    value={examShift}
                    onChange={e => setExamShift(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="Ca 1 (07:30 - 09:00)">Ca 1 (07:30 - 09:00)</option>
                    <option value="Ca 2 (09:30 - 11:00)">Ca 2 (09:30 - 11:00)</option>
                    <option value="Ca 3 (13:30 - 15:00)">Ca 3 (13:30 - 15:00)</option>
                    <option value="Ca 4 (15:30 - 17:00)">Ca 4 (15:30 - 17:00)</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phòng thi *</label>
                  <input
                    type="text"
                    required
                    value={room}
                    onChange={e => setRoom(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Số thí sinh *</label>
                  <input
                    type="number"
                    required
                    value={studentCount}
                    onChange={e => setStudentCount(parseInt(e.target.value))}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Hình thức thi</label>
                  <select
                    value={format}
                    onChange={e => setFormat(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="Tự luận">Tự luận</option>
                    <option value="Vấn đáp (Oral Exam)">Vấn đáp</option>
                    <option value="Trắc nghiệm máy">Trắc nghiệm máy</option>
                    <option value="Tiểu luận môn học">Tiểu luận</option>
                  </select>
                </div>
              </div>

              {/* Proctor assignment */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 space-y-3">
                <span className="font-bold text-slate-800 block">
                  Phân công 02 Cán bộ coi thi (Không được trùng nhau):
                </span>
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-slate-600 block mb-1">Cán bộ coi thi 1 *</label>
                    <select
                      value={proctor1Id}
                      onChange={e => setProctor1Id(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    >
                      {staffList.map(s => (
                        <option key={s.id} value={s.id}>{s.fullName}</option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-slate-600 block mb-1">Cán bộ coi thi 2 *</label>
                    <select
                      value={proctor2Id}
                      onChange={e => setProctor2Id(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    >
                      {staffList.map(s => (
                        <option key={s.id} value={s.id}>{s.fullName}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C8102E] hover:bg-[#A50D25] text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Lưu Lịch Thi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
