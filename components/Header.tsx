'use client';

import Link from 'next/link';

export default function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 bg-blue-600 text-white z-40">
      <div className="pt-20 pb-3 px-4">
        <div className="flex items-center justify-between">
          <Link href="/" className="text-xl font-bold">
            CrewGalley
          </Link>
          
          <Link href="/profile" className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center hover:bg-white/30 transition-colors">
            <i className="ri-user-line"></i>
          </Link>
        </div>
      </div>
    </header>
  );
}