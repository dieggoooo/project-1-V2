'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import BottomNav from '../../components/BottomNav';
// Import utility functions from the design system
import {
  getSeverityClass,
  getStatusClass,
  getPassengersAffectedClass,
  getPassengersAffectedLabel,
  getIssueTypeIcon,
  getIssueTypeLabel
} from '../utils/styling';

// Type definitions
type IssueType = 'misplacement' | 'damage' | 'missing' | 'monetary-consumption' | 'customer-impact' | 'other';
type SeverityType = 'high' | 'medium' | 'low';
type StatusType = 'open' | 'resolved';
type PassengersAffected = 'NA' | '0-10' | '10-25' | '25-50' | '50-75' | '75-100';

interface Issue {
  id: number;
  type: IssueType;
  item: string;
  location: string;
  description: string;
  severity: SeverityType;
  passengersAffected?: PassengersAffected;
  status: StatusType;
  reportedBy: string;
  reportedAt: string;
  flight: string;
}

interface FormData {
  type: IssueType;
  item: string;
  location: string;
  description: string;
  severity: SeverityType;
  passengersAffected: PassengersAffected;
  flight: string;
}

export default function IssuesPage() {
  const [activeTab, setActiveTab] = useState<'report' | 'history'>('report');
  const [formData, setFormData] = useState<FormData>({
    type: 'misplacement',
    item: '',
    location: '',
    description: '',
    severity: 'medium',
    passengersAffected: 'NA',
    flight: ''
  });

  const [issues, setIssues] = useState<Issue[]>([
    {
      id: 1,
      type: 'misplacement',
      item: 'Coffee Pot',
      location: '1F1C03',
      description: 'Coffee pot found in wrong trolley position',
      severity: 'medium',
      passengersAffected: '10-25',
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
      passengersAffected: '0-10',
      status: 'resolved',
      reportedBy: 'Mike Chen',
      reportedAt: '2024-01-15 12:15',
      flight: 'UA1234'
    },
    {
      id: 3,
      type: 'customer-impact',
      item: 'Ice Bucket',
      location: '2A2C01',
      description: 'Ice bucket missing from designated position, affecting beverage service',
      severity: 'high',
      passengersAffected: '50-75',
      status: 'open',
      reportedBy: 'Emma Davis',
      reportedAt: '2024-01-15 10:45',
      flight: 'UA1234'
    }
  ]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newIssue: Issue = {
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
      passengersAffected: 'NA',
      flight: ''
    });
    setActiveTab('history');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {/* UPDATED: Using page-container class */}
      <div className="page-container">
        {/* Tab Selector - UPDATED: Using card-padded */}
        <div className="card-padded mb-4">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setActiveTab('report')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
                activeTab === 'report'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Report Issue
            </button>
            <button
              onClick={() => setActiveTab('history')}
              className={`flex-1 py-2 px-4 rounded-lg text-sm font-medium transition-colors ${
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
          <div>
            {/* UPDATED: Using card-padded */}
            <div className="card-padded">
              <h2 className="text-lg font-semibold mb-4">Report New Issue</h2>
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Issue Type
                  </label>
                  {/* UPDATED: Using select class */}
                  <select
                    value={formData.type}
                    onChange={(e) => setFormData({...formData, type: e.target.value as IssueType})}
                    className="select"
                    required
                  >
                    <option value="misplacement">Item Misplacement</option>
                    <option value="damage">Damage/Broken</option>
                    <option value="missing">Missing Item</option>
                    <option value="monetary-consumption">Monetary Consumption</option>
                    <option value="customer-impact">Customer Impact</option>
                    <option value="other">Other Issue</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Flight Number
                  </label>
                  {/* UPDATED: Using input class */}
                  <input
                    type="text"
                    value={formData.flight}
                    onChange={(e) => setFormData({...formData, flight: e.target.value})}
                    placeholder="e.g., UA1234"
                    className="input"
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
                    className="input"
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
                    className="input"
                    required
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Severity Level
                  </label>
                  <select
                    value={formData.severity}
                    onChange={(e) => setFormData({...formData, severity: e.target.value as SeverityType})}
                    className="select"
                    required
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Passengers Affected
                  </label>
                  <select
                    value={formData.passengersAffected}
                    onChange={(e) => setFormData({...formData, passengersAffected: e.target.value as PassengersAffected})}
                    className="select"
                    required
                  >
                    <option value="NA">Not Applicable</option>
                    <option value="0-10">0-10% of passengers</option>
                    <option value="10-25">10-25% of passengers</option>
                    <option value="25-50">25-50% of passengers</option>
                    <option value="50-75">50-75% of passengers</option>
                    <option value="75-100">75-100% of passengers</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Description
                  </label>
                  {/* UPDATED: Using textarea class */}
                  <textarea
                    value={formData.description}
                    onChange={(e) => setFormData({...formData, description: e.target.value})}
                    placeholder="Describe the issue in detail..."
                    className="textarea h-24"
                    maxLength={500}
                    required
                  />
                  <div className="text-right text-xs text-gray-500 mt-1">
                    {formData.description.length}/500
                  </div>
                </div>

                {/* UPDATED: Using btn-primary class */}
                <button
                  type="submit"
                  className="btn-primary"
                >
                  Submit Issue Report
                </button>
              </form>
            </div>
          </div>
        )}

        {activeTab === 'history' && (
          <div>
            <div className="section-spacing">
              <h2 className="text-lg font-semibold">Issue History</h2>
              <p className="text-sm text-gray-600">Recent galley issues and reports</p>
            </div>

            <div className="space-y-3">
              {issues.map((issue) => (
                // UPDATED: Using card-interactive class
                <div key={issue.id} className="card-interactive">
                  <div className="flex items-start justify-between mb-3">
                    <div className="flex items-center space-x-3">
                      {/* UPDATED: Using icon-circle classes */}
                      <div className="icon-circle icon-sm bg-blue-100">
                        <i className={`${getIssueTypeIcon(issue.type)} text-blue-600 text-sm`}></i>
                      </div>
                      <div>
                        <h3 className="font-semibold">{issue.item}</h3>
                        <p className="text-sm text-gray-600">{issue.location} • {issue.flight}</p>
                        <p className="text-xs text-gray-500">{getIssueTypeLabel(issue.type)}</p>
                      </div>
                    </div>
                    <div className="flex flex-col items-end space-y-1">
                      <div className="flex items-center space-x-2">
                        {/* UPDATED: Using design system badge and utility functions */}
                        <span className={`badge border ${getSeverityClass(issue.severity)}`}>
                          {issue.severity.toUpperCase()}
                        </span>
                        <span className={`badge ${getStatusClass(issue.status)}`}>
                          {issue.status.toUpperCase()}
                        </span>
                      </div>
                      {issue.passengersAffected && (
                        <span className={`badge ${getPassengersAffectedClass(issue.passengersAffected)}`}>
                          {getPassengersAffectedLabel(issue.passengersAffected)}
                        </span>
                      )}
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
                {/* UPDATED: Using icon-circle classes */}
                <div className="icon-circle icon-xl mx-auto mb-4 bg-gray-100">
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