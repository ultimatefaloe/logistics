'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { StatusBadge } from '@/components/status-badge';
import { TrackingTimeline } from '@/components/tracking-timeline';

interface ShipmentDetail {
  id: string;
  trackingId: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  senderCity: string;
  receiverName: string;
  receiverEmail: string;
  receiverPhone: string;
  receiverCity: string;
  description: string;
  weight: number;
  dimensions?: string;
  currentStatus: string;
  statusHistory: Array<{
    status: string;
    notes?: string;
    updatedAt: string;
  }>;
  createdAt: string;
}

export default function ShipmentDetailPage() {
  const params = useParams();
  const shipmentId = params.id as string;
  const [shipment, setShipment] = useState<ShipmentDetail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchShipment = async () => {
      try {
        const res = await fetch(`/api/shipments/${shipmentId}`, {
          credentials: 'include',
        });
        if (!res.ok) throw new Error('Failed to fetch shipment');
        const data = await res.json();
        setShipment(data.data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An error occurred');
      } finally {
        setLoading(false);
      }
    };

    fetchShipment();
  }, [shipmentId]);

  if (loading) return <div className="p-6">Loading...</div>;
  if (error) return <div className="p-6 alert alert-error">{error}</div>;
  if (!shipment) return <div className="p-6">Shipment not found</div>;

  const copyTrackingId = () => {
    navigator.clipboard.writeText(shipment.trackingId);
    alert('Tracking ID copied!');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <div className="flex justify-between items-start mb-6">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">
            Shipment Details
          </h1>
          <p className="text-gray-600 mt-2">
            Tracking ID: <span className="font-mono font-bold">{shipment.trackingId}</span>
          </p>
        </div>
        <button
          onClick={copyTrackingId}
          className="btn-outline px-4 py-2"
        >
          Copy ID
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        {/* Current Status */}
        <div className="card">
          <h3 className="font-semibold text-gray-700 mb-3">Current Status</h3>
          <StatusBadge status={shipment.currentStatus} />
          <p className="text-sm text-gray-600 mt-4">
            Created: {new Date(shipment.createdAt).toLocaleString()}
          </p>
        </div>

        {/* Package Info */}
        <div className="card">
          <h3 className="font-semibold text-gray-700 mb-3">Package Info</h3>
          <p><span className="text-gray-600">Description:</span> {shipment.description}</p>
          <p><span className="text-gray-600">Weight:</span> {shipment.weight} kg</p>
          {shipment.dimensions && (
            <p><span className="text-gray-600">Dimensions:</span> {shipment.dimensions}</p>
          )}
        </div>
      </div>

      {/* Sender & Receiver */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
        <div className="card border-l-4" style={{borderLeftColor: '#0D1F3C'}}>
          <h3 className="font-semibold text-primary mb-4">From</h3>
          <p><strong>{shipment.senderName}</strong></p>
          <p className="text-sm text-gray-600">{shipment.senderEmail}</p>
          <p className="text-sm text-gray-600">{shipment.senderPhone}</p>
          <p className="text-sm text-gray-600 mt-2">{shipment.senderCity}</p>
        </div>

        <div className="card border-l-4" style={{borderLeftColor: '#FF7A00'}}>
          <h3 className="font-semibold" style={{color: '#FF7A00'}} >To</h3>
          <p><strong>{shipment.receiverName}</strong></p>
          <p className="text-sm text-gray-600">{shipment.receiverEmail}</p>
          <p className="text-sm text-gray-600">{shipment.receiverPhone}</p>
          <p className="text-sm text-gray-600 mt-2">{shipment.receiverCity}</p>
        </div>
      </div>

      {/* Timeline */}
      <div className="card">
        <h3 className="font-semibold text-lg text-primary mb-6">Tracking Timeline</h3>
        <TrackingTimeline timeline={shipment.statusHistory} />
      </div>
    </div>
  );
}
