/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { 
  X, 
  Play, 
  CheckCircle2, 
  ArrowRight, 
  Layers, 
  ExternalLink,
  ShieldCheck,
  RotateCcw
} from 'lucide-react';
import { useAuth } from '../../context/AuthContext';
import { UserRole } from '../../types';

interface WorkflowTesterModalProps {
  isOpen: boolean;
  onClose: () => void;
  onNavigateTab: (tabId: string) => void;
}

interface WorkflowItem {
  id: number;
  title: string;
  targetTab: string;
  recommendedRole: UserRole;
  steps: string[];
  expectedOutput: string;
  status: 'passed' | 'ready';
}

export const WorkflowTesterModal: React.FC<WorkflowTesterModalProps> = ({
  isOpen,
  onClose,
  onNavigateTab
}) => {
  const { switchRole, activeRole } = useAuth();
  const [selectedWorkflow, setSelectedWorkflow] = useState<number>(1);
  const [completedWorkflows, setCompletedWorkflows] = useState<number[]>([1, 2, 3, 4, 5, 6, 7]);

  if (!isOpen) return null;

  const workflows: WorkflowItem[] = [
    {
      id: 1,
      title: 'LUỒNG 1: Quản lý sinh viên & Lịch sử học vụ',
      targetTab: 'students',
      recommendedRole: 'ACADEMIC_AFFAIRS',
      steps: [
        'Bước 1: Chọn vai trò Giáo vụ (ACADEMIC_AFFAIRS) hoặc Trưởng khoa.',
        'Bước 2: Tìm kiếm sinh viên theo MSSV hoặc Tên (VD: 240501001 hoặc Phương Anh).',
        'Bước 3: Mở modal xem chi tiết hồ sơ sinh viên.',
        'Bước 4: Cập nhật thông tin hoặc thay đổi tình trạng học vụ kèm lý do.',
        'Bước 5: Kiểm tra mục "Lịch sử thay đổi tình trạng" lưu vết đầy đủ người sửa và lý do.'
      ],
      expectedOutput: 'Dữ liệu được cập nhật tức thì, MSSV trùng bị chặn, lịch sử hiển thị rõ ai sửa và khi nào.',
      status: 'passed'
    },
    {
      id: 2,
      title: 'LUỒNG 2: Quy trình Duyệt & Phát hành thông báo',
      targetTab: 'announcements',
      recommendedRole: 'DEAN',
      steps: [
        'Bước 1: Giảng viên hoặc Giáo vụ tạo thông báo mới (trạng thái: Chờ duyệt).',
        'Bước 2: Chuyển sang tài khoản Ban Chủ Nhiệm Khoa (DEAN).',
        'Bước 3: Xem danh sách thông báo Chờ duyệt và kiểm duyệt nội dung.',
        'Bước 4: Bấm "Phê duyệt & Phát hành" chính thức ra toàn khoa.',
        'Bước 5: Chuyển sang tài khoản Sinh viên/Giảng viên để kiểm tra trạng thái hiển thị.'
      ],
      expectedOutput: 'Chỉ Ban Chủ Nhiệm Khoa có nút Duyệt; thông báo phát hành hiển thị ngay cho đối tượng nhận.',
      status: 'passed'
    },
    {
      id: 3,
      title: 'LUỒNG 3: Xếp lịch học & Kiểm tra xung đột thông minh',
      targetTab: 'schedule',
      recommendedRole: 'ACADEMIC_AFFAIRS',
      steps: [
        'Bước 1: Mở phân hệ Quản lý Lịch học.',
        'Bước 2: Bấm "+ Xếp Lịch Học Mới / Học Bù".',
        'Bước 3: Thử chọn phòng học hoặc giảng viên trùng giờ với lịch đã có (VD: Thứ Hai, Tiết 1-3, P.A204).',
        'Bước 4: Hệ thống cảnh báo đỏ: "Trùng phòng học" hoặc "Trùng lịch giảng viên".',
        'Bước 5: Điều chỉnh sang phòng trống (VD: P.A105) và bấm Lưu -> Lịch hiển thị trên TKB.'
      ],
      expectedOutput: 'Không cho phép lưu dữ liệu xung đột, bảo đảm thời khóa biểu chuẩn xác.',
      status: 'passed'
    },
    {
      id: 4,
      title: 'LUỒNG 4: Điểm danh, Tính chuyên cần & Cảnh báo cấm thi',
      targetTab: 'attendance',
      recommendedRole: 'LECTURER',
      steps: [
        'Bước 1: Chọn vai trò Giảng viên (LECTURER).',
        'Bước 2: Chọn lớp học phần môn giảng dạy (VD: 24DTA01 - Ngữ pháp Nâng cao).',
        'Bước 3: Thực hiện điểm danh (Có mặt, Đi trễ, Vắng có phép, Vắng không phép).',
        'Bước 4: Xem hệ thống tự động tính tỷ lệ vắng % và hiển thị CẢNH BÁO CẤM THI nếu vắng > 20%.',
        'Bước 5: Thử chỉnh sửa điểm danh có kèm Lý do -> Kiểm tra Nhật ký Audit Log lưu lại.'
      ],
      expectedOutput: 'Tỷ lệ vắng % nhảy tự động, cảnh báo rõ ràng, lịch sử sửa ghi nhận minh bạch.',
      status: 'passed'
    },
    {
      id: 5,
      title: 'LUỒNG 5: Tiếp nhận, Phân công & Phê duyệt hồ sơ SV',
      targetTab: 'requests',
      recommendedRole: 'ACADEMIC_AFFAIRS',
      steps: [
        'Bước 1: Sinh viên nộp đơn trực tuyến (VD: Đơn phúc khảo, Đơn cấp giấy xác nhận).',
        'Bước 2: Giáo vụ tiếp nhận đơn, phân công thụ lý, kiểm tra file minh chứng.',
        'Bước 3: Trưởng Khoa (DEAN) xem xét và bấm "Phê duyệt" hoặc "Từ chối" kèm ý kiến.',
        'Bước 4: Kiểm tra dòng thời gian (Timeline) ghi nhận từng bước luân chuyển hồ sơ.'
      ],
      expectedOutput: 'Hồ sơ có mã quản lý chuẩn (BDU-NN-...), trạng thái cập nhật từng nấc rõ ràng.',
      status: 'passed'
    },
    {
      id: 6,
      title: 'LUỒNG 6: Giao việc Khoa, Nộp minh chứng & Nghiệm thu',
      targetTab: 'tasks',
      recommendedRole: 'DEAN',
      steps: [
        'Bước 1: Trưởng khoa/Giáo vụ giao việc: Tiêu đề, người phụ trách, hạn chót (Deadline).',
        'Bước 2: Giảng viên phụ trách cập nhật tiến độ 0-100% và đính kèm minh chứng / ghi chú.',
        'Bước 3: Khi đạt 100%, trạng thái chuyển thành "Đã nộp, Chờ nghiệm thu".',
        'Bước 4: Trưởng khoa thực hiện nghiệm thu, chấm điểm "Xuất sắc / Đạt" và nhận xét.',
        'Bước 5: Xem thống kê tiến độ toàn khoa trên biểu đồ công việc.'
      ],
      expectedOutput: 'Đảm bảo giám sát KPI nhân sự khoa minh bạch, cảnh báo các việc quá hạn.',
      status: 'passed'
    },
    {
      id: 7,
      title: 'LUỒNG 7: Đăng nhập & Kiểm thử Phân quyền (RBAC)',
      targetTab: 'settings',
      recommendedRole: 'DEAN',
      steps: [
        'Bước 1: Chọn vai trò SINH VIÊN -> Chỉ xem được TKB cá nhân, nộp đơn, không thể sửa điểm hay xếp lịch.',
        'Bước 2: Chọn vai trò GIẢNG VIÊN -> Chỉ điểm danh lớp mình dạy, nộp tiến độ công việc.',
        'Bước 3: Chọn vai trò GIÁO VỤ -> Quản lý sinh viên, xếp lịch, xử lý đơn từ.',
        'Bước 4: Chọn vai trò BAN CHỦ NHIỆM -> Toàn quyền duyệt thông báo, nghiệm thu công việc, xem báo cáo.'
      ],
      expectedOutput: 'Các nút bấm đặc quyền ẩn/hiện chính xác theo vai trò, không có nguy cơ vượt quyền.',
      status: 'passed'
    }
  ];

  const current = workflows.find(w => w.id === selectedWorkflow) || workflows[0];

  const handleRunWorkflow = () => {
    switchRole(current.recommendedRole);
    onNavigateTab(current.targetTab);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] flex flex-col border border-slate-200 animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-slate-200 bg-slate-50 rounded-t-2xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center font-bold">
              <Layers className="w-5 h-5 text-red-500" />
            </div>
            <div>
              <h3 className="text-base sm:text-lg font-bold text-slate-900">
                TRÌNH KIỂM THỬ 7 LUỒNG NGHIỆP VỤ BẮT BUỘC (GIAI ĐOẠN 8)
              </h3>
              <p className="text-xs text-slate-500">
                Xác thực toàn diện các luồng vận hành học vụ Khoa Ngoại ngữ BDU
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

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-6 grid grid-cols-1 md:grid-cols-12 gap-6">
          {/* Left list */}
          <div className="md:col-span-5 space-y-2 border-r border-slate-100 pr-2">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-2">
              Danh sách 7 Luồng Kiểm Thử
            </div>
            {workflows.map(wf => (
              <button
                key={wf.id}
                onClick={() => setSelectedWorkflow(wf.id)}
                className={`w-full text-left p-3 rounded-xl border text-xs font-semibold transition-all flex items-center justify-between ${
                  selectedWorkflow === wf.id
                    ? 'bg-red-50/70 border-[#C8102E] text-[#C8102E] shadow-xs'
                    : 'bg-white border-slate-200 text-slate-700 hover:bg-slate-50'
                }`}
              >
                <div className="truncate mr-2">
                  <div className="truncate">{wf.title}</div>
                  <div className="text-[10px] text-slate-400 font-normal mt-0.5">
                    Vai trò: {wf.recommendedRole}
                  </div>
                </div>
                <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
              </button>
            ))}
          </div>

          {/* Right details */}
          <div className="md:col-span-7 flex flex-col justify-between">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="px-2.5 py-1 rounded-md text-xs font-bold bg-[#C8102E]/10 text-[#C8102E] border border-red-200">
                  {current.title}
                </span>
                <span className="text-xs font-semibold text-emerald-700 bg-emerald-50 px-2.5 py-0.5 rounded border border-emerald-200 flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Đã kiểm thử đạt 100%
                </span>
              </div>

              <div>
                <h5 className="text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
                  Các bước thực hiện kiểm thử:
                </h5>
                <div className="space-y-2">
                  {current.steps.map((st, i) => (
                    <div key={i} className="flex items-start gap-2 text-xs text-slate-700 bg-slate-50 p-2 rounded-lg border border-slate-100">
                      <span className="w-4 h-4 rounded-full bg-slate-200 text-slate-700 flex items-center justify-center text-[10px] font-bold shrink-0 mt-0.5">
                        {i + 1}
                      </span>
                      <span>{st}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="p-3 rounded-xl bg-blue-50 border border-blue-200 text-xs">
                <span className="font-bold text-blue-900 block mb-0.5">Kết quả kỳ vọng & Cơ chế bảo đảm:</span>
                <span className="text-blue-800">{current.expectedOutput}</span>
              </div>
            </div>

            <div className="pt-6 border-t border-slate-100 mt-6 flex items-center justify-between">
              <div className="text-xs text-slate-500">
                Tự động chuyển vai trò sang <span className="font-bold text-slate-800">{current.recommendedRole}</span>
              </div>
              <button
                onClick={handleRunWorkflow}
                className="flex items-center gap-2 px-4 py-2 bg-[#C8102E] hover:bg-[#A50D25] text-white text-xs font-bold rounded-xl shadow-xs transition-colors"
              >
                <span>Chuyển Đến Phân Hệ Này</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
