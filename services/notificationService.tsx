// services/notificationService.ts

/**
 * Parameters required to process and trigger an outbreak notification.
 */
export interface PredictionInput {
  disease: string;
  province: string;
  risk_level: 'High' | 'Medium' | 'Low';
  predicted_cases: number;
  confirmed_cases: number;
  confidence: number;
}

/**
 * Structure of an outbreak alert notification stored and displayed.
 */
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
  prediction_data: unknown;
}

// In-memory notification store initialized with realistic outbreak alerts
let notificationsStore: OutbreakNotification[] = [
  {
    id: 'notif-cholera-01',
    disease: 'Cholera',
    province: 'Harare',
    risk_level: 'High',
    predicted_cases: 740,
    confidence: 91,
    expected_peak: 'Sep 2026',
    trigger_reason: 'Extreme case surge predicted: +42.0%',
    recommended_actions: [
      'Emergency water purification measures',
      'Set up oral rehydration points',
      'Distribute water purification tablets',
      'Sanitation facility inspection'
    ],
    urgency: 'critical',
    timestamp: new Date(Date.now() - 1000 * 60 * 15), // 15 mins ago
    read: false,
    prediction_data: { disease: 'Cholera', province: 'Harare', predicted_cases: 740 }
  },
  {
    id: 'notif-ebola-02',
    disease: 'Ebola',
    province: 'North Kivu',
    risk_level: 'High',
    predicted_cases: 120,
    confidence: 94,
    expected_peak: 'Sep 2026',
    trigger_reason: 'Health zone transmission velocity increase',
    recommended_actions: [
      'Deploy rapid response epidemiology teams',
      'Activate ring vaccination protocols',
      'Reinforce border health screening points'
    ],
    urgency: 'critical',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 2), // 2 hours ago
    read: false,
    prediction_data: { disease: 'Ebola', province: 'North Kivu', predicted_cases: 120 }
  },
  {
    id: 'notif-malaria-03',
    disease: 'Malaria',
    province: 'Manicaland',
    risk_level: 'Medium',
    predicted_cases: 480,
    confidence: 88,
    expected_peak: 'Oct 2026',
    trigger_reason: 'Precipitation index anomaly: +18.5%',
    recommended_actions: [
      'Distribute insecticide-treated bed nets',
      'Initiate vector control spraying',
      'Stockpile antimalarial drugs'
    ],
    urgency: 'high',
    timestamp: new Date(Date.now() - 1000 * 60 * 60 * 12), // 12 hours ago
    read: false,
    prediction_data: { disease: 'Malaria', province: 'Manicaland', predicted_cases: 480 }
  }
];

export class NotificationService {
  /**
   * Generates, stores, and returns a new outbreak notification.
   */
  static async createOutbreakNotification(prediction: PredictionInput): Promise<OutbreakNotification> {
    const notification: OutbreakNotification = {
      id: `notif_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      disease: prediction.disease,
      province: prediction.province,
      risk_level: prediction.risk_level,
      predicted_cases: prediction.predicted_cases,
      confidence: prediction.confidence,
      expected_peak: this.calculateExpectedPeak(),
      trigger_reason: this.getTriggerReason(prediction),
      recommended_actions: this.generateRecommendedActions(prediction),
      urgency: prediction.risk_level === 'High' ? 'critical' : prediction.risk_level === 'Medium' ? 'high' : 'medium',
      timestamp: new Date(),
      read: false,
      prediction_data: prediction
    };

    notificationsStore.unshift(notification);
    return notification;
  }

  /**
   * Fetches all outbreak notifications sorted by newest first.
   */
  static async getAllNotifications(): Promise<OutbreakNotification[]> {
    return [...notificationsStore].sort((a, b) => b.timestamp.getTime() - a.timestamp.getTime());
  }

  /**
   * Marks a specific notification as read.
   */
  static async markAsRead(notificationId: string): Promise<void> {
    const item = notificationsStore.find((n) => n.id === notificationId);
    if (item) {
      item.read = true;
    }
  }

  /**
   * Counts the total number of unread notifications.
   */
  static async getUnreadCount(): Promise<number> {
    return notificationsStore.filter((n) => !n.read).length;
  }

  private static calculateExpectedPeak(): string {
    const now = new Date();
    const currentMonth = now.getMonth();
    const peakMonth = (currentMonth + 1) % 12;
    const currentYear = now.getFullYear();
    const peakYear = peakMonth < currentMonth ? currentYear + 1 : currentYear;
    const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return `${monthNames[peakMonth]} ${peakYear}`;
  }

  private static getTriggerReason(prediction: PredictionInput): string {
    const increase = ((prediction.predicted_cases - prediction.confirmed_cases) / Math.max(prediction.confirmed_cases, 1)) * 100;
    if (increase > 50) return `Extreme case surge predicted: +${increase.toFixed(1)}%`;
    if (increase > 30) return `High case increase: +${increase.toFixed(1)}%`;
    if (increase > 15) return `Moderate case rise: +${increase.toFixed(1)}%`;
    return `Slight case increase: +${increase.toFixed(1)}%`;
  }

  private static generateRecommendedActions(prediction: PredictionInput): string[] {
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
        'Stockpile antimalarial drugs'
      ],
      'COVID-19': [
        'Activate testing centers',
        'Prepare isolation facilities',
        'Review vaccination campaign plans'
      ],
      'Cholera': [
        'Emergency water purification measures',
        'Set up oral rehydration points',
        'Distribute water purification tablets'
      ],
      'Influenza': [
        'Increase flu vaccine availability',
        'Prepare outpatient facilities',
        'Stock antiviral medications'
      ],
      'Typhoid': [
        'Water quality testing',
        'Food safety inspections',
        'Stock antibiotics'
      ],
      'Ebola': [
        'Deploy rapid response epidemiology teams',
        'Activate ring vaccination protocols',
        'Reinforce border health screening points'
      ]
    };

    return [
      ...baseActions,
      ...(diseaseSpecificActions[prediction.disease] || [])
    ];
  }
}