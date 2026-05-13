'use client';

import { useState, useEffect } from 'react';
import Header from '../components/Header';
import BottomNav from '../components/BottomNav';
import Link from 'next/link';
import { useFlight, type ActiveFlight } from './contexts/FlightContext';
import { authFetch } from './utils/api';

interface LtxFlight {
  flightNumber: string;
  aircraft: string;
  from: string;
  to: string;
  fromDateTime: string;
  toDateTime: string;
  duration: number;
}

function currentYearMonth() {
  const now = new Date();
  return { year: now.getFullYear(), month: String(now.getMonth() + 1).padStart(2, '0') };
}

export default function Home() {
  const { activeFlight, setActiveFlight } = useFlight();

  const [flights, setFlights] = useState<LtxFlight[]>([]);
  const [flightsLoading, setFlightsLoading] = useState(true);

  // Form state
  const [aircraft, setAircraft] = useState('');
  const [flightNumber, setFlightNumber] = useState('');
  const [origin, setOrigin] = useState('');
  const [destination, setDestination] = useState('');

  // Pre-fill form if flight already loaded
  useEffect(() => {
    if (activeFlight) {
      setAircraft(activeFlight.aircraft);
      setFlightNumber(activeFlight.flightNumber);
      setOrigin(activeFlight.from);
      setDestination(activeFlight.to);
    }
  }, []);

  // Load flights for current month
  useEffect(() => {
    const { year, month } = currentYearMonth();
    authFetch(`/api/logintelix/flights/${year}/${month}`)
      .then(r => r.json())
      .then(data => setFlights(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setFlightsLoading(false));
  }, []);

  // Filtered suggestions
  const flightSuggestions = flights.filter(f => {
    const q = flightNumber.toLowerCase();
    return !q || f.flightNumber.toLowerCase().includes(q);
  }).slice(0, 8);

  const aircraftSuggestions = [...new Set(flights.map(f => f.aircraft))]
    .filter(a => !aircraft || a.toLowerCase().includes(aircraft.toLowerCase()))
    .slice(0, 8);

  const originSuggestions = [...new Set(flights.map(f => f.from))]
    .filter(s => !origin || s.toLowerCase().includes(origin.toLowerCase()))
    .sort()
    .slice(0, 8);

  const destinationSuggestions = [...new Set(flights.map(f => f.to))]
    .filter(s => !destination || s.toLowerCase().includes(destination.toLowerCase()))
    .sort()
    .slice(0, 8);

  const [openField, setOpenField] = useState<string | null>(null);

  const handleLoadFlight = () => {
    // Try to find exact match from flights list
    const match = flights.find(f =>
      f.flightNumber === flightNumber &&
      f.aircraft === aircraft &&
      f.from === origin &&
      f.to === destination
    ) ?? flights.find(f => f.flightNumber === flightNumber);

    const active: ActiveFlight = match ?? {
      flightNumber,
      aircraft,
      from: origin,
      to: destination,
      fromDateTime: '',
      toDateTime: '',
      duration: -1,
    };

    setActiveFlight(active);
    setOpenField(null);
  };

  const clearFlight = () => {
    setActiveFlight(null);
    setAircraft('');
    setFlightNumber('');
    setOrigin('');
    setDestination('');
  };

  const isReady = flightNumber && aircraft && origin && destination;

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      <div className="page-container">
        <div className="max-w-2xl mx-auto space-y-4">

        {/* Active flight banner */}
        {activeFlight && (
          <div className="bg-green-50 border border-green-200 rounded-xl p-3 flex items-center justify-between">
            <div className="flex items-center gap-2">
              <i className="ri-checkbox-circle-fill text-green-500"></i>
              <div>
                <div className="text-sm font-semibold text-green-800">
                  AM{activeFlight.flightNumber} · {activeFlight.from} → {activeFlight.to}
                </div>
                <div className="text-xs text-green-600">
                  Aircraft {activeFlight.aircraft}
                  {activeFlight.duration > 0 ? ` · ${activeFlight.duration} min` : ''}
                </div>
              </div>
            </div>
            <button onClick={clearFlight} className="text-green-400 hover:text-green-600">
              <i className="ri-close-line text-lg"></i>
            </button>
          </div>
        )}

        {/* Flight search */}
        <div className="card-padded" onClick={() => setOpenField(null)}>
          <h2 className="text-lg font-semibold mb-4">
            {activeFlight ? 'Change Flight' : 'Load Flight Data'}
          </h2>

          <div className="space-y-3" onClick={e => e.stopPropagation()}>

            {/* Flight Number */}
            <div className="relative">
              <label className="block text-xs font-medium text-gray-500 mb-1">Flight Number</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="ri-ticket-2-line text-gray-400"></i>
                </div>
                <input
                  type="text"
                  placeholder="e.g. 800"
                  value={flightNumber}
                  onChange={e => { setFlightNumber(e.target.value); setOpenField('flight'); }}
                  onFocus={() => setOpenField('flight')}
                  className="input input-icon"
                />
              </div>
              {openField === 'flight' && flightSuggestions.length > 0 && (
                <div className="dropdown">
                  {flightSuggestions.map((f, i) => (
                    <button key={i} className="dropdown-item" onClick={() => {
                      setFlightNumber(f.flightNumber);
                      setAircraft(f.aircraft);
                      setOrigin(f.from);
                      setDestination(f.to);
                      setOpenField(null);
                    }}>
                      <div className="font-medium">AM{f.flightNumber}</div>
                      <div className="text-sm text-gray-500">{f.from} → {f.to} · {f.aircraft}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Aircraft */}
            <div className="relative">
              <label className="block text-xs font-medium text-gray-500 mb-1">Aircraft</label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <i className="ri-plane-line text-gray-400"></i>
                </div>
                <input
                  type="text"
                  placeholder="e.g. 788"
                  value={aircraft}
                  onChange={e => { setAircraft(e.target.value); setOpenField('aircraft'); }}
                  onFocus={() => setOpenField('aircraft')}
                  className="input input-icon"
                />
              </div>
              {openField === 'aircraft' && aircraftSuggestions.length > 0 && (
                <div className="dropdown">
                  {aircraftSuggestions.map((a, i) => (
                    <button key={i} className="dropdown-item" onClick={() => {
                      setAircraft(a); setOpenField(null);
                    }}>
                      <div className="font-medium">{a}</div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Origin + Destination */}
            <div className="grid grid-cols-2 gap-3">
              <div className="relative">
                <label className="block text-xs font-medium text-gray-500 mb-1">Origin</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="ri-flight-takeoff-line text-gray-400"></i>
                  </div>
                  <input
                    type="text"
                    placeholder="MEX"
                    value={origin}
                    onChange={e => { setOrigin(e.target.value); setOpenField('origin'); }}
                    onFocus={() => setOpenField('origin')}
                    className="input input-icon"
                  />
                </div>
                {openField === 'origin' && originSuggestions.length > 0 && (
                  <div className="dropdown">
                    {originSuggestions.map((s, i) => (
                      <button key={i} className="dropdown-item" onClick={() => {
                        setOrigin(s); setOpenField(null);
                      }}>
                        <div className="font-medium">{s}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              <div className="relative">
                <label className="block text-xs font-medium text-gray-500 mb-1">Destination</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="ri-flight-land-line text-gray-400"></i>
                  </div>
                  <input
                    type="text"
                    placeholder="GDL"
                    value={destination}
                    onChange={e => { setDestination(e.target.value); setOpenField('destination'); }}
                    onFocus={() => setOpenField('destination')}
                    className="input input-icon"
                  />
                </div>
                {openField === 'destination' && destinationSuggestions.length > 0 && (
                  <div className="dropdown">
                    {destinationSuggestions.map((s, i) => (
                      <button key={i} className="dropdown-item" onClick={() => {
                        setDestination(s); setOpenField(null);
                      }}>
                        <div className="font-medium">{s}</div>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>

            {flightsLoading && (
              <p className="text-xs text-gray-400">Loading flights…</p>
            )}

            <button
              onClick={handleLoadFlight}
              disabled={!isReady}
              className="btn-primary w-full disabled:opacity-40"
            >
              {activeFlight ? 'Update Flight' : 'Load Flight Data'}
            </button>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="section-spacing">
          <h2 className="text-lg font-semibold mb-4">Quick Actions</h2>
          <div className="grid grid-cols-2 gap-4">
            <Link href="/galley" className="card-hover p-4">
              <div className="icon-circle icon-lg bg-blue-100 mb-3">
                <i className="ri-map-line text-blue-600 text-xl"></i>
              </div>
              <h3 className="font-semibold mb-1">Galley Map</h3>
              <p className="text-sm text-gray-600">
                {activeFlight ? `Aircraft ${activeFlight.aircraft}` : 'Select rooms & boxes'}
              </p>
            </Link>

            <Link href="/items" className="card-hover p-4">
              <div className="icon-circle icon-lg bg-orange-100 mb-3">
                <i className="ri-box-3-line text-orange-600 text-xl"></i>
              </div>
              <h3 className="font-semibold mb-1">Items</h3>
              <p className="text-sm text-gray-600">Browse product catalog</p>
            </Link>

            <Link href="/inventory" className="card-hover p-4">
              <div className="icon-circle icon-lg bg-purple-100 mb-3">
                <i className="ri-file-list-line text-purple-600 text-xl"></i>
              </div>
              <h3 className="font-semibold mb-1">Inventory</h3>
              <p className="text-sm text-gray-600">
                {activeFlight ? `AM${activeFlight.flightNumber} ready` : 'Count & submit stock'}
              </p>
            </Link>

            <Link href="/issues" className="card-hover p-4">
              <div className="icon-circle icon-lg bg-red-100 mb-3">
                <i className="ri-error-warning-line text-red-600 text-xl"></i>
              </div>
              <h3 className="font-semibold mb-1">Issues</h3>
              <p className="text-sm text-gray-600">Report problems</p>
            </Link>
          </div>
        </div>

        </div>
      </div>
      <BottomNav />
    </div>
  );
}
