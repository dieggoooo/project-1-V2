'use client';
 
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import BottomNav from '../../components/BottomNav';
import Link from 'next/link';
import { useInventory } from '../contexts/InventoryContext';

// Define types locally since we're having import issues
interface Position {
  id: string;
  positionCode: string;
  quantity: number;
  consumed: number;
  available: number;
  percentageAvailable: number;
  unitOfMeasure: string;
  galleyName: string;
  trolleyName: string;
}

interface InventoryItem {
  id: number;
  name: string;
  code: string;
  category: string;
  subcategory?: string;
  type: string;
  common: boolean;
  description?: string;
  positions: Position[];
  checked?: boolean;
}
 
interface Subcategory {
  id: string;
  name: string;
  icon: string;
}
 
interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
  subcategories?: Subcategory[];
}

function ItemSearchContent() {
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
  const [itemImages, setItemImages] = useState<{ [key: number]: string }>({});
  const [uploadingImage, setUploadingImage] = useState<number | null>(null);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  
  // Use the unified inventory system
  const { 
    items = [], 
    updatePositionConsumption = () => {}, 
    getItemTotals = () => ({ totalQuantity: 0, totalConsumed: 0, totalAvailable: 0, totalPercentage: 0 })
  } = useInventory() || {};

  const categories: Category[] = [
    {
      id: 'beverages',
      name: 'Beverages',
      icon: 'ri-cup-line',
      color: 'bg-blue-100 text-blue-600',
      subcategories: [
        { id: 'alcoholic', name: 'Alcoholic', icon: 'ri-wine-glass-line' },
        { id: 'non-alcoholic', name: 'Non-Alcoholic', icon: 'ri-glass-line' },
        { id: 'hot-drinks', name: 'Hot Drinks', icon: 'ri-fire-line' },
        { id: 'juice', name: 'Juice', icon: 'ri-drop-line' },
        { id: 'soda', name: 'Soda', icon: 'ri-bubble-chart-line' },
        { id: 'water', name: 'Water', icon: 'ri-water-flash-line' }
      ]
    },
    {
      id: 'snacks',
      name: 'Snacks',
      icon: 'ri-cake-2-line',
      color: 'bg-orange-100 text-orange-600'
    },
    {
      id: 'meals',
      name: 'Meals',
      icon: 'ri-restaurant-line',
      color: 'bg-green-100 text-green-600'
    },
    {
      id: 'duty-free',
      name: 'Duty Free',
      icon: 'ri-shopping-bag-line',
      color: 'bg-purple-100 text-purple-600'
    },
    {
      id: 'other',
      name: 'Other',
      icon: 'ri-more-line',
      color: 'bg-gray-100 text-gray-600'
    }
  ];

  const handleImageUpload = (itemId: number, file: File) => {
    setUploadingImage(itemId);
    
    const reader = new FileReader();
    reader.onload = (e) => {
      const result = e.target?.result as string;
      setItemImages(prev => ({
        ...prev,
        [itemId]: result
      }));
      setUploadingImage(null);
    };
    reader.readAsDataURL(file);
  };

  const handleFileSelect = (itemId: number, event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      handleImageUpload(itemId, file);
    }
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

  const filteredItems = items.filter((item: InventoryItem) => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'common' ? item.common : true;
    const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
    const matchesSubcategory = selectedSubcategory ? item.subcategory === selectedSubcategory : true;
    return matchesSearch && matchesFilter && matchesCategory && matchesSubcategory;
  });
 
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);
  };
 
  const handleBack = () => {
    if (selectedSubcategory) {
      setSelectedSubcategory(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    }
  };
 
  const getCurrentCategory = () => categories.find(cat => cat.id === selectedCategory);
  const getCurrentSubcategory = () => getCurrentCategory()?.subcategories?.find(sub => sub.id === selectedSubcategory);
 
  if (!selectedCategory) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16 pb-20 px-4">
          <div className="mb-6">
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Browse Items</h1>
            <p className="text-gray-600">Select a category to view items</p>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {categories.map(category => (
              <div key={category.id} className="bg-white rounded-xl p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => handleCategorySelect(category.id)}>
                <div className="text-center">
                  <div className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${category.color}`}>
                    <i className={`${category.icon} text-2xl`}></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                  <p className="text-sm text-gray-500">{items.filter((item: InventoryItem) => item.category === category.id).length} items</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }
 
  if (selectedCategory === 'beverages' && !selectedSubcategory) {
    const category = getCurrentCategory();
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16 pb-20 px-4">
          <div className="flex items-center mb-6">
            <button onClick={handleBack} className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm mr-3">
              <i className="ri-arrow-left-line text-gray-600"></i>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Beverages</h1>
              <p className="text-gray-600">Select beverage type</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {category?.subcategories?.map(subcategory => (
              <div key={subcategory.id} className="bg-white rounded-xl p-6 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedSubcategory(subcategory.id)}>
                <div className="text-center">
                  <div className="w-16 h-16 mx-auto mb-4 bg-blue-100 rounded-full flex items-center justify-center">
                    <i className={`${subcategory.icon} text-2xl text-blue-600`}></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{subcategory.name}</h3>
                  <p className="text-sm text-gray-500">{items.filter((item: InventoryItem) => item.subcategory === subcategory.id).length} items</p>
                </div>
              </div>
            ))}
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }
 
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="pt-16 pb-20 px-4">
        <div className="flex items-center mb-6">
          <button onClick={handleBack} className="w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-sm mr-3">
            <i className="ri-arrow-left-line text-gray-600"></i>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{selectedSubcategory ? getCurrentSubcategory()?.name : getCurrentCategory()?.name}</h1>
            <p className="text-gray-600">{filteredItems.length} items available</p>
          </div>
        </div>
        <div className="bg-white rounded-xl p-4 mb-6 shadow-sm">
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="ri-search-line text-gray-400"></i>
            </div>
            <input type="text" placeholder="Search items..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent" />
          </div>
          {filter === 'common' && (
            <div className="mt-3 flex items-center text-sm text-blue-600">
              <i className="ri-star-fill mr-2"></i>
              Showing common items only
            </div>
          )}
        </div>
        <div className="space-y-3">
          {filteredItems.map((item: InventoryItem) => {
            const totals = getItemTotals(item.id);
            return (
              <div key={`item-${item.id}`} className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedItem(item)}>
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1">
                      <h3 className="font-semibold text-gray-900">{item.name}</h3>
                      {item.common && (
                        <div className="w-4 h-4 flex items-center justify-center">
                          <i className="ri-star-fill text-orange-500 text-sm"></i>
                        </div>
                      )}
                    </div>
                    <div className="flex items-center space-x-4 text-sm">
                      <span className="text-blue-600 font-medium">{item.code}</span>
                      <span className="text-gray-500">{item.positions?.length || 0} location{(item.positions?.length || 0) !== 1 ? 's' : ''}</span>
                      <span className={`font-medium px-2 py-1 rounded text-xs ${getStockLevelColor(totals.totalPercentage)}`}>
                        {totals.totalAvailable}/{totals.totalQuantity} ({totals.totalPercentage}%)
                      </span>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link href={`/galley?item=${item.id}`} className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <i className="ri-map-pin-line text-blue-600 text-sm"></i>
                    </Link>
                    <i className="ri-arrow-right-s-line text-gray-400"></i>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
        {filteredItems.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
              <i className="ri-search-line text-gray-400 text-2xl"></i>
            </div>
            <p className="text-gray-500">No items found</p>
          </div>
        )}
      </div>
      {selectedItem && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl p-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h2 className="text-xl font-semibold">{selectedItem.name}</h2>
                <p className="text-sm text-gray-600 font-mono">{selectedItem.code}</p>
              </div>
              <button onClick={() => setSelectedItem(null)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <i className="ri-close-line text-gray-600"></i>
              </button>
            </div>
            
            {/* Item Image Section */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Item Image</h3>
              <div className="bg-gray-50 rounded-lg p-4">
                {itemImages[selectedItem.id] ? (
                  <div className="relative">
                    <img 
                      src={itemImages[selectedItem.id]} 
                      alt={selectedItem.name}
                      className="w-full h-48 object-cover rounded-lg"
                    />
                    <button 
                      onClick={() => {
                        const newImages = { ...itemImages };
                        delete newImages[selectedItem.id];
                        setItemImages(newImages);
                      }}
                      className="absolute top-2 right-2 w-8 h-8 bg-red-500 text-white rounded-full flex items-center justify-center"
                    >
                      <i className="ri-delete-bin-line text-sm"></i>
                    </button>
                  </div>
                ) : (
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                    <div className="w-16 h-16 mx-auto mb-4 bg-gray-100 rounded-full flex items-center justify-center">
                      <i className="ri-image-line text-gray-400 text-2xl"></i>
                    </div>
                    <p className="text-gray-500 mb-3">No image uploaded</p>
                    <label className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer hover:bg-blue-700 transition-colors">
                      <i className="ri-upload-line mr-2"></i>
                      Upload Image
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => handleFileSelect(selectedItem.id, e)}
                        className="hidden"
                      />
                    </label>
                    {uploadingImage === selectedItem.id && (
                      <div className="mt-3 flex items-center justify-center text-sm text-gray-600">
                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                        Uploading...
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

            {/* Position Breakdown Table */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-900 mb-3">Position Breakdown</h3>
              <div className="bg-white border border-gray-200 rounded-lg overflow-hidden">
                {/* Table Header */}
                <div className="bg-gray-800 text-white">
                  <div className="grid grid-cols-6 gap-2 p-3 text-sm font-medium">
                    <div>Position</div>
                    <div className="text-center">QTY</div>
                    <div className="text-center">Unit of Measure</div>
                    <div className="text-center">Consumed</div>
                    <div className="text-center">Available</div>
                    <div className="text-center">% Available</div>
                  </div>
                </div>

                {/* Table Body */}
                <div className="divide-y divide-gray-200">
                  {selectedItem.positions && selectedItem.positions.map((position: Position) => (
                    <div 
                      key={`position-${position.id}`} 
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

            {/* Description */}
            {selectedItem.description && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{selectedItem.description}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3">
              <Link href={`/galley?item=${selectedItem.id}`} className="flex-1 bg-blue-600 text-white py-3 rounded-lg text-center font-medium" onClick={() => setSelectedItem(null)}>
                View on Map
              </Link>
              <Link href="/issues" className="px-6 py-3 border border-orange-200 bg-orange-50 text-orange-700 rounded-lg font-medium hover:bg-orange-100 transition-colors" onClick={() => setSelectedItem(null)}>
                Report Issue
              </Link>
            </div>
          </div>
        </div>
      )}
      <BottomNav />
    </div>
  );
}
 
export default function ItemsPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line text-2xl text-blue-600 animate-spin mb-2"></i>
          <p className="text-gray-600">Loading items...</p>
        </div>
      </div>
    }>
      <ItemSearchContent />
    </Suspense>
  );
}