import { baseAppUrl, toAbsoluteUrl, sendEmail, EmailResult } from "./shared.ts";

export const sendPurchaseConfirmation = async (params: {
  to: string;
  property_name?: string | null;
  report_id?: string | null;
  dashboard_url?: string | null;
  support_email?: string | null;
  first_name?: string | null;
}): Promise<EmailResult> => {
  const dashboardUrl = toAbsoluteUrl(params.dashboard_url || `${baseAppUrl}/dashboard`);
  const propertyLine = params.property_name ? `Property: ${params.property_name}` : "Your payment was successful.";
  const referenceLine = params.report_id ? `Reference: ${params.report_id}` : undefined;

  return sendEmail({
    to: params.to,
    subject: "Premium report purchase confirmed",
    layout: {
      title: "Payment confirmed",
      greeting: params.first_name ? `Hi ${params.first_name},` : undefined,
      intro: propertyLine,
      sections: [
        "What happens next: we're preparing your premium investment report.",
        referenceLine || "",
        params.support_email ? `Questions? Contact ${params.support_email}` : "",
      ].filter(Boolean) as string[],
      ctaLabel: "Go to Dashboard",
      ctaUrl: dashboardUrl,
    },
  });
};

