/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import { UserProfile, UserRole } from '../types';
import { DEMO_USERS } from '../services/mockData';

interface AuthContextType {
  currentUser: UserProfile;
  activeRole: UserRole;
  switchRole: (role: UserRole) => void;
  // Role permission helpers
  canManageStudents: boolean;
  canManageSchedule: boolean;
  canTakeAttendance: boolean;
  canApproveRequests: boolean;
  canCreateAnnouncement: boolean;
  canApproveAnnouncement: boolean;
  canAssignTasks: boolean;
  canAcceptTasks: boolean;
  canViewReports: boolean;
  canExportData: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_STORAGE_KEY = 'bdu_active_user_role_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [activeRole, setActiveRole] = useState<UserRole>(() => {
    const saved = localStorage.getItem(AUTH_STORAGE_KEY) as UserRole;
    return saved && DEMO_USERS[saved] ? saved : 'ACADEMIC_AFFAIRS';
  });

  const currentUser = DEMO_USERS[activeRole] || DEMO_USERS.ACADEMIC_AFFAIRS;

  const switchRole = (newRole: UserRole) => {
    setActiveRole(newRole);
    localStorage.setItem(AUTH_STORAGE_KEY, newRole);
  };

  // Permission rules based on University Governance structure
  const canManageStudents = activeRole === 'DEAN' || activeRole === 'ACADEMIC_AFFAIRS';
  const canManageSchedule = activeRole === 'DEAN' || activeRole === 'ACADEMIC_AFFAIRS';
  const canTakeAttendance = activeRole === 'DEAN' || activeRole === 'ACADEMIC_AFFAIRS' || activeRole === 'LECTURER';
  const canApproveRequests = activeRole === 'DEAN' || activeRole === 'ACADEMIC_AFFAIRS';
  const canCreateAnnouncement = activeRole === 'DEAN' || activeRole === 'ACADEMIC_AFFAIRS' || activeRole === 'LECTURER';
  const canApproveAnnouncement = activeRole === 'DEAN'; // Only Dean can officially approve & publish
  const canAssignTasks = activeRole === 'DEAN' || activeRole === 'ACADEMIC_AFFAIRS';
  const canAcceptTasks = activeRole === 'DEAN';
  const canViewReports = activeRole === 'DEAN' || activeRole === 'ACADEMIC_AFFAIRS';
  const canExportData = activeRole === 'DEAN' || activeRole === 'ACADEMIC_AFFAIRS';

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        activeRole,
        switchRole,
        canManageStudents,
        canManageSchedule,
        canTakeAttendance,
        canApproveRequests,
        canCreateAnnouncement,
        canApproveAnnouncement,
        canAssignTasks,
        canAcceptTasks,
        canViewReports,
        canExportData
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
