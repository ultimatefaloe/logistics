'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { StatusBadge } from '@/components/status-badge';
import { TrackingTimeline } from '@/components/tracking-timeline';
import { updateStatusSchema } from '@/lib/validators';
import { ZodError } from 'zod';

interface ShipmentDetail {
  id: string;
  trackingId: string;
  senderName: string;
  receiverName: string;
  receiverCity: string;
  description: string;
  weight: number;
  currentStatus: string;
  statusHistory: Array<{
    status: string;
    notes?: string;
    updatedAt: string;
  }>;
}

export default function AdminShipmentDetailPage() {
  const params = useParams();
  const shipmentId = params.id as string;
  const [shipment, setShipment] = useState<ShipmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [newStatus, setNewStatus] = useState('');
  const [notes, setNotes] = useState('');
  const [updating, setUpdating] = useState(false);
  const [updateError, setUpdateError] = useState('');

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        const res = await fetch(`/api/shipments/${shipmentId}`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch shipment');
        const data = await res.json();
        setShipment(data.data);
        setNewStatus(data.data.currentStatus);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchShipment();
  }, [shipmentId]);

  const handleUpdateStatus = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdateError('');
    setUpdating(true);

    try {
      updateStatusSchema.parse({ status: newStatus, notes });

      const res = await fetch(`/api/admin/shipments/${shipmentId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: newStatus, notes }),
        credentials: 'include',
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Failed to update status');
      }

      const data = await res.json();
      setShipment(data.data);
      setShowUpdateModal(false);
      setNotes('');
    } catch (error) {
      if (error instanceof ZodError) {
        setUpdateError(error.issues[0]?.message || 'Validation error');
      } else if (error instanceof Error) {
        setUpdateError(error.message);
      }
    } finally {
      setUpdating(false);
    }
  };

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 alert alert-error">{error}</div>;
  if (!shipment) return <div className="p-6">Shipment not found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">
            Manage Shipment
          </h1>
          <p className="text-gray-600 mt-2 font-mono">{shipment.trackingId}</p>
        </div>
        <button
          onClick={() => setShowUpdateModal(true)}
          className="btn-secondary px-6 py-2"
        >
          Update Status
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="font-semibold text-gray-700 mb-3">Current Status</h3>
          <StatusBadge status={shipment.currentStatus} />
        </div>

        <div className="card">
          <h3 className="font-semibold text-gray-700 mb-3">Package Details</h3>
          <p className="text-sm"><span className="text-gray-600">Description:</span> {shipment.description}</p>
          <p className="text-sm"><span className="text-gray-600">Weight:</span> {shipment.weight} kg</p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card">
          <h3 className="font-semibold text-primary mb-2">From</h3>
          <p className="text-sm font-semibold">{shipment.senderName}</p>
        </div>

        <div className="card">
          <h3 className="font-semibold" style={{color: '#FF7A00'}} >To</h3>
          <p className="text-sm font-semibold">{shipment.receiverName}</p>
          <p className="text-sm text-gray-600">{shipment.receiverCity}</p>
        </div>
      </div>

      <div className="card">
        <h3 className="font-semibold text-lg text-primary mb-6">Status History</h3>
        <TrackingTimeline timeline={shipment.statusHistory} />
      </div>

      {/* Update Status Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="card max-w-md w-full">
            <h2 className="font-display text-2xl font-bold text-primary mb-6">
              Update Status
            </h2>

            {updateError && (
              <div className="alert alert-error mb-6">{updateError}</div>
            )}

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div>
                <label className="form-label">New Status</label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="input"
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_TRANSIT">In Transit</option>
                  <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>

              <div>
                <label className="form-label">Notes (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g., With delivery partner..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                  className="input"
                />
              </div>

              <div className="flex gap-4">
                <button
                  type="button"
                  onClick={() => setShowUpdateModal(false)}
                  className="btn-outline flex-1"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={updating}
                  className="btn-secondary flex-1"
                >
                  {updating ? 'Updating...' : 'Update'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
