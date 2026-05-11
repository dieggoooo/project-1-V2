'use client';

import { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { authFetch } from '../utils/api';
import Header from '@/components/Header';
import BottomNav from '@/components/BottomNav';

interface LtxItem {
  code: string;
  itemType: string;
  description: string;
  description2: string;
  category: string;
  subCategory: string;
  barSource: string | null;
}

// Category letter → human-readable label
const CATEGORY_LABELS: Record<string, string> = {
  A: 'Alcoholic',
  B: 'Beverages',
  C: 'Catering',
  D: 'Duty Free',
  E: 'Equipment',
  F: 'Food',
  L: 'Liquids',
  M: 'Meals',
  R: 'Refreshments',
  S: 'Supplies',
  T: 'Trolleys & Equipment',
  W: 'Water',
};

const CATEGORY_COLORS: Record<string, string> = {
  A: 'bg-red-100 text-red-600',
  B: 'bg-blue-100 text-blue-600',
  C: 'bg-orange-100 text-orange-600',
  D: 'bg-purple-100 text-purple-600',
  E: 'bg-gray-100 text-gray-600',
  F: 'bg-green-100 text-green-600',
  L: 'bg-cyan-100 text-cyan-600',
  M: 'bg-yellow-100 text-yellow-600',
  R: 'bg-pink-100 text-pink-600',
  S: 'bg-indigo-100 text-indigo-600',
  T: 'bg-slate-100 text-slate-600',
  W: 'bg-teal-100 text-teal-600',
};

const CATEGORY_ICONS: Record<string, string> = {
  A: 'ri-goblet-line',
  B: 'ri-cup-line',
  C: 'ri-restaurant-line',
  D: 'ri-shopping-bag-line',
  E: 'ri-tools-line',
  F: 'ri-cake-2-line',
  L: 'ri-drop-line',
  M: 'ri-bowl-line',
  R: 'ri-bubble-chart-line',
  S: 'ri-box-3-line',
  T: 'ri-shopping-cart-line',
  W: 'ri-water-flash-line',
};

function getCategoryLabel(code: string) {
  return CATEGORY_LABELS[code.toUpperCase()] ?? code;
}
function getCategoryColor(code: string) {
  return CATEGORY_COLORS[code.toUpperCase()] ?? 'bg-gray-100 text-gray-600';
}
function getCategoryIcon(code: string) {
  return CATEGORY_ICONS[code.toUpperCase()] ?? 'ri-price-tag-3-line';
}

function ItemsContent() {
  const searchParams = useSearchParams();
  const [items, setItems] = useState<LtxItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState(searchParams.get('q') ?? '');
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [selectedItem, setSelectedItem] = useState<LtxItem | null>(null);
  const [sortBy, setSortBy] = useState<'description' | 'code' | 'category'>('description');
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('asc');

  useEffect(() => {
    authFetch('/api/logintelix/items')
      .then(r => r.json())
      .then(data => setItems(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setLoading(false));
  }, []);

  // Derive categories from real items
  const categories = useMemo(() => {
    const counts: Record<string, number> = {};
    items.forEach(item => {
      const cat = item.category?.toUpperCase() || 'OTHER';
      counts[cat] = (counts[cat] ?? 0) + 1;
    });
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .map(([code, count]) => ({ code, count }));
  }, [items]);

  const filteredItems = useMemo(() => {
    const q = searchTerm.toLowerCase();
    const filtered = items.filter(item => {
      const matchesSearch = !q ||
        item.description.toLowerCase().includes(q) ||
        item.description2.toLowerCase().includes(q) ||
        item.code.toLowerCase().includes(q);
      const matchesCategory = !selectedCategory || item.category?.toUpperCase() === selectedCategory;
      return matchesSearch && matchesCategory;
    });

    filtered.sort((a, b) => {
      let av = '', bv = '';
      if (sortBy === 'description') { av = a.description; bv = b.description; }
      else if (sortBy === 'code') { av = a.code; bv = b.code; }
      else { av = a.category; bv = b.category; }
      av = av.toLowerCase(); bv = bv.toLowerCase();
      if (av < bv) return sortOrder === 'asc' ? -1 : 1;
      if (av > bv) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return filtered;
  }, [items, searchTerm, selectedCategory, sortBy, sortOrder]);

  const handleSort = (col: 'description' | 'code' | 'category') => {
    if (sortBy === col) setSortOrder(o => o === 'asc' ? 'desc' : 'asc');
    else { setSortBy(col); setSortOrder('asc'); }
  };

  const sortIcon = (col: string) => {
    if (sortBy !== col) return 'ri-arrow-up-down-line';
    return sortOrder === 'asc' ? 'ri-arrow-up-line' : 'ri-arrow-down-line';
  };

  // Browse by category view
  if (!selectedCategory && !searchTerm) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="page-container">
          <div className="px-4 pt-4 pb-2">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">Items</h1>

            {/* Search bar */}
            <div className="relative mb-4">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="ri-search-line text-gray-400"></i>
              </div>
              <input
                type="text"
                placeholder="Search by name or code…"
                value={searchTerm}
                onChange={e => setSearchTerm(e.target.value)}
                className="input input-icon"
              />
            </div>
          </div>

          {loading ? (
            <div className="text-center py-16 text-gray-400">
              <i className="ri-loader-4-line text-2xl animate-spin block mb-2"></i>
              Loading items…
            </div>
          ) : (
            <div className="px-4 pb-6">
              <h2 className="text-lg font-semibold mb-3">Browse by Category</h2>
              <div className="grid grid-cols-2 gap-4">
                {categories.map(({ code, count }) => (
                  <button
                    key={code}
                    onClick={() => setSelectedCategory(code)}
                    className="card-hover p-5 text-center"
                  >
                    <div className={`icon-circle icon-xl mx-auto mb-3 ${getCategoryColor(code)}`}>
                      <i className={`${getCategoryIcon(code)} text-2xl`}></i>
                    </div>
                    <h3 className="font-semibold text-gray-900 mb-0.5">{getCategoryLabel(code)}</h3>
                    <p className="text-sm text-gray-500">{count} items</p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
        <BottomNav />
      </div>
    );
  }

  // Item list view
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="page-container">
        {/* Header */}
        <div className="px-4 pt-4 pb-2">
          <div className="flex items-center mb-4">
            <button
              onClick={() => { setSelectedCategory(null); setSearchTerm(''); }}
              className="btn-icon bg-white shadow-sm mr-3"
            >
              <i className="ri-arrow-left-line text-gray-600"></i>
            </button>
            <div className="flex-1">
              <h1 className="text-xl font-bold text-gray-900">
                {searchTerm ? `"${searchTerm}"` : getCategoryLabel(selectedCategory!)}
              </h1>
              <p className="text-sm text-gray-500">{filteredItems.length} items</p>
            </div>
          </div>

          {/* Search */}
          <div className="relative mb-3">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="ri-search-line text-gray-400"></i>
            </div>
            <input
              type="text"
              placeholder="Search items…"
              value={searchTerm}
              onChange={e => setSearchTerm(e.target.value)}
              className="input input-icon pr-10"
            />
            {searchTerm && (
              <button onClick={() => setSearchTerm('')} className="absolute inset-y-0 right-0 pr-3 flex items-center">
                <i className="ri-close-line text-gray-400"></i>
              </button>
            )}
          </div>

          {/* Sort */}
          <div className="flex gap-2 mb-3 flex-wrap">
            {(['description', 'code', 'category'] as const).map(col => (
              <button
                key={col}
                onClick={() => handleSort(col)}
                className={`btn-sm flex items-center space-x-1 ${sortBy === col ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-700'}`}
              >
                <span className="capitalize">{col === 'description' ? 'Name' : col.charAt(0).toUpperCase() + col.slice(1)}</span>
                <i className={`${sortIcon(col)} text-xs`}></i>
              </button>
            ))}
          </div>
        </div>

        {/* Item list */}
        <div className="px-4 pb-6 space-y-2">
          {filteredItems.map(item => (
            <button
              key={item.code}
              onClick={() => setSelectedItem(item)}
              className="card w-full text-left p-3 flex items-center justify-between"
            >
              <div className="flex items-center space-x-3 flex-1 min-w-0">
                <div className={`icon-circle icon-md flex-shrink-0 ${getCategoryColor(item.category)}`}>
                  <i className={`${getCategoryIcon(item.category)} text-sm`}></i>
                </div>
                <div className="min-w-0">
                  <div className="font-medium text-gray-900 truncate text-sm">{item.description}</div>
                  <div className="text-xs text-blue-600 font-mono">{item.code}</div>
                </div>
              </div>
              <i className="ri-arrow-right-s-line text-gray-400 flex-shrink-0"></i>
            </button>
          ))}

          {filteredItems.length === 0 && (
            <div className="text-center py-12 text-gray-400">
              <i className="ri-search-line text-3xl block mb-2"></i>
              <p className="text-sm">No items found</p>
            </div>
          )}
        </div>
      </div>

      {/* Item detail modal */}
      {selectedItem && (
        <div className="modal-overlay" onClick={() => setSelectedItem(null)}>
          <div className="modal-content" onClick={e => e.stopPropagation()}>
            <div className="modal-header">
              <div>
                <h2 className="modal-title">{selectedItem.description}</h2>
                <p className="text-sm text-gray-500 font-mono">{selectedItem.code}</p>
              </div>
              <button onClick={() => setSelectedItem(null)} className="modal-close">
                <i className="ri-close-line text-gray-600"></i>
              </button>
            </div>

            <div className="p-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Category</div>
                  <div className="font-medium text-sm">{getCategoryLabel(selectedItem.category)}</div>
                </div>
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Type</div>
                  <div className="font-medium text-sm">{selectedItem.itemType || '—'}</div>
                </div>
                {selectedItem.subCategory && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Subcategory</div>
                    <div className="font-medium text-sm">{selectedItem.subCategory}</div>
                  </div>
                )}
                {selectedItem.barSource && (
                  <div className="bg-gray-50 rounded-lg p-3">
                    <div className="text-xs text-gray-500 mb-1">Bar Source</div>
                    <div className="font-medium text-sm">{selectedItem.barSource}</div>
                  </div>
                )}
              </div>

              {selectedItem.description2 && selectedItem.description2 !== selectedItem.description && (
                <div className="bg-gray-50 rounded-lg p-3">
                  <div className="text-xs text-gray-500 mb-1">Description 2</div>
                  <div className="text-sm">{selectedItem.description2}</div>
                </div>
              )}
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
        <i className="ri-loader-4-line text-2xl text-blue-600 animate-spin"></i>
      </div>
    }>
      <ItemsContent />
    </Suspense>
  );
}
