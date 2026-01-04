import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency, formatPercent } from './calculations';

export interface ReportSnapshot {
  inputs: {
    portal_source?: string;
    listing_url?: string;
    purchase_price: number;
    expected_monthly_rent: number;
    down_payment_percent: number;
    mortgage_interest_rate: number;
    loan_term_years: number;
    service_charge_per_year: number;
    maintenance_per_year: number;
    property_management_fee: number;
    vacancy_rate?: number;
    rent_growth_rate: number;
    capital_growth_rate: number;
    holding_period_years: number;
    area_sqft?: number;
  };
  results: {
    grossYield: number;
    netYield: number;
    cashOnCashReturn: number;
    monthlyCashFlow: number;
    annualCashFlow: number;
    monthlyMortgagePayment: number;
    totalOperatingCosts: number;
    monthlyIncome: number;
    annualIncome: number;
  };
}

// Helper function to add header with metadata to each page
function addPageHeader(
  doc: jsPDF, 
  pageNumber: number, 
  totalPages: number, 
  snapshotTimestamp: string,
  isFirstPage: boolean = false
): void {
  if (isFirstPage) return; // Skip header on cover page

  const pageWidth = doc.internal.pageSize.getWidth();
  
  doc.setFontSize(7);
  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'normal');
  
  // Left: YieldPulse
  doc.text('YieldPulse', 15, 10);
  
  // Center: Metadata
  const metadataText = `Report v1.0 | Generated from immutable data snapshot | ${snapshotTimestamp}`;
  doc.text(metadataText, pageWidth / 2, 10, { align: 'center' });
  
  // Right: Page number
  doc.text(`Page ${pageNumber} of ${totalPages}`, pageWidth - 15, 10, { align: 'right' });
  
  // Divider line
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.line(15, 13, pageWidth - 15, 13);
}

// Helper function to add footer to each page
function addPageFooter(doc: jsPDF, isFirstPage: boolean = false): void {
  if (isFirstPage) return; // Skip footer on cover page

  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const footerY = pageHeight - 15;
  
  // Divider line
  doc.setDrawColor(220, 220, 220);
  doc.setLineWidth(0.5);
  doc.line(15, footerY - 8, pageWidth - 15, footerY - 8);
  
  doc.setFontSize(7);
  doc.setTextColor(100, 100, 100);
  doc.setFont('helvetica', 'italic');
  
  const disclaimerLine1 = 'This report is for informational purposes only and does not constitute financial or investment advice.';
  const disclaimerLine2 = 'Please consult with qualified professionals before making investment decisions.';
  
  doc.text(disclaimerLine1, pageWidth / 2, footerY - 4, { align: 'center' });
  doc.text(disclaimerLine2, pageWidth / 2, footerY, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(6);
  doc.text('YieldPulse powered by Constructive', pageWidth / 2, footerY + 4, { align: 'center' });
}

export async function generatePDF(snapshot: ReportSnapshot, purchaseDate: string): Promise<void> {
  // Create PDF document
  const doc = new jsPDF('p', 'mm', 'a4');
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();

  // Define colors (matching design system)
  const primaryColor: [number, number, number] = [30, 40, 117]; // Deep navy
  const tealColor: [number, number, number] = [20, 184, 166]; // Teal accent
  const textColor: [number, number, number] = [51, 51, 51]; // Dark gray

  // Snapshot timestamp for integrity stamping
  const snapshotTimestamp = new Date(purchaseDate).toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  });

  const reportGenerationDate = new Date().toLocaleDateString('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  // ==================== COVER PAGE ====================
  
  // Gradient background (subtle)
  doc.setFillColor(...primaryColor);
  doc.rect(0, 0, pageWidth, pageHeight / 3, 'F');

  // Logo area (text-based with icon representation)
  doc.setTextColor(255, 255, 255);
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.text('YieldPulse', pageWidth / 2, 50, { align: 'center' });

  // Decorative line under logo
  doc.setDrawColor(...tealColor);
  doc.setLineWidth(1);
  doc.line(pageWidth / 2 - 30, 55, pageWidth / 2 + 30, 55);

  // Title section
  doc.setTextColor(...textColor);
  doc.setFontSize(28);
  doc.setFont('helvetica', 'bold');
  doc.text('Property Investment Report', pageWidth / 2, 100, { align: 'center' });

  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('Yield and cash flow analysis in AED', pageWidth / 2, 110, { align: 'center' });

  // Property name if available
  if (snapshot.inputs.portal_source) {
    doc.setFontSize(11);
    doc.setFont('helvetica', 'italic');
    doc.setTextColor(80, 80, 80);
    doc.text(snapshot.inputs.portal_source, pageWidth / 2, 120, { align: 'center' });
  }

  // Report metadata box
  const boxY = 140;
  const boxHeight = 40;
  doc.setFillColor(245, 247, 250);
  doc.roundedRect(30, boxY, pageWidth - 60, boxHeight, 3, 3, 'F');

  doc.setFontSize(9);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(...textColor);
  
  let metaY = boxY + 10;
  doc.text('Report Date:', 40, metaY);
  doc.setFont('helvetica', 'bold');
  doc.text(reportGenerationDate, 120, metaY);
  
  metaY += 8;
  doc.setFont('helvetica', 'normal');
  doc.text('Snapshot Date:', 40, metaY);
  doc.setFont('helvetica', 'bold');
  doc.text(snapshotTimestamp, 120, metaY);
  
  metaY += 8;
  doc.setFont('helvetica', 'normal');
  doc.text('Report Version:', 40, metaY);
  doc.setFont('helvetica', 'bold');
  doc.text('v1.0', 120, metaY);

  // Brand line
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text('YieldPulse powered by Constructive', pageWidth / 2, 200, { align: 'center' });

  // Cover page disclaimer
  const coverDisclaimerY = pageHeight - 40;
  doc.setFontSize(7);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(120, 120, 120);
  
  const lines = [
    'CONFIDENTIAL',
    '',
    'This report contains confidential information for the intended recipient only.',
    'Generated from immutable data snapshot for audit integrity.',
    '',
    'For informational purposes only. Not financial advice.'
  ];
  
  let lineY = coverDisclaimerY;
  lines.forEach((line, index) => {
    if (index === 0) {
      doc.setFont('helvetica', 'bold');
    } else {
      doc.setFont('helvetica', 'italic');
    }
    doc.text(line, pageWidth / 2, lineY, { align: 'center' });
    lineY += 4;
  });

  // ==================== PAGE 2: EXECUTIVE SUMMARY ====================
  doc.addPage();
  
  addPageHeader(doc, 2, 3, snapshotTimestamp);
  
  let yPosition = 25;

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('Executive Summary', 15, yPosition);
  
  // Decorative line
  doc.setDrawColor(...tealColor);
  doc.setLineWidth(0.8);
  doc.line(15, yPosition + 2, 60, yPosition + 2);
  
  yPosition += 12;

  // Summary metrics in a 2x3 grid
  const metrics = [
    { label: 'Gross Yield', value: formatPercent(snapshot.results.grossYield) },
    { label: 'Net Yield', value: formatPercent(snapshot.results.netYield) },
    { label: 'Cash on Cash Return', value: formatPercent(snapshot.results.cashOnCashReturn) },
    { label: 'Monthly Cash Flow', value: formatCurrency(snapshot.results.monthlyCashFlow) },
    { label: 'Annual Cash Flow', value: formatCurrency(snapshot.results.annualCashFlow) },
  ];

  const colWidth = (pageWidth - 30) / 2;
  const rowHeight = 20;
  let col = 0;

  metrics.forEach((metric) => {
    const xPos = 15 + (col * colWidth);
    
    // Background box
    doc.setFillColor(245, 247, 250);
    doc.roundedRect(xPos, yPosition, colWidth - 5, rowHeight, 2, 2, 'F');
    
    // Label
    doc.setTextColor(100, 100, 100);
    doc.setFontSize(9);
    doc.setFont('helvetica', 'normal');
    doc.text(metric.label, xPos + 4, yPosition + 7);
    
    // Value
    doc.setTextColor(...textColor);
    doc.setFontSize(14);
    doc.setFont('helvetica', 'bold');
    doc.text(metric.value, xPos + 4, yPosition + 16);
    
    col++;
    if (col === 2) {
      col = 0;
      yPosition += rowHeight + 4;
    }
  });

  if (col !== 0) {
    yPosition += rowHeight + 4;
  }
  yPosition += 10;

  // ==================== PROPERTY DETAILS ====================
  if (snapshot.inputs.portal_source || snapshot.inputs.area_sqft) {
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(...primaryColor);
    doc.text('Property Details', 15, yPosition);
    
    doc.setDrawColor(...tealColor);
    doc.setLineWidth(0.8);
    doc.line(15, yPosition + 2, 52, yPosition + 2);
    
    yPosition += 10;

    doc.setFont('helvetica', 'normal');
    doc.setFontSize(10);
    doc.setTextColor(...textColor);
    
    if (snapshot.inputs.portal_source) {
      doc.text('Property Source:', 15, yPosition);
      doc.setFont('helvetica', 'bold');
      doc.text(snapshot.inputs.portal_source, 60, yPosition);
      yPosition += 7;
    }
    
    if (snapshot.inputs.area_sqft) {
      doc.setFont('helvetica', 'normal');
      doc.text('Area:', 15, yPosition);
      doc.setFont('helvetica', 'bold');
      doc.text(`${snapshot.inputs.area_sqft.toLocaleString()} sqft`, 60, yPosition);
      yPosition += 7;
    }
    
    yPosition += 8;
  }

  // ==================== KEY ASSUMPTIONS ====================
  doc.setFontSize(12);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('Key Assumptions', 15, yPosition);
  
  doc.setDrawColor(...tealColor);
  doc.setLineWidth(0.8);
  doc.line(15, yPosition + 2, 52, yPosition + 2);
  
  yPosition += 10;

  autoTable(doc, {
    startY: yPosition,
    head: [['Assumption', 'Value']],
    body: [
      ['Purchase Price', formatCurrency(snapshot.inputs.purchase_price)],
      ['Expected Monthly Rent', formatCurrency(snapshot.inputs.expected_monthly_rent)],
      ['Down Payment', `${snapshot.inputs.down_payment_percent}%`],
      ['Mortgage Interest Rate', `${snapshot.inputs.mortgage_interest_rate}%`],
      ['Loan Term', `${snapshot.inputs.loan_term_years} years`],
      ['Service Charge (Annual)', formatCurrency(snapshot.inputs.service_charge_per_year)],
      ['Maintenance (Annual)', formatCurrency(snapshot.inputs.maintenance_per_year)],
      ['Property Management Fee', `${snapshot.inputs.property_management_fee}%`],
      ['Vacancy Allowance', snapshot.inputs.vacancy_rate ? `${snapshot.inputs.vacancy_rate}%` : '0%'],
      ['Rent Growth Rate', `${snapshot.inputs.rent_growth_rate}%`],
      ['Capital Growth Rate', `${snapshot.inputs.capital_growth_rate}%`],
      ['Holding Period', `${snapshot.inputs.holding_period_years} years`],
    ],
    theme: 'striped',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'left',
    },
    bodyStyles: {
      textColor: textColor,
      fontSize: 9,
      cellPadding: 4,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 15, right: 15 },
    styles: {
      lineColor: [220, 220, 220],
      lineWidth: 0.1,
    },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  addPageFooter(doc);

  // ==================== PAGE 3: FINANCIAL SUMMARY ====================
  doc.addPage();
  
  addPageHeader(doc, 3, 3, snapshotTimestamp);
  
  yPosition = 25;

  doc.setFontSize(16);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...primaryColor);
  doc.text('Financial Summary', 15, yPosition);
  
  doc.setDrawColor(...tealColor);
  doc.setLineWidth(0.8);
  doc.line(15, yPosition + 2, 60, yPosition + 2);
  
  yPosition += 12;

  const monthlyIncome = snapshot.results.monthlyIncome || snapshot.inputs.expected_monthly_rent;
  const annualIncome = snapshot.results.annualIncome || (monthlyIncome * 12);

  autoTable(doc, {
    startY: yPosition,
    head: [['Category', 'Monthly Amount', 'Annual Amount']],
    body: [
      ['Rental Income', formatCurrency(monthlyIncome), formatCurrency(annualIncome)],
      ['Mortgage Payment', formatCurrency(snapshot.results.monthlyMortgagePayment), formatCurrency(snapshot.results.monthlyMortgagePayment * 12)],
      ['Operating Costs', formatCurrency(snapshot.results.totalOperatingCosts / 12), formatCurrency(snapshot.results.totalOperatingCosts)],
      ['', '', ''],
      ['Net Cash Flow', formatCurrency(snapshot.results.monthlyCashFlow), formatCurrency(snapshot.results.annualCashFlow)],
    ],
    theme: 'striped',
    headStyles: {
      fillColor: primaryColor,
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold',
      halign: 'left',
    },
    bodyStyles: {
      textColor: textColor,
      fontSize: 10,
      cellPadding: 4,
    },
    alternateRowStyles: {
      fillColor: [248, 250, 252],
    },
    margin: { left: 15, right: 15 },
    styles: {
      lineColor: [220, 220, 220],
      lineWidth: 0.1,
    },
    didParseCell: (data) => {
      // Bold the Net Cash Flow row
      if (data.row.index === 4) {
        data.cell.styles.fontStyle = 'bold';
        data.cell.styles.fillColor = [245, 247, 250];
      }
      // Empty separator row
      if (data.row.index === 3) {
        data.cell.styles.fillColor = [255, 255, 255];
      }
    },
  });

  yPosition = (doc as any).lastAutoTable.finalY + 15;

  // Add summary note
  doc.setFontSize(9);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(100, 100, 100);
  
  const noteBoxY = yPosition;
  doc.setFillColor(250, 250, 250);
  doc.roundedRect(15, noteBoxY, pageWidth - 30, 25, 2, 2, 'F');
  
  doc.setTextColor(80, 80, 80);
  doc.text('Note:', 20, noteBoxY + 8);
  doc.setFont('helvetica', 'normal');
  
  const noteText = 'All figures are calculated based on the assumptions provided above. Actual results may vary due to market conditions, tenant behavior, and unforeseen expenses. This analysis does not account for capital appreciation or tax implications.';
  const splitNote = doc.splitTextToSize(noteText, pageWidth - 50);
  doc.text(splitNote, 20, noteBoxY + 14);

  addPageFooter(doc);

  // ==================== SAVE PDF ====================
  const propertyName = snapshot.inputs.portal_source || 'Property';
  const fileName = `YieldPulse_${propertyName.replace(/[^a-z0-9]/gi, '_')}_${new Date().toISOString().split('T')[0]}.pdf`;
  
  doc.save(fileName);
}