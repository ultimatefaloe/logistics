'use client';

import { cn } from "@/lib/utils";

const statusStyles: Record<string, string> = {
  PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
  Processing: "bg-yellow-100 text-yellow-800 border-yellow-200", // Some might be mixed case
  IN_TRANSIT: "bg-blue-100 text-blue-800 border-blue-200",
  In_Transit: "bg-blue-100 text-blue-800 border-blue-200",
  OUT_FOR_DELIVERY: "bg-purple-100 text-purple-800 border-purple-200",
  DELIVERED: "bg-green-100 text-green-800 border-green-200",
  Delivered: "bg-green-100 text-green-800 border-green-200",
  FAILED: "bg-red-100 text-red-800 border-red-200",
  Cancelled: "bg-red-100 text-red-800 border-red-200",
  // Fallback
  DEFAULT: "bg-gray-100 text-gray-800 border-gray-200",
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
