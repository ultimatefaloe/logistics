import { prisma } from '@/lib/db';
import { generateTrackingId } from '@/lib/tracking-id';
import { CreateShipmentInput } from '@/lib/validators';

export class ShipmentService {
  /**
   * Create a new shipment
   */
  static async createShipment(userId: string, input: CreateShipmentInput) {
    // Generate unique tracking ID
    let trackingId = generateTrackingId();
    let existingShipment = await prisma.shipment.findUnique({
      where: { trackingId },
    });

    // Retry if collision (very rare)
    let retries = 0;
    while (existingShipment && retries < 5) {
      trackingId = generateTrackingId();
      existingShipment = await prisma.shipment.findUnique({
        where: { trackingId },
      });
      retries++;
    }

    if (existingShipment) {
      throw new Error('Failed to generate unique tracking ID');
    }

    // Create shipment with initial status history in a transaction
    const shipment = await prisma.shipment.create({
      data: {
        trackingId,
        userId,
        senderName: input.senderName,
        senderEmail: input.senderEmail,
        senderPhone: input.senderPhone,
        senderAddress: input.senderAddress,
        senderCity: input.senderCity,
        receiverName: input.receiverName,
        receiverEmail: input.receiverEmail,
        receiverPhone: input.receiverPhone,
        receiverAddress: input.receiverAddress,
        receiverCity: input.receiverCity,
        description: input.description,
        weight: input.weight,
        dimensions: input.dimensions,
        currentStatus: 'PENDING',
        statusHistory: {
          create: {
            status: 'PENDING',
            notes: 'Shipment created',
          },
        },
      },
      include: {
        statusHistory: true,
      },
    });

    return shipment;
  }

  /**
   * Get user's shipments
   */
  static async getUserShipments(
    userId: string,
    page: number = 1,
    limit: number = 10,
    status?: string
  ) {
    const skip = (page - 1) * limit;

    const where = {
      userId,
      ...(status && { currentStatus: status }),
    };

    const [shipments, total] = await Promise.all([
      prisma.shipment.findMany({
        where,
        skip,
        take: limit,
        include: {
          statusHistory: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.shipment.count({ where }),
    ]);

    return {
      data: shipments,
      pagination: {
        total,
        page,
        limit,
      },
    };
  }

  /**
   * Get shipment by ID with ownership check
   */
  static async getShipmentById(shipmentId: string, userId: string) {
    const shipment = await prisma.shipment.findUnique({
      where: { id: shipmentId },
      include: {
        statusHistory: {
          orderBy: { updatedAt: 'asc' },
        },
      },
    });

    if (!shipment) {
      throw new Error('Shipment not found');
    }

    // Check ownership
    if (shipment.userId !== userId) {
      throw new Error('Unauthorized');
    }

    return shipment;
  }

  /**
   * Get all shipments for admin
   */
  static async getAllShipments(page: number = 1, limit: number = 10, status?: string) {
    const skip = (page - 1) * limit;

    const where = {
      ...(status && { currentStatus: status }),
    };

    const [shipments, total] = await Promise.all([
      prisma.shipment.findMany({
        where,
        skip,
        take: limit,
        include: {
          statusHistory: {
            orderBy: { updatedAt: 'asc' },
          },
          user: {
            select: {
              id: true,
              email: true,
              firstName: true,
              lastName: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      }),
      prisma.shipment.count({ where }),
    ]);

    return {
      data: shipments,
      pagination: {
        total,
        page,
        limit,
      },
    };
  }
}
