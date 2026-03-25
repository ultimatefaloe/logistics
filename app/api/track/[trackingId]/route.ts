import { NextRequest, NextResponse } from 'next/server';
import { isValidTrackingId } from '@/lib/tracking-id';
import { TrackingService } from '@/services/tracking.service';

// GET /api/track/[trackingId] - Public tracking endpoint
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ trackingId: string }> }
) {
  try {
    const trackingId = (await params).trackingId.toUpperCase();

    // Validate tracking ID format
    if (!isValidTrackingId(trackingId)) {
      return NextResponse.json(
        { success: false, error: 'Invalid tracking ID format' },
        { status: 400 }
      );
    }

    // Get tracking info
    const tracking = await TrackingService.getTrackingById(trackingId);

    return NextResponse.json(
      {
        success: true,
        data: tracking,
      },
      { status: 200 }
    );
  } catch (error: unknown) {
    if (error instanceof Error) {
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
