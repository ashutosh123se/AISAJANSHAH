const path = require('path');
const nodemailer = require('nodemailer');
const dotenv = require('dotenv');

// Ensure .env is loaded from both working directory and backend directory
dotenv.config();
dotenv.config({ path: path.resolve(__dirname, '../.env') });
dotenv.config({ path: path.resolve(process.cwd(), 'backend', '.env') });

let ResendClient = null;
try {
  const { Resend } = require('resend');
  ResendClient = Resend;
} catch (e) {
  // Resend will remain null if package is missing
}

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465', 10);
const SMTP_SECURE = process.env.SMTP_SECURE !== 'false';
const SMTP_USER = process.env.SMTP_USER || 'team.sajanshah@gmail.com';
const SMTP_PASS = process.env.SMTP_PASS || 'ufuq zrwr qxwb qeor';
const SMTP_FROM = process.env.SMTP_FROM || 'Sajan Shah Team <team.sajanshah@gmail.com>';

let transporter = null;

function getTransporter() {
  if (!transporter) {
    const cleanPass = (process.env.SMTP_PASS || SMTP_PASS || 'ufuqzrwrqxwbqeor').replace(/\s+/g, '');
    const cleanUser = (process.env.SMTP_USER || 'team.sajanshah@gmail.com').trim();

    // Use Nodemailer's built-in Gmail service preset for maximum reliability
    if (SMTP_HOST.includes('gmail') || cleanUser.endsWith('@gmail.com')) {
      transporter = nodemailer.createTransport({
        service: 'gmail',
        auth: {
          user: cleanUser,
          pass: cleanPass,
        },
      });
    } else {
      transporter = nodemailer.createTransport({
        host: SMTP_HOST,
        port: SMTP_PORT,
        secure: SMTP_SECURE,
        auth: {
          user: cleanUser,
          pass: cleanPass,
        },
        tls: {
          rejectUnauthorized: false
        }
      });
    }
  }
  return transporter;
}

/**
 * Sends a welcome email containing unique account credentials strictly to the intended recipient.
 * Uses Resend API if RESEND_API_KEY is configured, otherwise falls back to SMTP.
 * @param {string} toEmail - Target recipient email address
 * @param {string} name - Student name
 * @param {string} tempPassword - Account login password
 * @returns {Promise<object>}
 */
const sendWelcomeEmail = async (toEmail, name, tempPassword) => {
  if (!toEmail || !toEmail.trim()) {
    throw new Error('Recipient email is required');
  }

  const cleanRecipient = toEmail.trim().toLowerCase();

  const htmlContent = `
    <div style="font-family: Arial, 'Helvetica Neue', Helvetica, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #0F0F1A; color: #FFFFFF; border-radius: 16px; border: 1px solid #2D2D3F;">
      <div style="text-align: center; margin-bottom: 24px;">
        <h1 style="color: #FF6B35; font-size: 26px; font-weight: bold; margin-bottom: 8px;">Welcome to AI Sajan Shah! 🎉</h1>
        <p style="color: #9CA3AF; font-size: 14px; margin: 0;">Your Personal Mentoring & Memory Coaching Platform</p>
      </div>
      
      <p style="font-size: 16px; line-height: 1.6; color: #E5E7EB;">Hi <strong>${name}</strong>,</p>
      <p style="font-size: 15px; line-height: 1.6; color: #D1D5DB;">
        Welcome aboard! Your private account has been successfully created on the AI Sajan Shah platform. You can now log in to access your personalized mentor chat, memory coaching, career trajectory guidance, and brain gym exercises.
      </p>
      
      <div style="background-color: #1E1E2E; border-left: 4px solid #FF6B35; padding: 20px; border-radius: 8px; margin: 28px 0;">
        <h3 style="margin-top: 0; color: #FF6B35; font-size: 18px;">🔒 Your Private Account Credentials</h3>
        <p style="font-size: 14px; margin: 10px 0; color: #E5E7EB;"><strong>Portal URL:</strong> <a href="https://ai01.sajanshah.com" style="color: #60A5FA; text-decoration: underline;">https://ai01.sajanshah.com</a></p>
        <p style="font-size: 14px; margin: 10px 0; color: #E5E7EB;"><strong>Email:</strong> <span style="color: #60A5FA;">${cleanRecipient}</span></p>
        <p style="font-size: 14px; margin: 10px 0; color: #E5E7EB;"><strong>Password:</strong> <code style="background: #111827; padding: 6px 12px; border-radius: 6px; color: #10B981; font-family: monospace; font-size: 15px; border: 1px solid #374151;">${tempPassword}</code></p>
        <p style="font-size: 12px; color: #9CA3AF; margin-top: 14px; margin-bottom: 0; line-height: 1.4;">
          ⚠️ <em>Security Confidentiality Notice: These credentials are encrypted and intended strictly for <strong>${name}</strong> (${cleanRecipient}). Do not share or forward this email to anyone else.</em>
        </p>
      </div>
      
      <div style="text-align: center; margin: 32px 0;">
        <a href="https://ai01.sajanshah.com/login" style="display: inline-block; background-color: #FF6B35; color: #FFFFFF; padding: 14px 28px; text-decoration: none; border-radius: 10px; font-weight: bold; font-size: 16px; box-shadow: 0 4px 14px rgba(255, 107, 53, 0.4);">Log in to Platform (ai01.sajanshah.com)</a>
      </div>
      
      <div style="border-top: 1px solid #2D2D3F; padding-top: 20px; margin-top: 32px; font-size: 13px; color: #9CA3AF; text-align: center;">
        <p style="margin-bottom: 4px;">See you inside! 🔥</p>
        <p style="font-weight: bold; color: #FF6B35; margin: 0;">— Sajan Shah & Team</p>
      </div>
    </div>
  `;

  // 1. Prioritize Resend API (bypasses blocked SMTP ports completely)
  const resendApiKey = process.env.RESEND_API_KEY;
  if (resendApiKey) {
    if (!ResendClient) {
      throw new Error('Resend package is not available. Please ensure "resend" npm package is installed.');
    }
    const resend = new ResendClient(resendApiKey.trim());
    const resendFrom = process.env.RESEND_FROM || 'AI Sajan Shah <onboarding@resend.dev>';

    try {
      const response = await resend.emails.send({
        from: resendFrom,
        to: [cleanRecipient],
        subject: 'Welcome to AI Sajan Shah - Your Account Credentials',
        html: htmlContent,
      });

      if (response.error) {
        throw new Error(response.error.message || JSON.stringify(response.error));
      }

      const messageId = response.data ? response.data.id : 'resend-ok';
      console.log(`✅ Welcome email successfully sent via Resend to ${cleanRecipient}. MessageId: ${messageId}`);
      return { success: true, messageId, provider: 'Resend', from: resendFrom };
    } catch (resendErr) {
      console.error(`❌ Resend delivery failed for ${cleanRecipient}:`, resendErr.message);
      throw resendErr;
    }
  }

  // 2. Fallback to standard SMTP / Nodemailer
  const transport = getTransporter();
  const mailOptions = {
    from: SMTP_FROM,
    to: cleanRecipient,
    subject: 'Welcome to AI Sajan Shah - Your Account Credentials',
    html: htmlContent,
  };

  try {
    const info = await transport.sendMail(mailOptions);
    console.log(`✅ Welcome email successfully sent via SMTP to ${cleanRecipient}. MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId, provider: 'SMTP', from: SMTP_FROM };
  } catch (error) {
    console.error(`❌ Failed to send welcome email via SMTP to ${cleanRecipient}:`, error.message);
    throw error;
  }
};

module.exports = {
  sendWelcomeEmail,
  getTransporter,
};
