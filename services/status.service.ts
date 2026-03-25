import { prisma } from '@/lib/db';
import { UpdateStatusInput } from '@/lib/validators';

export class StatusService {
  /**
   * Update shipment status (admin only)
   */
  static async updateStatus(shipmentId: string, input: UpdateStatusInput) {
    // Verify shipment exists
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
    });

    if (!shipment) {
      throw new Error('Shipment not found');
    }

    // Update status and add to history in a transaction
    const updated = await prisma.shipment.update({
      where: { id: shipmentId },
      data: {
        currentStatus: input.status,
        statusHistory: {
          create: {
            status: input.status,
            notes: input.notes || undefined,
          },
        },
      },
      include: {
        statusHistory: {
          orderBy: { updatedAt: 'asc' },
        },
      },
    });

    return updated;
  }
}
