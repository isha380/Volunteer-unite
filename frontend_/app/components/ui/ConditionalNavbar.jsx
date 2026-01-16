'use client';
import { usePathname } from 'next/navigation';
import Navbar from './Navbar';

export default function ConditionalNavbar() {
  const pathname = usePathname();

  // Don't show navbar on admin routes
  const isAdminRoute = pathname?.startsWith('/admin') || pathname?.startsWith('/dashboard/admin');

  // Don't show navbar
  if (isAdminRoute) {
    return null;
  }

  // Show volunteer navbar for all other routes
  return <Navbar />;
}