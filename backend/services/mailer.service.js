const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: process.env.EMAIL_SERVICE || 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const MailerService = {
  async sendBriefing(to, content) {
    const mailOptions = {
      from: `"Recovery Sentinel" <${process.env.EMAIL_USER}>`,
      to,
      subject: `[DAILY_BRIEFING] System Stability Report - ${new Date().toLocaleDateString()}`,
      text: content,
      // You can also add HTML here if needed
      html: `
        <div style="font-family: 'Courier New', Courier, monospace; background-color: #050505; color: #00ff00; padding: 20px; border: 1px solid #1a1a1a;">
          <h2 style="color: #00ff00; border-bottom: 1px solid #1a1a1a; padding-bottom: 10px;">TACTICAL_BRIEFING_v1.0</h2>
          <pre style="white-space: pre-wrap; word-wrap: break-word; color: #00ff00;">${content}</pre>
          <hr style="border: 0; border-top: 1px solid #1a1a1a; margin: 20px 0;" />
          <p style="font-size: 0.8rem; color: #444;">SECURE_TRANSMISSION // OPERATIVE: OKUMURAVEN</p>
        </div>
      `,
    };

    try {
      const info = await transporter.sendMail(mailOptions);
      console.log('Email sent: ' + info.response);
      return info;
    } catch (error) {
      console.error('Error sending email:', error);
      throw error;
    }
  },
};

module.exports = MailerService;
