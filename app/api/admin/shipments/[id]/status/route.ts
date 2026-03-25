import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';
import { updateStatusSchema } from '@/lib/validators';
import { StatusService } from '@/services/status.service';

function extractUserRole(request: NextRequest): string {
  const token = request.cookies.get('auth_token')?.value;
  if (!token) {
    throw new Error('Unauthorized');
  }

  const payload = verifyToken(token);
  if (!payload) {
    throw new Error('Invalid token');
  }

  if (payload.role !== 'ADMIN') {
    throw new Error('Forbidden');
  }

  return payload.role;
}

// PATCH /api/admin/shipments/[id]/status - Update shipment status
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const role = extractUserRole(request);
    const body = await request.json();

    // Validate input
    const validated = updateStatusSchema.parse(body);

    // Update status
    const shipment = await StatusService.updateStatus(id, validated);

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
      if (error.message.includes('Forbidden')) {
        return NextResponse.json(
          { success: false, error: 'Only admins can update status' },
          { status: 403 }
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
