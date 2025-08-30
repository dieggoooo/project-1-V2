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

  // All 8 galleys positioned exactly like your image
  const galleys = {
    '1F1C': {
      id: '1F1C',
      name: 'Forward First Class Galley Center',
      position: { top: '20%', left: '50%', transform: 'translateX(-50%)' },
      type: 'First Class',
      configuration: {
        // Grid layout based on the image - 4 columns, multiple rows
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
          
          // Bottom row - Carts (Carro 1/1)
          { id: '1F1C01', code: 'Pos 1F1C01 Carro 1/1', type: 'cart', category: 'miscellaneous', size: 'large', 
            contents: ['Nal', '1x Charola de Pan', '1x Kit de platos', '1x Canasta Snack Premier (ida)', 
                      'si aplica) 1x Charola de Pan', 'si aplica PD) 1x Kit de platos', '1x Canasta Snack Premier (regreso)', 
                      '2x Canasta Snack Premier Inter', '1x Canasta Snack Premier (ida)'], row: 3, col: 0 },
          { id: '1F1C02', code: 'Pos 1F1C02 Carro 1/1', type: 'cart', category: 'miscellaneous', size: 'large', 
            contents: ['Nal', '1x Charola de Pan', '1x Kit de platos', '1x Canasta Snack Premier (ida)', 
                      'si aplica) 1x Charola de Pan', 'si aplica PD) 1x Kit de platos', '1x Canasta Snack Premier (regreso)', 
                      '2x Canasta Snack Premier Inter', '1x Canasta Snack Premier (ida)'], row: 3, col: 1 },
          { id: '1F1C03', code: 'Pos 1F1C03 Carro 1/1', type: 'cart', category: 'liquids', size: 'large', 
            contents: ['ADELANTE', '01x Refrescos (lata)', '01x Jugos CJ', '01x Leche Light 1 LT', 'CJ', 
                      'Aplica de acuerdo a QTY en Matriz', '01x Kit Agua 1.5L en Gaveta de Plástico', 
                      '01x Cerveza Fría Premier ATRÁS', '01x Refrescos (lata)', '03x Kit Agua 1.5L en Gaveta de Plástico', '01x Hielo'], row: 3, col: 2 },
          { id: '1F1C04', code: 'Pos 1F1C04 Carro 1/1', type: 'cart', category: 'liquids', size: 'large', 
            contents: ['ADELANTE', '01x Refrescos (lata)', '01x Jugos CJ', '01x Kit Agua 1.5L en Gaveta de Plástico', 
                      '01x Cerveza Fría Premier ATRÁS', '01x Refrescos (lata)', '03x Kit Agua 1.5L en Gaveta de Plástico', 
                      'en Gaveta de Plástico', '01x Hielo'], row: 3, col: 3 },
          { id: '1F1C05', code: 'Pos 1F1C05 Carro 1/1', type: 'cart', category: 'miscellaneous', size: 'large', 
            contents: ['ADELANTE', '5x Cristalería', '2x Tazas para café ATRÁS', '5x Cristalería', '2x Tazas para café'], row: 3, col: 4 },
          { id: '1F1C06', code: 'Pos 1F1C06 Carro 1/1', type: 'cart', category: 'bar', size: 'large', 
            contents: ['BAR PREMIER', '1x Cubitera para hielo Nal', '2x Pinzas para Servicio Inter', 
                      'Formas Migratorias'], row: 3, col: 5 }
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
          // Left column - stacked full-size carts
          { id: 'FCR3F', code: 'Pos FCR3 F Carro 1/2', type: 'cart', category: 'miscellaneous', size: 'large', 
            contents: ['2x Mantel Carro', '1x Apios', '1x Charolas Servicio', '2x Misc para Café y Té'], row: 0, col: 0 },
          { id: 'FCR3R', code: 'Pos FCR3 R Carro 1/2', type: 'cart', category: 'empty', size: 'large', 
            contents: [], row: 1, col: 0 },
          
          // Right side - side by side full-size carts  
          { id: 'FCR1', code: 'Pos FCR1 Carro 1/1', type: 'cart', category: 'empty', size: 'large', 
            contents: [], row: 0, col: 1 },
          { id: 'FCR2', code: 'Pos FCR2 Carro 1/1', type: 'cart', category: 'empty', size: 'large', 
            contents: [], row: 1, col: 1 }
        ]
      },
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
      name: 'Mid Forward Business Class Left',
      position: { top: '45%', left: '50%', transform: 'translateX(-50%)' },
      type: 'Business Class',
      configuration: {
        positions: [
          // Row 0 - Top row standard boxes
          { id: '2A1C13', code: 'Pos 2A1C13 CAJA STD', type: 'standard', category: 'otros', size: 'medium', 
            contents: ['(si aplica) Audífonos Premier STN - MEX'], row: 0, col: 0 },
          { id: '2A1C14', code: 'Pos 2A1C14 CAJA STD', type: 'standard', category: 'otros', size: 'medium', 
            contents: ['(si aplica) Audífonos Premier STN - MEX'], row: 0, col: 1 },
          { id: '2A1C15', code: 'Pos 2A1C15 CAJA STD', type: 'standard', category: 'empty', size: 'medium', 
            contents: [], row: 0, col: 2 },
          { id: '2A1C16', code: 'Pos 2A1C16 CAJA STD', type: 'standard', category: 'miscellaneous', size: 'medium', 
            contents: ['1x Canastas Premier'], row: 0, col: 3 },
          
          // Row 1 - Second row standard boxes
          { id: '2A1C05', code: 'Pos 2A1C05 CAJA STD', type: 'standard', category: 'otros', size: 'medium', 
            contents: ['(si aplica) Audífonos Premier MEX - STN'], row: 1, col: 0 },
          { id: '2A1C07', code: 'Pos 2A1C07 CAJA STD', type: 'standard', category: 'otros', size: 'medium', 
            contents: ['(si aplica) Audífonos Premier MEX - STN'], row: 1, col: 1 },
          { id: '2A1C09', code: 'Pos 2A1C09 CAJA STD', type: 'standard', category: 'empty', size: 'medium', 
            contents: [], row: 1, col: 2 },
          { id: '2A1C11', code: 'Pos 2A1C11 CAJA STD', type: 'standard', category: 'empty', size: 'medium', 
            contents: [], row: 1, col: 3 },
          
          // Row 2 - Third row with ice drawer
          { id: '2A1C06', code: 'Pos 2A1C06 CAJA STD', type: 'standard', category: 'empty', size: 'medium', 
            contents: [], row: 2, col: 0 },
          { id: '2A1C08', code: 'Pos 2A1C08 CAJA STD', type: 'standard', category: 'empty', size: 'medium', 
            contents: [], row: 2, col: 1 },
          { id: '2A1C10', code: 'Pos 2A1C10 CAJA STD', type: 'standard', category: 'empty', size: 'medium', 
            contents: [], row: 2, col: 2 },
          { id: '2A1C12', code: 'Pos 2A1C12 ICE DRAWER', type: 'drawer', category: 'empty', size: 'small', 
            contents: [], row: 2, col: 3 },
          
          // Row 3 - Bottom row with carts and waste
          { id: '2A1C01', code: 'Pos 2A1C01 Carro 1/2', type: 'cart', category: 'empty', size: 'large', 
            contents: [], row: 3, col: 0 },
          { id: '2A1C02', code: 'Pos 2A1C02 Carro 1/2', type: 'cart', category: 'empty', size: 'large', 
            contents: [], row: 3, col: 1 },
          { id: '2A1C03', code: 'Pos 2A1C03 Carro 1/2', type: 'cart', category: 'empty', size: 'large', 
            contents: [], row: 3, col: 2 },
          { id: '2A1C04', code: 'Pos 2A1C04 WASTE', type: 'waste', category: 'empty', size: 'large', 
            contents: [], row: 3, col: 3 }
        ]
      },
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
      name: 'Mid Forward Business Class Right',
      position: { top: '53%', left: '50%', transform: 'translateX(-50%)' },
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
      id: '4A1C-center',
      name: 'Aft Center Galley',
      position: { top: '82%', left: '50%', transform: 'translateX(-50%)' },
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
      name: 'Aft Galley Left',
      position: { top: '88%', left: '35%', transform: 'translateX(-50%)' },
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
      id: '4A1C-right',
      name: 'Aft Galley Right',
      position: { top: '88%', right: '35%', transform: 'translateX(50%)' },
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
      id: '4A1C-bottom',
      name: 'Aft Bottom Galley',
      position: { top: '94%', left: '50%', transform: 'translateX(-50%)' },
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

  const getCartTypeColor = (cartType: string) => {
    if (cartType.includes('First Class')) return 'bg-purple-500 border-purple-600';
    if (cartType.includes('Business Class')) return 'bg-blue-500 border-blue-600';
    if (cartType.includes('Economy')) return 'bg-green-500 border-green-600';
    if (cartType.includes('Utility')) return 'bg-gray-500 border-gray-600';
    return 'bg-gray-500 border-gray-600';
  };

  const getPositionSize = (size: string) => {
    switch (size) {
      case 'small': return 'h-16';
      case 'medium': return 'h-20';
      case 'large': return 'h-32';
      default: return 'h-20';
    }
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
                  <div className="flex items-center space-x-1">
                    <div className="w-3 h-3 bg-purple-200 border border-purple-300 rounded"></div>
                    <span>Otros</span>
                  </div>
                </div>
              </div>

              {/* Configuration Grid */}
              <div className="p-4">
                {'configuration' in galley && galley.configuration ? (
                  <div className="space-y-2">
                    {/* Dynamic grid based on galley type */}
                    {galley.id === 'OFCR' ? (
                      // OFCR - Left column (2 stacked) + Right side (2 side by side)
                      <div className="flex gap-4 max-w-4xl mx-auto">
                        {/* Left column - stacked full-size carts */}
                        <div className="flex flex-col gap-3 flex-1">
                          {galley.configuration.positions
                            .filter((pos: any) => pos.col === 0)
                            .sort((a: any, b: any) => a.row - b.row)
                            .map((position: any) => (
                            <button
                              key={position.id}
                              onClick={() => setSelectedTrolley({
                                id: position.id,
                                code: position.code,
                                cartType: position.type,
                                contents: position.contents || [],
                                items: (position.contents || []).map((content: string, index: number) => ({
                                  name: content,
                                  position: `Position ${index + 1}`,
                                  quantity: 1
                                }))
                              })}
                              className={`p-4 border-2 rounded-lg text-xs font-medium transition-all hover:scale-105 ${
                                getCategoryColor(position.category)
                              } h-32 flex items-center justify-center`}
                            >
                              <div className="text-center">
                                <div className="text-[11px] font-bold">{position.code}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                        
                        {/* Right side - side by side full-size carts */}
                        <div className="grid grid-cols-2 gap-3 flex-1">
                          {galley.configuration.positions
                            .filter((pos: any) => pos.col === 1)
                            .sort((a: any, b: any) => a.row - b.row)
                            .map((position: any) => (
                            <button
                              key={position.id}
                              onClick={() => setSelectedTrolley({
                                id: position.id,
                                code: position.code,
                                cartType: position.type,
                                contents: position.contents || [],
                                items: (position.contents || []).map((content: string, index: number) => ({
                                  name: content,
                                  position: `Position ${index + 1}`,
                                  quantity: 1
                                }))
                              })}
                              className={`p-3 border-2 rounded-lg text-xs font-medium transition-all hover:scale-105 ${
                                getCategoryColor(position.category)
                              } h-64 flex items-center justify-center`}
                            >
                              <div className="text-center">
                                <div className="text-[11px] font-bold">{position.code}</div>
                              </div>
                            </button>
                          ))}
                        </div>
                      </div>
                    ) : galley.id === '2A1C' ? (
                      // 2A1C - 4x4 grid layout
                      <div className="space-y-2">
                        {[0, 1, 2, 3].map(rowIndex => {
                          const rowPositions = galley.configuration!.positions
                            .filter((pos: any) => pos.row === rowIndex)
                            .sort((a: any, b: any) => a.col - b.col);
                          
                          if (rowPositions.length === 0) return null;
                          
                          return (
                            <div key={rowIndex} className="grid grid-cols-4 gap-2">
                              {rowPositions.map((position: any) => (
                                <button
                                  key={position.id}
                                  onClick={() => setSelectedTrolley({
                                    id: position.id,
                                    code: position.code,
                                    cartType: position.type,
                                    contents: position.contents || [],
                                    items: (position.contents || []).map((content: string, index: number) => ({
                                      name: content,
                                      position: `Position ${index + 1}`,
                                      quantity: 1
                                    }))
                                  })}
                                  className={`p-2 border-2 rounded-lg text-xs font-medium transition-all hover:scale-105 ${
                                    getCategoryColor(position.category)
                                  } ${getPositionSize(position.size)} flex items-center justify-center`}
                                >
                                  <div className="text-center">
                                    <div className="text-[9px] font-bold">{position.code}</div>
                                  </div>
                                </button>
                              ))}
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      // 1F1C and other galleys - 6-column grid
                      [0, 1, 2, 3].map(rowIndex => {
                        const rowPositions = galley.configuration!.positions
                          .filter((pos: any) => pos.row === rowIndex)
                          .sort((a: any, b: any) => a.col - b.col);
                        
                        if (rowPositions.length === 0) return null;
                        
                        return (
                          <div key={rowIndex} className="grid grid-cols-6 gap-2">
                            {rowPositions.map((position: any) => (
                              <button
                                key={position.id}
                                onClick={() => setSelectedTrolley({
                                  id: position.id,
                                  code: position.code,
                                  cartType: position.type,
                                  contents: position.contents || [],
                                  items: (position.contents || []).map((content: string, index: number) => ({
                                    name: content,
                                    position: `Position ${index + 1}`,
                                    quantity: 1
                                  }))
                                })}
                                className={`p-2 border-2 rounded-lg text-xs font-medium transition-all hover:scale-105 ${
                                  getCategoryColor(position.category)
                                } ${getPositionSize(position.size)} flex items-center justify-center`}
                              >
                                <div className="text-center">
                                  <div className="text-[10px] font-bold">{position.code}</div>
                                </div>
                              </button>
                            ))}
                          </div>
                        );
                      })
                    )}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <p>Configuration layout not available for this galley</p>
                    <p className="text-sm mt-2">Showing trolley layout instead</p>
                  </div>
                )}
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

            {/* Clean Aircraft Body matching your design with extended bottom */}
            <div className="relative bg-gradient-to-b from-slate-100 to-slate-200 flex justify-center items-center py-8">
              {/* Fixed-size aircraft container */}
              <div className="relative" style={{ width: '400px', height: '700px' }}>
                {/* Main aircraft fuselage - extended to cover all galleys */}
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

                {/* Wings - realistic swept wings matching your image */}
                <div className="absolute bg-gray-300 shadow-lg"
                     style={{
                       width: '120px',
                       height: '80px',
                       left: '-60px',
                       top: '45%',
                       transform: 'translateY(-50%)',
                       clipPath: 'polygon(30% 20%, 100% 30%, 100% 70%, 30% 80%)',
                       background: 'linear-gradient(to right, #9ca3af, #d1d5db)'
                     }}>
                </div>
                <div className="absolute bg-gray-300 shadow-lg"
                     style={{
                       width: '120px',
                       height: '80px',
                       right: '-60px',
                       top: '45%',
                       transform: 'translateY(-50%)',
                       clipPath: 'polygon(70% 20%, 0% 30%, 0% 70%, 70% 80%)',
                       background: 'linear-gradient(to left, #9ca3af, #d1d5db)'
                     }}>
                </div>

                {/* Galleys positioned with detailed labels */}
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
                    {/* Detailed label popup on hover */}
                    <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 opacity-0 hover:opacity-100 transition-opacity pointer-events-none">
                      <div className="bg-black text-white text-xs rounded-lg px-2 py-1 whitespace-nowrap">
                        {galley.name}
                      </div>
                      <div className="w-2 h-2 bg-black transform rotate-45 absolute top-full left-1/2 -translate-x-1/2 -translate-y-1"></div>
                    </div>
                  </div>
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