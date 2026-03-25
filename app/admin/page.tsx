'use client';

import { useEffect, useState } from 'react';

interface Stats {
  total: number;
  pending: number;
  inTransit: number;
  delivered: number;
}

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        // In a real app, we'd have a dedicated stats endpoint
        // For now, we'll fetch all shipments to calculate stats
        const res = await fetch('/api/admin/shipments?limit=1000', {
          credentials: 'include',
        });
        if (res.ok) {
          const data = await res.json();
          const shipments = data.data?.data || [];

          const stats: Stats = {
            total: shipments.length,
            pending: shipments.filter((s: any) => s.currentStatus === 'PENDING').length,
            inTransit: shipments.filter((s: any) => s.currentStatus === 'IN_TRANSIT').length,
            delivered: shipments.filter((s: any) => s.currentStatus === 'DELIVERED').length,
          };
          setStats(stats);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="font-display text-3xl font-bold text-primary mb-6">
        Admin Dashboard
      </h1>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
        {[
          { label: 'Total Shipments', value: stats?.total || 0, color: '#0D1F3C' },
          { label: 'Pending', value: stats?.pending || 0, color: '#FBBF24' },
          { label: 'In Transit', value: stats?.inTransit || 0, color: '#3B82F6' },
          { label: 'Delivered', value: stats?.delivered || 0, color: '#10B981' },
        ].map((stat, index) => (
          <div key={index} className="card">
            <p className="text-gray-600 text-sm">{stat.label}</p>
            <p className="text-3xl font-bold mt-2" style={{ color: stat.color }}>
              {stat.value}
            </p>
          </div>
        ))}
      </div>

      <div className="card">
        <h2 className="font-semibold text-lg text-primary mb-4">Recent Activity</h2>
        <p className="text-gray-600">Navigate to "All Shipments" to manage shipments and update statuses.</p>
      </div>
    </div>
  );
}
