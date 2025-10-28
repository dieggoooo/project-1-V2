'use client';

import { useState } from 'react';
import Header from '../../components/Header';
import BottomNav from '../../components/BottomNav';
import { useInventory } from '../contexts/InventoryContext';

export default function InventoryPage() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [bottleLevels, setBottleLevels] = useState<{ [key: string]: number[] }>({});
  const [showAddItemModal, setShowAddItemModal] = useState(false);
  
  // Use the unified inventory system
  const { items, toggleItemChecked, getItemTotals, updatePositionConsumption, addItem } = useInventory();

  // Form state for new item
  const [newItem, setNewItem] = useState({
    name: '',
    code: '',
    category: 'beverages',
    subcategory: '',
    type: 'Supplies',
    unitOfMeasure: 'units',
    quantity: 1,
    positionCode: '',
    galleyName: '',
    trolleyName: ''
  });

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

  // Check if item is alcohol
  const isAlcoholItem = (item: any) => {
    return item.subcategory === 'alcoholic' || 
           item.type === 'Champagne' || 
           item.type === 'Cognac' || 
           item.type === 'Whisky' || 
           item.type === 'Vodka' ||
           item.category === 'alcoholic';
  };

  // Initialize bottle levels for a position
  const initializeBottleLevels = (positionId: string, quantity: number, availablePercentage: number) => {
    if (!bottleLevels[positionId]) {
      const levels = Array(quantity).fill(availablePercentage);
      setBottleLevels(prev => ({ ...prev, [positionId]: levels }));
      return levels;
    }
    return bottleLevels[positionId];
  };

  // Update individual bottle level
  const updateBottleLevel = (positionId: string, bottleIndex: number, newLevel: number) => {
    setBottleLevels(prev => {
      const currentLevels = prev[positionId] || [];
      const updatedLevels = [...currentLevels];
      updatedLevels[bottleIndex] = newLevel;
      
      const averageLevel = Math.round(updatedLevels.reduce((sum, level) => sum + level, 0) / updatedLevels.length);
      
      if (selectedItem) {
        const position = selectedItem.positions.find((p: any) => p.id === positionId);
        if (position) {
          const consumed = Math.round((position.quantity * (100 - averageLevel)) / 100);
          updatePositionConsumption(selectedItem.id, positionId, consumed);
        }
      }
      
      return { ...prev, [positionId]: updatedLevels };
    });
  };

  // Set all bottles to same level
  const setAllBottles = (positionId: string, quantity: number, level: number) => {
    const levels = Array(quantity).fill(level);
    setBottleLevels(prev => ({ ...prev, [positionId]: levels }));
    
    if (selectedItem) {
      const position = selectedItem.positions.find((p: any) => p.id === positionId);
      if (position) {
        const consumed = Math.round((position.quantity * (100 - level)) / 100);
        updatePositionConsumption(selectedItem.id, positionId, consumed);
      }
    }
  };

  // Update position with percentage (for alcohol) or discrete count (for other items)
  const updatePositionLevel = (itemId: number, positionId: string, newValue: number, isPercentage: boolean = false) => {
    if (isPercentage) {
      const item = items.find(i => i.id === itemId);
      const position = item?.positions.find((p: any) => p.id === positionId);
      if (position) {
        const consumed = Math.round((position.quantity * (100 - newValue)) / 100);
        updatePositionConsumption(itemId, positionId, consumed);
      }
    } else {
      updatePositionConsumption(itemId, positionId, newValue);
    }
  };

  // Handle add item form submission
  const handleAddItem = () => {
    if (!newItem.name || !newItem.code || !newItem.positionCode) {
      alert('Please fill in all required fields');
      return;
    }

    addItem({
      name: newItem.name,
      code: newItem.code,
      category: newItem.category,
      subcategory: newItem.subcategory,
      type: newItem.type,
      quantity: newItem.quantity,
      unitOfMeasure: newItem.unitOfMeasure,
      positionCode: newItem.positionCode,
      galleyName: newItem.galleyName,
      trolleyName: newItem.trolleyName
    });

    // Reset form
    setNewItem({
      name: '',
      code: '',
      category: 'beverages',
      subcategory: '',
      type: 'Supplies',
      unitOfMeasure: 'units',
      quantity: 1,
      positionCode: '',
      galleyName: '',
      trolleyName: ''
    });

    setShowAddItemModal(false);
    alert('Item added successfully!');
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
            const isAlcohol = isAlcoholItem(item);
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
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                          {isAlcohol && (
                            <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                              <i className="ri-wine-glass-line mr-1"></i>
                              Alcohol
                            </span>
                          )}
                        </div>
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

                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => setSelectedItem(item)}
                        className="text-sm text-blue-600 hover:text-blue-800"
                      >
                        {isAlcohol ? 'Set Levels' : 'Update Level'}
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {/* Add Item Card */}
          <button
            onClick={() => setShowAddItemModal(true)}
            className="w-full bg-white rounded-xl p-6 shadow-sm border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-center justify-center space-x-3">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center group-hover:bg-blue-200 transition-colors">
                <i className="ri-add-line text-blue-600 text-2xl"></i>
              </div>
              <div className="text-left">
                <div className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">Add New Item</div>
                <div className="text-sm text-gray-600">Add an item to this inventory</div>
              </div>
            </div>
          </button>
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

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Add New Item</h2>
              <button
                onClick={() => setShowAddItemModal(false)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
              >
                <i className="ri-close-line text-gray-600"></i>
              </button>
            </div>

            <div className="space-y-4">
              {/* Item Name */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newItem.name}
                  onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                  placeholder="e.g., Premium Coffee Blend"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Item Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newItem.code}
                  onChange={(e) => setNewItem({ ...newItem, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., COF0001"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Category & Type */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Category
                  </label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="beverages">Beverages</option>
                    <option value="snacks">Snacks</option>
                    <option value="meals">Meals</option>
                    <option value="supplies">Supplies</option>
                    <option value="equipment">Equipment</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Type
                  </label>
                  <select
                    value={newItem.type}
                    onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="Supplies">Supplies</option>
                    <option value="Alcohol">Alcohol</option>
                    <option value="Champagne">Champagne</option>
                    <option value="Cognac">Cognac</option>
                    <option value="Whisky">Whisky</option>
                    <option value="Vodka">Vodka</option>
                    <option value="Drinks">Drinks</option>
                    <option value="Food">Food</option>
                    <option value="Equipment">Equipment</option>
                  </select>
                </div>
              </div>

              {/* Subcategory (optional for beverages) */}
              {newItem.category === 'beverages' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Subcategory (Optional)
                  </label>
                  <select
                    value={newItem.subcategory}
                    onChange={(e) => setNewItem({ ...newItem, subcategory: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="">None</option>
                    <option value="alcoholic">Alcoholic</option>
                    <option value="non-alcoholic">Non-Alcoholic</option>
                    <option value="hot-drinks">Hot Drinks</option>
                    <option value="juice">Juice</option>
                    <option value="soda">Soda</option>
                    <option value="water">Water</option>
                  </select>
                </div>
              )}

              {/* Quantity & Unit */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Quantity
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Unit of Measure
                  </label>
                  <select
                    value={newItem.unitOfMeasure}
                    onChange={(e) => setNewItem({ ...newItem, unitOfMeasure: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  >
                    <option value="bottles">Bottles</option>
                    <option value="cans">Cans</option>
                    <option value="bags">Bags</option>
                    <option value="boxes">Boxes</option>
                    <option value="servings">Servings</option>
                    <option value="units">Units</option>
                    <option value="pieces">Pieces</option>
                    <option value="packs">Packs</option>
                  </select>
                </div>
              </div>

              {/* Position Code */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newItem.positionCode}
                  onChange={(e) => setNewItem({ ...newItem, positionCode: e.target.value.toUpperCase() })}
                  placeholder="e.g., 1F1C01"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                />
              </div>

              {/* Galley & Trolley */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Galley Name
                  </label>
                  <input
                    type="text"
                    value={newItem.galleyName}
                    onChange={(e) => setNewItem({ ...newItem, galleyName: e.target.value })}
                    placeholder="e.g., Forward Galley"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Trolley Name
                  </label>
                  <input
                    type="text"
                    value={newItem.trolleyName}
                    onChange={(e) => setNewItem({ ...newItem, trolleyName: e.target.value })}
                    placeholder="e.g., Trolley 1/1"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-3 pt-4">
                <button
                  onClick={() => setShowAddItemModal(false)}
                  className="flex-1 border border-gray-300 text-gray-700 py-3 rounded-lg font-medium hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleAddItem}
                  className="flex-1 bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors"
                >
                  Add Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Level Update Modal - INDIVIDUAL BOTTLE CONTROLS */}
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="text-xl font-semibold">{selectedItem.name}</h2>
                  {isAlcoholItem(selectedItem) && (
                    <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full font-medium">
                      <i className="ri-wine-glass-line mr-1"></i>
                      Alcohol
                    </span>
                  )}
                </div>
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

            {/* Position Breakdown - INDIVIDUAL BOTTLE CONTROLS */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">
                  {isAlcoholItem(selectedItem) ? 'Individual Bottle Levels' : 'Update by Position'}
                </h3>
                <span className="text-xs text-gray-600">
                  Unit: {selectedItem.positions?.[0]?.unitOfMeasure || 'units'}
                </span>
              </div>
              
            {isAlcoholItem(selectedItem) ? (
                // Alcohol Items - Individual Bottle Sliders
                <div className="space-y-6">
                  {selectedItem.positions.map((position: any) => {
                    const currentLevels = initializeBottleLevels(
                      position.id, 
                      position.quantity, 
                      Math.round((position.available / position.quantity) * 100)
                    );
                    const averageLevel = Math.round(currentLevels.reduce((sum: number, level: number) => sum + level, 0) / currentLevels.length);
                    
                    return (
                      <div key={position.id} className={`p-4 border-2 rounded-lg ${getStockLevelBg(averageLevel)}`}>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="font-medium text-gray-900 text-lg">{position.positionCode}</div>
                            <div className="text-sm text-gray-600">{position.galleyName} - {position.trolleyName}</div>
                          </div>
                          <div className={`px-3 py-2 rounded-lg text-xl font-bold ${getStockLevelColor(averageLevel)}`}>
                            {averageLevel}%
                          </div>
                        </div>
                        
                        {/* Quick Set All Buttons */}
                        <div className="mb-4 flex space-x-2">
                          <button
                            onClick={() => setAllBottles(position.id, position.quantity, 0)}
                            className="flex-1 bg-red-100 text-red-700 py-2 px-3 rounded text-xs font-medium hover:bg-red-200 transition-colors"
                          >
                            All Empty
                          </button>
                          <button
                            onClick={() => setAllBottles(position.id, position.quantity, 50)}
                            className="flex-1 bg-orange-100 text-orange-700 py-2 px-3 rounded text-xs font-medium hover:bg-orange-200 transition-colors"
                          >
                            All Half
                          </button>
                          <button
                            onClick={() => setAllBottles(position.id, position.quantity, 75)}
                            className="flex-1 bg-yellow-100 text-yellow-700 py-2 px-3 rounded text-xs font-medium hover:bg-yellow-200 transition-colors"
                          >
                            All Mostly
                          </button>
                          <button
                            onClick={() => setAllBottles(position.id, position.quantity, 100)}
                            className="flex-1 bg-green-100 text-green-700 py-2 px-3 rounded text-xs font-medium hover:bg-green-200 transition-colors"
                          >
                            All Full
                          </button>
                        </div>

                        {/* Individual Bottle Sliders */}
                        <div className="space-y-3">
                          {Array.from({ length: position.quantity }).map((_, index) => {
                            const bottleLevel = currentLevels[index] || 100;
                            return (
                              <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <i className="ri-wine-bottle-line text-purple-600"></i>
                                    <span className="font-medium text-sm">Bottle {index + 1}</span>
                                  </div>
                                  <span className={`px-2 py-1 rounded text-xs font-bold ${getStockLevelColor(bottleLevel)}`}>
                                    {bottleLevel}%
                                  </span>
                                </div>
                                <input
                                  type="range"
                                  min="0"
                                  max="100"
                                  value={bottleLevel}
                                  onChange={(e) => updateBottleLevel(position.id, index, parseInt(e.target.value))}
                                  className="w-full h-2 rounded-lg appearance-none cursor-pointer"
                                  style={{
                                    background: `linear-gradient(to right, 
                                      #ef4444 0%, #ef4444 ${bottleLevel * 0.25}%, 
                                      #f59e0b ${bottleLevel * 0.25}%, #f59e0b ${bottleLevel * 0.50}%, 
                                      #eab308 ${bottleLevel * 0.50}%, #eab308 ${bottleLevel * 0.75}%, 
                                      #10b981 ${bottleLevel * 0.75}%, #10b981 ${bottleLevel}%,
                                      #e5e7eb ${bottleLevel}%, #e5e7eb 100%)`
                                  }}
                                />
                                <div className="flex justify-between text-xs text-gray-500 mt-1">
                                  <span>Empty</span>
                                  <span>Half</span>
                                  <span>Full</span>
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Position Summary */}
                        <div className="mt-4 grid grid-cols-3 gap-4 text-center text-sm bg-gray-50 p-3 rounded">
                          <div>
                            <div className="font-medium text-gray-900">{position.quantity}</div>
                            <div className="text-gray-600">Total Bottles</div>
                          </div>
                          <div>
                            <div className="font-medium text-blue-600">{position.available.toFixed(1)}</div>
                            <div className="text-gray-600">Equivalent Available</div>
                          </div>
                          <div>
                            <div className="font-medium text-orange-600">{position.consumed.toFixed(1)}</div>
                            <div className="text-gray-600">Equivalent Consumed</div>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              ) : (
                // Non-Alcohol Items - TABLE
                <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                  <div className="bg-gray-800 text-white">
                    <div className="grid grid-cols-5 gap-2 p-3 text-sm font-medium">
                      <div>Position</div>
                      <div className="text-center">QTY</div>
                      <div className="text-center">Used</div>
                      <div className="text-center">Avail</div>
                      <div className="text-center">%</div>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-gray-200">
                    {selectedItem.positions.map((position: any) => (
                      <div 
                        key={position.id} 
                        className={`grid grid-cols-5 gap-2 p-3 text-sm ${getStockLevelBg(position.percentageAvailable)}`}
                      >
                        <div className="font-medium text-gray-900">{position.positionCode}</div>
                        <div className="text-center text-gray-700">{position.quantity}</div>
                        <div className="text-center">
                          <input
                            type="number"
                            min="0"
                            max={position.quantity}
                            value={position.consumed}
                            onChange={(e) => {
                              const newConsumed = Math.min(position.quantity, Math.max(0, parseInt(e.target.value) || 0));
                              updatePositionLevel(selectedItem.id, position.id, newConsumed, false);
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
                          <div className="grid grid-cols-5 gap-2 p-3 text-sm font-bold">
                            <div className="text-gray-900">TOTAL</div>
                            <div className="text-center text-gray-900">{totals.totalQuantity}</div>
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
              )}
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