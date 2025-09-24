/* eslint-disable @typescript-eslint/no-unused-vars */
'use client';

import { useState, useRef, useEffect } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Link from 'next/link';

interface FlightData {
  aircraftNumber: string;
  flightNumber: string;
  origin: string;
  destination: string;
}

interface DropdownOption {
  value: string;
  label: string;
  code?: string;
}

export default function Home() {
  const [flightData, setFlightData] = useState<FlightData>({
    aircraftNumber: '',
    flightNumber: '',
    origin: '',
    destination: ''
  });

  const [openDropdown, setOpenDropdown] = useState<string | null>(null);
  const [searchTerms, setSearchTerms] = useState({
    aircraftNumber: '',
    flightNumber: '',
    origin: '',
    destination: ''
  });

  // Sample data for dropdowns
  const aircraftOptions: DropdownOption[] = [
    { value: 'N123AA', label: 'Boeing 777-300ER (N123AA)', code: 'N123AA' },
    { value: 'N456AA', label: 'Boeing 737-800 (N456AA)', code: 'N456AA' },
    { value: 'N789AA', label: 'Airbus A321 (N789AA)', code: 'N789AA' },
    { value: 'N101AA', label: 'Boeing 787-8 (N101AA)', code: 'N101AA' },
    { value: 'N202AA', label: 'Boeing 777-200 (N202AA)', code: 'N202AA' }
  ];

  const flightOptions: DropdownOption[] = [
    { value: 'AA123', label: 'AA123 - American Airlines' },
    { value: 'AA456', label: 'AA456 - American Airlines' },
    { value: 'UA789', label: 'UA789 - United Airlines' },
    { value: 'DL101', label: 'DL101 - Delta Air Lines' },
    { value: 'SW202', label: 'SW202 - Southwest Airlines' }
  ];

  const airportOptions: DropdownOption[] = [
    { value: 'LAX', label: 'Los Angeles International (LAX)', code: 'LAX' },
    { value: 'JFK', label: 'John F. Kennedy International (JFK)', code: 'JFK' },
    { value: 'ORD', label: 'Chicago O\'Hare International (ORD)', code: 'ORD' },
    { value: 'DFW', label: 'Dallas/Fort Worth International (DFW)', code: 'DFW' },
    { value: 'ATL', label: 'Hartsfield-Jackson Atlanta International (ATL)', code: 'ATL' },
    { value: 'MIA', label: 'Miami International (MIA)', code: 'MIA' },
    { value: 'LAS', label: 'McCarran International Las Vegas (LAS)', code: 'LAS' },
    { value: 'SEA', label: 'Seattle-Tacoma International (SEA)', code: 'SEA' },
    { value: 'BOS', label: 'Logan International Boston (BOS)', code: 'BOS' },
    { value: 'SFO', label: 'San Francisco International (SFO)', code: 'SFO' }
  ];

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setOpenDropdown(null);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const getFilteredOptions = (field: keyof FlightData, options: DropdownOption[]) => {
    const searchTerm = searchTerms[field].toLowerCase();
    if (!searchTerm) return options;
    
    return options.filter(option => 
      option.label.toLowerCase().includes(searchTerm) ||
      option.value.toLowerCase().includes(searchTerm) ||
      (option.code && option.code.toLowerCase().includes(searchTerm))
    );
  };

  const handleInputChange = (field: keyof FlightData, value: string) => {
    setSearchTerms(prev => ({ ...prev, [field]: value }));
    setFlightData(prev => ({ ...prev, [field]: value }));
  };

  const handleOptionSelect = (field: keyof FlightData, option: DropdownOption) => {
    setFlightData(prev => ({ ...prev, [field]: option.value }));
    setSearchTerms(prev => ({ ...prev, [field]: option.value }));
    setOpenDropdown(null);
  };

  const handleFlightSearch = () => {
    console.log('Flight search data:', flightData);
    // Here you would typically make an API call to load flight data
    alert(`Loading flight data for:\nAircraft: ${flightData.aircraftNumber}\nFlight: ${flightData.flightNumber}\nRoute: ${flightData.origin} → ${flightData.destination}`);
  };

  const renderDropdown = (
    field: keyof FlightData,
    options: DropdownOption[],
    placeholder: string,
    icon: string
  ) => {
    const isOpen = openDropdown === field;
    const filteredOptions = getFilteredOptions(field, options);

    return (
      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <i className={`${icon} text-gray-400`}></i>
          </div>
          <input
            type="text"
            placeholder={placeholder}
            value={searchTerms[field]}
            onChange={(e) => handleInputChange(field, e.target.value)}
            onFocus={() => setOpenDropdown(field)}
            className="w-full pl-10 pr-10 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
            <i className={`ri-arrow-${isOpen ? 'up' : 'down'}-s-line text-gray-400 transition-transform`}></i>
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <button
                  key={option.value}
                  onClick={() => handleOptionSelect(field, option)}
                  className="w-full px-4 py-3 text-left hover:bg-gray-50 border-b border-gray-100 last:border-b-0 focus:bg-blue-50 focus:outline-none"
                >
                  <div className="font-medium text-gray-900">{option.value}</div>
                  <div className="text-sm text-gray-500">{option.label}</div>
                </button>
              ))
            ) : (
              <div className="px-4 py-3 text-gray-500 text-sm">
                No options found
              </div>
            )}
          </div>
        )}
      </div>
    );
  };



  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <div className="pt-16 pb-20 px-4">
        {/* Enhanced Flight Search Section */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Flight Search</h2>
          <div className="space-y-4">
            {/* Aircraft Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Aircraft Number
              </label>
              {renderDropdown('aircraftNumber', aircraftOptions, 'Select or type aircraft number', 'ri-plane-line')}
            </div>

            {/* Flight Number */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Flight Number
              </label>
              {renderDropdown('flightNumber', flightOptions, 'Select or type flight number', 'ri-ticket-2-line')}
            </div>

            {/* Origin and Destination - Side by side on larger screens */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Origin
                </label>
                {renderDropdown('origin', airportOptions, 'Select or type origin airport', 'ri-flight-takeoff-line')}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Destination
                </label>
                {renderDropdown('destination', airportOptions, 'Select or type destination airport', 'ri-flight-land-line')}
              </div>
            </div>

            {/* Search Button */}
            <button 
              onClick={handleFlightSearch}
              disabled={!flightData.aircraftNumber || !flightData.flightNumber || !flightData.origin || !flightData.destination}
              className="w-full bg-blue-600 text-white py-3 rounded-lg font-medium hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
            >
              Load Flight Data
            </button>

            {/* Flight Route Display */}
            {(flightData.origin || flightData.destination) && (
              <div className="mt-4 p-3 bg-blue-50 rounded-lg">
                <div className="flex items-center justify-center text-sm text-blue-700">
                  <span className="font-medium">{flightData.origin || '___'}</span>
                  <i className="ri-arrow-right-line mx-2"></i>
                  <span className="font-medium">{flightData.destination || '___'}</span>
                </div>
                {flightData.flightNumber && (
                  <div className="text-center text-xs text-blue-600 mt-1">
                    Flight: {flightData.flightNumber}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* Quick Item Lookup */}
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
        <div className="mb-6">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
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


      </div>

      <BottomNav />
    </div>
  );
}