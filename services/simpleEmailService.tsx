// services/simpleEmailService.ts
export class SimpleEmailService {
  static async sendOutbreakAlert(
    disease: string,
    predictions: any[],
    nationalPrediction: any,
    recipients: any[]
  ): Promise<{ success: boolean; sentTo: string[]; errors: string[] }> {
    const results = {
      success: false,
      sentTo: [] as string[],
      errors: [] as string[]
    };

    for (const recipient of recipients) {
      try {
        const relevantPredictions = recipient.province === 'All' 
          ? predictions 
          : predictions.filter(p => p.province === recipient.province);

        if (relevantPredictions.length === 0) continue;

        const subject = `🚨 ${disease.toUpperCase()} Outbreak Alert - ${recipient.province === 'All' ? 'National Overview' : recipient.province}`;
        const html = this.generateSimpleEmail(recipient, disease, relevantPredictions, nationalPrediction);

        const sent = await this.sendViaAPI(recipient.email, subject, html);
        if (sent) {
          results.sentTo.push(recipient.email);
        }
      } catch (error) {
        results.errors.push(`Failed to send to ${recipient.email}: ${error}`);
      }
    }

    results.success = results.sentTo.length > 0;
    return results;
  }

  private static async sendViaAPI(to: string, subject: string, html: string): Promise<boolean> {
    try {
      const response = await fetch('/api/send-alert', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          to,
          subject,
          html,
        }),
      });

      const result = await response.json();
      return result.success;
    } catch (error) {
      console.error('API email error:', error);
      return false;
    }
  }

  private static generateSimpleEmail(recipient: any, disease: string, predictions: any[], nationalPrediction: any): string {
    return `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #dc2626; color: white; padding: 20px; text-align: center;">
          <h1>🚨 DISEASE OUTBREAK ALERT</h1>
          <h2>${disease.toUpperCase()} Prediction System</h2>
        </div>
        
        <div style="padding: 20px;">
          <p>Dear <strong>${recipient.name}</strong>,</p>
          
          <p>Our system has detected potential ${disease} outbreaks.</p>
          
          ${recipient.province === 'All' ? `
            <div style="background: #1e40af; color: white; padding: 15px; border-radius: 8px; margin: 15px 0;">
              <h3>🇿🇼 National Overview</h3>
              <p><strong>Total Predicted Cases:</strong> ${nationalPrediction.total_predicted_cases.toLocaleString()}</p>
              <p><strong>Overall Risk:</strong> ${nationalPrediction.average_risk}</p>
            </div>
          ` : ''}
          
          <h3>${recipient.province === 'All' ? 'Provincial Predictions' : recipient.province + ' Prediction'}</h3>
          
          ${predictions.map(prediction => `
            <div style="background: #f8fafc; border-left: 4px solid ${
              prediction.risk_level === 'High' ? '#dc2626' : 
              prediction.risk_level === 'Medium' ? '#f59e0b' : '#10b981'
            }; padding: 15px; margin: 10px 0; border-radius: 4px;">
              <h4 style="margin: 0 0 10px 0;">${prediction.province}</h4>
              <p style="margin: 5px 0;"><strong>Predicted Cases:</strong> ${prediction.predicted_cases.toLocaleString()}</p>
              <p style="margin: 5px 0;"><strong>Risk Level:</strong> ${prediction.risk_level}</p>
              <p style="margin: 5px 0;"><strong>Confidence:</strong> ${prediction.confidence}%</p>
            </div>
          `).join('')}
          
          <div style="background: #fef2f2; padding: 15px; border-radius: 8px; margin: 20px 0;">
            <h4>🛡️ Recommended Actions:</h4>
            <ul>
              <li>Increase surveillance in high-risk areas</li>
              <li>Alert healthcare facilities</li>
              <li>Review medical stock levels</li>
            </ul>
          </div>
        </div>
      </div>
    `;
  }
}