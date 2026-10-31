/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  GraduationCap,
  BookOpen,
  Layers,
  Award,
  CheckCircle2,
  Building,
  Clock,
  Download
} from 'lucide-react';
import { BduAcademicService } from '../../services/storage';

export const TrainingManagementView: React.FC = () => {
  const [activeMajorTab, setActiveMajorTab] = useState<'NNA' | 'NNT' | 'NNH'>('NNA');

  const curriculumData = {
    NNA: {
      name: 'Ngành Ngôn ngữ Anh (Mã ngành: 7220201)',
      totalCredits: 135,
      duration: '3.5 - 4.0 năm (8 học kỳ)',
      degree: 'Cử nhân Ngôn ngữ Anh',
      blocks: [
        { name: 'Khối kiến thức Giáo dục đại cương', credits: 28, courses: ['Triết học Mác - Lênin', 'Kinh tế chính trị', 'Pháp luật đại cương', 'Tin học ứng dụng', 'Kỹ năng giao tiếp'] },
        { name: 'Khối kiến thức Cơ sở khối ngành & ngành', credits: 36, courses: ['Dẫn luận ngôn ngữ', 'Âm vị học tiếng Anh', 'Hình thái - Cú pháp', 'Ngữ nghĩa học', 'Văn hóa các nước nói tiếng Anh'] },
        { name: 'Khối kiến thức Thực hành tiếng nâng cao', credits: 42, courses: ['Nghe - Nói nâng cao 1 & 2', 'Đọc - Viết học thuật 1 & 2', 'Thuyết trình trước công chúng', 'Tiếng Anh thương mại'] },
        { name: 'Khối kiến thức Chuyên ngành Biên - Phiên dịch', credits: 21, courses: ['Lý thuyết dịch thuật', 'Biên dịch 1 & 2', 'Phiên dịch hội thảo', 'Dịch tài liệu kinh tế - pháp luật'] },
        { name: 'Khóa luận tốt nghiệp / Chuyên đề thay thế', credits: 8, courses: ['Thực tập thực tế doanh nghiệp', 'Khóa luận tốt nghiệp cử nhân'] }
      ]
    },
    NNT: {
      name: 'Ngành Ngôn ngữ Trung Quốc (Mã ngành: 7220204)',
      totalCredits: 135,
      duration: '3.5 - 4.0 năm (8 học kỳ)',
      degree: 'Cử nhân Ngôn ngữ Trung Quốc',
      blocks: [
        { name: 'Khối kiến thức Giáo dục đại cương', credits: 28, courses: ['Lý luận chính trị', 'Giáo dục thể chất', 'Kỹ năng số', 'Tư duy phản biện'] },
        { name: 'Khối kiến thức Cơ sở ngành Hán ngữ', credits: 38, courses: ['Ngữ pháp Hán ngữ hiện đại', 'Ngữ âm tiếng Hán', 'Chữ Hán và thư pháp', 'Đất nước học Trung Quốc'] },
        { name: 'Khối kiến thức Thực hành tiếng Trung chuẩn', credits: 40, courses: ['Khẩu ngữ sơ - trung cấp', 'Kỹ năng đọc báo chí', 'Thương mại Hán ngữ', 'Tiếng Trung văn phòng'] },
        { name: 'Khối kiến thức Biên phiên dịch Trung - Việt', credits: 21, courses: ['Lý thuyết dịch', 'Biên dịch kinh tế - tài chính', 'Phiên dịch tháp tùng', 'Hán ngữ du lịch'] },
        { name: 'Tốt nghiệp & Thực tập', credits: 8, courses: ['Thực tập chuyên ngành', 'Khóa luận tốt nghiệp'] }
      ]
    },
    NNH: {
      name: 'Ngành Ngôn ngữ Hàn Quốc (Mã ngành: 7220210)',
      totalCredits: 135,
      duration: '3.5 - 4.0 năm (8 học kỳ)',
      degree: 'Cử nhân Ngôn ngữ Hàn Quốc',
      blocks: [
        { name: 'Khối kiến thức Giáo dục đại cương', credits: 28, courses: ['Đại cương văn hóa Việt Nam', 'Pháp luật', 'Kỹ năng mềm', 'Tin học'] },
        { name: 'Khối kiến thức Cơ sở tiếng Hàn', credits: 36, courses: ['Ngữ pháp tiếng Hàn cơ bản', 'Ngữ âm học tiếng Hàn', 'Văn hóa & Xã hội Hàn Quốc'] },
        { name: 'Khối kiến thức Tiếng Hàn ứng dụng', credits: 42, courses: ['Tiếng Hàn thương mại', 'Kỹ năng giao tiếp doanh nghiệp Hàn', 'Luyện thi Topik 5-6'] },
        { name: 'Khối kiến thức Biên phiên dịch Hàn - Việt', credits: 21, courses: ['Dịch văn bản kinh doanh', 'Phiên dịch nối tiếp', 'Tiếng Hàn ngoại giao'] },
        { name: 'Thực tập tốt nghiệp', credits: 8, courses: ['Thực tập tại tập đoàn Hàn Quốc', 'Khóa luận cử nhân'] }
      ]
    }
  };

  const current = curriculumData[activeMajorTab];

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-white p-5 rounded-2xl border border-slate-200 shadow-xs">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-lg font-bold text-slate-900 tracking-tight">
              Quản Lý Khung Chương Trình Đào Tạo Đại Học
            </h2>
            <span className="px-2 py-0.5 text-xs font-bold bg-red-50 text-[#C8102E] border border-red-200 rounded-md">
              Chuẩn AUN-QA
            </span>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Cấu trúc chương trình đào tạo cử nhân ngoại ngữ, phân bổ tín chỉ và khối kiến thức học thuật
          </p>
        </div>

        <button
          onClick={() => {
            alert('Đang kết xuất sơ đồ khung chương trình đào tạo PDF chính thức...');
          }}
          className="flex items-center gap-1.5 px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 text-xs font-bold rounded-xl border border-slate-200 transition-colors"
        >
          <Download className="w-4 h-4" />
          <span>Tải Khung CTĐT</span>
        </button>
      </div>

      {/* Major selector tabs */}
      <div className="flex border-b border-slate-200 bg-white rounded-t-xl px-4 pt-3 gap-2">
        <button
          onClick={() => setActiveMajorTab('NNA')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${
            activeMajorTab === 'NNA'
              ? 'border-[#C8102E] text-[#C8102E]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Ngành Ngôn Ngữ Anh
        </button>
        <button
          onClick={() => setActiveMajorTab('NNT')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${
            activeMajorTab === 'NNT'
              ? 'border-[#C8102E] text-[#C8102E]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Ngành Ngôn Ngữ Trung Quốc
        </button>
        <button
          onClick={() => setActiveMajorTab('NNH')}
          className={`px-4 py-2 text-xs font-bold border-b-2 transition-all ${
            activeMajorTab === 'NNH'
              ? 'border-[#C8102E] text-[#C8102E]'
              : 'border-transparent text-slate-500 hover:text-slate-800'
          }`}
        >
          Ngành Ngôn Ngữ Hàn Quốc
        </button>
      </div>

      {/* Curriculum Summary Details */}
      <div className="bg-white p-6 rounded-b-xl border border-t-0 border-slate-200 shadow-xs space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-50 border border-slate-200">
          <div>
            <h3 className="text-base font-extrabold text-slate-900">{current.name}</h3>
            <p className="text-xs text-slate-500 mt-0.5">Văn bằng: {current.degree} | Thời gian: {current.duration}</p>
          </div>
          <div className="text-left sm:text-right">
            <span className="text-xs text-slate-500 block">Tổng số tín chỉ tích lũy:</span>
            <span className="text-xl font-extrabold text-[#C8102E] font-mono">{current.totalCredits} tín chỉ</span>
          </div>
        </div>

        {/* Knowledge Blocks */}
        <div className="space-y-4">
          <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
            Phân Bổ Các Khối Kiến Thức Trong Chương Trình
          </h4>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {current.blocks.map((block, idx) => (
              <div key={idx} className="p-4 rounded-xl border border-slate-200 bg-white hover:border-slate-300 transition-colors">
                <div className="flex items-center justify-between mb-2">
                  <h5 className="font-bold text-xs text-slate-900">{block.name}</h5>
                  <span className="px-2 py-0.5 rounded text-[11px] font-bold bg-red-50 text-[#C8102E] border border-red-200">
                    {block.credits} tín chỉ
                  </span>
                </div>
                <div className="flex flex-wrap gap-1.5 mt-2">
                  {block.courses.map((course, cIdx) => (
                    <span key={cIdx} className="px-2 py-1 rounded bg-slate-50 text-[11px] text-slate-700 border border-slate-100 font-medium">
                      {course}
                    </span>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
