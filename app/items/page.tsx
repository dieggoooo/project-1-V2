'use client';
 
import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import BottomNav from '../../components/BottomNav';
import Link from 'next/link';
 
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
 
interface Item {
  id: number;
  name: string;
  location: string;
  trolley: string;
  galley: string;
  category: string;
  subcategory?: string;
  common: boolean;
}
 
function ItemSearchContent() {
  const searchParams = useSearchParams();
  const filter = searchParams.get('filter');
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedItem, setSelectedItem] = useState<Item | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedSubcategory, setSelectedSubcategory] = useState<string | null>(null);
 
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
 
  const items: Item[] = [
    { id: 1, name: 'Dom Pérignon 2012', location: '1F1C01', trolley: 'Trolley 1/1', galley: 'Forward Galley', category: 'beverages', subcategory: 'alcoholic', common: false },
    { id: 2, name: 'Hennessy Paradis', location: '1F1C02', trolley: 'Trolley 1/1', galley: 'Forward Galley', category: 'beverages', subcategory: 'alcoholic', common: false },
    { id: 3, name: 'Château Margaux 2015', location: '1F2C01', trolley: 'Trolley 2/3', galley: 'Forward Galley', category: 'beverages', subcategory: 'alcoholic', common: false },
    { id: 4, name: 'Kopi Luwak Coffee', location: '1F1C03', trolley: 'Trolley 1/1', galley: 'Forward Galley', category: 'beverages', subcategory: 'hot-drinks', common: true },
    { id: 5, name: 'Earl Grey Tea', location: '1F1C04', trolley: 'Trolley 1/1', galley: 'Forward Galley', category: 'beverages', subcategory: 'hot-drinks', common: true },
    { id: 6, name: 'Fresh Orange Juice', location: '2A1C01', trolley: 'Trolley 1/2', galley: 'Aft Galley', category: 'beverages', subcategory: 'juice', common: true },
    { id: 7, name: 'Apple Juice', location: '2A1C02', trolley: 'Trolley 1/2', galley: 'Aft Galley', category: 'beverages', subcategory: 'juice', common: true },
    { id: 8, name: 'Coca Cola', location: '2A2C01', trolley: 'Trolley 2/2', galley: 'Aft Galley', category: 'beverages', subcategory: 'soda', common: true },
    { id: 9, name: 'Sprite', location: '2A2C02', trolley: 'Trolley 2/2', galley: 'Aft Galley', category: 'beverages', subcategory: 'soda', common: true },
    { id: 10, name: 'Wagyu Beef Wellington', location: '1F3C01', trolley: 'Trolley 3/3', galley: 'Forward Galley', category: 'meals', common: false },
    { id: 11, name: 'Lobster Thermidor', location: '1F3C02', trolley: 'Trolley 3/3', galley: 'Forward Galley', category: 'meals', common: false },
    { id: 12, name: 'Chicken Teriyaki', location: '2A3C01', trolley: 'Trolley 3/2', galley: 'Aft Galley', category: 'meals', common: true },
    { id: 13, name: 'Macadamia Nuts', location: '1F4C01', trolley: 'Trolley 4/3', galley: 'Forward Galley', category: 'snacks', common: true },
    { id: 14, name: 'Godiva Chocolates', location: '1F4C02', trolley: 'Trolley 4/3', galley: 'Forward Galley', category: 'snacks', common: false },
    { id: 15, name: 'Chanel No. 5', location: '2A4C01', trolley: 'Trolley 4/2', galley: 'Aft Galley', category: 'duty-free', common: false },
    { id: 16, name: 'Rolex Submariner', location: '2A4C02', trolley: 'Trolley 4/2', galley: 'Aft Galley', category: 'duty-free', common: false }
  ];
 
  const filteredItems = items.filter(item => {
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
                  <p className="text-sm text-gray-500">{items.filter(item => item.category === category.id).length} items</p>
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
                  <p className="text-sm text-gray-500">{items.filter(item => item.subcategory === subcategory.id).length} items</p>
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
          {filteredItems.map(item => (
            <div key={item.id} className="bg-white rounded-xl p-4 shadow-sm cursor-pointer hover:shadow-md transition-shadow" onClick={() => setSelectedItem(item)}>
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
                    <span className="text-blue-600 font-medium">{item.location}</span>
                    <span className="text-gray-500">{item.trolley}</span>
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
          ))}
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
          <div className="bg-white w-full rounded-t-2xl p-6 max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold">{selectedItem.name}</h2>
              <button onClick={() => setSelectedItem(null)} className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                <i className="ri-close-line text-gray-600"></i>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h3 className="font-medium text-gray-900 mb-2">Location Details</h3>
                <div className="bg-gray-50 rounded-lg p-4 space-y-2">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Position Code:</span>
                    <span className="font-medium">{selectedItem.location}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Trolley:</span>
                    <span className="font-medium">{selectedItem.trolley}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600">Galley:</span>
                    <span className="font-medium">{selectedItem.galley}</span>
                  </div>
                </div>
              </div>
              <div className="flex space-x-3">
                <Link href={`/galley?item=${selectedItem.id}`} className="flex-1 bg-blue-600 text-white py-3 rounded-lg text-center font-medium !rounded-button" onClick={() => setSelectedItem(null)}>
                  View on Map
                </Link>
                <Link href="/issues" className="px-6 py-3 border border-orange-200 bg-orange-50 text-orange-700 rounded-lg font-medium !rounded-button hover:bg-orange-100 transition-colors" onClick={() => setSelectedItem(null)}>
                  Report Issue
                </Link>
              </div>
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
 