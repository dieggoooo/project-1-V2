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

  // Quick Item Lookup state
  const [selectedInventoryItem, setSelectedInventoryItem] = useState('');
  const [itemSearchTerm, setItemSearchTerm] = useState('');

  // Sample inventory items (these would come from your InventoryContext in production)
  const inventoryItems: DropdownOption[] = [
    { value: 'COF0407', label: 'BAG OF AMERICAN COFFEE (DECAF) 2.52KG FINE GRIND 70G', code: 'COF0407' },
    { value: 'CHA0001', label: 'Dom Pérignon 2012', code: 'CHA0001' },
    { value: 'SPR0001', label: 'Hennessy Paradis', code: 'SPR0001' },
    { value: 'WHI0001', label: 'Johnnie Walker Blue', code: 'WHI0001' },
    { value: 'VOD0001', label: 'Grey Goose Vodka', code: 'VOD0001' },
    { value: 'JUI0002', label: 'Fresh Orange Juice', code: 'JUI0002' },
    { value: 'SOD0001', label: 'Coca Cola', code: 'SOD0001' },
  ];

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
  const itemDropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node) &&
          itemDropdownRef.current && !itemDropdownRef.current.contains(event.target as Node)) {
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
    setOpenDropdown(field); // Open dropdown when typing
  };

  const handleOptionSelect = (field: keyof FlightData, option: DropdownOption) => {
    console.log('Option selected:', field, option.value); // Debug log
    // Update both the flight data and the search term to show the selected value
    setFlightData(prev => {
      const updated = { ...prev, [field]: option.value };
      console.log('Updated flightData:', updated); // Debug log
      return updated;
    });
    setSearchTerms(prev => {
      const updated = { ...prev, [field]: option.value };
      console.log('Updated searchTerms:', updated); // Debug log
      return updated;
    });
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
      <div className="relative">
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
          <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
            <i className={`ri-arrow-${isOpen ? 'up' : 'down'}-s-line text-gray-400 transition-transform`}></i>
          </div>
        </div>

        {isOpen && (
          <div className="absolute z-50 w-full bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-60 overflow-y-auto">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option, index) => (
                <button
                  key={`${field}-${option.value}-${index}`}
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    handleOptionSelect(field, option);
                  }}
                  type="button"
                  className="w-full px-4 py-3 text-left hover:bg-blue-50 border-b border-gray-100 last:border-b-0 focus:bg-blue-50 focus:outline-none transition-colors"
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
      
      <div className="pt-28 pb-20 px-4">
        {/* Enhanced Flight Search Section */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <div ref={dropdownRef}>
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
        </div>

        {/* Quick Item Lookup */}
        <div className="bg-white rounded-xl p-6 mb-6 shadow-sm">
          <h2 className="text-lg font-semibold mb-4">Quick Item Lookup</h2>
          
          <div className="relative" ref={itemDropdownRef}>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <i className="ri-search-line text-gray-400"></i>
              </div>
              <input
                type="text"
                placeholder="Search items (e.g., Coffee, Champagne, Dom Pérignon)"
                value={itemSearchTerm}
                onChange={(e) => {
                  setItemSearchTerm(e.target.value);
                  setOpenDropdown('itemSearch');
                }}
                onFocus={() => setOpenDropdown('itemSearch')}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Dropdown Results */}
            {openDropdown === 'itemSearch' && (
              <div className="absolute z-10 w-full mt-2 bg-white border border-gray-200 rounded-lg shadow-lg max-h-80 overflow-y-auto">
                {(() => {
                  const searchLower = itemSearchTerm.toLowerCase();
                  const filtered = inventoryItems.filter(item => 
                    item.label.toLowerCase().includes(searchLower) ||
                    item.code?.toLowerCase().includes(searchLower)
                  );

                  if (filtered.length === 0) {
                    return (
                      <div className="p-4 text-center text-gray-500">
                        <i className="ri-search-line text-2xl mb-2"></i>
                        <p>No items found</p>
                      </div>
                    );
                  }

                  return filtered.map((item) => (
                    <button
                      key={item.value}
                      onClick={() => {
                        setSelectedInventoryItem(item.value);
                        setItemSearchTerm(item.label);
                        setOpenDropdown(null);
                      }}
                      className="w-full px-4 py-3 text-left hover:bg-blue-50 transition-colors border-b border-gray-100 last:border-b-0"
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1">
                          <div className="font-medium text-gray-900">{item.label}</div>
                          <div className="text-sm text-gray-600 font-mono">{item.code}</div>
                        </div>
                        <i className="ri-arrow-right-s-line text-gray-400"></i>
                      </div>
                    </button>
                  ));
                })()}
              </div>
            )}
          </div>

          {/* Selected Item Display */}
          {selectedInventoryItem && (
            <div className="mt-4 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center space-x-2">
                  <i className="ri-checkbox-circle-fill text-blue-600"></i>
                  <span className="font-medium text-gray-900">Item Selected</span>
                </div>
                <button
                  onClick={() => {
                    setSelectedInventoryItem('');
                    setItemSearchTerm('');
                  }}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <i className="ri-close-line"></i>
                </button>
              </div>
              <div className="text-sm text-gray-700">
                <div className="font-medium">{inventoryItems.find(i => i.value === selectedInventoryItem)?.label}</div>
                <div className="text-gray-600 font-mono mt-1">Code: {selectedInventoryItem}</div>
              </div>
              <Link
                href={`/items?code=${selectedInventoryItem}`}
                className="mt-3 inline-flex items-center space-x-2 text-blue-600 hover:text-blue-800 font-medium"
              >
                <span>View Details</span>
                <i className="ri-arrow-right-line"></i>
              </Link>
            </div>
          )}
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