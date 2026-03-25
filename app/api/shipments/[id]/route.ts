import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { ShipmentService } from '@/services/shipment.service';

function extractUserId(request: NextRequest): string {
  const token = request.cookies.get('auth_token')?.value;
  if (!token) {
    throw new Error('Unauthorized');
  }

  const payload = verifyToken(token);
  if (!payload) {
    throw new Error('Invalid token');
  }

  return payload.userId;
}

// GET /api/shipments/[id] - Get shipment detail
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const shipmentId = (await params).id;
    const userId = extractUserId(request);

    const shipment = await ShipmentService.getShipmentById(shipmentId, userId);

    return NextResponse.json(
      {
        success: true,
        data: shipment,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
        );
      }
      if (error.message.includes('Shipment not found')) {
        return NextResponse.json(
          { success: false, error: 'Shipment not found' },
          { status: 404 }
        );
      }
      return NextResponse.json(
        { success: false, error: error.message },
        { status: 400 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}
