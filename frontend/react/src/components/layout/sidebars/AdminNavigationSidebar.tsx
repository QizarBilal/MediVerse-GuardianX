'use client';

import React from 'react';
import { useAuth } from '../../../contexts/AuthContext';

interface AdminNavigationSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const AdminNavigationSidebar: React.FC<AdminNavigationSidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const { user, logout } = useAuth();

  const navigationItems = [
    { id: 'dashboard', label: '📊 Dashboard Overview', icon: '📊' },
    { id: 'user-management', label: '👥 User Management', icon: '👥' },
    { id: 'system-logs', label: '📋 System Logs', icon: '📋' },
    { id: 'settings', label: '⚙️ Application Settings', icon: '⚙️' },
    { id: 'analytics', label: '📈 Analytics & Statistics', icon: '📈' },
  ];

  return (
    <div className={`bg-white dark:bg-slate-800 shadow-lg transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'} h-full`}>
      <div className="p-4">
        <div className="flex items-center space-x-2">
          <div className="text-2xl">🏥</div>
          {isOpen && (
            <div>
              <h1 className="text-lg font-bold text-gray-800 dark:text-white">MediVerse</h1>
              <p className="text-xs text-gray-500 dark:text-gray-400">Guardian X - Admin</p>
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
            <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
            <span className="text-xs text-green-600 dark:text-green-400">System Administrator</span>
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
            {isOpen && <span className="text-sm font-medium">{item.label}</span>}
          </button>
        ))}
      </nav>

      {/* System Status - Admin specific */}
      {isOpen && (
        <div className="px-4 py-2 border-t border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900/50">
          <div className="text-xs text-gray-500 dark:text-gray-400">
            <div className="flex justify-between">
              <span>Server Status:</span>
              <span className="text-green-600 dark:text-green-400">●Online</span>
            </div>
            <div className="flex justify-between mt-1">
              <span>Active Users:</span>
              <span className="text-blue-600 dark:text-blue-400">3</span>
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

export default AdminNavigationSidebar;
