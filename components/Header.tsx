'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <div className="fixed top-0 w-full bg-blue-600 text-white px-4 py-3 z-50">
      <div className="flex items-center justify-between">
        <Link href="/" className="text-lg font-bold font-pacifico">
          CrewGalley
        </Link>
        <div className="flex items-center space-x-4">
          <span className="text-sm">Flight: AA123</span>
        </div>
      </div>
    </div>
  );
}