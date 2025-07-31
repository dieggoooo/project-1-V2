'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import BottomNav from '../../components/BottomNav';

export default function InventoryPage() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState<string | null>(null);
  const [checklist, setChecklist] = useState([
    // Alcohol Inventory
    { id: 1, name: 'Dom Pérignon 2012', type: 'Champagne', level: 85, bottles: 6, checked: false },
    { id: 2, name: 'Johnnie Walker Blue', type: 'Whisky', level: 60, bottles: 2, checked: false },
    { id: 3, name: 'Grey Goose Vodka', type: 'Vodka', level: 45, bottles: 2, checked: false },
    { id: 4, name: 'Hennessy XO Cognac', type: 'Cognac', level: 75, bottles: 1, checked: false },
    { id: 5, name: 'Macallan 18', type: 'Whisky', level: 30, bottles: 1, checked: false },
    { id: 6, name: 'Beluga Gold Vodka', type: 'Vodka', level: 90, bottles: 1, checked: false },
    { id: 7, name: 'Rémy Martin XO', type: 'Cognac', level: 55, bottles: 1, checked: false },
    { id: 8, name: 'Krug Grande Cuvée', type: 'Champagne', level: 70, bottles: 3, checked: false },
    // Galley Equipment & Supplies
    { id: 9, name: 'Coffee Pot', type: 'Equipment', level: 100, bottles: 2, checked: false },
    { id: 10, name: 'Tea Service Set', type: 'Equipment', level: 100, bottles: 1, checked: false },
    { id: 11, name: 'Sugar Packets', type: 'Supplies', level: 75, bottles: 200, checked: false },
    { id: 12, name: 'Wine Glasses', type: 'Glassware', level: 90, bottles: 24, checked: false },
    { id: 13, name: 'Water Glasses', type: 'Glassware', level: 85, bottles: 30, checked: false },
    { id: 14, name: 'Napkins', type: 'Supplies', level: 60, bottles: 150, checked: false },
    { id: 15, name: 'Meal Trays', type: 'Equipment', level: 95, bottles: 20, checked: false },
    { id: 16, name: 'Cutlery', type: 'Equipment', level: 80, bottles: 25, checked: false },
    { id: 17, name: 'Salt & Pepper', type: 'Supplies', level: 70, bottles: 15, checked: false },
    { id: 18, name: 'Bread Baskets', type: 'Equipment', level: 100, bottles: 8, checked: false },
    { id: 19, name: 'Butter', type: 'Supplies', level: 45, bottles: 50, checked: false },
    { id: 20, name: 'Condiments', type: 'Supplies', level: 80, bottles: 30, checked: false },
    { id: 21, name: 'Champagne Flutes', type: 'Glassware', level: 90, bottles: 16, checked: false },
    { id: 22, name: 'Premium Spirits', type: 'Alcohol', level: 65, bottles: 8, checked: false },
    { id: 23, name: 'Ice', type: 'Supplies', level: 40, bottles: 10, checked: false },
    { id: 24, name: 'Cocktail Mixers', type: 'Supplies', level: 85, bottles: 24, checked: false },
    { id: 25, name: 'Garnishes', type: 'Supplies', level: 70, bottles: 50, checked: false },
    { id: 26, name: 'Snack Items', type: 'Food', level: 55, bottles: 100, checked: false },
    { id: 27, name: 'Beverages', type: 'Drinks', level: 80, bottles: 48, checked: false },
    { id: 28, name: 'Cookies', type: 'Food', level: 65, bottles: 60, checked: false }
  ]);

  const [selectedItem, setSelectedItem] = useState<any>(null);

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

  const getLevelCategory = (level: number) => {
    if (level >= 70) return 'Good';
    if (level >= 40) return 'Medium';
    return 'Low';
  };

  const filteredItems = checklist.filter(item => {
    const typeMatch = selectedFilter === 'All' || item.type === selectedFilter;
    const levelMatch = !levelFilter || getLevelCategory(item.level) === levelFilter;
    return typeMatch && levelMatch;
  });
  const completedItems = filteredItems.filter(item => item.checked).length;
  const progress = filteredItems.length > 0 ? (completedItems / filteredItems.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-16 pb-20 px-4">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Post-Flight Inventory</h1>
          <p className="text-gray-600">Check remaining levels for alcohol, equipment, and supplies</p>
        </div>

        {/* Filter Tabs */}
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <div className="flex flex-wrap gap-2">
            {['All', 'Alcohol', 'Equipment', 'Supplies', 'Glassware', 'Food', 'Drinks'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`px-3 py-1 rounded-full text-sm font-medium transition-colors ${
                  selectedFilter === filter
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        {/* Progress Summary */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <div className="flex items-center justify-between mb-3">
            <h3 className="font-semibold">Inventory Progress</h3>
            <span className="text-sm text-gray-600">{completedItems}/{filteredItems.length} checked</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
          <div className="grid grid-cols-3 gap-4 text-center">
            <button
              onClick={() => setLevelFilter(levelFilter === 'Good' ? null : 'Good')}
              className={`p-2 rounded-lg transition-colors ${
                levelFilter === 'Good' ? 'bg-green-100 border-2 border-green-300' : 'hover:bg-green-50'
              }`}
            >
              <div className={`text-lg font-semibold ${levelFilter === 'Good' ? 'text-green-700' : 'text-green-600'}`}>
                {filteredItems.filter(item => item.level >= 70).length}
              </div>
              <div className="text-xs text-gray-600">Good Level</div>
            </button>
            <button
              onClick={() => setLevelFilter(levelFilter === 'Medium' ? null : 'Medium')}
              className={`p-2 rounded-lg transition-colors ${
                levelFilter === 'Medium' ? 'bg-orange-100 border-2 border-orange-300' : 'hover:bg-orange-50'
              }`}
            >
              <div className={`text-lg font-semibold ${levelFilter === 'Medium' ? 'text-orange-700' : 'text-orange-600'}`}>
                {filteredItems.filter(item => item.level >= 40 && item.level < 70).length}
              </div>
              <div className="text-xs text-gray-600">Medium Level</div>
            </button>
            <button
              onClick={() => setLevelFilter(levelFilter === 'Low' ? null : 'Low')}
              className={`p-2 rounded-lg transition-colors ${
                levelFilter === 'Low' ? 'bg-red-100 border-2 border-red-300' : 'hover:bg-red-50'
              }`}
            >
              <div className={`text-lg font-semibold ${levelFilter === 'Low' ? 'text-red-700' : 'text-red-600'}`}>
                {filteredItems.filter(item => item.level < 40).length}
              </div>
              <div className="text-xs text-gray-600">Low Level</div>
            </button>
          </div>
        </div>

        {/* Inventory List */}
        <div className="space-y-3">
          {filteredItems.map((item) => (
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
                  rows={3}
                  placeholder="Add notes about condition, spillage, etc..."
                  maxLength={500}
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