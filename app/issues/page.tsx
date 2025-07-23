'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import BottomNav from '../../components/BottomNav';

export default function IssuesPage() {
  const [activeTab, setActiveTab] = useState('report');
  const [formData, setFormData] = useState({
    type: 'misplacement',
    item: '',
    location: '',
    description: '',
    severity: 'medium',
    flight: ''
  });

  const [issues, setIssues] = useState([
    {
      id: 1,
      type: 'misplacement',
      item: 'Coffee Pot',
      location: '1F1C03',
      description: 'Coffee pot found in wrong trolley position',
      severity: 'medium',
      status: 'open',
      reportedBy: 'Sarah Johnson',
      reportedAt: '2024-01-15 14:30',
      flight: 'UA1234'
    },
    {
      id: 2,
      type: 'damage',
      item: 'Wine Glasses',
      location: '1F2C05',
      description: '2 wine glasses cracked, need replacement',
      severity: 'high',
      status: 'resolved',
      reportedBy: 'Mike Chen',
      reportedAt: '2024-01-15 12:15',
      flight: 'UA1234'
    },
    {
      id: 3,
      type: 'missing',
      item: 'Ice Bucket',
      location: '2A2C01',
      description: 'Ice bucket missing from designated position',
      severity: 'high',
      status: 'open',
      reportedBy: 'Emma Davis',
      reportedAt: '2024-01-15 10:45',
      flight: 'UA1234'
    }
  ]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const newIssue = {
      id: issues.length + 1,
      ...formData,
      status: 'open',
      reportedBy: 'Current User',
      reportedAt: new Date().toLocaleString(),
    };
    setIssues([newIssue, ...issues]);
    setFormData({
      type: 'misplacement',
      item: '',
      location: '',
      description: '',
      severity: 'medium',
      flight: ''
    });
    setActiveTab('history');
  };

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return 'bg-red-100 text-red-700 border-red-200';
      case 'medium': return 'bg-yellow-100 text-yellow-700 border-yellow-200';
      case 'low': return 'bg-green-100 text-green-700 border-green-200';
      default: return 'bg-gray-100 text-gray-700 border-gray-200';
    }
  };

  const getTypeIcon = (type) => {
    switch (type) {
      case 'misplacement': return 'ri-map-pin-line';
      case 'damage': return 'ri-tools-line';
      case 'missing': return 'ri-error-warning-line';
      case 'other': return 'ri-question-line';
      default: return 'ri-alert-line';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-16 pb-20">
        {/* Tab Selector */}
        <div className="px-4 py-4 bg-white border-b">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('report')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors !rounded-button ${
                activeTab === 'report'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Report Issue
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors !rounded-button ${
                activeTab === 'history'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Issue History
            </button>
          </div>
        </div>

        {activeTab === 'report' && (
          <div className="px-4 py-6">
            <div className="bg-white rounded-xl shadow-sm p-6">
              <h2 className="text-lg font-semibold mb-4">Report New Issue</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Type
                  </label>
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="misplacement">Item Misplacement</option>
                    <option value="damage">Damage/Broken</option>
                    <option value="missing">Missing Item</option>
                    <option value="other">Other Issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Flight Number
                  </label>
                  <input
                    type="text"
                    value={formData.flight}
                    onChange={(e) => setFormData({...formData, flight: e.target.value})}
                    placeholder="e.g., UA1234"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Item Name
                  </label>
                  <input
                    type="text"
                    value={formData.item}
                    onChange={(e) => setFormData({...formData, item: e.target.value})}
                    placeholder="e.g., Coffee Pot, Wine Glasses"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Location/Position Code
                  </label>
                  <input
                    type="text"
                    value={formData.location}
                    onChange={(e) => setFormData({...formData, location: e.target.value})}
                    placeholder="e.g., 1F1C03, 2A2C01"
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Severity Level
                  </label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({...formData, severity: e.target.value})}
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    required
                  >
                    <option value="low">Low - Minor inconvenience</option>
                    <option value="medium">Medium - Affects service</option>
                    <option value="high">High - Critical for operation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe the issue in detail..."
                    className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent h-24 resize-none"
                    maxLength="500"
                    required
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {formData.description.length}/500
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors !rounded-button"
                >
                  Submit Issue Report
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div className="px-4 py-6">
            <div className="mb-4">
              <h2 className="text-lg font-semibold">Issue History</h2>
              <p className="text-sm text-gray-600">Recent galley issues and reports</p>
            </div>

            <div className="space-y-3">
              {issues.map((issue) => (
                <div key={issue.id} className="bg-white rounded-xl p-4 shadow-sm">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                        <i className={`${getTypeIcon(issue.type)} text-blue-600 text-sm`}></i>
                      </div>
                      <div>
                        <h3 className="font-semibold">{issue.item}</h3>
                        <p className="text-sm text-gray-600">{issue.location} • {issue.flight}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`px-2 py-1 rounded-full text-xs font-medium border ${getSeverityColor(issue.severity)}`}>
                        {issue.severity.toUpperCase()}
                      </span>
                      <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                        issue.status === 'open' 
                          ? 'bg-orange-100 text-orange-700' 
                          : 'bg-green-100 text-green-700'
                      }`}>
                        {issue.status.toUpperCase()}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-3">{issue.description}</p>
                  
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Reported by {issue.reportedBy}</span>
                    <span>{issue.reportedAt}</span>
                  </div>
                </div>
              ))}
            </div>

            {issues.length === 0 && (
              <div className="text-center py-12">
                <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                  <i className="ri-file-list-line text-gray-400 text-2xl"></i>
                </div>
                <p className="text-gray-500">No issues reported yet</p>
              </div>
            )}
          </div>
        )}
      </div>

      <BottomNav />
    </div>
  );
}