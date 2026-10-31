/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Bell,
  Plus,
  CheckCircle,
  Clock,
  Filter,
  Check,
  X,
  Eye,
  FileText,
  AlertTriangle,
  UserCheck,
  Send,
  Trash2
} from 'lucide-react';
import { Announcement, AnnouncementStatus, AnnouncementPriority, AnnouncementTarget } from '../../types';
import { BduAcademicService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';

export const AnnouncementManagementView: React.FC = () => {
  const { currentUser, activeRole, canCreateAnnouncement, canApproveAnnouncement } = useAuth();
  const [announcements, setAnnouncements] = useState<Announcement[]>(() => BduAcademicService.getAnnouncements());

  // Filter
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterCategory, setFilterCategory] = useState<string>('ALL');

  // Modal State
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedAnnouncement, setSelectedAnnouncement] = useState<Announcement | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Form State
  const [title, setTitle] = useState('');
  const [summary, setSummary] = useState('');
  const [content, setContent] = useState('');
  const [category, setCategory] = useState<Announcement['category']>('Học vụ');
  const [priority, setPriority] = useState<AnnouncementPriority>('NORMAL');
  const [target, setTarget] = useState<AnnouncementTarget>('ALL');
  const [targetDetail, setTargetDetail] = useState('');

  const refreshAnnouncements = () => {
    setAnnouncements(BduAcademicService.getAnnouncements());
  };

  const handleOpenCreate = () => {
    setTitle('');
    setSummary('');
    setContent('');
    setCategory('Học vụ');
    setPriority('NORMAL');
    setTarget('ALL');
    setTargetDetail('');
    setIsCreateModalOpen(true);
  };

  const handleSaveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Vui lòng nhập đầy đủ tiêu đề và nội dung thông báo!');
      return;
    }

    // Role Rule: If DEAN creates, it can be published directly; if Lecturer/Staff creates, status is PENDING_APPROVAL
    const initialStatus: AnnouncementStatus = activeRole === 'DEAN' ? 'PUBLISHED' : 'PENDING_APPROVAL';

    const newAnn = BduAcademicService.addAnnouncement({
      title,
      summary: summary || title,
      content,
      category,
      priority,
      target,
      targetDetail,
      authorId: currentUser.id,
      authorName: `${currentUser.name} (${currentUser.role})`,
      status: initialStatus,
      publishedAt: initialStatus === 'PUBLISHED' ? new Date().toLocaleString('vi-VN') : undefined,
      approvedBy: initialStatus === 'PUBLISHED' ? currentUser.id : undefined,
      approvedByName: initialStatus === 'PUBLISHED' ? currentUser.name : undefined,
      approvedAt: initialStatus === 'PUBLISHED' ? new Date().toLocaleString('vi-VN') : undefined
    });

    refreshAnnouncements();
    setIsCreateModalOpen(false);
  };

  // Dean approves announcement (LUỒNG 2)
  const handleApprove = (id: string) => {
    if (!canApproveAnnouncement) {
      alert('Chỉ Ban Chủ Nhiệm Khoa (DEAN) mới có thẩm quyền phê duyệt và phát hành thông báo!');
      return;
    }

    const res = BduAcademicService.approveAndPublishAnnouncement(id, currentUser.id, currentUser.name);
    if (res.success) {
      refreshAnnouncements();
      if (selectedAnnouncement && selectedAnnouncement.id === id) {
        setSelectedAnnouncement({ ...selectedAnnouncement, status: 'PUBLISHED' });
      }
    }
  };

  // View details and mark as read
  const handleViewDetails = (ann: Announcement) => {
    setSelectedAnnouncement(ann);
    setIsDetailModalOpen(true);
    BduAcademicService.markAnnouncementRead(ann.id, currentUser.id);
    refreshAnnouncements();
  };

  // Filtered items
  const filteredAnnouncements = announcements.filter(a => {
    const matchesStatus = filterStatus === 'ALL' || a.status === filterStatus;
    const matchesCat = filterCategory === 'ALL' || a.category === filterCategory;
    return matchesStatus && matchesCat;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Quản Lý & Phát Hành Thông Báo Khoa Ngoại Ngữ (LUỒNG 2)
            </h2>
            <span className="px-2 py-0.5 text-xs font-bold bg-red-50 text-[#C8102E] border border-red-200 rounded-md">
              {announcements.filter(a => a.status === 'PUBLISHED').length} Đã phát hành
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Quy trình khép kín: Soạn thảo → Chờ phê duyệt → Ban Chủ nhiệm duyệt → Phát hành đến người nhận
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canCreateAnnouncement && (
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#C8102E] hover:bg-[#A50D25] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Tạo Thông Báo Mới</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Filter className="w-4 h-4 text-slate-400" />
          <span>Lọc thông báo:</span>
        </div>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="PENDING_APPROVAL">Chờ phê duyệt</option>
          <option value="PUBLISHED">Đã phát hành</option>
          <option value="CANCELLED">Đã hủy</option>
        </select>

        <select
          value={filterCategory}
          onChange={e => setFilterCategory(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
        >
          <option value="ALL">Tất cả chuyên mục</option>
          <option value="Học vụ">Học vụ</option>
          <option value="Thi cử">Thi cử</option>
          <option value="Học bổng">Học bổng</option>
          <option value="Hoạt động Khoa">Hoạt động Khoa</option>
          <option value="Đồ án & Thực tập">Đồ án & Thực tập</option>
        </select>
      </div>

      {/* Announcements List */}
      <div className="space-y-3">
        {filteredAnnouncements.length === 0 ? (
          <div className="bg-white p-8 rounded-xl border border-slate-200 text-center text-slate-400 text-xs">
            Không có thông báo nào phù hợp với bộ lọc hiện tại.
          </div>
        ) : (
          filteredAnnouncements.map(ann => {
            const isRead = ann.readByUsers.includes(currentUser.id);

            return (
              <div
                key={ann.id}
                className={`bg-white rounded-xl border p-5 transition-all shadow-xs flex flex-col md:flex-row md:items-center justify-between gap-4 ${
                  ann.status === 'PENDING_APPROVAL'
                    ? 'border-amber-300 bg-amber-50/20'
                    : 'border-slate-200 hover:border-red-200'
                }`}
              >
                <div className="flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-[#C8102E] border border-red-200 uppercase">
                      {ann.category}
                    </span>

                    {ann.status === 'PENDING_APPROVAL' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-800 border border-amber-200">
                        Chờ Trưởng Khoa duyệt
                      </span>
                    )}

                    {ann.status === 'PUBLISHED' && (
                      <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-100 text-emerald-800 border border-emerald-200">
                        Đã phát hành
                      </span>
                    )}

                    <span className="text-xs text-slate-400">
                      Tạo ngày: {ann.createdAt}
                    </span>

                    {isRead ? (
                      <span className="text-[10px] text-slate-400 font-medium">Đã xem</span>
                    ) : (
                      <span className="text-[10px] text-emerald-600 font-bold">Mới</span>
                    )}
                  </div>

                  <h3 className="text-sm sm:text-base font-bold text-slate-900 mt-2">
                    {ann.title}
                  </h3>
                  <p className="text-xs text-slate-600 mt-1 line-clamp-2 leading-relaxed">
                    {ann.summary || ann.content}
                  </p>

                  <div className="flex flex-wrap items-center gap-3 mt-3 text-[11px] text-slate-500">
                    <span>Người soạn: <strong className="text-slate-700">{ann.authorName}</strong></span>
                    {ann.approvedByName && (
                      <>
                        <span>•</span>
                        <span>Người duyệt: <strong className="text-slate-700">{ann.approvedByName}</strong></span>
                      </>
                    )}
                    <span>•</span>
                    <span>Đối tượng nhận: <strong className="text-slate-700">{ann.target === 'ALL' ? 'Toàn thể Khoa' : ann.target}</strong></span>
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {/* Approve button for Dean in LUỒNG 2 */}
                  {ann.status === 'PENDING_APPROVAL' && canApproveAnnouncement && (
                    <button
                      onClick={() => handleApprove(ann.id)}
                      className="flex items-center gap-1.5 px-3.5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
                      title="Phê duyệt và phát hành ra toàn khoa"
                    >
                      <Check className="w-4 h-4" />
                      <span>Duyệt & Phát Hành</span>
                    </button>
                  )}

                  <button
                    onClick={() => handleViewDetails(ann)}
                    className="flex items-center gap-1.5 px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
                  >
                    <Eye className="w-4 h-4" />
                    <span>Xem Nội Dung</span>
                  </button>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* CREATE ANNOUNCEMENT MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[90vh] flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
              <div>
                <h3 className="text-base font-bold text-slate-900">
                  Soạn Thảo Thông Báo Học Vụ Mới
                </h3>
                <p className="text-xs text-slate-500">
                  Thông báo sẽ được chuyển đến Ban Chủ Nhiệm Khoa phê duyệt trước khi phát hành
                </p>
              </div>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCreate} className="flex-1 overflow-y-auto p-6 space-y-4 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tiêu đề thông báo *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Kế hoạch đăng ký học phần học kỳ 2..."
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Chuyên mục</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="Học vụ">Học vụ</option>
                    <option value="Thi cử">Thi cử</option>
                    <option value="Học bổng">Học bổng</option>
                    <option value="Hoạt động Khoa">Hoạt động Khoa</option>
                    <option value="Đồ án & Thực tập">Đồ án & Thực tập</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mức độ ưu tiên</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="NORMAL">Bình thường</option>
                    <option value="IMPORTANT">Quan trọng</option>
                    <option value="URGENT">Khẩn cấp</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Đối tượng nhận thông báo</label>
                  <select
                    value={target}
                    onChange={e => setTarget(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="ALL">Toàn thể Khoa</option>
                    <option value="STUDENTS">Toàn thể Sinh viên</option>
                    <option value="LECTURERS">Toàn thể Giảng viên</option>
                    <option value="COHORT">Theo Khóa sinh viên</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Chi tiết đối tượng (nếu có)</label>
                  <input
                    type="text"
                    placeholder="VD: K24, Lớp 24DTA01..."
                    value={targetDetail}
                    onChange={e => setTargetDetail(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tóm tắt ngắn gọn</label>
                <input
                  type="text"
                  placeholder="Tóm tắt 1-2 câu hiển thị ở danh sách xem nhanh..."
                  value={summary}
                  onChange={e => setSummary(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nội dung chi tiết *</label>
                <textarea
                  rows={6}
                  required
                  placeholder="Nhập toàn văn thông báo..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full p-3 rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
                >
                  Hủy bỏ
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C8102E] hover:bg-[#A50D25] text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  {activeRole === 'DEAN' ? 'Phát Hành Ngay' : 'Gửi Phê Duyệt'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL MODAL */}
      {isDetailModalOpen && selectedAnnouncement && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-red-50 text-[#C8102E] border border-red-200 uppercase">
                {selectedAnnouncement.category}
              </span>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div>
              <h3 className="text-base font-extrabold text-slate-900 leading-snug">
                {selectedAnnouncement.title}
              </h3>
              <div className="flex flex-wrap items-center gap-3 text-xs text-slate-500 mt-2 pb-3 border-b border-slate-100">
                <span>Người tạo: <strong className="text-slate-800">{selectedAnnouncement.authorName}</strong></span>
                <span>•</span>
                <span>Ngày tạo: {selectedAnnouncement.createdAt}</span>
                {selectedAnnouncement.publishedAt && (
                  <>
                    <span>•</span>
                    <span className="text-emerald-700 font-semibold">Phát hành: {selectedAnnouncement.publishedAt}</span>
                  </>
                )}
              </div>
            </div>

            <div className="text-xs text-slate-700 leading-relaxed whitespace-pre-line py-2 max-h-72 overflow-y-auto">
              {selectedAnnouncement.content}
            </div>

            {selectedAnnouncement.status === 'PENDING_APPROVAL' && canApproveAnnouncement && (
              <div className="p-3 bg-amber-50 rounded-xl border border-amber-200 flex items-center justify-between">
                <span className="text-xs font-bold text-amber-900">
                  Thông báo đang chờ Ban Chủ Nhiệm duyệt:
                </span>
                <button
                  onClick={() => handleApprove(selectedAnnouncement.id)}
                  className="px-4 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Phê Duyệt & Phát Hành
                </button>
              </div>
            )}

            <div className="pt-2 border-t border-slate-100 flex items-center justify-end">
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
              >
                Đóng
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
