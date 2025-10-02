'use client';

import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  ENHANCED_PRESCRIPTIONS,
  ENHANCED_NOTIFICATIONS,
  type EnhancedPrescription,
  type Notification
} from '../../data/enhancedSampleData';
import {
  DocumentPlusIcon,
  CheckCircleIcon,
  XCircleIcon,
  ClockIcon,
  ExclamationTriangleIcon,
  ChartBarIcon,
  BellIcon,
  MagnifyingGlassIcon,
  FunnelIcon,
  ArrowUpIcon,
  ArrowDownIcon,
  EyeIcon,
  PencilIcon,
} from '@heroicons/react/24/outline';
import LoadingSpinner from '../ui/LoadingSpinner';

interface DoctorDashboardProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

const DoctorDashboard: React.FC<DoctorDashboardProps> = ({ activeTab, setActiveTab }) => {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [filterStatus, setFilterStatus] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [sortField, setSortField] = useState('uploadedAt');
  const [sortDirection, setSortDirection] = useState<'asc' | 'desc'>('desc');
  const itemsPerPage = 10;

  const doctorPrescriptions = ENHANCED_PRESCRIPTIONS.filter(prescription => 
    prescription.doctorName === user?.firstName + ' ' + user?.lastName ||
    prescription.doctorName.includes(user?.firstName || '') ||
    prescription.doctorId === user?.id
  );

  const filteredPrescriptions = doctorPrescriptions.filter(prescription => {
    const matchesSearch = 
      prescription.patientName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.drugName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      prescription.id.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = filterStatus === 'all' || prescription.status === filterStatus;
    return matchesSearch && matchesStatus;
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

  const doctorNotifications = ENHANCED_NOTIFICATIONS.filter(
    notification => notification.userId === user?.id || notification.userId === 'doctor-001'
  ).slice(0, 10);

  const stats = {
    totalPrescriptions: doctorPrescriptions.length,
    approved: doctorPrescriptions.filter(p => p.status === 'approved').length,
    pending: doctorPrescriptions.filter(p => p.status === 'pending' || p.status === 'under_review').length,
    rejected: doctorPrescriptions.filter(p => p.status === 'rejected').length,
    avgConfidence: Math.round(doctorPrescriptions.reduce((sum, p) => sum + p.confidence, 0) / doctorPrescriptions.length),
    todayUploads: doctorPrescriptions.filter(p => 
      new Date(p.uploadedAt).toDateString() === new Date().toDateString()
    ).length
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
      case 'rejected': return 'text-red-600 bg-red-100';
      case 'pending': return 'text-yellow-600 bg-yellow-100';
      case 'under_review': return 'text-blue-600 bg-blue-100';
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

  if (activeTab === 'dashboard') {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Doctor Dashboard</h1>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Welcome back, {user?.firstName} {user?.lastName}
          </div>
        </div>

        {/* Statistics Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <DocumentPlusIcon className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Total Prescriptions</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.totalPrescriptions}</p>
                <p className="text-sm text-blue-600">Today: {stats.todayUploads}</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <CheckCircleIcon className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Approved</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.approved}</p>
                <p className="text-sm text-green-600">{Math.round((stats.approved / stats.totalPrescriptions) * 100)}% rate</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <ClockIcon className="h-8 w-8 text-yellow-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Pending Review</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.pending}</p>
                <p className="text-sm text-yellow-600">Awaiting validation</p>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="flex items-center">
              <ChartBarIcon className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500 dark:text-gray-400">AI Confidence</p>
                <p className="text-2xl font-bold text-gray-900 dark:text-white">{stats.avgConfidence}%</p>
                <p className="text-sm text-purple-600">Average score</p>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Prescriptions */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent Prescriptions</h3>
          </div>
          <div className="p-6">
            <div className="space-y-4">
              {doctorPrescriptions.slice(0, 5).map((prescription) => (
                <div key={prescription.id} className="flex items-center justify-between p-4 bg-gray-50 dark:bg-gray-700 rounded-lg">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <p className="text-sm font-medium text-gray-900 dark:text-white">{prescription.id}</p>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(prescription.status)}`}>
                        {prescription.status}
                      </span>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getPriorityColor(prescription.priority)}`}>
                        {prescription.priority}
                      </span>
                    </div>
                    <p className="text-sm text-gray-600 dark:text-gray-300">
                      {prescription.patientName} • {prescription.drugName} {prescription.dosage}
                    </p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">
                      {new Date(prescription.uploadedAt).toLocaleString()}
                    </p>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-gray-900 dark:text-white">
                      {prescription.confidence}%
                    </div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">
                      AI Confidence
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <button
            onClick={() => setActiveTab('upload-prescription')}
            className="p-6 bg-blue-500 hover:bg-blue-600 text-white rounded-lg transition-colors"
          >
            <DocumentPlusIcon className="h-8 w-8 mb-2" />
            <h3 className="font-medium">Upload Prescription</h3>
            <p className="text-sm text-blue-100">Submit new prescription for validation</p>
          </button>

          <button
            onClick={() => setActiveTab('ai-validation')}
            className="p-6 bg-green-500 hover:bg-green-600 text-white rounded-lg transition-colors"
          >
            <CheckCircleIcon className="h-8 w-8 mb-2" />
            <h3 className="font-medium">AI Validation Reports</h3>
            <p className="text-sm text-green-100">Review AI analysis results</p>
          </button>

          <button
            onClick={() => setActiveTab('notifications')}
            className="p-6 bg-purple-500 hover:bg-purple-600 text-white rounded-lg transition-colors"
          >
            <BellIcon className="h-8 w-8 mb-2" />
            <h3 className="font-medium">Notifications</h3>
            <p className="text-sm text-purple-100">{doctorNotifications.filter(n => !n.isRead).length} unread messages</p>
          </button>
        </div>
      </div>
    );
  }

  if (activeTab === 'upload-prescription') {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Upload Prescription</h1>

        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <form className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Patient Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter patient name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Patient Age
                </label>
                <input
                  type="number"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter age"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Symptoms
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={3}
                placeholder="Describe patient symptoms"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Drug Name
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Enter drug name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Dosage
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., 500mg"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Frequency
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option>Once daily</option>
                  <option>Twice daily</option>
                  <option>Three times daily</option>
                  <option>As needed</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Duration
                </label>
                <input
                  type="text"
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="e.g., 7 days"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                  Priority Level
                </label>
                <select className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="critical">Critical</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                Special Instructions
              </label>
              <textarea
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                rows={3}
                placeholder="Any special instructions for the patient"
              />
            </div>

            <div className="flex justify-end space-x-4">
              <button
                type="button"
                className="px-4 py-2 border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700"
              >
                Save as Draft
              </button>
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
              >
                Submit for Validation
              </button>
            </div>
          </form>
        </div>
      </div>
    );
  }

  if (activeTab === 'prescription-history') {
    return (
      <div className="p-6 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Prescription History</h1>
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Total: {doctorPrescriptions.length} prescriptions
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
              <option value="pending">Pending</option>
              <option value="rejected">Rejected</option>
              <option value="under_review">Under Review</option>
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
                    Patient
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Drug & Dosage
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    AI Score
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm font-medium text-gray-900 dark:text-white">
                        {prescription.drugName}
                      </div>
                      <div className="text-sm text-gray-500 dark:text-gray-400">
                        {prescription.dosage} • {prescription.frequency}
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
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="text-sm font-medium text-gray-900 dark:text-white">
                          {prescription.confidence}%
                        </div>
                        <div className={`ml-2 w-12 h-2 rounded-full ${
                          prescription.confidence >= 90 ? 'bg-green-200' :
                          prescription.confidence >= 80 ? 'bg-yellow-200' : 'bg-red-200'
                        }`}>
                          <div
                            className={`h-2 rounded-full ${
                              prescription.confidence >= 90 ? 'bg-green-500' :
                              prescription.confidence >= 80 ? 'bg-yellow-500' : 'bg-red-500'
                            }`}
                            style={{ width: `${prescription.confidence}%` }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                      {new Date(prescription.uploadedAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="flex justify-end space-x-2">
                        <button className="text-blue-600 hover:text-blue-900 dark:text-blue-400 dark:hover:text-blue-300">
                          <EyeIcon className="h-4 w-4" />
                        </button>
                        {prescription.status === 'pending' && (
                          <button className="text-gray-600 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-300">
                            <PencilIcon className="h-4 w-4" />
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

  if (activeTab === 'ai-validation') {
    return (
      <div className="p-6 space-y-6">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white">AI Validation Reports</h1>

        {/* AI Analysis Summary */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Average Confidence</h3>
            <div className="flex items-center">
              <div className="text-3xl font-bold text-blue-600">{stats.avgConfidence}%</div>
              <div className="ml-4 flex-1">
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-blue-600 h-2 rounded-full"
                    style={{ width: `${stats.avgConfidence}%` }}
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">High Confidence</h3>
            <div className="text-3xl font-bold text-green-600">
              {doctorPrescriptions.filter(p => p.confidence >= 90).length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">≥90% confidence</div>
          </div>

          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">Requires Review</h3>
            <div className="text-3xl font-bold text-orange-600">
              {doctorPrescriptions.filter(p => p.confidence < 80).length}
            </div>
            <div className="text-sm text-gray-500 dark:text-gray-400">&lt;80% confidence</div>
          </div>
        </div>

        {/* Recent AI Analysis */}
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow">
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
            <h3 className="text-lg font-medium text-gray-900 dark:text-white">Recent AI Analysis</h3>
          </div>
          <div className="p-6">
            <div className="space-y-6">
              {doctorPrescriptions.slice(0, 10).map((prescription) => (
                <div key={prescription.id} className="border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h4 className="text-lg font-medium text-gray-900 dark:text-white">
                        {prescription.id} - {prescription.patientName}
                      </h4>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {prescription.drugName} {prescription.dosage} • {prescription.frequency}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="text-lg font-bold text-gray-900 dark:text-white">
                        {prescription.confidence}%
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(prescription.status)}`}>
                        {prescription.status}
                      </span>
                    </div>
                  </div>

                  {/* AI Comments */}
                  <div className="space-y-2">
                    <h5 className="text-sm font-medium text-gray-700 dark:text-gray-300">AI Analysis:</h5>
                    {prescription.aiComments.map((comment, index) => (
                      <div key={index} className="text-sm text-gray-600 dark:text-gray-400 bg-blue-50 dark:bg-blue-900/20 p-2 rounded">
                        {comment}
                      </div>
                    ))}
                  </div>

                  {/* Drug Interactions */}
                  {prescription.interactions.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-orange-700 dark:text-orange-300 flex items-center">
                        <ExclamationTriangleIcon className="h-4 w-4 mr-1" />
                        Drug Interactions Detected:
                      </h5>
                      <div className="mt-2 space-y-1">
                        {prescription.interactions.map((interaction) => (
                          <div key={interaction.id} className="text-sm text-orange-600 dark:text-orange-400 bg-orange-50 dark:bg-orange-900/20 p-2 rounded">
                            <strong>{interaction.severity.toUpperCase()}:</strong> {interaction.description}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Alternatives */}
                  {prescription.alternatives && prescription.alternatives.length > 0 && (
                    <div className="mt-4">
                      <h5 className="text-sm font-medium text-green-700 dark:text-green-300">
                        Suggested Alternatives:
                      </h5>
                      <div className="mt-2 grid grid-cols-1 md:grid-cols-2 gap-2">
                        {prescription.alternatives.slice(0, 2).map((alt, index) => (
                          <div key={index} className="text-sm bg-green-50 dark:bg-green-900/20 p-2 rounded">
                            <div className="font-medium text-green-800 dark:text-green-200">
                              {alt.drugName} {alt.dosage}
                            </div>
                            <div className="text-green-600 dark:text-green-400">
                              {alt.reason} • Safety: {alt.safetyScore}%
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
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
          {doctorNotifications.map((notification) => (
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

export default DoctorDashboard;
