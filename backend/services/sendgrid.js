const sgMail = require('@sendgrid/mail');
const dotenv = require('dotenv');
dotenv.config();

sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const FROM_EMAIL = process.env.SENDGRID_FROM_EMAIL || 'noreply@ai.sajanshah.com';

const isSendGridConfigured = () => {
  const key = process.env.SENDGRID_API_KEY || '';
  return key.startsWith('SG.');
};

const sendWelcomeEmail = async (toEmail, name, tempPassword) => {
  if (!isSendGridConfigured()) {
    const err = new Error('SendGrid is not configured — email not delivered');
    err.code = 'not_delivered';
    throw err;
  }

  const msg = {
    to: toEmail,
    from: FROM_EMAIL,
    subject: 'Welcome to AI Sajan Shah - Your Personal Mentor',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; color: #1A1A2E;">
        <h1 style="color: #FF6B35;">Welcome to AI Sajan Shah! 🎉</h1>
        <p>Hi ${name},</p>
        <p>Arre yaar, bohot khushi hui ki tum yahan ho!</p>
        <p>I am your 24/7 personal mentor, ready to guide you on your transformation journey.</p>
        
        <div style="background-color: #F8F9FA; border-left: 4px solid #FF6B35; padding: 16px; margin: 24px 0;">
          <h3 style="margin-top: 0;">Your Login Credentials</h3>
          <p><strong>Email:</strong> ${toEmail}</p>
          <p><strong>Password:</strong> ${tempPassword}</p>
          <p style="font-size: 12px; color: #6B7280;">(Please login and change your password)</p>
        </div>
        
        <a href="https://ai.sajanshah.com/login" style="display: inline-block; background-color: #FF6B35; color: white; padding: 12px 24px; text-decoration: none; border-radius: 8px; font-weight: bold;">Log in to Platform</a>
        
        <p style="margin-top: 32px;">See you inside!<br>- Sajan Shah</p>
      </div>
    `,
  };

  try {
    const response = await sgMail.send(msg);
    return response;
  } catch (error) {
    console.error('SendGrid Error:', error);
    if (error.response) {
      console.error(error.response.body);
    }
    throw error;
  }
};

module.exports = {
  sendWelcomeEmail
};
