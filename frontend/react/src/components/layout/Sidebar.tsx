'use client';

import React from 'react';
import { useAuth } from '../../contexts/AuthContext';
import AdminNavigationSidebar from './sidebars/AdminNavigationSidebar';
import DoctorNavigationSidebar from './sidebars/DoctorNavigationSidebar';
import NurseNavigationSidebar from './sidebars/NurseNavigationSidebar';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}

const Sidebar: React.FC<SidebarProps> = ({ activeTab, setActiveTab, isOpen, setIsOpen }) => {
  const { user } = useAuth();

  if (!user) {
    return (
      <div className={`bg-white dark:bg-slate-800 shadow-lg transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'} h-full`}>
        <div className="p-4">
          <div className="flex items-center space-x-2">
            <div className="text-2xl">🏥</div>
            {isOpen && (
              <div>
                <h1 className="text-lg font-bold text-gray-800 dark:text-white">MediVerse</h1>
                <p className="text-xs text-gray-500 dark:text-gray-400">Guardian X</p>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  switch (user.role) {
    case 'admin':
      return <AdminNavigationSidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isOpen} setIsOpen={setIsOpen} />;
    case 'doctor':
      return <DoctorNavigationSidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isOpen} setIsOpen={setIsOpen} />;
    case 'nurse':
      return <NurseNavigationSidebar activeTab={activeTab} setActiveTab={setActiveTab} isOpen={isOpen} setIsOpen={setIsOpen} />;
    default:
      return (
        <div className={`bg-white dark:bg-slate-800 shadow-lg transition-all duration-300 ${isOpen ? 'w-64' : 'w-16'} h-full`}>
          <div className="p-4">
            <div className="text-center text-gray-600 dark:text-gray-300">
              Unknown user role: {user.role}
            </div>
          </div>
        </div>
      );
  }
};

export default Sidebar;
