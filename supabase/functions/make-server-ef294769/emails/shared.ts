import { Resend } from "npm:resend@3";

export const BRAND = {
  primary: "#1e2875",
  accent: "#14b8a6",
  text: "#111827",
  background: "#ffffff",
  border: "#e5e7eb",
  muted: "#6b7280",
};

const resendApiKey = Deno.env.get("RESEND_API_KEY");

const resolveFromAddress = () => {
  const envFrom = (Deno.env.get("RESEND_FROM_EMAIL") || "").trim();
  if (envFrom) {
    // If env contains a name already, use as-is; otherwise wrap with brand name
    if (envFrom.includes("<")) return envFrom;
    return `YieldPulse <${envFrom}>`;
  }
  return "YieldPulse <no-reply@yieldpulse.ae>";
};

const getResend = () => {
  if (!resendApiKey) {
    throw new Error(
      "RESEND_API_KEY is not set. Add it to Supabase Edge Function secrets to enable transactional email sending.",
    );
  }
  return new Resend(resendApiKey);
};

export const baseAppUrl = (() => {
  const envBase =
    Deno.env.get("APP_BASE_URL") ||
    Deno.env.get("PUBLIC_SITE_URL") ||
    Deno.env.get("SITE_URL") ||
    Deno.env.get("NEXT_PUBLIC_SITE_URL");

  if (envBase) return envBase.replace(/\/$/, "");

  const env = (Deno.env.get("ENVIRONMENT") || "production").toLowerCase();
  return env === "development" ? "http://localhost:5173" : "https://www.yieldpulse.ae";
})();

export const toAbsoluteUrl = (url: string | null | undefined): string => {
  if (!url) return baseAppUrl;
  if (/^https?:\/\//i.test(url)) return url;
  const normalized = url.startsWith("/") ? url.slice(1) : url;
  return `${baseAppUrl}/${normalized}`;
};

export interface LayoutProps {
  title: string;
  greeting?: string;
  intro: string;
  sections?: string[];
  ctaLabel?: string;
  ctaUrl?: string;
  secondaryLinkLabel?: string;
  secondaryLinkUrl?: string;
  footerNote?: string;
}

const renderLayout = (props: LayoutProps): string => {
  const {
    title,
    greeting,
    intro,
    sections = [],
    ctaLabel,
    ctaUrl,
    secondaryLinkLabel,
    secondaryLinkUrl,
    footerNote,
  } = props;

  const styleBlock = `
    :root {
      color-scheme: light dark;
      --primary: ${BRAND.primary};
      --accent: ${BRAND.accent};
      --text: ${BRAND.text};
      --bg: #f3f4f6;
      --card: ${BRAND.background};
      --border: ${BRAND.border};
      --muted: ${BRAND.muted};
      --cta-text: #0b1220;
    }
    @media (prefers-color-scheme: dark) {
      :root {
        --text: #e5e7eb;
        --bg: #0b1220;
        --card: #111827;
        --border: #1f2937;
        --muted: #9ca3af;
        --cta-text: #0b1220;
      }
    }
    body {
      margin: 0;
      padding: 24px;
      background: var(--bg) !important;
      font-family: -apple-system,BlinkMacSystemFont,'Segoe UI',sans-serif;
      color: var(--text);
    }
    .email-shell {
      border-collapse: collapse;
      width: 100%;
    }
    .email-card {
      max-width: 600px;
      background: var(--card) !important;
      border: 1px solid var(--border) !important;
      border-radius: 14px;
      padding: 30px 28px;
      text-align: left;
    }
    .email-title {
      margin: 0 0 12px 0;
      color: var(--primary);
      font-weight: 700;
      font-size: 18px;
    }
    .email-text {
      margin: 0 0 14px 0;
      line-height: 1.6;
      font-size: 15px;
      color: var(--text);
    }
    .email-muted {
      color: var(--muted);
      font-size: 13px;
      line-height: 1.5;
    }
    .email-cta {
      display: inline-block;
      padding: 12px 18px;
      border-radius: 10px;
      background: var(--accent);
      color: var(--cta-text);
      font-weight: 600;
      font-size: 15px;
      text-decoration: none;
    }
  `;

  const sectionHtml = sections
    .map((paragraph) => `<p class="email-text">${paragraph}</p>`)
    .join("");

  const ctaHtml = ctaLabel && ctaUrl
    ? `<div style="margin:22px 0;"><a class="email-cta" href="${ctaUrl}">${ctaLabel}</a></div>
       <p class="email-muted" style="margin:0 0 10px 0;">If the button doesn't work, copy and paste this link: <span style="word-break:break-all; color:var(--primary);">${ctaUrl}</span></p>`
    : "";

  const secondaryHtml = secondaryLinkLabel && secondaryLinkUrl
    ? `<p class="email-muted" style="margin:0;">${secondaryLinkLabel}: <span style="word-break:break-all; color:var(--primary);">${secondaryLinkUrl}</span></p>`
    : "";

  const footer = footerNote
    ? `<p class="email-muted" style="margin:18px 0 0 0;">${footerNote}</p>`
    : "";

  return `<!DOCTYPE html>
  <html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <style>${styleBlock}</style>
  </head>
  <body>
    <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="email-shell">
      <tr>
        <td align="center">
          <table role="presentation" width="100%" cellspacing="0" cellpadding="0" class="email-card">
            <tr>
              <td style="padding:0;">
                <p class="email-title">${title}</p>
                ${greeting ? `<p class="email-text" style="margin-bottom:10px;">${greeting}</p>` : ""}
                <p class="email-text">${intro}</p>
                ${sectionHtml}
                ${ctaHtml}
                ${secondaryHtml}
                ${footer}
              </td>
            </tr>
          </table>
          <p class="email-muted" style="margin:14px 0 0 0; font-size:12px;">YieldPulse • Dubai, UAE</p>
        </td>
      </tr>
    </table>
  </body>
  </html>`;
};

const toPlainText = (props: LayoutProps): string => {
  const lines: string[] = [];
  lines.push(props.title);
  if (props.greeting) lines.push(props.greeting);
  lines.push(props.intro);
  props.sections?.forEach((s) => lines.push(s));
  if (props.ctaLabel && props.ctaUrl) lines.push(`${props.ctaLabel}: ${props.ctaUrl}`);
  if (props.secondaryLinkLabel && props.secondaryLinkUrl) {
    lines.push(`${props.secondaryLinkLabel}: ${props.secondaryLinkUrl}`);
  }
  if (props.footerNote) lines.push(props.footerNote);
  return lines.join("\n\n");
};

export interface EmailResult {
  success: boolean;
  id?: string;
  error?: string;
}

export const sendEmail = async (payload: {
  to: string;
  subject: string;
  layout: LayoutProps;
  from?: string;
}): Promise<EmailResult> => {
  const resend = getResend();
  try {
    const response = await resend.emails.send({
      from: payload.from || resolveFromAddress(),
      to: payload.to,
      subject: payload.subject,
      html: renderLayout(payload.layout),
      text: toPlainText(payload.layout),
      tags: [{ name: "source", value: "edge-function" }],
    });

    return { success: true, id: response.data?.id };
  } catch (err: any) {
    console.error("Email send failed", payload.subject, err?.message || err);
    return { success: false, error: err?.message || "Failed to send email" };
  }
};
