import nodemailer from 'nodemailer';

interface EmailConfig {
  host: string;
  port: number;
  secure: boolean;
  auth: {
    user: string;
    pass: string;
  };
}

const createTransporter = () => {
  const config: EmailConfig = {
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false, // true for 465, false for other ports
    auth: {
      user: process.env.SMTP_USER || 'mohammedtousif3709@gmail.com',
      pass: process.env.SMTP_PASS || '',
    },
  };

  return nodemailer.createTransporter(config);
};

export interface ContactEmailData {
  name: string;
  email: string;
  subject: string;
  message: string;
}

export const sendContactEmail = async (data: ContactEmailData): Promise<void> => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Portfolio Contact" <${process.env.SMTP_USER}>`,
      to: 'mohammedtousif3709@gmail.com',
      subject: `Portfolio Contact: ${data.subject}`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">New Contact Form Submission</h2>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #334155;">Contact Details</h3>
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> ${data.email}</p>
            <p><strong>Subject:</strong> ${data.subject}</p>
          </div>
          
          <div style="background: #ffffff; padding: 20px; border-left: 4px solid #2563eb; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #334155;">Message</h3>
            <p style="line-height: 1.6; color: #475569;">${data.message.replace(/\n/g, '<br>')}</p>
          </div>
          
          <div style="margin-top: 30px; padding: 15px; background: #f1f5f9; border-radius: 6px;">
            <p style="margin: 0; font-size: 14px; color: #64748b;">
              This email was sent from your portfolio contact form.
            </p>
          </div>
        </div>
      `,
      text: `
New Contact Form Submission

Name: ${data.name}
Email: ${data.email}
Subject: ${data.subject}

Message:
${data.message}
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Email sending failed:', error);
    throw new Error('Failed to send email. Please check your SMTP configuration.');
  }
};

export const sendAutoReply = async (data: ContactEmailData): Promise<void> => {
  try {
    const transporter = createTransporter();

    const mailOptions = {
      from: `"Mohammed Tousif" <${process.env.SMTP_USER}>`,
      to: data.email,
      subject: `Thank you for contacting me, ${data.name}!`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
          <h2 style="color: #2563eb;">Thank You for Your Message!</h2>
          
          <p>Hi ${data.name},</p>
          
          <p>Thank you for reaching out through my portfolio. I've received your message about "${data.subject}" and will get back to you as soon as possible.</p>
          
          <p>I typically respond within 24-48 hours. If your inquiry is urgent, please feel free to reach out directly at mohammedtousif3709@gmail.com.</p>
          
          <div style="background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0;">
            <h3 style="margin-top: 0; color: #334155;">Your Message Summary</h3>
            <p><strong>Subject:</strong> ${data.subject}</p>
            <p><strong>Message:</strong> ${data.message.substring(0, 200)}${data.message.length > 200 ? '...' : ''}</p>
          </div>
          
          <p>Best regards,<br>Mohammed Tousif<br>Full Stack Developer</p>
          
          <div style="margin-top: 30px; padding: 15px; background: #f1f5f9; border-radius: 6px;">
            <p style="margin: 0; font-size: 14px; color: #64748b;">
              This is an automated response. Please do not reply to this email.
            </p>
          </div>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);
  } catch (error) {
    console.error('Auto-reply sending failed:', error);
    // Don't throw error for auto-reply failures
  }
};
