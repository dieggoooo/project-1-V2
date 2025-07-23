
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export default function BottomNav() {
  const pathname = usePathname();

  const navItems = [
    { href: '/', icon: 'ri-home-line', label: 'Home' },
    { href: '/items', icon: 'ri-search-line', label: 'Items' },
    { href: '/galley', icon: 'ri-map-line', label: 'Map' },
    { href: '/inventory', icon: 'ri-file-list-line', label: 'Inventory' }
  ];

  return (
    <nav className="fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 px-0 py-2">
      <div className="grid grid-cols-4 gap-0">
        {navItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={`flex flex-col items-center justify-center py-2 px-1 transition-colors ${
                isActive 
                  ? 'text-blue-600' 
                  : 'text-gray-600 hover:text-blue-600'
              }`}
            >
              <div className="w-5 h-5 flex items-center justify-center mb-1">
                <i className={`${item.icon} text-lg`}></i>
              </div>
              <span className="text-xs font-medium leading-none">{item.label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}