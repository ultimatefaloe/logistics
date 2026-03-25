'use client';

import React from 'react';

interface TimelineEntry {
  status: string;
  notes?: string;
  updatedAt: string;
}

interface TrackingTimelineProps {
  timeline: TimelineEntry[];
}

export function TrackingTimeline({ timeline }: TrackingTimelineProps) {
  const statusIcons: Record<string, string> = {
    PENDING: '📋',
    IN_TRANSIT: '🚚',
    OUT_FOR_DELIVERY: '📦',
    DELIVERED: '✅',
    FAILED: '❌',
  };

  return (
    <div className="relative">
      {timeline.map((entry, index) => (
        <div key={index} className="flex gap-4 pb-8">
          <div className="flex flex-col items-center">
            <div className="text-3xl">{statusIcons[entry.status] || '•'}</div>
            {index < timeline.length - 1 && (
              <div className="w-1 h-12 bg-gray-300 my-2" />
            )}
          </div>
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900">
              {entry.status.replace(/_/g, ' ')}
            </h4>
            {entry.notes && (
              <p className="text-sm text-gray-600 mt-1">{entry.notes}</p>
            )}
            <p className="text-xs text-gray-400 mt-2">
              {new Date(entry.updatedAt).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
