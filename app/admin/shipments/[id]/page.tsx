'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { StatusBadge } from '@/components/status-badge';
import { TrackingTimeline } from '@/components/tracking-timeline';
import { updateStatusSchema } from '@/lib/validators';
import { ZodError } from 'zod';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";

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

  if (loading) return <div className="p-6 text-primary">Loading...</div>;
  if (error) return <div className="p-6 bg-destructive/10 text-destructive">{error}</div>;
  if (!shipment) return <div className="p-6 text-muted-foreground">Shipment not found</div>;

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">
            Manage Shipment
          </h1>
          <p className="text-muted-foreground mt-2 font-mono">{shipment.trackingId}</p>
        </div>
        <Button onClick={() => setShowUpdateModal(true)} variant="secondary">
          Update Status
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-muted-foreground mb-3">Current Status</h3>
            <StatusBadge status={shipment.currentStatus} />
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-muted-foreground mb-3">Package Details</h3>
            <p className="text-sm pb-1"><span className="text-muted-foreground">Description:</span> <span className="text-foreground">{shipment.description}</span></p>
            <p className="text-sm"><span className="text-muted-foreground">Weight:</span> <span className="text-foreground">{shipment.weight} kg</span></p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
             <h3 className="font-semibold text-primary mb-2">From</h3>
             <p className="text-sm font-semibold">{shipment.senderName}</p>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-6">
             <h3 className="font-semibold text-secondary mb-2">To</h3>
             <p className="text-sm font-semibold">{shipment.receiverName}</p>
             <p className="text-sm text-muted-foreground">{shipment.receiverCity}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
         <CardContent className="p-6">
            <h3 className="font-semibold text-lg text-primary mb-6">Status History</h3>
            <TrackingTimeline timeline={shipment.statusHistory} />
         </CardContent>
      </Card>

      {/* Update Status Modal */}
      {showUpdateModal && (
        <div className="fixed inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <Card className="max-w-md w-full">
            <CardContent className="p-6">
             <h2 className="font-display text-2xl font-bold text-primary mb-6">
              Update Status
             </h2>

            {updateError && (
              <div className="bg-destructive/10 text-destructive p-3 rounded mb-6 text-sm">{updateError}</div>
            )}

            <form onSubmit={handleUpdateStatus} className="space-y-4">
              <div className="space-y-2">
                <Label>New Status</Label>
                <select
                  value={newStatus}
                  onChange={(e) => setNewStatus(e.target.value)}
                  className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
                >
                  <option value="PENDING">Pending</option>
                  <option value="IN_TRANSIT">In Transit</option>
                  <option value="OUT_FOR_DELIVERY">Out for Delivery</option>
                  <option value="DELIVERED">Delivered</option>
                  <option value="FAILED">Failed</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label>Notes (Optional)</Label>
                <Input
                  type="text"
                  placeholder="e.g., With delivery partner..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                />
              </div>

              <div className="flex gap-4 pt-2">
                <Button type="button" variant="outline" onClick={() => setShowUpdateModal(false)} className="flex-1">
                  Cancel
                </Button>
                <Button type="submit" disabled={updating} variant="secondary" className="flex-1">
                  {updating ? 'Updating...' : 'Update'}
                </Button>
              </div>
            </form>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
}
