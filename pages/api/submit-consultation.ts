import type { NextApiRequest, NextApiResponse } from 'next';
import { sendEmail } from '../../utils/email';
import { validateFormData } from '../../utils/validation';

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  if (req.method === 'OPTIONS') {
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    return res.status(204).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const data = req.body;
    validateFormData(data);
    await sendEmail(data);

    res.status(200).json({ 
      success: true, 
      message: 'Consultation request submitted successfully' 
    });
  } catch (error) {
    console.error('API Error:', error);
    res.status(500).json({ 
      success: false,
      error: error instanceof Error ? error.message : 'Internal server error'
    });
  }
}