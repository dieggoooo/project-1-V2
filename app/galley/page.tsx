
'use client';

import { useState, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '../../components/Header';
import BottomNav from '../../components/BottomNav';
import Link from 'next/link';

function GalleyMapContent() {
  const searchParams = useSearchParams();
  const highlightItem = searchParams.get('item');
  const [selectedGalley, setSelectedGalley] = useState('forward');
  const [selectedTrolley, setSelectedTrolley] = useState<any>(null);
  const [viewMode, setViewMode] = useState('front');

  const galleys = {
    forward: {
      name: 'Forward Galley',
      trolleys: [
        {
          id: '1F1',
          position: { top: '20%', left: '10%' },
          contents: ['Coffee Pot', 'Tea Service Set', 'Sugar Packets'],
          code: '1F1C03',
          cartType: 'Economy Snack Cart',
          cartDescription: 'Standard beverage and snack service for economy class passengers',
          sections: ['Beverages', 'Snacks', 'Ice', 'Cups', 'Napkins'],
          items: [
            { name: 'Coffee (Regular)', position: 'Thermos 1', quantity: '2L' },
            { name: 'Coffee (Decaf)', position: 'Thermos 2', quantity: '1L' },
            { name: 'Pretzels', position: 'Snack Bay A', quantity: 50 },
            { name: 'Cookies', position: 'Snack Bay B', quantity: 40 },
            { name: 'Plastic Cups', position: 'Cup Dispenser', quantity: 100 }
          ]
        },
        {
          id: '1F2',
          position: { top: '20%', right: '10%' },
          contents: ['Wine Glasses', 'Water Glasses', 'Napkins'],
          code: '1F2C05',
          cartType: 'Business Class Liquid Trolley',
          cartDescription: 'Premium beverage service with fine glassware and spirits',
          sections: ['Premium Wines', 'Spirits', 'Champagne', 'Mixers', 'Ice'],
          items: [
            { name: 'Dom Pérignon 2012', position: 'Top Shelf', quantity: 6 },
            { name: 'Johnnie Walker Blue', position: 'Middle Left', quantity: 2 },
            { name: 'Grey Goose Vodka', position: 'Middle Right', quantity: 2 },
            { name: 'Tonic Water', position: 'Bottom Left', quantity: 24 },
            { name: 'Club Soda', position: 'Bottom Right', quantity: 24 }
          ]
        },
        {
          id: '1F3',
          position: { top: '60%', left: '10%' },
          contents: ['Meal Trays', 'Cutlery', 'Salt & Pepper'],
          code: '1F3C02',
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
        },
        {
          id: '1F4',
          position: { top: '60%', right: '10%' },
          contents: ['Bread Baskets', 'Butter', 'Condiments'],
          code: '1F4C01',
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
    aft: {
      name: 'Aft Galley',
      trolleys: [
        {
          id: '2A1',
          position: { top: '25%', left: '15%' },
          contents: ['Champagne Flutes', 'Premium Spirits', 'Ice'],
          code: '2A1C02',
          cartType: 'Business Class Liquid Trolley',
          cartDescription: 'Premium spirits and champagne service for business class',
          sections: ['Premium Wines', 'Spirits', 'Champagne', 'Mixers', 'Ice'],
          items: [
            { name: 'Krug Grande Cuvée', position: 'Champagne Rack', quantity: 4 },
            { name: 'Hennessy XO', position: 'Premium Shelf', quantity: 1 },
            { name: 'Macallan 18', position: 'Whisky Section', quantity: 1 },
            { name: 'Premium Mixers', position: 'Mixer Bay', quantity: 12 },
            { name: 'Crystal Glassware', position: 'Glass Rack', quantity: 16 }
          ]
        },
        {
          id: '2A2',
          position: { top: '25%', right: '15%' },
          contents: ['Ice Bucket', 'Cocktail Mixers', 'Garnishes'],
          code: '2A2C01',
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
        },
        {
          id: '2A3',
          position: { top: '70%', left: '15%' },
          contents: ['Snack Items', 'Beverages', 'Cookies'],
          code: '2A3C04',
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
    }
  };

  const currentGalley = galleys[selectedGalley as keyof typeof galleys];

  const getCartTypeColor = (cartType: string) => {
  switch (cartType) {
    case 'Business Class Liquid Trolley': return 'bg-blue-500 border-blue-600';
    case 'First Class Meal Service': return 'bg-purple-500 border-purple-600';
    case 'Economy Snack Cart': return 'bg-green-500 border-green-600';
    default: return 'bg-gray-500 border-gray-600';
  }
};

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-16 pb-20">
        {/* Galley Selector */}
        <div className="px-4 py-4 bg-white border-b">
          <div className="flex bg-gray-100 rounded-lg p-1">
            <button
              onClick={() => setSelectedGalley('forward')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors !rounded-button ${
                selectedGalley === 'forward'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Forward Galley
            </button>
            <button
              onClick={() => setSelectedGalley('aft')}
              className={`flex-1 py-2 px-4 rounded-md text-sm font-medium transition-colors !rounded-button ${
                selectedGalley === 'aft'
                  ? 'bg-blue-600 text-white'
                  : 'text-gray-600 hover:text-gray-800'
              }`}
            >
              Aft Galley
            </button>
          </div>
        </div>

        {/* Galley Map */}
        <div className="px-4 py-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">{currentGalley.name}</h2>
              <p className="text-sm text-gray-600">Tap trolley slots to view cart configuration & details</p>
            </div>

            <div className="relative bg-gradient-to-b from-blue-50 to-blue-100 h-80">
              {/* Galley Structure */}
              <div className="absolute inset-4 border-2 border-dashed border-blue-300 rounded-lg">
                <div className="absolute inset-2 bg-white/50 rounded backdrop-blur-sm"></div>
              </div>

              {/* Trolley Positions */}
              {currentGalley.trolleys.map((trolley: any) => (
                <button
                  key={trolley.id}
                  onClick={() => setSelectedTrolley(trolley)}
                  className={`absolute w-12 h-12 rounded-lg border-2 flex items-center justify-center font-medium text-sm transition-all ${
                    highlightItem && trolley.contents.some((item) => item.includes('Coffee')) && highlightItem === '1'
                      ? 'bg-orange-500 border-orange-600 text-white animate-pulse'
                      : getCartTypeColor(trolley.cartType) + ' text-white hover:scale-105'
                  }`}
                  style={trolley.position}
                >
                  {trolley.id}
                </button>
              ))}
            </div>

            {/* Legend - Moved outside the map */}
            <div className="p-4 bg-gray-50 border-t">
              <div className="flex items-center justify-center space-x-6 text-xs">
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
              {['All', 'Beverages', 'Glassware', 'Service', 'Food'].map((category: any) => (
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

      {/* Enhanced Trolley Detail Modal with Cart Configuration */}
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

              {/* Current Contents Status */}
              <div className="p-6">
                <h3 className="font-medium text-gray-900 mb-3">Current Status</h3>
                <div className="space-y-2">
                  {selectedTrolley.contents.map((item: any, index: number) => (
                    <div
                      key={index}
                      className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                    >
                      <span className="font-medium">{item}</span>
                      <div className="flex items-center space-x-2">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        <span className="text-sm text-green-600">Stocked</span>
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
