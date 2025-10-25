'use client';

import { useEffect, useState } from 'react';
import { createClient } from '@/libs/supabase/client';

export default function TestDBPage() {
  const [items, setItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const supabase = createClient();

  useEffect(() => {
    async function fetchItems() {
      try {
        const { data, error } = await supabase
          .from('items')
          .select('*')
          .limit(10);

        if (error) throw error;

        console.log('Items from database:', data);
        setItems(data || []);
      } catch (err) {
        console.error('Error:', err);
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchItems();
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
      <p className="mb-4 text-green-600">✅ Successfully connected to Supabase!</p>
      
      <h2 className="text-xl font-semibold mb-2">Items from database:</h2>
      <div className="space-y-2">
        {items.length > 0 ? (
          items.map((item) => (
            <div key={item.id} className="p-4 bg-gray-100 rounded">
              <div className="font-bold">{item.name}</div>
              <div className="text-sm text-gray-600">Code: {item.code}</div>
              <div className="text-sm text-gray-600">Type: {item.type}</div>
            </div>
          ))
        ) : (
          <p>No items found</p>
        )}
      </div>
    </div>
  );
}