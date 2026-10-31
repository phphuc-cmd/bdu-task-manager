/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  FileText,
  Plus,
  Clock,
  CheckCircle2,
  AlertTriangle,
  UserCheck,
  Send,
  Download,
  Filter,
  Eye,
  Paperclip,
  Check,
  X,
  FileCheck
} from 'lucide-react';
import { StudentRequest, StudentRequestStatus, StudentRequestType } from '../../types';
import { BduAcademicService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';

export const StudentRequestManagementView: React.FC = () => {
  const { currentUser, activeRole, canApproveRequests } = useAuth();
  const [requests, setRequests] = useState<StudentRequest[]>(() => BduAcademicService.getRequests());
  const staffList = BduAcademicService.getStaff();

  // Filters
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterType, setFilterType] = useState<string>('ALL');

  // Modals
  const [isSubmitModalOpen, setIsSubmitModalOpen] = useState(false);
  const [selectedRequest, setSelectedRequest] = useState<StudentRequest | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Form State for new student request
  const [requestType, setRequestType] = useState<StudentRequestType>('Đơn cấp giấy chứng nhận sinh viên');
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [attachmentName, setAttachmentName] = useState('Don_yeu_cau_minh_chung.pdf');

  // Review / Decision state
  const [decisionNote, setDecisionNote] = useState('');
  const [assigneeStaffName, setAssigneeStaffName] = useState('ThS. Trần Thị Kim Oanh');

  const refreshRequests = () => {
    setRequests(BduAcademicService.getRequests());
  };

  const handleOpenSubmit = () => {
    setTitle('');
    setContent('');
    setRequestType('Đơn cấp giấy chứng nhận sinh viên');
    setAttachmentName('Minh_chung_dinh_kem.pdf');
    setIsSubmitModalOpen(true);
  };

  const handleSaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      alert('Vui lòng nhập tiêu đề và nội dung đơn!');
      return;
    }

    const newReq = BduAcademicService.addRequest({
      studentId: currentUser.id,
      mssv: currentUser.code || '240501001',
      studentName: currentUser.name,
      studentClass: currentUser.department || '24DTA01',
      studentEmail: currentUser.email,
      studentPhone: currentUser.phone,
      requestType,
      title,
      content,
      attachmentName: attachmentName.trim() ? attachmentName : undefined,
      status: 'SUBMITTED'
    });

    refreshRequests();
    setIsSubmitModalOpen(false);
  };

  const handleUpdateStatus = (id: string, newStat: StudentRequestStatus) => {
    const res = BduAcademicService.updateRequestStatus(
      id,
      newStat,
      currentUser.name,
      currentUser.role,
      decisionNote,
      assigneeStaffName
    );

    if (res.success) {
      refreshRequests();
      const updated = BduAcademicService.getRequests().find(r => r.id === id);
      if (updated) setSelectedRequest(updated);
      setDecisionNote('');
    }
  };

  const getStatusBadge = (status: StudentRequestStatus) => {
    switch (status) {
      case 'SUBMITTED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">Tiếp nhận</span>;
      case 'IN_REVIEW':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Đang thụ lý</span>;
      case 'NEED_INFO':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-purple-100 text-purple-800 border border-purple-200">Cần bổ sung</span>;
      case 'APPROVED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Đã phê duyệt</span>;
      case 'REJECTED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">Từ chối</span>;
      case 'COMPLETED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-800 border border-slate-200">Hoàn tất</span>;
      default:
        return null;
    }
  };

  const filteredRequests = requests.filter(r => {
    const matchesStatus = filterStatus === 'ALL' || r.status === filterStatus;
    const matchesType = filterType === 'ALL' || r.requestType === filterType;
    return matchesStatus && matchesType;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Phân Hệ Tiếp Nhận & Phê Duyệt Hồ Sơ Học Vụ (LUỒNG 5)
            </h2>
            <span className="px-2 py-0.5 text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200 rounded-md">
              {requests.length} Hồ sơ trực tuyến
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Quy trình học vụ điện tử: Tiếp nhận → Phân công cán bộ thụ lý → Ban Chủ nhiệm phê duyệt → Trả kết quả
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleOpenSubmit}
            className="flex items-center gap-1.5 px-4 py-2 bg-[#C8102E] hover:bg-[#A50D25] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>Nộp Đơn Trực Tuyến</span>
          </button>
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Filter className="w-4 h-4 text-slate-400" />
          <span>Lọc hồ sơ:</span>
        </div>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="SUBMITTED">Mới tiếp nhận</option>
          <option value="IN_REVIEW">Đang thụ lý</option>
          <option value="NEED_INFO">Cần bổ sung</option>
          <option value="APPROVED">Đã phê duyệt</option>
          <option value="REJECTED">Từ chối</option>
          <option value="COMPLETED">Hoàn tất</option>
        </select>

        <select
          value={filterType}
          onChange={e => setFilterType(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
        >
          <option value="ALL">Tất cả loại hồ sơ</option>
          <option value="Đơn xin nghỉ học tạm thời (Bảo lưu)">Đơn xin nghỉ học tạm thời (Bảo lưu)</option>
          <option value="Đơn xin phúc khảo điểm thi">Đơn xin phúc khảo điểm thi</option>
          <option value="Đơn cấp giấy chứng nhận sinh viên">Đơn cấp giấy chứng nhận sinh viên</option>
          <option value="Đơn xin miễn giảm học phần / Công nhận tín chỉ">Đơn miễn giảm học phần</option>
        </select>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Mã hồ sơ</th>
                <th className="px-4 py-3">Sinh viên</th>
                <th className="px-4 py-3">Loại đơn / Tiêu đề</th>
                <th className="px-4 py-3">Ngày gửi</th>
                <th className="px-4 py-3">Cán bộ thụ lý</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredRequests.map(req => (
                <tr key={req.id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-mono font-bold text-[#C8102E]">{req.requestCode}</td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-900">{req.studentName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">MSSV: {req.mssv} - Lớp: {req.studentClass}</div>
                  </td>
                  <td className="px-4 py-3">
                    <div className="font-semibold text-slate-800">{req.requestType}</div>
                    <div className="text-[11px] text-slate-500 line-clamp-1">{req.title}</div>
                  </td>
                  <td className="px-4 py-3 text-slate-500">{req.submittedAt}</td>
                  <td className="px-4 py-3 text-slate-700 font-medium">
                    {req.assignedStaffName || 'Chưa phân công'}
                  </td>
                  <td className="px-4 py-3">{getStatusBadge(req.status)}</td>
                  <td className="px-4 py-3 text-right">
                    <button
                      onClick={() => {
                        setSelectedRequest(req);
                        setDecisionNote(req.decisionNote || '');
                        setIsDetailModalOpen(true);
                      }}
                      className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors inline-flex items-center gap-1"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Xử lý & Lịch sử</span>
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* SUBMIT MODAL */}
      {isSubmitModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Nộp Đơn Học Vụ Trực Tuyến
              </h3>
              <button
                onClick={() => setIsSubmitModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveSubmit} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Loại thủ tục hành chính *</label>
                <select
                  value={requestType}
                  onChange={e => setRequestType(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-medium"
                >
                  <option value="Đơn cấp giấy chứng nhận sinh viên">Đơn cấp giấy chứng nhận sinh viên</option>
                  <option value="Đơn xin phúc khảo điểm thi">Đơn xin phúc khảo điểm thi</option>
                  <option value="Đơn xin nghỉ học tạm thời (Bảo lưu)">Đơn xin nghỉ học tạm thời (Bảo lưu)</option>
                  <option value="Đơn xin miễn giảm học phần / Công nhận tín chỉ">Đơn miễn giảm học phần / Công nhận tín chỉ</option>
                  <option value="Đơn đăng ký học lại / Học cải thiện">Đơn đăng ký học lại / Học cải thiện</option>
                  <option value="Đơn chuyển ngành / Chuyển lớp">Đơn chuyển ngành / Chuyển lớp</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tiêu đề yêu cầu *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Xin cấp giấy chứng nhận sinh viên vay vốn ngân hàng chính sách"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Nội dung chi tiết & lý do *</label>
                <textarea
                  rows={4}
                  required
                  placeholder="Trình bày rõ lý do, môn học hoặc số lượng bản cần cấp..."
                  value={content}
                  onChange={e => setContent(e.target.value)}
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tên file minh chứng đính kèm (PDF/Ảnh)</label>
                <div className="flex items-center gap-2">
                  <Paperclip className="w-4 h-4 text-slate-400" />
                  <input
                    type="text"
                    value={attachmentName}
                    onChange={e => setAttachmentName(e.target.value)}
                    placeholder="Minh_chung_ho_so.pdf"
                    className="flex-1 px-3 py-1.5 rounded-lg border border-slate-200 font-mono text-xs"
                  />
                </div>
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsSubmitModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C8102E] hover:bg-[#A50D25] text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Gửi Hồ Sơ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DETAIL & TIMELINE MODAL */}
      {isDetailModalOpen && selectedRequest && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
              <div>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-[#C8102E]">{selectedRequest.requestCode}</span>
                  <span>{getStatusBadge(selectedRequest.status)}</span>
                </div>
                <h3 className="text-base font-bold text-slate-900 mt-1">
                  {selectedRequest.title}
                </h3>
              </div>
              <button
                onClick={() => setIsDetailModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-6 space-y-6 text-xs">
              {/* Info grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 p-4 rounded-xl bg-slate-50 border border-slate-100">
                <div>
                  <span className="text-slate-400 block mb-0.5">Sinh viên yêu cầu:</span>
                  <span className="font-bold text-slate-800">{selectedRequest.studentName} ({selectedRequest.mssv})</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Lớp:</span>
                  <span className="font-semibold text-slate-800">{selectedRequest.studentClass}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Số điện thoại:</span>
                  <span className="font-semibold text-slate-800">{selectedRequest.studentPhone}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Cán bộ thụ lý:</span>
                  <span className="font-semibold text-slate-800">{selectedRequest.assignedStaffName || 'Chưa phân công'}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Ngày nộp đơn:</span>
                  <span className="font-semibold text-slate-800">{selectedRequest.submittedAt}</span>
                </div>
                <div>
                  <span className="text-slate-400 block mb-0.5">Tệp đính kèm:</span>
                  <span className="font-mono text-blue-600 underline cursor-pointer">{selectedRequest.attachmentName || 'Không có'}</span>
                </div>
              </div>

              {/* Content */}
              <div>
                <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-1">
                  Nội dung đơn trình bày:
                </h4>
                <div className="p-3.5 rounded-xl bg-white border border-slate-200 text-slate-800 leading-relaxed whitespace-pre-line">
                  {selectedRequest.content}
                </div>
              </div>

              {/* Review and Approval Panel (LUỒNG 5) */}
              {canApproveRequests && (
                <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200 space-y-3">
                  <span className="font-bold text-xs text-amber-900 block">
                    Thẩm định & Phê duyệt (Dành cho Giáo vụ & Ban Chủ Nhiệm):
                  </span>

                  <div>
                    <label className="text-slate-700 block mb-1 font-semibold">
                      Ý kiến phản hồi / Hướng dẫn giải quyết:
                    </label>
                    <textarea
                      rows={2}
                      value={decisionNote}
                      onChange={e => setDecisionNote(e.target.value)}
                      placeholder="Nhập ý kiến phê duyệt hoặc hướng dẫn sinh viên..."
                      className="w-full p-2 rounded-lg border border-slate-200 bg-white"
                    />
                  </div>

                  <div className="flex flex-wrap items-center gap-2">
                    <button
                      onClick={() => handleUpdateStatus(selectedRequest.id, 'IN_REVIEW')}
                      className="px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-lg shadow-xs"
                    >
                      Tiếp Nhận Thụ Lý
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedRequest.id, 'APPROVED')}
                      className="px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-lg shadow-xs"
                    >
                      Phê Duyệt Đơn
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedRequest.id, 'COMPLETED')}
                      className="px-3 py-1.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-lg shadow-xs"
                    >
                      Đã Trả Kết Quả (Hoàn Tất)
                    </button>
                    <button
                      onClick={() => handleUpdateStatus(selectedRequest.id, 'REJECTED')}
                      className="px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white font-bold rounded-lg shadow-xs"
                    >
                      Từ Chối
                    </button>
                  </div>
                </div>
              )}

              {/* Timeline History */}
              <div>
                <h4 className="font-bold text-slate-700 uppercase tracking-wider text-[11px] mb-2">
                  Dòng Thời Gian Xử Lý (Timeline Activity)
                </h4>
                <div className="space-y-2 border-l-2 border-slate-200 pl-4 ml-2">
                  {selectedRequest.timeline.map((event, idx) => (
                    <div key={event.id} className="relative">
                      <div className="absolute -left-[21px] top-1 w-2.5 h-2.5 rounded-full bg-[#C8102E] border-2 border-white" />
                      <div className="text-[11px] text-slate-400">{event.timestamp}</div>
                      <div className="font-bold text-slate-800">{event.action}</div>
                      <div className="text-slate-600">Thực hiện bởi: <strong className="text-slate-700">{event.actorName}</strong> ({event.actorRole})</div>
                      {event.comment && (
                        <div className="mt-1 p-2 rounded bg-slate-100 text-slate-700 italic">
                          "{event.comment}"
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-4 border-t border-slate-200 bg-slate-50 rounded-b-2xl flex items-center justify-end">
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
