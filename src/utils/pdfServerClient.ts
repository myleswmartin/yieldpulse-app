import { ReportSnapshot } from './pdfGenerator';
import { mapSnapshotToPremiumReportData, type PropertyOverrides } from './premiumReportAdapter';

const DEFAULT_SERVER = import.meta.env.VITE_PDF_PREMIUM_SERVER_URL || 'http://localhost:3001';

export async function downloadPremiumPdf(
  snapshot: ReportSnapshot,
  purchaseDate?: string,
  fileName?: string,
  overrides?: PropertyOverrides
): Promise<void> {
  const serverUrl = DEFAULT_SERVER.replace(/\/$/, '');
  const reportData = mapSnapshotToPremiumReportData(snapshot, purchaseDate, overrides);

  const response = await fetch(`${serverUrl}/api/generate-pdf`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(reportData),
  });

  if (!response.ok) {
    const message = await response.text();
    throw new Error(message || 'Failed to generate PDF on server');
  }

  const contentType = response.headers.get('content-type') || '';
  if (!contentType.includes('application/pdf')) {
    const message = await response.text();
    throw new Error(message || `Unexpected response type: ${contentType}`);
  }

  const blob = await response.blob();
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download =
    fileName ||
    `YieldPulse_Premium_Report_${new Date().toISOString().split('T')[0].replace(/-/g, '')}.pdf`;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
