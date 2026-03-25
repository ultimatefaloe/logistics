import { prisma } from '@/lib/db';

export class TrackingService {
  /**
   * Get public tracking info by tracking ID
   */
  static async getTrackingById(trackingId: string) {
    const shipment = await prisma.shipment.findUnique({
      where: { trackingId },
      include: {
        statusHistory: {
          orderBy: { updatedAt: 'asc' },
        },
      },
    });

    if (!shipment) {
      throw new Error('Shipment not found');
    }

    // Return only public information
    return {
      trackingId: shipment.trackingId,
      currentStatus: shipment.currentStatus,
      senderCity: shipment.senderCity,
      receiverCity: shipment.receiverCity,
      timeline: shipment.statusHistory.map((entry) => ({
        id: entry.id,
        status: entry.status,
        notes: entry.notes,
        updatedAt: entry.updatedAt,
      })),
    };
  }
}
