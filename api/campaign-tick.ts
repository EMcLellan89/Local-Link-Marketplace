/**
 * Vercel Cron Handler for Daily Campaign Tick
 *
 * This handler is called by Vercel cron job daily at 6 AM UTC.
 * It forwards the request to the Supabase edge function that processes campaigns.
 */

import type { VercelRequest, VercelResponse } from '@vercel/node';

export default async function handler(
  req: VercelRequest,
  res: VercelResponse
) {
  // Verify this is a cron job request
  const authHeader = req.headers.authorization;
  const expectedToken = `Bearer ${process.env.CRON_SECRET}`;

  if (authHeader !== expectedToken) {
    return res.status(401).json({ error: 'Unauthorized' });
  }

  try {
    const supabaseUrl = process.env.VITE_SUPABASE_URL;
    const cronSecret = process.env.CRON_SECRET;

    if (!supabaseUrl || !cronSecret) {
      throw new Error('Missing environment variables');
    }

    // Call the Supabase edge function
    const response = await fetch(
      `${supabaseUrl}/functions/v1/campaign-tick`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Cron-Secret': cronSecret,
        },
        body: JSON.stringify({}),
      }
    );

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.error || 'Campaign tick failed');
    }

    return res.status(200).json({
      success: true,
      ...result,
      timestamp: new Date().toISOString(),
    });
  } catch (error: any) {
    console.error('[campaign-tick] Error:', error);
    return res.status(500).json({
      error: error.message || 'Internal server error',
    });
  }
}
