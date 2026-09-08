const mailer = require('./mailer');

/**
 * Delegated welcome email sender using configured Nodemailer / SMTP service.
 */
const sendWelcomeEmail = async (toEmail, name, tempPassword) => {
  return await mailer.sendWelcomeEmail(toEmail, name, tempPassword);
};

module.exports = {
  sendWelcomeEmail,
};
