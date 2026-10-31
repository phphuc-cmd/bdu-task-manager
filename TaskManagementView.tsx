/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  Briefcase,
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
  Award,
  Calendar,
  AlertCircle
} from 'lucide-react';
import { FacultyTask, TaskStatus, TaskPriority } from '../../types';
import { BduAcademicService } from '../../services/storage';
import { useAuth } from '../../context/AuthContext';

export const TaskManagementView: React.FC = () => {
  const { currentUser, activeRole, canAssignTasks, canAcceptTasks } = useAuth();
  const [tasks, setTasks] = useState<FacultyTask[]>(() => BduAcademicService.getTasks());
  const staffList = BduAcademicService.getStaff();

  // Filters
  const [filterStatus, setFilterStatus] = useState<string>('ALL');
  const [filterAssignee, setFilterAssignee] = useState<string>('ALL');

  // Modals
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [selectedTask, setSelectedTask] = useState<FacultyTask | null>(null);
  const [isUpdateProgressModalOpen, setIsUpdateProgressModalOpen] = useState(false);
  const [isAcceptModalOpen, setIsAcceptModalOpen] = useState(false);

  // Form State for new task
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState<FacultyTask['category']>('Soạn đề thi');
  const [assigneeId, setAssigneeId] = useState(staffList[2]?.id || 'staff-3');
  const [dueDate, setDueDate] = useState('2026-11-15');
  const [priority, setPriority] = useState<TaskPriority>('HIGH');

  // Update progress state
  const [progressPercent, setProgressPercent] = useState<number>(50);
  const [submissionNote, setSubmissionNote] = useState('');
  const [evidenceAttachment, setEvidenceAttachment] = useState('');

  // Acceptance state
  const [acceptanceFeedback, setAcceptanceFeedback] = useState('');
  const [acceptanceScore, setAcceptanceScore] = useState<'Xuất sắc' | 'Đạt yêu cầu' | 'Cần chỉnh sửa'>('Xuất sắc');

  const refreshTasks = () => {
    setTasks(BduAcademicService.getTasks());
  };

  const handleOpenCreate = () => {
    setTitle('');
    setDescription('');
    setCategory('Soạn đề thi');
    setAssigneeId(staffList[2]?.id || 'staff-3');
    setDueDate('2026-11-20');
    setPriority('HIGH');
    setIsCreateModalOpen(true);
  };

  const handleSaveCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      alert('Vui lòng nhập tên công việc!');
      return;
    }

    const assignee = staffList.find(s => s.id === assigneeId);

    BduAcademicService.addTask({
      title,
      description,
      category,
      assignerId: currentUser.id,
      assignerName: currentUser.name,
      assigneeId,
      assigneeName: assignee ? assignee.fullName : 'Giảng viên',
      startDate: new Date().toISOString().split('T')[0],
      dueDate,
      progressPercent: 0,
      status: 'TODO',
      priority
    });

    refreshTasks();
    setIsCreateModalOpen(false);
  };

  // Open progress update modal
  const handleOpenProgress = (task: FacultyTask) => {
    setSelectedTask(task);
    setProgressPercent(task.progressPercent);
    setSubmissionNote(task.submissionNote || '');
    setEvidenceAttachment(task.evidenceAttachment || 'Bao_cao_minh_chung.pdf');
    setIsUpdateProgressModalOpen(true);
  };

  const handleSaveProgress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;

    BduAcademicService.updateTaskProgress(
      selectedTask.id,
      progressPercent,
      submissionNote,
      evidenceAttachment
    );

    refreshTasks();
    setIsUpdateProgressModalOpen(false);
  };

  // Open acceptance modal (LUỒNG 6)
  const handleOpenAccept = (task: FacultyTask) => {
    setSelectedTask(task);
    setAcceptanceFeedback('Đạt chất lượng và tiến độ yêu cầu của Khoa.');
    setAcceptanceScore('Xuất sắc');
    setIsAcceptModalOpen(true);
  };

  const handleSaveAccept = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTask) return;

    BduAcademicService.acceptTask(
      selectedTask.id,
      acceptanceFeedback,
      acceptanceScore
    );

    refreshTasks();
    setIsAcceptModalOpen(false);
  };

  const getStatusBadge = (status: TaskStatus) => {
    switch (status) {
      case 'TODO':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-slate-100 text-slate-700 border border-slate-200">Chưa bắt đầu</span>;
      case 'IN_PROGRESS':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-blue-100 text-blue-800 border border-blue-200">Đang thực hiện</span>;
      case 'SUBMITTED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-200">Chờ nghiệm thu</span>;
      case 'ACCEPTED':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-emerald-100 text-emerald-800 border border-emerald-200">Đã nghiệm thu</span>;
      case 'OVERDUE':
        return <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-rose-100 text-rose-800 border border-rose-200">Quá hạn</span>;
      default:
        return null;
    }
  };

  const filteredTasks = tasks.filter(t => {
    const matchesStatus = filterStatus === 'ALL' || t.status === filterStatus;
    const matchesAssignee = filterAssignee === 'ALL' || t.assigneeId === filterAssignee;
    return matchesStatus && matchesAssignee;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Quản Lý Công Việc & Tiến Độ Nhân Sự Khoa (LUỒNG 6)
            </h2>
            <span className="px-2 py-0.5 text-xs font-bold bg-slate-100 text-slate-800 border border-slate-200 rounded-md">
              {tasks.length} Nhiệm vụ
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Giao việc học vụ, giám sát tiến độ %, nộp minh chứng và Hội đồng Khoa nghiệm thu chất lượng
          </p>
        </div>

        <div className="flex items-center gap-2">
          {canAssignTasks && (
            <button
              onClick={handleOpenCreate}
              className="flex items-center gap-1.5 px-4 py-2 bg-[#C8102E] hover:bg-[#A50D25] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Giao Việc Mới</span>
            </button>
          )}
        </div>
      </div>

      {/* Filter bar */}
      <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-xs flex flex-wrap items-center gap-3">
        <div className="flex items-center gap-2 text-xs font-bold text-slate-700">
          <Filter className="w-4 h-4 text-slate-400" />
          <span>Lọc công việc:</span>
        </div>

        <select
          value={filterStatus}
          onChange={e => setFilterStatus(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
        >
          <option value="ALL">Tất cả trạng thái</option>
          <option value="TODO">Chưa thực hiện</option>
          <option value="IN_PROGRESS">Đang thực hiện</option>
          <option value="SUBMITTED">Đã nộp, Chờ nghiệm thu</option>
          <option value="ACCEPTED">Đã nghiệm thu</option>
          <option value="OVERDUE">Quá hạn</option>
        </select>

        <select
          value={filterAssignee}
          onChange={e => setFilterAssignee(e.target.value)}
          className="px-3 py-1.5 text-xs rounded-lg border border-slate-200 bg-white"
        >
          <option value="ALL">Tất cả người phụ trách</option>
          {staffList.map(s => (
            <option key={s.id} value={s.id}>{s.fullName}</option>
          ))}
        </select>
      </div>

      {/* Tasks Table */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-50 text-slate-700 font-bold uppercase tracking-wider border-b border-slate-200">
              <tr>
                <th className="px-4 py-3">Mã việc</th>
                <th className="px-4 py-3">Tên công việc / Chuyên mục</th>
                <th className="px-4 py-3">Người phụ trách</th>
                <th className="px-4 py-3">Hạn chót</th>
                <th className="px-4 py-3">Tiến độ %</th>
                <th className="px-4 py-3">Trạng thái</th>
                <th className="px-4 py-3 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {filteredTasks.map(task => {
                const isOverdue = new Date(task.dueDate) < new Date() && task.status !== 'ACCEPTED';

                return (
                  <tr key={task.id} className="hover:bg-slate-50">
                    <td className="px-4 py-3 font-mono font-bold text-[#C8102E]">{task.taskCode}</td>
                    <td className="px-4 py-3">
                      <div className="font-semibold text-slate-900">{task.title}</div>
                      <div className="text-[11px] text-slate-400">{task.category}</div>
                    </td>
                    <td className="px-4 py-3 font-medium text-slate-800">
                      {task.assigneeName}
                    </td>
                    <td className="px-4 py-3">
                      <div className={`font-semibold ${isOverdue ? 'text-rose-600 font-bold flex items-center gap-1' : 'text-slate-700'}`}>
                        {isOverdue && <AlertTriangle className="w-3.5 h-3.5" />}
                        <span>{task.dueDate}</span>
                      </div>
                    </td>
                    <td className="px-4 py-3 w-40">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 h-2 bg-slate-100 rounded-full overflow-hidden">
                          <div
                            className={`h-full rounded-full transition-all ${
                              task.progressPercent === 100
                                ? 'bg-emerald-600'
                                : 'bg-[#C8102E]'
                            }`}
                            style={{ width: `${task.progressPercent}%` }}
                          />
                        </div>
                        <span className="font-mono text-slate-700 font-bold text-[11px] shrink-0">
                          {task.progressPercent}%
                        </span>
                      </div>
                    </td>
                    <td className="px-4 py-3">{getStatusBadge(task.status)}</td>
                    <td className="px-4 py-3 text-right">
                      <div className="inline-flex items-center gap-1">
                        {/* Update Progress */}
                        <button
                          onClick={() => handleOpenProgress(task)}
                          className="px-2.5 py-1 bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold rounded-lg transition-colors"
                          title="Cập nhật tiến độ & nộp minh chứng"
                        >
                          Tiến độ
                        </button>

                        {/* Dean Acceptance Button (LUỒNG 6) */}
                        {canAcceptTasks && task.status !== 'ACCEPTED' && (
                          <button
                            onClick={() => handleOpenAccept(task)}
                            className="px-2.5 py-1 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors"
                            title="Nghiệm thu và đánh giá công việc"
                          >
                            Nghiệm thu
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE TASK MODAL */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-xl w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Giao Việc Nội Bộ Khoa Ngoại Ngữ
              </h3>
              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveCreate} className="space-y-3 text-xs">
              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tên công việc / nhiệm vụ *</label>
                <input
                  type="text"
                  required
                  placeholder="VD: Rà soát ngân hàng đề thi môn Văn hóa Anh - Mỹ"
                  value={title}
                  onChange={e => setTitle(e.target.value)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Chuyên mục nhiệm vụ</label>
                  <select
                    value={category}
                    onChange={e => setCategory(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="Soạn đề thi">Soạn đề thi</option>
                    <option value="Kiểm định chất lượng">Kiểm định chất lượng</option>
                    <option value="Đề cương chi tiết">Đề cương chi tiết</option>
                    <option value="Hội thảo khoa học">Hội thảo khoa học</option>
                    <option value="Tư vấn tuyển sinh">Tư vấn tuyển sinh</option>
                    <option value="Chấm thi học kỳ">Chấm thi học kỳ</option>
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Mức độ ưu tiên</label>
                  <select
                    value={priority}
                    onChange={e => setPriority(e.target.value as any)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white"
                  >
                    <option value="LOW">Thấp</option>
                    <option value="MEDIUM">Trung bình</option>
                    <option value="HIGH">Cao</option>
                    <option value="CRITICAL">Khẩn cấp</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Người phụ trách chính *</label>
                  <select
                    value={assigneeId}
                    onChange={e => setAssigneeId(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-medium"
                  >
                    {staffList.map(s => (
                      <option key={s.id} value={s.id}>{s.fullName} ({s.position})</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="font-semibold text-slate-700 block mb-1">Thời hạn hoàn thành (Deadline) *</label>
                  <input
                    type="date"
                    required
                    value={dueDate}
                    onChange={e => setDueDate(e.target.value)}
                    className="w-full px-3 py-2 rounded-lg border border-slate-200"
                  />
                </div>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Mô tả yêu cầu chi tiết</label>
                <textarea
                  rows={3}
                  value={description}
                  onChange={e => setDescription(e.target.value)}
                  placeholder="Ghi rõ tiêu chuẩn đầu ra, số lượng bản giao nộp..."
                  className="w-full p-2.5 rounded-lg border border-slate-200 focus:outline-none focus:border-[#C8102E]"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-[#C8102E] hover:bg-[#A50D25] text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Phân Công Nhiệm Vụ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* UPDATE PROGRESS & SUBMIT EVIDENCE MODAL */}
      {isUpdateProgressModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="text-base font-bold text-slate-900">
                Cập Nhật Tiến Độ & Nộp Minh Chứng
              </h3>
              <button
                onClick={() => setIsUpdateProgressModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveProgress} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="font-bold text-slate-900">{selectedTask.title}</div>
                <div className="text-slate-500 mt-0.5">Phụ trách: {selectedTask.assigneeName}</div>
              </div>

              <div>
                <div className="flex justify-between font-semibold text-slate-700 mb-1">
                  <span>Tiến độ thực tế:</span>
                  <span className="font-mono text-sm text-[#C8102E] font-bold">{progressPercent}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={progressPercent}
                  onChange={e => setProgressPercent(parseInt(e.target.value))}
                  className="w-full accent-[#C8102E]"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Tên file minh chứng đã nộp</label>
                <input
                  type="text"
                  value={evidenceAttachment}
                  onChange={e => setEvidenceAttachment(e.target.value)}
                  placeholder="Bao_cao_nghiem_thu.pdf"
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 font-mono text-xs"
                />
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Ghi chú tiến độ / Báo cáo tóm tắt</label>
                <textarea
                  rows={3}
                  value={submissionNote}
                  onChange={e => setSubmissionNote(e.target.value)}
                  placeholder="Trình bày công việc đã thực hiện..."
                  className="w-full p-2 rounded-lg border border-slate-200"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsUpdateProgressModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
                >
                  Đóng
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-[#C8102E] hover:bg-[#A50D25] text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Lưu Tiến Độ
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ACCEPTANCE MODAL (DEAN ONLY) */}
      {isAcceptModalOpen && selectedTask && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 border border-slate-200 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600" />
                <h3 className="text-base font-bold text-slate-900">
                  Nghiệm Thu Nhiệm Vụ Khoa (LUỒNG 6)
                </h3>
              </div>
              <button
                onClick={() => setIsAcceptModalOpen(false)}
                className="p-1 rounded-lg text-slate-400 hover:text-slate-600"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveAccept} className="space-y-4 text-xs">
              <div className="p-3 bg-slate-50 rounded-xl">
                <div className="font-bold text-slate-900">{selectedTask.title}</div>
                <div className="text-slate-500 mt-1">
                  Người thực hiện: <strong className="text-slate-800">{selectedTask.assigneeName}</strong>
                </div>
                {selectedTask.evidenceAttachment && (
                  <div className="mt-1 text-blue-600 font-mono text-[11px]">
                    Minh chứng nộp: {selectedTask.evidenceAttachment}
                  </div>
                )}
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Đánh giá chất lượng hoàn thành *</label>
                <select
                  value={acceptanceScore}
                  onChange={e => setAcceptanceScore(e.target.value as any)}
                  className="w-full px-3 py-2 rounded-lg border border-slate-200 bg-white font-bold text-slate-800"
                >
                  <option value="Xuất sắc">Xuất sắc</option>
                  <option value="Đạt yêu cầu">Đạt yêu cầu</option>
                  <option value="Cần chỉnh sửa">Cần chỉnh sửa</option>
                </select>
              </div>

              <div>
                <label className="font-semibold text-slate-700 block mb-1">Ý kiến nhận xét của Hội đồng / Trưởng Khoa</label>
                <textarea
                  rows={3}
                  value={acceptanceFeedback}
                  onChange={e => setAcceptanceFeedback(e.target.value)}
                  placeholder="Ghi nhận xét và chỉ đạo tiếp theo..."
                  className="w-full p-2.5 rounded-lg border border-slate-200"
                />
              </div>

              <div className="pt-3 border-t border-slate-200 flex items-center justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setIsAcceptModalOpen(false)}
                  className="px-4 py-2 bg-slate-200 text-slate-700 text-xs font-bold rounded-lg"
                >
                  Hủy
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs"
                >
                  Xác Nhận Nghiệm Thu
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
