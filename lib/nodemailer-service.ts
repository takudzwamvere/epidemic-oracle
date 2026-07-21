'use server';

import { prisma } from '@/lib/prisma';
import nodemailer from 'nodemailer';
import { User } from '@prisma/client';

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

// Create transporter - USING NODEMAILER ONLY
const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    },
  });
};

/**
 * Sends email alert notifications to users based on province predictions and national stats.
 * @param predictions Array of province-level prediction payloads.
 * @param disease Name of the disease outbreak.
 * @param nationalPrediction Aggregated national prediction data.
 * @returns Summary object detailing total users, sent count, and error count.
 */
export async function sendProvinceAlerts(predictions: PredictionPayload[], disease: string, nationalPrediction: NationalPrediction) {
  let transporter;
  
  try {
    console.log('🚨 Starting email alerts with Nodemailer SMTP...');

    // Create transporter
    transporter = createTransporter();

    // Verify connection first
    await transporter.verify();
    console.log('✅ SMTP connection verified');

    // Get ALL users from the table
    const users = await prisma.user.findMany();

    if (!users || users.length === 0) {
      return { 
        success: true, 
        message: 'No users found to send alerts to',
        sentCount: 0,
        errorCount: 0
      };
    }

    console.log(`📧 Found ${users.length} users to notify`);

    let sentCount = 0;
    let errorCount = 0;
    const errors: string[] = [];

    // Send alerts to each user
    for (const user of users) {
      try {
        const userProvincePrediction = predictions.find(
          p => p.province.toLowerCase() === user.province.toLowerCase()
        );

        const highRiskProvinces = predictions.filter((p: PredictionPayload) => p.risk_level === 'High');
        const mediumRiskProvinces = predictions.filter((p: PredictionPayload) => p.risk_level === 'Medium');

        const { html, text, subject } = generateEmailContent(
          user,
          userProvincePrediction,
          disease,
          nationalPrediction
        );

        const mailOptions = {
          from: `"Disease Alerts" <${process.env.SMTP_USER}>`,
          to: user.email,
          subject: subject,
          html: html,
          text: text,
        };

        await transporter.sendMail(mailOptions);

        console.log(`✅ Alert sent to ${user.email}`);
        sentCount++;

        // Small delay to avoid rate limiting
        await new Promise(resolve => setTimeout(resolve, 500));

      } catch (error: unknown) {
        const errMsg = error instanceof Error ? error.message : 'Unknown SMTP error';
        console.error(`❌ Failed to send alert to ${user.email}:`, error);
        errorCount++;
        errors.push(`${user.email}: ${errMsg}`);
      }
    }

    let message = `Email alerts completed: ${sentCount} sent successfully`;
    if (errorCount > 0) {
      message += `, ${errorCount} failed`;
    }

    console.log(`📊 Email summary: ${sentCount} successful, ${errorCount} failed`);

    return {
      success: true,
      message,
      sentCount,
      errorCount,
      totalUsers: users.length,
      errors: errors.length > 0 ? errors : undefined
    };

  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Unknown SMTP error';
    console.error('❌ Email alert sending failed:', error);
    return { 
      success: false, 
      message: `Failed to send email alerts: ${errMsg}`,
      sentCount: 0,
      errorCount: 0,
      totalUsers: 0
    };
  } finally {
    // Close the transporter
    if (transporter) {
      transporter.close();
    }
  }
}

/**
 * Generates formatted HTML, plain text, and subject line for email alerts.
 * @param user User object receiving the alert.
 * @param userProvincePrediction Prediction data specific to the user's province.
 * @param disease Name of the disease outbreak.
 * @param nationalPrediction Aggregated national prediction data.
 * @returns Object containing html, text, and subject properties.
 */
function generateEmailContent(
  user: User,
  userProvincePrediction: PredictionPayload | undefined,
  disease: string,
  nationalPrediction: NationalPrediction
) {
  const diseaseName = disease.charAt(0).toUpperCase() + disease.slice(1);
  const currentDate = new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });

  // Get the appropriate risk level for coloring
  const riskLevel = userProvincePrediction?.risk_level || nationalPrediction.average_risk;
  
  // Dynamic colors based on risk level
  const getRiskColors = (risk: string) => {
    const riskLower = risk.toLowerCase();
    if (riskLower === 'high') {
      return {
        primary: '#dc2626',    // red-600
        light: '#fef2f2',      // red-50
        border: '#dc2626',     // red-600
        badge: '#ef4444'       // red-500
      };
    } else if (riskLower === 'medium') {
      return {
        primary: '#d97706',    // amber-600
        light: '#fffbeb',      // amber-50
        border: '#d97706',     // amber-600
        badge: '#f59e0b'       // amber-500
      };
    } else {
      // Low risk or default
      return {
        primary: '#059669',    // emerald-600
        light: '#ecfdf5',      // emerald-50
        border: '#059669',     // emerald-600
        badge: '#10b981'       // emerald-500
      };
    }
  };

  const colors = getRiskColors(riskLevel);
  const nationalColors = getRiskColors(nationalPrediction.average_risk);

  const subject = `🚨 ${diseaseName} Outbreak Alert - ${riskLevel.toUpperCase()} Risk Level`;

  // HTML Content
  const html = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <style>
    body { font-family: Arial, sans-serif; line-height: 1.6; color: #333; margin: 0; padding: 20px; background: #f5f5f5; }
    .container { max-width: 600px; margin: 0 auto; background: white; border-radius: 10px; padding: 20px; box-shadow: 0 2px 5px rgba(0,0,0,0.1); }
    .header { color: white; padding: 20px; border-radius: 8px; text-align: center; margin-bottom: 20px; }
    .alert-box { padding: 15px; border-radius: 6px; border-left: 4px solid; margin: 15px 0; }
    .info-box { background: #f0f9ff; padding: 15px; border-radius: 6px; border-left: 4px solid #0369a1; margin: 15px 0; }
    .stats { display: grid; grid-template-columns: 1fr 1fr; gap: 10px; margin: 15px 0; }
    .stat { background: #f8fafc; padding: 10px; border-radius: 4px; text-align: center; }
    .footer { margin-top: 20px; padding-top: 15px; border-top: 1px solid #e5e7eb; color: #6b7280; font-size: 12px; text-align: center; }
    .risk-indicator {
      display: inline-block;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      margin-right: 8px;
    }
    @media (max-width: 600px) {
      .stats { grid-template-columns: 1fr; }
    }
  </style>
</head>
<body>
  <div class="container">
    <!-- Dynamic Header Color -->
    <div class="header" style="background: ${colors.primary};">
      <h1>🚨 Disease Outbreak Alert</h1>
      <h2>${diseaseName} - ${riskLevel.toUpperCase()} Risk Level</h2>
    </div>
    
    <div class="content">
      <p><strong>Hello ${user.username},</strong></p>
      <p>Here's your ${user.province} province outbreak alert:</p>

      <!-- Province Alert Box with Dynamic Colors -->
      <div class="alert-box" style="background: ${colors.light}; border-left-color: ${colors.border};">
        <h3 style="margin-top: 0; color: ${colors.primary};">
          <span class="risk-indicator" style="background: ${colors.primary};"></span>
          📍 ${user.province} Province Alert
        </h3>
        
        ${userProvincePrediction ? `
        <div class="stats">
          <div class="stat">
            <strong style="color: ${colors.primary};">${userProvincePrediction.predicted_cases?.toLocaleString() || '0'}</strong>
            <div>Predicted Cases</div>
          </div>
          <div class="stat">
            <strong style="color: ${colors.primary};">${userProvincePrediction.current_cases?.toLocaleString() || '0'}</strong>
            <div>Current Cases</div>
          </div>
          <div class="stat">
            <strong style="color: ${colors.primary};">${userProvincePrediction.growth_rate || '0%'}</strong>
            <div>Growth Rate</div>
          </div>
          <div class="stat">
            <strong style="color: ${colors.primary};">${userProvincePrediction.risk_level || 'Low'}</strong>
            <div>Risk Level</div>
          </div>
        </div>
        ` : `
        <p>No specific prediction data available for ${user.province}. Please refer to the national overview below.</p>
        `}
      </div>

      <!-- National Overview -->
      <div class="info-box">
        <h3 style="margin-top: 0; color: #0369a1;">🇿🇼 National Overview</h3>
        <div class="stats">
          <div class="stat">
            <strong style="color: ${nationalColors.primary};">${nationalPrediction.total_predicted_cases?.toLocaleString() || '0'}</strong>
            <div>Total Cases</div>
          </div>
          <div class="stat">
            <strong style="color: ${nationalColors.primary};">${nationalPrediction.high_risk_provinces?.length || 0}</strong>
            <div>High Risk Provinces</div>
          </div>
          <div class="stat">
            <strong style="color: ${nationalColors.primary};">${nationalPrediction.average_risk || 'Low'}</strong>
            <div>Overall Risk</div>
          </div>
          <div class="stat">
            <strong style="color: ${nationalColors.primary};">${nationalPrediction.overall_confidence || 0}%</strong>
            <div>Confidence</div>
          </div>
        </div>
      </div>

      <!-- Recommended Actions -->
      <div style="background: #ecfdf5; padding: 15px; border-radius: 6px; margin: 15px 0;">
        <h4 style="margin-top: 0; color: #059669;">🛡️ Recommended Actions:</h4>
        <ul>
          <li>Increase surveillance and testing</li>
          <li>Prepare healthcare facilities</li>
          <li>Alert local health authorities</li>
          <li>Implement preventive measures</li>
        </ul>
      </div>

      <div class="footer">
        <p><strong>Generated:</strong> ${currentDate}</p>
        <p>This is an automated alert from the Disease Prediction System</p>
      </div>
    </div>
  </div>
</body>
</html>
  `;

  // Plain text content
  const text = `
DISEASE OUTBREAK ALERT
=======================

Hello ${user.username},

${diseaseName} Outbreak - ${riskLevel.toUpperCase()} Risk Level

YOUR PROVINCE (${user.province}):
${userProvincePrediction ? `
- Predicted Cases: ${userProvincePrediction.predicted_cases?.toLocaleString() || '0'}
- Current Cases: ${userProvincePrediction.current_cases?.toLocaleString() || '0'}
- Growth Rate: ${userProvincePrediction.growth_rate || '0%'}
- Risk Level: ${userProvincePrediction.risk_level || 'Low'} ${riskLevel === 'high' ? '🚨' : riskLevel === 'medium' ? '⚠️' : '✅'}
` : `
- No specific data for ${user.province}
`}

NATIONAL OVERVIEW:
- Total Predicted Cases: ${nationalPrediction.total_predicted_cases?.toLocaleString() || '0'}
- Overall Risk: ${nationalPrediction.average_risk || 'Low'}
- High Risk Provinces: ${nationalPrediction.high_risk_provinces?.length || 0}

RECOMMENDED ACTIONS:
• Increase surveillance and testing
• Prepare healthcare facilities  
• Alert local health authorities
• Implement preventive measures

Generated: ${currentDate}
Automated alert from Disease Prediction System
  `;

  return { html, text, subject };
}

// ADD THIS FUNCTION - IT WAS MISSING
/**
 * Retrieves the total user count from the database using Prisma.
 * @returns Object containing user count or database error message.
 */
export async function getTotalUsersCount() {
  try {
    const count = await prisma.user.count();
    return { count, error: null };
  } catch (error: unknown) {
    const errMsg = error instanceof Error ? error.message : 'Unknown database error';
    return { count: 0, error: errMsg };
  }
}