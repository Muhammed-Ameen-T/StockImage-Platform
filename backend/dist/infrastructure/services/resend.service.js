"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EmailService = void 0;
const resend_1 = require("resend");
const env_config_1 = require("../../config/env.config");
const RESEND_API = env_config_1.env.RESEND_API;
const resend = new resend_1.Resend(RESEND_API);
class ResendService {
    async sendEmail(recipient, subject, htmlContent) {
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
        }
        catch (error) {
            console.error('❌ Email sending failed:', error);
            throw new Error('Failed to send email');
        }
    }
}
exports.EmailService = new ResendService();
