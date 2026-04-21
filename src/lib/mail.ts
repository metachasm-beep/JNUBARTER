import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || "smtp.gmail.com",
  port: parseInt(process.env.SMTP_PORT || "587"),
  secure: process.env.SMTP_SECURE === "true",
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

export async function sendOtpEmail(to: string, otp: string) {
  const mailOptions = {
    from: `"JNU Barter Protocol" <${process.env.SMTP_USER}>`,
    to,
    subject: "Deep Verification Challenge: Authority Protocol",
    text: `Your 6-digit verification code is: ${otp}\n\nThis code expires in 15 minutes.`,
    html: `
      <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 40px; border: 1px solid #e7e5e4; border-radius: 40px; background-color: #fafaf9;">
        <h2 style="text-transform: uppercase; font-style: italic; font-weight: 900; letter-spacing: -0.05em; color: #1c1917; font-size: 32px; margin-bottom: 20px;">Identity Challenge</h2>
        <p style="color: #78716c; font-size: 14px; margin-bottom: 30px;">A deep verification request has been initiated for your JNU Barter account. Please enter the following code in your dashboard to authenticate your scholarly authority.</p>
        <div style="background-color: #1c1917; color: white; padding: 30px; text-align: center; border-radius: 24px; font-size: 40px; font-weight: 900; letter-spacing: 0.2em; margin-bottom: 30px;">
          ${otp}
        </div>
        <p style="color: #a8a29e; font-size: 11px; text-transform: uppercase; font-weight: bold; letter-spacing: 0.1em;">Code expires in 15 minutes. If you did not initiate this, please ignore this email.</p>
      </div>
    `,
  };

  if (!process.env.SMTP_USER || !process.env.SMTP_PASS) {
    console.warn("SMTP credentials missing. Logging OTP to console:");
    console.log(`[REAL_MAIL_FALLBACK] To: ${to} | OTP: ${otp}`);
    return;
  }

  return transporter.sendMail(mailOptions);
}
