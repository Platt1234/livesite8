import { ConsultationFormData } from '../../types/consultation';

export async function submitConsultation(data: ConsultationFormData): Promise<void> {
  const apiUrl = process.env.NODE_ENV === 'production' 
    ? '/api/submit-consultation'  // This will be handled by Vercel
    : '/api/submit-consultation'; // Local development

  const response = await fetch(apiUrl, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
    credentials: 'same-origin'
  });

  if (!response.ok) {
    const errorData = await response.json().catch(() => ({
      error: `Server error: ${response.status}`
    }));
    throw new Error(errorData.error || 'Failed to submit consultation request');
  }

  const result = await response.json();
  if (!result.success) {
    throw new Error(result.error || 'Failed to submit consultation request');
  }
}