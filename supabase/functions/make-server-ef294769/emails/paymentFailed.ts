import { baseAppUrl, toAbsoluteUrl, sendEmail, EmailResult } from "./shared.ts";

export const sendPaymentFailed = async (params: {
  to: string;
  retry_url?: string | null;
  first_name?: string | null;
}): Promise<EmailResult> => {
  const retryUrl = toAbsoluteUrl(params.retry_url || `${baseAppUrl}/dashboard`);
  return sendEmail({
    to: params.to,
    subject: "Payment failed - action required",
    layout: {
      title: "Payment did not go through",
      greeting: params.first_name ? `Hi ${params.first_name},` : undefined,
      intro: "We weren't able to complete your payment.",
      sections: [
        "No charges were made. You can try again anytime.",
        "If the issue persists, please use another card or contact support.",
      ],
      ctaLabel: "Retry Payment",
      ctaUrl: retryUrl,
    },
  });
};

