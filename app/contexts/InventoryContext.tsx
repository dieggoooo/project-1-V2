'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../utils/supabase';

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
  id: string;
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
  loading: boolean;
  updatePositionConsumption: (itemId: string, positionId: string, newConsumed: number) => Promise<void>;
  toggleItemChecked: (itemId: string) => void;
  getItemTotals: (itemId: string) => {
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
  }) => Promise<void>;
  refreshItems: () => Promise<void>;
}

const InventoryContext = createContext<InventoryContextType | undefined>(undefined);

export function InventoryProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<InventoryItem[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchItems = async () => {
    try {
      const { data: itemsData, error: itemsError } = await supabase
        .from('items')
        .select('*')
        .order('name');

      if (itemsError) throw itemsError;

      const { data: positionsData, error: positionsError } = await supabase
        .from('positions')
        .select('*');

      if (positionsError) throw positionsError;

      const itemsWithPositions: InventoryItem[] = (itemsData || []).map((item: any) => {
        const itemPositions = (positionsData || [])
          .filter((pos: any) => pos.item_id === item.id)
          .map((pos: any) => ({
            id: pos.id,
            positionCode: pos.position_code,
            quantity: pos.quantity,
            consumed: pos.consumed,
            available: pos.available,
            percentageAvailable: pos.percentage_available,
            unitOfMeasure: pos.unit_of_measure,
            galleyName: pos.galley_name,
            trolleyName: pos.trolley_name,
          }));

        return {
          id: item.id,
          name: item.name,
          code: item.code,
          category: item.category,
          subcategory: item.subcategory,
          type: item.type,
          common: item.common,
          description: item.description,
          positions: itemPositions,
          checked: false,
        };
      });

      setItems(itemsWithPositions);
    } catch (error) {
      console.error('Error fetching inventory:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchItems();
  }, []);

  const updatePositionConsumption = async (itemId: string, positionId: string, newConsumed: number) => {
    console.log('updatePositionConsumption called:', { itemId, positionId, newConsumed });

    const item = items.find(i => i.id === itemId);
    const position = item?.positions.find(p => p.id === positionId);

    console.log('Found item:', item?.name, '| Found position:', position?.positionCode);

    if (!position) {
      console.warn('Position not found!');
      console.log('Available item IDs:', items.map(i => i.id));
      return;
    }

    const available = position.quantity - newConsumed;
    const percentageAvailable = position.quantity > 0 ? Math.round((available / position.quantity) * 100) : 0;

    try {
      console.log('Saving to Supabase - positionId:', positionId, 'consumed:', newConsumed);
      const { error } = await supabase
        .from('positions')
        .update({
          consumed: newConsumed,
          available,
          percentage_available: percentageAvailable,
          updated_at: new Date().toISOString(),
        })
        .eq('id', positionId);

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Supabase save successful!');

      setItems(prevItems =>
        prevItems.map(item => {
          if (item.id === itemId) {
            const updatedPositions = item.positions.map(pos => {
              if (pos.id === positionId) {
                return { ...pos, consumed: newConsumed, available, percentageAvailable };
              }
              return pos;
            });
            return { ...item, positions: updatedPositions };
          }
          return item;
        })
      );
    } catch (error) {
      console.error('Error updating position consumption:', error);
    }
  };

  const toggleItemChecked = (itemId: string) => {
    setItems(prevItems =>
      prevItems.map(item =>
        item.id === itemId ? { ...item, checked: !item.checked } : item
      )
    );
  };

  const getItemTotals = (itemId: string) => {
    const item = items.find(item => item.id === itemId);
    if (!item) return { totalQuantity: 0, totalConsumed: 0, totalAvailable: 0, totalPercentage: 0 };

    const totalQuantity = item.positions.reduce((sum, pos) => sum + pos.quantity, 0);
    const totalConsumed = item.positions.reduce((sum, pos) => sum + pos.consumed, 0);
    const totalAvailable = item.positions.reduce((sum, pos) => sum + pos.available, 0);
    const totalPercentage = totalQuantity > 0 ? Math.round((totalAvailable / totalQuantity) * 100) : 0;

    return { totalQuantity, totalConsumed, totalAvailable, totalPercentage };
  };

  const addItem = async (newItemData: {
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
    try {
      const { data: itemData, error: itemError } = await supabase
        .from('items')
        .insert({
          name: newItemData.name,
          code: newItemData.code,
          category: newItemData.category,
          subcategory: newItemData.subcategory,
          type: newItemData.type,
          common: false,
        })
        .select()
        .single();

      if (itemError) throw itemError;

      const { error: positionError } = await supabase
        .from('positions')
        .insert({
          item_id: itemData.id,
          position_code: newItemData.positionCode,
          quantity: newItemData.quantity,
          consumed: 0,
          available: newItemData.quantity,
          percentage_available: 100,
          unit_of_measure: newItemData.unitOfMeasure,
          galley_name: newItemData.galleyName,
          trolley_name: newItemData.trolleyName,
        });

      if (positionError) throw positionError;

      await fetchItems();
    } catch (error) {
      console.error('Error adding item:', error);
      throw error;
    }
  };

  const refreshItems = async () => {
    await fetchItems();
  };

  const contextValue: InventoryContextType = {
    items,
    loading,
    updatePositionConsumption,
    toggleItemChecked,
    getItemTotals,
    addItem,
    refreshItems,
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