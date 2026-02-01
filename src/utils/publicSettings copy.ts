import { projectId, publicAnonKey } from '../../utils/supabase/info';

type PublicSettings = {
  premiumReportPrice: number;
  currency: string;
  stripeEnabled?: boolean;
};

let cached: { value: PublicSettings; timestamp: number } | null = null;
const CACHE_MS = 5 * 60 * 1000;

export const fetchPublicSettings = async (): Promise<PublicSettings> => {
  if (cached && Date.now() - cached.timestamp < CACHE_MS) {
    return cached.value;
  }

  const response = await fetch(
    `https://${projectId}.supabase.co/functions/v1/make-server-ef294769/settings/public`,
    {
      headers: {
        'apikey': publicAnonKey,
      },
    }
  );

  if (!response.ok) {
    throw new Error('Failed to fetch public settings');
  }

  const data = await response.json();
  const value: PublicSettings = {
    premiumReportPrice: Number(data.premiumReportPrice ?? 49),
    currency: String(data.currency || 'AED'),
    stripeEnabled: data.stripeEnabled,
  };

  cached = { value, timestamp: Date.now() };
  return value;
};

export const formatPrice = (amount: number, currency: string) => {
  const normalized = String(currency || 'AED').toUpperCase();
  return `${normalized} ${amount}`;
};
