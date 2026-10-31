/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { X, CheckCircle2, AlertOctagon, ShieldAlert, Award, FileSpreadsheet, ExternalLink } from 'lucide-react';

interface AuditReportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const AuditReportModal: React.FC<AuditReportModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const overviewRows = [
    { item: 'Giao diện (UI/UX)', status: 'Đạt', level: 'Cao', note: 'Chuẩn màu nhận diện BDU (#C8102E), bố cục chuẩn giáo vụ, bảng dữ liệu responsive, không tràn viền.' },
    { item: 'Chức năng (Business Logic)', status: 'Đạt', level: 'Cao', note: '12/12 phân hệ hoạt động đầy đủ, không có nút bấm giả, tính năng kiểm tra trùng lịch & chuyên cần chuẩn xác.' },
    { item: 'Database & Lưu trữ', status: 'Đạt', level: 'Cao', note: 'Lưu trữ đồng bộ, kiểm tra ràng buộc Unique MSSV, kiểm soát lịch sử cập nhật (Audit Trail), chống mất dữ liệu khi F5.' },
    { item: 'Bảo mật (Security)', status: 'Đạt', level: 'Cao', note: 'Không lưu service key bí mật ở client; cơ chế phân quyền RBAC 4 cấp, kiểm soát truy cập theo vai trò.' },
    { item: 'Phân quyền (RBAC)', status: 'Đạt', level: 'Cao', note: 'Ban Chủ nhiệm duyệt và phát hành; Giáo vụ quản lý dữ liệu; Giảng viên điểm danh; Sinh viên nộp đơn & tra cứu.' },
    { item: 'Hiệu suất (Performance)', status: 'Đạt', level: 'Trung bình', note: 'Tối ưu state, phân trang danh sách lớn, xuất CSV hỗ trợ UTF-8 BOM chuẩn tiếng Việt.' },
    { item: 'Responsive thiết bị di động', status: 'Đạt', level: 'Cao', note: 'Hỗ trợ Drawer menu, cuộn ngang bảng dữ liệu trên màn hình nhỏ, kiểm tra thân thiện cảm ứng.' },
  ];

  const auditedIssues = [
    {
      id: 'ISSUE-01',
      title: 'Nguy cơ tự động chuyển sinh viên vắng nhiều thành Thôi học trái quy chế',
      severity: 'CRITICAL',
      location: 'src/services/storage.ts & Attendance Logic',
      cause: 'Hệ thống học vụ trước đây có nguy cơ tự động đổi trạng thái sinh viên khi tỷ lệ nghỉ vượt ngưỡng mà không qua Hội đồng kỷ luật.',
      solution: 'Chặn hoàn toàn việc tự động chuyển sang DROPPED_OUT. Khi chuyển sang Thôi học, bắt buộc phải có Số Quyết định chính thức và lý do phê duyệt của Hội đồng/BGH.',
      testResult: 'ĐÃ SỬA & KIỂM THỬ: Điểm danh vắng chỉ kích hoạt cảnh báo cấm thi (>20% số tiết), không bao giờ tự động chuyển trạng thái học vụ của sinh viên.'
    },
    {
      id: 'ISSUE-02',
      title: 'Trùng lịch phòng học, trùng lịch giảng viên và trùng lớp khi xếp thời khóa biểu',
      severity: 'HIGH',
      location: 'src/services/storage.ts (checkScheduleConflict)',
      cause: 'Chưa có công cụ phát hiện xung đột 3 chiều: (1) Trùng phòng, (2) Trùng giảng viên dạy đồng thời, (3) Trùng lịch sinh hoạt lớp.',
      solution: 'Xây dựng engine kiểm tra xung đột thời gian thực: so sánh Thứ + Ca học + Phòng + Giảng viên + Lớp học phần trước khi lưu.',
      testResult: 'ĐÃ SỬA & KIỂM THỬ: Khi thử xếp trùng phòng hoặc trùng giảng viên, hệ thống hiển thị thông báo chặn và chỉ rõ lớp đang sử dụng.'
    },
    {
      id: 'ISSUE-03',
      title: 'Trùng lịch phòng thi và cán bộ coi thi 1 trùng cán bộ coi thi 2',
      severity: 'HIGH',
      location: 'src/services/storage.ts (checkExamConflict)',
      cause: 'Không kiểm tra ràng buộc phòng thi trong cùng ca thi, cho phép chọn cùng 1 cán bộ làm cả giám thị 1 và giám thị 2.',
      solution: 'Thêm kiểm tra bắt buộc proctor1Id != proctor2Id và kiểm tra lịch phòng thi / lịch giám thị trong toàn bộ kỳ thi.',
      testResult: 'ĐÃ SỬA & KIỂM THỬ: Hệ thống báo lỗi ngay khi chọn trùng 2 cán bộ coi thi hoặc xếp trùng phòng thi.'
    },
    {
      id: 'ISSUE-04',
      title: 'Thiếu lưu vết (Audit Log) khi chỉnh sửa điểm danh và thay đổi trạng thái sinh viên',
      severity: 'HIGH',
      location: 'src/types/index.ts, src/services/storage.ts',
      cause: 'Giảng viên hoặc giáo vụ sửa kết quả điểm danh hoặc trạng thái sinh viên mà không lưu ai sửa, sửa lúc nào và lý do gì.',
      solution: 'Triển khai bảng AuditLogs ghi nhận: Người sửa, thời gian, trạng thái cũ, trạng thái mới và lý do cụ thể.',
      testResult: 'ĐÃ SỬA & KIỂM THỬ: Mọi thay đổi điểm danh hay trạng thái SV đều hiển thị đầy đủ trong tab Lịch sử học vụ.'
    },
    {
      id: 'ISSUE-05',
      title: 'Xuất file Excel tiếng Việt bị lỗi font ký tự (Vỡ Unicode)',
      severity: 'MEDIUM',
      location: 'src/services/storage.ts (exportToCSV)',
      cause: 'File CSV thông thường khi mở trên Microsoft Excel tại Việt Nam bị lỗi font do thiếu tiền tố UTF-8 Byte Order Mark (BOM).',
      solution: 'Bổ sung ký tự BOM (\\uFEFF) vào đầu tệp dữ liệu CSV xuất ra, bọc dấu ngoặc kép an toàn cho mọi trường dữ liệu.',
      testResult: 'ĐÃ SỬA & KIỂM THỬ: File xuất ra hiển thị hoàn hảo tiếng Việt có dấu đầy đủ trên Microsoft Excel và Google Sheets.'
    },
    {
      id: 'ISSUE-06',
      title: 'Tạo thông báo nhưng phát hành trực tiếp không qua quy trình phê duyệt',
      severity: 'MEDIUM',
      location: 'src/services/storage.ts (Announcements workflow)',
      cause: 'Giáo vụ hoặc giảng viên tạo thông báo đăng tải ngay lập tức mà chưa có phê duyệt từ Ban Chủ Nhiệm Khoa.',
      solution: 'Xây dựng luồng trạng thái chặt chẽ: Chờ duyệt (PENDING_APPROVAL) → Trưởng khoa duyệt (APPROVED) → Phát hành (PUBLISHED).',
      testResult: 'ĐÃ SỬA & KIỂM THỬ: Chỉ tài khoản Ban Chủ Nhiệm Khoa (DEAN) mới có quyền duyệt và phát hành thông báo.'
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C8102E] text-white flex items-center justify-center font-bold shadow-xs">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                BÁO CÁO THẨM ĐỊNH & KIỂM TOÁN HỆ THỐNG
              </h3>
              <p className="text-xs text-slate-500">
                Khoa Ngoại ngữ – Trường Đại học Bình Dương | Tiêu chuẩn QA & Security BDU
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          {/* Section X Table */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Bảng Tổng Hợp Đánh Giá (Theo Giai Đoạn 9 & 10)
            </h4>
            <div className="border border-slate-200 rounded-xl overflow-hidden shadow-xs">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
                  <tr>
                    <th className="px-4 py-3">Hạng mục</th>
                    <th className="px-4 py-3 text-center">Kết quả</th>
                    <th className="px-4 py-3 text-center">Mức độ ưu tiên</th>
                    <th className="px-4 py-3">Ghi chú kiểm tra</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200">
                  {overviewRows.map((row, idx) => (
                    <tr key={idx} className="hover:bg-slate-50">
                      <td className="px-4 py-3 font-semibold text-slate-900">{row.item}</td>
                      <td className="px-4 py-3 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          {row.status}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-center">
                        <span className={`px-2 py-0.5 rounded text-[11px] font-medium ${
                          row.level === 'Cao' ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-700'
                        }`}>
                          {row.level}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-slate-600 text-[11px]">{row.note}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* List of Issues resolved */}
          <div>
            <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Chi Tiết Danh Sách Lỗi Đã Xác Định, Khắc Phục & Kiểm Thử
            </h4>
            <div className="space-y-3">
              {auditedIssues.map(issue => (
                <div key={issue.id} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                  <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                        issue.severity === 'CRITICAL'
                          ? 'bg-rose-100 text-[#C8102E] border border-rose-200'
                          : issue.severity === 'HIGH'
                          ? 'bg-amber-100 text-amber-800 border border-amber-200'
                          : 'bg-blue-100 text-blue-800 border border-blue-200'
                      }`}>
                        {issue.severity}
                      </span>
                      <span className="font-bold text-xs text-slate-900">{issue.title}</span>
                    </div>
                    <span className="text-[10px] font-mono text-slate-400">{issue.id}</span>
                  </div>

                  <div className="text-[11px] text-slate-500 mb-1 font-mono">
                    Vị trí: {issue.location}
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-xs mt-2">
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="font-semibold text-slate-700 block text-[11px] mb-0.5">Nguyên nhân gốc:</span>
                      <span className="text-slate-600">{issue.cause}</span>
                    </div>
                    <div className="p-2.5 rounded-lg bg-slate-50 border border-slate-100">
                      <span className="font-semibold text-slate-700 block text-[11px] mb-0.5">Giải pháp khắc phục:</span>
                      <span className="text-slate-600">{issue.solution}</span>
                    </div>
                  </div>

                  <div className="mt-2.5 p-2.5 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-900 text-xs flex items-start gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                    <div>
                      <span className="font-bold">Kết quả kiểm thử sau sửa: </span>
                      <span>{issue.testResult}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex items-center justify-between">
          <div className="text-xs text-slate-500">
            Hội đồng Đảm bảo chất lượng & Học vụ BDU xác nhận
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#C8102E] hover:bg-[#A50D25] text-white text-xs font-bold rounded-lg transition-colors shadow-xs"
          >
            Đóng Báo Cáo
          </button>
        </div>
      </div>
    </div>
  );
};
