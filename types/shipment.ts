export type ShipmentStatus = 'PENDING' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'FAILED';

export interface Shipment {
  id: string;
  trackingId: string;
  userId: string;
  senderName: string;
  senderEmail: string;
  senderPhone: string;
  senderAddress: string;
  senderCity: string;
  receiverName: string;
  receiverEmail: string;
  receiverPhone: string;
  receiverAddress: string;
  receiverCity: string;
  description: string;
  weight: number;
  dimensions?: string;
  currentStatus: ShipmentStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface ShipmentStatusHistoryEntry {
  id: string;
  shipmentId: string;
  status: ShipmentStatus;
  notes?: string;
  updatedAt: Date;
}

export interface ShipmentWithHistory extends Shipment {
  statusHistory: ShipmentStatusHistoryEntry[];
}

export interface PublicShipmentTracking {
  trackingId: string;
  currentStatus: ShipmentStatus;
  senderCity: string;
  receiverCity: string;
  timeline: ShipmentStatusHistoryEntry[];
}
