'use client';

import React from 'react';

const Compliance: React.FC = () => {
  const complianceItems = [
    {
      category: 'HIPAA Compliance',
      status: 'Compliant',
      score: 98,
      lastAudit: '2024-01-10',
      issues: 0,
    },
    {
      category: 'Data Security',
      status: 'Compliant',
      score: 95,
      lastAudit: '2024-01-08',
      issues: 1,
    },
    {
      category: 'Access Controls',
      status: 'Compliant',
      score: 100,
      lastAudit: '2024-01-12',
      issues: 0,
    },
    {
      category: 'Audit Trails',
      status: 'Review Required',
      score: 85,
      lastAudit: '2024-01-05',
      issues: 3,
    },
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Compliant':
        return 'bg-green-100 text-green-800';
      case 'Review Required':
        return 'bg-yellow-100 text-yellow-800';
      case 'Non-Compliant':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 95) return 'text-green-600';
    if (score >= 85) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Compliance Dashboard</h1>
        <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
          Generate Report
        </button>
      </div>

      {/* Overall Compliance Score */}
      <div className="bg-white rounded-lg shadow p-6">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">Overall Compliance Score</h2>
            <p className="text-gray-600">Current system compliance rating</p>
          </div>
          <div className="text-right">
            <div className="text-4xl font-bold text-green-600">94.5%</div>
            <p className="text-sm text-gray-500">Last updated: Today</p>
          </div>
        </div>
      </div>

      {/* Compliance Categories */}
      <div className="bg-white rounded-lg shadow overflow-hidden">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">Compliance Categories</h3>
        </div>
        <div className="divide-y divide-gray-200">
          {complianceItems.map((item, index) => (
            <div key={index} className="px-6 py-4">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center space-x-3">
                    <h4 className="text-md font-medium text-gray-900">{item.category}</h4>
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(item.status)}`}>
                      {item.status}
                    </span>
                  </div>
                  <div className="mt-1 flex items-center space-x-4 text-sm text-gray-500">
                    <span>Last audit: {item.lastAudit}</span>
                    <span>Issues: {item.issues}</span>
                  </div>
                </div>
                <div className="text-right">
                  <div className={`text-2xl font-bold ${getScoreColor(item.score)}`}>
                    {item.score}%
                  </div>
                  <div className="w-24 bg-gray-200 rounded-full h-2 mt-1">
                    <div
                      className={`h-2 rounded-full ${
                        item.score >= 95 ? 'bg-green-500' :
                        item.score >= 85 ? 'bg-yellow-500' : 'bg-red-500'
                      }`}
                      style={{ width: `${item.score}%` }}
                    ></div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Recent Compliance Activities */}
      <div className="bg-white rounded-lg shadow">
        <div className="px-6 py-4 border-b">
          <h3 className="text-lg font-medium text-gray-900">Recent Compliance Activities</h3>
        </div>
        <div className="divide-y divide-gray-200">
          <div className="px-6 py-4 flex items-center space-x-3">
            <div className="w-3 h-3 bg-green-400 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">HIPAA audit completed successfully</p>
              <p className="text-sm text-gray-500">2 hours ago</p>
            </div>
          </div>
          <div className="px-6 py-4 flex items-center space-x-3">
            <div className="w-3 h-3 bg-yellow-400 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Data backup verification in progress</p>
              <p className="text-sm text-gray-500">4 hours ago</p>
            </div>
          </div>
          <div className="px-6 py-4 flex items-center space-x-3">
            <div className="w-3 h-3 bg-blue-400 rounded-full"></div>
            <div className="flex-1">
              <p className="text-sm font-medium text-gray-900">Access control review scheduled</p>
              <p className="text-sm text-gray-500">1 day ago</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Compliance;
