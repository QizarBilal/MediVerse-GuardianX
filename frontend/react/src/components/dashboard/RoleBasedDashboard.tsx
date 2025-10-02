'use client';

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import EnhancedNurseDashboard from './EnhancedNurseDashboard';
import EnhancedDoctorDashboard from './EnhancedDoctorDashboard';
import EnhancedAdminDashboard from './EnhancedAdminDashboard';
import LoadingSpinner from '../ui/LoadingSpinner';

interface RoleBasedDashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const RoleBasedDashboard: React.FC<RoleBasedDashboardProps> = ({ activeTab, setActiveTab }) => {
  const { user, isAuthenticated } = useAuth();

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  switch (user.role) {
    case 'nurse':
      return <EnhancedNurseDashboard activeTab={activeTab} setActiveTab={setActiveTab} />;
    case 'doctor':
      return <EnhancedDoctorDashboard activeTab={activeTab} setActiveTab={setActiveTab} />;
    case 'admin':
      return <EnhancedAdminDashboard activeTab={activeTab} setActiveTab={setActiveTab} />;
    default:
      return (
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <p className="text-gray-600 dark:text-gray-300">
              Unknown user role: {user.role}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-2">
              Please contact your administrator for assistance.
            </p>
          </div>
        </div>
      );
  }
};

export default RoleBasedDashboard;
