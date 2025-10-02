'use client';

import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';

interface DoctorNavigationSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const DoctorNavigationSidebar: React.FC<DoctorNavigationSidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();

  const navigationItems = [
    { id: 'dashboard', label: '📊 Dashboard Overview', icon: '📊' },
    { id: 'upload-prescription', label: '📝 Upload Prescription', icon: '📝' },
    { id: 'ai-validation', label: '🤖 AI Validation Reports', icon: '🤖' },
    { id: 'prescription-history', label: '📋 Reviewed Prescriptions', icon: '📋' },
    { id: 'notifications', label: '🔔 Notifications', icon: '🔔' },
  ];

  const notificationCount = 5;

  return (
    <div className={`bg-white dark:bg-slate-800 shadow-lg transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'} h-full`}>
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <div className="text-2xl">🏥</div>
          {isOpen && (
            <div>
              <h1 className="text-lg font-bold text-gray-800 dark:text-white">MediVerse</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Guardian X - Doctor</p>
            </div>
          )}
        </div>
      </div>

      {/* User Info */}
      {isOpen && user && (
        <div className="px-4 py-2 border-b border-gray-200 dark:border-gray-700">
          <p className="text-sm font-medium text-gray-800 dark:text-white">{user.firstName} {user.lastName}</p>
          <p className="text-xs text-gray-500 dark:text-gray-400">{user.role} - {user.department}</p>
          <div className="flex items-center mt-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
            <span className="text-xs text-blue-600 dark:text-blue-400">Medical Professional</span>
          </div>
        </div>
      )}

      {/* Navigation */}
      <nav className="mt-4 flex-1">
        {navigationItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`w-full text-left px-4 py-3 flex items-center space-x-3 hover:bg-blue-50 dark:hover:bg-gray-700 transition-colors ${
              activeTab === item.id 
                ? 'bg-blue-100 dark:bg-blue-900/50 border-r-2 border-blue-500 text-blue-700 dark:text-blue-300' 
                : 'text-gray-700 dark:text-gray-300'
            }`}
          >
            <span className="text-xl">{item.icon}</span>
            {isOpen && (
              <div className="flex items-center justify-between w-full">
                <span className="text-sm font-medium">{item.label}</span>
                {item.id === 'notifications' && notificationCount > 0 && (
                  <span className="bg-red-500 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                    {notificationCount}
                  </span>
                )}
              </div>
            )}
          </button>
        ))}
      </nav>

      {/* Quick Stats - Doctor specific */}
      {isOpen && (
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-slate-700">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <div className="flex justify-between">
              <span>Today's Uploads:</span>
              <span className="text-blue-600 dark:text-blue-400">7</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Pending Review:</span>
              <span className="text-orange-600 dark:text-orange-400">3</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>AI Confidence:</span>
              <span className="text-green-600 dark:text-green-400">94%</span>
            </div>
          </div>
        </div>
      )}

      {/* Logout */}
      <div className="p-4 border-t border-gray-200 dark:border-gray-700">
        <button
          onClick={logout}
          className="w-full flex items-center space-x-3 px-4 py-2 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-md transition-colors"
        >
          <span className="text-xl">🚪</span>
          {isOpen && <span className="text-sm font-medium">Logout</span>}
        </button>
      </div>
    </div>
  );
};

export default DoctorNavigationSidebar;
