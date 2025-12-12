/* eslint-disable @next/next/no-img-element */
'use client';
 
import { useState, Suspense, useMemo, useEffect } from 'react';
import React from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';
import Link from 'next/link';
// Import context AND types from the same file
import { useInventory, type InventoryItem, type Position } from '@/app/contexts/InventoryContext';
// Import design system utilities
import { getStockLevelClass, getStockLevelBg, getSortIcon } from '@/app/utils/styling';
 
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

interface SearchSuggestion {
  id: number;
  name: string;
  code: string;
  type: 'item' | 'category' | 'code';
  category?: string;
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
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [searchHistory, setSearchHistory] = useState<string[]>([]);
  const [sortBy, setSortBy] = useState<'name' | 'code' | 'availability' | 'category'>('name');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');
  
  // Ref for click outside detection
  const searchRef = React.useRef<HTMLDivElement>(null);
  
  // Use the unified inventory system
  const { items, updatePositionConsumption, getItemTotals } = useInventory();

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowSuggestions(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const categories: Category[] = [
    {
      id: 'beverages',
      name: 'Beverages',
      icon: 'ri-cup-line',
      color: 'bg-blue-100 text-blue-600',
      subcategories: [
        { id: 'alcoholic', name: 'Alcoholic', icon: 'ri-goblet-line' },
        { id: 'non-alcoholic', name: 'Non-Alcoholic', icon: 'ri-cup-line' },
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

  // Load search history from localStorage on component mount
  useEffect(() => {
    const savedHistory = localStorage.getItem('searchHistory');
    if (savedHistory) {
      setSearchHistory(JSON.parse(savedHistory));
    }
  }, []);

  // Generate search suggestions based on current input
  const searchSuggestions = useMemo(() => {
    if (!searchTerm || searchTerm.length < 2) return [];

    const suggestions: SearchSuggestion[] = [];
    const lowerSearchTerm = searchTerm.toLowerCase();

    // Search through items
    items.forEach((item) => {
      // Match by name
      if (item.name.toLowerCase().includes(lowerSearchTerm)) {
        suggestions.push({
          id: item.id,
          name: item.name,
          code: item.code,
          type: 'item',
          category: item.category
        });
      }
      // Match by code
      else if (item.code.toLowerCase().includes(lowerSearchTerm)) {
        suggestions.push({
          id: item.id,
          name: item.name,
          code: item.code,
          type: 'code',
          category: item.category
        });
      }
    });

    // Search through categories
    categories.forEach(category => {
      if (category.name.toLowerCase().includes(lowerSearchTerm)) {
        suggestions.push({
          id: 0,
          name: category.name,
          code: category.id,
          type: 'category'
        });
      }
    });

    return suggestions.slice(0, 8); // Limit to 8 suggestions
  }, [searchTerm, items]);

  // Enhanced filtering with search, category, and sorting
  const filteredAndSortedItems = useMemo(() => {
    const filtered = items.filter((item) => {
      const matchesSearch = !searchTerm || 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.code.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.type.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesFilter = filter === 'common' ? item.common : true;
      const matchesCategory = selectedCategory ? item.category === selectedCategory : true;
      const matchesSubcategory = selectedSubcategory ? item.subcategory === selectedSubcategory : true;
      
      return matchesSearch && matchesFilter && matchesCategory && matchesSubcategory;
    });

    // Sort the filtered results
    filtered.sort((a, b) => {
      let aValue: string | number;
      let bValue: string | number;
      
      switch (sortBy) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'code':
          aValue = a.code.toLowerCase();
          bValue = b.code.toLowerCase();
          break;
        case 'availability':
          aValue = getItemTotals(a.id).totalPercentage;
          bValue = getItemTotals(b.id).totalPercentage;
          break;
        case 'category':
          aValue = a.category.toLowerCase();
          bValue = b.category.toLowerCase();
          break;
        default:
          return 0;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [items, searchTerm, filter, selectedCategory, selectedSubcategory, sortBy, sortOrder, getItemTotals]);

  const handleSearch = (term: string) => {
    setSearchTerm(term);
    setShowSuggestions(false);
    
    // Add to search history if it's a meaningful search
    if (term.length > 2) {
      const newHistory = [term, ...searchHistory.filter(h => h !== term)].slice(0, 10);
      setSearchHistory(newHistory);
      localStorage.setItem('searchHistory', JSON.stringify(newHistory));
    }
  };

  const handleSuggestionClick = (suggestion: SearchSuggestion) => {
    if (suggestion.type === 'category') {
      setSelectedCategory(suggestion.code);
      setSearchTerm('');
    } else {
      handleSearch(suggestion.name);
    }
  };

  const clearSearch = () => {
    setSearchTerm('');
    setSelectedCategory(null);
    setSelectedSubcategory(null);
    setShowSuggestions(false);
  };

  const clearSearchHistory = () => {
    setSearchHistory([]);
    localStorage.removeItem('searchHistory');
  };

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

  const handleSort = (column: 'name' | 'code' | 'availability' | 'category') => {
    if (sortBy === column) {
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortBy(column);
      setSortOrder('asc');
    }
  };
 
  const handleCategorySelect = (categoryId: string) => {
    setSelectedCategory(categoryId);
    setSelectedSubcategory(null);
    setSearchTerm('');
  };
 
  const handleBack = () => {
    if (selectedSubcategory) {
      setSelectedSubcategory(null);
    } else if (selectedCategory) {
      setSelectedCategory(null);
    } else if (searchTerm) {
      setSearchTerm('');
      setShowSuggestions(false);
    }
  };
 
  const getCurrentCategory = () => categories.find(cat => cat.id === selectedCategory);
  const getCurrentSubcategory = () => getCurrentCategory()?.subcategories?.find(sub => sub.id === selectedSubcategory);
 
  if (!selectedCategory && !searchTerm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="page-container">
          <div className="section-spacing" ref={searchRef}>
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Search Items</h1>
            
            <div className="card-padded mb-4">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="ri-search-line text-gray-400"></i>
                </div>
                <input 
                  type="text" 
                  placeholder="Search by name, code, or description..." 
                  value={searchTerm} 
                  onChange={(e) => {
                    setSearchTerm(e.target.value);
                    setShowSuggestions(true);
                  }}
                  onFocus={() => setShowSuggestions(true)}
                  className="input input-icon pr-12"
                />
                {searchTerm && (
                  <button
                    onClick={clearSearch}
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                  >
                    <i className="ri-close-line text-gray-400 hover:text-gray-600"></i>
                  </button>
                )}
              </div>

              {showSuggestions && (
                <div className="dropdown">
                  {(() => {
                    const displayItems = searchTerm.length === 0 
                      ? items.map(item => ({
                          id: item.id,
                          name: item.name,
                          code: item.code,
                          type: 'item' as const,
                          category: item.category
                        }))
                      : searchSuggestions;

                    if (displayItems.length === 0) {
                      return (
                        <div className="p-8 text-center text-gray-500">
                          <i className="ri-search-line text-4xl mb-2 text-gray-300"></i>
                          <p className="font-medium">No items found</p>
                          <p className="text-sm mt-1">Try a different search term</p>
                        </div>
                      );
                    }

                    return (
                      <>
                        {searchTerm.length === 0 && (
                          <div className="px-4 py-2 bg-gray-50 border-b border-gray-200 sticky top-0">
                            <div className="flex items-center justify-between">
                              <span className="text-sm font-medium text-gray-700">
                                All Items ({displayItems.length})
                              </span>
                              <button
                                onClick={() => setShowSuggestions(false)}
                                className="text-sm text-blue-600 hover:text-blue-800"
                              >
                                Close
                              </button>
                            </div>
                          </div>
                        )}
                        {displayItems.map((suggestion, index) => {
                          const totals = suggestion.type !== 'category' ? getItemTotals(suggestion.id) : { totalPercentage: 0 };
                          const stockColor = totals.totalPercentage >= 70 ? 'text-green-600' :
                                           totals.totalPercentage >= 40 ? 'text-orange-600' : 'text-red-600';
                          
                          return (
                            <button
                              key={`${suggestion.type}-${suggestion.id}-${index}`}
                              onClick={() => handleSuggestionClick(suggestion)}
                              className="dropdown-item"
                            >
                              <div className="flex items-center justify-between">
                                <div className="flex items-center space-x-3 flex-1">
                                  <div className={`icon-circle icon-md flex-shrink-0 ${
                                    suggestion.type === 'category' ? 'bg-blue-100' : 
                                    suggestion.type === 'code' ? 'bg-purple-100' : 'bg-green-100'
                                  }`}>
                                    <i className={`${
                                      suggestion.type === 'category' ? 'ri-folder-line text-blue-600' :
                                      suggestion.type === 'code' ? 'ri-barcode-line text-purple-600' :
                                      'ri-box-3-line text-green-600'
                                    } text-lg`}></i>
                                  </div>
                                  <div className="flex-1 min-w-0">
                                    <div className="font-medium text-gray-900 truncate">{suggestion.name}</div>
                                    <div className="text-sm text-gray-500 font-mono">{suggestion.code}</div>
                                  </div>
                                </div>
                                {suggestion.type === 'item' && (
                                  <div className="flex items-center space-x-2 ml-3">
                                    <span className={`text-sm font-semibold ${stockColor}`}>
                                      {totals.totalPercentage}%
                                    </span>
                                    <i className="ri-arrow-right-s-line text-gray-400"></i>
                                  </div>
                                )}
                              </div>
                            </button>
                          );
                        })}
                      </>
                    );
                  })()}
                </div>
              )}

              {!showSuggestions && searchHistory.length > 0 && searchTerm.length === 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-sm font-medium text-gray-700">Recent Searches</span>
                    <button
                      onClick={clearSearchHistory}
                      className="text-xs text-blue-600 hover:text-blue-800"
                    >
                      Clear All
                    </button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {searchHistory.slice(0, 5).map((term, index) => (
                      <button
                        key={index}
                        onClick={() => handleSearch(term)}
                        className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-gray-200"
                      >
                        {term}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {filter === 'common' && (
              <div className="mb-4 flex items-center text-sm text-blue-600 bg-blue-50 rounded-lg p-3">
                <i className="ri-star-fill mr-2"></i>
                Showing common items only
              </div>
            )}
          </div>

          <div className="section-spacing">
            <h2 className="text-lg font-semibold mb-4">Browse by Category</h2>
            <div className="grid grid-cols-2 gap-4">
              {categories.map(category => (
                <div key={category.id} className="card-hover p-6" onClick={() => handleCategorySelect(category.id)}>
                  <div className="text-center">
                    <div className={`icon-circle icon-xl mx-auto mb-4 ${category.color}`}>
                      <i className={`${category.icon} text-2xl`}></i>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-1">{category.name}</h3>
                    <p className="text-sm text-gray-500">{items.filter((item) => item.category === category.id).length} items</p>
                  </div>
                </div>
              ))}
            </div>
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
        <div className="page-container">
          <div className="flex items-center mb-6">
            <button onClick={handleBack} className="btn-icon bg-white shadow-sm mr-3">
              <i className="ri-arrow-left-line text-gray-600"></i>
            </button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Beverages</h1>
              <p className="text-gray-600">Select beverage type</p>
            </div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            {category?.subcategories?.map(subcategory => (
              <div key={subcategory.id} className="card-hover p-6" onClick={() => setSelectedSubcategory(subcategory.id)}>
                <div className="text-center">
                  <div className="icon-circle icon-xl mx-auto mb-4 bg-blue-100">
                    <i className={`${subcategory.icon} text-2xl text-blue-600`}></i>
                  </div>
                  <h3 className="font-semibold text-gray-900 mb-1">{subcategory.name}</h3>
                  <p className="text-sm text-gray-500">{items.filter((item) => item.subcategory === subcategory.id).length} items</p>
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
      <div className="page-container">
        <div className="flex items-center mb-6">
          <button onClick={handleBack} className="btn-icon bg-white shadow-sm mr-3">
            <i className="ri-arrow-left-line text-gray-600"></i>
          </button>
          <div className="flex-1">
            <h1 className="text-2xl font-bold text-gray-900">
              {searchTerm ? `Search: "${searchTerm}"` : 
               selectedSubcategory ? getCurrentSubcategory()?.name : 
               getCurrentCategory()?.name}
            </h1>
            <p className="text-gray-600">{filteredAndSortedItems.length} items found</p>
          </div>
        </div>

        <div className="card-padded section-spacing">
          <div className="relative mb-4">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="ri-search-line text-gray-400"></i>
            </div>
            <input 
              type="text" 
              placeholder="Search items..." 
              value={searchTerm} 
              onChange={(e) => {
                setSearchTerm(e.target.value);
                setShowSuggestions(e.target.value.length > 1);
              }}
              onFocus={() => setShowSuggestions(searchTerm.length > 1)}
              className="input input-icon pr-12"
            />
            {searchTerm && (
              <button
                onClick={clearSearch}
                className="absolute inset-y-0 right-0 pr-3 flex items-center"
              >
                <i className="ri-close-line text-gray-400 hover:text-gray-600"></i>
              </button>
            )}
          </div>

          {/* UPDATED: Stacked sort buttons like inventory page */}
          <div className="space-y-2">
            <div className="text-sm font-medium text-gray-700">Sort by:</div>
            <div className="flex flex-wrap gap-2">
              {[
                { key: 'name', label: 'Name' },
                { key: 'code', label: 'Code' },
                { key: 'availability', label: 'Stock' },
                { key: 'category', label: 'Category' }
              ].map(({ key, label }) => (
                <button
                  key={key}
                  onClick={() => handleSort(key as 'name' | 'code' | 'availability' | 'category')}
                  className={`btn-sm flex items-center space-x-1 ${
                    sortBy === key
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <span>{label}</span>
                  <i className={`${getSortIcon(key, sortBy, sortOrder)} text-xs`}></i>
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="space-y-3">
          {filteredAndSortedItems.map((item) => {
            const totals = getItemTotals(item.id);
            return (
              <div key={`item-${item.id}`} className="card-interactive" onClick={() => setSelectedItem(item)}>
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
                      <span className={`badge ${getStockLevelClass(totals.totalPercentage)}`}>
                        {totals.totalAvailable}/{totals.totalQuantity} ({totals.totalPercentage}%)
                      </span>
                    </div>
                    {searchTerm && item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()) && (
                      <div className="text-xs text-gray-600 mt-1">
                        {item.description}
                      </div>
                    )}
                  </div>
                  <div className="flex items-center space-x-2">
                    <Link href={`/galley?item=${item.id}`} className="icon-circle icon-sm bg-blue-100">
                      <i className="ri-map-pin-line text-blue-600 text-sm"></i>
                    </Link>
                    <i className="ri-arrow-right-s-line text-gray-400"></i>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {filteredAndSortedItems.length === 0 && (
          <div className="text-center py-12">
            <div className="icon-circle icon-xl mx-auto mb-4 bg-gray-100">
              <i className="ri-search-line text-gray-400 text-2xl"></i>
            </div>
            <p className="text-gray-500 mb-2">No items found</p>
            {searchTerm && (
              <p className="text-sm text-gray-400">Try adjusting your search or browse by category</p>
            )}
          </div>
        )}
      </div>

      {selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <div>
                <h2 className="modal-title">{selectedItem.name}</h2>
                <p className="text-sm text-gray-600 font-mono">{selectedItem.code}</p>
              </div>
              <button onClick={() => setSelectedItem(null)} className="modal-close">
                <i className="ri-close-line text-gray-600"></i>
              </button>
            </div>
            
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
                    <div className="icon-circle icon-xl mx-auto mb-4 bg-gray-100">
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

            <div className="mb-6">
              <div className="flex items-center justify-between mb-3">
                <h3 className="font-medium text-gray-900">Position Breakdown</h3>
                <span className="text-xs text-gray-600">
                  Unit: {selectedItem.positions?.[0]?.unitOfMeasure || 'units'}
                </span>
              </div>
              <div className="table-container">
                <div className="table-header">
                  <div className="table-header-row grid-cols-5">
                    <div>Position</div>
                    <div className="text-center">QTY</div>
                    <div className="text-center">Consumed</div>
                    <div className="text-center">Available</div>
                    <div className="text-center">% Available</div>
                  </div>
                </div>

                <div className="divide-y divide-gray-200">
                  {selectedItem.positions && selectedItem.positions.map((position: Position) => (
                    <div 
                      key={`position-${position.id}`} 
                      className={`table-row grid-cols-5 ${getStockLevelBg(position.percentageAvailable)}`}
                    >
                      <div className="table-cell font-medium">{position.positionCode}</div>
                      <div className="table-cell-center">{position.quantity}</div>
                      <div className="text-center">
                        <input
                          type="number"
                          min="0"
                          max={position.quantity}
                          value={position.consumed}
                          onChange={(e) => {
                            const newConsumed = Math.min(position.quantity, Math.max(0, parseInt(e.target.value, 10) || 0));
                            updatePositionConsumption(selectedItem.id, position.id, newConsumed);
                          }}
                          className="w-16 px-2 py-1 border border-gray-300 rounded text-center text-sm focus:ring-1 focus:ring-blue-500 focus:border-blue-500"
                        />
                      </div>
                      <div className="table-cell-center font-medium">{position.available}</div>
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
            </div>

            {selectedItem.description && (
              <div className="mb-6">
                <h3 className="font-medium text-gray-900 mb-2">Description</h3>
                <p className="text-sm text-gray-700 bg-gray-50 rounded-lg p-3">{selectedItem.description}</p>
              </div>
            )}

            <div className="flex space-x-3">
              <Link href={`/galley?item=${selectedItem.id}`} className="btn-primary text-center" onClick={() => setSelectedItem(null)}>
                View on Map
              </Link>
              <Link 
                href={`/issues?item=${selectedItem.code}&name=${encodeURIComponent(selectedItem.name)}`} 
                className="btn-danger flex items-center justify-center space-x-2"
                onClick={() => setSelectedItem(null)}
              >
                <i className="ri-error-warning-line"></i>
                <span>Report Issue</span>
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