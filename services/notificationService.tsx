// services/notificationService.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

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
  timestamp: Date;
  read: boolean;
  prediction_data: any;
}

export class NotificationService {
  static async createOutbreakNotification(prediction: any): Promise<OutbreakNotification> {
    const notification: OutbreakNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      disease: prediction.disease,
      province: prediction.province,
      risk_level: prediction.risk_level,
      predicted_cases: prediction.predicted_cases,
      confidence: prediction.confidence,
      expected_peak: this.calculateExpectedPeak(prediction),
      trigger_reason: this.getTriggerReason(prediction),
      recommended_actions: this.generateRecommendedActions(prediction),
      urgency: prediction.risk_level === 'High' ? 'critical' : prediction.risk_level === 'Medium' ? 'high' : 'medium',
      timestamp: new Date(),
      read: false,
      prediction_data: prediction
    };

    // Store notification in database
    await this.storeNotification(notification);
    
    return notification;
  }

  static async getAllNotifications(): Promise<OutbreakNotification[]> {
    const { data, error } = await supabase
      .from('outbreak_notifications')
      .select('*')
      .order('timestamp', { ascending: false });

    if (error) {
      console.error('Error fetching notifications:', error);
      return [];
    }

    return data.map(notif => ({
      ...notif,
      timestamp: new Date(notif.timestamp)
    }));
  }

  static async markAsRead(notificationId: string): Promise<void> {
    const { error } = await supabase
      .from('outbreak_notifications')
      .update({ read: true })
      .eq('id', notificationId);

    if (error) {
      console.error('Error marking notification as read:', error);
    }
  }

  static async getUnreadCount(): Promise<number> {
    const { count, error } = await supabase
      .from('outbreak_notifications')
      .select('*', { count: 'exact', head: true })
      .eq('read', false);

    if (error) {
      console.error('Error getting unread count:', error);
      return 0;
    }

    return count || 0;
  }

  private static calculateExpectedPeak(prediction: any): string {
    const currentMonth = new Date().getMonth() + 1;
    const peakMonth = (currentMonth % 12) + 1;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[peakMonth - 1]} 2025`;
  }

  private static getTriggerReason(prediction: any): string {
    const increase = ((prediction.predicted_cases - prediction.confirmed_cases) / prediction.confirmed_cases) * 100;
    
    if (increase > 50) return `Extreme case surge predicted: +${increase.toFixed(1)}%`;
    if (increase > 30) return `High case increase: +${increase.toFixed(1)}%`;
    if (increase > 15) return `Moderate case rise: +${increase.toFixed(1)}%`;
    return `Slight case increase: +${increase.toFixed(1)}%`;
  }

  private static generateRecommendedActions(prediction: any): string[] {
    const baseActions = [
      'Increase surveillance and testing in affected areas',
      'Alert local healthcare facilities',
      'Review stock levels of essential medicines',
      'Coordinate with provincial health team'
    ];

    const diseaseSpecificActions: { [key: string]: string[] } = {
      'Malaria': [
        'Distribute insecticide-treated bed nets',
        'Initiate vector control spraying',
        'Stockpile antimalarial drugs',
        'Launch public awareness campaign'
      ],
      'COVID-19': [
        'Activate testing centers',
        'Prepare isolation facilities',
        'Review vaccination campaign plans',
        'Implement public gathering guidelines'
      ],
      'Cholera': [
        'Emergency water purification measures',
        'Set up oral rehydration points',
        'Distribute water purification tablets',
        'Sanitation facility inspection'
      ],
      'Influenza': [
        'Increase flu vaccine availability',
        'Prepare outpatient facilities',
        'Stock antiviral medications',
        'Public hygiene awareness'
      ],
      'Typhoid': [
        'Water quality testing',
        'Food safety inspections',
        'Stock antibiotics',
        'Community sanitation drive'
      ]
    };

    return [
      ...baseActions,
      ...(diseaseSpecificActions[prediction.disease] || [])
    ];
  }

  private static async storeNotification(notification: OutbreakNotification): Promise<void> {
    const { error } = await supabase
      .from('outbreak_notifications')
      .insert({
        id: notification.id,
        disease: notification.disease,
        province: notification.province,
        risk_level: notification.risk_level,
        predicted_cases: notification.predicted_cases,
        confidence: notification.confidence,
        expected_peak: notification.expected_peak,
        trigger_reason: notification.trigger_reason,
        recommended_actions: notification.recommended_actions,
        urgency: notification.urgency,
        timestamp: notification.timestamp.toISOString(),
        read: notification.read,
        prediction_data: notification.prediction_data
      });

    if (error) {
      console.error('Failed to store notification:', error);
    }
  }
}