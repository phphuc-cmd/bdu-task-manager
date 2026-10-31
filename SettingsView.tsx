/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Settings,
  Shield,
  UserCheck,
  RotateCcw,
  CheckCircle2,
  AlertTriangle,
  Lock,
  Key,
  Server,
  Layers
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { BduAcademicService } from '../../services/storage';

export const SettingsView: React.FC = () => {
  const { activeRole, switchRole } = useAuth();
  const [semester, setSemester] = useState('Học kỳ 1 - Năm học 2026-2027');
  const [examProhibitThreshold, setExamProhibitThreshold] = useState(20);
  const [savedMessage, setSavedMessage] = useState(false);

  const permissionsMatrix = [
    { module: 'Xem Dashboard & Tra cứu TKB cá nhân', DEAN: true, ACADEMIC_AFFAIRS: true, LECTURER: true, STUDENT: true },
    { module: 'Quản lý & Chỉnh sửa hồ sơ Sinh viên', DEAN: true, ACADEMIC_AFFAIRS: true, LECTURER: false, STUDENT: false },
    { module: 'Xếp Lịch Học & Lịch Học Bù (Xử lý xung đột)', DEAN: true, ACADEMIC_AFFAIRS: true, LECTURER: false, STUDENT: false },
    { module: 'Xếp Lịch Thi & Phân Công Giám Thị', DEAN: true, ACADEMIC_AFFAIRS: true, LECTURER: false, STUDENT: false },
    { module: 'Ghi nhận & Chỉnh sửa Điểm danh Chuyên cần', DEAN: true, ACADEMIC_AFFAIRS: true, LECTURER: true, STUDENT: false },
    { module: 'Nộp Đơn từ / Thủ tục Học vụ trực tuyến', DEAN: false, ACADEMIC_AFFAIRS: false, LECTURER: false, STUDENT: true },
    { module: 'Thụ lý & Phê duyệt Hồ sơ sinh viên', DEAN: true, ACADEMIC_AFFAIRS: true, LECTURER: false, STUDENT: false },
    { module: 'Phê duyệt & Phát hành Thông báo Khoa', DEAN: true, ACADEMIC_AFFAIRS: false, LECTURER: false, STUDENT: false },
    { module: 'Giao Việc & Phân công nhiệm vụ nhân sự', DEAN: true, ACADEMIC_AFFAIRS: true, LECTURER: false, STUDENT: false },
    { module: 'Nghiệm thu & Đánh giá chất lượng công việc', DEAN: true, ACADEMIC_AFFAIRS: false, LECTURER: false, STUDENT: false },
    { module: 'Xuất Báo cáo Thống kê & File Excel UTF-8 BOM', DEAN: true, ACADEMIC_AFFAIRS: true, LECTURER: false, STUDENT: false },
  ];

  const handleSaveConfigs = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedMessage(true);
    setTimeout(() => setSavedMessage(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Cài Đặt Hệ Thống & Ma Trận Phân Quyền (RBAC)
            </h2>
            <span className="px-2 py-0.5 text-xs font-bold bg-[#C8102E]/10 text-[#C8102E] border border-red-200 rounded-md">
              LUỒNG 7
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Thiết lập bảo mật, thẩm định quyền hạn theo 4 nhóm vai trò và cấu hình học kỳ hiện hành
          </p>
        </div>

        <button
          onClick={() => {
            if (confirm('Khôi phục toàn bộ dữ liệu hệ thống về trạng thái ban đầu của Khoa Ngoại ngữ?')) {
              BduAcademicService.resetToDefault();
            }
          }}
          className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-red-50 hover:text-[#C8102E] text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
        >
          <RotateCcw className="w-4 h-4" />
          <span>Reset Dữ Liệu Về Mặc Định</span>
        </button>
      </div>

      {/* Role Switcher for Testing LUỒNG 7 */}
      <div className="bg-white p-5 rounded-xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-[#C8102E]" />
            <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
              Chuyển Đổi Nhanh Vai Trò Để Kiểm Thử (LUỒNG 7)
            </h3>
          </div>
          <span className="text-xs text-slate-500">
            Hiện tại đang đăng nhập: <strong className="text-slate-900">{activeRole}</strong>
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
          {[
            { role: 'DEAN', title: 'Ban Chủ Nhiệm Khoa', desc: 'Toàn quyền phê duyệt, thông báo, nghiệm thu' },
            { role: 'ACADEMIC_AFFAIRS', title: 'Văn Phòng Giáo Vụ', desc: 'Quản lý sinh viên, xếp lịch, xử lý hồ sơ' },
            { role: 'LECTURER', title: 'Giảng Viên Giảng Dạy', desc: 'Xem TKB, điểm danh, nộp tiến độ việc' },
            { role: 'STUDENT', title: 'Sinh Viên Chính Quy', desc: 'Xem TKB, chuyên cần, nộp đơn trực tuyến' }
          ].map(item => (
            <button
              key={item.role}
              onClick={() => switchRole(item.role as UserRole)}
              className={`p-4 rounded-xl border text-left transition-all ${
                activeRole === item.role
                  ? 'bg-red-50/70 border-[#C8102E] shadow-xs'
                  : 'bg-slate-50/50 border-slate-200 hover:bg-slate-100'
              }`}
            >
              <div className="flex items-center justify-between">
                <span className={`text-xs font-bold ${activeRole === item.role ? 'text-[#C8102E]' : 'text-slate-900'}`}>
                  {item.title}
                </span>
                {activeRole === item.role && <CheckCircle2 className="w-4 h-4 text-[#C8102E]" />}
              </div>
              <p className="text-[11px] text-slate-500 mt-1 leading-relaxed">{item.desc}</p>
            </button>
          ))}
        </div>
      </div>

      {/* RBAC Matrix Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Shield className="w-4 h-4 text-[#C8102E]" />
            <h3 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
              Ma Trận Phân Quyền Chi Tiết (Role-Based Access Control)
            </h3>
          </div>
          <span className="text-xs text-slate-500 font-mono">
            Security Principle of Least Privilege
          </span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-100 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Phân hệ chức năng / Thao tác nghiệp vụ</th>
                <th className="px-4 py-3 text-center">Ban Chủ Nhiệm (DEAN)</th>
                <th className="px-4 py-3 text-center">Giáo Vụ (ACADEMIC)</th>
                <th className="px-4 py-3 text-center">Giảng Viên (LECTURER)</th>
                <th className="px-4 py-3 text-center">Sinh Viên (STUDENT)</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {permissionsMatrix.map((row, idx) => (
                <tr key={idx} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{row.module}</td>
                  <td className="px-4 py-3 text-center">
                    {row.DEAN ? (
                      <span className="text-emerald-600 font-bold">✓ Cho phép</span>
                    ) : (
                      <span className="text-slate-300">✕</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {row.ACADEMIC_AFFAIRS ? (
                      <span className="text-emerald-600 font-bold">✓ Cho phép</span>
                    ) : (
                      <span className="text-slate-300">✕</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {row.LECTURER ? (
                      <span className="text-emerald-600 font-bold">✓ Cho phép</span>
                    ) : (
                      <span className="text-slate-300">✕</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-center">
                    {row.STUDENT ? (
                      <span className="text-emerald-600 font-bold">✓ Cho phép</span>
                    ) : (
                      <span className="text-slate-300">✕ Chặn</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* University Configurations */}
      <div className="bg-white p-6 rounded-xl border border-slate-200 shadow-xs space-y-4">
        <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider">
          Cấu Hình Học Kỳ & Tham Số Học Vụ BDU
        </h3>

        {savedMessage && (
          <div className="p-3 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Đã lưu tham số cấu hình thành công!</span>
          </div>
        )}

        <form onSubmit={handleSaveConfigs} className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
          <div>
            <label className="font-semibold text-slate-700 block mb-1">Học kỳ đào tạo hiện hành</label>
            <input
              type="text"
              value={semester}
              onChange={e => setSemester(e.target.value)}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E]"
            />
          </div>

          <div>
            <label className="font-semibold text-slate-700 block mb-1">
              Ngưỡng tỷ lệ vắng tối đa trước khi CẤM THI (%)
            </label>
            <input
              type="number"
              min="10"
              max="50"
              value={examProhibitThreshold}
              onChange={e => setExamProhibitThreshold(parseInt(e.target.value))}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E]"
            />
            <span className="text-[11px] text-slate-400 mt-0.5 block">
              Chuẩn Đại học Bình Dương: 20% tổng số tiết học phần
            </span>
          </div>

          <div className="sm:col-span-2 pt-2 flex justify-end">
            <button
              type="submit"
              className="px-5 py-2 bg-[#C8102E] hover:bg-[#A50D25] text-white font-bold rounded-lg shadow-xs transition-colors"
            >
              Lưu Cấu Hình
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
