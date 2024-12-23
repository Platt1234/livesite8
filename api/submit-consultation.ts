import { VercelRequest, VercelResponse } from '@vercel/node';
import nodemailer from 'nodemailer';
import { validateFormData } from '../src/utils/validation/formValidation';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  // Set CORS headers
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  // Handle preflight
  if (req.method === 'OPTIONS') {
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ 
      success: false, 
      error: 'Method not allowed' 
    });
  }

  try {
    const data = req.body;
    
    if (!data) {
      throw new Error('Request body is required');
    }

    // Validate request data
    validateFormData(data);

    // Create email transporter
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: parseInt(process.env.SMTP_PORT || '587'),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
      tls: {
        // Do not fail on invalid certs
        rejectUnauthorized: false
      }
    });

    // Send notification emails
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

    // Send confirmation email to user
    await transporter.sendMail({
      from: process.env.SMTP_FROM,
      to: data.email,
      subject: 'Consultation Request Received - Platteneye Capital',
      html: `
        <h2>Thank you for your consultation request</h2>
        <p>Dear ${data.name},</p>
        <p>We have received your inquiry and our team will get back to you within 24 hours.</p>
        <br>
        <p>Best regards,<br>Platteneye Capital Team</p>
      `
    });

    return res.status(200).json({
      success: true,
      message: 'Consultation request submitted successfully'
    });

  } catch (error) {
    console.error('Server error:', error);
    return res.status(500).json({
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}