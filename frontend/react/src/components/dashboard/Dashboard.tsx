'use client';

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import Sidebar from '../layout/Sidebar';
import Header from '../layout/Header';
import AdminDashboardView from './AdminDashboardView';
import DoctorDashboardView from './DoctorDashboardView';
import NurseDashboardView from './NurseDashboardView';
import LoadingSpinner from '../ui/LoadingSpinner';

const Dashboard: React.FC = () => {
  const { user, isAuthenticated } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  const renderContent = () => {
    if (!user) {
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
      case 'admin':
        return <AdminDashboardView activeTab={activeTab} setActiveTab={setActiveTab} />;
      case 'doctor':
        return <DoctorDashboardView activeTab={activeTab} setActiveTab={setActiveTab} />;
      case 'nurse':
        return <NurseDashboardView activeTab={activeTab} setActiveTab={setActiveTab} />;
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

  if (!isAuthenticated || !user) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <LoadingSpinner size="lg" />
          <p className="mt-4 text-gray-600 dark:text-gray-300">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-slate-900">
      {/* Sidebar */}
      <Sidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab}
        isOpen={sidebarOpen}
        setIsOpen={setSidebarOpen}
      />

      {/* Main Content */}
      <div className="flex-1 flex flex-col overflow-hidden">
        {/* Header */}
        <Header 
          sidebarOpen={sidebarOpen}
          setSidebarOpen={setSidebarOpen}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        
        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-slate-900">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
