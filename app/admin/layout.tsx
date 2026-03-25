'use client';

import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Navbar } from '@/components/navbar';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const router = useRouter();
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is admin
    const checkAdmin = async () => {
      try {
        const res = await fetch('/api/auth/me', { credentials: 'include' });
        if (!res.ok) {
          router.push('/login');
          return;
        }
        const data = await res.json();
        if (data.data?.role !== 'ADMIN') {
          router.push('/dashboard');
          return;
        }
        setIsAdmin(true);
      } catch {
        router.push('/login');
      } finally {
        setLoading(false);
      }
    };

    checkAdmin();
  }, [router]);

  if (loading) {
    return (
      <>
        <Navbar />
        <div className="p-6">Loading...</div>
      </>
    );
  }

  if (!isAdmin) {
    return null;
  }

  return (
    <>
      <Navbar />
      <div className="flex bg-accent min-h-screen">
        <nav className="w-64 bg-primary text-white p-4 hidden md:block border-r border-white/10">
          <h2 className="font-display text-xl font-bold mb-6 text-white">Admin Menu</h2>
          <ul className="space-y-4">
            <li>
              <a href="/admin" className="block text-white/80 hover:text-secondary transition-colors">
                Dashboard
              </a>
            </li>
            <li>
              <a href="/admin/shipments" className="block text-white/80 hover:text-secondary transition-colors">
                All Shipments
              </a>
            </li>
          </ul>
        </nav>
        <main className="flex-1 p-6">{children}</main>
      </div>
    </>
  );
}
