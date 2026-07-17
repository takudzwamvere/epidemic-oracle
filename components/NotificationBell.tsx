// components/NotificationBell.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, CheckCircle, X } from 'lucide-react';

export interface OutbreakNotification {
  id: string;
  disease: string;
  province: string;
  risk_level: 'High' | 'Medium' | 'Low';
  predicted_cases: number;
  confidence: number;
  expected_peak: string;
  trigger_reason: string;
  recommended_actions: string[];
  urgency: 'critical' | 'high' | 'medium';
  timestamp: string;
  read: boolean;
}

interface NotificationBellProps {
  onNotificationClick?: (notification: OutbreakNotification) => void;
}

const NotificationBell: React.FC<NotificationBellProps> = ({ onNotificationClick }) => {
  const [notifications, setNotifications] = useState<OutbreakNotification[]>([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [isOpen, setIsOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    loadNotifications();
    const interval = setInterval(loadNotifications, 20000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/notifications');
      if (res.ok) {
        const allNotifications = await res.json();
        setNotifications(allNotifications);
        setUnreadCount(allNotifications.filter((n: any) => !n.read).length);
      }
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      const res = await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ id: notificationId }),
      });
      if (res.ok) {
        // Optimistic update
        setNotifications(prev =>
          prev.map(n => (n.id === notificationId ? { ...n, read: true } : n))
        );
        setUnreadCount(prev => Math.max(0, prev - 1));
      }
    } catch (error) {
      console.error('Error marking as read:', error);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      const res = await fetch('/api/notifications/read', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ all: true }),
      });
      if (res.ok) {
        setNotifications(prev => prev.map(n => ({ ...n, read: true })));
        setUnreadCount(0);
      }
    } catch (error) {
      console.error('Error marking all as read:', error);
    }
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical':
        return 'text-red-600 bg-red-50 border-red-200';
      case 'high':
        return 'text-orange-600 bg-orange-50 border-orange-200';
      case 'medium':
        return 'text-yellow-600 bg-yellow-50 border-yellow-200';
      default:
        return 'text-blue-600 bg-blue-50 border-blue-200';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High':
        return <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0" />;
      case 'Medium':
        return <AlertTriangle className="w-4 h-4 text-yellow-500 flex-shrink-0" />;
      default:
        return <AlertTriangle className="w-4 h-4 text-blue-500 flex-shrink-0" />;
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-all duration-150"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute top-1 right-1 flex items-center justify-center w-4 h-4 bg-red-600 text-white text-[10px] font-bold rounded-full animate-bounce">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-11 w-96 bg-white border border-slate-200 rounded-xl shadow-xl z-50 overflow-hidden divide-y divide-slate-100">
          <div className="p-4 bg-slate-50">
            <div className="flex items-center justify-between">
              <h3 className="text-slate-900 font-semibold text-sm">Outbreak Alerts</h3>
              <div className="flex gap-3">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-blue-600 hover:text-blue-700 text-xs font-semibold transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-slate-400 hover:text-slate-600 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100">
            {loading && notifications.length === 0 ? (
              <div className="p-6 text-center text-slate-500 text-sm">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-8 text-center text-slate-500">
                <Bell className="w-8 h-8 mx-auto mb-2 text-slate-300" />
                <p className="text-sm">No outbreak alerts found</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 cursor-pointer transition-colors hover:bg-slate-50 flex gap-3 ${
                    !notification.read ? 'bg-blue-50/30' : ''
                  }`}
                  onClick={() => {
                    handleMarkAsRead(notification.id);
                    onNotificationClick?.(notification);
                    setIsOpen(false);
                  }}
                >
                  {getRiskIcon(notification.risk_level)}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between mb-1 gap-2">
                      <span className="text-slate-900 font-bold text-xs truncate">
                        {notification.disease} in {notification.province}
                      </span>
                      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold border uppercase tracking-wider ${getUrgencyColor(notification.urgency)}`}>
                        {notification.risk_level}
                      </span>
                    </div>
                    
                    <p className="text-slate-600 text-xs mb-2 leading-relaxed">
                      {notification.trigger_reason}
                    </p>
                    
                    <div className="grid grid-cols-2 gap-x-2 gap-y-1 text-slate-500 text-[10px] font-medium bg-slate-50 p-2 rounded-lg mb-2">
                      <div>🔼 {notification.predicted_cases.toLocaleString()} cases</div>
                      <div>📊 {notification.confidence}% confidence</div>
                      <div className="col-span-2">📅 Expected peak: {notification.expected_peak}</div>
                    </div>

                    <div>
                      <p className="text-emerald-700 text-[10px] font-bold uppercase tracking-wider mb-1">Recommended Actions:</p>
                      <ul className="text-slate-600 text-xs space-y-1 pl-2 list-disc">
                        {notification.recommended_actions.slice(0, 2).map((action, index) => (
                          <li key={index} className="truncate">{action}</li>
                        ))}
                        {notification.recommended_actions.length > 2 && (
                          <li className="text-blue-600 list-none font-semibold text-[10px] mt-0.5">
                            +{notification.recommended_actions.length - 2} more actions
                          </li>
                        )}
                      </ul>
                    </div>
                  </div>
                  
                  {!notification.read && (
                    <div className="w-1.5 h-1.5 bg-blue-600 rounded-full flex-shrink-0 mt-1.5"></div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;