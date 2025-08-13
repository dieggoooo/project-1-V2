
'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import BottomNav from '../../components/BottomNav';
import Link from 'next/link';

function GalleyMapContent() {
  const searchParams = useSearchParams();
  const highlightItem = searchParams.get('item');
  const [selectedGalley, setSelectedGalley] = useState<string | null>(null);
  const [selectedTrolley, setSelectedTrolley] = useState<any>(null);
  const [viewMode, setViewMode] = useState('front');

  // New 8-galley system based on aircraft layout
  const galleys = {
    '1F1C': {
      name: 'Galley 1F1C',
      position: { top: '45%', left: '10%' },
      description: 'Front Left Galley',
      trolleys: [
        {
          id: '1F1C-01',
          position: { top: '20%', left: '16%' },
          contents: ['Coffee Service', 'Tea Set', 'Sugar Packets'],
          code: '1F1C01',
          cartType: 'Economy Snack Cart',
          cartDescription: 'Standard beverage service for economy class',
          sections: ['Beverages', 'Snacks', 'Ice', 'Cups', 'Napkins'],
          items: [
            { name: 'Coffee (Regular)', position: 'Thermos 1', quantity: '2L' },
            { name: 'Coffee (Decaf)', position: 'Thermos 2', quantity: '1L' },
            { name: 'Pretzels', position: 'Snack Bay A', quantity: 50 },
            { name: 'Cookies', position: 'Snack Bay B', quantity: 40 },
            { name: 'Plastic Cups', position: 'Cup Dispenser', quantity: 100 }
          ]
        }
      ]
    },
    '0FCR': {
      name: 'Galley 0FCR',
      position: { top: '45%', left: '20%' },
      description: 'Front Right Galley',
      trolleys: [
        {
          id: '0FCR-01',
          position: { top: '10%', right: '5%' },
          contents: ['Wine Service', 'Premium Glassware', 'Napkins'],
          code: '0FCR01',
          cartType: 'Business Class Liquid Trolley',
          cartDescription: 'Premium beverage service with fine glassware',
          sections: ['Premium Wines', 'Spirits', 'Champagne', 'Mixers', 'Ice'],
          items: [
            { name: 'Dom Pérignon 2012', position: 'Top Shelf', quantity: 6 },
            { name: 'Johnnie Walker Blue', position: 'Middle Left', quantity: 2 },
            { name: 'Grey Goose Vodka', position: 'Middle Right', quantity: 2 },
            { name: 'Tonic Water', position: 'Bottom Left', quantity: 24 },
            { name: 'Club Soda', position: 'Bottom Right', quantity: 24 }
          ]
        }
      ]
    },
    '2A1C': {
      name: 'Galley 2A1C',
      position: { top: '45%', left: '40%' },
      description: 'Mid-Left Galley',
      trolleys: [
        {
          id: '2A1C-01',
          position: { top: '30%', left: '20%' },
          contents: ['Meal Service', 'Cutlery', 'Condiments'],
          code: '2A1C01',
          cartType: 'First Class Meal Service',
          cartDescription: 'Gourmet meal service with premium dining essentials',
          sections: ['Hot Meals', 'Cold Items', 'Condiments', 'Utensils', 'Linens'],
          items: [
            { name: 'Beef Wellington', position: 'Hot Compartment A', quantity: 8 },
            { name: 'Lobster Thermidor', position: 'Hot Compartment B', quantity: 6 },
            { name: 'Artisan Bread', position: 'Cold Section', quantity: 20 },
            { name: 'Fine China Plates', position: 'Utensil Bay', quantity: 16 },
            { name: 'Linen Napkins', position: 'Storage Bottom', quantity: 20 }
          ]
        }
      ]
    },
    '2A1R': {
      name: 'Galley 2A1R',
      position: { top: '30%', left: '50%' },
      description: 'Mid-Right Galley',
      trolleys: [
        {
          id: '2A1R-01',
          position: { top: '50%', right: '70%' },
          contents: ['Bread Service', 'Butter', 'Condiments'],
          code: '2A1R01',
          cartType: 'Economy Snack Cart',
          cartDescription: 'Basic meal accompaniments and condiments',
          sections: ['Bread Items', 'Condiments', 'Utensils', 'Napkins'],
          items: [
            { name: 'Dinner Rolls', position: 'Basket Top', quantity: 30 },
            { name: 'Butter Packets', position: 'Cold Storage', quantity: 50 },
            { name: 'Salt & Pepper', position: 'Condiment Bay', quantity: 20 },
            { name: 'Plastic Utensils', position: 'Utensil Drawer', quantity: 100 },
            { name: 'Paper Napkins', position: 'Dispenser', quantity: 200 }
          ]
        }
      ]
    },
    '4A1C-Top': {
      name: 'Galley 4A1C (Top)',
      position: { top: '55%', left: '70%' },
      description: 'Rear Top Galley',
      trolleys: [
        {
          id: '4A1C-Top-01',
          position: { top: '100%', left: '70%' },
          contents: ['Champagne Service', 'Premium Spirits', 'Ice'],
          code: '4A1C01',
          cartType: 'Business Class Liquid Trolley',
          cartDescription: 'Premium spirits and champagne service',
          sections: ['Premium Wines', 'Spirits', 'Champagne', 'Mixers', 'Ice'],
          items: [
            { name: 'Krug Grande Cuvée', position: 'Champagne Rack', quantity: 4 },
            { name: 'Hennessy XO', position: 'Premium Shelf', quantity: 1 },
            { name: 'Macallan 18', position: 'Whisky Section', quantity: 1 },
            { name: 'Premium Mixers', position: 'Mixer Bay', quantity: 12 },
            { name: 'Crystal Glassware', position: 'Glass Rack', quantity: 16 }
          ]
        }
      ]
    },
    '4F1C': {
      name: 'Galley 4F1C',
      position: { top: '45%', left: '75%' },
      description: 'Rear Left Galley',
      trolleys: [
        {
          id: '4F1C-01',
          position: { top: '90%', left: '60%' },
          contents: ['Cocktail Service', 'Mixers', 'Garnishes'],
          code: '4F1C01',
          cartType: 'Business Class Liquid Trolley',
          cartDescription: 'Cocktail preparation station with mixers and garnishes',
          sections: ['Mixers', 'Garnishes', 'Ice', 'Bar Tools', 'Glassware'],
          items: [
            { name: 'Fresh Lime Wedges', position: 'Garnish Tray', quantity: 50 },
            { name: 'Cocktail Olives', position: 'Garnish Jar', quantity: 100 },
            { name: 'Bar Tools Set', position: 'Tool Rack', quantity: 1 },
            { name: 'Ice Bucket', position: 'Center Section', quantity: 2 },
            { name: 'Martini Glasses', position: 'Glass Section', quantity: 12 }
          ]
        }
      ]
    },
    '4A1C-Right': {
      name: 'Galley 4A1C (Right)',
      position: { top: '55%', left: '80%' },
      description: 'Rear Right Galley',
      trolleys: [
        {
          id: '4A1C-Right-01',
          position: { top: '50%', right: '40%' },
          contents: ['Snack Service', 'Beverages', 'Cookies'],
          code: '4A1C02',
          cartType: 'Economy Snack Cart',
          cartDescription: 'Light refreshments and beverages for economy service',
          sections: ['Beverages', 'Snacks', 'Cookies', 'Cups', 'Napkins'],
          items: [
            { name: 'Mixed Nuts', position: 'Snack Compartment A', quantity: 40 },
            { name: 'Chocolate Cookies', position: 'Cookie Section', quantity: 60 },
            { name: 'Apple Juice', position: 'Beverage Cooler', quantity: 24 },
            { name: 'Orange Juice', position: 'Beverage Cooler', quantity: 24 },
            { name: 'Disposable Cups', position: 'Cup Stack', quantity: 150 }
          ]
        }
      ]
    },
    '4A1C-Bottom': {
      name: 'Galley 4A1C (Bottom)',
      position: { top: '65%', left: '75%' },
      description: 'Rear Bottom Galley',
      trolleys: [
        {
          id: '4A1C-Bottom-01',
          position: { top: '70%', left: '35%' },
          contents: ['Storage', 'Backup Items', 'Supplies'],
          code: '4A1C03',
          cartType: 'Storage Cart',
          cartDescription: 'Backup storage and supplies management',
          sections: ['Storage', 'Backup Items', 'Supplies', 'Cleaning', 'Maintenance'],
          items: [
            { name: 'Backup Beverages', position: 'Storage Bay A', quantity: 48 },
            { name: 'Emergency Supplies', position: 'Storage Bay B', quantity: 20 },
            { name: 'Cleaning Materials', position: 'Storage Bay C', quantity: 15 },
            { name: 'Paper Products', position: 'Storage Bay D', quantity: 200 },
            { name: 'Maintenance Tools', position: 'Tool Storage', quantity: 10 }
          ]
        }
      ]
    }
  };

  const getCartTypeColor = (cartType: string) => {
    switch (cartType) {
      case 'Business Class Liquid Trolley': return 'bg-blue-500 border-blue-600';
      case 'First Class Meal Service': return 'bg-purple-500 border-purple-600';
      case 'Economy Snack Cart': return 'bg-green-500 border-green-600';
      case 'Storage Cart': return 'bg-gray-500 border-gray-600';
      default: return 'bg-gray-500 border-gray-600';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-16 pb-20">
        {/* Aircraft Galley Map */}
        <div className="px-4 py-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Aircraft Galley Map</h2>
              <p className="text-sm text-gray-600">Tap galley sections to view trolley details</p>
            </div>

            {/* Aircraft Layout */}
            <div className="relative bg-gradient-to-b from-blue-50 to-blue-100 h-96 p-4">
              {/* Aircraft Outline */}
              <div className="absolute inset-4 border-2 border-gray-400 rounded-full bg-gray-200/30">
                <div className="absolute inset-2 bg-white/20 rounded-full"></div>
              </div>

              {/* Galley Sections */}
              {Object.entries(galleys).map(([code, galley]) => (
                <button
                  key={code}
                  onClick={() => setSelectedGalley(code)}
                  className={`absolute w-12 h-6 bg-blue-500 border-2 border-blue-600 rounded flex items-center justify-center font-medium text-white text-xs transition-all hover:scale-110 ${
                    selectedGalley === code ? 'ring-4 ring-blue-300' : ''
                  }`}
                  style={galley.position}
                >
                  G
                </button>
              ))}

              {/* Galley Labels */}
              <div className="absolute top-52 left-8 text-xs text-gray-600 font-medium text-center w-12">1F1C</div>
              <div className="absolute top-52 left-18 text-xs text-gray-600 font-medium text-center w-12">0FCR</div>
              <div className="absolute top-52 left-38 text-xs text-gray-600 font-medium text-center w-12">2A1C</div>
              <div className="absolute top-37 left-48 text-xs text-gray-600 font-medium text-center w-12">2A1R</div>
              <div className="absolute top-62 left-68 text-xs text-gray-600 font-medium text-center w-12">4A1C</div>
              <div className="absolute top-52 left-73 text-xs text-gray-600 font-medium text-center w-12">4F1C</div>
              <div className="absolute top-62 left-78 text-xs text-gray-600 font-medium text-center w-12">4A1C</div>
              <div className="absolute top-72 left-73 text-xs text-gray-600 font-medium text-center w-12">4A1C</div>

              {/* Aircraft Labels */}
              <div className="absolute top-1/2 left-2 transform -translate-y-1/2 text-xs text-gray-600 font-medium">
                FRONT
              </div>
              <div className="absolute top-1/2 right-2 transform -translate-y-1/2 text-xs text-gray-600 font-medium">
                REAR
              </div>
            </div>

            {/* Legend */}
            <div className="p-4 bg-gray-50 border-t">
              <div className="flex items-center justify-center space-x-6 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-red-500 rounded"></div>
                  <span>Galley Sections</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Business Class</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <span>First Class</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Economy</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Filter */}
        <div className="px-4 mb-4">
          <div className="bg-white rounded-xl p-4 shadow-sm">
            <h3 className="font-medium mb-3">Filter by Category</h3>
            <div className="flex flex-wrap gap-2">
              {['All', 'Beverages', 'Glassware', 'Service', 'Food', 'Storage'].map((category: any) => (
                <button
                  key={category}
                  className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm hover:bg-blue-100 hover:text-blue-700 !rounded-button"
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Quick Report Issue */}
        <div className="px-4 mb-4">
          <Link
            href="/issues"
            className="block bg-orange-50 border border-orange-200 rounded-xl p-4 hover:bg-orange-100 transition-colors"
          >
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <i className="ri-error-warning-line text-orange-600"></i>
              </div>
              <div>
                <h3 className="font-medium text-orange-900">Report Issue</h3>
                <p className="text-sm text-orange-700">Log misplacements or problems</p>
              </div>
              <i className="ri-arrow-right-line text-orange-600 ml-auto"></i>
            </div>
          </Link>
        </div>
      </div>

      {/* Galley Detail Modal */}
      {selectedGalley && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">{galleys[selectedGalley as keyof typeof galleys].name}</h2>
                  <p className="text-sm text-gray-600">{galleys[selectedGalley as keyof typeof galleys].description}</p>
                </div>
                <button
                  onClick={() => setSelectedGalley(null)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                >
                  <i className="ri-close-line text-gray-600"></i>
                </button>
              </div>

              {/* Trolley List */}
              <div className="space-y-3">
                {galleys[selectedGalley as keyof typeof galleys].trolleys.map((trolley: any) => (
                  <button
                    key={trolley.id}
                    onClick={() => setSelectedTrolley(trolley)}
                    className="w-full p-4 border border-gray-200 rounded-lg text-left hover:bg-gray-50 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-gray-900">{trolley.cartType}</h3>
                        <p className="text-sm text-gray-600">{trolley.cartDescription}</p>
                      </div>
                      <i className="ri-arrow-right-s-line text-gray-400"></i>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Trolley Detail Modal */}
      {selectedTrolley && (
        <div className="fixed inset-0 bg-black/50 z-50 flex items-end">
          <div className="bg-white w-full rounded-t-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">Trolley {selectedTrolley.id}</h2>
                  <p className="text-sm text-gray-600">Position: {selectedTrolley.code}</p>
                </div>
                <button
                  onClick={() => setSelectedTrolley(null)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center"
                >
                  <i className="ri-close-line text-gray-600"></i>
                </button>
              </div>

              {/* Cart Type Badge */}
              <div className="mb-4">
                <div className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium ${getCartTypeColor(selectedTrolley.cartType)}`}>
                  <i className="ri-shopping-cart-line mr-2"></i>
                  {selectedTrolley.cartType}
                </div>
                <p className="text-sm text-gray-600 mt-2">{selectedTrolley.cartDescription}</p>
              </div>

              {/* View Mode Toggle */}
              <div className="flex bg-gray-100 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('front')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors !rounded-button ${
                    viewMode === 'front'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600'
                  }`}
                >
                  Front Loading
                </button>
                <button
                  onClick={() => setViewMode('rear')}
                  className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors !rounded-button ${
                    viewMode === 'rear'
                      ? 'bg-white text-gray-900 shadow-sm'
                      : 'text-gray-600'
                  }`}
                >
                  Rear Loading
                </button>
              </div>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
              {/* Cart Visual Configuration */}
              <div className="p-6 border-b">
                <div className="bg-gradient-to-b from-gray-50 to-gray-100 rounded-xl p-4 relative overflow-hidden">
                  <div className="text-center mb-4">
                    <h4 className="font-medium text-gray-900">
                      Cart Configuration - {viewMode === 'front' ? 'Front View' : 'Rear View'}
                    </h4>
                  </div>

                  {/* Cart Structure */}
                  <div className="relative bg-white border-2 border-gray-300 rounded-lg h-48 mx-auto max-w-xs">
                    {selectedTrolley.items.map((item: any, index: number) => (
                      <div
                        key={index}
                        className={`absolute w-16 h-8 bg-blue-100 border border-blue-300 rounded text-xs flex items-center justify-center font-medium transition-colors hover:bg-blue-200 ${
                          index === 0 ? 'top-2 left-1/2 transform -translate-x-1/2' :
                          index === 1 ? 'top-16 left-4' :
                          index === 2 ? 'top-16 right-4' :
                          index === 3 ? 'bottom-16 left-4' :
                          'bottom-16 right-4'
                        }`}
                      >
                        {index + 1}
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              {/* Cart Sections */}
              <div className="p-6 border-b">
                <h3 className="font-medium text-gray-900 mb-3">Cart Sections</h3>
                <div className="flex flex-wrap gap-2">
                  {selectedTrolley.sections.map((section: any, index: number) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-600 rounded text-xs"
                    >
                      {section}
                    </span>
                  ))}
                </div>
              </div>

              {/* Detailed Item Stack Configuration */}
              <div className="p-6 border-b">
                <h4 className="font-medium text-gray-900 mb-4">Detailed Item Configuration</h4>
                <div className="space-y-3">
                  {selectedTrolley.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-6 h-6 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center text-xs font-medium">
                          {index + 1}
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">{item.name}</h5>
                          <p className="text-xs text-gray-600">{item.position}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <span className="font-medium text-gray-900">{item.quantity}</span>
                        <p className="text-xs text-gray-600">units</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="p-6 pt-4 border-t space-y-3 bg-gray-50">
              <Link
                href="/issues"
                className="flex items-center justify-center w-full py-3 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors border border-orange-200"
              >
                <i className="ri-error-warning-line mr-2"></i>
                Report Issue with this Cart
              </Link>
            </div>
          </div>
        </div>
      )}

      <BottomNav />
    </div>
  );
}

export default function GalleyPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
          <div className="text-center">
            <i className="ri-loader-4-line text-2xl text-blue-600 animate-spin mb-2"></i>
            <p className="text-gray-600">Loading galley map...</p>
          </div>
        </div>
      }
    >
      <GalleyMapContent />
    </Suspense>
  );
}
