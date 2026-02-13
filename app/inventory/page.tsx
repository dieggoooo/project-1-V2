'use client';

import { useState } from 'react';
import Link from 'next/link';
import Header from '../../components/Header';
import BottomNav from '../../components/BottomNav';
import { useInventory } from '../contexts/InventoryContext';
import {
  getStockLevelClass,
  getStockLevelBg,
  getProgressBarClass,
  isAlcoholItem,
  getStockLevelLabel
} from '../utils/styling';

export default function InventoryPage() {
  const [selectedFilter, setSelectedFilter] = useState('All');
  const [levelFilter, setLevelFilter] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [bottleLevels, setBottleLevels] = useState<{ [key: string]: number[] }>({});
  const [showAddItemModal, setShowAddItemModal] = useState(false);

  const { items, toggleItemChecked, getItemTotals, updatePositionConsumption, addItem } = useInventory();

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

  const uniqueItems = Array.from(
    new Map(items.map(item => [item.name, item])).values()
  );

  const handleItemSelection = (itemName: string) => {
    const selectedExistingItem = items.find(item => item.name === itemName);
    if (selectedExistingItem) {
      setNewItem({
        ...newItem,
        name: selectedExistingItem.name,
        code: selectedExistingItem.code,
        category: selectedExistingItem.category,
        subcategory: selectedExistingItem.subcategory || '',
        type: selectedExistingItem.type,
        unitOfMeasure: selectedExistingItem.positions[0]?.unitOfMeasure || 'units',
      });
    } else {
      setNewItem({
        ...newItem,
        name: itemName,
        code: '',
        category: 'beverages',
        subcategory: '',
        type: 'Supplies',
        unitOfMeasure: 'units',
      });
    }
  };

  const getBottleLevels = (positionId: string, quantity: number, availablePercentage: number) => {
    return bottleLevels[positionId] || Array(quantity).fill(availablePercentage);
  };

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

  const openItemModal = (item: any) => {
    const initialLevels: { [key: string]: number[] } = {};
    item.positions.forEach((position: any) => {
      const levelPercentage = position.quantity > 0
        ? Math.round((position.available / position.quantity) * 100)
        : 100;
      initialLevels[position.id] = Array(position.quantity).fill(levelPercentage);
    });
    setBottleLevels(initialLevels);
    setSelectedItem(item);
  };

  // FIXED: +/- buttons instead of number input to prevent iOS zoom
  const adjustConsumed = (positionId: string, currentConsumed: number, maxQuantity: number, delta: number) => {
    const newConsumed = Math.min(maxQuantity, Math.max(0, currentConsumed + delta));
    updatePositionConsumption(selectedItem.id, positionId, newConsumed);
    setSelectedItem((prev: any) => {
      if (!prev) return prev;
      return {
        ...prev,
        positions: prev.positions.map((p: any) =>
          p.id === positionId
            ? {
                ...p,
                consumed: newConsumed,
                available: p.quantity - newConsumed,
                percentageAvailable: p.quantity > 0
                  ? Math.round(((p.quantity - newConsumed) / p.quantity) * 100)
                  : 0
              }
            : p
        )
      };
    });
  };

  const handleAddItem = () => {
    if (newItem.name === '__custom__' || !newItem.name || !newItem.code || !newItem.positionCode) {
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
    const levelMatch = !levelFilter || getStockLevelLabel(totals.totalPercentage) === levelFilter;
    return typeMatch && levelMatch;
  });

  const completedItems = filteredItems.filter(item => item.checked).length;
  const progress = filteredItems.length > 0 ? (completedItems / filteredItems.length) * 100 : 0;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="page-container">
        <div className="section-spacing">
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Post-Flight Inventory</h1>
          <p className="text-gray-600">Check remaining levels for alcohol, equipment, and supplies</p>
        </div>

        {/* Filter Tabs */}
        <div className="card-padded section-spacing">
          <div className="flex flex-wrap gap-2">
            {['All', 'Alcohol', 'Equipment', 'Supplies', 'Glassware', 'Food', 'Drinks'].map((filter) => (
              <button
                key={filter}
                onClick={() => setSelectedFilter(filter)}
                className={`btn-sm ${
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
        <div className="card-padded section-spacing">
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
                {filteredItems.filter(item => getItemTotals(item.id).totalPercentage >= 70).length}
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
                  const t = getItemTotals(item.id);
                  return t.totalPercentage >= 40 && t.totalPercentage < 70;
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
                {filteredItems.filter(item => getItemTotals(item.id).totalPercentage < 40).length}
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
                className={`card-interactive ${item.checked ? 'bg-green-50 border border-green-200' : ''}`}
              >
                <div className="flex items-center space-x-4">
                  <button
                    onClick={() => toggleItemChecked(item.id)}
                    className={`w-6 h-6 rounded-full border-2 flex items-center justify-center ${
                      item.checked ? 'bg-green-500 border-green-500' : 'border-gray-300 hover:border-green-400'
                    }`}
                  >
                    {item.checked && <i className="ri-check-line text-white text-sm"></i>}
                  </button>

                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-semibold text-gray-900">{item.name}</h4>
                          {isAlcohol && (
                            <span className="badge bg-purple-100 text-purple-700">
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
                      <div className={`badge ${getStockLevelClass(totals.totalPercentage)}`}>
                        {totals.totalPercentage}%
                      </div>
                    </div>

                    <div className="w-full bg-gray-200 rounded-full h-2 mb-2">
                      <div
                        className={`h-2 rounded-full transition-all ${getProgressBarClass(totals.totalPercentage)}`}
                        style={{ width: `${totals.totalPercentage}%` }}
                      ></div>
                    </div>

                    <div className="flex items-center justify-end">
                      <button
                        onClick={() => openItemModal(item)}
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
            className="w-full card-padded border-2 border-dashed border-blue-300 hover:border-blue-500 hover:bg-blue-50 transition-all group"
          >
            <div className="flex items-center justify-center space-x-3">
              <div className="icon-circle icon-lg bg-blue-100 group-hover:bg-blue-200 transition-colors">
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
          <button className="btn-primary">Submit Inventory Report</button>
          <button className="btn-secondary">Save as Draft</button>
        </div>
      </div>

      {/* Add Item Modal */}
      {showAddItemModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h2 className="modal-title">Add New Item</h2>
              <button onClick={() => setShowAddItemModal(false)} className="modal-close">
                <i className="ri-close-line text-gray-600"></i>
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Name <span className="text-red-500">*</span>
                </label>
                <select value={newItem.name} onChange={(e) => handleItemSelection(e.target.value)} className="select">
                  <option value="">Select an item...</option>
                  {uniqueItems.map((item) => (
                    <option key={item.id} value={item.name}>{item.name}</option>
                  ))}
                  <option value="__custom__">+ Add Custom Item</option>
                </select>
                {newItem.name === '__custom__' && (
                  <input
                    type="text"
                    value=""
                    onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                    placeholder="Enter custom item name"
                    className="input mt-2"
                    autoFocus
                  />
                )}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Item Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newItem.code}
                  onChange={(e) => setNewItem({ ...newItem, code: e.target.value.toUpperCase() })}
                  placeholder="e.g., COF0001"
                  className={`input ${newItem.name !== '' && newItem.name !== '__custom__' ? 'input-disabled' : ''}`}
                  disabled={newItem.name !== '' && newItem.name !== '__custom__'}
                />
                {newItem.name !== '' && newItem.name !== '__custom__' && (
                  <p className="text-xs text-gray-500 mt-1">Auto-populated from selected item</p>
                )}
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                  <select
                    value={newItem.category}
                    onChange={(e) => setNewItem({ ...newItem, category: e.target.value })}
                    className={`select ${newItem.name !== '' && newItem.name !== '__custom__' ? 'input-disabled' : ''}`}
                    disabled={newItem.name !== '' && newItem.name !== '__custom__'}
                  >
                    <option value="beverages">Beverages</option>
                    <option value="snacks">Snacks</option>
                    <option value="meals">Meals</option>
                    <option value="supplies">Supplies</option>
                    <option value="equipment">Equipment</option>
                  </select>
                  {newItem.name !== '' && newItem.name !== '__custom__' && (
                    <p className="text-xs text-gray-500 mt-1">Auto-populated</p>
                  )}
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Type</label>
                  <select
                    value={newItem.type}
                    onChange={(e) => setNewItem({ ...newItem, type: e.target.value })}
                    className={`select ${newItem.name !== '' && newItem.name !== '__custom__' ? 'input-disabled' : ''}`}
                    disabled={newItem.name !== '' && newItem.name !== '__custom__'}
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
                  {newItem.name !== '' && newItem.name !== '__custom__' && (
                    <p className="text-xs text-gray-500 mt-1">Auto-populated</p>
                  )}
                </div>
              </div>

              {newItem.category === 'beverages' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Subcategory (Optional)</label>
                  <select
                    value={newItem.subcategory}
                    onChange={(e) => setNewItem({ ...newItem, subcategory: e.target.value })}
                    className={`select ${newItem.name !== '' && newItem.name !== '__custom__' ? 'input-disabled' : ''}`}
                    disabled={newItem.name !== '' && newItem.name !== '__custom__'}
                  >
                    <option value="">None</option>
                    <option value="alcoholic">Alcoholic</option>
                    <option value="non-alcoholic">Non-Alcoholic</option>
                    <option value="hot-drinks">Hot Drinks</option>
                    <option value="juice">Juice</option>
                    <option value="soda">Soda</option>
                    <option value="water">Water</option>
                  </select>
                  {newItem.name !== '' && newItem.name !== '__custom__' && (
                    <p className="text-xs text-gray-500 mt-1">Auto-populated</p>
                  )}
                </div>
              )}

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Quantity</label>
                  <input
                    type="number"
                    min="1"
                    value={newItem.quantity}
                    onChange={(e) => setNewItem({ ...newItem, quantity: parseInt(e.target.value) || 1 })}
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Unit of Measure</label>
                  <select
                    value={newItem.unitOfMeasure}
                    onChange={(e) => setNewItem({ ...newItem, unitOfMeasure: e.target.value })}
                    className={`select ${newItem.name !== '' && newItem.name !== '__custom__' ? 'input-disabled' : ''}`}
                    disabled={newItem.name !== '' && newItem.name !== '__custom__'}
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
                  {newItem.name !== '' && newItem.name !== '__custom__' && (
                    <p className="text-xs text-gray-500 mt-1">Auto-populated</p>
                  )}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Position Code <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  value={newItem.positionCode}
                  onChange={(e) => setNewItem({ ...newItem, positionCode: e.target.value.toUpperCase() })}
                  placeholder="e.g., 1F1C01"
                  className="input"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Galley Name</label>
                  <input
                    type="text"
                    value={newItem.galleyName}
                    onChange={(e) => setNewItem({ ...newItem, galleyName: e.target.value })}
                    placeholder="e.g., Forward Galley"
                    className="input"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Trolley Name</label>
                  <input
                    type="text"
                    value={newItem.trolleyName}
                    onChange={(e) => setNewItem({ ...newItem, trolleyName: e.target.value })}
                    placeholder="e.g., Trolley 1/1"
                    className="input"
                  />
                </div>
              </div>

              <div className="flex space-x-3 pt-4">
                <button onClick={() => setShowAddItemModal(false)} className="btn-secondary">Cancel</button>
                <button onClick={handleAddItem} className="btn-primary">Add Item</button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Level Update Modal */}
      {selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <div className="flex items-center space-x-2">
                  <h2 className="modal-title">{selectedItem.name}</h2>
                  {isAlcoholItem(selectedItem) && (
                    <span className="badge bg-purple-100 text-purple-700">
                      <i className="ri-wine-glass-line mr-1"></i>
                      Alcohol
                    </span>
                  )}
                </div>
                <p className="text-sm text-gray-600 font-mono">{selectedItem.code}</p>
              </div>
              <button onClick={() => setSelectedItem(null)} className="modal-close">
                <i className="ri-close-line text-gray-600"></i>
              </button>
            </div>

          {/* Current Level Display */}
          <div className="text-center mb-6">
             <div className="text-4xl font-bold text-blue-600 mb-2">
              {isAlcoholItem(selectedItem)
                ? (() => {
                const allLevels = selectedItem.positions.flatMap((position: any) =>
            bottleLevels[position.id] || Array(position.quantity).fill(
              position.quantity > 0 ? Math.round((position.available / position.quantity) * 100) : 100
            )
          );
          return allLevels.length > 0
            ? Math.round(allLevels.reduce((sum: number, l: number) => sum + l, 0) / allLevels.length)
            : 0;
        })()
      : getItemTotals(selectedItem.id).totalPercentage
    }%
  </div>
  <p className="text-gray-600">Overall Level</p>
</div>

            {/* Position Breakdown */}
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
                <div className="space-y-6">
                  {selectedItem.positions.map((position: any) => {
                    const currentLevels = getBottleLevels(
                      position.id,
                      position.quantity,
                      position.quantity > 0 ? Math.round((position.available / position.quantity) * 100) : 100
                    );
                    const averageLevel = Math.round(
                      currentLevels.reduce((sum: number, level: number) => sum + level, 0) / currentLevels.length
                    );

                    return (
                      <div key={position.id} className={`card-padded border-2 ${getStockLevelBg(averageLevel)}`}>
                        <div className="flex items-center justify-between mb-4">
                          <div>
                            <div className="font-medium text-gray-900 text-lg">{position.positionCode}</div>
                            <div className="text-sm text-gray-600">{position.galleyName} - {position.trolleyName}</div>
                          </div>
                          <div className={`badge text-xl font-bold ${getStockLevelClass(averageLevel)}`}>
                            {averageLevel}%
                          </div>
                        </div>

                        <div className="mb-4 flex space-x-2">
                          <button onClick={() => setAllBottles(position.id, position.quantity, 0)} className="btn-sm flex-1 bg-red-100 text-red-700 hover:bg-red-200">All Empty</button>
                          <button onClick={() => setAllBottles(position.id, position.quantity, 50)} className="btn-sm flex-1 bg-orange-100 text-orange-700 hover:bg-orange-200">All Half</button>
                          <button onClick={() => setAllBottles(position.id, position.quantity, 75)} className="btn-sm flex-1 bg-yellow-100 text-yellow-700 hover:bg-yellow-200">All Mostly</button>
                          <button onClick={() => setAllBottles(position.id, position.quantity, 100)} className="btn-sm flex-1 bg-green-100 text-green-700 hover:bg-green-200">All Full</button>
                        </div>

                        <div className="space-y-3">
                          {Array.from({ length: position.quantity }).map((_, index) => {
                            const bottleLevel = currentLevels[index] ?? 100;
                            return (
                              <div key={index} className="bg-white p-3 rounded-lg border border-gray-200">
                                <div className="flex items-center justify-between mb-2">
                                  <div className="flex items-center space-x-2">
                                    <i className="ri-wine-bottle-line text-purple-600"></i>
                                    <span className="font-medium text-sm">Bottle {index + 1}</span>
                                  </div>
                                  <span className={`badge ${getStockLevelClass(bottleLevel)}`}>{bottleLevel}%</span>
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
                /* FIXED: +/- buttons instead of number input - no keyboard, no zoom */
                <div className="table-container">
                  <div className="table-header">
                    <div className="table-header-row grid-cols-5">
                      <div>Position</div>
                      <div className="text-center">QTY</div>
                      <div className="text-center">Used</div>
                      <div className="text-center">Avail</div>
                      <div className="text-center">%</div>
                    </div>
                  </div>

                  <div>
                    {selectedItem.positions.map((position: any) => (
                      <div
                        key={position.id}
                        className={`table-row grid-cols-5 ${getStockLevelBg(position.percentageAvailable)}`}
                      >
                        <div className="table-cell">{position.positionCode}</div>
                        <div className="table-cell-center">{position.quantity}</div>
                        {/* FIXED: +/- stepper instead of input */}
                        <div className="flex items-center justify-center space-x-2">
                          <button
                            onClick={() => adjustConsumed(position.id, position.consumed, position.quantity, -1)}
                            className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold text-gray-700 text-lg leading-none"
                          >
                            −
                          </button>
                          <span className="w-6 text-center font-medium text-sm">{position.consumed}</span>
                          <button
                            onClick={() => adjustConsumed(position.id, position.consumed, position.quantity, 1)}
                            className="w-7 h-7 rounded-full bg-gray-200 hover:bg-gray-300 flex items-center justify-center font-bold text-gray-700 text-lg leading-none"
                          >
                            +
                          </button>
                        </div>
                        <div className="table-cell-center">{position.available}</div>
                        <div className="text-center">
                          <span className={`badge ${getStockLevelClass(position.percentageAvailable)}`}>
                            {position.percentageAvailable}%
                          </span>
                        </div>
                      </div>
                    ))}

                    {(() => {
                      const totals = getItemTotals(selectedItem.id);
                      return (
                        <div className="bg-gray-100 border-t-2 border-gray-300">
                          <div className="table-row grid-cols-5 font-bold">
                            <div className="table-cell">TOTAL</div>
                            <div className="table-cell-center">{totals.totalQuantity}</div>
                            <div className="table-cell-center">{totals.totalConsumed}</div>
                            <div className="table-cell-center">{totals.totalAvailable}</div>
                            <div className="text-center">
                              <span className={`badge ${getStockLevelClass(totals.totalPercentage)}`}>
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

            {/* Action Buttons */}
            <div className="flex space-x-3 mt-4">
              <Link
                href={`/issues?item=${selectedItem.code}&name=${encodeURIComponent(selectedItem.name)}`}
                className="btn-danger flex items-center justify-center space-x-2"
              >
                <i className="ri-error-warning-line"></i>
                <span>Report Issue</span>
              </Link>
              <button onClick={() => setSelectedItem(null)} className="btn-primary">
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