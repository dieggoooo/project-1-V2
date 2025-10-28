'use client';

import { useEffect, useState } from 'react';

export default function TestDBPage() {
  const [items] = useState<any[]>([]);
  const [loading] = useState(false);
  const [error] = useState<string | null>(null);

  // Supabase functionality disabled for local development
  // Uncomment when you have valid Supabase credentials
  /*
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
  */

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-600">Error: {error}</div>;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Database Connection Test</h1>
      <div className="mb-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
        <p className="text-yellow-800">
          ⚠️ Database connection is disabled for local development.
        </p>
        <p className="text-sm text-yellow-700 mt-2">
          To enable: Add your Supabase credentials to .env.local and uncomment the code in this file.
        </p>
      </div>
      
      <h2 className="text-xl font-semibold mb-2">Setup Instructions:</h2>
      <ol className="list-decimal list-inside space-y-2 text-gray-700">
        <li>Create a Supabase project at <a href="https://supabase.com" className="text-blue-600 underline">supabase.com</a></li>
        <li>Get your project URL and anon key from the API settings</li>
        <li>Add them to your .env.local file</li>
        <li>Uncomment the database code in this file</li>
      </ol>

      <div className="mt-6">
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
            <p className="text-gray-500">No database connection - using mock data from InventoryContext</p>
          )}
        </div>
      </div>
    </div>
  );
}