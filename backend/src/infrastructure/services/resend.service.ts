import { Resend } from 'resend';
import { env } from '../../config/env.config';
const RESEND_API = env.RESEND_API
const resend = new Resend(RESEND_API);

class ResendService {
  async sendEmail(recipient: string, subject: string, htmlContent: string): Promise<void> {
    try {
      const response = await resend.emails.send({
        from: 'onboarding@resend.dev', 
        to: recipient,
        subject,
        html: htmlContent,
      });

      if (response.error) {
        console.error('❌ Resend error:', response.error);
        throw new Error('Failed to send email.');
      }

      console.log(`✅ Email sent to ${recipient}: ${subject}`);
    } catch (error) {
      console.error('❌ Email sending failed:', error);
      throw new Error('Failed to send email');
    }
  }
}

export const EmailService = new ResendService();