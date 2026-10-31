/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import {
  LayoutDashboard,
  Users,
  GraduationCap,
  CalendarDays,
  CalendarCheck2,
  CheckCircle,
  Bell,
  FileText,
  Briefcase,
  BarChart3,
  UserCog,
  Settings,
  X
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { BduAcademicService } from '../../services/storage';

interface SidebarProps {
  currentTab: string;
  onSelectTab: (tabId: string) => void;
  isMobileOpen: boolean;
  onCloseMobile: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentTab,
  onSelectTab,
  isMobileOpen,
  onCloseMobile
}) => {
  const { activeRole } = useAuth();

  // Badges calculation
  const pendingRequestsCount = BduAcademicService.getRequests().filter(
    r => r.status === 'SUBMITTED' || r.status === 'IN_REVIEW'
  ).length;

  const pendingAnnouncementsCount = BduAcademicService.getAnnouncements().filter(
    a => a.status === 'PENDING_APPROVAL'
  ).length;

  const overdueTasksCount = BduAcademicService.getTasks().filter(
    t => t.status === 'OVERDUE' || (t.status === 'IN_PROGRESS' && new Date(t.dueDate) < new Date())
  ).length;

  const navItems = [
    { id: 'dashboard', label: '1. Dashboard Tổng quan', icon: LayoutDashboard },
    { id: 'students', label: '2. Quản lý sinh viên', icon: Users },
    { id: 'training', label: '3. Quản lý đào tạo', icon: GraduationCap },
    { id: 'schedule', label: '4. Quản lý lịch học', icon: CalendarDays },
    { id: 'exams', label: '5. Quản lý lịch thi', icon: CalendarCheck2 },
    { id: 'attendance', label: '6. Quản lý chuyên cần', icon: CheckCircle },
    { 
      id: 'announcements', 
      label: '7. Quản lý thông báo', 
      icon: Bell,
      badge: activeRole === 'DEAN' && pendingAnnouncementsCount > 0 ? `${pendingAnnouncementsCount} chờ duyệt` : undefined,
      badgeColor: 'bg-amber-100 text-amber-800'
    },
    { 
      id: 'requests', 
      label: '8. Quản lý hồ sơ SV', 
      icon: FileText,
      badge: pendingRequestsCount > 0 ? `${pendingRequestsCount} mới` : undefined,
      badgeColor: 'bg-blue-100 text-blue-800'
    },
    { 
      id: 'tasks', 
      label: '9. Quản lý công việc', 
      icon: Briefcase,
      badge: overdueTasksCount > 0 ? `${overdueTasksCount} cần xử lý` : undefined,
      badgeColor: 'bg-rose-100 text-rose-800'
    },
    { id: 'reports', label: '10. Báo cáo & Thống kê', icon: BarChart3 },
    { id: 'staff', label: '11. Quản lý nhân sự', icon: UserCog },
    { id: 'settings', label: '12. Cài đặt & Phân quyền', icon: Settings },
  ];

  return (
    <>
      {/* Mobile Backdrop */}
      {isMobileOpen && (
        <div 
          onClick={onCloseMobile}
          className="fixed inset-0 bg-slate-900/40 z-40 lg:hidden backdrop-blur-xs transition-opacity"
        />
      )}

      {/* Sidebar container */}
      <aside
        className={`fixed lg:sticky top-0 lg:top-16 left-0 h-full lg:h-[calc(100vh-4rem)] w-64 bg-white border-r border-slate-200 z-50 flex flex-col transition-transform duration-200 ease-in-out shrink-0 ${
          isMobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Mobile top close */}
        <div className="flex items-center justify-between p-4 border-b border-slate-100 lg:hidden">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#C8102E] text-white font-bold flex items-center justify-center text-sm">
              BDU
            </div>
            <span className="font-bold text-sm text-slate-800">Khoa Ngoại Ngữ</span>
          </div>
          <button 
            onClick={onCloseMobile}
            className="p-1 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-100"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Navigation list */}
        <div className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
          <div className="px-3 pb-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            Các phân hệ quản trị
          </div>

          {navItems.map(item => {
            const Icon = item.icon;
            const isActive = currentTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => {
                  onSelectTab(item.id);
                  onCloseMobile();
                }}
                className={`w-full flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-semibold transition-all group ${
                  isActive
                    ? 'bg-[#C8102E] text-white shadow-xs'
                    : 'text-slate-600 hover:bg-slate-50 hover:text-slate-900'
                }`}
              >
                <div className="flex items-center gap-2.5 truncate">
                  <Icon className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`} />
                  <span className="truncate">{item.label}</span>
                </div>

                {item.badge && (
                  <span className={`text-[10px] px-1.5 py-0.5 rounded-md font-bold whitespace-nowrap shrink-0 ml-1 ${
                    isActive ? 'bg-white/20 text-white' : item.badgeColor
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </div>

        {/* University Info Footer */}
        <div className="p-3 border-t border-slate-100 bg-slate-50/70">
          <div className="bg-white p-2.5 rounded-lg border border-slate-200">
            <div className="text-[11px] font-bold text-[#C8102E] uppercase">
              Đại học Bình Dương
            </div>
            <div className="text-[10px] text-slate-500 mt-0.5">
              504 Đại lộ Bình Dương, Hiệp Thành, Thủ Dầu Một
            </div>
            <div className="text-[10px] text-slate-400 mt-1 font-mono">
              Phiên bản học vụ 2026.1
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};
