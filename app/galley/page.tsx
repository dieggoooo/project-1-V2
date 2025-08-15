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

  // All 8 galleys positioned to match the aircraft diagram
  const galleys = {
    '1F1C': {
      id: '1F1C',
      name: '1F1C - First Class Front Center',
      position: { top: '8%', left: '50%', transform: 'translateX(-50%)' },
      type: 'First Class',
      trolleys: [
        {
          id: '1F1C',
          position: { top: '30%', left: '50%' },
          contents: ['Premium Champagne', 'Fine Wines', 'Crystal Glassware'],
          code: '1F1C01',
          cartType: 'First Class Beverage Cart',
          sections: ['Premium Wines', 'Champagne', 'Spirits', 'Crystal'],
          items: [
            { name: 'Dom Pérignon', position: 'Top Shelf', quantity: 4 },
            { name: 'Cristal Champagne', position: 'Champagne Bay', quantity: 2 },
            { name: 'Crystal Flutes', position: 'Glass Rack', quantity: 12 }
          ]
        }
      ]
    },
    'OFCR': {
      id: 'OFCR',
      name: 'OFCR - First Class Office/Crew Rest',
      position: { top: '15%', left: '50%', transform: 'translateX(-50%)' },
      type: 'First Class',
      trolleys: [
        {
          id: 'OFCR',
          position: { top: '30%', right: '20%' },
          contents: ['Crew Meals', 'Office Supplies', 'Documentation'],
          code: 'OFCR01',
          cartType: 'Crew Service Cart',
          sections: ['Crew Meals', 'Supplies', 'Documentation', 'Storage'],
          items: [
            { name: 'Crew Meals', position: 'Hot Compartment', quantity: 8 },
            { name: 'Flight Documentation', position: 'File Section', quantity: 1 },
            { name: 'Office Supplies', position: 'Storage Bay', quantity: 10 }
          ]
        }
      ]
    },
    '2A1C': {
      id: '2A1C',
      name: '2A1C - Business Class Front Left',
      position: { top: '30%', left: '45%'  },
      type: 'Business Class',
      trolleys: [
        {
          id: '2A1C',
          position: { top: '40%', left: '15%' },
          contents: ['Premium Spirits', 'Wine Selection', 'Cocktail Tools'],
          code: '2A1C01',
          cartType: 'Business Class Liquid Trolley',
          sections: ['Spirits', 'Wines', 'Mixers', 'Tools'],
          items: [
            { name: 'Johnnie Walker Blue', position: 'Spirit Rack', quantity: 2 },
            { name: 'Premium Wine Selection', position: 'Wine Bay', quantity: 8 },
            { name: 'Cocktail Shaker', position: 'Tool Section', quantity: 1 }
          ]
        }
      ]
    },
    '2A1R': {
      id: '2A1R',
      name: '2A1R - Business Class Front Right',
      position: { top: '37%', right: '40%' },
      type: 'Business Class',
      trolleys: [
        {
          id: '2A1R',
          position: { top: '40%', right: '15%' },
          contents: ['Business Meals', 'Quality Cutlery', 'Fine China'],
          code: '2A1R01',
          cartType: 'Business Class Meal Service',
          sections: ['Hot Meals', 'Fine China', 'Cutlery', 'Linens'],
          items: [
            { name: 'Grilled Salmon', position: 'Hot Section A', quantity: 12 },
            { name: 'Chicken Teriyaki', position: 'Hot Section B', quantity: 10 },
            { name: 'Fine China', position: 'Plate Stack', quantity: 24 }
          ]
        }
      ]
    },

    '2A1R-rear': {
      id: '2A1R-rear',
      name: '2A1R - Economy Mid Right',
      position: { top: '83%', left: '44%', transform: 'translateY(-50%)' },
      type: 'Economy',
      trolleys: [
        {
          id: '2A1R-T1',
          position: { top: '70%', right: '15%' },
          contents: ['Soft Drinks', 'Juices', 'Water Bottles'],
          code: '2A1R02',
          cartType: 'Economy Beverage Cart',
          sections: ['Soft Drinks', 'Juices', 'Water', 'Ice'],
          items: [
            { name: 'Coca Cola', position: 'Soda Section', quantity: 48 },
            { name: 'Orange Juice', position: 'Juice Bay', quantity: 24 },
            { name: 'Bottled Water', position: 'Water Storage', quantity: 72 }
          ]
        }
      ]
    },
    '4A1C-left': {
      id: '4A1C-left',
      name: '4A1C - Aft Galley Left',
      position: { top: '88%', left: '37%', transform: 'translateX(-50%)' },
      type: 'Economy',
      trolleys: [
        {
          id: '4A1C-T1',
          position: { top: '90%', left: '20%' },
          contents: ['Economy Meals', 'Plastic Cutlery', 'Napkins'],
          code: '4A1C01',
          cartType: 'Economy Meal Service',
          sections: ['Meals', 'Cutlery', 'Napkins', 'Condiments'],
          items: [
            { name: 'Chicken Rice Bowl', position: 'Hot Compartment A', quantity: 45 },
            { name: 'Vegetable Pasta', position: 'Hot Compartment B', quantity: 30 },
            { name: 'Plastic Cutlery Sets', position: 'Utensil Storage', quantity: 100 }
          ]
        }
      ]
    },
    '4A1C-center': {
      id: '4A1C-center',
      name: '4A1C - Aft Center Galley',
      position: { top: '92%', left: '50%', transform: 'translateX(-50%)' },
      type: 'Economy',
      trolleys: [
        {
          id: '4A1C-CT1',
          position: { top: '88%', left: '40%' },
          contents: ['Snack Service', 'Cookies', 'Nuts'],
          code: '4A1C02',
          cartType: 'Economy Snack Cart',
          sections: ['Snacks', 'Cookies', 'Nuts', 'Crackers'],
          items: [
            { name: 'Mixed Nuts', position: 'Snack Bay A', quantity: 60 },
            { name: 'Cookies', position: 'Snack Bay B', quantity: 80 },
            { name: 'Crackers', position: 'Snack Bay C', quantity: 40 }
          ]
        },
        {
          id: '4A1C-CT2',
          position: { top: '88%', right: '40%' },
          contents: ['Coffee Service', 'Tea Bags', 'Sugar'],
          code: '4A1C03',
          cartType: 'Economy Hot Beverage Service',
          sections: ['Coffee', 'Tea', 'Sugar', 'Cups'],
          items: [
            { name: 'Regular Coffee', position: 'Coffee Station', quantity: '4L' },
            { name: 'Tea Bags', position: 'Tea Storage', quantity: 100 },
            { name: 'Paper Cups', position: 'Cup Dispenser', quantity: 150 }
          ]
        }
      ]
    },
    '4A1C-right': {
      id: '4A1C-right',
      name: '4A1C - Aft Galley Right',
      position: { top: '88%', right: '30%' },
      type: 'Economy',
      trolleys: [
        {
          id: '4A1C-RT1',
          position: { top: '90%', right: '20%' },
          contents: ['Waste Management', 'Recycling', 'Cleaning'],
          code: '4A1C04',
          cartType: 'Utility Cart',
          sections: ['Waste', 'Recycling', 'Cleaning', 'Maintenance'],
          items: [
            { name: 'Waste Bags', position: 'Waste Section', quantity: 50 },
            { name: 'Recycling Bags', position: 'Recycle Bay', quantity: 30 },
            { name: 'Sanitizing Wipes', position: 'Cleaning Storage', quantity: 20 }
          ]
        }
      ]
    }
  };

  const getGalleyTypeColor = (type: string) => {
    switch (type) {
      case 'First Class': return 'bg-purple-500 border-purple-600 text-white';
      case 'Business Class': return 'bg-blue-500 border-blue-600 text-white';
      case 'Economy': return 'bg-green-500 border-green-600 text-white';
      case 'Utility': return 'bg-gray-500 border-gray-600 text-white';
      default: return 'bg-gray-400 border-gray-500 text-white';
    }
  };

  const getCartTypeColor = (cartType: string) => {
    if (cartType.includes('First Class')) return 'bg-purple-500 border-purple-600';
    if (cartType.includes('Business Class')) return 'bg-blue-500 border-blue-600';
    if (cartType.includes('Economy')) return 'bg-green-500 border-green-600';
    if (cartType.includes('Utility')) return 'bg-gray-500 border-gray-600';
    return 'bg-gray-500 border-gray-600';
  };

  if (selectedGalley) {
    const galley = galleys[selectedGalley as keyof typeof galleys];
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="pt-16 pb-20">
          <div className="px-4 py-4 bg-white border-b">
            <div className="flex items-center mb-4">
              <button 
                onClick={() => setSelectedGalley(null)}
                className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center mr-3"
              >
                <i className="ri-arrow-left-line text-gray-600"></i>
              </button>
              <div>
                <h2 className="text-lg font-semibold">{galley.name}</h2>
                <p className="text-sm text-gray-600">Service Type: {galley.type}</p>
              </div>
            </div>
          </div>

          {/* Individual Galley Detail View */}
          <div className="px-4 py-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h3 className="font-semibold">Galley Layout</h3>
                <p className="text-sm text-gray-600">Tap trolleys for detailed information</p>
              </div>

              <div className="relative bg-gradient-to-b from-slate-100 to-slate-200 h-80">
                <div className="absolute inset-4 border-2 border-gray-300 rounded-lg bg-white/80">
                  {galley.trolleys.map((trolley: any) => (
                    <button
                      key={trolley.id}
                      onClick={() => setSelectedTrolley(trolley)}
                      className={`absolute w-16 h-10 rounded-lg border-2 flex items-center justify-center font-medium text-xs transition-all hover:scale-110 shadow-md ${
                        getCartTypeColor(trolley.cartType) + ' text-white'
                      }`}
                      style={trolley.position}
                    >
                      {trolley.id}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Trolley List */}
          <div className="px-4">
            <div className="bg-white rounded-xl shadow-sm p-4">
              <h3 className="font-semibold mb-4">Trolley Inventory</h3>
              <div className="space-y-3">
                {galley.trolleys.map((trolley: any) => (
                  <button
                    key={trolley.id}
                    onClick={() => setSelectedTrolley(trolley)}
                    className="w-full text-left p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors"
                  >
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{trolley.id} - {trolley.cartType}</h4>
                        <p className="text-sm text-gray-600">{trolley.contents.join(', ')}</p>
                      </div>
                      <i className="ri-arrow-right-s-line text-gray-400"></i>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="pt-16 pb-20">
        <div className="px-4 py-4 bg-white border-b">
          <h1 className="text-xl font-semibold">Aircraft Galley Map</h1>
          <p className="text-sm text-gray-600">8 galleys total - Tap any galley to explore</p>
        </div>

        {/* Full Aircraft Map */}
        <div className="px-4 py-6">
          <div className="bg-white rounded-xl shadow-sm overflow-hidden">
            <div className="p-4 border-b">
              <h2 className="text-lg font-semibold">Boeing 777-300ER Layout</h2>
              <p className="text-sm text-gray-600">Complete galley overview</p>
            </div>

            {/* Simplified Aircraft Body with Fixed Dimensions */}
            <div className="relative bg-gradient-to-b from-slate-100 to-slate-200 flex justify-center items-center py-8">
              {/* Fixed-size aircraft container */}
              <div className="relative" style={{ width: '400px', height: '600px' }}>
                {/* Aircraft fuselage - skinnier airplane shape */}
                <div className="absolute inset-0 bg-gradient-to-b from-gray-200 to-gray-300 border-4 border-gray-400 shadow-lg"
                     style={{ 
                       borderRadius: '200px 200px 50px 50px',
                       clipPath: 'ellipse(35% 50% at 50% 50%)'
                     }}>
                </div>

                {/* Aircraft wings - realistic airplane wing shape */}
                <div className="absolute top-1/2 -left-6 transform -translate-y-1/2">
                  <div className="w-14 h-24 bg-gray-400 border-2 border-gray-500"
                       style={{
                         clipPath: 'polygon(15% 45%, 100% 15%, 100% 25%, 95% 35%, 90% 50%, 95% 65%, 100% 75%, 100% 85%, 15% 55%)',
                         borderRadius: '2px'
                       }}>
                  </div>
                </div>
                <div className="absolute top-1/2 -right-6 transform -translate-y-1/2">
                  <div className="w-14 h-24 bg-gray-400 border-2 border-gray-500"
                       style={{
                         clipPath: 'polygon(85% 45%, 0% 15%, 0% 25%, 5% 35%, 10% 50%, 5% 65%, 0% 75%, 0% 85%, 85% 55%)',
                         borderRadius: '2px'
                       }}>
                  </div>
                </div>

                {/* Tail wings - vertical and horizontal stabilizers (elevators) */}
                <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-2">
                  {/* Vertical stabilizer (tail fin) */}
                  <div className="w-6 h-12 bg-gray-400 border-2 border-gray-500"
                       style={{
                         clipPath: 'polygon(50% 0%, 100% 100%, 0% 100%)',
                         borderRadius: '2px'
                       }}>
                  </div>
                  {/* Horizontal stabilizers (elevators) - more elevator-like shape */}
                  <div className="absolute top-8 left-1/2 transform -translate-x-1/2">
                    {/* Left elevator */}
                    <div className="absolute -left-8 w-8 h-2 bg-gray-400 border border-gray-500"
                         style={{
                           clipPath: 'polygon(0% 50%, 30% 0%, 100% 20%, 100% 80%, 30% 100%)',
                           borderRadius: '1px'
                         }}>
                    </div>
                    {/* Right elevator */}
                    <div className="absolute left-0 w-8 h-2 bg-gray-400 border border-gray-500"
                         style={{
                           clipPath: 'polygon(100% 50%, 70% 0%, 0% 20%, 0% 80%, 70% 100%)',
                           borderRadius: '1px'
                         }}>
                    </div>
                  </div>
                </div>

                {/* Nose indicator (small circle at front) */}
                <div className="absolute top-2 left-1/2 w-3 h-3 bg-gray-500 rounded-full transform -translate-x-1/2"></div>

                {/* Galleys positioned exactly as in the original */}
                {Object.values(galleys).map((galley: any) => (
                  <button
                    key={galley.id}
                    onClick={() => setSelectedGalley(galley.id)}
                    className={`absolute w-16 h-8 rounded-md border-2 flex items-center justify-center text-[10px] font-bold transition-all transform hover:scale-110 shadow-lg ${
                      getGalleyTypeColor(galley.type)
                    }`}
                    style={galley.position}
                  >
                    {galley.id}
                  </button>
                ))}

                {/* Directional indicator */}
                <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 flex items-center space-x-2 bg-white/90 px-3 py-1 rounded-full border border-gray-300">
                  <i className="ri-plane-line text-blue-600"></i>
                  <span className="text-xs font-medium text-gray-700">← AFT | FORWARD →</span>
                </div>
              </div>
            </div>

            {/* Legend */}
            <div className="p-4 bg-gray-50 border-t">
              <div className="flex items-center justify-center space-x-6 text-xs">
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-purple-500 rounded"></div>
                  <span>First Class</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-blue-500 rounded"></div>
                  <span>Business Class</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-green-500 rounded"></div>
                  <span>Economy</span>
                </div>
                <div className="flex items-center space-x-2">
                  <div className="w-3 h-3 bg-gray-500 rounded"></div>
                  <span>Utility</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Galley Summary Cards */}
        <div className="px-4 mb-4">
          <h3 className="font-semibold mb-4">Quick Access</h3>
          <div className="grid grid-cols-2 gap-3">
            {Object.values(galleys).map((galley: any) => (
              <button
                key={galley.id}
                onClick={() => setSelectedGalley(galley.id)}
                className="bg-white rounded-lg p-3 shadow-sm hover:shadow-md transition-shadow text-left"
              >
                <div className="flex items-center space-x-2 mb-2">
                  <div className={`w-3 h-3 rounded-full ${getGalleyTypeColor(galley.type).split(' ')[0]}`}></div>
                  <h4 className="font-medium text-sm">{galley.name}</h4>
                </div>
                <p className="text-xs text-gray-600">{galley.trolleys.length} trolley{galley.trolleys.length !== 1 ? 's' : ''}</p>
              </button>
            ))}
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
                <p className="text-sm text-orange-700">Log problems across all galleys</p>
              </div>
              <i className="ri-arrow-right-line text-orange-600 ml-auto"></i>
            </div>
          </Link>
        </div>
      </div>

      {/* Trolley Detail Modal */}
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

              <div className={`inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium ${getCartTypeColor(selectedTrolley.cartType)}`}>
                <i className="ri-shopping-cart-line mr-2"></i>
                {selectedTrolley.cartType}
              </div>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="p-6">
                <h3 className="font-medium text-gray-900 mb-3">Current Contents</h3>
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

                <h3 className="font-medium text-gray-900 mb-3 mt-6">Detailed Inventory</h3>
                <div className="space-y-3">
                  {selectedTrolley.items.map((item: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <h5 className="font-medium text-gray-900">{item.name}</h5>
                        <p className="text-xs text-gray-600">{item.position}</p>
                      </div>
                      <span className="font-medium text-gray-900">{item.quantity}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="p-6 pt-4 border-t bg-gray-50">
              <Link
                href="/issues"
                className="flex items-center justify-center w-full py-3 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors border border-orange-200"
                onClick={() => setSelectedTrolley(null)}
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