/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  CalendarDays,
  Plus,
  Clock,
  MapPin,
  User,
  AlertTriangle,
  CheckCircle2,
  X,
  Filter,
  Trash2,
  CalendarCheck,
  ShieldCheck,
  Building
} from 'lucide-react';
import { ScheduleItem, ScheduleShift, DayOfWeek } from '../../types';
import { BduAcademicService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';

const DAYS_OF_WEEK: DayOfWeek[] = ['Thứ Hai', 'Thứ Ba', 'Thứ Tư', 'Thứ Năm', 'Thứ Sáu', 'Thứ Bảy'];
const SHIFTS: ScheduleShift[] = [
  'Tiết 1-3 (07:00 - 09:15)',
  'Tiết 4-6 (09:30 - 11:45)',
  'Tiết 7-9 (12:45 - 15:00)',
  'Tiết 10-12 (15:15 - 17:30)',
  'Ca tối (18:00 - 20:45)'
];

export const ScheduleManagementView: React.FC = () => {
  const { canManageSchedule, currentUser } = useAuth();
  const [schedule, setSchedule] = useState<ScheduleItem[]>(() => BduAcademicService.getSchedule());
  const staffList = BduAcademicService.getStaff();

  // Filters
  const [filterClass, setFilterClass] = useState('ALL');
  const [filterLecturer, setFilterLecturer] = useState('ALL');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState<ScheduleItem | null>(null);

  // Form State
  const [courseCode, setCourseCode] = useState('ENG201');
  const [courseName, setCourseName] = useState('Ngữ pháp Nâng cao Tiếng Anh');
  const [classSectionCode, setClassSectionCode] = useState('24DTA01_ENG201');
  const [credits, setCredits] = useState(3);
  const [dayOfWeek, setDayOfWeek] = useState<DayOfWeek>('Thứ Hai');
  const [shift, setShift] = useState<ScheduleShift>('Tiết 1-3 (07:00 - 09:15)');
  const [room, setRoom] = useState('P.A204');
  const [lecturerId, setLecturerId] = useState(staffList[2]?.id || 'staff-3');
  const [targetClass, setTargetClass] = useState('24DTA01');
  const [scheduleType, setScheduleType] = useState<'CHÍNH_KHÓA' | 'HỌC_BÙ' | 'THỰC_HÀNH'>('CHÍNH_KHÓA');
  const [note, setNote] = useState('');

  // Conflict warning / error feedback
  const [conflictWarning, setConflictWarning] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const refreshSchedule = () => {
    setSchedule(BduAcademicService.getSchedule());
  };

  const handleOpenAdd = () => {
    setEditingItem(null);
    setCourseCode('ENG208');
    setCourseName('Văn hóa Văn minh Anh');
    setClassSectionCode('24DTA01_ENG208');
    setCredits(3);
    setDayOfWeek('Thứ Sáu');
    setShift('Tiết 1-3 (07:00 - 09:15)');
    setRoom('P.A105');
    setLecturerId(staffList[0]?.id || 'staff-1');
    setTargetClass('24DTA01');
    setScheduleType('CHÍNH_KHÓA');
    setNote('');
    setConflictWarning(null);
    setSuccessMessage(null);
    setIsModalOpen(true);
  };

  // Real-time conflict preview when user selects room/shift
  const testConflict = () => {
    const lecturer = staffList.find(s => s.id === lecturerId);
    const result = BduAcademicService.checkScheduleConflict({
      dayOfWeek,
      shift,
      room,
      lecturerId,
      targetClass
    }, editingItem?.id);

    if (result.hasConflict) {
      setConflictWarning(result.message || 'Xảy ra xung đột lịch!');
      return false;
    } else {
      setConflictWarning(null);
      return true;
    }
  };

  const handleSubmitSchedule = (e: React.FormEvent) => {
    e.preventDefault();
    setConflictWarning(null);
    setSuccessMessage(null);

    const lecturer = staffList.find(s => s.id === lecturerId);
    const lecturerName = lecturer ? lecturer.fullName : 'ThS. Giảng viên';

    const itemData: Omit<ScheduleItem, 'id'> = {
      courseCode,
      courseName,
      classSectionCode,
      credits,
      dayOfWeek,
      shift,
      room,
      lecturerId,
      lecturerName,
      targetClass,
      enrolledStudentsCount: 38,
      maxStudents: 45,
      type: scheduleType,
      startDate: '2026-09-01',
      endDate: '2026-12-20',
      note
    };

    if (editingItem) {
      const res = BduAcademicService.updateScheduleItem(editingItem.id, itemData);
      if (!res.success) {
        setConflictWarning(res.error || 'Lỗi cập nhật lịch học');
        return;
      }
    } else {
      const res = BduAcademicService.addScheduleItem(itemData);
      if (!res.success) {
        setConflictWarning(res.error || 'Lỗi thêm lịch học');
        return;
      }
    }

    setSuccessMessage('Lưu lịch học thành công! Không có xung đột.');
    refreshSchedule();
    setTimeout(() => {
      setIsModalOpen(false);
      setSuccessMessage(null);
    }, 900);
  };

  const handleDelete = (id: string) => {
    if (confirm('Bạn có chắc chắn muốn xóa lịch học phần này?')) {
      BduAcademicService.deleteScheduleItem(id);
      refreshSchedule();
    }
  };

  // Filtered items
  const filteredSchedule = schedule.filter(item => {
    const matchesClass = filterClass === 'ALL' || item.targetClass === filterClass;
    const matchesLecturer = filterLecturer === 'ALL' || item.lecturerId === filterLecturer;
    return matchesClass && matchesLecturer;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Quản Lý Thời Khóa Biểu & Lịch Đào Tạo (LUỒNG 3)
            </h2>
            <span className="px-2 py-0.5 text-xs font-bold bg-purple-50 text-purple-700 border border-purple-200 rounded-md">
              Học kỳ 1 (2026-2027)
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Engine kiểm tra xung đột 3 chiều thông minh: Phòng học, Giảng viên và Lớp sinh hoạt
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canManageSchedule && (
            <button
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#C8102E] hover:bg-[#A50D25] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Xếp Lịch Mới / Học Bù</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Filter className="w-4 h-4 text-slate-400" />
          <span>Bộ lọc thời khóa biểu:</span>
        </div>

        <select
          value={filterClass}
          onChange={e => setFilterClass(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E] bg-white font-medium"
        >
          <option value="ALL">Tất cả Lớp sinh hoạt</option>
          <option value="24DTA01">Lớp 24DTA01 (Tiếng Anh K24)</option>
          <option value="23DTA02">Lớp 23DTA02 (Tiếng Anh K23)</option>
          <option value="24DTT01">Lớp 24DTT01 (Tiếng Trung K24)</option>
        </select>

        <select
          value={filterLecturer}
          onChange={e => setFilterLecturer(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E] bg-white font-medium"
        >
          <option value="ALL">Tất cả Giảng viên</option>
          {staffList.map(s => (
            <option key={s.id} value={s.id}>{s.fullName}</option>
          ))}
        </select>
      </div>

      {/* Interactive Timetable Grid */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <span className="text-xs font-bold text-slate-800 uppercase tracking-wider flex items-center gap-2">
            <CalendarCheck className="w-4 h-4 text-[#C8102E]" />
            Lưới Thời Khóa Biểu Tuần Học
          </span>
          <span className="text-xs text-slate-500">
            Múi giờ chuẩn: GMT+7 (Giờ Hà Nội)
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200">
                <th className="p-3 w-40 border-r border-slate-200">Ca Học / Tiết</th>
                {DAYS_OF_WEEK.map(day => (
                  <th key={day} className="p-3 min-w-[180px] text-center border-r border-slate-200 last:border-r-0">
                    {day}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {SHIFTS.map(shiftItem => (
                <tr key={shiftItem} className="hover:bg-slate-50/50">
                  {/* Shift Column */}
                  <td className="p-3 font-semibold text-slate-700 bg-slate-50/90 border-r border-slate-200 text-xs">
                    <div className="flex items-center gap-1.5">
                      <Clock className="w-3.5 h-3.5 text-slate-400" />
                      <span>{shiftItem}</span>
                    </div>
                  </td>

                  {/* Day Columns */}
                  {DAYS_OF_WEEK.map(day => {
                    const match = filteredSchedule.find(s => s.dayOfWeek === day && s.shift === shiftItem);
                    return (
                      <td key={day} className="p-2 border-r border-slate-200 last:border-r-0 align-top h-28">
                        {match ? (
                          <div className={`h-full p-2.5 rounded-lg border flex flex-col justify-between transition-all ${
                            match.type === 'HỌC_BÙ'
                              ? 'bg-amber-50 border-amber-200 text-amber-950'
                              : match.type === 'THỰC_HÀNH'
                              ? 'bg-purple-50 border-purple-200 text-purple-950'
                              : 'bg-red-50/70 border-red-200 text-slate-900'
                          }`}>
                            <div>
                              <div className="flex items-center justify-between">
                                <span className="font-mono text-[10px] font-bold px-1.5 py-0.2 bg-white rounded border border-slate-200">
                                  {match.courseCode}
                                </span>
                                {match.type === 'HỌC_BÙ' && (
                                  <span className="text-[10px] font-bold text-amber-700">HỌC BÙ</span>
                                )}
                              </div>
                              <h5 className="font-bold text-xs mt-1 line-clamp-1">{match.courseName}</h5>
                              <div className="text-[11px] text-slate-600 mt-0.5 line-clamp-1">
                                Lớp: <span className="font-semibold text-slate-800">{match.targetClass}</span>
                              </div>
                            </div>

                            <div className="mt-2 pt-1.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-500">
                              <span className="flex items-center gap-1 font-semibold text-slate-700">
                                <MapPin className="w-3 h-3 text-[#C8102E]" />
                                {match.room}
                              </span>
                              <span className="truncate max-w-[80px]" title={match.lecturerName}>
                                {match.lecturerName}
                              </span>
                            </div>

                            {canManageSchedule && (
                              <div className="mt-1 flex items-center justify-end gap-1">
                                <button
                                  onClick={() => handleDelete(match.id)}
                                  className="text-slate-400 hover:text-rose-600 p-0.5"
                                  title="Xóa lịch học"
                                >
                                  <Trash2 className="w-3.5 h-3.5" />
                                </button>
                              </div>
                            )}
                          </div>
                        ) : (
                          <div className="h-full flex items-center justify-center text-slate-300 text-[11px] font-mono">
                            -- Trống --
                          </div>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* ADD / EDIT SCHEDULE MODAL (With real-time 3-way conflict checking) */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  {editingItem ? 'Chỉnh Sửa Lịch Học Phần' : 'Xếp Lịch Học Mới / Lịch Học Bù (LUỒNG 3)'}
                </h3>
                <p className="text-xs text-slate-500">
                  Kiểm tra xung đột phòng học, giảng viên và lớp học sinh hoạt
                </p>
              </div>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSubmitSchedule} className="flex-1 overflow-y-auto p-6 space-y-4">
              {conflictWarning && (
                <div className="p-3.5 rounded-xl bg-rose-50 border border-rose-200 text-rose-900 text-xs flex items-start gap-2.5">
                  <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block">Phát hiện xung đột lịch:</span>
                    <span>{conflictWarning}</span>
                  </div>
                </div>
              )}

              {successMessage && (
                <div className="p-3.5 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mã học phần *</label>
                  <input
                    type="text"
                    required
                    value={courseCode}
                    onChange={e => setCourseCode(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Tên môn học *</label>
                  <input
                    type="text"
                    required
                    value={courseName}
                    onChange={e => setCourseName(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Thứ trong tuần *</label>
                  <select
                    value={dayOfWeek}
                    onChange={e => {
                      setDayOfWeek(e.target.value as DayOfWeek);
                      setConflictWarning(null);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E] bg-white font-medium"
                  >
                    {DAYS_OF_WEEK.map(d => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Ca học / Tiết học *</label>
                  <select
                    value={shift}
                    onChange={e => {
                      setShift(e.target.value as ScheduleShift);
                      setConflictWarning(null);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E] bg-white font-medium"
                  >
                    {SHIFTS.map(s => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Phòng học *</label>
                  <input
                    type="text"
                    required
                    value={room}
                    onChange={e => {
                      setRoom(e.target.value);
                      setConflictWarning(null);
                    }}
                    placeholder="VD: P.A204, Lab Ngoại Ngữ 1"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Lớp sinh hoạt mục tiêu *</label>
                  <input
                    type="text"
                    required
                    value={targetClass}
                    onChange={e => {
                      setTargetClass(e.target.value);
                      setConflictWarning(null);
                    }}
                    placeholder="VD: 24DTA01"
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Giảng viên giảng dạy *</label>
                  <select
                    value={lecturerId}
                    onChange={e => {
                      setLecturerId(e.target.value);
                      setConflictWarning(null);
                    }}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E] bg-white font-medium"
                  >
                    {staffList.map(s => (
                      <option key={s.id} value={s.id}>
                        {s.fullName} ({s.department})
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Loại lịch học</label>
                  <select
                    value={scheduleType}
                    onChange={e => setScheduleType(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E] bg-white font-medium"
                  >
                    <option value="CHÍNH_KHÓA">Chính khóa</option>
                    <option value="HỌC_BÙ">Học bù</option>
                    <option value="THỰC_HÀNH">Thực hành / Thí nghiệm</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1 text-xs">Ghi chú (nếu là học bù/thực hành)</label>
                <input
                  type="text"
                  value={note}
                  onChange={e => setNote(e.target.value)}
                  placeholder="VD: Học bù ca ngày 20/10 do giảng viên đi hội nghị..."
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              {/* Conflict testing button */}
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 flex items-center justify-between">
                <span className="text-xs text-slate-600">
                  Kiểm tra xung đột trước khi lưu vào cơ sở dữ liệu:
                </span>
                <button
                  type="button"
                  onClick={testConflict}
                  className="px-3 py-1.5 bg-slate-200 hover:bg-slate-300 text-slate-800 text-xs font-bold rounded-lg transition-colors"
                >
                  Kiểm Tra Trùng Lịch
                </button>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C8102E] hover:bg-[#A50D25] text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Lưu & Xuất Lên Lịch
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
