import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { createShipmentSchema } from '@/lib/validators';
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

// GET /api/shipments - Get user's shipments
export async function GET(request: NextRequest) {
  try {
    const userId = extractUserId(request);

    const page = parseInt(request.nextUrl.searchParams.get('page') || '1');
    const limit = parseInt(request.nextUrl.searchParams.get('limit') || '10');
    const status = request.nextUrl.searchParams.get('status') || undefined;

    const result = await ShipmentService.getUserShipments(userId, page, limit, status || undefined);

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error && error.message.includes('Unauthorized')) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized' },
        { status: 401 }
      );
    }
    return NextResponse.json(
      { success: false, error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST /api/shipments - Create new shipment
export async function POST(request: NextRequest) {
  try {
    const userId = extractUserId(request);
    const body = await request.json();

    // Validate input
    const validated = createShipmentSchema.parse(body);

    // Create shipment
    const shipment = await ShipmentService.createShipment(userId, validated);

    return NextResponse.json(
      {
        success: true,
        data: shipment,
      },
      { status: 201 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
      if (error.message.includes('Unauthorized')) {
        return NextResponse.json(
          { success: false, error: 'Unauthorized' },
          { status: 401 }
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
