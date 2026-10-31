/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  Bell, 
  Menu, 
  UserCheck, 
  ClipboardCheck, 
  FileSpreadsheet, 
  RotateCcw,
  Shield,
  Layers,
  BookOpen,
  ChevronDown
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';
import { BduAcademicService } from '../../services/storage';

interface NavbarProps {
  onToggleMobileMenu: () => void;
  onOpenAuditReport: () => void;
  onOpenWorkflowTester: () => void;
  onOpenUserManual: () => void;
  onSelectTab: (tabId: string) => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onToggleMobileMenu,
  onOpenAuditReport,
  onOpenWorkflowTester,
  onOpenUserManual,
  onSelectTab
}) => {
  const { currentUser, activeRole, switchRole } = useAuth();
  const [showRoleMenu, setShowRoleMenu] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);

  const announcements = BduAcademicService.getAnnouncements();
  const requests = BduAcademicService.getRequests();
  const tasks = BduAcademicService.getTasks();

  const unreadAnnouncements = announcements.filter(a => a.status === 'PUBLISHED' && !a.readByUsers.includes(currentUser.id));
  const pendingRequests = requests.filter(r => r.status === 'SUBMITTED' || r.status === 'IN_REVIEW');
  const activeTasks = tasks.filter(t => t.status === 'IN_PROGRESS' || t.status === 'TODO');

  const totalNotifications = unreadAnnouncements.length + (activeRole === 'DEAN' || activeRole === 'ACADEMIC_AFFAIRS' ? pendingRequests.length : 0);

  const roleLabels: Record<UserRole, { title: string; badge: string; color: string }> = {
    DEAN: {
      title: 'Ban Chủ Nhiệm Khoa',
      badge: 'Trưởng Khoa',
      color: 'bg-rose-100 text-[#C8102E] border-rose-200'
    },
    ACADEMIC_AFFAIRS: {
      title: 'Văn Phòng Giáo Vụ',
      badge: 'Giáo Vụ Khoa',
      color: 'bg-blue-100 text-blue-800 border-blue-200'
    },
    LECTURER: {
      title: 'Giảng Viên Giảng Dạy',
      badge: 'Giảng Viên',
      color: 'bg-emerald-100 text-emerald-800 border-emerald-200'
    },
    STUDENT: {
      title: 'Sinh Viên Chính Quy',
      badge: 'Sinh Viên',
      color: 'bg-amber-100 text-amber-800 border-amber-200'
    }
  };

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs">
      <div className="flex items-center justify-between px-4 sm:px-6 h-16">
        {/* Left: Mobile trigger & Logo Title */}
        <div className="flex items-center gap-3">
          <button
            onClick={onToggleMobileMenu}
            className="lg:hidden p-2 rounded-lg text-slate-600 hover:bg-slate-100 focus:outline-none"
            aria-label="Toggle menu"
          >
            <Menu className="w-5 h-5" />
          </button>

          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#C8102E] flex items-center justify-center text-white font-black text-lg tracking-wider shadow-sm shadow-red-200 border border-red-700">
              BDU
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-sm sm:text-base text-slate-900 tracking-tight">
                  BDU ACADEMIC MANAGEMENT
                </span>
                <span className="hidden sm:inline-block px-2 py-0.5 text-[11px] font-semibold bg-red-50 text-[#C8102E] border border-red-200 rounded-md">
                  Khoa Ngoại Ngữ
                </span>
              </div>
              <p className="hidden md:block text-[11px] text-slate-500 font-medium">
                Hệ thống Quản trị Học vụ & Đào tạo – Trường Đại học Bình Dương
              </p>
            </div>
          </div>
        </div>

        {/* Right Actions: Workflow runner, Audit Report, Notifications, Role Switcher */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Cẩm Nang Giáo Vụ (User Manual) */}
          <button
            onClick={onOpenUserManual}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-amber-50 hover:bg-amber-100 rounded-lg transition-colors border border-amber-200"
            title="Mở cẩm nang hướng dẫn sử dụng nhanh dành cho giáo vụ"
          >
            <BookOpen className="w-3.5 h-3.5 text-amber-600" />
            <span className="hidden lg:inline">Cẩm Nang Giáo Vụ</span>
            <span className="lg:hidden">HDSD</span>
          </button>

          {/* Workflow Tester (Luồng 1 - 7) */}
          <button
            onClick={onOpenWorkflowTester}
            className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors border border-slate-200"
            title="Kiểm thử các luồng nghiệp vụ bắt buộc LUỒNG 1 đến LUỒNG 7"
          >
            <Layers className="w-3.5 h-3.5 text-[#C8102E]" />
            <span>Kiểm thử 7 Luồng</span>
          </button>

          {/* Audit Report Button */}
          <button
            onClick={onOpenAuditReport}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-[#C8102E] bg-red-50 hover:bg-red-100 rounded-lg transition-colors border border-red-200"
            title="Xem báo cáo thẩm định hệ thống theo chuẩn QA/Security BDU"
          >
            <ClipboardCheck className="w-3.5 h-3.5" />
            <span className="hidden md:inline">Báo cáo Kiểm toán</span>
          </button>

          {/* Notification Bell */}
          <div className="relative">
            <button
              onClick={() => setShowNotifications(!showNotifications)}
              className="relative p-2 rounded-lg text-slate-600 hover:bg-slate-100 transition-colors"
              aria-label="Thông báo hệ thống"
            >
              <Bell className="w-5 h-5" />
              {totalNotifications > 0 && (
                <span className="absolute top-1.5 right-1.5 w-4 h-4 bg-[#C8102E] text-white text-[10px] font-bold rounded-full flex items-center justify-center animate-pulse">
                  {totalNotifications}
                </span>
              )}
            </button>

            {/* Notification Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="flex items-center justify-between px-4 py-2 border-b border-slate-100">
                  <span className="font-bold text-xs text-slate-800 uppercase tracking-wider">
                    Thông báo & Yêu cầu ({totalNotifications})
                  </span>
                  <button
                    onClick={() => {
                      onSelectTab('announcements');
                      setShowNotifications(false);
                    }}
                    className="text-xs text-[#C8102E] hover:underline font-semibold"
                  >
                    Xem tất cả
                  </button>
                </div>

                <div className="max-h-72 overflow-y-auto divide-y divide-slate-100">
                  {unreadAnnouncements.length === 0 && pendingRequests.length === 0 ? (
                    <div className="p-6 text-center text-xs text-slate-400">
                      Không có thông báo mới nào chưa đọc
                    </div>
                  ) : (
                    <>
                      {unreadAnnouncements.map(ann => (
                        <div
                          key={ann.id}
                          onClick={() => {
                            onSelectTab('announcements');
                            setShowNotifications(false);
                          }}
                          className="p-3 hover:bg-slate-50 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold uppercase tracking-wider text-red-600">
                              {ann.category}
                            </span>
                            <span className="text-[10px] text-slate-400">{ann.publishedAt || ann.createdAt}</span>
                          </div>
                          <p className="text-xs font-semibold text-slate-800 mt-1 line-clamp-1">{ann.title}</p>
                          <p className="text-[11px] text-slate-500 line-clamp-1 mt-0.5">{ann.summary}</p>
                        </div>
                      ))}

                      {pendingRequests.map(req => (
                        <div
                          key={req.id}
                          onClick={() => {
                            onSelectTab('requests');
                            setShowNotifications(false);
                          }}
                          className="p-3 hover:bg-slate-50 cursor-pointer transition-colors bg-amber-50/40"
                        >
                          <div className="flex items-center justify-between">
                            <span className="text-[10px] font-bold text-amber-700">HỒ SƠ CHỜ XỬ LÝ</span>
                            <span className="text-[10px] text-slate-400">{req.submittedAt}</span>
                          </div>
                          <p className="text-xs font-semibold text-slate-800 mt-1">{req.requestType}</p>
                          <p className="text-[11px] text-slate-500">
                            Sinh viên: {req.studentName} ({req.mssv})
                          </p>
                        </div>
                      ))}
                    </>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* Role Switcher Dropdown */}
          <div className="relative">
            <button
              onClick={() => setShowRoleMenu(!showRoleMenu)}
              className="flex items-center gap-2 pl-2 pr-3 py-1.5 rounded-lg border border-slate-200 hover:bg-slate-50 transition-colors"
            >
              <div className="w-7 h-7 rounded-full bg-slate-100 text-slate-700 flex items-center justify-center font-bold text-xs border border-slate-300">
                {currentUser.name.charAt(currentUser.name.lastIndexOf(' ') + 1) || 'U'}
              </div>
              <div className="text-left hidden sm:block">
                <div className="text-xs font-bold text-slate-900 leading-tight">
                  {currentUser.name}
                </div>
                <div className="flex items-center gap-1">
                  <span className={`text-[10px] font-semibold px-1.5 py-0.2 rounded border ${roleLabels[activeRole].color}`}>
                    {roleLabels[activeRole].badge}
                  </span>
                </div>
              </div>
              <ChevronDown className="w-3.5 h-3.5 text-slate-400 ml-1" />
            </button>

            {/* Role Switcher Menu */}
            {showRoleMenu && (
              <div className="absolute right-0 mt-2 w-72 bg-white rounded-xl shadow-xl border border-slate-200 py-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                <div className="px-4 py-2 border-b border-slate-100">
                  <p className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
                    Chuyển đổi vai trò (RBAC Test)
                  </p>
                  <p className="text-xs text-slate-600 mt-0.5">
                    Hỗ trợ kiểm thử phân quyền ngay theo LUỒNG 7
                  </p>
                </div>

                <div className="p-1 space-y-1">
                  {(['DEAN', 'ACADEMIC_AFFAIRS', 'LECTURER', 'STUDENT'] as UserRole[]).map(role => (
                    <button
                      key={role}
                      onClick={() => {
                        switchRole(role);
                        setShowRoleMenu(false);
                      }}
                      className={`w-full text-left px-3 py-2 rounded-lg text-xs font-medium flex items-center justify-between transition-colors ${
                        activeRole === role
                          ? 'bg-red-50 text-[#C8102E] font-bold'
                          : 'text-slate-700 hover:bg-slate-100'
                      }`}
                    >
                      <div>
                        <div>{roleLabels[role].title}</div>
                        <div className="text-[11px] text-slate-400 font-normal">
                          {role === 'DEAN' && 'Toàn quyền phê duyệt, thông báo, báo cáo'}
                          {role === 'ACADEMIC_AFFAIRS' && 'Quản lý sinh viên, lịch học, lịch thi'}
                          {role === 'LECTURER' && 'Xem lịch dạy, điểm danh, nộp công việc'}
                          {role === 'STUDENT' && 'Xem lịch học, nộp đơn, xem chuyên cần'}
                        </div>
                      </div>
                      {activeRole === role && <UserCheck className="w-4 h-4 text-[#C8102E]" />}
                    </button>
                  ))}
                </div>

                <div className="border-t border-slate-100 mt-1 pt-1 px-3 py-1.5 flex items-center justify-between">
                  <span className="text-[11px] text-slate-400">Dữ liệu thử nghiệm</span>
                  <button
                    onClick={() => {
                      if (confirm('Khôi phục toàn bộ dữ liệu mẫu ban đầu của Khoa Ngoại ngữ?')) {
                        BduAcademicService.resetToDefault();
                      }
                    }}
                    className="flex items-center gap-1 text-[11px] text-slate-600 hover:text-red-600 transition-colors"
                  >
                    <RotateCcw className="w-3 h-3" />
                    <span>Reset Data</span>
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
