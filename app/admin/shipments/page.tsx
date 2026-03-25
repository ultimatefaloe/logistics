'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { StatusBadge } from '@/components/status-badge';

interface Shipment {
  id: string;
  trackingId: string;
  user: {
    email: string;
    firstName: string;
    lastName: string;
  };
  receiverName: string;
  currentStatus: string;
  createdAt: string;
}

export default function AdminShipmentsPage() {
  const [shipments, setShipments] = useState<Shipment[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);
  const [status, setStatus] = useState('');

  useEffect(() => {
    const fetchShipments = async () => {
      try {
        const query = new URLSearchParams({
          page: page.toString(),
          limit: '10',
          ...(status && { status }),
        });
        const res = await fetch(`/api/admin/shipments?${query}`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch shipments');
        const data = await res.json();
        setShipments(data.data?.data || []);
        setTotal(data.data?.pagination?.total || 0);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchShipments();
  }, [page, status]);

  if (loading) return <div className="p-6">Loading...</div>;

  return (
    <div className="p-6">
      <h1 className="font-display text-3xl font-bold text-primary mb-6">
        All Shipments
      </h1>

      {error && <div className="alert alert-error mb-6">{error}</div>}

      <div className="mb-6">
        <select
          value={status}
          onChange={(e) => {
            setStatus(e.target.value);
            setPage(1);
          }}
          className="input"
        >
          <option value="">All Statuses</option>
          <option value="PENDING">Pending</option>
          <option value="IN_TRANSIT">In Transit</option>
          <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
          <option value="DELIVERED">Delivered</option>
          <option value="FAILED">Failed</option>
        </select>
      </div>

      {shipments.length === 0 ? (
        <div className="card text-center">
          <p className="text-gray-600">No shipments found</p>
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead className="bg-gray-100">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Tracking ID</th>
                <th className="px-6 py-3 text-left font-semibold">User</th>
                <th className="px-6 py-3 text-left font-semibold">Receiver</th>
                <th className="px-6 py-3 text-left font-semibold">Status</th>
                <th className="px-6 py-3 text-left font-semibold">Created</th>
                <th className="px-6 py-3 text-left font-semibold">Action</th>
              </tr>
            </thead>
            <tbody>
              {shipments.map((shipment) => (
                <tr key={shipment.id} className="border-b hover:bg-gray-50">
                  <td className="px-6 py-4 font-mono text-sm">{shipment.trackingId}</td>
                  <td className="px-6 py-4 text-sm">
                    {shipment.user.firstName} {shipment.user.lastName}
                  </td>
                  <td className="px-6 py-4">{shipment.receiverName}</td>
                  <td className="px-6 py-4">
                    <StatusBadge status={shipment.currentStatus} />
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-600">
                    {new Date(shipment.createdAt).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-4">
                    <Link
                      href={`/admin/shipments/${shipment.id}`}
                      className="text-secondary hover:underline text-sm font-semibold"
                    >
                      Manage
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          <div className="flex justify-between items-center mt-6">
            <button
              onClick={() => setPage(Math.max(1, page - 1))}
              disabled={page === 1}
              className="btn-outline disabled:opacity-50"
            >
              Previous
            </button>
            <p className="text-gray-600">
              Page {page} of {Math.ceil(total / 10)}
            </p>
            <button
              onClick={() => setPage(page + 1)}
              disabled={page * 10 >= total}
              className="btn-outline disabled:opacity-50"
            >
              Next
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
