/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Users,
  Search,
  Plus,
  Filter,
  FileSpreadsheet,
  Download,
  Upload,
  Eye,
  Edit,
  History,
  AlertCircle,
  CheckCircle2,
  X,
  FileText,
  ShieldAlert,
  ArrowUpDown
} from 'lucide-react';
import { Student, StudentStatus } from '../../types';
import { BduAcademicService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';

export const StudentManagementView: React.FC = () => {
  const { currentUser, canManageStudents, canExportData } = useAuth();
  const [students, setStudents] = useState<Student[]>(() => BduAcademicService.getStudents());
  
  // Search & Filter state
  const [searchQuery, setSearchQuery] = useState('');
  const [filterCohort, setFilterCohort] = useState('ALL');
  const [filterMajor, setFilterMajor] = useState('ALL');
  const [filterClass, setFilterClass] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');

  // Modal states
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isImportModalOpen, setIsImportModalOpen] = useState(false);

  // Form states for Create/Edit
  const [formData, setFormData] = useState<Partial<Student>>({});
  const [statusChangeReason, setStatusChangeReason] = useState('');
  const [decisionNumber, setDecisionNumber] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  // CSV Import State
  const [importCsvContent, setImportCsvContent] = useState('');
  const [importResults, setImportResults] = useState<{ imported: number; errors: string[] } | null>(null);

  // Refresh students list
  const refreshStudents = () => {
    setStudents(BduAcademicService.getStudents());
  };

  // Filter options
  const cohorts = Array.from(new Set(students.map(s => s.cohort)));
  const majors = ['Ngôn ngữ Anh', 'Ngôn ngữ Trung Quốc', 'Ngôn ngữ Hàn Quốc', 'Ngôn ngữ Nhật'];
  const classes = Array.from(new Set(students.map(s => s.classCode)));

  // Filtered list
  const filteredStudents = students.filter(student => {
    const matchesQuery = 
      student.mssv.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      student.email.toLowerCase().includes(searchQuery.toLowerCase());
    
    const matchesCohort = filterCohort === 'ALL' || student.cohort === filterCohort;
    const matchesMajor = filterMajor === 'ALL' || student.major === filterMajor;
    const matchesClass = filterClass === 'ALL' || student.classCode === filterClass;
    const matchesStatus = filterStatus === 'ALL' || student.status === filterStatus;

    return matchesQuery && matchesCohort && matchesMajor && matchesClass && matchesStatus;
  });

  // Export to CSV with UTF-8 BOM
  const handleExportCSV = () => {
    const headers = [
      'MSSV', 
      'Họ và tên', 
      'Ngày sinh', 
      'Giới tính', 
      'Khóa', 
      'Ngành', 
      'Lớp', 
      'Email', 
      'Số điện thoại', 
      'Tình trạng học vụ', 
      'GPA', 
      'Điểm rèn luyện', 
      'Tín chỉ tích lũy'
    ];

    const rows = filteredStudents.map(s => [
      s.mssv,
      s.fullName,
      s.dateOfBirth,
      s.gender,
      s.cohort,
      s.major,
      s.classCode,
      s.email,
      s.phone,
      s.status,
      s.gpa,
      s.drl,
      s.creditsEarned
    ]);

    BduAcademicService.exportToCSV(`Danh_sach_sinh_vien_Khoa_Ngoai_Ngu_BDU_${Date.now()}`, headers, rows);
  };

  // Open Edit Modal
  const handleOpenEdit = (student: Student) => {
    setSelectedStudent(student);
    setFormData({
      ...student
    });
    setStatusChangeReason('');
    setDecisionNumber('');
    setErrorMessage('');
    setSuccessMessage('');
    setIsEditModalOpen(true);
  };

  // Handle Save Edit
  const handleSaveEdit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedStudent) return;

    setErrorMessage('');
    const res = BduAcademicService.updateStudent(
      selectedStudent.id,
      formData,
      currentUser.name,
      statusChangeReason,
      decisionNumber
    );

    if (!res.success) {
      setErrorMessage(res.error || 'Có lỗi xảy ra khi cập nhật hồ sơ!');
      return;
    }

    setSuccessMessage('Cập nhật hồ sơ sinh viên thành công!');
    refreshStudents();
    if (res.student) setSelectedStudent(res.student);
    setTimeout(() => {
      setIsEditModalOpen(false);
      setSuccessMessage('');
    }, 900);
  };

  // Open Create Modal
  const handleOpenCreate = () => {
    setFormData({
      mssv: '',
      fullName: '',
      dateOfBirth: '2005-01-01',
      gender: 'Nữ',
      cohort: 'K24',
      major: 'Ngôn ngữ Anh',
      classCode: '24DTA01',
      email: '',
      phone: '',
      status: 'STUDYING',
      gpa: 3.0,
      drl: 80,
      creditsEarned: 0,
      totalCreditsRequired: 135,
      homeTown: 'Bình Dương',
      address: '',
      admissionDate: new Date().toISOString().split('T')[0]
    });
    setErrorMessage('');
    setSuccessMessage('');
    setIsCreateModalOpen(true);
  };

  // Handle Submit Create
  const handleSaveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!formData.mssv || !formData.fullName) {
      setErrorMessage('MSSV và Họ tên sinh viên là bắt buộc!');
      return;
    }

    const res = BduAcademicService.addStudent(formData as any, currentUser.name);
    if (!res.success) {
      setErrorMessage(res.error || 'Không thể tạo mới sinh viên!');
      return;
    }

    setSuccessMessage('Thêm mới sinh viên thành công vào hệ thống!');
    refreshStudents();
    setTimeout(() => {
      setIsCreateModalOpen(false);
      setSuccessMessage('');
    }, 900);
  };

  // Handle CSV Import
  const handleProcessImport = () => {
    if (!importCsvContent.trim()) {
      alert('Vui lòng dán nội dung CSV hoặc chọn tệp tải lên!');
      return;
    }

    const result = BduAcademicService.importStudentsCSV(importCsvContent, currentUser.name);
    setImportResults(result);
    refreshStudents();
  };

  const getStatusBadge = (status: StudentStatus) => {
    switch (status) {
      case 'STUDYING':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Đang học</span>;
      case 'RESERVED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">Bảo lưu</span>;
      case 'ACADEMIC_WARN':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Cảnh báo học vụ</span>;
      case 'SUSPENDED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">Đình chỉ</span>;
      case 'DROPPED_OUT':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">Thôi học</span>;
      case 'GRADUATED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">Đã tốt nghiệp</span>;
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Actions */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Phân Hệ Quản Lý Sinh Viên Khoa Ngoại Ngữ
            </h2>
            <span className="px-2 py-0.5 text-xs font-bold bg-red-50 text-[#C8102E] border border-red-200 rounded-md">
              {filteredStudents.length} / {students.length} SV
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Quản lý hồ sơ học vụ, tra cứu MSSV, cập nhật tình trạng và nhật ký học tập (LUỒNG 1)
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          {canManageStudents && (
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-1.5 px-3.5 py-2 bg-[#C8102E] hover:bg-[#A50D25] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Thêm Sinh Viên Mới</span>
            </button>
          )}

          {canManageStudents && (
            <button
              onClick={() => {
                setImportResults(null);
                setImportCsvContent('');
                setIsImportModalOpen(true);
              }}
              className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
            >
              <Upload className="w-4 h-4" />
              <span>Import Excel/CSV</span>
            </button>
          )}

          {canExportData && (
            <button
              onClick={handleExportCSV}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 text-xs font-bold rounded-xl border border-emerald-200 transition-colors"
              title="Xuất dữ liệu chuẩn UTF-8 BOM cho Microsoft Excel"
            >
              <Download className="w-4 h-4" />
              <span>Xuất Excel</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
          {/* Search by MSSV / Name */}
          <div className="lg:col-span-2 relative">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
            <input
              type="text"
              placeholder="Tìm theo MSSV, Họ tên hoặc Email..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E] focus:ring-1 focus:ring-[#C8102E]"
            />
          </div>

          {/* Filter Cohort */}
          <div>
            <select
              value={filterCohort}
              onChange={e => setFilterCohort(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E] bg-white"
            >
              <option value="ALL">Tất cả Khóa đào tạo</option>
              {cohorts.map(c => (
                <option key={c} value={c}>{c}</option>
              ))}
            </select>
          </div>

          {/* Filter Major */}
          <div>
            <select
              value={filterMajor}
              onChange={e => setFilterMajor(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E] bg-white"
            >
              <option value="ALL">Tất cả Chuyên ngành</option>
              {majors.map(m => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          {/* Filter Status */}
          <div>
            <select
              value={filterStatus}
              onChange={e => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E] bg-white"
            >
              <option value="ALL">Tất cả Tình trạng HV</option>
              <option value="STUDYING">Đang học</option>
              <option value="ACADEMIC_WARN">Cảnh báo học vụ</option>
              <option value="RESERVED">Bảo lưu</option>
              <option value="DROPPED_OUT">Thôi học</option>
              <option value="GRADUATED">Đã tốt nghiệp</option>
            </select>
          </div>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">MSSV</th>
                <th className="px-4 py-3">Họ và tên</th>
                <th className="px-4 py-3">Ngành học</th>
                <th className="px-4 py-3">Khóa / Lớp</th>
                <th className="px-4 py-3 text-center">GPA</th>
                <th className="px-4 py-3 text-center">ĐRL</th>
                <th className="px-4 py-3">Tình trạng học vụ</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={8} className="p-8 text-center text-slate-400">
                    Không tìm thấy sinh viên nào phù hợp với bộ lọc hiện tại.
                  </td>
                </tr>
              ) : (
                filteredStudents.map(student => (
                  <tr key={student.id} className="hover:bg-slate-50/80 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-[#C8102E]">
                      {student.mssv}
                    </td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{student.fullName}</div>
                      <div className="text-[11px] text-slate-400">{student.email}</div>
                    </td>
                    <td className="px-4 py-3 text-slate-700 font-medium">
                      {student.major}
                    </td>
                    <td className="px-4 py-3">
                      <span className="font-semibold text-slate-800">{student.classCode}</span>
                      <span className="text-[11px] text-slate-400 ml-1">({student.cohort})</span>
                    </td>
                    <td className="px-4 py-3 text-center font-bold font-mono">
                      <span className={student.gpa < 2.0 ? 'text-rose-600 font-extrabold' : 'text-slate-800'}>
                        {student.gpa.toFixed(2)}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-center font-semibold text-slate-700">
                      {student.drl}
                    </td>
                    <td className="px-4 py-3">
                      {getStatusBadge(student.status)}
                    </td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        {/* View Details */}
                        <button
                          onClick={() => {
                            setSelectedStudent(student);
                            setIsDetailModalOpen(true);
                          }}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-slate-800 hover:bg-slate-100 transition-colors"
                          title="Xem hồ sơ chi tiết & Lịch sử"
                        >
                          <Eye className="w-4 h-4" />
                        </button>

                        {/* Edit Student */}
                        {canManageStudents && (
                          <button
                            onClick={() => handleOpenEdit(student)}
                            className="p-1.5 rounded-lg text-blue-600 hover:text-blue-800 hover:bg-blue-50 transition-colors"
                            title="Sửa thông tin & Cập nhật tình trạng"
                          >
                            <Edit className="w-4 h-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAIL MODAL (LUỒNG 1: Xem hồ sơ & Lịch sử) */}
      {isDetailModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            {/* Header */}
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-full bg-[#C8102E] text-white flex items-center justify-center font-bold text-sm">
                  {selectedStudent.fullName.charAt(selectedStudent.fullName.lastIndexOf(' ') + 1)}
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {selectedStudent.fullName}
                  </h3>
                  <div className="flex items-center gap-2 text-xs text-slate-500 font-mono">
                    <span>MSSV: {selectedStudent.mssv}</span>
                    <span>•</span>
                    <span>Lớp: {selectedStudent.classCode}</span>
                  </div>
                </div>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto p-6 space-y-6">
              {/* Profile grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-100 text-xs">
                <div>
                  <span className="text-slate-400 block mb-0.5">Ngành đào tạo:</span>
                  <span className="font-bold text-slate-800">{selectedStudent.major}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Khóa tuyển sinh:</span>
                  <span className="font-semibold text-slate-800">{selectedStudent.cohort}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Tình trạng học vụ:</span>
                  <div>{getStatusBadge(selectedStudent.status)}</div>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Ngày sinh:</span>
                  <span className="font-medium text-slate-800">{selectedStudent.dateOfBirth} ({selectedStudent.gender})</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Số điện thoại:</span>
                  <span className="font-medium text-slate-800">{selectedStudent.phone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Email BDU:</span>
                  <span className="font-medium text-slate-800 truncate block">{selectedStudent.email}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Điểm GPA tích lũy:</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedStudent.gpa.toFixed(2)} / 4.0</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Điểm rèn luyện:</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedStudent.drl} / 100</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Số tín chỉ tích lũy:</span>
                  <span className="font-bold text-slate-900 text-sm">{selectedStudent.creditsEarned} / {selectedStudent.totalCreditsRequired} tín chỉ</span>
                </div>
              </div>

              {/* Status History (Audit Trail) */}
              <div>
                <div className="flex items-center gap-2 mb-3">
                  <History className="w-4 h-4 text-[#C8102E]" />
                  <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                    Lịch Sử Thay Đổi Tình Trạng Học Vụ (Audit Trail)
                  </h4>
                </div>

                {selectedStudent.statusHistory.length === 0 ? (
                  <div className="p-4 rounded-xl border border-dashed border-slate-200 text-center text-xs text-slate-400">
                    Chưa có lịch sử thay đổi tình trạng nào được ghi nhận.
                  </div>
                ) : (
                  <div className="space-y-2.5">
                    {selectedStudent.statusHistory.map(hist => (
                      <div
                        key={hist.id}
                        className="p-3.5 rounded-xl border border-slate-200 bg-white text-xs space-y-1.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="font-bold text-slate-800">
                            Chuyển trạng thái: <span className="text-[#C8102E]">{hist.previousStatus} → {hist.newStatus}</span>
                          </span>
                          <span className="text-[11px] text-slate-400">{hist.changedAt}</span>
                        </div>
                        <div className="text-slate-600">
                          <span className="font-semibold text-slate-700">Lý do: </span>
                          <span>{hist.reason}</span>
                        </div>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100">
                          <span>Người thực hiện: <strong className="text-slate-700">{hist.changedBy}</strong></span>
                          {hist.decisionNumber && (
                            <span className="font-mono text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                              Quyết định: {hist.decisionNumber}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex items-center justify-end gap-2">
              {canManageStudents && (
                <button
                  onClick={() => {
                    setIsDetailModalOpen(false);
                    handleOpenEdit(selectedStudent);
                  }}
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold rounded-lg transition-colors"
                >
                  Chỉnh sửa hồ sơ này
                </button>
              )}
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition-colors"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}

      {/* EDIT MODAL (LUỒNG 1: Cập nhật thông tin & kiểm tra lịch sử) */}
      {isEditModalOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Cập Nhật Thông Tin Sinh Viên
                </h3>
                <p className="text-xs text-slate-500">
                  MSSV: {selectedStudent.mssv} - {selectedStudent.fullName}
                </p>
              </div>
              <button
                onClick={() => setIsEditModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveEdit} className="flex-1 overflow-y-auto p-6 space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mã số sinh viên (MSSV) *</label>
                  <input
                    type="text"
                    required
                    value={formData.mssv || ''}
                    onChange={e => setFormData({ ...formData, mssv: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Họ và tên *</label>
                  <input
                    type="text"
                    required
                    value={formData.fullName || ''}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Ngành học</label>
                  <select
                    value={formData.major}
                    onChange={e => setFormData({ ...formData, major: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E] bg-white"
                  >
                    <option value="Ngôn ngữ Anh">Ngôn ngữ Anh</option>
                    <option value="Ngôn ngữ Trung Quốc">Ngôn ngữ Trung Quốc</option>
                    <option value="Ngôn ngữ Hàn Quốc">Ngôn ngữ Hàn Quốc</option>
                    <option value="Ngôn ngữ Nhật">Ngôn ngữ Nhật</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Lớp sinh hoạt</label>
                  <input
                    type="text"
                    value={formData.classCode || ''}
                    onChange={e => setFormData({ ...formData, classCode: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    value={formData.phone || ''}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Email</label>
                  <input
                    type="email"
                    value={formData.email || ''}
                    onChange={e => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Điểm GPA (Thang 4.0)</label>
                  <input
                    type="number"
                    step="0.01"
                    min="0"
                    max="4.0"
                    value={formData.gpa || 0}
                    onChange={e => setFormData({ ...formData, gpa: parseFloat(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Điểm rèn luyện</label>
                  <input
                    type="number"
                    min="0"
                    max="100"
                    value={formData.drl || 0}
                    onChange={e => setFormData({ ...formData, drl: parseInt(e.target.value) })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E]"
                  />
                </div>
              </div>

              {/* Status Change Section with Strict Rules */}
              <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
                <div className="flex items-center gap-1.5 text-xs font-bold text-amber-900">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Cập nhật Tình trạng Học vụ & Quy chế BDU:</span>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Tình trạng học vụ</label>
                    <select
                      value={formData.status}
                      onChange={e => setFormData({ ...formData, status: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E] bg-white"
                    >
                      <option value="STUDYING">Đang học</option>
                      <option value="ACADEMIC_WARN">Cảnh báo học vụ</option>
                      <option value="RESERVED">Bảo lưu</option>
                      <option value="SUSPENDED">Đình chỉ học tập</option>
                      <option value="DROPPED_OUT">Thôi học (Yêu cầu Quyết định)</option>
                      <option value="GRADUATED">Đã tốt nghiệp</option>
                    </select>
                  </div>

                  <div>
                    <label className="font-semibold text-slate-700 block mb-1">Số Quyết định (nếu có)</label>
                    <input
                      type="text"
                      placeholder="VD: QĐ-BDU-105/ĐH"
                      value={decisionNumber}
                      onChange={e => setDecisionNumber(e.target.value)}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E]"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1 text-xs">
                    Lý do thay đổi trạng thái (Lưu vào Nhật ký Audit Trail):
                  </label>
                  <input
                    type="text"
                    placeholder="Nhập lý do chi tiết..."
                    value={statusChangeReason}
                    onChange={e => setStatusChangeReason(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 text-xs focus:outline-none focus:border-[#C8102E]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsEditModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg transition-colors"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C8102E] hover:bg-[#A50D25] text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
                >
                  Lưu Thay Đổi
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CREATE STUDENT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Thêm Mới Hồ Sơ Sinh Viên
                </h3>
                <p className="text-xs text-slate-500">
                  Kiểm tra tính duy nhất của MSSV theo quy định học vụ
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCreate} className="flex-1 overflow-y-auto p-6 space-y-4">
              {errorMessage && (
                <div className="p-3 rounded-lg bg-rose-50 border border-rose-200 text-rose-800 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 text-rose-600 shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              {successMessage && (
                <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                  <span>{successMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mã số sinh viên (MSSV) *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: 240501099"
                    value={formData.mssv || ''}
                    onChange={e => setFormData({ ...formData, mssv: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Họ và tên đầy đủ *</label>
                  <input
                    type="text"
                    required
                    placeholder="VD: Nguyễn Văn A"
                    value={formData.fullName || ''}
                    onChange={e => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E]"
                  />
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Chuyên ngành</label>
                  <select
                    value={formData.major}
                    onChange={e => setFormData({ ...formData, major: e.target.value as any })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E] bg-white"
                  >
                    <option value="Ngôn ngữ Anh">Ngôn ngữ Anh</option>
                    <option value="Ngôn ngữ Trung Quốc">Ngôn ngữ Trung Quốc</option>
                    <option value="Ngôn ngữ Hàn Quốc">Ngôn ngữ Hàn Quốc</option>
                    <option value="Ngôn ngữ Nhật">Ngôn ngữ Nhật</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Khóa học & Lớp</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="text"
                      placeholder="Khóa (K24)"
                      value={formData.cohort || 'K24'}
                      onChange={e => setFormData({ ...formData, cohort: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200"
                    />
                    <input
                      type="text"
                      placeholder="Lớp (24DTA01)"
                      value={formData.classCode || '24DTA01'}
                      onChange={e => setFormData({ ...formData, classCode: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Ngày sinh & Giới tính</label>
                  <div className="grid grid-cols-2 gap-2">
                    <input
                      type="date"
                      value={formData.dateOfBirth || '2005-01-01'}
                      onChange={e => setFormData({ ...formData, dateOfBirth: e.target.value })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200"
                    />
                    <select
                      value={formData.gender || 'Nữ'}
                      onChange={e => setFormData({ ...formData, gender: e.target.value as any })}
                      className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                    >
                      <option value="Nữ">Nữ</option>
                      <option value="Nam">Nam</option>
                      <option value="Khác">Khác</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Số điện thoại</label>
                  <input
                    type="text"
                    placeholder="09xx..."
                    value={formData.phone || ''}
                    onChange={e => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 text-slate-700 text-xs font-bold rounded-lg"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C8102E] hover:bg-[#A50D25] text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Tạo Mới Sinh Viên
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IMPORT CSV MODAL */}
      {isImportModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
                <FileSpreadsheet className="w-5 h-5 text-emerald-600" />
                <span>Nhập Dữ Liệu Sinh Viên Từ Excel / CSV</span>
              </h3>
              <button
                onClick={() => setIsImportModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="text-xs text-slate-600 space-y-2">
              <p>
                Dán nội dung bảng tính CSV hoặc tệp xuất từ Excel. Định dạng cột chuẩn:
              </p>
              <div className="p-2 rounded bg-slate-100 font-mono text-[11px] text-slate-800">
                MSSV, Họ tên, Khóa, Ngành, Lớp, Email, SĐT, GPA
              </div>
            </div>

            <textarea
              rows={6}
              value={importCsvContent}
              onChange={e => setImportCsvContent(e.target.value)}
              placeholder={`MSSV, Họ tên, Khóa, Ngành, Lớp, Email, SĐT, GPA\n240501099, Trần Minh Anh, K24, Ngôn ngữ Anh, 24DTA01, 240501099@student.bdu.edu.vn, 0912345678, 3.4`}
              className="w-full p-3 text-xs font-mono border border-slate-200 rounded-xl focus:outline-none focus:border-[#C8102E]"
            />

            {importResults && (
              <div className={`p-3 rounded-xl text-xs ${
                importResults.errors.length > 0 ? 'bg-amber-50 text-amber-900 border border-amber-200' : 'bg-emerald-50 text-emerald-900 border border-emerald-200'
              }`}>
                <div className="font-bold">
                  Đã nhập thành công: {importResults.imported} sinh viên
                </div>
                {importResults.errors.length > 0 && (
                  <ul className="mt-1 list-disc pl-4 space-y-0.5 text-[11px]">
                    {importResults.errors.map((err, idx) => (
                      <li key={idx}>{err}</li>
                    ))}
                  </ul>
                )}
              </div>
            )}

            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={() => {
                  setImportCsvContent(
                    `MSSV, Họ tên, Khóa, Ngành, Lớp, Email, SĐT, GPA\n` +
                    `240501088, Hoàng Gia Bảo, K24, Ngôn ngữ Anh, 24DTA01, 240501088@student.bdu.edu.vn, 0903112233, 3.25\n` +
                    `240502099, Đặng Diễm My, K24, Ngôn ngữ Trung Quốc, 24DTT01, 240502099@student.bdu.edu.vn, 0938445566, 3.60`
                  );
                }}
                className="text-xs text-[#C8102E] hover:underline font-semibold"
              >
                Chèn dữ liệu mẫu
              </button>

              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setIsImportModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
                >
                  Đóng
                </button>
                <button
                  type="button"
                  onClick={handleProcessImport}
                  className="px-4 py-2 bg-[#C8102E] hover:bg-[#A50D25] text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Xác Nhận Import
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
