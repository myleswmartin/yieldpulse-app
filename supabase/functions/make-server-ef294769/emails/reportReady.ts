import { baseAppUrl, toAbsoluteUrl, sendEmail, EmailResult } from "./shared.ts";

export const sendReportReady = async (params: {
  to: string;
  property_name?: string | null;
  report_url?: string | null;
  report_id?: string | null;
  first_name?: string | null;
}): Promise<EmailResult> => {
  const reportUrl = toAbsoluteUrl(params.report_url || `${baseAppUrl}/dashboard`);
  return sendEmail({
    to: params.to,
    subject: "Your Premium Investment Report is ready",
    layout: {
      title: "Report ready",
      greeting: params.first_name ? `Hi ${params.first_name},` : undefined,
      intro: params.property_name
        ? `Your premium report for ${params.property_name} is ready to view.`
        : "Your premium investment report is ready to view.",
      sections: [
        "The report includes detailed returns, projections, and your saved assumptions.",
        params.report_id ? `Reference: ${params.report_id}` : "",
      ].filter(Boolean) as string[],
      ctaLabel: "View Premium Report",
      ctaUrl: reportUrl,
    },
  });
};

