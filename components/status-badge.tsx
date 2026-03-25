'use client';

import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  PENDING: "bg-accent text-muted-foreground border-accent",
  Processing: "bg-accent text-muted-foreground border-accent",
  IN_TRANSIT: "bg-secondary/10 text-secondary border-secondary/20",
  In_Transit: "bg-secondary/10 text-secondary border-secondary/20",
  OUT_FOR_DELIVERY: "bg-secondary/20 text-secondary border-secondary/30",
  DELIVERED: "bg-primary/10 text-primary border-primary/20",
  Delivered: "bg-primary/10 text-primary border-primary/20",
  FAILED: "bg-destructive/10 text-destructive border-destructive/20",
  Cancelled: "bg-destructive/10 text-destructive border-destructive/20",
  // Fallback
  DEFAULT: "bg-accent text-muted-foreground border-accent",
};

interface StatusBadgeProps {
  status: string;
  className?: string;
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  // Normalize checking
  let styles = statusStyles.DEFAULT;
  // Try exact match
  if (statusStyles[status]) {
      styles = statusStyles[status];
  } else {
      // Try upper case
      const upper = status.toUpperCase();
      if (statusStyles[upper]) {
          styles = statusStyles[upper];
      }
  }

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
        styles,
        className
      )}
    >
      {status.replace(/_/g, ' ')}
    </span>
  );
}
