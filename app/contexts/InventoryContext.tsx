'use client';

import React, { createContext, useContext, useState } from 'react';

export interface Position {
  id: string;
  positionCode: string;
  quantity: number;
  consumed: number;
  available: number;
  percentageAvailable: number;
  unitOfMeasure: string;
  galleyName: string;
  trolleyName: string;
}

export interface InventoryItem {
  id: number;
  name: string;
  code: string;
  category: string;
  subcategory?: string;
  type: string;
  common: boolean;
  description?: string;
  positions: Position[];
  checked?: boolean;
}

interface InventoryContextType {
  items: InventoryItem[];
  updatePositionConsumption: (itemId: number, positionId: string, newConsumed: number) => void;
  toggleItemChecked: (itemId: number) => void;
  getItemTotals: (itemId: number) => {
    totalQuantity: number;
    totalConsumed: number;
    totalAvailable: number;
    totalPercentage: number;
  };
  addItem: (newItemData: {
    name: string;
    code: string;
    category: string;
    subcategory?: string;
    type: string;
    quantity: number;
    unitOfMeasure: string;
    positionCode: string;
    galleyName: string;
    trolleyName: string;
  }) => void;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>([
    {
      id: 1,
      name: 'BAG OF AMERICAN COFFEE (DECAF) 2.52KG FINE GRIND 70G',
      code: 'COF0407',
      category: 'beverages',
      subcategory: 'hot-drinks',
      type: 'Supplies',
      common: true,
      description: 'Premium decaffeinated coffee blend for first-class service',
      checked: false,
      positions: [
        { 
          id: '1', 
          positionCode: '1F1C23F', 
          quantity: 3, 
          consumed: 2, 
          available: 1, 
          percentageAvailable: 33, 
          unitOfMeasure: 'bags',
          galleyName: 'Forward Galley',
          trolleyName: 'Trolley 1/1'
        },
        { 
          id: '2', 
          positionCode: '1F1C23R', 
          quantity: 3, 
          consumed: 1, 
          available: 2, 
          percentageAvailable: 67, 
          unitOfMeasure: 'bags',
          galleyName: 'Forward Galley',
          trolleyName: 'Trolley 1/1'
        },
        { 
          id: '3', 
          positionCode: '4A1C28', 
          quantity: 3, 
          consumed: 3, 
          available: 0, 
          percentageAvailable: 0, 
          unitOfMeasure: 'bags',
          galleyName: 'Aft Galley',
          trolleyName: 'Trolley 2/2'
        },
        { 
          id: '4', 
          positionCode: '4A1C29', 
          quantity: 3, 
          consumed: 2, 
          available: 1, 
          percentageAvailable: 33, 
          unitOfMeasure: 'bags',
          galleyName: 'Aft Galley',
          trolleyName: 'Trolley 2/2'
        },
      ]
    },
    {
      id: 2,
      name: 'Dom Pérignon 2012',
      code: 'CHA0001',
      category: 'beverages',
      subcategory: 'alcoholic',
      type: 'Champagne',
      common: false,
      description: 'Premium vintage champagne for first-class service',
      checked: false,
      positions: [
        { 
          id: '1', 
          positionCode: '1F1C01', 
          quantity: 6, 
          consumed: 2, 
          available: 4, 
          percentageAvailable: 67, 
          unitOfMeasure: 'bottles',
          galleyName: 'Forward Galley',
          trolleyName: 'Trolley 1/1'
        },
      ]
    },
    {
      id: 3,
      name: 'Hennessy Paradis',
      code: 'SPR0001',
      category: 'beverages',
      subcategory: 'alcoholic',
      type: 'Cognac',
      common: false,
      description: 'Ultra-premium cognac for exclusive service',
      checked: false,
      positions: [
        { 
          id: '1', 
          positionCode: '1F1C02', 
          quantity: 2, 
          consumed: 0, 
          available: 2, 
          percentageAvailable: 100, 
          unitOfMeasure: 'bottles',
          galleyName: 'Forward Galley',
          trolleyName: 'Trolley 1/1'
        },
        { 
          id: '2', 
          positionCode: '2A1C05', 
          quantity: 2, 
          consumed: 1, 
          available: 1, 
          percentageAvailable: 50, 
          unitOfMeasure: 'bottles',
          galleyName: 'Business Galley',
          trolleyName: 'Trolley 1/2'
        },
      ]
    },
    {
      id: 4,
      name: 'Johnnie Walker Blue',
      code: 'WHI0001',
      category: 'beverages',
      subcategory: 'alcoholic',
      type: 'Whisky',
      common: false,
      description: 'Premium blended Scotch whisky',
      checked: false,
      positions: [
        { 
          id: '1', 
          positionCode: '1F1C06', 
          quantity: 2, 
          consumed: 1, 
          available: 1, 
          percentageAvailable: 50, 
          unitOfMeasure: 'bottles',
          galleyName: 'Forward Galley',
          trolleyName: 'Bar Cart'
        },
      ]
    },
    {
      id: 5,
      name: 'Grey Goose Vodka',
      code: 'VOD0001',
      category: 'beverages',
      subcategory: 'alcoholic',
      type: 'Vodka',
      common: false,
      description: 'Premium French vodka',
      checked: false,
      positions: [
        { 
          id: '1', 
          positionCode: '1F1C06', 
          quantity: 2, 
          consumed: 1, 
          available: 1, 
          percentageAvailable: 50, 
          unitOfMeasure: 'bottles',
          galleyName: 'Forward Galley',
          trolleyName: 'Bar Cart'
        },
        { 
          id: '2', 
          positionCode: '2A1C06', 
          quantity: 1, 
          consumed: 1, 
          available: 0, 
          percentageAvailable: 0, 
          unitOfMeasure: 'bottles',
          galleyName: 'Business Galley',
          trolleyName: 'Bar Cart'
        },
      ]
    },
    {
      id: 6,
      name: 'Fresh Orange Juice',
      code: 'JUI0002',
      category: 'beverages',
      subcategory: 'juice',
      type: 'Drinks',
      common: true,
      description: 'Fresh squeezed orange juice',
      checked: false,
      positions: [
        { 
          id: '1', 
          positionCode: '2A1C01', 
          quantity: 24, 
          consumed: 8, 
          available: 16, 
          percentageAvailable: 67, 
          unitOfMeasure: 'bottles',
          galleyName: 'Business Galley',
          trolleyName: 'Beverage Cart'
        },
        { 
          id: '2', 
          positionCode: '4A1C15', 
          quantity: 24, 
          consumed: 12, 
          available: 12, 
          percentageAvailable: 50, 
          unitOfMeasure: 'bottles',
          galleyName: 'Aft Galley',
          trolleyName: 'Beverage Cart'
        },
      ]
    },
    {
      id: 7,
      name: 'Coca Cola',
      code: 'SOD0001',
      category: 'beverages',
      subcategory: 'soda',
      type: 'Drinks',
      common: true,
      description: 'Classic cola soft drink',
      checked: false,
      positions: [
        { 
          id: '1', 
          positionCode: '2A2C01', 
          quantity: 48, 
          consumed: 24, 
          available: 24, 
          percentageAvailable: 50, 
          unitOfMeasure: 'cans',
          galleyName: 'Business Galley',
          trolleyName: 'Beverage Cart'
        },
        { 
          id: '2', 
          positionCode: '4A1C20', 
          quantity: 48, 
          consumed: 40, 
          available: 8, 
          percentageAvailable: 17, 
          unitOfMeasure: 'cans',
          galleyName: 'Aft Galley',
          trolleyName: 'Beverage Cart'
        },
      ]
    }
  ]);

  const updatePositionConsumption = (itemId: number, positionId: string, newConsumed: number) => {
    setItems(prevItems =>
      prevItems.map(item => {
        if (item.id === itemId) {
          const updatedPositions = item.positions.map(pos => {
            if (pos.id === positionId) {
              const available = pos.quantity - newConsumed;
              const percentageAvailable = pos.quantity > 0 ? Math.round((available / pos.quantity) * 100) : 0;
              return {
                ...pos,
                consumed: newConsumed,
                available,
                percentageAvailable
              };
            }
            return pos;
          });
          return { ...item, positions: updatedPositions };
        }
        return item;
      })
    );
  };

  const toggleItemChecked = (itemId: number) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const getItemTotals = (itemId: number) => {
    const item = items.find(item => item.id === itemId);
    if (!item) return { totalQuantity: 0, totalConsumed: 0, totalAvailable: 0, totalPercentage: 0 };

    const totalQuantity = item.positions.reduce((sum, pos) => sum + pos.quantity, 0);
    const totalConsumed = item.positions.reduce((sum, pos) => sum + pos.consumed, 0);
    const totalAvailable = item.positions.reduce((sum, pos) => sum + pos.available, 0);
    const totalPercentage = totalQuantity > 0 ? Math.round((totalAvailable / totalQuantity) * 100) : 0;
    
    return { totalQuantity, totalConsumed, totalAvailable, totalPercentage };
  };

  const addItem = (newItemData: {
    name: string;
    code: string;
    category: string;
    subcategory?: string;
    type: string;
    quantity: number;
    unitOfMeasure: string;
    positionCode: string;
    galleyName: string;
    trolleyName: string;
  }) => {
    const newId = Math.max(...items.map(item => item.id), 0) + 1;
    
    const newItem: InventoryItem = {
      id: newId,
      name: newItemData.name,
      code: newItemData.code,
      category: newItemData.category,
      subcategory: newItemData.subcategory,
      type: newItemData.type,
      common: false,
      checked: false,
      positions: [
        {
          id: '1',
          positionCode: newItemData.positionCode,
          quantity: newItemData.quantity,
          consumed: 0,
          available: newItemData.quantity,
          percentageAvailable: 100,
          unitOfMeasure: newItemData.unitOfMeasure,
          galleyName: newItemData.galleyName,
          trolleyName: newItemData.trolleyName
        }
      ]
    };

    setItems(prevItems => [...prevItems, newItem]);
  };

  const contextValue: InventoryContextType = {
    items,
    updatePositionConsumption,
    toggleItemChecked,
    getItemTotals,
    addItem,
  };

  return (
    <InventoryContext.Provider value={contextValue}>
      {children}
    </InventoryContext.Provider>
  );
}

export function useInventory() {
  const context = useContext(InventoryContext);
  if (context === undefined) {
    throw new Error('useInventory must be used within an InventoryProvider');
  }
  return context;
}