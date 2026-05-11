'use client';

import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import BottomNav from '../../components/BottomNav';
import { useFlight } from '../contexts/FlightContext';
import { authFetch } from '../utils/api';

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

interface Aircraft {
  code: string;
  description: string;
  type: string;
}

interface ParsedCart {
  rowCount: number;
  columns: { name: string; rows: string[] }[];
}

function parseCartConfig(cartConfig: unknown): ParsedCart | null {
  if (!cartConfig || typeof cartConfig !== 'object' || Array.isArray(cartConfig)) return null;
  const cfg = cartConfig as Record<string, unknown>;
  if (typeof cfg.rowCount !== 'number' || !Array.isArray(cfg.columns)) return null;

  const rowCount = cfg.rowCount as number;
  const columns = (cfg.columns as Array<{ name: string; cells: Array<{ content: string; indexes: number[] }> }>).map(col => {
    const rows = Array<string>(rowCount).fill('');
    col.cells.forEach(cell => {
      if (Array.isArray(cell.indexes) && cell.indexes.length > 0) {
        rows[cell.indexes[0]] = cell.content ?? '';
      }
    });
    return { name: col.name, rows };
  });

  return { rowCount, columns };
}

function getRoomClass(name: string): 'first' | 'business' | 'economy' | 'crew' {
  const n = name.toUpperCase();
  if (n.includes('OFCR') || n.includes('FCR') || n.includes('CREW')) return 'crew';
  if (n.startsWith('1F') || n.startsWith('1C')) return 'first';
  if (n.startsWith('2') || n.startsWith('3A1C') && !n.includes('4')) return 'business';
  return 'economy';
}

function roomClassStyle(cls: 'first' | 'business' | 'economy' | 'crew') {
  switch (cls) {
    case 'first':    return 'bg-purple-500 border-purple-600 text-white';
    case 'business': return 'bg-blue-500 border-blue-600 text-white';
    case 'economy':  return 'bg-green-500 border-green-600 text-white';
    case 'crew':     return 'bg-gray-400 border-gray-500 text-white';
  }
}

function roomClassDot(cls: 'first' | 'business' | 'economy' | 'crew') {
  switch (cls) {
    case 'first':    return 'bg-purple-500';
    case 'business': return 'bg-blue-500';
    case 'economy':  return 'bg-green-500';
    case 'crew':     return 'bg-gray-400';
  }
}

export default function GalleyPage() {
  const { activeFlight } = useFlight();
  const [aircraftList, setAircraftList] = useState<Aircraft[]>([]);
  const [selectedAircraft, setSelectedAircraft] = useState(activeFlight?.aircraft ?? '788');
  const [profile, setProfile] = useState<LtxProfile | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedRoom, setSelectedRoom] = useState<LtxRoom | null>(null);
  const [selectedBox, setSelectedBox] = useState<{ key: string; box: LtxBox } | null>(null);

  useEffect(() => {
    authFetch('/api/logintelix/aircraft')
      .then(async r => {
        const data = await r.json();
        if (!r.ok) throw new Error(data?.error ?? `HTTP ${r.status}`);
        return data;
      })
      .then(data => setAircraftList(Array.isArray(data) ? data : []))
      .catch(err => console.error('[galley] aircraft list error:', err));
  }, []);

  useEffect(() => {
    if (!selectedAircraft) return;
    setLoading(true);
    setError(null);
    setSelectedRoom(null);
    setProfile(null);

    authFetch(`/api/logintelix/galley/${selectedAircraft}`)
      .then(async r => {
        const data = await r.json();
        if (!r.ok) throw new Error(data?.error ?? `HTTP ${r.status}`);
        return data;
      })
      .then((profiles: LtxProfile[]) => {
        if (!Array.isArray(profiles)) throw new Error('Unexpected response format from galley API');
        const flightDuration = activeFlight?.duration ?? 0;
        const defaultProfile = profiles.find(p => p.duration === null) ?? profiles[0] ?? null;

        if (flightDuration > 0) {
          // Pick the duration-specific profile closest to the flight duration —
          // these profiles have cartConfig populated; the default profile does not.
          const tiers = [200, 240, 300, 480, 720, 900];
          const tier = tiers.reduce((best, t) =>
            Math.abs(t - flightDuration) < Math.abs(best - flightDuration) ? t : best
          );
          const tiered = profiles.filter(p => p.duration !== null && p.duration > 0);
          const best = tiered.reduce<LtxProfile | null>((b, p) =>
            !b || Math.abs((p.duration ?? 0) - tier) < Math.abs((b.duration ?? 0) - tier) ? p : b
          , null);
          setProfile(best ?? defaultProfile);
        } else {
          setProfile(defaultProfile);
        }
      })
      .catch(err => {
        console.error('[galley] load error:', err);
        setError(err instanceof Error ? err.message : 'Failed to load galley data');
      })
      .finally(() => setLoading(false));
  }, [selectedAircraft]);

  const aircraftLabel = aircraftList.find(a => a.code === selectedAircraft);

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />

      {selectedRoom ? (
        // ── Room detail: visual position map ─────────────────────────────
        <div className="page-container">
          <div className="px-4 py-4 bg-white border-b">
            <div className="flex items-center">
              <button onClick={() => setSelectedRoom(null)} className="btn-icon bg-gray-100 mr-3">
                <i className="ri-arrow-left-line text-gray-600"></i>
              </button>
              <div>
                <h2 className="text-lg font-semibold">{selectedRoom.name}</h2>
                <p className="text-sm text-gray-500">{selectedRoom.roomId} · {Object.keys(selectedRoom.boxes).length} positions</p>
              </div>
            </div>
          </div>

          {/* Legend */}
          <div className="px-4 pt-3 pb-1 flex flex-wrap gap-3 text-xs text-gray-600">
            {[
              { label: 'Liquids',       bg: 'bg-blue-200 border-blue-300' },
              { label: 'Food',          bg: 'bg-orange-200 border-orange-300' },
              { label: 'Miscellaneous', bg: 'bg-green-200 border-green-300' },
              { label: 'Bar',           bg: 'bg-red-200 border-red-300' },
              { label: 'Other',         bg: 'bg-gray-200 border-gray-300' },
            ].map(({ label, bg }) => (
              <div key={label} className="flex items-center gap-1">
                <div className={`w-3 h-3 rounded border ${bg}`} />
                <span>{label}</span>
              </div>
            ))}
          </div>

          <div className="px-4 py-4">
            <div className="card overflow-hidden">
              <div className="p-3 border-b bg-gray-50 text-xs font-semibold text-gray-500 uppercase tracking-wide">
                Galley Layout — {selectedRoom.name}
              </div>
              <div className="p-3 space-y-2 overflow-x-auto">
                {(() => {
                  // Parse box key: "B11"    → row=1, col=1, sub=null
                  //               "B12A"   → row=1, col=2, sub='A'  (letter)
                  //               "B32-1"  → row=3, col=2, sub='1'  (dash-number)
                  //               "B22B-1" → row=2, col=2, sub='B1' (letter + dash-number)
                  const parsed = Object.entries(selectedRoom.boxes).map(([key, box]) => {
                    const m = key.match(/^[A-Z](\d)(\d+)([A-Z]?)(?:-(\d+))?$/);
                    const numSub = m ? (m[4] || null) : null;
                    return {
                      key, box,
                      row: m ? parseInt(m[1]) : 99,
                      col: m ? parseInt(m[2]) : parseInt(key.replace(/\D/g, '') || '0'),
                      sub: m ? (((m[3] || '') + (m[4] || '')) || null) : null,
                      numSub,
                    };
                  });

                  // Group by row → col
                  const rowMap: Record<number, Record<number, typeof parsed>> = {};
                  parsed.forEach(p => {
                    if (!rowMap[p.row]) rowMap[p.row] = {};
                    if (!rowMap[p.row][p.col]) rowMap[p.row][p.col] = [];
                    rowMap[p.row][p.col].push(p);
                  });

                  // If a row's col set is a proper subset of the previous row's, fold its items
                  // up into those columns instead of creating a new row.
                  // Handles F/R half-carts encoded as row1/row2 of the same col (e.g. OFCR B11/B21).
                  const rowNums = Object.keys(rowMap).map(Number).sort((a, b) => a - b);
                  const finalRows: Array<Record<number, typeof parsed>> = [];
                  for (const rowNum of rowNums) {
                    const currCols = new Set(Object.keys(rowMap[rowNum]).map(Number));
                    if (finalRows.length > 0) {
                      const prev = finalRows[finalRows.length - 1];
                      const prevCols = new Set(Object.keys(prev).map(Number));
                      if (currCols.size < prevCols.size && [...currCols].every(c => prevCols.has(c))) {
                        currCols.forEach(col => prev[col].push(...rowMap[rowNum][col]));
                        continue;
                      }
                    }
                    const newRow: Record<number, typeof parsed> = {};
                    currCols.forEach(col => { newRow[col] = [...rowMap[rowNum][col]]; });
                    finalRows.push(newRow);
                  }

                  const boxTypeStyle = (type: string, title: string) => {
                    const t = ((type ?? '') + (title ?? '')).toLowerCase();
                    if (t.includes('liquid') || t.includes('agua') || t.includes('refres') || t.includes('jugo') || t.includes('cerve') || t.includes('hielo'))
                      return 'bg-blue-100 border-blue-300 text-blue-900';
                    if (t.includes('bar') || t.includes('vino') || t.includes('licor') || t.includes('spirits'))
                      return 'bg-red-100 border-red-300 text-red-900';
                    if (t.includes('food') || t.includes('horno') || t.includes('oven') || t.includes('comida') || t.includes('snack'))
                      return 'bg-orange-100 border-orange-300 text-orange-900';
                    if (t.includes('misc') || t.includes('caja') || t.includes('mantel') || t.includes('charola'))
                      return 'bg-green-100 border-green-300 text-green-900';
                    return 'bg-gray-100 border-gray-300 text-gray-800';
                  };

                  const isLarge = (type: string, title: string) => {
                    const t = ((type ?? '') + (title ?? '')).toLowerCase();
                    return t.includes('carro') || t.includes('cart') || t.includes('horno') || t.includes('oven') || t.includes('waste');
                  };

                  const maxColCount = Math.max(...finalRows.map(cm => Object.keys(cm).length));

                  return finalRows.map((colMap, rowIdx) => {
                    const cols = Object.keys(colMap).map(Number).sort((a, b) => a - b);
                    const leftSpacers = cols.length === 1 ? maxColCount - 1 : 0;
                    return (
                      <div key={rowIdx} className="flex gap-2">
                        {Array.from({ length: leftSpacers }, (_, i) => (
                          <div key={`sp-${i}`} className="flex-1" />
                        ))}
                        {cols.map(colNum => {
                          const items = colMap[colNum].sort((a, b) =>
                            a.row !== b.row
                              ? a.row - b.row
                              : (a.sub ?? '') < (b.sub ?? '') ? -1 : (a.sub ?? '') > (b.sub ?? '') ? 1 : 0
                          );

                          // Items with a dash-number sub (B32-1, B22B-1) render as horizontal pairs;
                          // letter/null subs stack vertically as usual.
                          const stacked = items.filter(({ numSub }) => numSub === null);
                          const paired  = items.filter(({ numSub }) => numSub !== null);
                          const pairs: typeof paired[] = [];
                          for (let i = 0; i < paired.length; i += 2) pairs.push(paired.slice(i, i + 2));

                          const renderBtn = (key: string, box: LtxBox, solo: boolean) => {
                            const large = isLarge(box.type, box.title);
                            return (
                              <button
                                key={key}
                                onClick={() => setSelectedBox({ key, box })}
                                className={`relative w-full border-2 rounded-lg p-2 text-left ${boxTypeStyle(box.type, box.title)} ${large && solo ? 'min-h-[80px]' : 'min-h-[56px]'}`}
                              >
                                <div className="text-[9px] font-bold opacity-50 leading-none mb-0.5">{key}</div>
                                <div className="text-[10px] font-bold leading-tight break-words">{box.title}</div>
                                {box.cartConfig != null && (
                                  <div className="absolute bottom-1 right-1 opacity-50">
                                    <i className="ri-table-line text-[10px]"></i>
                                  </div>
                                )}
                              </button>
                            );
                          };

                          return (
                            <div key={colNum} className="flex-1 flex flex-col gap-1 min-w-0">
                              {stacked.map(({ key, box }) => renderBtn(key, box, items.length === 1))}
                              {pairs.map((pair, pi) => (
                                <div key={pi} className="flex gap-1">
                                  {pair.map(({ key, box }) => (
                                    <div key={key} className="flex-1 min-w-0">{renderBtn(key, box, false)}</div>
                                  ))}
                                </div>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    );
                  });
                })()}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // ── Main view: plane map + room list ──────────────────────────────
        <div className="page-container">
          <div className="px-4 py-4 bg-white border-b">
            <h1 className="text-xl font-semibold">Aircraft Galley Map</h1>
            <p className="text-sm text-gray-500">Tap any galley to explore</p>
          </div>

          {/* Aircraft selector */}
          <div className="px-4 py-3 bg-white border-b">
            <label className="text-xs font-medium text-gray-500 block mb-1">Aircraft</label>
            <select
              value={selectedAircraft}
              onChange={e => setSelectedAircraft(e.target.value)}
              className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm bg-white"
            >
              {aircraftList.length === 0 && <option value="788">788 — 787-8</option>}
              {aircraftList.map(a => (
                <option key={a.code} value={a.code}>{a.code} — {a.description}</option>
              ))}
            </select>
          </div>

          {loading && (
            <div className="text-center py-16 text-gray-400">
              <i className="ri-loader-4-line text-2xl animate-spin block mb-2"></i>
              Loading galley data…
            </div>
          )}

          {error && (
            <div className="text-center py-16 text-red-500 text-sm">{error}</div>
          )}

          {!loading && !error && profile && (
            <>
              {/* ── Plane silhouette map ── */}
              <div className="mx-4 my-4 card overflow-hidden">
                <div className="p-3 border-b flex items-center justify-between">
                  <div>
                    <h2 className="font-semibold text-sm">
                      {aircraftLabel ? `${aircraftLabel.code} — ${aircraftLabel.description}` : selectedAircraft}
                    </h2>
                    <p className="text-xs text-gray-500">{profile.profileName} · {profile.rooms.length} galleys</p>
                  </div>
                </div>

                {/* Plane body — structured class sections */}
                {(() => {
                  const first    = profile.rooms.filter(r => getRoomClass(r.name) === 'first' || getRoomClass(r.name) === 'crew');
                  const business = profile.rooms.filter(r => getRoomClass(r.name) === 'business');
                  const economy  = profile.rooms.filter(r => getRoomClass(r.name) === 'economy');
                  // Economy 1-2-1: first alone, middle pairs, last alone
                  const ecoTop    = economy.slice(0, 1);
                  const ecoMid    = economy.slice(1, economy.length - 1);
                  const ecoBot    = economy.slice(economy.length > 1 ? economy.length - 1 : economy.length);

                  const RoomBtn = ({ room }: { room: LtxRoom }) => {
                    const cls = getRoomClass(room.name);
                    return (
                      <button
                        onClick={() => setSelectedRoom(room)}
                        className={`border-2 rounded-xl flex flex-col items-center justify-center font-bold shadow-md transition-all hover:scale-105 active:scale-95 px-3 py-2 ${roomClassStyle(cls)}`}
                        style={{ minWidth: '80px' }}
                      >
                        <span className="text-[11px] font-extrabold leading-tight">{room.name}</span>
                        <span className="text-[8px] opacity-80 capitalize leading-tight">{cls === 'crew' ? 'Crew' : cls === 'first' ? 'First' : cls === 'business' ? 'Business' : 'Economy'}</span>
                      </button>
                    );
                  };

                  return (
                    <div className="bg-gradient-to-b from-slate-100 to-slate-200 flex justify-center py-16 px-8">
                      <div className="relative flex flex-col items-center" style={{ width: '220px' }}>
                        {/* Plane silhouette — fills the content area exactly */}
                        <div className="absolute inset-0" style={{
                          borderRadius: '90px 90px 24px 24px',
                          background: 'linear-gradient(to bottom, #d1d5db, #9ca3af)',
                          zIndex: 0,
                        }} />

                        <div className="relative z-10 w-full flex flex-col items-center gap-16 py-20">
                          {/* First class — row of 2 */}
                          {first.length > 0 && (
                            <div className="flex gap-2 justify-center flex-wrap">
                              {first.map(r => <RoomBtn key={r.id} room={r} />)}
                            </div>
                          )}

                          {/* Business class — row of 2 */}
                          {business.length > 0 && (
                            <div className="flex gap-2 justify-center flex-wrap">
                              {business.map(r => <RoomBtn key={r.id} room={r} />)}
                            </div>
                          )}

                          {/* Economy — 1 / 2 / 1 */}
                          {economy.length > 0 && (
                            <div className="flex flex-col items-center gap-2 w-full">
                              {ecoTop.length > 0 && (
                                <div className="flex gap-2 justify-center">
                                  {ecoTop.map(r => <RoomBtn key={r.id} room={r} />)}
                                </div>
                              )}
                              {ecoMid.length > 0 && (
                                <div className="flex gap-2 justify-center flex-wrap">
                                  {ecoMid.map(r => <RoomBtn key={r.id} room={r} />)}
                                </div>
                              )}
                              {ecoBot.length > 0 && (
                                <div className="flex gap-2 justify-center">
                                  {ecoBot.map(r => <RoomBtn key={r.id} room={r} />)}
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })()}

                {/* Legend */}
                <div className="p-3 bg-gray-50 border-t flex flex-wrap justify-center gap-4 text-xs">
                  {[
                    { label: 'First Class', cls: 'first' as const },
                    { label: 'Business', cls: 'business' as const },
                    { label: 'Economy', cls: 'economy' as const },
                    { label: 'Crew', cls: 'crew' as const },
                  ].map(({ label, cls }) => (
                    <div key={label} className="flex items-center space-x-1.5">
                      <div className={`w-3 h-3 rounded-full ${roomClassDot(cls)}`} />
                      <span>{label}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* ── Quick access room list ── */}
              <div className="px-4 pb-6">
                <h3 className="font-semibold text-sm mb-3">All Galleys</h3>
                <div className="grid grid-cols-2 gap-3">
                  {profile.rooms.map(room => {
                    const cls = getRoomClass(room.name);
                    const boxCount = Object.keys(room.boxes).length;
                    return (
                      <button
                        key={room.id}
                        onClick={() => setSelectedRoom(room)}
                        className="card-hover p-3 text-left"
                      >
                        <div className="flex items-center space-x-2 mb-1.5">
                          <div className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${roomClassDot(cls)}`} />
                          <h4 className="font-semibold text-sm">{room.name}</h4>
                        </div>
                        <p className="text-[11px] text-gray-500">{room.roomId} · {boxCount} position{boxCount !== 1 ? 's' : ''}</p>
                      </button>
                    );
                  })}
                </div>
              </div>
            </>
          )}

          {!loading && !error && !profile && (
            <div className="text-center py-16 text-gray-400 text-sm">
              No galley data available for this aircraft
            </div>
          )}
        </div>
      )}

      {/* ── Box detail modal ── */}
      {selectedBox && (() => {
        const cart = parseCartConfig(selectedBox.box.cartConfig);
        return (
          <div className="modal-overlay" onClick={() => setSelectedBox(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()}>
              <div className="modal-header">
                <div>
                  <h2 className="modal-title">{selectedBox.box.title}</h2>
                  <p className="text-sm text-gray-500 font-mono">{selectedBox.key}</p>
                </div>
                <button onClick={() => setSelectedBox(null)} className="modal-close">
                  <i className="ri-close-line text-gray-600"></i>
                </button>
              </div>

              <div className="p-4 space-y-4">
                {/* Type */}
                <div className="flex items-center gap-3">
                  <span className="text-sm font-medium text-gray-500 w-24 shrink-0">Type</span>
                  <span className="text-sm text-gray-900">{selectedBox.box.type || '—'}</span>
                </div>

                {/* Cart Type */}
                {selectedBox.box.cartType && (
                  <div className="flex items-center gap-3">
                    <span className="text-sm font-medium text-gray-500 w-24 shrink-0">Cart Type</span>
                    <span className="text-sm text-gray-900">{selectedBox.box.cartType}</span>
                  </div>
                )}

                {/* Cart grid (structured) or displayText fallback */}
                {cart ? (
                  <div className="border rounded-lg overflow-hidden">
                    <table className="w-full text-xs">
                      <thead>
                        <tr className="bg-gray-50 border-b">
                          <th className="w-9 py-2 px-2 text-center text-gray-500 font-medium">#</th>
                          {cart.columns.map(col => (
                            <th key={col.name} className="py-2 px-3 text-center text-gray-500 font-medium border-l">
                              {col.name}
                            </th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {Array.from({ length: cart.rowCount }, (_, i) => (
                          <tr key={i} className="border-b last:border-0">
                            <td className="py-1.5 px-2 text-center text-gray-400 font-mono">{i + 1}</td>
                            {cart.columns.map(col => (
                              <td key={col.name} className="py-1.5 px-3 text-gray-800 border-l">{col.rows[i]}</td>
                            ))}
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                ) : selectedBox.box.displayText ? (
                  <p className="text-sm text-gray-700 whitespace-pre-wrap leading-relaxed">{selectedBox.box.displayText}</p>
                ) : (
                  <p className="text-sm text-gray-400">No content available</p>
                )}

                {/* Exchange */}
                {selectedBox.box.exchange && (
                  <div className="pt-2 border-t text-xs text-gray-500">
                    Exchange: <span className="font-medium">{selectedBox.box.exchange}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        );
      })()}

      <BottomNav />
    </div>
  );
}
