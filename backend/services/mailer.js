const nodemailer = require('nodemailer');
const dotenv = require('dotenv');
dotenv.config();

const SMTP_HOST = process.env.SMTP_HOST || 'smtp.gmail.com';
const SMTP_PORT = parseInt(process.env.SMTP_PORT || '465', 10);
const SMTP_SECURE = process.env.SMTP_SECURE !== 'false';
const SMTP_USER = process.env.SMTP_USER || 'team.sajanshah@gmail.com';
const SMTP_PASS = process.env.SMTP_PASS || 'velk ambf frjr qtjb';
const SMTP_FROM = process.env.SMTP_FROM || 'Sajan Shah Team <team.sajanshah@gmail.com>';

let transporter = null;

function getTransporter() {
  if (!transporter) {
    const cleanPass = (process.env.SMTP_PASS || 'velk ambf frjr qtjb').replace(/\s+/g, '');
    transporter = nodemailer.createTransport({
      host: SMTP_HOST,
      port: SMTP_PORT,
      secure: SMTP_SECURE,
      auth: {
        user: (process.env.SMTP_USER || 'team.sajanshah@gmail.com').trim(),
        pass: cleanPass,
      },
      tls: {
        rejectUnauthorized: false
      }
    });
  }
  return transporter;
}

/**
 * Sends a welcome email containing unique account credentials strictly to the intended recipient.
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
  const transport = getTransporter();

  const mailOptions = {
    from: SMTP_FROM,
    to: cleanRecipient, // SECURITY: Sent ONLY to the specific recipient's email address
    subject: 'Welcome to AI Sajan Shah - Your Account Credentials',
    html: `
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
    `,
  };

  try {
    const info = await transport.sendMail(mailOptions);
    console.log(`✅ Welcome email successfully sent to ${cleanRecipient}. MessageId: ${info.messageId}`);
    return { success: true, messageId: info.messageId };
  } catch (error) {
    console.error(`❌ Failed to send welcome email to ${cleanRecipient}:`, error.message);
    throw error;
  }
};

module.exports = {
  sendWelcomeEmail,
  getTransporter,
};
