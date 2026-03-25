'use client';

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { StatusBadge } from '@/components/status-badge';
import { TrackingTimeline } from '@/components/tracking-timeline';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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

  if (loading) return <div className="p-6 text-primary">Loading...</div>;
  if (error) return <div className="p-6 bg-destructive/10 text-destructive">{error}</div>;
  if (!shipment) return <div className="p-6 text-muted-foreground">Shipment not found</div>;

  const copyTrackingId = () => {
    navigator.clipboard.writeText(shipment.trackingId);
    alert('Tracking ID copied!');
  };

  return (
    <div className="p-6 max-w-4xl mx-auto space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h1 className="font-display text-3xl font-bold text-primary">
            Shipment Details
          </h1>
          <p className="text-muted-foreground mt-2">
            Tracking ID: <span className="font-mono font-bold text-foreground">{shipment.trackingId}</span>
          </p>
        </div>
        <Button onClick={copyTrackingId} variant="outline">
          Copy ID
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-muted-foreground mb-3">Current Status</h3>
            <StatusBadge status={shipment.currentStatus} />
            <p className="text-sm text-muted-foreground mt-4">
              Created: {new Date(shipment.createdAt).toLocaleString()}
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <h3 className="font-semibold text-muted-foreground mb-3">Package Info</h3>
            <p><span className="text-muted-foreground">Description:</span> <span className="text-foreground">{shipment.description}</span></p>
            <p><span className="text-muted-foreground">Weight:</span> <span className="text-foreground">{shipment.weight} kg</span></p>
            {shipment.dimensions && (
              <p><span className="text-muted-foreground">Dimensions:</span> <span className="text-foreground">{shipment.dimensions}</span></p>
            )}
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-l-4 border-l-primary shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-semibold text-primary mb-4">From</h3>
            <p className="font-bold text-foreground">{shipment.senderName}</p>
            <p className="text-sm text-muted-foreground">{shipment.senderEmail}</p>
            <p className="text-sm text-muted-foreground">{shipment.senderPhone}</p>
            <p className="text-sm text-muted-foreground mt-2">{shipment.senderCity}</p>
          </CardContent>
        </Card>

        <Card className="border-l-4 border-l-secondary shadow-sm">
          <CardContent className="p-6">
            <h3 className="font-semibold text-secondary mb-4">To</h3>
            <p className="font-bold text-foreground">{shipment.receiverName}</p>
            <p className="text-sm text-muted-foreground">{shipment.receiverEmail}</p>
            <p className="text-sm text-muted-foreground">{shipment.receiverPhone}</p>
            <p className="text-sm text-muted-foreground mt-2">{shipment.receiverCity}</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardContent className="p-6">
           <h3 className="font-semibold text-lg text-primary mb-6">Tracking Timeline</h3>
           <TrackingTimeline timeline={shipment.statusHistory} />
        </CardContent>
      </Card>
    </div>
  );
}
