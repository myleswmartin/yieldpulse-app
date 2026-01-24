import { baseAppUrl, toAbsoluteUrl, sendEmail, EmailResult } from "./shared.ts";

export const sendEmailVerification = async (params: {
  to: string;
  verification_url: string;
  first_name?: string | null;
}): Promise<EmailResult> => {
  const verificationUrl = toAbsoluteUrl(params.verification_url || `${baseAppUrl}/auth/verify-email`);
  return sendEmail({
    to: params.to,
    subject: "Verify your email address",
    layout: {
      title: "Verify your email",
      greeting: params.first_name ? `Hi ${params.first_name},` : undefined,
      intro: "Thanks for creating a YieldPulse account. Please confirm your email to secure your profile and save your analyses.",
      sections: [
        "Verification helps us protect your data and lets you access your dashboard, saved reports, and premium downloads.",
      ],
      ctaLabel: "Verify Email",
      ctaUrl: verificationUrl,
      footerNote: "If you didn't create this account, you can safely ignore this message.",
    },
  });
};

