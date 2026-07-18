import { NextResponse } from 'next/server';
import { getSessionUser } from '@/lib/auth';
import { NotificationService } from '@/services/notificationService';

export async function POST(request: Request) {
  try {
    const sessionUser = await getSessionUser(request);
    if (!sessionUser) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id, all } = await request.json();

    if (all) {
      const notifications = await NotificationService.getAllNotifications();
      const unreadNotifications = notifications.filter((n) => !n.read);
      for (const notification of unreadNotifications) {
        await NotificationService.markAsRead(notification.id);
      }
      return NextResponse.json({ message: 'All notifications marked as read' });
    }

    if (!id) {
      return NextResponse.json(
        { error: 'Notification ID is required' },
        { status: 400 }
      );
    }

    await NotificationService.markAsRead(id);
    return NextResponse.json({ message: `Notification ${id} marked as read` });
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Internal Server Error';
    console.error('Error marking notifications as read API:', error);
    return NextResponse.json(
      { error: errMsg },
      { status: 500 }
    );
  }
}
