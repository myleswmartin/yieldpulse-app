import { baseAppUrl, toAbsoluteUrl, sendEmail, EmailResult } from "./shared.ts";

export const sendAccountConfirmed = async (params: {
  to: string;
  dashboard_url?: string | null;
  first_name?: string | null;
}): Promise<EmailResult> => {
  const dashboardUrl = toAbsoluteUrl(params.dashboard_url || `${baseAppUrl}/dashboard`);
  return sendEmail({
    to: params.to,
    subject: "Your YieldPulse account is ready",
    layout: {
      title: "Account confirmed",
      greeting: params.first_name ? `Hi ${params.first_name},` : undefined,
      intro: "Your email is verified and your YieldPulse account is ready to use.",
      sections: [
        "You can now save analyses, unlock premium reports, and access your dashboard anytime.",
      ],
      ctaLabel: "Go to Dashboard",
      ctaUrl: dashboardUrl,
      footerNote: "Need help? Reply to this email and we'll assist you.",
    },
  });
};

