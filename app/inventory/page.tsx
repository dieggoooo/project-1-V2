'use client';

import { useState, useEffect, useMemo } from 'react';
import Header from '../../components/Header';
import BottomNav from '../../components/BottomNav';
import { useFlight } from '../contexts/FlightContext';
import { authFetch } from '../utils/api';

// ── Types ─────────────────────────────────────────────────────────────────────

interface LtxFlight {
  flightNumber: string;
  aircraft: string;
  from: string;
  to: string;
  fromDateTime: string;
  toDateTime: string;
  duration: number;
}

interface LtxBox {
  type: string;
  title: string;
  exchange: string;
  cartType: string | null;
  displayText: string;
  cartConfig: unknown | null;
}

interface LtxRoom {
  id: string;
  roomId: string;
  name: string;
  boxes: Record<string, LtxBox>;
}

interface LtxProfile {
  id: string;
  aircraft: string;
  profileName: string;
  duration: number | null;
  rooms: LtxRoom[];
}

interface LtxItem {
  code: string;
  itemType: string;
  description: string;
  description2: string;
  category: string;
  subCategory: string;
  barSource: string | null;
}

// key = "galley:ROOM:BOXKEY:LINE_INDEX" | "galley:ROOM:BOXKEY" | "item:CODE"
type CountMap = Record<string, number>;

// ── Helpers ───────────────────────────────────────────────────────────────────

function currentYearMonth() {
  const now = new Date();
  return { year: now.getFullYear(), month: String(now.getMonth() + 1).padStart(2, '0') };
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function InventoryPage() {
  const { activeFlight } = useFlight();

  // Flight selection
  const [flights, setFlights] = useState<LtxFlight[]>([]);
  const [selectedFlight, setSelectedFlight] = useState<LtxFlight | null>(activeFlight ?? null);
  const [flightsLoading, setFlightsLoading] = useState(false);
  const [validAircraft, setValidAircraft] = useState<Set<string> | null>(null);

  // Galley profile
  const [profile, setProfile] = useState<LtxProfile | null>(null);
  const [profileLoading, setProfileLoading] = useState(false);

  // Items catalog
  const [items, setItems] = useState<LtxItem[]>([]);
  const [itemSearch, setItemSearch] = useState('');

  // Mode
  const [mode, setMode] = useState<'galley' | 'item'>('galley');

  // Galley navigation
  const [selectedRoom, setSelectedRoom] = useState<LtxRoom | null>(null);
  const [selectedBox, setSelectedBox] = useState<{ key: string; box: LtxBox } | null>(null);

  // Counts — shared between all modes
  const [counts, setCounts] = useState<CountMap>({});

  // Submission
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  // Load flights for current month
  useEffect(() => {
    const { year, month } = currentYearMonth();
    setFlightsLoading(true);
    authFetch(`/api/logintelix/flights/${year}/${month}`)
      .then(r => r.json())
      .then(data => setFlights(Array.isArray(data) ? data : []))
      .catch(() => {})
      .finally(() => setFlightsLoading(false));
  }, []);

  // Check which aircraft have galley profiles and filter the dropdown
  useEffect(() => {
    if (!flights.length) return;
    const uniqueAircraft = [...new Set(flights.map(f => f.aircraft))];
    Promise.all(
      uniqueAircraft.map(ac =>
        authFetch(`/api/logintelix/galley/${ac}`)
          .then(r => r.ok ? r.json() : null)
          .then(data => {
            const hasProfile = Array.isArray(data) ? data.length > 0 : !!(data?.rooms);
            return { ac, hasProfile };
          })
          .catch(() => ({ ac, hasProfile: false }))
      )
    ).then(results => {
      setValidAircraft(new Set(results.filter(r => r.hasProfile).map(r => r.ac)));
    });
  }, [flights]);

  // Load items catalog
  useEffect(() => {
    authFetch('/api/logintelix/items')
      .then(r => r.json())
      .then(data => setItems(Array.isArray(data) ? data : []))
      .catch(() => {});
  }, []);

  // Load galley profile when flight selected
  useEffect(() => {
    if (!selectedFlight) return;
    setProfileLoading(true);
    setProfile(null);
    setSelectedRoom(null);
    setSelectedBox(null);
    setCounts({});
    const url = `/api/logintelix/galley/${selectedFlight.aircraft}${
      selectedFlight.duration > 0 ? `?duration=${selectedFlight.duration}` : ''
    }`;
    authFetch(url)
      .then(r => r.json())
      .then((data) => {
        const p = Array.isArray(data)
          ? (data.find((x: LtxProfile) => x.duration === null) ?? data[0])
          : data;
        setProfile(p?.rooms ? p : null);
      })
      .catch(() => {})
      .finally(() => setProfileLoading(false));
  }, [selectedFlight]);

  const setCount = (key: string, value: number) => {
    setCounts(prev => ({ ...prev, [key]: Math.max(0, value) }));
  };

  // Key helpers
  const galleyKey = (roomName: string, boxKey: string) => `galley:${roomName}:${boxKey}`;
  const galleyItemKey = (roomName: string, boxKey: string, lineIdx: number) => `galley:${roomName}:${boxKey}:${lineIdx}`;
  const itemKey = (code: string) => `item:${code}`;

  // Per-box helpers
  const getBoxLines = (box: LtxBox) => box.displayText?.split('\n').filter(Boolean) ?? [];

  const getBoxProgress = (roomName: string, boxKey: string, box: LtxBox) => {
    const lines = getBoxLines(box);
    if (lines.length > 0) {
      const counted = lines.filter((_, i) => counts[galleyItemKey(roomName, boxKey, i)] !== undefined).length;
      return { counted, total: lines.length };
    }
    // Fallback: single count for the whole box
    const counted = counts[galleyKey(roomName, boxKey)] !== undefined ? 1 : 0;
    return { counted, total: 1 };
  };

  const totalCounted = Object.keys(counts).length;

  const filteredItems = useMemo(() => {
    const q = itemSearch.toLowerCase();
    if (!q) return items.slice(0, 80);
    return items.filter(i =>
      i.description.toLowerCase().includes(q) || i.code.toLowerCase().includes(q)
    ).slice(0, 40);
  }, [items, itemSearch]);

  const handleSubmit = async () => {
    if (!selectedFlight) return;
    setSubmitting(true);

    const galleyEntries = Object.entries(counts)
      .filter(([k]) => k.startsWith('galley:'))
      .map(([k, qty]) => {
        const parts = k.split(':');
        const roomName = parts[1];
        const boxKey = parts[2];
        const lineIndex = parts.length > 3 ? parseInt(parts[3]) : null;
        const room = profile?.rooms.find(r => r.name === roomName);
        const box = room?.boxes[boxKey];
        const lines = getBoxLines(box!);
        const itemDescription = lineIndex !== null ? (lines[lineIndex] ?? '') : (box?.title ?? boxKey);
        return { roomName, boxKey, boxTitle: box?.title ?? boxKey, itemDescription, lineIndex, quantityRemaining: qty };
      });

    const itemEntries = Object.entries(counts)
      .filter(([k]) => k.startsWith('item:'))
      .map(([k, qty]) => {
        const code = k.replace('item:', '');
        const item = items.find(i => i.code === code);
        return { code, description: item?.description ?? code, quantityRemaining: qty };
      });

    const payload = {
      flightNumber: selectedFlight.flightNumber,
      aircraft: selectedFlight.aircraft,
      from: selectedFlight.from,
      to: selectedFlight.to,
      flightDate: selectedFlight.fromDateTime.split(' ')[0],
      galleyProfileId: profile?.id ?? '',
      submittedAt: new Date().toISOString(),
      galleyCounts: galleyEntries,
      itemCounts: itemEntries,
    };

    try {
      await authFetch('/api/logintelix/inventory', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      setSubmitted(true);
    } catch {
      alert('Submission failed. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  // ── Submitted confirmation ─────────────────────────────────────────────────
  if (submitted) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="page-container flex flex-col items-center justify-center py-24 text-center px-8">
          <div className="icon-circle icon-xl bg-green-100 mx-auto mb-4">
            <i className="ri-checkbox-circle-line text-green-500 text-3xl"></i>
          </div>
          <h2 className="text-xl font-bold mb-2">Inventory Submitted</h2>
          <p className="text-gray-500 text-sm mb-6">
            Flight {selectedFlight?.flightNumber} · {selectedFlight?.from} → {selectedFlight?.to}
          </p>
          <button
            onClick={() => { setSubmitted(false); setSelectedFlight(null); setCounts({}); }}
            className="btn-primary"
          >
            Start New Inventory
          </button>
        </div>
        <BottomNav />
      </div>
    );
  }

  // ── Box detail: individual items ───────────────────────────────────────────
  if (mode === 'galley' && selectedRoom && selectedBox) {
    const lines = getBoxLines(selectedBox.box);

    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="page-container">
          <div className="px-4 py-4 bg-white border-b flex items-center">
            <button onClick={() => setSelectedBox(null)} className="btn-icon bg-gray-100 mr-3">
              <i className="ri-arrow-left-line text-gray-600"></i>
            </button>
            <div>
              <h2 className="text-lg font-semibold">{selectedBox.box.title}</h2>
              <p className="text-sm text-gray-500">
                {selectedBox.key} · {selectedRoom.name}
                {lines.length > 0 ? ` · ${lines.length} items` : ''}
              </p>
            </div>
          </div>

          <div className="px-4 py-4 space-y-3">
            {lines.length > 0 ? (
              lines.map((line, i) => {
                const key = galleyItemKey(selectedRoom.name, selectedBox.key, i);
                const val = counts[key];
                return (
                  <div key={i} className="card p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-800 leading-snug">{line}</div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => setCount(key, (counts[key] ?? 0) - 1)}
                          className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-700 active:scale-95"
                        >−</button>
                        <span className="w-8 text-center font-semibold text-sm">
                          {val === undefined ? '—' : val}
                        </span>
                        <button
                          onClick={() => setCount(key, (counts[key] ?? 0) + 1)}
                          className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-700 active:scale-95"
                        >+</button>
                      </div>
                    </div>
                  </div>
                );
              })
            ) : (
              // No displayText — single stepper for the whole position
              (() => {
                const key = galleyKey(selectedRoom.name, selectedBox.key);
                const val = counts[key];
                return (
                  <div className="card p-4">
                    <div className="flex items-center justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <div className="text-sm font-medium text-gray-800">{selectedBox.box.title}</div>
                        <div className="text-xs text-gray-400 mt-0.5">No item breakdown available</div>
                      </div>
                      <div className="flex items-center gap-2 flex-shrink-0">
                        <button
                          onClick={() => setCount(key, (counts[key] ?? 0) - 1)}
                          className="w-10 h-10 rounded-full bg-gray-200 flex items-center justify-center text-xl font-bold text-gray-700 active:scale-95"
                        >−</button>
                        <span className="w-8 text-center font-semibold text-sm">
                          {val === undefined ? '—' : val}
                        </span>
                        <button
                          onClick={() => setCount(key, (counts[key] ?? 0) + 1)}
                          className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-xl font-bold text-blue-700 active:scale-95"
                        >+</button>
                      </div>
                    </div>
                  </div>
                );
              })()
            )}
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  // ── Room detail: list of positions ────────────────────────────────────────
  if (mode === 'galley' && selectedRoom) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Header />
        <div className="page-container">
          <div className="px-4 py-4 bg-white border-b flex items-center">
            <button onClick={() => setSelectedRoom(null)} className="btn-icon bg-gray-100 mr-3">
              <i className="ri-arrow-left-line text-gray-600"></i>
            </button>
            <div>
              <h2 className="text-lg font-semibold">{selectedRoom.name}</h2>
              <p className="text-sm text-gray-500">{Object.keys(selectedRoom.boxes).length} positions</p>
            </div>
          </div>

          <div className="px-4 py-4 space-y-3">
            {Object.entries(selectedRoom.boxes).map(([boxKey, box]) => {
              const { counted, total } = getBoxProgress(selectedRoom.name, boxKey, box);
              const allCounted = counted === total && counted > 0;
              const lines = getBoxLines(box);

              return (
                <button
                  key={boxKey}
                  onClick={() => setSelectedBox({ key: boxKey, box })}
                  className="card-hover w-full p-4 text-left flex items-center justify-between"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-[10px] font-bold text-gray-400 mb-0.5">{boxKey}</div>
                    <div className="text-sm font-semibold text-gray-800 leading-tight">{box.title}</div>
                    {lines.length > 0 && (
                      <div className="text-xs text-gray-500 mt-0.5">{lines.length} items</div>
                    )}
                  </div>
                  <div className="flex items-center gap-2 flex-shrink-0">
                    {counted > 0 && (
                      <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                        allCounted ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                      }`}>
                        {counted}/{total}
                      </span>
                    )}
                    <i className="ri-arrow-right-s-line text-gray-400"></i>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
        <BottomNav />
      </div>
    );
  }

  // ── Main view ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      <div className="page-container">

        {/* Title */}
        <div className="px-4 pt-4 pb-2">
          <h1 className="text-2xl font-bold text-gray-900">Inventory</h1>
          <p className="text-sm text-gray-500">Count remaining stock and submit</p>
        </div>

        {/* Flight selector */}
        <div className="px-4 py-3 bg-white border-y mb-4">
          <label className="text-xs font-medium text-gray-500 block mb-1">Flight</label>
          {flightsLoading ? (
            <div className="text-sm text-gray-400">Loading flights…</div>
          ) : (
            <select
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
              value={selectedFlight?.flightNumber ?? ''}
              onChange={e => {
                const f = flights.find(fl => fl.flightNumber === e.target.value) ?? null;
                setSelectedFlight(f);
              }}
            >
              <option value="">Select a flight…</option>
              {flights
                .filter(f => !validAircraft || validAircraft.has(f.aircraft))
                .map((f, i) => (
                  <option key={`${f.flightNumber}-${i}`} value={f.flightNumber}>
                    AM{f.flightNumber} · {f.from} → {f.to} · {f.aircraft}
                  </option>
                ))}
            </select>
          )}

          {selectedFlight && (
            <div className="mt-2 flex gap-2 flex-wrap text-xs text-gray-500">
              <span className="bg-gray-100 rounded px-2 py-0.5">Aircraft: {selectedFlight.aircraft}</span>
              <span className="bg-gray-100 rounded px-2 py-0.5">{selectedFlight.from} → {selectedFlight.to}</span>
              {selectedFlight.duration > 0 && (
                <span className="bg-gray-100 rounded px-2 py-0.5">{selectedFlight.duration} min</span>
              )}
            </div>
          )}
        </div>

        {!selectedFlight ? (
          <div className="text-center py-16 text-gray-400 text-sm">
            Select a flight above to begin
          </div>
        ) : profileLoading ? (
          <div className="text-center py-16 text-gray-400">
            <i className="ri-loader-4-line text-2xl animate-spin block mb-2"></i>
            Loading galley profile…
          </div>
        ) : (
          <>
            {/* Progress */}
            {totalCounted > 0 && (
              <div className="mx-4 mb-4 card p-3 flex items-center justify-between">
                <span className="text-sm text-gray-600">{totalCounted} position{totalCounted !== 1 ? 's' : ''} counted</span>
                <button
                  onClick={handleSubmit}
                  disabled={submitting}
                  className="btn-primary py-1 px-4 text-sm"
                >
                  {submitting ? 'Submitting…' : 'Submit'}
                </button>
              </div>
            )}

            {/* Mode tabs */}
            <div className="px-4 mb-4">
              <div className="flex bg-gray-100 rounded-xl p-1">
                <button
                  onClick={() => setMode('galley')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    mode === 'galley' ? 'bg-white shadow text-blue-600' : 'text-gray-500'
                  }`}
                >
                  <i className="ri-layout-grid-line mr-1"></i>By Galley
                </button>
                <button
                  onClick={() => setMode('item')}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium transition-all ${
                    mode === 'item' ? 'bg-white shadow text-blue-600' : 'text-gray-500'
                  }`}
                >
                  <i className="ri-search-line mr-1"></i>By Item
                </button>
              </div>
            </div>

            {/* ── By Galley ── */}
            {mode === 'galley' && (
              <div className="px-4 pb-6 space-y-3">
                {!profile ? (
                  <div className="text-center py-8 text-gray-400 text-sm">No galley profile found for this aircraft</div>
                ) : (
                  profile.rooms.map(room => {
                    const boxKeys = Object.keys(room.boxes);
                    const startedBoxes = boxKeys.filter(k => {
                      const { counted } = getBoxProgress(room.name, k, room.boxes[k]);
                      return counted > 0;
                    }).length;
                    return (
                      <button
                        key={room.id}
                        onClick={() => setSelectedRoom(room)}
                        className="card-hover w-full p-4 text-left flex items-center justify-between"
                      >
                        <div>
                          <div className="font-semibold text-sm">{room.name}</div>
                          <div className="text-xs text-gray-500">{room.roomId} · {boxKeys.length} positions</div>
                        </div>
                        <div className="flex items-center gap-3">
                          {startedBoxes > 0 && (
                            <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                              startedBoxes === boxKeys.length ? 'bg-green-100 text-green-600' : 'bg-blue-100 text-blue-600'
                            }`}>
                              {startedBoxes}/{boxKeys.length}
                            </span>
                          )}
                          <i className="ri-arrow-right-s-line text-gray-400"></i>
                        </div>
                      </button>
                    );
                  })
                )}
              </div>
            )}

            {/* ── By Item ── */}
            {mode === 'item' && (
              <div className="px-4 pb-6">
                <div className="relative mb-3">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <i className="ri-search-line text-gray-400"></i>
                  </div>
                  <input
                    type="text"
                    placeholder="Search items…"
                    value={itemSearch}
                    onChange={e => setItemSearch(e.target.value)}
                    className="input input-icon"
                  />
                </div>

                {!itemSearch && (
                  <p className="text-xs text-gray-400 mb-3">Showing first 80 items — search to narrow down</p>
                )}

                <div className="space-y-2">
                  {filteredItems.map(item => {
                    const key = itemKey(item.code);
                    const val = counts[key];
                    return (
                      <div key={item.code} className="card p-3 flex items-center gap-3">
                        <div className="flex-1 min-w-0">
                          <div className="text-sm font-medium text-gray-800 truncate">{item.description}</div>
                          <div className="text-xs text-blue-600 font-mono">{item.code}</div>
                        </div>
                        <div className="flex items-center gap-2 flex-shrink-0">
                          <button
                            onClick={() => setCount(key, (counts[key] ?? 0) - 1)}
                            className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center text-lg font-bold text-gray-700"
                          >−</button>
                          <span className="w-8 text-center font-semibold text-sm">
                            {val === undefined ? '—' : val}
                          </span>
                          <button
                            onClick={() => setCount(key, (counts[key] ?? 0) + 1)}
                            className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-lg font-bold text-blue-700"
                          >+</button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            )}

            {/* Submit button at bottom */}
            <div className="px-4 pb-8">
              <button
                onClick={handleSubmit}
                disabled={submitting || totalCounted === 0}
                className="btn-primary w-full disabled:opacity-40"
              >
                {submitting ? 'Submitting…' : `Submit Inventory${totalCounted > 0 ? ` (${totalCounted} counted)` : ''}`}
              </button>
            </div>
          </>
        )}
      </div>
      <BottomNav />
    </div>
  );
}
