import emailjs from '@emailjs/browser';

const EmailAlertService = {
  async sendOutbreakAlert(disease: string, predictions: any[], nationalPrediction: any) {
    try {
      // Initialize EmailJS (get these from your EmailJS dashboard)
      emailjs.init("YOUR_PUBLIC_KEY");
      
      const highRiskProvinces = predictions.filter((p: any) => p.risk_level === 'High');
      
      const templateParams = {
        to_email: 'mveretakudzwa@proton.me',
        disease: disease.toUpperCase(),
        total_cases: nationalPrediction.total_predicted_cases?.toLocaleString(),
        risk_level: nationalPrediction.average_risk,
        high_risk_count: nationalPrediction.high_risk_provinces?.length,
        high_risk_areas: highRiskProvinces.map(p => `${p.province}: ${p.predicted_cases} cases`).join(', '),
        date: new Date().toLocaleString()
      };

      // Send email directly from frontend - NO API ROUTE NEEDED!
      const result = await emailjs.send(
        'YOUR_SERVICE_ID',    // From EmailJS dashboard
        'YOUR_TEMPLATE_ID',   // From EmailJS dashboard  
        templateParams
      );

      console.log('Email sent successfully!', result);
      return { success: true };
      
    } catch (error) {
      console.error('EmailJS error:', error);
      throw error;
    }
  }
};