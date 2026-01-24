import { sendEmail, EmailResult } from "./shared.ts";

export const sendSupportConfirmation = async (params: {
  to: string;
  full_name?: string | null;
  reference?: string | null;
  expected_reply_hours?: number;
}): Promise<EmailResult> => {
  const expectedHours = params.expected_reply_hours ?? 24;
  return sendEmail({
    to: params.to,
    subject: "We've received your message",
    from: "YieldPulse Support <support@yieldpulse.ae>",
    layout: {
      title: "Support request received",
      greeting: params.full_name ? `Hi ${params.full_name},` : undefined,
      intro: "Thanks for contacting YieldPulse. Our team has your message and will respond soon.",
      sections: [
        `Expected response time: within ${expectedHours} hours.`,
        params.reference ? `Reference: ${params.reference}` : "",
      ].filter(Boolean) as string[],
      footerNote: "If you need to add more details, reply to this email and we'll attach it to your ticket.",
    },
  });
};

