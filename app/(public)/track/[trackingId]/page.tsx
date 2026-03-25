"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface TrackingData {
  trackingId: string;
  currentStatus: string;
  senderCity: string;
  receiverCity: string;
  timeline: Array<{
    id: string;
    status: string;
    notes?: string;
    updatedAt: string;
  }>;
}

const getStatusColor = (status: string) => {
  switch (status) {
    case 'PENDING':
      return 'bg-accent border-accent text-foreground';
    case 'IN_TRANSIT':
      return 'bg-secondary text-white border-secondary';
    case 'OUT_FOR_DELIVERY':
      return 'bg-secondary text-white border-secondary';
    case 'DELIVERED':
      return 'bg-primary text-white border-primary';
    case 'FAILED':
      return 'bg-destructive text-white border-destructive';
    default:
      return 'bg-muted text-muted-foreground border-border';
  }
};

const getStatusDotColor = (status: string) => {
   switch (status) {
    case 'PENDING':
      return 'bg-muted-foreground/30';
    case 'IN_TRANSIT':
      return 'bg-secondary';
    case 'OUT_FOR_DELIVERY':
      return 'bg-secondary';
    case 'DELIVERED':
      return 'bg-primary';
    case 'FAILED':
      return 'bg-destructive';
    default:
      return 'bg-muted';
  }
}

export default function TrackingResultPage() {
  const params = useParams();
  const trackingId = params.trackingId as string;
  const [tracking, setTracking] = useState<TrackingData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTracking = async () => {
      try {
        const res = await fetch(`/api/track/${trackingId}`);
        if (!res.ok) {
          throw new Error("Shipment not found");
        }
        const data = await res.json();
        setTracking(data.data);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        }
      } finally {
        setLoading(false);
      }
    };

    fetchTracking();
  }, [trackingId]);

  if (loading) {
    return (
      <main className="min-h-screen bg-accent py-16 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </main>
    );
  }

  if (error || !tracking) {
    return (
      <main className="min-h-screen bg-accent py-16 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
           <CardContent className="text-center pt-6">
              <h1 className="font-display text-2xl font-bold mb-4 text-destructive">
                Shipment Not Found
              </h1>
              <p className="text-muted-foreground mb-6">
                The tracking ID {trackingId} could not be found. Please check
                the ID and try again.
              </p>
              <Link href="/track">
                <Button className="w-full">
                  Back to Tracking
                </Button>
              </Link>
           </CardContent>
        </Card>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-accent py-16 p-4">
        <div className="max-w-3xl mx-auto">
          <Card>
            <CardHeader className="border-b border-accent pb-6">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                 <div>
                    <h1 className="font-display text-3xl font-bold text-primary mb-1">
                      {tracking.trackingId}
                    </h1>
                     <p className="text-muted-foreground">
                      From <strong className="text-foreground">{tracking.senderCity}</strong> to{" "}
                      <strong className="text-foreground">{tracking.receiverCity}</strong>
                    </p>
                 </div>
                 <div
                  className={cn("px-4 py-2 rounded-full font-medium text-sm border shadow-sm self-start md:self-center", getStatusColor(tracking.currentStatus))}
                 >
                  {tracking.currentStatus.replace(/_/g, " ")}
                </div>
              </div>
            </CardHeader>
            
            <CardContent className="pt-8">
               {/* Timeline */}
              <div className="relative pl-2">
                 {/* Vertical Line Background */}
                 <div className="absolute left-[15px] top-2 bottom-4 w-[2px] bg-accent h-full -z-10" />

                 <div className="space-y-8">
                    {tracking.timeline.map((entry, index) => (
                      <div key={entry.id} className="flex gap-4">
                        <div className="flex flex-col items-center">
                          <div
                            className={cn("w-4 h-4 rounded-full ring-4 ring-white mt-1", getStatusDotColor(entry.status))}
                          />
                        </div>
                        <div className="flex-1 pb-4">
                          <h3 className="font-semibold text-primary">
                            {entry.status.replace(/_/g, " ")}
                          </h3>
                          <p className="text-xs text-muted-foreground mb-1">
                            {new Date(entry.updatedAt).toLocaleString()}
                          </p>
                          {entry.notes && (
                            <p className="text-sm text-foreground/80 bg-accent/50 p-3 rounded-md mt-2">
                              {entry.notes}
                            </p>
                          )}
                        </div>
                      </div>
                    ))}
                 </div>
              </div>

               <div className="mt-8 pt-8 border-t border-accent flex justify-end">
                <Link href="/track">
                  <Button variant="outline">
                    Track Another Shipment
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </div>
    </main>
  );
}
