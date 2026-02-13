'use client';

import { useEffect } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useAuth } from '../app/contexts/AuthContext';

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  useEffect(() => {
    console.log('ProtectedRoute: pathname=', pathname, 'user=', user, 'loading=', loading);
    
    // Don't redirect if on login page
    if (pathname === '/login') {
      return;
    }

    // Redirect to login if not authenticated (after loading completes)
    if (!loading && !user) {
      console.log('ProtectedRoute: Redirecting to /login');
      router.push('/login');
    }
  }, [user, loading, router, pathname]);

  // Show loading spinner while checking auth
  if (loading) {
    console.log('ProtectedRoute: Showing loading...');
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <i className="ri-loader-4-line text-4xl text-blue-600 animate-spin"></i>
          <p className="mt-4 text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  // Always render children - let the redirect happen in the background
  console.log('ProtectedRoute: Rendering children');
  return <>{children}</>;
}
