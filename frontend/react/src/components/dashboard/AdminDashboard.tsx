'use client';

import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ENHANCED_USERS, 
  ENHANCED_LOGS, 
  ENHANCED_ANALYTICS, 
  ENHANCED_PRESCRIPTIONS,
  type UserProfile,
  type SystemLog as EnhancedSystemLog,
  type AnalyticsData
} from '../../data/enhancedSampleData';
import {
  UserGroupIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  CogIcon,
  ServerIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  EyeIcon,
  PencilIcon,
  TrashIcon,
  PlusIcon,
  DocumentTextIcon,
  ArrowTrendingUpIcon,
  XMarkIcon,
  XCircleIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
} from '@heroicons/react/24/outline';
import { StarIcon } from '@heroicons/react/24/solid';
import LoadingSpinner from '../ui/LoadingSpinner';

interface SystemMetrics {
  totalUsers: number;
  activeUsers: number;
  totalPrescriptions: number;
  systemUptime: string;
  storageUsed: number;
  securityAlerts: number;
  fraudDetected: number;
  averageProcessingTime: number;
}

interface SystemAlert {
  id: string;
  type: 'security' | 'system' | 'compliance' | 'performance';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  timestamp: Date;
  resolved: boolean;
}

interface ApplicationSettings {
  rxNavEnabled: boolean;
  autoBackup: boolean;
  maintenanceMode: boolean;
  aiValidationThreshold: number;
  sessionTimeout: number;
  enableNotifications: boolean;
  enableAIValidation: boolean;
  maxDailyPrescriptions: number;
  retentionPeriod: number;
}

const AdminDashboard = () => {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [searchTerm, setSearchTerm] = useState('');
  const [filterRole, setFilterRole] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 10;

  const [metrics, setMetrics] = useState<SystemMetrics>({
    totalUsers: ENHANCED_USERS.length,
    activeUsers: ENHANCED_USERS.filter(u => u.isActive).length,
    totalPrescriptions: ENHANCED_PRESCRIPTIONS.length,
    systemUptime: '99.97%',
    storageUsed: 67.3,
    securityAlerts: 3,
    fraudDetected: ENHANCED_ANALYTICS.prescriptionStats.fraudDetected,
    averageProcessingTime: ENHANCED_ANALYTICS.prescriptionStats.averageProcessingTime,
  });

  const [users, setUsers] = useState<UserProfile[]>(ENHANCED_USERS);
  const [systemLogs, setSystemLogs] = useState<EnhancedSystemLog[]>(ENHANCED_LOGS);
  const [analytics, setAnalytics] = useState<AnalyticsData>(ENHANCED_ANALYTICS);

  const [alerts, setAlerts] = useState<SystemAlert[]>([
    {
      id: 'ALERT-001',
      type: 'security',
      message: 'Multiple failed login attempts detected from IP 192.168.1.100',
      severity: 'high',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
      resolved: false
    },
    {
      id: 'ALERT-002',
      type: 'system',
      message: 'Database backup completed successfully',
      severity: 'low',
      timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
      resolved: true
    },
    {
      id: 'ALERT-003',
      type: 'performance',
      message: 'API response time above threshold (>2s) for prescription validation',
      severity: 'medium',
      timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
      resolved: false
    },
    {
      id: 'ALERT-004',
      type: 'compliance',
      message: 'Weekly compliance report generated',
      severity: 'low',
      timestamp: new Date(Date.now() - 12 * 60 * 60 * 1000),
      resolved: true
    }
  ]);

  const [settings, setSettings] = useState<ApplicationSettings>({
    rxNavEnabled: true,
    autoBackup: true,
    maintenanceMode: false,
    aiValidationThreshold: 85,
    sessionTimeout: 30,
    enableNotifications: true
  });
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState<UserManagement | null>(null);
  const [showAddUser, setShowAddUser] = useState(false);
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'logs' | 'settings' | 'analytics' | 'security'>('overview');

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      
      await new Promise(resolve => setTimeout(resolve, 1200));
      
      const samplePatients = generatePatients(50);
      const samplePrescriptions = generatePrescriptions(samplePatients, 200);
      
      const systemMetrics: SystemMetrics = {
        totalUsers: 45,
        activeUsers: 38,
        totalPrescriptions: samplePrescriptions.length,
        systemUptime: '99.9%',
        storageUsed: 67,
        securityAlerts: 3,
      };

      const userManagement: UserManagement[] = [
        ...SAMPLE_USERS.map(user => ({
          id: user.id,
          name: `${user.firstName} ${user.lastName}`,
          email: user.email,
          role: user.role,
          department: user.department,
          lastLogin: new Date(user.lastLogin),
          isActive: user.isActive,
        })),
        ...Array.from({ length: 15 }, (_, i) => ({
          id: `user-${i + 4}`,
          name: `User ${i + 4}`,
          email: `user${i + 4}@mediverse.com`,
          role: ['doctor', 'nurse', 'admin'][Math.floor(Math.random() * 3)],
          department: ['Cardiology', 'Emergency', 'Pediatrics', 'Surgery'][Math.floor(Math.random() * 4)],
          lastLogin: new Date(Date.now() - Math.random() * 7 * 24 * 60 * 60 * 1000),
          isActive: Math.random() > 0.2,
        }))
      ];

      const systemAlerts: SystemAlert[] = [
        {
          id: 'alert-1',
          type: 'security',
          message: 'Unusual login activity detected from IP 192.168.1.100',
          severity: 'high',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          resolved: false,
        },
        {
          id: 'alert-2',
          type: 'system',
          message: 'Database backup completed successfully',
          severity: 'low',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          resolved: true,
        },
        {
          id: 'alert-3',
          type: 'compliance',
          message: 'HIPAA compliance audit scheduled for next week',
          severity: 'medium',
          timestamp: new Date(Date.now() - 6 * 60 * 60 * 1000),
          resolved: false,
        },
        {
          id: 'alert-4',
          type: 'performance',
          message: 'Server response time increased by 15%',
          severity: 'medium',
          timestamp: new Date(Date.now() - 8 * 60 * 60 * 1000),
          resolved: false,
        },
      ];

      const systemLogs: SystemLog[] = [
        {
          id: 'log-1',
          action: 'User login',
          user: 'Dr. Sarah Johnson',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          details: 'Successful login from IP 192.168.1.45',
          category: 'security',
          level: 'info'
        },
        {
          id: 'log-2',
          action: 'Prescription approved',
          user: 'Dr. Michael Chen',
          timestamp: new Date(Date.now() - 45 * 60 * 1000),
          details: 'Approved prescription RX-001234 for patient John Doe',
          category: 'prescription',
          level: 'info'
        },
        {
          id: 'log-3',
          action: 'User account created',
          user: 'Admin User',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          details: 'Created new nurse account for Jane Smith',
          category: 'user_management',
          level: 'info'
        },
        {
          id: 'log-4',
          action: 'System backup',
          user: 'System',
          timestamp: new Date(Date.now() - 3 * 60 * 60 * 1000),
          details: 'Automated daily backup completed successfully',
          category: 'system',
          level: 'info'
        },
        {
          id: 'log-5',
          action: 'Prescription rejected',
          user: 'Dr. Emily Brown',
          timestamp: new Date(Date.now() - 4 * 60 * 60 * 1000),
          details: 'Rejected prescription RX-001230 due to dosage concerns',
          category: 'prescription',
          level: 'warning'
        }
      ];

      const verificationActivities: VerificationActivity[] = [
        {
          id: 'verify-1',
          prescriptionId: 'RX-001234',
          patientName: 'John Doe',
          action: 'approved',
          performedBy: 'Dr. Michael Chen',
          timestamp: new Date(Date.now() - 15 * 60 * 1000),
          confidence: 94.5
        },
        {
          id: 'verify-2',
          prescriptionId: 'RX-001235',
          patientName: 'Jane Smith',
          action: 'validated',
          performedBy: 'AI System',
          timestamp: new Date(Date.now() - 30 * 60 * 1000),
          confidence: 89.2
        },
        {
          id: 'verify-3',
          prescriptionId: 'RX-001236',
          patientName: 'Bob Johnson',
          action: 'uploaded',
          performedBy: 'Nurse Wilson',
          timestamp: new Date(Date.now() - 45 * 60 * 1000)
        },
        {
          id: 'verify-4',
          prescriptionId: 'RX-001237',
          patientName: 'Alice Brown',
          action: 'rejected',
          performedBy: 'Dr. Emily Brown',
          timestamp: new Date(Date.now() - 1 * 60 * 60 * 1000),
          confidence: 76.8
        },
        {
          id: 'verify-5',
          prescriptionId: 'RX-001238',
          patientName: 'David Wilson',
          action: 'approved',
          performedBy: 'Dr. Sarah Johnson',
          timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000),
          confidence: 92.1
        }
      ];

      setMetrics(systemMetrics);
      setUsers(userManagement);
      setAlerts(systemAlerts);
      setSystemLogs(systemLogs);
      setVerificationActivities(verificationActivities);
      setLoading(false);
    };

    loadData();
  }, []);

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical':
        return 'text-red-700 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      case 'high':
        return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30';
      case 'medium':
        return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30';
      default:
        return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'security':
        return <ShieldCheckIcon className="h-4 w-4" />;
      case 'system':
        return <ServerIcon className="h-4 w-4" />;
      case 'compliance':
        return <DocumentTextIcon className="h-4 w-4" />;
      case 'performance':
        return <ArrowTrendingUpIcon className="h-4 w-4" />;
      default:
        return <ExclamationTriangleIcon className="h-4 w-4" />;
    }
  };

  const toggleUserStatus = (userId: string) => {
    setUsers(prev => prev.map(user => 
      user.id === userId ? { ...user, isActive: !user.isActive } : user
    ));
  };

  const deleteUser = (userId: string) => {
    setUsers(prev => prev.filter(user => user.id !== userId));
  };

  const addUser = (userData: { name: string; email: string; role: string; department: string }) => {
    const newUser: UserManagement = {
      id: `user-${Date.now()}`,
      name: userData.name,
      email: userData.email,
      role: userData.role,
      department: userData.department,
      lastLogin: new Date(),
      isActive: true
    };
    setUsers(prev => [newUser, ...prev]);
    setShowAddUser(false);
  };

  const updateSettings = (newSettings: Partial<ApplicationSettings>) => {
    setSettings(prev => ({ ...prev, ...newSettings }));
  };

  const resolveAlert = (alertId: string) => {
    setAlerts(prev => prev.map(alert => 
      alert.id === alertId ? { ...alert, resolved: true } : alert
    ));
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
          System Administration
        </h1>
        <p className="text-gray-600 dark:text-gray-300 mt-1">
          Admin Dashboard - {new Date().toLocaleDateString('en-US', { 
            weekday: 'long', 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
          })} • Welcome, {user?.firstName}!
        </p>
      </div>

      {/* System Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-6">
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <UserGroupIcon className="h-8 w-8 text-medical-600" />
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Users</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <CheckCircleIcon className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Active Users</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.activeUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <DocumentTextIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Prescriptions</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.totalPrescriptions}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <ServerIcon className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Uptime</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.systemUptime}</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <ChartBarIcon className="h-8 w-8 text-orange-600" />
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Storage</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.storageUsed}%</p>
            </div>
          </div>
        </div>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm p-6">
          <div className="flex items-center">
            <ExclamationTriangleIcon className="h-8 w-8 text-red-600" />
            <div className="ml-4">
              <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Alerts</h3>
              <p className="text-2xl font-bold text-gray-900 dark:text-white">{metrics.securityAlerts}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm">
        <div className="border-b border-gray-200 dark:border-gray-700">
          <nav className="flex space-x-8 px-6" aria-label="Tabs">
            {[
              { id: 'overview', name: 'System Overview', icon: StarIcon },
              { id: 'users', name: 'User Management', icon: UserGroupIcon },
              { id: 'logs', name: 'System Logs', icon: DocumentTextIcon },
              { id: 'settings', name: 'System Settings', icon: CogIcon },
              { id: 'analytics', name: 'Analytics', icon: ChartBarIcon },
            ].map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`py-4 px-1 border-b-2 font-medium text-sm flex items-center space-x-2 ${
                  activeTab === tab.id
                    ? 'border-medical-500 text-medical-600 dark:text-medical-400'
                    : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300 dark:text-gray-400 dark:hover:text-gray-300'
                }`}
              >
                <tab.icon className="h-5 w-5" />
                <span>{tab.name}</span>
              </button>
            ))}
          </nav>
        </div>

        <div className="p-6">
          {/* Overview Tab */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Recent System Alerts */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Recent System Alerts</h3>
                <div className="space-y-3">
                  {alerts.slice(0, 5).map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-4 rounded-lg border ${
                        alert.resolved
                          ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                          : `border-gray-200 dark:border-gray-700 ${
                              alert.severity === 'high' || alert.severity === 'critical'
                                ? 'bg-red-50 dark:bg-red-900/20'
                                : 'bg-white dark:bg-gray-800'
                            }`
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center space-x-2">
                          {getTypeIcon(alert.type)}
                          <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                            {alert.type}
                          </span>
                        </div>
                        <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(alert.severity)}`}>
                          {alert.severity}
                        </span>
                      </div>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{alert.message}</p>
                      
                      <div className="flex items-center justify-between">
                        <span className="text-xs text-gray-500 dark:text-gray-400">
                          {alert.timestamp.toLocaleString()}
                        </span>
                        {!alert.resolved && (
                          <button
                            onClick={() => resolveAlert(alert.id)}
                            className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                          >
                            Resolve
                          </button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* System Performance */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">System Performance</h3>
                <div className="space-y-4">
                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Server Health</span>
                      <span className="text-sm text-green-600 dark:text-green-400">Excellent</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '95%' }}></div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Storage Usage</span>
                      <span className="text-sm text-yellow-600 dark:text-yellow-400">{metrics.storageUsed}%</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div className="bg-yellow-600 h-2 rounded-full" style={{ width: `${metrics.storageUsed}%` }}></div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Database Performance</span>
                      <span className="text-sm text-green-600 dark:text-green-400">Optimal</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '88%' }}></div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium text-gray-900 dark:text-white">Network Latency</span>
                      <span className="text-sm text-green-600 dark:text-green-400">12ms</span>
                    </div>
                    <div className="w-full bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                      <div className="bg-green-600 h-2 rounded-full" style={{ width: '92%' }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Users Tab */}
          {activeTab === 'users' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">User Management</h3>
                <button 
                  onClick={() => setShowAddUser(true)}
                  className="btn-medical flex items-center space-x-2"
                >
                  <PlusIcon className="h-4 w-4" />
                  <span>Add User</span>
                </button>
              </div>
              
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                  <thead className="bg-gray-50 dark:bg-gray-700">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        User
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Role
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Department
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Last Login
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                    {users.slice(0, 10).map((user) => (
                      <tr key={user.id}>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-gray-900 dark:text-white">{user.name}</div>
                            <div className="text-sm text-gray-500 dark:text-gray-400">{user.email}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className="px-2 py-1 text-xs rounded-full bg-medical-100 dark:bg-medical-900/30 text-medical-800 dark:text-medical-300 capitalize">
                            {user.role}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-white">
                          {user.department}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                          {user.lastLogin.toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-2 py-1 text-xs rounded-full ${
                            user.isActive
                              ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                              : 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300'
                          }`}>
                            {user.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex space-x-2">
                            <button 
                              onClick={() => {
                                setSelectedUser(user);
                              }}
                              className="text-medical-600 dark:text-medical-400 hover:text-medical-900 dark:hover:text-medical-300"
                            >
                              <EyeIcon className="h-4 w-4" />
                            </button>
                            <button 
                              onClick={() => {
                                setSelectedUser(user);
                                setShowAddUser(true);
                              }}
                              className="text-blue-600 dark:text-blue-400 hover:text-blue-900 dark:hover:text-blue-300"
                            >
                              <PencilIcon className="h-4 w-4" />
                            </button>
                            <button
                              onClick={() => toggleUserStatus(user.id)}
                              className={`${
                                user.isActive
                                  ? 'text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300'
                                  : 'text-green-600 dark:text-green-400 hover:text-green-900 dark:hover:text-green-300'
                              }`}
                            >
                              {user.isActive ? <TrashIcon className="h-4 w-4" /> : <CheckCircleIcon className="h-4 w-4" />}
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Security Tab */}
          {activeTab === 'security' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Security & Compliance</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Security Alerts */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Security Alerts</h4>
                  <div className="space-y-3">
                    {alerts
                      .filter(alert => alert.type === 'security' || alert.type === 'compliance')
                      .map((alert) => (
                        <div
                          key={alert.id}
                          className={`p-4 rounded-lg border ${
                            alert.resolved
                              ? 'bg-green-50 dark:bg-green-900/20 border-green-200 dark:border-green-800'
                              : alert.severity === 'high' || alert.severity === 'critical'
                              ? 'bg-red-50 dark:bg-red-900/20 border-red-200 dark:border-red-800'
                              : 'bg-yellow-50 dark:bg-yellow-900/20 border-yellow-200 dark:border-yellow-800'
                          }`}
                        >
                          <div className="flex items-center justify-between mb-2">
                            <div className="flex items-center space-x-2">
                              {getTypeIcon(alert.type)}
                              <span className="text-sm font-medium text-gray-900 dark:text-white capitalize">
                                {alert.type}
                              </span>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${getSeverityColor(alert.severity)}`}>
                              {alert.severity}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-600 dark:text-gray-300 mb-2">{alert.message}</p>
                          
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              {alert.timestamp.toLocaleString()}
                            </span>
                            {!alert.resolved && (
                              <button
                                onClick={() => resolveAlert(alert.id)}
                                className="px-3 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700 transition-colors"
                              >
                                Resolve
                              </button>
                            )}
                          </div>
                        </div>
                      ))}
                  </div>
                </div>

                {/* Compliance Status */}
                <div>
                  <h4 className="text-md font-medium text-gray-900 dark:text-white mb-4">Compliance Status</h4>
                  <div className="space-y-4">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">HIPAA Compliance</span>
                        <span className="text-sm text-green-600 dark:text-green-400">✓ Compliant</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Last audit: 2 weeks ago • Next audit: 6 months
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Data Encryption</span>
                        <span className="text-sm text-green-600 dark:text-green-400">✓ AES-256</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        All data encrypted at rest and in transit
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Access Logs</span>
                        <span className="text-sm text-green-600 dark:text-green-400">✓ Active</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        All user actions logged and monitored
                      </div>
                    </div>

                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">Backup Status</span>
                        <span className="text-sm text-green-600 dark:text-green-400">✓ Daily</span>
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Last backup: 2 hours ago • Next: In 22 hours
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Analytics Tab */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">System Analytics</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* User Activity */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">User Activity (Last 7 Days)</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Total Logins</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">342</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Active Sessions</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">28</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Failed Logins</span>
                      <span className="text-sm font-medium text-red-600 dark:text-red-400">5</span>
                    </div>
                  </div>
                </div>

                {/* System Performance */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Performance Metrics</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Avg Response Time</span>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">145ms</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Error Rate</span>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">0.02%</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Availability</span>
                      <span className="text-sm font-medium text-green-600 dark:text-green-400">99.98%</span>
                    </div>
                  </div>
                </div>

                {/* Data Usage */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Data Usage</h4>
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Database Size</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">2.4 GB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Daily Growth</span>
                      <span className="text-sm font-medium text-blue-600 dark:text-blue-400">+15 MB</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-sm text-gray-600 dark:text-gray-300">Backup Size</span>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">8.1 GB</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Settings Tab */}
          {activeTab === 'settings' && (
            <div className="space-y-6">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">System Settings</h3>
              
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* General Settings */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">General Settings</h4>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        System Name
                      </label>
                      <input
                        type="text"
                        value="MediVerse Guardian X"
                        className="form-input dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                        readOnly
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Default Session Timeout (minutes)
                      </label>
                      <input
                        type="number"
                        value="30"
                        className="form-input dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Maximum Login Attempts
                      </label>
                      <input
                        type="number"
                        value="5"
                        className="form-input dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                      />
                    </div>
                  </div>
                </div>

                {/* Security Settings */}
                <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-6">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-4">Security Settings</h4>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-900 dark:text-white">Two-Factor Authentication</label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Require 2FA for all users</p>
                      </div>
                      <input type="checkbox" className="form-checkbox" checked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-900 dark:text-white">Auto Logout</label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Auto logout inactive sessions</p>
                      </div>
                      <input type="checkbox" className="form-checkbox" checked />
                    </div>
                    
                    <div className="flex items-center justify-between">
                      <div>
                        <label className="text-sm font-medium text-gray-900 dark:text-white">Audit Logging</label>
                        <p className="text-xs text-gray-500 dark:text-gray-400">Log all user activities</p>
                      </div>
                      <input type="checkbox" className="form-checkbox" checked />
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex space-x-4">
                <button 
                  onClick={() => updateSettings({})}
                  className="btn-medical"
                >
                  Save Settings
                </button>
                <button className="bg-gray-600 hover:bg-gray-700 text-white rounded-md px-4 py-2 transition-colors">
                  Reset to Defaults
                </button>
              </div>
            </div>
          )}

          {/* Logs Tab */}
          {activeTab === 'logs' && (
            <div className="space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">System Logs</h3>
                <div className="flex space-x-2">
                  <select className="form-select text-sm">
                    <option>All Activities</option>
                    <option>User Actions</option>
                    <option>System Events</option>
                    <option>Errors</option>
                  </select>
                  <button className="btn-medical-outline text-sm">
                    Export Logs
                  </button>
                </div>
              </div>
              
              {/* System Logs */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white">Recent System Activities</h4>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {systemLogs.map((log) => (
                    <div key={log.id} className="px-6 py-4 flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className={`w-2 h-2 rounded-full ${
                          log.level === 'error' ? 'bg-red-500' :
                          log.level === 'warning' ? 'bg-yellow-500' :
                          'bg-green-500'
                        }`}></div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 dark:text-white">{log.action}</p>
                          <p className="text-xs text-gray-500 dark:text-gray-400">
                            by {log.user} • {log.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        log.level === 'error' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                        log.level === 'warning' ? 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300' :
                        'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300'
                      }`}>
                        {log.level}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Verification Activities */}
              <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700">
                <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                  <h4 className="text-md font-medium text-gray-900 dark:text-white">Last 10 Verification Activities</h4>
                </div>
                <div className="divide-y divide-gray-200 dark:divide-gray-700">
                  {verificationActivities.map((activity) => (
                    <div key={activity.id} className="px-6 py-4">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-8 h-8 rounded-full flex items-center justify-center ${
                            activity.action === 'approved' ? 'bg-green-100 dark:bg-green-900/30' :
                            activity.action === 'rejected' ? 'bg-red-100 dark:bg-red-900/30' :
                            'bg-yellow-100 dark:bg-yellow-900/30'
                          }`}>
                            {activity.action === 'approved' ? (
                              <CheckCircleIcon className="h-4 w-4 text-green-600 dark:text-green-400" />
                            ) : activity.action === 'rejected' ? (
                              <XCircleIcon className="h-4 w-4 text-red-600 dark:text-red-400" />
                            ) : (
                              <ClockIcon className="h-4 w-4 text-yellow-600 dark:text-yellow-400" />
                            )}
                          </div>
                          <div>
                            <p className="text-sm font-medium text-gray-900 dark:text-white">
                              Prescription for {activity.patientName}
                            </p>
                            <p className="text-xs text-gray-500 dark:text-gray-400">
                              Verified by {activity.performedBy} • AI Confidence: {((activity.confidence || 0) * 100).toFixed(1)}%
                            </p>
                          </div>
                        </div>
                        <div className="text-right">
                          <span className={`px-2 py-1 text-xs rounded-full capitalize ${
                            activity.action === 'approved' ? 'bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300' :
                            activity.action === 'rejected' ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' :
                            'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'
                          }`}>
                            {activity.action}
                          </span>
                          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                            {activity.timestamp.toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add/Edit User Modal */}
      {showAddUser && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full z-50">
          <div className="relative top-20 mx-auto p-5 border w-96 shadow-lg rounded-md bg-white dark:bg-gray-800">
            <div className="mt-3">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                  {selectedUser ? 'Edit User' : 'Add New User'}
                </h3>
                <button
                  onClick={() => {
                    setShowAddUser(false);
                    setSelectedUser(null);
                  }}
                  className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                >
                  <XMarkIcon className="h-6 w-6" />
                </button>
              </div>
              
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Full Name
                  </label>
                  <input
                    type="text"
                    defaultValue={selectedUser?.name || ''}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-medical-500 focus:border-medical-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter full name"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    defaultValue={selectedUser?.email || ''}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-medical-500 focus:border-medical-500 dark:bg-gray-700 dark:text-white"
                    placeholder="Enter email"
                  />
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Role
                  </label>
                  <select
                    defaultValue={selectedUser?.role || 'nurse'}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-medical-500 focus:border-medical-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="nurse">Nurse</option>
                    <option value="doctor">Doctor</option>
                    <option value="admin">Admin</option>
                    <option value="pharmacist">Pharmacist</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Department
                  </label>
                  <select
                    defaultValue={selectedUser?.department || 'General'}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-medical-500 focus:border-medical-500 dark:bg-gray-700 dark:text-white"
                  >
                    <option value="General">General</option>
                    <option value="Cardiology">Cardiology</option>
                    <option value="Neurology">Neurology</option>
                    <option value="Pediatrics">Pediatrics</option>
                    <option value="Pharmacy">Pharmacy</option>
                    <option value="Emergency">Emergency</option>
                  </select>
                </div>
                
                {!selectedUser && (
                  <div>
                    <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                      Password
                    </label>
                    <input
                      type="password"
                      className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-medical-500 focus:border-medical-500 dark:bg-gray-700 dark:text-white"
                      placeholder="Enter password"
                    />
                  </div>
                )}
                
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    defaultChecked={selectedUser?.isActive ?? true}
                    className="form-checkbox text-medical-600"
                  />
                  <label className="ml-2 text-sm text-gray-700 dark:text-gray-300">
                    Active User
                  </label>
                </div>
              </form>
              
              <div className="flex justify-end space-x-3 mt-6">
                <button
                  onClick={() => {
                    setShowAddUser(false);
                    setSelectedUser(null);
                  }}
                  className="px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-300 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={() => {
                    addUser({
                      name: 'New User',
                      email: 'newuser@example.com',
                      role: 'nurse' as const,
                      department: 'General'
                    });
                    setShowAddUser(false);
                    setSelectedUser(null);
                  }}
                  className="btn-medical"
                >
                  {selectedUser ? 'Update User' : 'Add User'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
