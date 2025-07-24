'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import BottomNav from '../../components/BottomNav';

export default function InventoryPage() {
  const [checklist, setChecklist] = useState([
    { id: 1, name: 'Dom Pérignon 2012', type: 'Champagne', level: 85, bottles: 6, checked: false },
    { id: 2, name: 'Johnnie Walker Blue', type: 'Whisky', level: 60, bottles: 2, checked: false },
    { id: 3, name: 'Grey Goose Vodka', type: 'Vodka', level: 45, bottles: 2, checked: false },
    { id: 4, name: 'Hennessy XO Cognac', type: 'Cognac', level: 75, bottles: 1, checked: false },
    { id: 5, name: 'Macallan 18', type: 'Whisky', level: 30, bottles: 1, checked: false },
    { id: 6, name: 'Beluga Gold Vodka', type: 'Vodka', level: 90, bottles: 1, checked: false },
    { id: 7, name: 'Rémy Martin XO', type: 'Cognac', level: 55, bottles: 1, checked: false },
    { id: 8, name: 'Krug Grande Cuvée', type: 'Champagne', level: 70, bottles: 3, checked: false }
  ]);

  const [selectedItem, setSelectedItem] = useState(null);

  const handleCheck = (id: any) => {
    setChecklist(prev => 
      prev.map((item: any) =>
        item.id === id ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const getLevelColor = (level: number) => {
    if (level >= 70) return 'text-green-600 bg-green-100';
    if (level >= 40) return 'text-orange-600 bg-orange-100';
    return 'text-red-600 bg-red-100';
  };

  const getLevelBarColor = (level: number) => {
    if (level >= 70) return 'bg-green-500';
    if (level >= 40) return 'bg-orange-500';
    return 'bg-red-500';
  };

  const completedItems = checklist.filter(item => item.checked).length;
  const progress = (completedItems / checklist.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-16 pb-20 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Post-Flight Alcohol Inventory</h1>
          <p className="text-gray-600">Check remaining alcohol levels after service</p>
        </div>

        {/* Progress Summary */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Inventory Progress</h3>
            <span className="text-sm text-gray-600">{completedItems}/{checklist.length} checked</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <div>
              <div className="text-lg font-semibold text-green-600">
                {checklist.filter(item => item.level >= 70).length}
              </div>
              <div className="text-xs text-gray-600">Good Level</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-orange-600">
                {checklist.filter(item => item.level >= 40 && item.level < 70).length}
              </div>
              <div className="text-xs text-gray-600">Medium Level</div>
            </div>
            <div>
              <div className="text-lg font-semibold text-red-600">
                {checklist.filter(item => item.level < 40).length}
              </div>
              <div className="text-xs text-gray-600">Low Level</div>
            </div>
          </div>
        </div>

        {/* Inventory List */}
        <div className="space-y-3">
          {checklist.map((item) => (
            <div
              key={item.id}
              className={`bg-white rounded-xl p-4 shadow-sm transition-all ${
                item.checked ? 'bg-green-50 border border-green-200' : ''
              }`}
            >
              <div className="flex items-center space-x-4">
                <button
                  onClick={() => handleCheck(item.id)}
                  className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                    item.checked 
                      ? 'bg-green-500 border-green-500' 
                      : 'border-gray-300 hover:border-green-400'
                  }`}
                >
                  {item.checked && (
                    <i className="ri-check-line text-white text-sm"></i>
                  )}
                </button>

                <div className="flex-1">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-semibold text-gray-900">{item.name}</h4>
                      <p className="text-sm text-gray-600">{item.type} • {item.bottles} bottle{item.bottles !== 1 ? 's' : ''}</p>
                    </div>
                    <div className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(item.level)}`}>
                      {item.level}%
                    </div>
                  </div>

                  {/* Level Bar */}
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                    <div 
                      className={`h-2 rounded-full transition-all ${getLevelBarColor(item.level)}`}
                      style={{ width: `${item.level}%` }}
                    ></div>
                  </div>

                  <button
                    onClick={() => setSelectedItem(item)}
                    className="text-sm text-blue-600 hover:text-blue-800"
                  >
                    Update Level
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-3">
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium !rounded-button">
            Submit Inventory Report
          </button>
          <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium !rounded-button">
            Save as Draft
          </button>
        </div>
      </div>

      {/* Level Update Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl p-6 max-h-[70vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">{selectedItem.name}</h2>
                <p className="text-sm text-gray-600">Update remaining level</p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <i className="ri-close-line text-gray-600"></i>
              </button>
            </div>
            
            <div className="space-y-6">
              {/* Current Level Display */}
              <div className="text-center">
                <div className="text-4xl font-bold text-blue-600 mb-2">
                  {selectedItem.level}%
                </div>
                <p className="text-gray-600">Current Level</p>
              </div>

              {/* Level Slider */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Adjust Level
                </label>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={selectedItem.level}
                  onChange={(e) => {
                    const newLevel = parseInt(e.target.value);
                    setChecklist(prev =>
                      prev.map(item =>
                        item.id === selectedItem.id 
                          ? { ...item, level: newLevel }
                          : item
                      )
                    );
                    setSelectedItem({ ...selectedItem, level: newLevel });
                  }}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
                <div className="flex justify-between text-xs text-gray-500 mt-1">
                  <span>Empty</span>
                  <span>Full</span>
                </div>
              </div>

              {/* Quick Select Buttons */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Quick Select
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[25, 50, 75, 100].map((level) => (
                    <button
                      key={level}
                      onClick={() => {
                        setChecklist(prev =>
                          prev.map(item =>
                            item.id === selectedItem.id 
                              ? { ...item, level }
                              : item
                          )
                        );
                        setSelectedItem({ ...selectedItem, level });
                      }}
                      className="py-2 px-3 border border-gray-300 rounded-lg text-sm font-medium hover:bg-gray-50 !rounded-button"
                    >
                      {level}%
                    </button>
                  ))}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Notes (Optional)
                </label>
                <textarea
                  className="w-full p-3 border border-gray-300 rounded-lg resize-none"
                  rows="3"
                  placeholder="Add notes about condition, spillage, etc..."
                  maxLength="500"
                ></textarea>
              </div>

              <button
                onClick={() => setSelectedItem(null)}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium !rounded-button"
              >
                Save Changes
              </button>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}