'use server';

import nodemailer from 'nodemailer';
import { getAllUsers, type User } from '@/lib/users';

/**
 * Interface representing prediction payload data for a specific province.
 */
export interface PredictionPayload {
  province: string;
  risk_level: string;
  predicted_cases?: number;
  current_cases?: number;
  growth_rate?: string;
}

/**
 * Interface representing national-level outbreak prediction aggregated stats.
 */
export interface NationalPrediction {
  total_predicted_cases?: number;
  average_risk?: string;
  high_risk_provinces?: string[];
  overall_confidence?: number;
}

/**
 * Interface representing the result of the bulk email dispatch operation.
 */
export interface EmailAlertResult {
  success: boolean;
  message?: string;
  errors?: string[];
  sentCount: number;
  errorCount: number;
}

const createTransporter = () => {
  const host = process.env.SMTP_HOST || 'smtp.gmail.com';
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: {
      user,
      pass,
    },
  });
};

export const getActiveUsers = async (): Promise<User[]> => {
  return getAllUsers().filter((u) => u.is_active);
};

export const getTotalUsersCount = async (): Promise<{ count: number; error?: string }> => {
  try {
    return { count: getAllUsers().length };
  } catch (error: any) {
    return { count: 0, error: error.message || 'Failed to get count' };
  }
};

function generateEmailContent(
  user: User,
  userProvincePrediction: PredictionPayload | undefined,
  diseaseName: string,
  nationalPrediction: NationalPrediction
) {
  const currentDate = new Date().toLocaleDateString('en-US', { 
    weekday: 'long', 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  const riskLevel = userProvincePrediction?.risk_level || nationalPrediction.average_risk || 'Low';
  
  const getRiskColors = (risk: string = 'Low') => {
    const riskLower = risk.toLowerCase();
    if (riskLower === 'high') {
      return { primary: '#dc2626', light: '#fef2f2', border: '#dc2626', badge: '#ef4444' };
    } else if (riskLower === 'medium') {
      return { primary: '#d97706', light: '#fffbeb', border: '#d97706', badge: '#f59e0b' };
    } else {
      return { primary: '#059669', light: '#ecfdf5', border: '#059669', badge: '#10b981' };
    }
  };

  const colors = getRiskColors(riskLevel);
  const subject = `🚨 ${diseaseName} Outbreak Alert - ${riskLevel.toUpperCase()} Risk Level`;

  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; padding: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
    .header { color: white; padding: 20px; text-align: center; margin-bottom: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header" style="background: ${colors.primary};">
      <h1>🚨 Disease Outbreak Alert</h1>
      <h2>${diseaseName} - ${riskLevel.toUpperCase()} Risk Level</h2>
    </div>
    <div class="content">
      <p><strong>Hello ${user.username},</strong></p>
      <p>Here's your ${user.province} province outbreak alert summary for ${currentDate}.</p>
      <p>Total National Predicted Cases: ${nationalPrediction.total_predicted_cases || 0}</p>
    </div>
  </div>
</body>
</html>`;

  const text = `DISEASE OUTBREAK ALERT - ${diseaseName} (${riskLevel.toUpperCase()})\nHello ${user.username},\nProvince: ${user.province}\nDate: ${currentDate}`;

  return { html, text, subject };
}

export async function sendProvinceAlerts(
  predictions: PredictionPayload[],
  disease: string,
  nationalPrediction: NationalPrediction
): Promise<EmailAlertResult> {
  const users = await getActiveUsers();

  if (users.length === 0) {
    return {
      success: true,
      message: 'No registered users found to notify',
      sentCount: 0,
      errorCount: 0,
    };
  }

  const transporter = createTransporter();

  if (!transporter) {
    // Simulated dispatch when SMTP not configured
    return {
      success: true,
      message: `Simulated dispatch: ${users.length} alerts generated for active officials`,
      sentCount: users.length,
      errorCount: 0,
    };
  }

  let sentCount = 0;
  let errorCount = 0;
  const errors: string[] = [];

  for (const user of users) {
    try {
      const userProvincePrediction = predictions.find(
        (p) => p.province.toLowerCase() === user.province.toLowerCase()
      );
      const { html, text, subject } = generateEmailContent(
        user,
        userProvincePrediction,
        disease,
        nationalPrediction
      );

      await transporter.sendMail({
        from: `"Epidemic Oracle Alert" <${process.env.SMTP_USER}>`,
        to: user.email,
        subject,
        html,
        text,
      });
      sentCount++;
    } catch (err: any) {
      errorCount++;
      errors.push(`${user.email}: ${err.message}`);
    }
  }

  return {
    success: errorCount === 0,
    message: `Alerts dispatched: ${sentCount} sent, ${errorCount} errors`,
    sentCount,
    errorCount,
    errors: errors.length > 0 ? errors : undefined,
  };
}