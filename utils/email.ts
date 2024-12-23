import nodemailer from 'nodemailer';
import { ConsultationFormData } from '../types/consultation';

export async function sendEmail(data: ConsultationFormData) {
  const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: parseInt(process.env.SMTP_PORT || '587'),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS,
    }
  });

  await transporter.sendMail({
    from: process.env.SMTP_FROM,
    to: ['joseph@platteneye.co.uk', 'daniel@platteneye.co.uk'],
    subject: `New Consultation Request from ${data.name}`,
    html: `
      <h2>New Consultation Request</h2>
      <p><strong>Name:</strong> ${data.name}</p>
      <p><strong>Email:</strong> ${data.email}</p>
      <p><strong>Type:</strong> ${data.type === 'other' ? data.otherType : data.type}</p>
      <p><strong>Query:</strong></p>
      <p>${data.query.replace(/\n/g, '<br>')}</p>
    `
  });
}