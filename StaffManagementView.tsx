/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  UserCog,
  Mail,
  Phone,
  BookOpen,
  Briefcase,
  GraduationCap,
  Building,
  Award,
  Search,
  Filter
} from 'lucide-react';
import { FacultyStaff } from '../../types';
import { BduAcademicService } from '../../services/storage';

export const StaffManagementView: React.FC = () => {
  const [staffList, setStaffList] = useState<FacultyStaff[]>(() => BduAcademicService.getStaff());
  const [searchQuery, setSearchQuery] = useState('');
  const [filterDepartment, setFilterDepartment] = useState('ALL');

  const filteredStaff = staffList.filter(s => {
    const matchesQuery = s.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.staffCode.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = filterDepartment === 'ALL' || s.department.includes(filterDepartment);
    return matchesQuery && matchesDept;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Đội Ngũ Cán Bộ Giảng Viên Khoa Ngoại Ngữ
            </h2>
            <span className="px-2 py-0.5 text-xs font-bold bg-red-50 text-[#C8102E] border border-red-200 rounded-md">
              {staffList.length} Nhân sự
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Trường Đại học Bình Dương – Ban Chủ Nhiệm, Bộ môn Ngôn ngữ Anh, Bộ môn Trung - Hàn & Giáo vụ
          </p>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
          <input
            type="text"
            placeholder="Tìm theo Mã CB, Họ tên hoặc Email..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E]"
          />
        </div>

        <select
          value={filterDepartment}
          onChange={e => setFilterDepartment(e.target.value)}
          className="px-3 py-2 text-xs rounded-lg border border-slate-200 bg-white"
        >
          <option value="ALL">Tất cả Bộ môn / Đơn vị</option>
          <option value="Khoa Ngoại ngữ">Ban Chủ nhiệm Khoa</option>
          <option value="Bộ môn Ngôn ngữ Anh">Bộ môn Ngôn ngữ Anh</option>
          <option value="Bộ môn Ngôn ngữ Trung">Bộ môn Ngôn ngữ Trung - Hàn</option>
          <option value="Giáo vụ">Văn phòng Giáo vụ</option>
        </select>
      </div>

      {/* Staff Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredStaff.map(staff => (
          <div
            key={staff.id}
            className="bg-white rounded-xl border border-slate-200 p-5 shadow-xs hover:border-red-200 transition-colors flex flex-col justify-between"
          >
            <div>
              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-slate-100 border border-slate-200 text-[#C8102E] font-bold text-base flex items-center justify-center">
                    {staff.fullName.charAt(staff.fullName.lastIndexOf(' ') + 1)}
                  </div>
                  <div>
                    <h3 className="text-sm font-bold text-slate-900 leading-tight">
                      {staff.fullName}
                    </h3>
                    <div className="text-[11px] font-semibold text-[#C8102E] mt-0.5">
                      {staff.position}
                    </div>
                  </div>
                </div>
                <span className="font-mono text-[10px] text-slate-400 font-bold">
                  {staff.staffCode}
                </span>
              </div>

              <div className="mt-4 space-y-2 text-xs border-t border-slate-100 pt-3 text-slate-600">
                <div className="flex items-center gap-2">
                  <GraduationCap className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>Học vị: <strong className="text-slate-800">{staff.degree}</strong></span>
                </div>
                <div className="flex items-center gap-2">
                  <Building className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{staff.department}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span className="truncate">{staff.email}</span>
                </div>
                <div className="flex items-center gap-2">
                  <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                  <span>{staff.phone}</span>
                </div>
              </div>

              {/* Assigned courses */}
              <div className="mt-3 pt-2 border-t border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1">
                  Học phần phụ trách giảng dạy:
                </span>
                <div className="flex flex-wrap gap-1">
                  {staff.assignedCourses.map((c, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-50 text-slate-700 text-[10px] border border-slate-200">
                      {c}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-500">
              <span>Định mức HK1: <strong className="text-slate-700">{staff.teachingHoursThisSemester}h</strong></span>
              <span className="text-blue-700 font-semibold">{staff.activeTasksCount} nhiệm vụ</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
