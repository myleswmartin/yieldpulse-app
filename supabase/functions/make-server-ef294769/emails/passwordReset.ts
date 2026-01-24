import { baseAppUrl, toAbsoluteUrl, sendEmail, EmailResult } from "./shared.ts";

export const sendPasswordReset = async (params: {
  to: string;
  reset_url: string;
  first_name?: string | null;
}): Promise<EmailResult> => {
  const resetUrl = toAbsoluteUrl(params.reset_url || `${baseAppUrl}/auth/reset-password`);
  return sendEmail({
    to: params.to,
    subject: "Reset your YieldPulse password",
    layout: {
      title: "Reset password",
      greeting: params.first_name ? `Hi ${params.first_name},` : undefined,
      intro: "We received a request to reset your YieldPulse password.",
      sections: [
        "For security, this link expires in 60 minutes.",
        "If you didn't request this, you can ignore this email.",
      ],
      ctaLabel: "Reset Password",
      ctaUrl: resetUrl,
    },
  });
};

