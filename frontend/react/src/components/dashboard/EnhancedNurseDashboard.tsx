'use client';

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ENHANCED_PRESCRIPTIONS,
  ENHANCED_NOTIFICATIONS,
  type EnhancedPrescription,
  type DrugInteraction,
  type Notification
} from '../../data/enhancedSampleData';
import {
  DocumentTextIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  ClockIcon,
  BellIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  CheckIcon,
  XMarkIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../ui/LoadingSpinner';

interface NurseDashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const NurseDashboard: React.FC<NurseDashboardProps> = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterPriority, setFilterPriority] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('uploadedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const itemsPerPage = 10;

  const nursePrescriptions = ENHANCED_PRESCRIPTIONS.filter(prescription => 
    prescription.nurseAssigned === `${user?.firstName} ${user?.lastName}` ||
    prescription.status === 'approved' ||
    prescription.status === 'checked' ||
    prescription.status === 'dispensed' ||
    !prescription.nurseAssigned // Unassigned prescriptions
  );

  const allInteractions: (DrugInteraction & { prescriptionId: string; patientName: string })[] = [];
  ENHANCED_PRESCRIPTIONS.forEach(prescription => {
    prescription.interactions.forEach(interaction => {
      allInteractions.push({
        ...interaction,
        prescriptionId: prescription.id,
        patientName: prescription.patientName
      });
    });
  });

  const criticalInteractions = allInteractions.filter(
    interaction => interaction.severity === 'critical' || interaction.severity === 'severe'
  );

  const filteredPrescriptions = nursePrescriptions.filter(prescription => {
    const matchesSearch = 
      prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.drugName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.doctorName.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || prescription.status === filterStatus;
    const matchesPriority = filterPriority === 'all' || prescription.priority === filterPriority;
    return matchesSearch && matchesStatus && matchesPriority;
  }).sort((a, b) => {
    const aValue = a[sortField as keyof EnhancedPrescription];
    const bValue = b[sortField as keyof EnhancedPrescription];
    
    if (aValue === undefined && bValue === undefined) return 0;
    if (aValue === undefined) return 1;
    if (bValue === undefined) return -1;
    
    if (sortDirection === 'asc') {
      return aValue > bValue ? 1 : -1;
    }
    return aValue < bValue ? 1 : -1;
  });

  const paginatedPrescriptions = filteredPrescriptions.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const totalPages = Math.ceil(filteredPrescriptions.length / itemsPerPage);

  const nurseNotifications = ENHANCED_NOTIFICATIONS.filter(
    notification => notification.userId === user?.id || notification.userId === 'nurse-001'
  ).slice(0, 15);

  const stats = {
    assignedToday: nursePrescriptions.filter(p => 
      new Date(p.uploadedAt).toDateString() === new Date().toDateString()
    ).length,
    checkedTotal: nursePrescriptions.filter(p => p.status === 'checked' || p.status === 'dispensed').length,
    pendingCheck: nursePrescriptions.filter(p => 
      p.status === 'approved' && (!p.checkedAt || !p.checkedBy)
    ).length,
    criticalAlerts: criticalInteractions.length,
    totalAssigned: nursePrescriptions.length
  };

  const handleSort = (field: string) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc');
    } else {
      setSortField(field);
      setSortDirection('asc');
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved': return 'text-green-600 bg-green-100';
      case 'checked': return 'text-blue-600 bg-blue-100';
      case 'dispensed': return 'text-purple-600 bg-purple-100';
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-gray-600 bg-gray-100';
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'critical': return 'text-red-600 bg-red-100';
      case 'high': return 'text-orange-600 bg-orange-100';
      case 'medium': return 'text-yellow-600 bg-yellow-100';
      default: return 'text-green-600 bg-green-100';
    }
  };

  const getSeverityColor = (severity: string) => {
    switch (severity) {
      case 'critical': return 'text-red-600 bg-red-100 border-red-200';
      case 'severe': return 'text-orange-600 bg-orange-100 border-orange-200';
      case 'moderate': return 'text-yellow-600 bg-yellow-100 border-yellow-200';
      default: return 'text-blue-600 bg-blue-100 border-blue-200';
    }
  };

  if (activeTab === 'dashboard') {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Nurse Dashboard</h1>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Welcome back, {user?.firstName} {user?.lastName}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <DocumentTextIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned Today</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.assignedToday}</p>
                <p className="text-sm text-blue-600">Total: {stats.totalAssigned}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Checked</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.checkedTotal}</p>
                <p className="text-sm text-green-600">Verified & Ready</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Check</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pendingCheck}</p>
                <p className="text-sm text-orange-600">Awaiting verification</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <ExclamationTriangleIcon className="h-8 w-8 text-red-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Critical Alerts</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.criticalAlerts}</p>
                <p className="text-sm text-red-600">Drug interactions</p>
              </div>
            </div>
          </div>
        </div>

        {/* Urgent Items */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Critical Drug Interactions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <ExclamationTriangleIcon className="h-5 w-5 text-red-500 mr-2" />
                Critical Drug Interactions
              </h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {criticalInteractions.slice(0, 5).map((interaction) => (
                  <div key={interaction.id} className={`p-3 rounded-lg border-l-4 ${getSeverityColor(interaction.severity)}`}>
                    <div className="flex justify-between items-start">
                      <div>
                        <p className="text-sm font-medium text-gray-900 dark:text-white">
                          {interaction.prescriptionId} - {interaction.patientName}
                        </p>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          <strong>{interaction.drug1}</strong> + <strong>{interaction.drug2}</strong>
                        </p>
                        <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                          {interaction.description}
                        </p>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(interaction.severity)}`}>
                        {interaction.severity}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveTab('drug-interactions')}
                className="mt-4 w-full text-center py-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All Drug Interactions →
              </button>
            </div>
          </div>

          {/* Pending Prescriptions */}
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Pending Verification</h3>
            </div>
            <div className="p-6">
              <div className="space-y-4">
                {nursePrescriptions.filter(p => p.status === 'approved' && !p.checkedBy).slice(0, 5).map((prescription) => (
                  <div key={prescription.id} className="flex items-center justify-between p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <div>
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{prescription.id}</p>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {prescription.patientName} • {prescription.drugName}
                      </p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">
                        Dr. {prescription.doctorName} • {new Date(prescription.uploadedAt).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="flex space-x-2">
                      <button className="p-1 text-green-600 hover:text-green-800">
                        <CheckIcon className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-blue-600 hover:text-blue-800">
                        <EyeIcon className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
              <button
                onClick={() => setActiveTab('assigned-prescriptions')}
                className="mt-4 w-full text-center py-2 text-blue-600 hover:text-blue-800 text-sm font-medium"
              >
                View All Assigned Prescriptions →
              </button>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => setActiveTab('assigned-prescriptions')}
            className="p-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <DocumentTextIcon className="h-8 w-8 mb-2" />
            <h3 className="font-medium">View Assignments</h3>
            <p className="text-sm text-blue-100">{stats.pendingCheck} pending verification</p>
          </button>

          <button
            onClick={() => setActiveTab('drug-interactions')}
            className="p-6 bg-orange-500 hover:bg-orange-600 text-white rounded-lg transition-colors"
          >
            <ExclamationTriangleIcon className="h-8 w-8 mb-2" />
            <h3 className="font-medium">Drug Interactions</h3>
            <p className="text-sm text-orange-100">{stats.criticalAlerts} critical alerts</p>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className="p-6 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
          >
            <BellIcon className="h-8 w-8 mb-2" />
            <h3 className="font-medium">Notifications</h3>
            <p className="text-sm text-purple-100">{nurseNotifications.filter(n => !n.isRead).length} unread messages</p>
          </button>
        </div>
      </div>
    );
  }

  if (activeTab === 'assigned-prescriptions') {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Assigned Prescriptions</h1>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total: {nursePrescriptions.length} prescriptions
          </div>
        </div>

        {/* Search and Filter */}
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="relative flex-1">
            <MagnifyingGlassIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search prescriptions..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 w-full border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          <div className="relative">
            <FunnelIcon className="h-5 w-5 absolute left-3 top-3 text-gray-400" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="pl-10 pr-8 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Status</option>
              <option value="approved">Approved</option>
              <option value="checked">Checked</option>
              <option value="dispensed">Dispensed</option>
            </select>
          </div>
          <div className="relative">
            <select
              value={filterPriority}
              onChange={(e) => setFilterPriority(e.target.value)}
              className="px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option value="all">All Priority</option>
              <option value="critical">Critical</option>
              <option value="high">High</option>
              <option value="medium">Medium</option>
              <option value="low">Low</option>
            </select>
          </div>
        </div>

        {/* Prescriptions Table */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('id')}
                      className="flex items-center hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      Prescription ID
                      {sortField === 'id' && (
                        sortDirection === 'asc' ? <ArrowUpIcon className="h-4 w-4 ml-1" /> : <ArrowDownIcon className="h-4 w-4 ml-1" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Patient Info
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Medication
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Doctor
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    <button
                      onClick={() => handleSort('uploadedAt')}
                      className="flex items-center hover:text-gray-700 dark:hover:text-gray-200"
                    >
                      Date
                      {sortField === 'uploadedAt' && (
                        sortDirection === 'asc' ? <ArrowUpIcon className="h-4 w-4 ml-1" /> : <ArrowDownIcon className="h-4 w-4 ml-1" />
                      )}
                    </button>
                  </th>
                  <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                {paginatedPrescriptions.map((prescription) => (
                  <tr key={prescription.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {prescription.id}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Priority: <span className={`px-1 py-0.5 text-xs rounded ${getPriorityColor(prescription.priority)}`}>
                          {prescription.priority}
                        </span>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {prescription.patientName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        Age: {prescription.patientAge}
                      </div>
                      {prescription.allergies.length > 0 && (
                        <div className="text-xs text-red-600 dark:text-red-400">
                          Allergies: {prescription.allergies.slice(0, 2).join(', ')}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {prescription.drugName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {prescription.dosage} • {prescription.frequency}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        Duration: {prescription.duration}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900 dark:text-white">
                        {prescription.doctorName}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(prescription.status)}`}>
                        {prescription.status}
                      </span>
                      {prescription.flags.length > 0 && (
                        <div className="mt-1">
                          <ExclamationTriangleIcon className="h-4 w-4 text-orange-500 inline" />
                          <span className="text-xs text-orange-600 ml-1">{prescription.flags.join(', ')}</span>
                        </div>
                      )}
                      {prescription.interactions.length > 0 && (
                        <div className="mt-1">
                          <ExclamationTriangleIcon className="h-4 w-4 text-red-500 inline" />
                          <span className="text-xs text-red-600 ml-1">Drug Interactions</span>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(prescription.uploadedAt).toLocaleDateString()}
                      {prescription.checkedAt && (
                        <div className="text-xs text-green-600">
                          Checked: {new Date(prescription.checkedAt).toLocaleDateString()}
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        {prescription.status === 'approved' && !prescription.checkedBy && (
                          <button className="text-green-600 hover:text-green-900 dark:text-green-400 dark:hover:text-green-300">
                            <CheckIcon className="h-4 w-4" />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Pagination */}
          <div className="bg-white dark:bg-gray-800 px-4 py-3 flex items-center justify-between border-t border-gray-200 dark:border-gray-700 sm:px-6">
            <div className="flex-1 flex justify-between sm:hidden">
              <button
                onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
                disabled={currentPage === 1}
                className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Previous
              </button>
              <button
                onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
                disabled={currentPage === totalPages}
                className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50"
              >
                Next
              </button>
            </div>
            <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
              <div>
                <p className="text-sm text-gray-700 dark:text-gray-300">
                  Showing <span className="font-medium">{(currentPage - 1) * itemsPerPage + 1}</span> to{' '}
                  <span className="font-medium">{Math.min(currentPage * itemsPerPage, filteredPrescriptions.length)}</span> of{' '}
                  <span className="font-medium">{filteredPrescriptions.length}</span> results
                </p>
              </div>
              <div>
                <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                        page === currentPage
                          ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                          : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      {page}
                    </button>
                  ))}
                </nav>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'drug-interactions') {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Drug Interaction Warnings</h1>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            {criticalInteractions.length} critical interactions found
          </div>
        </div>

        {/* Severity Summary */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          {['critical', 'severe', 'moderate', 'mild'].map((severity) => {
            const count = allInteractions.filter(i => i.severity === severity).length;
            return (
              <div key={severity} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
                <div className="flex items-center">
                  <ExclamationTriangleIcon className={`h-8 w-8 ${
                    severity === 'critical' ? 'text-red-500' :
                    severity === 'severe' ? 'text-orange-500' :
                    severity === 'moderate' ? 'text-yellow-500' : 'text-blue-500'
                  }`} />
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400 capitalize">{severity}</p>
                    <p className="text-2xl font-bold text-gray-900 dark:text-white">{count}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Interactions List */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">All Drug Interactions</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {allInteractions.map((interaction) => (
                <div key={interaction.id} className={`p-4 rounded-lg border-l-4 ${getSeverityColor(interaction.severity)}`}>
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSeverityColor(interaction.severity)}`}>
                          {interaction.severity.toUpperCase()}
                        </span>
                        <span className="text-sm font-medium text-gray-900 dark:text-white">
                          {interaction.prescriptionId}
                        </span>
                        <span className="text-sm text-gray-600 dark:text-gray-400">
                          {interaction.patientName}
                        </span>
                      </div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                        {interaction.drug1} + {interaction.drug2}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {interaction.description}
                      </p>
                      <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded">
                        <p className="text-sm text-blue-800 dark:text-blue-200">
                          <strong>Recommendation:</strong> {interaction.recommendation}
                        </p>
                      </div>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                        Detected: {new Date(interaction.detectedAt).toLocaleString()}
                      </p>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <button className="text-blue-600 hover:text-blue-800 text-sm">
                        View Prescription
                      </button>
                      <button className="text-green-600 hover:text-green-800 text-sm">
                        Mark Reviewed
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (activeTab === 'mark-checked') {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Mark Prescription as Checked</h1>

        {/* Quick Action Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {nursePrescriptions.filter(p => p.status === 'approved' && !p.checkedBy).slice(0, 6).map((prescription) => (
            <div key={prescription.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-medium text-gray-900 dark:text-white">{prescription.id}</h3>
                  <p className="text-sm text-gray-600 dark:text-gray-400">{prescription.patientName}</p>
                </div>
                <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(prescription.priority)}`}>
                  {prescription.priority}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Drug:</span>
                  <span className="text-sm font-medium text-gray-900 dark:text-white">{prescription.drugName}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Dosage:</span>
                  <span className="text-sm text-gray-900 dark:text-white">{prescription.dosage}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Frequency:</span>
                  <span className="text-sm text-gray-900 dark:text-white">{prescription.frequency}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Doctor:</span>
                  <span className="text-sm text-gray-900 dark:text-white">{prescription.doctorName}</span>
                </div>
              </div>

              {prescription.interactions.length > 0 && (
                <div className="mb-4 p-2 bg-red-50 dark:bg-red-900/20 rounded">
                  <div className="flex items-center text-red-800 dark:text-red-200">
                    <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                    <span className="text-xs">Drug interactions detected</span>
                  </div>
                </div>
              )}

              <div className="flex space-x-2">
                <button className="flex-1 bg-green-500 hover:bg-green-600 text-white py-2 px-4 rounded text-sm font-medium">
                  ✓ Mark as Checked
                </button>
                <button className="px-3 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-50 dark:hover:bg-gray-700">
                  <EyeIcon className="h-4 w-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

        {nursePrescriptions.filter(p => p.status === 'approved' && !p.checkedBy).length === 0 && (
          <div className="text-center py-12">
            <CheckCircleIcon className="h-16 w-16 text-green-500 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">All Caught Up!</h3>
            <p className="text-gray-600 dark:text-gray-400">No prescriptions pending verification at the moment.</p>
          </div>
        )}
      </div>
    );
  }

  if (activeTab === 'notifications') {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Notifications</h1>
          <button className="text-blue-600 hover:text-blue-800 text-sm">Mark all as read</button>
        </div>

        <div className="space-y-4">
          {nurseNotifications.map((notification) => (
            <div
              key={notification.id}
              className={`p-4 rounded-lg border ${
                notification.isRead 
                  ? 'bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700' 
                  : 'bg-blue-50 dark:bg-blue-900/20 border-blue-200 dark:border-blue-700'
              }`}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-2">
                    <h3 className={`text-sm font-medium ${
                      notification.isRead ? 'text-gray-900 dark:text-white' : 'text-blue-900 dark:text-blue-100'
                    }`}>
                      {notification.title}
                    </h3>
                    {!notification.isRead && (
                      <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                    )}
                    {notification.actionRequired && (
                      <span className="px-2 py-1 text-xs bg-red-100 text-red-800 rounded-full">
                        Action Required
                      </span>
                    )}
                  </div>
                  <p className={`text-sm mt-1 ${
                    notification.isRead ? 'text-gray-600 dark:text-gray-400' : 'text-blue-800 dark:text-blue-200'
                  }`}>
                    {notification.message}
                  </p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-2">
                    {new Date(notification.createdAt).toLocaleString()}
                  </p>
                </div>
                <div className="flex space-x-2">
                  <button className="text-blue-600 hover:text-blue-800 text-sm">View</button>
                  {!notification.isRead && (
                    <button className="text-gray-600 hover:text-gray-800 text-sm">Mark read</button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="p-6">
      <div className="text-center">
        <h2 className="text-xl font-bold text-gray-900 dark:text-white">Page Not Found</h2>
        <p className="text-gray-600 dark:text-gray-400">The requested page could not be found.</p>
      </div>
    </div>
  );
};

export default NurseDashboard;
