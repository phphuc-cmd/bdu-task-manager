/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { AuthProvider } from './context/AuthContext';
import { Navbar } from './components/layout/Navbar';
import { Sidebar } from './components/layout/Sidebar';
import { ToastContainer, ToastMessage } from './components/common/NotificationToast';
import { AuditReportModal } from './components/audit/AuditReportModal';
import { WorkflowTesterModal } from './components/audit/WorkflowTesterModal';
import { UserManualModal } from './components/manual/UserManualModal';

// 12 Modules
import { DashboardView } from './components/modules/DashboardView';
import { StudentManagementView } from './components/modules/StudentManagementView';
import { TrainingManagementView } from './components/modules/TrainingManagementView';
import { ScheduleManagementView } from './components/modules/ScheduleManagementView';
import { ExamManagementView } from './components/modules/ExamManagementView';
import { AttendanceManagementView } from './components/modules/AttendanceManagementView';
import { AnnouncementManagementView } from './components/modules/AnnouncementManagementView';
import { StudentRequestManagementView } from './components/modules/StudentRequestManagementView';
import { TaskManagementView } from './components/modules/TaskManagementView';
import { ReportsView } from './components/modules/ReportsView';
import { StaffManagementView } from './components/modules/StaffManagementView';
import { SettingsView } from './components/modules/SettingsView';

export function MainLayout() {
  const [currentTab, setCurrentTab] = useState<string>('dashboard');
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState<boolean>(false);
  const [isAuditReportOpen, setIsAuditReportOpen] = useState<boolean>(false);
  const [isWorkflowTesterOpen, setIsWorkflowTesterOpen] = useState<boolean>(false);
  const [isUserManualOpen, setIsUserManualOpen] = useState<boolean>(false);
  const [toasts, setToasts] = useState<ToastMessage[]>([]);

  const addToast = (type: ToastMessage['type'], title: string, message: string) => {
    const id = `toast-${Date.now()}-${Math.random()}`;
    setToasts(prev => [...prev, { id, type, title, message }]);
    setTimeout(() => {
      setToasts(prev => prev.filter(t => t.id !== id));
    }, 4000);
  };

  const handleDismissToast = (id: string) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  };

  const renderModule = () => {
    switch (currentTab) {
      case 'dashboard':
        return <DashboardView onNavigateTab={setCurrentTab} />;
      case 'students':
        return <StudentManagementView />;
      case 'training':
        return <TrainingManagementView />;
      case 'schedule':
        return <ScheduleManagementView />;
      case 'exams':
        return <ExamManagementView />;
      case 'attendance':
        return <AttendanceManagementView />;
      case 'announcements':
        return <AnnouncementManagementView />;
      case 'requests':
        return <StudentRequestManagementView />;
      case 'tasks':
        return <TaskManagementView />;
      case 'reports':
        return <ReportsView />;
      case 'staff':
        return <StaffManagementView />;
      case 'settings':
        return <SettingsView />;
      default:
        return <DashboardView onNavigateTab={setCurrentTab} />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Navbar */}
      <Navbar
        onToggleMobileMenu={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        onOpenAuditReport={() => setIsAuditReportOpen(true)}
        onOpenWorkflowTester={() => setIsWorkflowTesterOpen(true)}
        onOpenUserManual={() => setIsUserManualOpen(true)}
        onSelectTab={setCurrentTab}
      />

      <div className="flex-1 flex max-w-[1600px] w-full mx-auto">
        {/* Left Navigation Sidebar */}
        <Sidebar
          currentTab={currentTab}
          onSelectTab={setCurrentTab}
          isMobileOpen={isMobileMenuOpen}
          onCloseMobile={() => setIsMobileMenuOpen(false)}
        />

        {/* Main Content Area */}
        <main className="flex-1 min-w-0 p-4 sm:p-6 lg:p-8 overflow-y-auto">
          {renderModule()}
        </main>
      </div>

      {/* User Manual Modal (Cẩm Nang Giáo Vụ) */}
      <UserManualModal
        isOpen={isUserManualOpen}
        onClose={() => setIsUserManualOpen(false)}
        onNavigateTab={setCurrentTab}
      />

      {/* Audit Report Modal (Section X) */}
      <AuditReportModal
        isOpen={isAuditReportOpen}
        onClose={() => setIsAuditReportOpen(false)}
      />

      {/* Workflow Tester Modal (7 Luồng) */}
      <WorkflowTesterModal
        isOpen={isWorkflowTesterOpen}
        onClose={() => setIsWorkflowTesterOpen(false)}
        onNavigateTab={setCurrentTab}
      />

      {/* Real-time Toasts */}
      <ToastContainer toasts={toasts} onDismiss={handleDismissToast} />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <MainLayout />
    </AuthProvider>
  );
}
