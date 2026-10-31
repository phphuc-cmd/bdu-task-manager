/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  X,
  BookOpen,
  Search,
  CheckCircle2,
  AlertTriangle,
  FileSpreadsheet,
  Calendar,
  Clock,
  Printer,
  ShieldAlert,
  Users,
  FileText,
  Briefcase,
  Layers,
  HelpCircle,
  Download,
  ChevronRight,
  ExternalLink
} from 'lucide-react';

interface UserManualModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tabId: string) => void;
}

export const UserManualModal: React.FC<UserManualModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const [activeSection, setActiveSection] = useState<'quickstart' | 'students' | 'schedule' | 'attendance' | 'requests' | 'faq'>('quickstart');
  const [searchQuery, setSearchQuery] = useState('');

  if (!isOpen) return null;

  const handleGoToModule = (tabId: string) => {
    onNavigateTab(tabId);
    onClose();
  };

  const handlePrintManual = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-5xl w-full max-h-[92vh] flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-4 sm:p-5 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C8102E] text-white flex items-center justify-center font-bold shadow-xs">
              <BookOpen className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-bold text-slate-900">
                  CẨM NANG HƯỚNG DẪN SỬ DỤNG GIÁO VỤ (USER MANUAL)
                </h3>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[10px] font-bold bg-red-100 text-[#C8102E] rounded border border-red-200 uppercase">
                  Khoa Ngoại Ngữ – BDU
                </span>
              </div>
              <p className="text-xs text-slate-500">
                Sổ tay nghiệp vụ chuẩn dành cho Chuyên viên Giáo vụ & Cán bộ Đào tạo Khoa Ngoại ngữ
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrintManual}
              className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors"
              title="In sổ tay cẩm nang hoặc lưu file PDF"
            >
              <Printer className="w-3.5 h-3.5" />
              <span>In Tài Liệu</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Search & Tabs Navigation */}
        <div className="border-b border-slate-200 bg-white px-4 sm:px-6 pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          {/* Section Selector Tabs */}
          <div className="flex overflow-x-auto gap-1 sm:gap-2 pb-2 sm:pb-0 scrollbar-none text-xs font-bold">
            <button
              onClick={() => setActiveSection('quickstart')}
              className={`px-3 py-2 border-b-2 whitespace-nowrap transition-all ${
                activeSection === 'quickstart'
                  ? 'border-[#C8102E] text-[#C8102E]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              1. Bắt Đầu Nhanh (5 Phút)
            </button>
            <button
              onClick={() => setActiveSection('students')}
              className={`px-3 py-2 border-b-2 whitespace-nowrap transition-all ${
                activeSection === 'students'
                  ? 'border-[#C8102E] text-[#C8102E]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              2. Quản Lý Sinh Viên & Excel
            </button>
            <button
              onClick={() => setActiveSection('schedule')}
              className={`px-3 py-2 border-b-2 whitespace-nowrap transition-all ${
                activeSection === 'schedule'
                  ? 'border-[#C8102E] text-[#C8102E]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              3. Lịch Học & Trùng Lịch
            </button>
            <button
              onClick={() => setActiveSection('attendance')}
              className={`px-3 py-2 border-b-2 whitespace-nowrap transition-all ${
                activeSection === 'attendance'
                  ? 'border-[#C8102E] text-[#C8102E]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              4. Chuyên Cần & Cấm Thi
            </button>
            <button
              onClick={() => setActiveSection('requests')}
              className={`px-3 py-2 border-b-2 whitespace-nowrap transition-all ${
                activeSection === 'requests'
                  ? 'border-[#C8102E] text-[#C8102E]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              5. Hồ Sơ & Đơn Từ SV
            </button>
            <button
              onClick={() => setActiveSection('faq')}
              className={`px-3 py-2 border-b-2 whitespace-nowrap transition-all ${
                activeSection === 'faq'
                  ? 'border-[#C8102E] text-[#C8102E]'
                  : 'border-transparent text-slate-500 hover:text-slate-800'
              }`}
            >
              6. Hỏi Đáp & Sự Cố (FAQ)
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6 space-y-6 text-slate-700 printable-area">
          {/* SECTION 1: QUICKSTART */}
          {activeSection === 'quickstart' && (
            <div className="space-y-6">
              <div className="p-4 rounded-xl bg-gradient-to-r from-red-50 to-amber-50 border border-red-200/60">
                <h4 className="text-sm font-bold text-[#C8102E] uppercase tracking-wider mb-1">
                  Quy Trình Nghiệp Vụ Học Vụ 1 Ngày Của Giáo Vụ Khoa Ngoại Ngữ
                </h4>
                <p className="text-xs text-slate-600 leading-relaxed">
                  Hệ thống BDU Academic Management được thiết kế trực tiếp nhằm giảm tải 80% thao tác thủ công, chống trùng lịch tự động và lưu vết kiểm toán chuẩn thanh tra giáo dục.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-blue-100 text-blue-700 flex items-center justify-center font-bold text-xs">
                    01
                  </div>
                  <h5 className="font-bold text-xs text-slate-900">Đầu Giờ Làm Việc</h5>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                    <li>Mở <strong>Dashboard</strong> xem các lớp học trong ngày.</li>
                    <li>Kiểm tra mục <strong>Hồ sơ học vụ cần xử lý</strong> xem có đơn xin cấp giấy xác nhận SV, đơn phúc khảo mới hay không.</li>
                    <li>Xem các nhiệm vụ công việc sắp đến hạn chót (Deadline).</li>
                  </ul>
                  <button
                    onClick={() => handleGoToModule('dashboard')}
                    className="text-xs text-[#C8102E] font-bold hover:underline flex items-center gap-1 pt-1"
                  >
                    Mở Dashboard ngay <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-xs">
                    02
                  </div>
                  <h5 className="font-bold text-xs text-slate-900">Trong Giờ Hành Chính</h5>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                    <li>Xử lý và chuyển hồ sơ sinh viên lên Ban Chủ Nhiệm duyệt.</li>
                    <li>Hỗ trợ giảng viên xếp lịch học bù hoặc cập nhật điểm danh.</li>
                    <li>Tra cứu nhanh thông tin sinh viên theo MSSV khi phụ huynh hoặc sinh viên đến liên hệ.</li>
                  </ul>
                  <button
                    onClick={() => handleGoToModule('students')}
                    className="text-xs text-[#C8102E] font-bold hover:underline flex items-center gap-1 pt-1"
                  >
                    Mở Quản lý SV <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                  <div className="w-8 h-8 rounded-lg bg-emerald-100 text-emerald-700 flex items-center justify-center font-bold text-xs">
                    03
                  </div>
                  <h5 className="font-bold text-xs text-slate-900">Định Kỳ & Cuối Kỳ</h5>
                  <ul className="text-xs text-slate-600 space-y-1.5 list-disc pl-4">
                    <li>Rà soát danh sách sinh viên vắng quá 20% số tiết (cảnh báo cấm thi).</li>
                    <li>Xếp lịch thi học kỳ và phân công cán bộ coi thi 1 & 2.</li>
                    <li>Xuất báo cáo tổng hợp kết quả học tập ra file Excel gửi Phòng Đào tạo trường.</li>
                  </ul>
                  <button
                    onClick={() => handleGoToModule('reports')}
                    className="text-xs text-[#C8102E] font-bold hover:underline flex items-center gap-1 pt-1"
                  >
                    Mở Báo cáo & Thống kê <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* 4 User Roles Guide */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <h5 className="font-bold text-xs text-slate-900 uppercase tracking-wider">
                  Bảng Phân Quyền Vai Trò Nhanh Trên Hệ Thống:
                </h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 text-xs">
                  <div className="p-3 rounded-lg bg-white border border-slate-200">
                    <span className="font-bold text-[#C8102E] block mb-0.5">Ban Chủ Nhiệm (DEAN)</span>
                    <span className="text-slate-600 text-[11px] leading-relaxed">
                      Toàn quyền phê duyệt đơn từ, phát hành thông báo chính thức, nghiệm thu công việc và xem báo cáo tài chính/học thuật.
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-slate-200">
                    <span className="font-bold text-blue-700 block mb-0.5">Giáo Vụ Khoa (ACADEMIC)</span>
                    <span className="text-slate-600 text-[11px] leading-relaxed">
                      Quản trị sinh viên, xếp thời khóa biểu, lịch thi, thụ lý đơn từ, xuất nhập file Excel và hỗ trợ dữ liệu đào tạo.
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-slate-200">
                    <span className="font-bold text-emerald-700 block mb-0.5">Giảng Viên (LECTURER)</span>
                    <span className="text-slate-600 text-[11px] leading-relaxed">
                      Xem lịch dạy cá nhân, ghi nhận điểm danh theo buổi, nộp tiến độ nhiệm vụ được giao và tạo thông báo chờ duyệt.
                    </span>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-slate-200">
                    <span className="font-bold text-amber-700 block mb-0.5">Sinh Viên (STUDENT)</span>
                    <span className="text-slate-600 text-[11px] leading-relaxed">
                      Tra cứu thời khóa biểu cá nhân, nộp đơn từ trực tuyến, theo dõi tình trạng chuyên cần và nhận thông báo của Khoa.
                    </span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 2: STUDENTS MANAGEMENT */}
          {activeSection === 'students' && (
            <div className="space-y-5 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Nghiệp Vụ Quản Lý Hồ Sơ Sinh Viên & Import/Export Excel
                  </h4>
                  <p className="text-xs text-slate-500">Mã phân hệ: Phân hệ 2 - Quản lý sinh viên</p>
                </div>
                <button
                  onClick={() => handleGoToModule('students')}
                  className="px-3 py-1.5 bg-[#C8102E] text-white font-bold rounded-lg shadow-xs hover:bg-[#A50D25]"
                >
                  Mở Phân Hệ Sinh Viên
                </button>
              </div>

              {/* Step by step Import Excel */}
              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <FileSpreadsheet className="w-4 h-4 text-emerald-600" />
                  <span>Cách Nhập Danh Sách Sinh Viên Hàng Loạt Từ Excel (Import CSV):</span>
                </div>
                <p className="text-slate-600">
                  Để nạp dữ liệu một lớp mới (VD: 40 sinh viên K24) chỉ trong 30 giây:
                </p>
                <div className="space-y-1.5 pl-4 list-decimal">
                  <li><strong>Bước 1:</strong> Mở phân hệ <em>Quản lý sinh viên</em>, bấm nút <strong>"Import Excel/CSV"</strong>.</li>
                  <li><strong>Bước 2:</strong> Chuẩn bị bảng tính Excel có các cột theo đúng thứ tự:
                    <div className="mt-1 p-2 rounded bg-slate-900 text-emerald-400 font-mono text-[11px]">
                      MSSV, Họ tên, Khóa, Ngành, Lớp, Email, SĐT, GPA
                    </div>
                  </li>
                  <li><strong>Bước 3:</strong> Sao chép (Copy) các dòng dữ liệu và dán vào ô văn bản, sau đó bấm <strong>"Xác Nhận Import"</strong>.</li>
                  <li><strong>Bước 4:</strong> Hệ thống tự động kiểm tra trùng lặp MSSV và thông báo kết quả chi tiết từng dòng.</li>
                </div>
              </div>

              {/* Status Change Rules */}
              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-3">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Quy Tắc Vàng Của Trường ĐH Bình Dương Khi Cập Nhật Trạng Thái Học Vụ:</span>
                </div>
                <div className="space-y-2 text-slate-700">
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Không được tự động chuyển sinh viên vắng học thành thôi học:</strong> Sinh viên nghỉ học nhiều chỉ bị cấm thi môn học đó. Tình trạng thôi học phải căn cứ vào quyết định kỷ luật hoặc đơn tự nguyện thôi học có chữ ký phụ huynh.
                    </div>
                  </div>
                  <div className="flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <strong>Bắt buộc nhập Số Quyết định:</strong> Khi chuyển sinh viên sang <em>Bảo lưu</em> hoặc <em>Thôi học</em>, hệ thống bắt buộc nhân viên giáo vụ phải điền <em>Số Quyết định</em> (VD: <code>QĐ-BDU-105/ĐH</code>) và <em>Lý do</em> để lưu vào <strong>Nhật ký Audit Trail</strong> phục vụ công tác thanh tra.
                    </div>
                  </div>
                </div>
              </div>

              {/* Export Excel with UTF-8 BOM */}
              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <div className="flex items-center gap-2 font-bold text-slate-900">
                  <Download className="w-4 h-4 text-emerald-600" />
                  <span>Xuất File Báo Cáo Không Bị Lỗi Font Tiếng Việt:</span>
                </div>
                <p className="text-slate-600 leading-relaxed">
                  Khi bấm nút <strong>"Xuất Excel"</strong>, hệ thống tự động gắn mã <strong>UTF-8 Byte Order Mark (BOM)</strong>. Tệp tải về có thể mở trực tiếp bằng Microsoft Excel 2016, 2019, 2021 hoặc Office 365 mà không bao giờ bị vỡ chữ tiếng Việt có dấu.
                </p>
              </div>
            </div>
          )}

          {/* SECTION 3: SCHEDULE */}
          {activeSection === 'schedule' && (
            <div className="space-y-5 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Quy Trình Xếp Thời Khóa Biểu & Ngăn Chặn Xung Đột
                  </h4>
                  <p className="text-xs text-slate-500">Mã phân hệ: Phân hệ 4 - Quản lý lịch học</p>
                </div>
                <button
                  onClick={() => handleGoToModule('schedule')}
                  className="px-3 py-1.5 bg-[#C8102E] text-white font-bold rounded-lg shadow-xs hover:bg-[#A50D25]"
                >
                  Mở Lịch Học
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-2">
                <h5 className="font-bold text-slate-900">Khung Giờ Các Ca Học Chuẩn Tại BDU:</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2 mt-2">
                  <div className="p-2 bg-white rounded border border-slate-200 font-mono text-[11px]">
                    <span className="font-bold text-[#C8102E]">Tiết 1-3:</span> 07:00 – 09:15
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200 font-mono text-[11px]">
                    <span className="font-bold text-[#C8102E]">Tiết 4-6:</span> 09:30 – 11:45
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200 font-mono text-[11px]">
                    <span className="font-bold text-[#C8102E]">Tiết 7-9:</span> 12:45 – 15:00
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200 font-mono text-[11px]">
                    <span className="font-bold text-[#C8102E]">Tiết 10-12:</span> 15:15 – 17:30
                  </div>
                  <div className="p-2 bg-white rounded border border-slate-200 font-mono text-[11px]">
                    <span className="font-bold text-[#C8102E]">Ca tối:</span> 18:00 – 20:45
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-rose-200 bg-rose-50/40 space-y-3">
                <div className="flex items-center gap-2 font-bold text-rose-900">
                  <AlertTriangle className="w-4 h-4 text-rose-600" />
                  <span>Cơ Chế Báo Động Trùng Lịch Tự Động (Conflict Engine):</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Khi giáo vụ xếp một lịch học mới hoặc xếp lịch học bù, hệ thống tự động kiểm tra 3 điều kiện và sẽ chặn lại nếu:
                </p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="p-3 rounded-lg bg-white border border-rose-200">
                    <span className="font-bold text-rose-800 block mb-0.5">1. Trùng Phòng Học</span>
                    <span className="text-[11px] text-slate-600">Phòng đó đã có một lớp khác đang học trong cùng Thứ và cùng Ca.</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-rose-200">
                    <span className="font-bold text-rose-800 block mb-0.5">2. Trùng Giảng Viên</span>
                    <span className="text-[11px] text-slate-600">Giảng viên đã có lịch dạy ở một phòng khác trong cùng ca học đó.</span>
                  </div>
                  <div className="p-3 rounded-lg bg-white border border-rose-200">
                    <span className="font-bold text-rose-800 block mb-0.5">3. Trùng Lớp Sinh Viên</span>
                    <span className="text-[11px] text-slate-600">Lớp sinh hoạt đã có môn khác trong thời khóa biểu cùng thời điểm.</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 4: ATTENDANCE */}
          {activeSection === 'attendance' && (
            <div className="space-y-5 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Nghiệp Vụ Điểm Danh, Tính Chuyên Cần & Cấm Thi
                  </h4>
                  <p className="text-xs text-slate-500">Mã phân hệ: Phân hệ 6 - Quản lý chuyên cần</p>
                </div>
                <button
                  onClick={() => handleGoToModule('attendance')}
                  className="px-3 py-1.5 bg-[#C8102E] text-white font-bold rounded-lg shadow-xs hover:bg-[#A50D25]"
                >
                  Mở Phân Hệ Chuyên Cần
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <h5 className="font-bold text-slate-900">4 Trạng Thái Điểm Danh Hợp Chuẩn:</h5>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-2">
                  <div className="p-3 bg-white rounded-lg border border-emerald-200 text-center">
                    <span className="font-bold text-emerald-700 block">Có mặt (PRESENT)</span>
                    <span className="text-[11px] text-slate-500 mt-0.5">Tính 100% tiết học</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-amber-200 text-center">
                    <span className="font-bold text-amber-700 block">Đi trễ (LATE)</span>
                    <span className="text-[11px] text-slate-500 mt-0.5">Vào lớp sau 15 phút</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-blue-200 text-center">
                    <span className="font-bold text-blue-700 block">Vắng có phép (EXCUSED)</span>
                    <span className="text-[11px] text-slate-500 mt-0.5">Có đơn nộp qua cổng SV</span>
                  </div>
                  <div className="p-3 bg-white rounded-lg border border-rose-200 text-center">
                    <span className="font-bold text-rose-700 block">Vắng không phép (UNEXCUSED)</span>
                    <span className="text-[11px] text-slate-500 mt-0.5">Trừ chuyên cần & tích lũy vắng</span>
                  </div>
                </div>
              </div>

              <div className="p-4 rounded-xl border border-amber-200 bg-amber-50/50 space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-900">
                  <ShieldAlert className="w-4 h-4 text-amber-600" />
                  <span>Quy Chế Cảnh Báo Cấm Thi (&gt;20% Số Tiết):</span>
                </div>
                <p className="text-slate-700 leading-relaxed">
                  Đối với học phần 3 tín chỉ (45 tiết / 15 buổi học), nếu sinh viên nghỉ từ <strong>3 buổi trở lên</strong> (tương đương vắng &gt; 20%), hệ thống sẽ tự động hiển thị dòng cảnh báo đỏ <strong>"Nguy cơ CẤM THI"</strong> trên bảng điểm danh của giảng viên và trên báo cáo của khoa để nhắc nhở sinh viên kịp thời.
                </p>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-white space-y-2">
                <h5 className="font-bold text-slate-900">Nhật Ký Chỉnh Sửa Điểm Danh (Audit Trail):</h5>
                <p className="text-slate-600 leading-relaxed">
                  Mỗi khi có sự điều chỉnh điểm danh (ví dụ sinh viên sau đó xuất trình giấy khám bệnh hoặc giấy phép hợp lệ), giáo vụ hoặc giảng viên phải chọn trạng thái mới và <strong>nhập lý do cụ thể</strong>. Hệ thống sẽ lưu giữ ai đã chỉnh sửa và thời điểm sửa để bảo đảm tính minh bạch.
                </p>
              </div>
            </div>
          )}

          {/* SECTION 5: REQUESTS */}
          {activeSection === 'requests' && (
            <div className="space-y-5 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Quy Trình Tiếp Nhận & Phê Duyệt Hồ Sơ Học Vụ Trực Tuyến
                  </h4>
                  <p className="text-xs text-slate-500">Mã phân hệ: Phân hệ 8 - Quản lý hồ sơ sinh viên</p>
                </div>
                <button
                  onClick={() => handleGoToModule('requests')}
                  className="px-3 py-1.5 bg-[#C8102E] text-white font-bold rounded-lg shadow-xs hover:bg-[#A50D25]"
                >
                  Mở Phân Hệ Hồ Sơ
                </button>
              </div>

              <div className="p-4 rounded-xl border border-slate-200 bg-slate-50 space-y-3">
                <h5 className="font-bold text-slate-900">Quy Trình Luân Chuyển Hồ Sơ 5 Bước Chuẩn:</h5>
                <div className="space-y-2">
                  <div className="flex items-start gap-3 p-2 bg-white rounded-lg border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-blue-100 text-blue-700 font-bold flex items-center justify-center shrink-0">1</span>
                    <div>
                      <strong className="text-slate-900">Sinh viên nộp đơn online:</strong> Sinh viên vào cổng, chọn loại đơn (Xin giấy xác nhận SV, Phúc khảo, Nghỉ học tạm thời), đính kèm file minh chứng. Hệ thống tự động tạo mã định danh duy nhất (VD: <code>BDU-NN-2026-042</code>).
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-2 bg-white rounded-lg border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-amber-100 text-amber-700 font-bold flex items-center justify-center shrink-0">2</span>
                    <div>
                      <strong className="text-slate-900">Giáo vụ tiếp nhận & kiểm tra:</strong> Giáo vụ khoa kiểm tra tính đầy đủ của file đính kèm và lệ phí (nếu có), chuyển trạng thái sang <em>"Đang thụ lý"</em>.
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-2 bg-white rounded-lg border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 font-bold flex items-center justify-center shrink-0">3</span>
                    <div>
                      <strong className="text-slate-900">Trình Ban Chủ Nhiệm Khoa:</strong> Trưởng khoa hoặc Phó trưởng khoa xem xét đơn, nhập ý kiến chỉ đạo và bấm <em>"Phê Duyệt Đơn"</em>.
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-2 bg-white rounded-lg border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-emerald-100 text-emerald-700 font-bold flex items-center justify-center shrink-0">4</span>
                    <div>
                      <strong className="text-slate-900">In kết quả / Phát hành giấy tờ:</strong> Giáo vụ in ấn mẫu giấy chứng nhận đã có chữ ký/con dấu hoặc cập nhật điểm phúc khảo.
                    </div>
                  </div>
                  <div className="flex items-start gap-3 p-2 bg-white rounded-lg border border-slate-200">
                    <span className="w-5 h-5 rounded-full bg-slate-100 text-slate-700 font-bold flex items-center justify-center shrink-0">5</span>
                    <div>
                      <strong className="text-slate-900">Hoàn tất & Lưu vết:</strong> Chuyển trạng thái sang <em>"Hoàn tất"</em>. Sinh viên nhận được thông báo ngay trên giao diện cá nhân.
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* SECTION 6: FAQ */}
          {activeSection === 'faq' && (
            <div className="space-y-4 text-xs">
              <div className="flex items-center justify-between pb-3 border-b border-slate-200">
                <div>
                  <h4 className="text-sm font-bold text-slate-900">
                    Các Câu Hỏi Thường Gặp & Xử Lý Sự Cố Nhanh (FAQ)
                  </h4>
                  <p className="text-xs text-slate-500">Giải đáp các vướng mắc phổ biến trong quá trình vận hành</p>
                </div>
              </div>

              <div className="space-y-3">
                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#C8102E]" />
                    <span>Làm thế nào để chia sẻ đường link cho sinh viên và giảng viên truy cập?</span>
                  </div>
                  <p className="text-slate-600 pl-6 leading-relaxed">
                    Chỉ cần gửi đường link chính thức: <code className="bg-slate-100 px-1 py-0.5 rounded text-[#C8102E] font-mono">https://ais-pre-6opinbznxxb2255gyf7n3g-650364392027.asia-southeast1.run.app</code>. Người dùng có thể mở trên Chrome, Safari, Edge mà không cần cài đặt ứng dụng phụ.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#C8102E]" />
                    <span>Hệ thống báo lỗi "Trùng phòng học" hoặc "Trùng lịch giảng viên" thì phải xử lý ra sao?</span>
                  </div>
                  <p className="text-slate-600 pl-6 leading-relaxed">
                    Đây là tính năng bảo vệ của phần mềm. Hãy kiểm tra lại lưới thời khóa biểu xem phòng đó hoặc giảng viên đó đã có lớp nào học trong cùng ca. Chọn một phòng học khác còn trống (VD: P.A105, P.B102, Lab Ngoại Ngữ 2) hoặc đổi sang ca học khác.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#C8102E]" />
                    <span>Dữ liệu có bị mất khi tôi tải lại trang (F5) hoặc đổi máy tính khác không?</span>
                  </div>
                  <p className="text-slate-600 pl-6 leading-relaxed">
                    Không. Mọi thay đổi về sinh viên, thời khóa biểu, điểm danh, đơn từ và thông báo đều được lưu tự động vào bộ lưu trữ liên tục (persistent storage). Nếu cần đưa hệ thống về dữ liệu gốc để tập huấn cho cán bộ mới, mở menu tài khoản ở góc phải và chọn <strong>"Reset Data"</strong>.
                  </p>
                </div>

                <div className="p-3.5 rounded-xl border border-slate-200 bg-white space-y-1">
                  <div className="font-bold text-slate-900 text-xs flex items-center gap-2">
                    <HelpCircle className="w-4 h-4 text-[#C8102E]" />
                    <span>Làm sao để kiểm tra nhanh toàn bộ 7 luồng nghiệp vụ bắt buộc trước khi đoàn kiểm định làm việc?</span>
                  </div>
                  <p className="text-slate-600 pl-6 leading-relaxed">
                    Bấm vào nút <strong>"Kiểm thử 7 Luồng"</strong> trên thanh menu trên cùng. Mỗi luồng đều có hướng dẫn từng bước và nút chuyển thẳng tới màn hình thao tác kèm kết quả kỳ vọng đã được kiểm chứng 100%.
                  </p>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex items-center justify-between text-xs">
          <div className="text-slate-500 hidden sm:block">
            Văn phòng Khoa Ngoại ngữ – Trường Đại học Bình Dương | Hotline Giáo vụ: 0274.3822.058
          </div>
          <button
            onClick={onClose}
            className="px-5 py-2 bg-[#C8102E] hover:bg-[#A50D25] text-white font-bold rounded-xl shadow-xs transition-colors ml-auto sm:ml-0"
          >
            Đóng Cẩm Nang
          </button>
        </div>
      </div>
    </div>
  );
};
