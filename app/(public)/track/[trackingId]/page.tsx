"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";

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

const STATUS_COLORS: Record<string, string> = {
  PENDING: "#FBBF24",
  IN_TRANSIT: "#3B82F6",
  OUT_FOR_DELIVERY: "#A855F7",
  DELIVERED: "#10B981",
  FAILED: "#EF4444",
};

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
      <>
        <main
          style={{ backgroundColor: "var(--color-accent)" }}
          className="min-h-screen py-16"
        >
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="card text-center">
              <p className="text-gray-600">Loading tracking information...</p>
            </div>
          </div>
        </main>
      </>
    );
  }

  if (error || !tracking) {
    return (
      <>
        <main
          style={{ backgroundColor: "var(--color-accent)" }}
          className="min-h-screen py-16"
        >
          <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="card">
              <h1
                className="font-display text-2xl font-bold mb-4"
                style={{ color: "#dc2626" }}
              >
                Shipment Not Found
              </h1>
              <p className="text-gray-600 mb-6">
                The tracking ID {trackingId} could not be found. Please check
                the ID and try again.
              </p>
              <Link
                href="/track"
                className="btn-primary"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Back to Tracking
              </Link>
            </div>
          </div>
        </main>
      </>
    );
  }

  return (
    <>
      <main
        style={{ backgroundColor: "var(--color-accent)" }}
        className="min-h-screen py-16"
      >
        <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="card">
            <div className="mb-8">
              <h1
                className="font-display text-4xl font-bold mb-2"
                style={{ color: "var(--color-primary)" }}
              >
                Tracking ID: {tracking.trackingId}
              </h1>
              <div className="flex items-center justify-between">
                <p className="text-gray-600">
                  From <strong>{tracking.senderCity}</strong> to{" "}
                  <strong>{tracking.receiverCity}</strong>
                </p>
                <div
                  style={{
                    backgroundColor: STATUS_COLORS[tracking.currentStatus],
                  }}
                  className="px-4 py-2 rounded text-white font-medium"
                >
                  {tracking.currentStatus}
                </div>
              </div>
            </div>

            {/* Timeline */}
            <div className="relative">
              <div className="space-y-8">
                {tracking.timeline.map((entry, index) => (
                  <div key={entry.id} className="flex">
                    <div className="flex flex-col items-center mr-4">
                      <div
                        style={{ backgroundColor: STATUS_COLORS[entry.status] }}
                        className="w-4 h-4 rounded-full"
                      />
                      {index < tracking.timeline.length - 1 && (
                        <div
                          style={{
                            backgroundColor: STATUS_COLORS[entry.status],
                            opacity: 0.3,
                          }}
                          className="w-0.5 h-12 mt-2"
                        />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-semibold text-gray-900">
                        {entry.status.replace(/_/g, " ")}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {new Date(entry.updatedAt).toLocaleString()}
                      </p>
                      {entry.notes && (
                        <p className="text-sm text-gray-600 mt-1">
                          {entry.notes}
                        </p>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-8 pt-8 border-t border-gray-200">
              <Link
                href="/track"
                className="btn-primary"
                style={{ backgroundColor: "var(--color-primary)" }}
              >
                Track Another Shipment
              </Link>
            </div>
          </div>
        </div>
      </main>
    </>
  );
}
