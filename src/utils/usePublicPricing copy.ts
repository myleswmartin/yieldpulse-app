import { useEffect, useState } from 'react';
import { fetchPublicSettings, formatPrice } from './publicSettings';

export const usePublicPricing = () => {
  const [price, setPrice] = useState(49);
  const [currency, setCurrency] = useState('AED');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let mounted = true;
    fetchPublicSettings()
      .then((data) => {
        if (!mounted) return;
        setPrice(Number(data.premiumReportPrice ?? 49));
        setCurrency(String(data.currency || 'AED'));
      })
      .catch(() => {
        if (!mounted) return;
        setPrice(49);
        setCurrency('AED');
      })
      .finally(() => {
        if (!mounted) return;
        setLoading(false);
      });

    return () => {
      mounted = false;
    };
  }, []);

  return {
    price,
    currency,
    priceLabel: formatPrice(price, currency),
    loading,
  };
};
