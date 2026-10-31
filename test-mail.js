const mailer = require('./backend/services/mailer');

// Replace with your personal email address to verify receipt
const targetEmail = process.argv[2] || process.env.SMTP_USER || 'team.sajanshah@gmail.com';

console.log(`Sending test email to: ${targetEmail}...`);

mailer.sendWelcomeEmail(targetEmail, 'Sajan Shah Test User', 'Pass@12345')
  .then((res) => {
    console.log('✅ Email sent successfully!');
    console.log('Details:', res);
  })
  .catch((err) => {
    console.error('❌ Email sending failed:');
    console.error(err.message);
  });
