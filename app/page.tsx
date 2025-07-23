
'use client';

import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Link from 'next/link';

export default function Home() {
  const shortcuts = [
    {
      title: 'View Galleys',
      icon: 'ri-map-2-fill',
      href: '/galley',
      color: 'bg-blue-500',
      description: 'Interactive galley maps & carts'
    },
    {
      title: 'Common Items',
      icon: 'ri-star-fill',
      href: '/items?filter=common',
      color: 'bg-orange-500',
      description: 'Frequently used items'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-16 pb-20 px-4">
        {/* Search Section */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Flight Search</h2>
          <div className="space-y-4">
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="ri-flight-takeoff-line text-gray-400"></i>
              </div>
              <input
                type="text"
                placeholder="Enter flight number (e.g., AA123)"
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <button className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium !rounded-button">
              Load Flight Data
            </button>
          </div>
        </div>

        {/* Item Lookup */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Quick Item Lookup</h2>
          <div className="relative">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <i className="ri-search-line text-gray-400"></i>
            </div>
            <input
              type="text"
              placeholder="Search items (e.g., Coffee Pot)"
              className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>
        </div>

        {/* Quick Actions */}
        <div className="px-4 mb-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link
              href="/galley"
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-blue-100 rounded-xl flex items-center justify-center mb-3">
                <i className="ri-map-line text-blue-600 text-xl"></i>
              </div>
              <h3 className="font-semibold mb-1">Galley Map</h3>
              <p className="text-sm text-gray-600">Interactive maps & cart details</p>
            </Link>

            <Link
              href="/items?filter=common"
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-orange-100 rounded-xl flex items-center justify-center mb-3">
                <i className="ri-star-line text-orange-600 text-xl"></i>
              </div>
              <h3 className="font-semibold mb-1">Common Items</h3>
              <p className="text-sm text-gray-600">Frequently used items</p>
            </Link>

            <Link
              href="/issues"
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-red-100 rounded-xl flex items-center justify-center mb-3">
                <i className="ri-error-warning-line text-red-600 text-xl"></i>
              </div>
              <h3 className="font-semibold mb-1">Report Issues</h3>
              <p className="text-sm text-gray-600">Log problems & misplacements</p>
            </Link>

            <Link
              href="/inventory"
              className="bg-white rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
            >
              <div className="w-12 h-12 bg-purple-100 rounded-xl flex items-center justify-center mb-3">
                <i className="ri-file-list-line text-purple-600 text-xl"></i>
              </div>
              <h3 className="font-semibold mb-1">Inventory</h3>
              <p className="text-sm text-gray-600">Post-flight alcohol checklist</p>
            </Link>
          </div>
        </div>

        {/* Shortcuts */}
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4 px-2">Quick Access</h2>
          <div className="grid grid-cols-1 gap-4">
            {shortcuts.map((shortcut, index) => (
              <Link
                key={index}
                href={shortcut.href}
                className="bg-white rounded-xl p-4 shadow-sm flex items-center space-x-4 hover:shadow-md transition-shadow"
              >
                <div className={`w-12 h-12 ${shortcut.color} rounded-lg flex items-center justify-center`}>
                  <i className={`${shortcut.icon} text-white text-xl`}></i>
                </div>
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-900">{shortcut.title}</h3>
                  <p className="text-sm text-gray-600">{shortcut.description}</p>
                </div>
                <i className="ri-arrow-right-s-line text-gray-400 text-xl"></i>
              </Link>
            ))}
          </div>
        </div>

        {/* Current Status */}
        <div className="bg-white rounded-xl p-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Current Flight Status</h2>
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Flight</span>
              <span className="font-medium">AA123 (LAX → JFK)</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Aircraft</span>
              <span className="font-medium">Boeing 777-300ER</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-gray-600">Galleys Loaded</span>
              <span className="flex items-center">
                <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                <span className="font-medium text-green-600">Complete</span>
              </span>
            </div>
          </div>
        </div>
      </div>

      <BottomNav />
    </div>
  );
}