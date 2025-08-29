'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import BottomNav from '../../components/BottomNav';
import { useInventory } from '../contexts/InventoryContext';

export default function InventoryPage() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  
  // Use the unified inventory system
  const { items, toggleItemChecked, getItemTotals, updatePositionConsumption } = useInventory();

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

  const getStockLevelColor = (percentage: number) => {
    if (percentage === 0) return 'bg-red-100 text-red-800';
    if (percentage <= 25) return 'bg-orange-100 text-orange-800';
    if (percentage <= 50) return 'bg-yellow-100 text-yellow-800';
    return 'bg-green-100 text-green-800';
  };

  const getStockLevelBg = (percentage: number) => {
    if (percentage === 0) return 'bg-red-50';
    if (percentage <= 25) return 'bg-orange-50';
    if (percentage <= 50) return 'bg-yellow-50';
    return '';
  };

  const filteredItems = items.filter(item => {
    const totals = getItemTotals(item.id);
    const typeMatch = selectedFilter === 'All' || item.type === selectedFilter;
    const levelMatch = !levelFilter || getLevelCategory(totals.totalPercentage) === levelFilter;
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
                {filteredItems.filter(item => {
                  const totals = getItemTotals(item.id);
                  return totals.totalPercentage >= 70;
                }).length}
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
                {filteredItems.filter(item => {
                  const totals = getItemTotals(item.id);
                  return totals.totalPercentage >= 40 && totals.totalPercentage < 70;
                }).length}
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
                {filteredItems.filter(item => {
                  const totals = getItemTotals(item.id);
                  return totals.totalPercentage < 40;
                }).length}
              </div>
              <div className="text-xs text-gray-600">Low Level</div>
            </button>
          </div>
        </div>

        {/* Inventory List */}
        <div className="space-y-3">
          {filteredItems.map((item) => {
            const totals = getItemTotals(item.id);
            return (
              <div
                key={item.id}
                className={`bg-white rounded-xl p-4 shadow-sm transition-all ${
                  item.checked ? 'bg-green-50 border border-green-200' : ''
                }`}
              >
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => toggleItemChecked(item.id)}
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
                        <div className="flex items-center space-x-2 text-sm text-gray-600">
                          <span>{item.type}</span>
                          <span>•</span>
                          <span className="font-mono text-blue-600">{item.code}</span>
                          <span>•</span>
                          <span>{totals.totalQuantity} {item.positions[0]?.unitOfMeasure || 'units'}</span>
                        </div>
                      </div>
                      <div className={`px-2 py-1 rounded text-xs font-medium ${getLevelColor(totals.totalPercentage)}`}>
                        {totals.totalPercentage}%
                      </div>
                    </div>

                    {/* Level Bar */}
                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div 
                        className={`h-2 rounded-full transition-all ${getLevelBarColor(totals.totalPercentage)}`}
                        style={{ width: `${totals.totalPercentage}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">
                        {totals.totalAvailable} available of {totals.totalQuantity}
                        {item.positions.length > 1 && (
                          <span className="ml-2 text-blue-600">({item.positions.length} locations)</span>
                        )}
                      </span>
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        Update Level
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Action Buttons */}
        <div className="mt-8 space-y-3">
          <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium">
            Submit Inventory Report
          </button>
          <button className="w-full border border-gray-300 text-gray-700 py-3 rounded-lg font-medium">
            Save as Draft
          </button>
        </div>
      </div>

      {/* Level Update Modal */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">{selectedItem.name}</h2>
                <p className="text-sm text-gray-600 font-mono">{selectedItem.code}</p>
              </div>
              <button
                onClick={() => setSelectedItem(null)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <i className="ri-close-line text-gray-600"></i>
              </button>
            </div>
            
            {/* Current Level Display */}
            <div className="text-center mb-6">
              <div className="text-4xl font-bold text-blue-600 mb-2">
                {(() => {
                  const totals = getItemTotals(selectedItem.id);
                  return totals.totalPercentage;
                })()}%
              </div>
              <p className="text-gray-600">Overall Level</p>
            </div>

            {/* Position Breakdown Table */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Update by Position</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="bg-gray-800 text-white">
                  <div className="grid grid-cols-6 gap-2 p-3 text-sm font-medium">
                    <div>Position</div>
                    <div className="text-center">QTY</div>
                    <div className="text-center">Unit</div>
                    <div className="text-center">Consumed</div>
                    <div className="text-center">Available</div>
                    <div className="text-center">% Available</div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-200">
                  {selectedItem.positions.map((position: any) => (
                    <div 
                      key={position.id} 
                      className={`grid grid-cols-6 gap-2 p-3 text-sm ${getStockLevelBg(position.percentageAvailable)}`}
                    >
                      <div className="font-medium text-gray-900">{position.positionCode}</div>
                      <div className="text-center text-gray-700">{position.quantity}</div>
                      <div className="text-center text-gray-700">{position.unitOfMeasure}</div>
                      <div className="text-center">
                        <input
                          type="number"
                          min="0"
                          max={position.quantity}
                          value={position.consumed}
                          onChange={(e) => {
                            const newConsumed = Math.min(position.quantity, Math.max(0, parseInt(e.target.value) || 0));
                            updatePositionConsumption(selectedItem.id, position.id, newConsumed);
                          }}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="text-center font-medium text-gray-900">{position.available}</div>
                      <div className="text-center">
                        <span className={`px-2 py-1 rounded text-xs font-medium ${getStockLevelColor(position.percentageAvailable)}`}>
                          {position.percentageAvailable}%
                        </span>
                      </div>
                    </div>
                  ))}

                  {/* Totals Row */}
                  {(() => {
                    const totals = getItemTotals(selectedItem.id);
                    return (
                      <div className="bg-gray-100 border-t-2 border-gray-300">
                        <div className="grid grid-cols-6 gap-2 p-3 text-sm font-bold">
                          <div className="text-gray-900">TOTAL</div>
                          <div className="text-center text-gray-900">{totals.totalQuantity}</div>
                          <div className="text-center text-gray-700">-</div>
                          <div className="text-center text-gray-900">{totals.totalConsumed}</div>
                          <div className="text-center text-gray-900">{totals.totalAvailable}</div>
                          <div className="text-center">
                            <span className={`px-2 py-1 rounded text-xs font-bold ${getStockLevelColor(totals.totalPercentage)}`}>
                              {totals.totalPercentage}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })()}
                </div>
              </div>
            </div>

            <button
              onClick={() => setSelectedItem(null)}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium"
            >
              Save Changes
            </button>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}