'use client';

import React from 'react';
import { ClipboardList, Truck, Package, CheckCircle, XCircle } from 'lucide-react';

import { cn } from '@/lib/utils';

interface TimelineEntry {
  status: string;
  notes?: string;
  updatedAt: string;
}

interface TrackingTimelineProps {
  timeline: TimelineEntry[];
}

export function TrackingTimeline({ timeline }: TrackingTimelineProps) {
  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'PENDING': return <ClipboardList className="h-5 w-5 text-muted-foreground" />;
      case 'IN_TRANSIT': return <Truck className="h-5 w-5 text-primary" />;
      case 'OUT_FOR_DELIVERY': return <Package className="h-5 w-5 text-secondary" />;
      case 'DELIVERED': return <CheckCircle className="h-5 w-5 text-primary" />;
      case 'FAILED': return <XCircle className="h-5 w-5 text-destructive" />;
      default: return <div className="h-5 w-5 rounded-full bg-muted" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'PENDING': return 'bg-accent border-accent';
      case 'IN_TRANSIT': return 'bg-primary/10 border-primary/20';
      case 'OUT_FOR_DELIVERY': return 'bg-secondary/10 border-secondary/20';
      case 'DELIVERED': return 'bg-primary/10 border-primary/20';
      case 'FAILED': return 'bg-destructive/10 border-destructive/20';
      default: return 'bg-muted border-border';
    }
  };

  return (
    <div className="relative pl-4 border-l border-accent ml-2 space-y-8">
      {timeline.map((entry, index) => (
        <div key={index} className="relative pl-6">
          <div className={cn(
            "absolute -left-6 flex h-8 w-8 items-center justify-center rounded-full border bg-background",
            getStatusColor(entry.status)
          )}>
            {getStatusIcon(entry.status)}
          </div>
          <div className="flex flex-col">
            <span className="font-semibold text-foreground">
              {entry.status.replace(/_/g, ' ')}
            </span>
            <span className="text-sm text-muted-foreground">
              {new Date(entry.updatedAt).toLocaleString()}
            </span>
            {entry.notes && (
              <p className="mt-1 text-sm text-muted-foreground bg-accent/50 p-2 rounded-md">
                {entry.notes}
              </p>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
