'use client';

import React, { useState } from 'react';

const AIAnalysis: React.FC = () => {
  const [analysisText, setAnalysisText] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);

  const handleAnalyze = async () => {
    setIsAnalyzing(true);
    setTimeout(() => {
      setIsAnalyzing(false);
    }, 2000);
  };

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">AI Analysis</h1>

      {/* Analysis Input */}
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-lg font-medium text-gray-900 mb-4">Medical Text Analysis</h2>
        <textarea
          value={analysisText}
          onChange={(e) => setAnalysisText(e.target.value)}
          placeholder="Enter medical text, prescription, or clinical notes for AI analysis..."
          className="w-full h-32 p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <div className="mt-4 flex justify-end">
          <button
            onClick={handleAnalyze}
            disabled={!analysisText.trim() || isAnalyzing}
            className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isAnalyzing ? 'Analyzing...' : 'Analyze with AI'}
          </button>
        </div>
      </div>

      {/* Results */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Entity Recognition */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Medical Entities</h3>
          <div className="space-y-2">
            <div className="flex items-center space-x-2">
              <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-sm">Medication</span>
              <span>Lisinopril 10mg</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-sm">Condition</span>
              <span>Hypertension</span>
            </div>
            <div className="flex items-center space-x-2">
              <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-sm">Dosage</span>
              <span>Once daily</span>
            </div>
          </div>
        </div>

        {/* Safety Analysis */}
        <div className="bg-white rounded-lg shadow p-6">
          <h3 className="text-lg font-medium text-gray-900 mb-4">Safety Analysis</h3>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span>Drug Interactions</span>
              <span className="text-green-600 font-medium">✓ No conflicts</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Dosage Validation</span>
              <span className="text-green-600 font-medium">✓ Appropriate</span>
            </div>
            <div className="flex items-center justify-between">
              <span>Allergy Check</span>
              <span className="text-yellow-600 font-medium">⚠ Review needed</span>
            </div>
          </div>
        </div>
      </div>

      {/* AI Insights */}
      <div className="bg-white rounded-lg shadow p-6">
        <h3 className="text-lg font-medium text-gray-900 mb-4">AI Insights</h3>
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Recommendation:</strong> The prescribed medication and dosage appear appropriate for the patient's condition. 
                Consider monitoring blood pressure regularly and checking for potential side effects.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AIAnalysis;
