import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { NotificationService, PredictionInput } from '@/services/notificationService';

/**
 * GET handler to fetch all outbreak notifications.
 * Requires an authenticated user session.
 */
export async function GET(request: Request) {
  try {
    const sessionUser = await getSessionUser(request);
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notifications = await NotificationService.getAllNotifications();
    return NextResponse.json(notifications);
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Error fetching notifications API:', error);
    return NextResponse.json(
      { error: errMsg },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const sessionUser = await getSessionUser(request);
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (sessionUser.role !== 'ADMIN' && sessionUser.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const prediction = await request.json() as PredictionInput;
    if (!prediction || !prediction.disease || !prediction.province) {
      return NextResponse.json(
        { error: 'Invalid prediction parameters' },
        { status: 400 }
      );
    }

    const notification = await NotificationService.createOutbreakNotification(prediction);
    return NextResponse.json(notification, { status: 201 });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Error creating notification API:', error);
    return NextResponse.json(
      { error: errMsg },
      { status: 500 }
    );
  }
}
