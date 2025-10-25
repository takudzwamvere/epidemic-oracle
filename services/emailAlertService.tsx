// services/emailAlertService.ts
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export interface PredictionResult {
  province: string;
  predicted_cases: number;
  risk_level: 'High' | 'Medium' | 'Low';
  confidence: number;
  growth_rate: string;
  current_cases?: number;
}

export interface NationalPrediction {
  total_predicted_cases: number;
  average_risk: string;
  high_risk_provinces: string[];
  medium_risk_provinces: string[];
  overall_confidence: number;
  total_provinces: number;
}

export interface EmailRecipient {
  id: string;
  email: string;
  name: string;
  role: string;
  province: string;
  is_active: boolean;
}

export class EmailAlertService {
  static async getRecipients(): Promise<EmailRecipient[]> {
    try {
      const { data, error } = await supabase
        .from('alert_recipients')
        .select('*')
        .eq('is_active', true);

      if (error) {
        console.error('Error fetching recipients:', error);
        return [];
      }

      return data || [];
    } catch (error) {
      console.error('Error getting recipients:', error);
      return [];
    }
  }

  static async sendOutbreakAlert(
    disease: string,
    predictions: PredictionResult[],
    nationalPrediction: NationalPrediction
  ): Promise<{ success: boolean; sentTo: string[]; errors: string[] }> {
    const recipients = await this.getRecipients();
    const results = {
      success: false,
      sentTo: [] as string[],
      errors: [] as string[]
    };

    if (recipients.length === 0) {
      results.errors.push('No active recipients found');
      return results;
    }

    console.log(`📧 Preparing to send alerts to ${recipients.length} recipients`);

    for (const recipient of recipients) {
      try {
        const sent = await this.sendEmailToRecipient(recipient, disease, predictions, nationalPrediction);
        if (sent) {
          results.sentTo.push(recipient.email);
          console.log(`✅ Email sent to: ${recipient.email}`);
        }
      } catch (error) {
        const errorMsg = `Failed to send to ${recipient.email}: ${error}`;
        results.errors.push(errorMsg);
        console.error(errorMsg);
      }
    }

    results.success = results.sentTo.length > 0;
    return results;
  }

  private static async sendEmailToRecipient(
    recipient: EmailRecipient,
    disease: string,
    predictions: PredictionResult[],
    nationalPrediction: NationalPrediction
  ): Promise<boolean> {
    // Filter predictions for this recipient's province
    const relevantPredictions = recipient.province === 'All' 
      ? predictions 
      : predictions.filter(p => p.province === recipient.province);

    if (relevantPredictions.length === 0) {
      console.log(`⏭️  No relevant predictions for ${recipient.email} in ${recipient.province}`);
      return false;
    }

    const subject = `🚨 ${disease.toUpperCase()} Outbreak Alert - ${recipient.province === 'All' ? 'National Overview' : recipient.province}`;
    const html = this.generateEmailHTML(recipient, disease, relevantPredictions, nationalPrediction);

    // Send email via Resend
    return await this.sendViaResend(recipient.email, subject, html);
  }

  private static async sendViaResend(to: string, subject: string, html: string): Promise<boolean> {
    try {
      const response = await fetch('https://api.resend.com/emails', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${process.env.RESEND_API_KEY}`
        },
        body: JSON.stringify({
          from: process.env.ALERT_FROM_EMAIL || 'alerts@disease-predictions.com',
          to: to,
          subject: subject,
          html: html,
          // Optional: Add text version for email clients that prefer it
          text: this.generateTextVersion(html)
        })
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(`Resend API error: ${errorData.message}`);
      }

      const data = await response.json();
      console.log(`📨 Email queued with ID: ${data.id}`);
      return true;

    } catch (error) {
      console.error('Resend API error:', error);
      
      // Fallback: Log the email that would have been sent
      console.log('📧 Email that would have been sent:');
      console.log('To:', to);
      console.log('Subject:', subject);
      console.log('HTML:', html);
      
      return false;
    }
  }

  private static generateTextVersion(html: string): string {
    // Simple HTML to text conversion
    return html
      .replace(/<[^>]*>/g, '')
      .replace(/\s+/g, ' ')
      .trim();
  }

  private static generateEmailHTML(
    recipient: EmailRecipient,
    disease: string,
    predictions: PredictionResult[],
    nationalPrediction: NationalPrediction
  ): string {
    const currentDate = new Date().toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const currentTime = new Date().toLocaleTimeString('en-US');

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta charset="utf-8">
          <meta name="viewport" content="width=device-width, initial-scale=1.0">
          <title>${disease} Outbreak Alert</title>
          <style>
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 0; 
              padding: 0; 
              background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
              min-height: 100vh;
            }
            .container { 
              max-width: 700px; 
              margin: 0 auto; 
              background: white; 
              border-radius: 15px; 
              overflow: hidden;
              box-shadow: 0 20px 40px rgba(0,0,0,0.1);
            }
            .header { 
              background: linear-gradient(135deg, #dc2626, #ef4444);
              color: white; 
              padding: 30px; 
              text-align: center; 
            }
            .header h1 { 
              margin: 0; 
              font-size: 28px;
              font-weight: 700;
            }
            .header h2 { 
              margin: 10px 0 0 0; 
              font-size: 20px;
              font-weight: 400;
              opacity: 0.9;
            }
            .content { 
              padding: 40px; 
            }
            .alert-badge {
              display: inline-block;
              background: #fef2f2;
              color: #dc2626;
              padding: 8px 16px;
              border-radius: 20px;
              font-size: 14px;
              font-weight: 600;
              margin-bottom: 20px;
              border: 1px solid #fecaca;
            }
            .prediction-card { 
              background: #f8fafc; 
              border: 1px solid #e2e8f0; 
              border-radius: 12px; 
              padding: 20px; 
              margin: 15px 0; 
              transition: all 0.3s ease;
            }
            .prediction-card:hover {
              transform: translateY(-2px);
              box-shadow: 0 8px 25px rgba(0,0,0,0.1);
            }
            .risk-high { 
              border-left: 6px solid #dc2626; 
              background: linear-gradient(135deg, #fef2f2, #fff);
            }
            .risk-medium { 
              border-left: 6px solid #f59e0b; 
              background: linear-gradient(135deg, #fffbeb, #fff);
            }
            .risk-low { 
              border-left: 6px solid #10b981; 
              background: linear-gradient(135deg, #ecfdf5, #fff);
            }
            .national-summary { 
              background: linear-gradient(135deg, #1e40af, #3730a3);
              color: white; 
              padding: 25px; 
              border-radius: 12px; 
              margin: 25px 0; 
            }
            .stats-grid {
              display: grid;
              grid-template-columns: repeat(auto-fit, minmax(150px, 1fr));
              gap: 15px;
              margin: 20px 0;
            }
            .stat-item {
              text-align: center;
              padding: 15px;
              background: rgba(255,255,255,0.1);
              border-radius: 8px;
            }
            .action-section {
              background: #f0f9ff;
              border: 1px solid #bae6fd;
              border-radius: 12px;
              padding: 25px;
              margin: 25px 0;
            }
            .footer {
              text-align: center;
              padding: 20px;
              background: #f8fafc;
              color: #64748b;
              font-size: 12px;
              border-top: 1px solid #e2e8f0;
            }
            .province-badge {
              display: inline-block;
              background: #1e40af;
              color: white;
              padding: 4px 12px;
              border-radius: 15px;
              font-size: 12px;
              font-weight: 600;
              margin: 2px;
            }
            @media (max-width: 600px) {
              .content { padding: 20px; }
              .stats-grid { grid-template-columns: 1fr; }
            }
          </style>
        </head>
        <body>
          <div class="container">
            <div class="header">
              <h1>🚨 DISEASE OUTBREAK ALERT</h1>
              <h2>${disease.toUpperCase()} Prediction System</h2>
            </div>
            
            <div class="content">
              <div class="alert-badge">
                🔔 AUTOMATED ALERT • ${currentDate}
              </div>
              
              <p>Dear <strong>${recipient.name}</strong>,</p>
              
              <p>Our AI-powered disease prediction system has detected potential ${disease} outbreaks in your ${recipient.province === 'All' ? 'region' : 'province'}. Immediate attention and preventive measures are recommended.</p>
              
              ${recipient.province === 'All' ? `
                <div class="national-summary">
                  <h3 style="margin: 0 0 15px 0; font-size: 20px;">🇿🇼 National Overview</h3>
                  <div class="stats-grid">
                    <div class="stat-item">
                      <div style="font-size: 11px; opacity: 0.8;">TOTAL CASES</div>
                      <div style="font-size: 24px; font-weight: 700;">${nationalPrediction.total_predicted_cases.toLocaleString()}</div>
                    </div>
                    <div class="stat-item">
                      <div style="font-size: 11px; opacity: 0.8;">OVERALL RISK</div>
                      <div style="font-size: 24px; font-weight: 700;">${nationalPrediction.average_risk}</div>
                    </div>
                    <div class="stat-item">
                      <div style="font-size: 11px; opacity: 0.8;">HIGH RISK AREAS</div>
                      <div style="font-size: 24px; font-weight: 700;">${nationalPrediction.high_risk_provinces.length}</div>
                    </div>
                    <div class="stat-item">
                      <div style="font-size: 11px; opacity: 0.8;">CONFIDENCE</div>
                      <div style="font-size: 24px; font-weight: 700;">${nationalPrediction.overall_confidence}%</div>
                    </div>
                  </div>
                  
                  ${nationalPrediction.high_risk_provinces.length > 0 ? `
                    <div style="margin-top: 15px;">
                      <strong>High Risk Provinces:</strong><br>
                      ${nationalPrediction.high_risk_provinces.map(province => 
                        `<span class="province-badge">${province}</span>`
                      ).join(' ')}
                    </div>
                  ` : ''}
                </div>
              ` : ''}
              
              <h3 style="color: #1e293b; margin-bottom: 20px;">
                ${recipient.province === 'All' ? '📊 Provincial Predictions' : `📍 ${recipient.province} Prediction`}
              </h3>
              
              ${predictions.map(prediction => `
                <div class="prediction-card risk-${prediction.risk_level.toLowerCase()}">
                  <div style="display: flex; justify-content: between; align-items: start; margin-bottom: 15px;">
                    <h4 style="margin: 0; color: #1e293b; font-size: 18px;">${prediction.province}</h4>
                    <span style="
                      padding: 6px 12px; 
                      border-radius: 20px; 
                      font-size: 12px; 
                      font-weight: 600;
                      ${prediction.risk_level === 'High' ? 'background: #fecaca; color: #dc2626;' : ''}
                      ${prediction.risk_level === 'Medium' ? 'background: #fed7aa; color: #ea580c;' : ''}
                      ${prediction.risk_level === 'Low' ? 'background: #bbf7d0; color: #16a34a;' : ''}
                    ">
                      ${prediction.risk_level} RISK
                    </span>
                  </div>
                  
                  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(120px, 1fr)); gap: 15px; margin-bottom: 15px;">
                    <div>
                      <div style="font-size: 11px; color: #64748b;">PREDICTED CASES</div>
                      <div style="font-size: 24px; font-weight: 700; color: #1e293b;">${prediction.predicted_cases.toLocaleString()}</div>
                    </div>
                    <div>
                      <div style="font-size: 11px; color: #64748b;">CONFIDENCE</div>
                      <div style="font-size: 24px; font-weight: 700; color: #10b981;">${prediction.confidence}%</div>
                    </div>
                    <div>
                      <div style="font-size: 11px; color: #64748b;">GROWTH RATE</div>
                      <div style="font-size: 24px; font-weight: 700; color: #f59e0b;">${prediction.growth_rate}</div>
                    </div>
                  </div>
                  
                  ${prediction.current_cases ? `
                    <div style="font-size: 12px; color: #64748b;">
                      📈 Based on current cases: ${prediction.current_cases.toLocaleString()}
                    </div>
                  ` : ''}
                </div>
              `).join('')}
              
              <div class="action-section">
                <h4 style="margin: 0 0 15px 0; color: #0369a1;">🛡️ RECOMMENDED ACTIONS</h4>
                <ul style="margin: 0; padding-left: 20px; color: #1e293b;">
                  <li>Increase surveillance and testing in high-risk areas</li>
                  <li>Alert healthcare facilities to prepare for potential surge</li>
                  <li>Review stock levels of essential medicines and equipment</li>
                  <li>Coordinate with local health authorities and communities</li>
                  <li>Consider public awareness campaigns if risk level is High</li>
                  <li>Activate emergency response protocols if necessary</li>
                </ul>
              </div>
              
              <div style="background: #f1f5f9; padding: 15px; border-radius: 8px; margin: 20px 0;">
                <p style="margin: 0; font-size: 12px; color: #475569;">
                  <strong>Note:</strong> This alert is generated by our AI prediction system with ${nationalPrediction.overall_confidence}% confidence. 
                  Predictions are based on historical data patterns and current trends. 
                  Please verify with local surveillance data.
                </p>
              </div>
            </div>
            
            <div class="footer">
              <p style="margin: 0;">
                <strong>Disease Prediction & Alert System</strong><br>
                Automated Alert • Generated on ${currentDate} at ${currentTime}<br>
                This is an automated message - please do not reply to this email
              </p>
            </div>
          </div>
        </body>
      </html>
    `;
  }
}