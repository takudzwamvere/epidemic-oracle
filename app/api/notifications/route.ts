import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { NotificationService } from '@/services/notificationService';

export async function GET(request: Request) {
  try {
    const sessionUser = await getSessionUser(request as any);
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const notifications = await NotificationService.getAllNotifications();
    return NextResponse.json(notifications);
  } catch (error: any) {
    console.error('Error fetching notifications API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}

export async function POST(request: Request) {
  try {
    const sessionUser = await getSessionUser(request as any);
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    if (sessionUser.role !== 'ADMIN' && sessionUser.role !== 'SUPERADMIN') {
      return NextResponse.json({ error: 'Forbidden' }, { status: 403 });
    }

    const prediction = await request.json();
    if (!prediction || !prediction.disease || !prediction.province) {
      return NextResponse.json(
        { error: 'Invalid prediction parameters' },
        { status: 400 }
      );
    }

    const notification = await NotificationService.createOutbreakNotification(prediction);
    return NextResponse.json(notification, { status: 201 });
  } catch (error: any) {
    console.error('Error creating notification API:', error);
    return NextResponse.json(
      { error: error.message || 'Internal Server Error' },
      { status: 500 }
    );
  }
}
