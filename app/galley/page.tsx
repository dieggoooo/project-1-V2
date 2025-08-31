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

  // Trolley configurations - NEW FEATURE!
  const trolleyConfigurations: { [key: string]: any } = {
    '1F1C03': {
      name: 'Pos 1F1C03 Carro 1/1',
      type: 'First Class Beverage Cart',
      layout: {
        front: [
          // Rows 1-3: Multi-line item
          { slot: 1, item: '1x Jugos CJ BOEING\n1x Leche Light 1 LT ( CJ )*\n(Aplica de acuerdo a QTY en Matriz)', description: '', rowSpan: 3 },
          { slot: 2, item: '', description: '', hidden: true }, // Hidden - part of row 1
          { slot: 3, item: '', description: '', hidden: true }, // Hidden - part of row 1
          { slot: 4, item: '', description: '' }, // Row 4: Empty
          // Rows 5-6: Multi-line item  
          { slot: 5, item: '01x Agua 1.5L\nen GAVETA DE PLASTICO', description: '', rowSpan: 2 },
          { slot: 6, item: '', description: '', hidden: true }, // Hidden - part of row 5
          { slot: 7, item: '', description: '' }, // Row 7: Empty
          // Rows 8-10: Multi-line item
          { slot: 8, item: '01x Refrescos ( lata )', description: '', rowSpan: 3 },
          { slot: 9, item: '', description: '', hidden: true }, // Hidden - part of row 8
          { slot: 10, item: '', description: '', hidden: true }, // Hidden - part of row 8
          // Rows 11-14: Multi-line item
          { slot: 11, item: '01x CERVEZA FRÍA PREMIER', description: '', rowSpan: 4 },
          { slot: 12, item: '', description: '', hidden: true }, // Hidden - part of row 11
          { slot: 13, item: '', description: '', hidden: true }, // Hidden - part of row 11
          { slot: 14, item: '', description: '', hidden: true }  // Hidden - part of row 11
        ],
        back: [
          // Rows 1-2: Multi-line item
          { slot: 1, item: '01x Agua 1.5L\nen GAVETA DE PLASTICO', description: '', rowSpan: 2 },
          { slot: 2, item: '', description: '', hidden: true }, // Hidden - part of row 1
          // Rows 3-4: Multi-line item
          { slot: 3, item: '01x Agua 1.5L\nen GAVETA DE PLASTICO', description: '', rowSpan: 2 },
          { slot: 4, item: '', description: '', hidden: true }, // Hidden - part of row 3
          // Rows 5-6: Multi-line item
          { slot: 5, item: '01x Agua 1.5L\nen GAVETA DE PLASTICO', description: '', rowSpan: 2 },
          { slot: 6, item: '', description: '', hidden: true }, // Hidden - part of row 5
          { slot: 7, item: '', description: '' }, // Row 7: Empty
          // Rows 8-10: Multi-line item
          { slot: 8, item: '01x KIT DE HIELO', description: '', rowSpan: 3 },
          { slot: 9, item: '', description: '', hidden: true }, // Hidden - part of row 8
          { slot: 10, item: '', description: '', hidden: true }, // Hidden - part of row 8
          { slot: 11, item: '', description: '' }, // Row 11: Empty
          // Rows 12-14: Multi-line item
          { slot: 12, item: '01x KIT DE HIELO', description: '', rowSpan: 3 },
          { slot: 13, item: '', description: '', hidden: true }, // Hidden - part of row 12
          { slot: 14, item: '', description: '', hidden: true }  // Hidden - part of row 12
        ]
      }
    }
  };

  // All 8 galleys positioned exactly like your image
  const galleys = {
    '1F1C': {
      id: '1F1C',
      name: 'Forward First Class Galley Center',
      position: { top: '20%', left: '50%', transform: 'translateX(-50%)' },
      type: 'First Class',
      configuration: {
        positions: [
          // Top row - Standard boxes (CAJA STD)
          { id: '1F1C20', code: 'Pos 1F1C20 CAJA STD', type: 'standard', category: 'miscellaneous', size: 'medium', 
            contents: ['2x Mantel Carro', '1x Charolas Servicio', '1x Sobrecargos'], row: 0, col: 0 },
          { id: '1F1C21F', code: 'Pos 1F1C21F CAJA STD', type: 'standard', category: 'miscellaneous', size: 'medium', 
            contents: ['2x Hielera Metálica'], row: 0, col: 1 },
          { id: '1F1C22F', code: 'Pos 1F1C22F CAJA STD', type: 'standard', category: 'miscellaneous', size: 'medium', 
            contents: ['1x Canastas Premier'], row: 0, col: 2 },
          { id: '1F1C23F', code: 'Pos 1F1C23F CAJA STD', type: 'standard', category: 'miscellaneous', size: 'medium', 
            contents: ['2x Misc para Café y Té'], row: 0, col: 3 },
          
          // Second row - Standard boxes (CAJA STD)  
          { id: '1F1C21R', code: 'Pos 1F1C21R CAJA STD', type: 'standard', category: 'miscellaneous', size: 'medium', 
            contents: ['2x Hielera Metálica'], row: 1, col: 1 },
          { id: '1F1C22R', code: 'Pos 1F1C22R CAJA STD', type: 'standard', category: 'miscellaneous', size: 'medium', 
            contents: ['1x Canasta Snack Premier (regreso)'], row: 1, col: 2 },
          { id: '1F1C23R', code: 'Pos 1F1C23R CAJA STD', type: 'standard', category: 'empty', size: 'medium', 
            contents: ['Caja STD VACÍA'], row: 1, col: 3 },
          
          // Third row - Ovens (Horno)
          { id: '1F1C08', code: 'Pos 1F1C08 Horno', type: 'oven', category: 'empty', size: 'large', 
            contents: [], row: 2, col: 0 },
          { id: '1F1C10', code: 'Pos 1F1C10 Horno', type: 'oven', category: 'empty', size: 'large', 
            contents: [], row: 2, col: 1 },
          { id: '1F1C12', code: 'Pos 1F1C12 Horno', type: 'oven', category: 'empty', size: 'large', 
            contents: [], row: 2, col: 2 },
          { id: '1F1C14', code: 'Pos 1F1C14 Horno', type: 'oven', category: 'empty', size: 'large', 
            contents: [], row: 2, col: 3 },
          { id: '1F1C16', code: 'Pos 1F1C16', type: 'coffee', category: 'miscellaneous', size: 'small', 
            contents: ['CAFETERA 1x Jarra Metálica'], row: 2, col: 4 },
          { id: '1F1C17', code: 'Pos 1F1C17', type: 'coffee', category: 'empty', size: 'small', 
            contents: ['CAFETERA EXPRESS'], row: 2, col: 5 },
          
          // Bottom row - Carts (Carro 1/1) - These are the clickable trolleys!
          { id: '1F1C01', code: 'Pos 1F1C01 Carro 1/1', type: 'cart', category: 'miscellaneous', size: 'large', 
            contents: ['Nal', '1x Charola de Pan', '1x Kit de platos', '1x Canasta Snack Premier (ida)'], 
            row: 3, col: 0 },
          { id: '1F1C02', code: 'Pos 1F1C02 Carro 1/1', type: 'cart', category: 'miscellaneous', size: 'large', 
            contents: ['Nal', '1x Charola de Pan', '1x Kit de platos'], row: 3, col: 1 },
          { id: '1F1C03', code: 'Pos 1F1C03 Carro 1/1', type: 'cart', category: 'liquids', size: 'large', 
            contents: ['ADELANTE', '01x Refrescos (lata)', '01x Jugos CJ', '01x Leche Light 1 LT', 
                      '01x Kit Agua 1.5L en Gaveta de Plástico', '01x Cerveza Fría Premier'], 
            row: 3, col: 2 },
          { id: '1F1C04', code: 'Pos 1F1C04 Carro 1/1', type: 'cart', category: 'liquids', size: 'large', 
            contents: ['ADELANTE', '01x Refrescos (lata)', '01x Jugos CJ', '01x Hielo'], row: 3, col: 3 },
          { id: '1F1C05', code: 'Pos 1F1C05 Carro 1/1', type: 'cart', category: 'miscellaneous', size: 'large', 
            contents: ['ADELANTE', '5x Cristalería', '2x Tazas para café'], row: 3, col: 4 },
          { id: '1F1C06', code: 'Pos 1F1C06 Carro 1/1', type: 'cart', category: 'bar', size: 'large', 
            contents: ['BAR PREMIER', '1x Cubitera para hielo', '2x Pinzas para Servicio'], row: 3, col: 5 }
        ]
      },
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
      name: 'Forward Crew Rest & Office Area',
      position: { top: '28%', left: '50%', transform: 'translateX(-50%)' },
      type: 'First Class',
      configuration: {
        positions: [
          { id: 'FCR3F', code: 'Pos FCR3 F Carro 1/2', type: 'cart', category: 'miscellaneous', size: 'large', 
            contents: ['2x Mantel Carro', '1x Apios'], row: 0, col: 0 },
          { id: 'FCR3R', code: 'Pos FCR3 R Carro 1/2', type: 'cart', category: 'empty', size: 'large', 
            contents: [], row: 1, col: 0 },
          { id: 'FCR1', code: 'Pos FCR1 Carro 1/1', type: 'cart', category: 'empty', size: 'large', 
            contents: [], row: 0, col: 1 },
          { id: 'FCR2', code: 'Pos FCR2 Carro 1/1', type: 'cart', category: 'empty', size: 'large', 
            contents: [], row: 1, col: 1 }
        ]
      },
      trolleys: []
    },
    '2A1C': {
      id: '2A1C',
      name: 'Mid Forward Business Class Left',
      position: { top: '45%', left: '50%', transform: 'translateX(-50%)' },
      type: 'Business Class',
      configuration: {
        positions: [
          { id: '2A1C13', code: 'Pos 2A1C13 CAJA STD', type: 'standard', category: 'otros', size: 'medium', 
            contents: ['Audífonos Premier'], row: 0, col: 0 },
          { id: '2A1C01', code: 'Pos 2A1C01 Carro 1/2', type: 'cart', category: 'empty', size: 'large', 
            contents: [], row: 3, col: 0 }
        ]
      },
      trolleys: []
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

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'liquids': return 'bg-blue-200 border-blue-300 text-blue-800';
      case 'food': return 'bg-orange-200 border-orange-300 text-orange-800';
      case 'miscellaneous': return 'bg-green-200 border-green-300 text-green-800';
      case 'bar': return 'bg-red-200 border-red-300 text-red-800';
      case 'otros': return 'bg-purple-200 border-purple-300 text-purple-800';
      case 'empty': return 'bg-gray-100 border-gray-300 text-gray-600';
      default: return 'bg-gray-100 border-gray-300 text-gray-600';
    }
  };

  const getPositionSize = (size: string) => {
    switch (size) {
      case 'small': return 'h-16';
      case 'medium': return 'h-20';
      case 'large': return 'h-32';
      default: return 'h-20';
    }
  };

  const handleTrolleyClick = (position: any) => {
    console.log('Trolley clicked:', position);
    
    // Check if this trolley has a configuration
    if (trolleyConfigurations[position.id]) {
      setSelectedTrolley({
        id: position.id,
        code: position.code,
        cartType: position.type,
        contents: position.contents || [],
        configuration: trolleyConfigurations[position.id],
        hasConfiguration: true
      });
    } else {
      // Fallback to old modal format
      setSelectedTrolley({
        id: position.id,
        code: position.code,
        cartType: position.type,
        contents: position.contents || [],
        items: (position.contents || []).map((content: string, index: number) => ({
          name: content,
          position: `Position ${index + 1}`,
          quantity: 1
        })),
        hasConfiguration: false
      });
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      {selectedGalley ? (
        // Galley Detail View
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
                <h2 className="text-lg font-semibold">{galleys[selectedGalley as keyof typeof galleys]?.name}</h2>
                <p className="text-sm text-gray-600">Service Type: {galleys[selectedGalley as keyof typeof galleys]?.type}</p>
              </div>
            </div>
          </div>

          {/* Galley Configuration Grid */}
          <div className="px-4 py-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <h3 className="font-semibold">Galley Configuration</h3>
                    <p className="text-sm text-gray-600">Physical layout and storage positions</p>
                  </div>
                  <div className="text-sm">
                    <span className="font-medium">Weight: 538.00</span>
                    <button className="ml-2 px-2 py-1 bg-blue-600 text-white text-xs rounded">Report</button>
                  </div>
                </div>
                
                {/* Legend */}
                <div className="flex flex-wrap gap-2 text-xs">
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-blue-200 border border-blue-300 rounded"></div>
                    <span>Liquids</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-orange-200 border border-orange-300 rounded"></div>
                    <span>Food</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-green-200 border border-green-300 rounded"></div>
                    <span>Miscellaneous</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-red-200 border border-red-300 rounded"></div>
                    <span>Bar</span>
                  </div>
                </div>
              </div>

              {/* Configuration Grid */}
              <div className="p-4">
                {galleys[selectedGalley as keyof typeof galleys]?.configuration ? (
                  <div className="space-y-2">
                    {selectedGalley === 'OFCR' ? (
                      // OFCR Layout
                      <div className="flex gap-4 max-w-4xl mx-auto">
                        <div className="flex flex-col gap-3 flex-1">
                          {galleys[selectedGalley as keyof typeof galleys].configuration?.positions
                            .filter((pos: any) => pos.col === 0)
                            .sort((a: any, b: any) => a.row - b.row)
                            .map((position: any) => (
                            <button
                              key={position.id}
                              onClick={() => handleTrolleyClick(position)}
                              className={`p-4 border-2 rounded-lg text-xs font-medium transition-all hover:scale-105 relative ${
                                getCategoryColor(position.category)
                              } h-32 flex items-center justify-center`}
                            >
                              <div className="text-center">
                                <div className="text-[11px] font-bold">{position.code}</div>
                                {trolleyConfigurations[position.id] && (
                                  <div className="absolute top-1 right-1 w-3 h-3 bg-blue-600 rounded-full flex items-center justify-center">
                                    <i className="ri-settings-line text-white text-[8px]"></i>
                                  </div>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                        
                        <div className="grid grid-cols-2 gap-3 flex-1">
                          {galleys[selectedGalley as keyof typeof galleys].configuration?.positions
                            .filter((pos: any) => pos.col === 1)
                            .sort((a: any, b: any) => a.row - b.row)
                            .map((position: any) => (
                            <button
                              key={position.id}
                              onClick={() => handleTrolleyClick(position)}
                              className={`p-3 border-2 rounded-lg text-xs font-medium transition-all hover:scale-105 relative ${
                                getCategoryColor(position.category)
                              } h-64 flex items-center justify-center`}
                            >
                              <div className="text-center">
                                <div className="text-[11px] font-bold">{position.code}</div>
                                {trolleyConfigurations[position.id] && (
                                  <div className="absolute top-1 right-1 w-3 h-3 bg-blue-600 rounded-full flex items-center justify-center">
                                    <i className="ri-settings-line text-white text-[8px]"></i>
                                  </div>
                                )}
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : (
                      // Standard Grid Layout
                      <div className="space-y-2">
                        {[0, 1, 2, 3].map(rowIndex => {
                          const rowPositions = galleys[selectedGalley as keyof typeof galleys].configuration?.positions
                            .filter((pos: any) => pos.row === rowIndex)
                            .sort((a: any, b: any) => a.col - b.col);
                          
                          if (!rowPositions || rowPositions.length === 0) return null;
                          
                          const maxCols = Math.max(...rowPositions.map((pos: any) => pos.col)) + 1;
                          const gridCols = maxCols <= 4 ? 'grid-cols-4' : 'grid-cols-6';
                          
                          return (
                            <div key={rowIndex} className={`grid ${gridCols} gap-2`}>
                              {rowPositions.map((position: any) => (
                                <button
                                  key={position.id}
                                  onClick={() => handleTrolleyClick(position)}
                                  className={`p-2 border-2 rounded-lg text-xs font-medium transition-all hover:scale-105 relative ${
                                    getCategoryColor(position.category)
                                  } ${getPositionSize(position.size)} flex items-center justify-center`}
                                >
                                  <div className="text-center">
                                    <div className="text-[10px] font-bold">{position.code}</div>
                                    {trolleyConfigurations[position.id] && (
                                      <div className="absolute top-1 right-1 w-3 h-3 bg-blue-600 rounded-full flex items-center justify-center">
                                        <i className="ri-settings-line text-white text-[8px]"></i>
                                      </div>
                                    )}
                                  </div>
                                </button>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Configuration layout not available for this galley</p>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      ) : (
        // Main Galley Map View
        <div className="pt-16 pb-20">
          <div className="px-4 py-4 bg-white border-b">
            <h1 className="text-xl font-semibold">Aircraft Galley Map</h1>
            <p className="text-sm text-gray-600">8 galleys total - Tap any galley to explore</p>
          </div>

          <div className="px-4 py-6">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden">
              <div className="p-4 border-b">
                <h2 className="text-lg font-semibold">Boeing 777-300ER Layout</h2>
                <p className="text-sm text-gray-600">Complete galley overview</p>
              </div>

              <div className="relative bg-gradient-to-b from-slate-100 to-slate-200 flex justify-center items-center py-8">
                <div className="relative" style={{ width: '400px', height: '700px' }}>
                  <div className="absolute bg-gray-300 shadow-xl"
                       style={{
                         width: '230px',
                         height: '675px',
                         left: '50%',
                         top: '40px',
                         transform: 'translateX(-50%)',
                         borderRadius: '100px 100px 30px 30px',
                         background: 'linear-gradient(to bottom, #d1d5db, #9ca3af)'
                       }}>
                  </div>

                  {Object.values(galleys).map((galley: any) => (
                    <div key={galley.id} className="absolute" style={galley.position}>
                      <button
                        onClick={() => setSelectedGalley(galley.id)}
                        className={`relative w-20 h-10 rounded-lg border-2 flex flex-col items-center justify-center text-[9px] font-bold transition-all transform hover:scale-110 shadow-lg ${
                          getGalleyTypeColor(galley.type)
                        }`}
                      >
                        <div className="text-[10px] font-extrabold leading-tight">{galley.id}</div>
                        <div className="text-[7px] opacity-90 leading-tight">{galley.type.replace(' Class', '').replace(' ', '')}</div>
                      </button>
                    </div>
                  ))}
                </div>
              </div>

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
                  <p className="text-xs text-gray-600">{galley.trolleys?.length || 0} trolley{(galley.trolleys?.length || 0) !== 1 ? 's' : ''}</p>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* Enhanced Trolley Modal */}
      {selectedTrolley && (
        <div className="fixed inset-0 bg-black/50 z-[70] flex items-end">
          <div className="bg-white w-full rounded-t-2xl max-h-[90vh] overflow-hidden">
            <div className="p-6 border-b">
              <div className="flex items-center justify-between mb-4">
                <div>
                  <h2 className="text-xl font-semibold">
                    {selectedTrolley.configuration?.name || selectedTrolley.code || 'Cart'} 
                  </h2>
                  <p className="text-sm text-gray-600">Position: {selectedTrolley.code}</p>
                </div>
                <button
                  onClick={() => setSelectedTrolley(null)}
                  className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center ml-4"
                >
                  <i className="ri-close-line text-gray-600"></i>
                </button>
              </div>

              <div className="inline-flex items-center px-3 py-1 rounded-full text-white text-sm font-medium bg-blue-500">
                <i className="ri-shopping-cart-line mr-2"></i>
                {selectedTrolley.configuration?.type || selectedTrolley.cartType || 'Standard Cart'}
              </div>
            </div>

            <div className="overflow-y-auto max-h-[calc(90vh-180px)]">
              <div className="p-6">
                {selectedTrolley.hasConfiguration && selectedTrolley.configuration ? (
                  // NEW: Trolley Configuration View
                  <>
                    {/* Trolley Layout Table */}
                    <div className="bg-white border-2 border-gray-800 rounded-lg overflow-hidden mb-6">
                      <div className="bg-gray-800 text-white text-center py-2 font-bold">
                        Carro Full Size
                      </div>
                      
                      {/* Table */}
                      <table className="w-full border-collapse">
                        <thead className="bg-gray-800 text-white">
                          <tr>
                            <th className="w-10 py-2 border-r border-white"></th>
                            <th className="py-2 font-bold text-center border-r border-white">Front</th>
                            <th className="py-2 font-bold text-center">Rear</th>
                          </tr>
                        </thead>
                        <tbody>
                          {/* Row 1-3: Multi-row items */}
                          <tr className="border-b border-gray-800">
                            <td className="w-10 text-center bg-gray-100 border-r border-gray-800 font-bold text-sm align-top py-3" rowSpan={3}>
                              1
                            </td>
                            <td className="p-3 text-sm border-r border-gray-800 bg-white align-top" rowSpan={3}>
                              <div className="font-medium">
                                <div>1x Jugos CJ BOEING</div>
                                <div className="mt-1">1x Leche Light 1 LT ( CJ )*</div>
                                <div className="mt-1">(Aplica de acuerdo a QTY en Matriz)</div>
                              </div>
                            </td>
                            <td className="p-3 text-sm bg-white align-top" rowSpan={2}>
                              <div className="font-medium">
                                <div>01x Agua 1.5L</div>
                                <div className="mt-1">en GAVETA DE PLASTICO</div>
                              </div>
                            </td>
                          </tr>
                          {/* Row 2 - no content, handled by rowspan above */}
                          <tr className="border-b border-gray-800"></tr>
                          
                          {/* Row 3 - new rear item starts */}
                          <tr className="border-b border-gray-800">
                            <td className="p-3 text-sm bg-white align-top" rowSpan={2}>
                              <div className="font-medium">
                                <div>01x Agua 1.5L</div>
                                <div className="mt-1">en GAVETA DE PLASTICO</div>
                              </div>
                            </td>
                          </tr>
                          
                          {/* Row 4 - empty front */}
                          <tr className="border-b border-gray-800">
                            <td className="w-10 text-center bg-gray-100 border-r border-gray-800 font-bold text-sm py-3">4</td>
                            <td className="p-3 text-sm border-r border-gray-800 bg-white"></td>
                          </tr>
                          
                          {/* Row 5-6: Front item + Rear item */}
                          <tr className="border-b border-gray-800">
                            <td className="w-10 text-center bg-gray-100 border-r border-gray-800 font-bold text-sm align-top py-3" rowSpan={2}>5</td>
                            <td className="p-3 text-sm border-r border-gray-800 bg-white align-top" rowSpan={2}>
                              <div className="font-medium">
                                <div>01x Agua 1.5L</div>
                                <div className="mt-1">en GAVETA DE PLASTICO</div>
                              </div>
                            </td>
                            <td className="p-3 text-sm bg-white align-top" rowSpan={2}>
                              <div className="font-medium">
                                <div>01x Agua 1.5L</div>
                                <div className="mt-1">en GAVETA DE PLASTICO</div>
                              </div>
                            </td>
                          </tr>
                          <tr className="border-b border-gray-800"></tr>
                          
                          {/* Row 7 - empty */}
                          <tr className="border-b border-gray-800">
                            <td className="w-10 text-center bg-gray-100 border-r border-gray-800 font-bold text-sm py-3">7</td>
                            <td className="p-3 text-sm border-r border-gray-800 bg-white"></td>
                            <td className="p-3 text-sm bg-white"></td>
                          </tr>
                          
                          {/* Row 8-10: Front item + Rear item starts */}
                          <tr className="border-b border-gray-800">
                            <td className="w-10 text-center bg-gray-100 border-r border-gray-800 font-bold text-sm align-top py-3" rowSpan={3}>8</td>
                            <td className="p-3 text-sm border-r border-gray-800 bg-white align-top" rowSpan={3}>
                              <div className="font-medium">01x Refrescos ( lata )</div>
                            </td>
                            <td className="p-3 text-sm bg-white align-top" rowSpan={3}>
                              <div className="font-medium">01x KIT DE HIELO</div>
                            </td>
                          </tr>
                          <tr className="border-b border-gray-800"></tr>
                          <tr className="border-b border-gray-800"></tr>
                          
                          {/* Row 11 - empty front, empty rear */}
                          <tr className="border-b border-gray-800">
                            <td className="w-10 text-center bg-gray-100 border-r border-gray-800 font-bold text-sm py-3">11</td>
                            <td className="p-3 text-sm border-r border-gray-800 bg-white align-top" rowSpan={4}>
                              <div className="font-medium">01x CERVEZA FRÍA PREMIER</div>
                            </td>
                            <td className="p-3 text-sm bg-white"></td>
                          </tr>
                          
                          {/* Row 12-14: Rear item */}
                          <tr className="border-b border-gray-800">
                            <td className="w-10 text-center bg-gray-100 border-r border-gray-800 font-bold text-sm align-top py-3" rowSpan={3}>12</td>
                            <td className="p-3 text-sm bg-white align-top" rowSpan={3}>
                              <div className="font-medium">01x KIT DE HIELO</div>
                            </td>
                          </tr>
                          <tr className="border-b border-gray-800"></tr>
                          <tr></tr>
                        </tbody>
                      </table>
                    </div>

                    {/* Combined Current Contents & Detailed Inventory */}
                    <h3 className="font-medium text-gray-900 mb-3">Current Inventory</h3>
                    <div className="space-y-2">
                      {selectedTrolley.contents.map((item: any, index: number) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                        >
                          <div className="flex-1">
                            <span className="font-medium text-gray-900">{item}</span>
                            <div className="text-xs text-gray-600 mt-1">
                              Position {index + 1} • Status: Stocked
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                            <span className="text-sm text-green-600 font-medium">Available</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </>
                ) : (
                  // Fallback to original view for trolleys without configuration
                  <>
                    <h3 className="font-medium text-gray-900 mb-3">Current Inventory</h3>
                    {selectedTrolley.contents && selectedTrolley.contents.length > 0 ? (
                      <div className="space-y-2">
                        {selectedTrolley.contents.map((item: any, index: number) => (
                          <div
                            key={index}
                            className="flex items-center justify-between p-3 bg-gray-50 rounded-lg"
                          >
                            <div className="flex-1">
                              <span className="font-medium text-gray-900">{item}</span>
                              <div className="text-xs text-gray-600 mt-1">
                                Position {index + 1} • Status: Stocked
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                              <span className="text-sm text-green-600 font-medium">Available</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-8 text-gray-500">
                        <p>No contents listed for this position</p>
                      </div>
                    )}
                  </>
                )}
              </div>
            </div>

            <div className="p-6 pt-4 border-t bg-gray-50">
              <div className="flex space-x-3">
                <Link
                  href="/issues"
                  className="flex-1 flex items-center justify-center py-3 text-orange-600 hover:bg-orange-50 rounded-lg transition-colors border border-orange-200"
                  onClick={() => setSelectedTrolley(null)}
                >
                  <i className="ri-error-warning-line mr-2"></i>
                  Report Issue
                </Link>
                {selectedTrolley.hasConfiguration && (
                  <button
                    onClick={() => {
                      console.log('Edit configuration for', selectedTrolley.id);
                    }}
                    className="flex-1 flex items-center justify-center py-3 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors border border-blue-200"
                  >
                    <i className="ri-edit-line mr-2"></i>
                    Edit Configuration
                  </button>
                )}
              </div>
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