// components/NotificationBell.tsx
'use client';
import React, { useState, useEffect } from 'react';
import { Bell, AlertTriangle, CheckCircle, X } from 'lucide-react';
import { NotificationService, OutbreakNotification } from '@/services/notificationService';

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
    // Refresh every 30 seconds for new notifications
    const interval = setInterval(loadNotifications, 30000);
    return () => clearInterval(interval);
  }, []);

  const loadNotifications = async () => {
    setLoading(true);
    try {
      const allNotifications = await NotificationService.getAllNotifications();
      setNotifications(allNotifications);
      setUnreadCount(allNotifications.filter(n => !n.read).length);
    } catch (error) {
      console.error('Error loading notifications:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: string) => {
    await NotificationService.markAsRead(notificationId);
    loadNotifications(); // Reload to update counts
  };

  const handleMarkAllAsRead = async () => {
    const unreadNotifications = notifications.filter(n => !n.read);
    for (const notification of unreadNotifications) {
      await NotificationService.markAsRead(notification.id);
    }
    loadNotifications();
  };

  const getUrgencyColor = (urgency: string) => {
    switch (urgency) {
      case 'critical': return 'text-red-400 bg-red-500/20 border-red-500/30';
      case 'high': return 'text-orange-400 bg-orange-500/20 border-orange-500/30';
      case 'medium': return 'text-yellow-400 bg-yellow-500/20 border-yellow-500/30';
      default: return 'text-blue-400 bg-blue-500/20 border-blue-500/30';
    }
  };

  const getRiskIcon = (riskLevel: string) => {
    switch (riskLevel) {
      case 'High': return <AlertTriangle className="w-4 h-4 text-red-400" />;
      case 'Medium': return <AlertTriangle className="w-4 h-4 text-yellow-400" />;
      default: return <AlertTriangle className="w-4 h-4 text-blue-400" />;
    }
  };

  return (
    <div className="relative">
      {/* Notification Bell */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2 text-blue-200 hover:text-white hover:bg-white/10 rounded-lg transition-colors"
      >
        <Bell className="w-5 h-5" />
        {unreadCount > 0 && (
          <span className="absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 bg-red-500 text-white text-xs font-bold rounded-full">
            {unreadCount > 9 ? '9+' : unreadCount}
          </span>
        )}
      </button>

      {/* Notification Dropdown */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-96 bg-slate-800 border border-blue-500/20 rounded-lg shadow-xl z-50">
          <div className="p-4 border-b border-blue-500/20">
            <div className="flex items-center justify-between">
              <h3 className="text-white font-semibold">Outbreak Alerts</h3>
              <div className="flex gap-2">
                {unreadCount > 0 && (
                  <button
                    onClick={handleMarkAllAsRead}
                    className="text-blue-400 hover:text-blue-300 text-sm transition-colors"
                  >
                    Mark all read
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="text-blue-400 hover:text-blue-300 transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {loading ? (
              <div className="p-4 text-center text-blue-200/60">
                Loading notifications...
              </div>
            ) : notifications.length === 0 ? (
              <div className="p-6 text-center text-blue-200/60">
                <Bell className="w-8 h-8 mx-auto mb-2 opacity-50" />
                <p>No outbreak alerts</p>
              </div>
            ) : (
              notifications.map((notification) => (
                <div
                  key={notification.id}
                  className={`p-4 border-b border-blue-500/10 cursor-pointer transition-colors hover:bg-white/5 ${
                    !notification.read ? 'bg-blue-500/5' : ''
                  }`}
                  onClick={() => {
                    handleMarkAsRead(notification.id);
                    onNotificationClick?.(notification);
                    setIsOpen(false);
                  }}
                >
                  <div className="flex items-start gap-3">
                    {getRiskIcon(notification.risk_level)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <span className="text-white font-semibold text-sm">
                          {notification.disease} in {notification.province}
                        </span>
                        <span className={`px-2 py-1 rounded text-xs border ${getUrgencyColor(notification.urgency)}`}>
                          {notification.risk_level} Risk
                        </span>
                      </div>
                      
                      <p className="text-blue-200/80 text-sm mb-2">
                        {notification.trigger_reason}
                      </p>
                      
                      <div className="text-blue-200/60 text-xs space-y-1">
                        <div>🔼 {notification.predicted_cases.toLocaleString()} predicted cases</div>
                        <div>📊 {notification.confidence}% confidence</div>
                        <div>📅 Expected peak: {notification.expected_peak}</div>
                      </div>

                      <div className="mt-2">
                        <p className="text-green-400 text-xs font-semibold mb-1">Recommended:</p>
                        <ul className="text-blue-200/70 text-xs space-y-1">
                          {notification.recommended_actions.slice(0, 2).map((action, index) => (
                            <li key={index}>• {action}</li>
                          ))}
                          {notification.recommended_actions.length > 2 && (
                            <li className="text-blue-400">+{notification.recommended_actions.length - 2} more actions</li>
                          )}
                        </ul>
                      </div>
                    </div>
                    
                    {!notification.read && (
                      <div className="w-2 h-2 bg-blue-400 rounded-full flex-shrink-0 mt-2"></div>
                    )}
                  </div>
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