import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { formatCurrency, formatPercent } from './calculations';

interface ComparisonAnalysis {
  id: string;
  property_name: string;
  purchase_price: number;
  expected_monthly_rent: number;
  calculation_results: any;
  notes?: string;
}

// ==================== DESIGN SYSTEM ====================

const COLORS = {
  navy: [30, 40, 117] as [number, number, number],
  teal: [20, 184, 166] as [number, number, number],
  white: [255, 255, 255] as [number, number, number],
  text: [51, 51, 51] as [number, number, number],
  textLight: [115, 115, 115] as [number, number, number],
  textMuted: [156, 163, 175] as [number, number, number],
  border: [229, 231, 235] as [number, number, number],
  bgLight: [249, 250, 251] as [number, number, number],
  success: [16, 185, 129] as [number, number, number],
  warning: [245, 158, 11] as [number, number, number],
  destructive: [239, 68, 68] as [number, number, number],
};

const TYPE = {
  cover: 36,
  coverSub: 14,
  sectionTitle: 16,
  subsectionTitle: 12,
  body: 10,
  bodySmall: 9,
  caption: 8,
};

const LAYOUT = {
  pageWidth: 210, // A4 width in mm
  pageHeight: 297, // A4 height in mm
  marginX: 15,
  marginTop: 20,
  contentWidth: 180,
};

const SPACE = {
  xs: 3,
  sm: 5,
  md: 8,
  lg: 12,
  xl: 16,
};

const PANEL = {
  borderRadius: 3,
  borderWidth: 0.3,
};

// Helper to format report ID
function formatReportId(id: string): string {
  const numericHash = id.split('').reduce((acc, char) => {
    return acc + char.charCodeAt(0);
  }, 0);
  const reportNumber = (numericHash % 999999).toString().padStart(6, '0');
  return `YP-${reportNumber}`;
}

// Helper function to convert hex to RGB
function hexToRgb(hex: string): [number, number, number] {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
  return result 
    ? [parseInt(result[1], 16), parseInt(result[2], 16), parseInt(result[3], 16)]
    : [0, 0, 0];
}

// ==================== COVER PAGE ====================

function renderCoverPage(doc: jsPDF, analyses: ComparisonAnalysis[], exportDate: string): void {
  const centerX = LAYOUT.pageWidth / 2;
  
  // Background gradient effect - Navy header
  doc.setFillColor(30, 40, 117); // Navy
  doc.rect(0, 0, LAYOUT.pageWidth, 80, 'F');
  
  // YieldPulse Logo - Simple navy square with white icon
  const logoX = centerX - 15;
  const logoY = 20;
  const logoSize = 30;
  
  // Logo background
  doc.setFillColor(255, 255, 255); // White background for logo
  doc.rect(logoX, logoY, logoSize, logoSize, 'F');
  
  // Logo border
  doc.setDrawColor(20, 184, 166); // Teal border
  doc.setLineWidth(2);
  doc.rect(logoX, logoY, logoSize, logoSize, 'S');
  
  // Simple trending up icon inside logo (navy)
  doc.setDrawColor(30, 40, 117); // Navy
  doc.setLineWidth(1.5);
  const iconX = logoX + 8;
  const iconY = logoY + 20;
  // Trending up line
  doc.line(iconX, iconY, iconX + 4, iconY - 4);
  doc.line(iconX + 4, iconY - 4, iconX + 8, iconY - 2);
  doc.line(iconX + 8, iconY - 2, iconX + 14, iconY - 10);
  // Arrow head
  doc.line(iconX + 14, iconY - 10, iconX + 11, iconY - 10);
  doc.line(iconX + 14, iconY - 10, iconX + 14, iconY - 7);
  
  // YieldPulse wordmark
  doc.setFontSize(32);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255); // White
  doc.text('YieldPulse', centerX, 68, { align: 'center' });
  
  // Tagline
  doc.setFontSize(11);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(20, 184, 166); // Teal
  doc.text('UAE Property Investment Intelligence', centerX, 76, { align: 'center' });
  
  // White background for rest of page
  doc.setFillColor(255, 255, 255);
  doc.rect(0, 80, LAYOUT.pageWidth, LAYOUT.pageHeight - 80, 'F');
  
  // Decorative line
  doc.setDrawColor(20, 184, 166); // Teal
  doc.setLineWidth(2);
  doc.line(centerX - 40, 88, centerX + 40, 88);
  
  // Report Title
  doc.setFontSize(24);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 40, 117); // Navy
  doc.text('YieldPulse Comparison', centerX, 105, { align: 'center' });
  
  // Date and Time
  const now = new Date();
  const formattedDate = now.toLocaleDateString('en-AE', { 
    weekday: 'long',
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
  const formattedTime = now.toLocaleTimeString('en-AE', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  });
  
  doc.setFontSize(10);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(115, 115, 115);
  doc.text(`${formattedDate} at ${formattedTime}`, centerX, 113, { align: 'center' });
  
  // Comparison summary
  doc.setFontSize(11);
  doc.setTextColor(20, 184, 166); // Teal
  doc.text(`${analyses.length} Properties Analyzed`, centerX, 121, { align: 'center' });
  
  // Properties panel with border
  const panelY = 130;
  const panelHeight = 25 + (analyses.length * 11);
  
  // Panel background
  doc.setFillColor(249, 250, 251); // Light gray background
  doc.rect(25, panelY, LAYOUT.pageWidth - 50, panelHeight, 'F');
  
  // Panel border
  doc.setDrawColor(20, 184, 166); // Teal border
  doc.setLineWidth(1);
  doc.rect(25, panelY, LAYOUT.pageWidth - 50, panelHeight, 'S');
  
  // Panel header
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 40, 117); // Navy
  doc.text('Properties Included:', 35, panelY + 10);
  
  // Property list
  let lineY = panelY + 20;
  const colors = ['#1e2875', '#14b8a6', '#f59e0b', '#6366f1'];
  analyses.forEach((analysis, idx) => {
    // Color indicator
    const color = colors[idx];
    const rgbColor = hexToRgb(color);
    doc.setFillColor(rgbColor[0], rgbColor[1], rgbColor[2]);
    doc.circle(38, lineY - 1.5, 2, 'F');
    
    // Property name and ID
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(9);
    doc.setTextColor(51, 51, 51);
    const propertyLabel = `${analysis.property_name || 'Unnamed Property'}`;
    doc.text(propertyLabel, 45, lineY);
    
    // Report ID
    doc.setTextColor(115, 115, 115);
    doc.setFont('helvetica', 'normal');
    doc.text(`(${formatReportId(analysis.id)})`, 45 + doc.getTextWidth(propertyLabel) + 2, lineY);
    
    // Purchase price
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(30, 40, 117); // Navy
    doc.text(formatCurrency(analysis.purchase_price), LAYOUT.pageWidth - 35, lineY, { align: 'right' });
    
    lineY += 10;
  });
  
  // Value proposition highlights
  const highlightsY = panelY + panelHeight + 20;
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(115, 115, 115);
  
  const highlights = [
    '✓ Comprehensive Financial Analysis',
    '✓ Visual Data Comparison',
    '✓ Risk Assessment & Insights',
    '✓ Investment Decision Support'
  ];
  
  const highlightSpacing = (LAYOUT.pageWidth - 40) / 4;
  highlights.forEach((highlight, idx) => {
    const highlightX = 20 + (idx * highlightSpacing);
    const wrappedText = doc.splitTextToSize(highlight, highlightSpacing - 5);
    doc.text(wrappedText, highlightX, highlightsY);
  });
  
  // Bottom disclaimer with border
  const disclaimerY = LAYOUT.pageHeight - 50;
  
  // Disclaimer box
  doc.setFillColor(254, 249, 195); // Light yellow
  doc.rect(30, disclaimerY - 8, LAYOUT.pageWidth - 60, 28, 'F');
  
  doc.setDrawColor(245, 158, 11); // Warning orange
  doc.setLineWidth(0.5);
  doc.rect(30, disclaimerY - 8, LAYOUT.pageWidth - 60, 28, 'S');
  
  doc.setFontSize(8);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(146, 64, 14); // Dark orange
  doc.text('⚠ Important Disclaimer', centerX, disclaimerY, { align: 'center' });
  
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(7);
  doc.setTextColor(120, 53, 15);
  const disclaimer = 'This report is for informational purposes only. YieldPulse is not a financial advisor. Please consult a licensed professional before making investment decisions. Past performance does not guarantee future results.';
  const wrappedDisclaimer = doc.splitTextToSize(disclaimer, LAYOUT.pageWidth - 70);
  doc.text(wrappedDisclaimer, centerX, disclaimerY + 5, { align: 'center' });
  
  // Footer branding
  doc.setFontSize(8);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(156, 163, 175);
  doc.text('Powered by', centerX - 20, LAYOUT.pageHeight - 15, { align: 'right' });
  
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(30, 40, 117); // Navy
  doc.text('YieldPulse', centerX - 18, LAYOUT.pageHeight - 15);
  
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(156, 163, 175);
  doc.text('& Constructive', centerX + 8, LAYOUT.pageHeight - 15);
  
  // Website
  doc.setFontSize(7);
  doc.setTextColor(20, 184, 166); // Teal
  doc.text('www.yieldpulse.ae', centerX, LAYOUT.pageHeight - 10, { align: 'center' });
}

// ==================== CHART DRAWING HELPERS ====================

function drawBarChart(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  data: { label: string; values: number[]; colors: string[] }[],
  title: string,
  yAxisLabel: string
): void {
  const chartPadding = 15;
  const titleHeight = 10;
  const labelHeight = 15;
  const chartX = x + chartPadding + 10; // Extra space for y-axis label
  const chartY = y + titleHeight + 5;
  const chartWidth = width - (chartPadding * 2) - 10;
  const chartHeight = height - titleHeight - labelHeight - 10;
  
  // Title
  doc.setFontSize(TYPE.bodySmall);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.navy);
  doc.text(title, x + (width / 2), y + 5, { align: 'center' });
  
  // Draw border
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.3);
  doc.rect(chartX, chartY, chartWidth, chartHeight);
  
  // Y-axis label (rotated)
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.textLight);
  const yLabelY = chartY + (chartHeight / 2);
  const yLabelX = chartX - 8;
  doc.text(yAxisLabel, yLabelX, yLabelY, { angle: 90 });
  
  // Find max and min values for scaling (handle negatives)
  const allValues = data.flatMap(d => d.values);
  const maxValue = Math.max(...allValues, 0); // Ensure at least 0
  const minValue = Math.min(...allValues, 0); // Ensure at least 0
  const valueRange = maxValue - minValue;
  
  const barGroupWidth = chartWidth / data.length;
  const barWidth = barGroupWidth / (data[0].values.length + 1);
  
  // Calculate zero line position
  const zeroY = chartY + (maxValue / valueRange) * chartHeight;
  
  // Draw horizontal grid lines and labels
  doc.setDrawColor(...COLORS.bgLight);
  doc.setLineWidth(0.1);
  doc.setFontSize(6);
  doc.setTextColor(...COLORS.textMuted);
  for (let i = 0; i <= 4; i++) {
    const gridY = chartY + (i * chartHeight / 4);
    doc.line(chartX, gridY, chartX + chartWidth, gridY);
    const value = maxValue - (i * valueRange / 4);
    doc.text(value.toFixed(0), chartX - 2, gridY + 1, { align: 'right' });
  }
  
  // Draw zero line more prominently if there are negative values
  if (minValue < 0) {
    doc.setDrawColor(...COLORS.border);
    doc.setLineWidth(0.5);
    doc.line(chartX, zeroY, chartX + chartWidth, zeroY);
  }
  
  // Draw bars
  data.forEach((group, groupIdx) => {
    const groupX = chartX + (groupIdx * barGroupWidth);
    
    group.values.forEach((value, valueIdx) => {
      const barX = groupX + (valueIdx * barWidth) + (barWidth / 2);
      
      if (value >= 0) {
        // Positive bar - draw upward from zero line
        const barHeight = (value / valueRange) * chartHeight;
        const barY = zeroY - barHeight;
        const rgbColor = hexToRgb(group.colors[valueIdx]);
        doc.setFillColor(rgbColor[0], rgbColor[1], rgbColor[2]);
        doc.rect(barX, barY, barWidth * 0.8, barHeight, 'F');
      } else {
        // Negative bar - draw downward from zero line
        const barHeight = (Math.abs(value) / valueRange) * chartHeight;
        const barY = zeroY;
        const rgbColor = hexToRgb(group.colors[valueIdx]);
        doc.setFillColor(rgbColor[0], rgbColor[1], rgbColor[2]);
        doc.rect(barX, barY, barWidth * 0.8, barHeight, 'F');
      }
    });
    
    // Draw label below the chart area
    doc.setFontSize(7);
    doc.setTextColor(...COLORS.text);
    const labelLines = doc.splitTextToSize(group.label, barGroupWidth - 2);
    doc.text(labelLines, groupX + (barGroupWidth / 2), chartY + chartHeight + 4, { align: 'center' });
  });
}

function drawLineChart(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  data: { year: string; values: number[]; colors: string[]; names: string[] }[],
  title: string,
  yAxisLabel: string
): void {
  const chartPadding = 15;
  const titleHeight = 10;
  const labelHeight = 15;
  const legendHeight = 15;
  const chartX = x + chartPadding + 10;
  const chartY = y + titleHeight + 5;
  const chartWidth = width - (chartPadding * 2) - 10;
  const chartHeight = height - titleHeight - labelHeight - legendHeight - 10;
  
  // Title
  doc.setFontSize(TYPE.bodySmall);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.navy);
  doc.text(title, x + (width / 2), y + 5, { align: 'center' });
  
  // Draw border
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.3);
  doc.rect(chartX, chartY, chartWidth, chartHeight);
  
  // Y-axis label (rotated)
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.textLight);
  const yLabelY2 = chartY + (chartHeight / 2);
  const yLabelX2 = chartX - 8;
  doc.text(yAxisLabel, yLabelX2, yLabelY2, { angle: 90 });
  
  // Find max/min values for scaling
  const allValues = data.flatMap(d => d.values);
  const maxValue = Math.max(...allValues);
  const minValue = Math.min(...allValues);
  const valueRange = maxValue - minValue;
  
  // Draw horizontal grid lines and labels
  doc.setDrawColor(...COLORS.bgLight);
  doc.setLineWidth(0.1);
  doc.setFontSize(6);
  doc.setTextColor(...COLORS.textMuted);
  for (let i = 0; i <= 4; i++) {
    const gridY = chartY + (i * chartHeight / 4);
    doc.line(chartX, gridY, chartX + chartWidth, gridY);
    const value = maxValue - (i * valueRange / 4);
    doc.text((value / 1000).toFixed(0) + 'k', chartX - 2, gridY + 1, { align: 'right' });
  }
  
  const pointSpacing = chartWidth / (data.length - 1);
  
  // Draw lines for each property
  const numProperties = data[0].values.length;
  for (let propIdx = 0; propIdx < numProperties; propIdx++) {
    const rgbColor = hexToRgb(data[0].colors[propIdx]);
    doc.setDrawColor(rgbColor[0], rgbColor[1], rgbColor[2]);
    doc.setLineWidth(0.8);
    
    for (let i = 0; i < data.length - 1; i++) {
      const x1 = chartX + (i * pointSpacing);
      const y1 = chartY + chartHeight - ((data[i].values[propIdx] - minValue) / valueRange * chartHeight);
      const x2 = chartX + ((i + 1) * pointSpacing);
      const y2 = chartY + chartHeight - ((data[i + 1].values[propIdx] - minValue) / valueRange * chartHeight);
      
      doc.line(x1, y1, x2, y2);
      
      // Draw points
      doc.setFillColor(rgbColor[0], rgbColor[1], rgbColor[2]);
      doc.circle(x1, y1, 1, 'F');
      if (i === data.length - 2) {
        doc.circle(x2, y2, 1, 'F');
      }
    }
  }
  
  // Draw x-axis labels
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.text);
  data.forEach((point, idx) => {
    const labelX = chartX + (idx * pointSpacing);
    doc.text(point.year, labelX, chartY + chartHeight + 4, { align: 'center' });
  });
  
  // Legend at bottom
  const legendY = chartY + chartHeight + 10;
  let legendX = x + 20;
  doc.setFontSize(6);
  for (let i = 0; i < numProperties; i++) {
    const rgbColor = hexToRgb(data[0].colors[i]);
    doc.setFillColor(rgbColor[0], rgbColor[1], rgbColor[2]);
    doc.circle(legendX, legendY, 1, 'F');
    doc.setTextColor(...COLORS.text);
    const name = data[0].names[i];
    doc.text(name, legendX + 3, legendY + 1);
    legendX += doc.getTextWidth(name) + 10;
  }
}

function drawRadarChart(
  doc: jsPDF,
  x: number,
  y: number,
  width: number,
  height: number,
  data: { factor: string; values: number[]; colors: string[]; names: string[] }[],
  title: string
): void {
  const titleHeight = 10;
  const legendHeight = 15;
  const centerX = x + (width / 2);
  const centerY = y + titleHeight + (height - titleHeight - legendHeight) / 2;
  const radius = Math.min(width, height - titleHeight - legendHeight) / 2.5;
  
  // Title
  doc.setFontSize(TYPE.bodySmall);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.navy);
  doc.text(title, x + (width / 2), y + 5, { align: 'center' });
  
  const numFactors = data.length;
  const angleStep = (2 * Math.PI) / numFactors;
  
  // Draw grid circles
  doc.setDrawColor(...COLORS.bgLight);
  doc.setLineWidth(0.2);
  for (let i = 1; i <= 4; i++) {
    const r = (radius / 4) * i;
    doc.circle(centerX, centerY, r, 'S');
  }
  
  // Draw axes and labels
  doc.setDrawColor(...COLORS.border);
  doc.setLineWidth(0.3);
  doc.setFontSize(7);
  doc.setTextColor(...COLORS.text);
  
  data.forEach((item, idx) => {
    const angle = (idx * angleStep) - (Math.PI / 2); // Start from top
    const x1 = centerX;
    const y1 = centerY;
    const x2 = centerX + Math.cos(angle) * radius;
    const y2 = centerY + Math.sin(angle) * radius;
    
    doc.line(x1, y1, x2, y2);
    
    // Label position
    const labelDist = radius + 5;
    const labelX = centerX + Math.cos(angle) * labelDist;
    const labelY = centerY + Math.sin(angle) * labelDist;
    
    doc.text(item.factor, labelX, labelY, { align: 'center' });
  });
  
  // Draw data for each property
  const numProperties = data[0].values.length;
  for (let propIdx = 0; propIdx < numProperties; propIdx++) {
    const rgbColor = hexToRgb(data[0].colors[propIdx]);
    
    // Draw filled polygon
    doc.setFillColor(rgbColor[0], rgbColor[1], rgbColor[2]);
    doc.setDrawColor(rgbColor[0], rgbColor[1], rgbColor[2]);
    doc.setLineWidth(0.5);
    
    const points: [number, number][] = [];
    data.forEach((item, idx) => {
      const angle = (idx * angleStep) - (Math.PI / 2);
      const value = item.values[propIdx];
      const r = (value / 100) * radius;
      const px = centerX + Math.cos(angle) * r;
      const py = centerY + Math.sin(angle) * r;
      points.push([px, py]);
    });
    
    // Draw polygon
    if (points.length > 0) {
      doc.setGState(new (doc as any).GState({ opacity: 0.3 }));
      doc.lines(
        points.slice(1).map((p, i) => [p[0] - points[i][0], p[1] - points[i][1]]),
        points[0][0],
        points[0][1],
        [1, 1],
        'FD',
        true
      );
      doc.setGState(new (doc as any).GState({ opacity: 1 }));
      
      // Draw outline
      doc.lines(
        points.slice(1).map((p, i) => [p[0] - points[i][0], p[1] - points[i][1]]),
        points[0][0],
        points[0][1],
        [1, 1],
        'S',
        true
      );
    }
  }
  
  // Legend at bottom
  const legendY = y + height - legendHeight + 5;
  let legendX = x + 20;
  doc.setFontSize(6);
  for (let i = 0; i < numProperties; i++) {
    const rgbColor = hexToRgb(data[0].colors[i]);
    doc.setFillColor(rgbColor[0], rgbColor[1], rgbColor[2]);
    doc.circle(legendX, legendY, 1, 'F');
    doc.setTextColor(...COLORS.text);
    const name = data[0].names[i];
    doc.text(name, legendX + 3, legendY + 1);
    legendX += doc.getTextWidth(name) + 10;
  }
}

// ==================== SECTION HEADER ====================

function renderSectionHeader(doc: jsPDF, title: string, yPos: number): number {
  let y = yPos;
  
  // Add new page if needed
  if (y > LAYOUT.pageHeight - 40) {
    doc.addPage();
    y = LAYOUT.marginTop;
  }
  
  // Section header
  doc.setFontSize(TYPE.sectionTitle);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(...COLORS.navy);
  doc.text(title, LAYOUT.marginX, y);
  
  // Underline
  doc.setDrawColor(...COLORS.teal);
  doc.setLineWidth(0.5);
  doc.line(LAYOUT.marginX, y + 2, LAYOUT.pageWidth - LAYOUT.marginX, y + 2);
  
  return y + SPACE.lg;
}

// ==================== KEY METRICS TABLE ====================

function renderKeyMetricsTable(doc: jsPDF, analyses: ComparisonAnalysis[], yPos: number): number {
  let y = renderSectionHeader(doc, 'Key Metrics Comparison', yPos);
  
  // Helper to find best/worst values
  const getBestWorst = (values: number[], higherIsBetter: boolean) => {
    const best = higherIsBetter ? Math.max(...values) : Math.min(...values);
    const worst = higherIsBetter ? Math.min(...values) : Math.max(...values);
    return { best, worst };
  };
  
  const colors = ['#1e2875', '#14b8a6', '#f59e0b', '#6366f1'];
  
  // Build table data - EXACTLY matching web version
  const tableData: any[] = [];
  const headers = [
    'Metric',
    ...analyses.map((a, idx) => {
      const rgbColor = hexToRgb(colors[idx]);
      return {
        content: `${a.property_name || 'Property ' + (idx + 1)}\n${formatReportId(a.id)}`,
        styles: { fillColor: rgbColor, textColor: COLORS.white }
      };
    })
  ];
  
  // Purchase Price
  tableData.push([
    'Purchase Price',
    ...analyses.map(a => formatCurrency(a.purchase_price))
  ]);
  
  // Monthly Rent
  tableData.push([
    'Monthly Rent',
    ...analyses.map(a => formatCurrency(a.expected_monthly_rent))
  ]);
  
  // Cost per sq ft - show if ANY property has it
  if (analyses.some(a => a.calculation_results.costPerSqft)) {
    const values = analyses.map(a => a.calculation_results.costPerSqft || 0).filter(v => v > 0);
    const { best, worst } = values.length > 0 ? getBestWorst(values, false) : { best: 0, worst: 0 };
    tableData.push([
      'Cost per sq ft',
      ...analyses.map(a => {
        const value = a.calculation_results.costPerSqft;
        if (!value || value === 0) {
          return { content: 'N/A', styles: { textColor: COLORS.textMuted, fontStyle: 'italic' } };
        }
        return {
          content: formatCurrency(value),
          styles: {
            textColor: value === best ? COLORS.success : (value === worst && values.length > 1 ? COLORS.destructive : COLORS.text)
          }
        };
      })
    ]);
  }
  
  // Rent per sq ft - show if ANY property has it
  if (analyses.some(a => a.calculation_results.rentPerSqft)) {
    const values = analyses.map(a => a.calculation_results.rentPerSqft || 0).filter(v => v > 0);
    const { best, worst } = values.length > 0 ? getBestWorst(values, true) : { best: 0, worst: 0 };
    tableData.push([
      'Rent per sq ft (Annual)',
      ...analyses.map(a => {
        const value = a.calculation_results.rentPerSqft;
        if (!value || value === 0) {
          return { content: 'N/A', styles: { textColor: COLORS.textMuted, fontStyle: 'italic' } };
        }
        return {
          content: formatCurrency(value),
          styles: {
            textColor: value === best ? COLORS.success : (value === worst && values.length > 1 ? COLORS.destructive : COLORS.text)
          }
        };
      })
    ]);
  }
  
  // Gross Yield
  const grossYields = analyses.map(a => a.calculation_results.grossRentalYield);
  const grossBW = getBestWorst(grossYields, true);
  tableData.push([
    'Gross Yield',
    ...analyses.map(a => {
      const value = a.calculation_results.grossRentalYield;
      return {
        content: formatPercent(value),
        styles: {
          textColor: value === grossBW.best ? COLORS.success : (value === grossBW.worst && analyses.length > 2 ? COLORS.destructive : COLORS.text)
        }
      };
    })
  ]);
  
  // Net Yield
  const netYields = analyses.map(a => a.calculation_results.netRentalYield);
  const netBW = getBestWorst(netYields, true);
  tableData.push([
    'Net Yield',
    ...analyses.map(a => {
      const value = a.calculation_results.netRentalYield;
      return {
        content: formatPercent(value),
        styles: {
          textColor: value === netBW.best ? COLORS.success : (value === netBW.worst && analyses.length > 2 ? COLORS.destructive : COLORS.text)
        }
      };
    })
  ]);
  
  // Cap Rate
  if (analyses.every(a => a.calculation_results.capRate)) {
    const capRates = analyses.map(a => a.calculation_results.capRate);
    const capBW = getBestWorst(capRates, true);
    tableData.push([
      'Cap Rate',
      ...analyses.map(a => {
        const value = a.calculation_results.capRate;
        return {
          content: formatPercent(value),
          styles: {
            textColor: value === capBW.best ? COLORS.success : (value === capBW.worst && analyses.length > 2 ? COLORS.destructive : COLORS.text)
          }
        };
      })
    ]);
  }
  
  // Monthly Cash Flow
  const cashFlows = analyses.map(a => a.calculation_results.monthlyCashFlow);
  const cfBW = getBestWorst(cashFlows, true);
  tableData.push([
    'Monthly Cash Flow',
    ...analyses.map(a => {
      const value = a.calculation_results.monthlyCashFlow;
      return {
        content: formatCurrency(value),
        styles: {
          textColor: value === cfBW.best ? COLORS.success : (value === cfBW.worst && analyses.length > 2 ? COLORS.destructive : COLORS.text),
          fontStyle: 'bold'
        }
      };
    })
  ]);
  
  // Cash on Cash Return
  const cocReturns = analyses.map(a => a.calculation_results.cashOnCashReturn);
  const cocBW = getBestWorst(cocReturns, true);
  tableData.push([
    'Cash on Cash Return',
    ...analyses.map(a => {
      const value = a.calculation_results.cashOnCashReturn;
      return {
        content: formatPercent(value),
        styles: {
          textColor: value === cocBW.best ? COLORS.success : (value === cocBW.worst && analyses.length > 2 ? COLORS.destructive : COLORS.text),
          fontStyle: 'bold'
        }
      };
    })
  ]);
  
  // Initial Investment
  const investments = analyses.map(a => a.calculation_results.totalInitialInvestment);
  const invBW = getBestWorst(investments, false);
  tableData.push([
    'Initial Investment',
    ...analyses.map(a => {
      const value = a.calculation_results.totalInitialInvestment;
      return {
        content: formatCurrency(value),
        styles: {
          textColor: value === invBW.best ? COLORS.success : (value === invBW.worst && analyses.length > 2 ? COLORS.destructive : COLORS.text)
        }
      };
    })
  ]);
  
  // Year 5 Total Return
  if (analyses.every(a => a.calculation_results.projection?.[4])) {
    const year5Returns = analyses.map(a => a.calculation_results.projection[4].totalReturn);
    const y5BW = getBestWorst(year5Returns, true);
    tableData.push([
      { content: 'Year 5 Total Return', styles: { fontStyle: 'bold', fillColor: [240, 253, 250] } },
      ...analyses.map(a => {
        const value = a.calculation_results.projection[4].totalReturn;
        return {
          content: formatCurrency(value),
          styles: {
            textColor: value === y5BW.best ? COLORS.success : (value === y5BW.worst && analyses.length > 2 ? COLORS.destructive : COLORS.text),
            fontStyle: 'bold',
            fillColor: [240, 253, 250]
          }
        };
      })
    ]);
    
    const year5ROI = analyses.map(a => a.calculation_results.projection[4].roiPercent);
    const y5ROIBW = getBestWorst(year5ROI, true);
    tableData.push([
      { content: 'Year 5 ROI %', styles: { fontStyle: 'bold', fillColor: [240, 253, 250] } },
      ...analyses.map(a => {
        const value = a.calculation_results.projection[4].roiPercent;
        return {
          content: formatPercent(value),
          styles: {
            textColor: value === y5ROIBW.best ? COLORS.success : (value === y5ROIBW.worst && analyses.length > 2 ? COLORS.destructive : COLORS.text),
            fontStyle: 'bold',
            fillColor: [240, 253, 250]
          }
        };
      })
    ]);
  }
  
  autoTable(doc, {
    startY: y,
    head: [headers],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fontSize: TYPE.bodySmall,
      fontStyle: 'bold',
      halign: 'center',
      valign: 'middle',
      cellPadding: 3,
    },
    bodyStyles: {
      fontSize: TYPE.bodySmall,
      cellPadding: { top: 3, bottom: 3, left: 2, right: 2 },
      halign: 'right',
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 45, halign: 'left' }
    },
    margin: { left: LAYOUT.marginX, right: LAYOUT.marginX },
    tableLineColor: COLORS.border,
    tableLineWidth: 0.3,
  });
  
  y = (doc as any).lastAutoTable.finalY + SPACE.xl;
  
  // Legend removed - color coding is self-explanatory
  
  return y;
}

// ==================== YIELD COMPARISON WITH CHART ====================

function renderYieldComparison(doc: jsPDF, analyses: ComparisonAnalysis[], yPos: number): number {
  let y = renderSectionHeader(doc, 'Yield & Return Comparison', yPos);
  
  const colors = ['#1e2875', '#14b8a6', '#f59e0b', '#6366f1'];
  
  // Prepare chart data
  const metrics = [
    { name: 'Gross Yield %', key: 'grossRentalYield' },
    { name: 'Net Yield %', key: 'netRentalYield' },
    { name: 'Cash on Cash %', key: 'cashOnCashReturn' },
  ];
  
  const chartData = metrics.map(metric => ({
    label: metric.name,
    values: analyses.map(a => (a.calculation_results[metric.key as keyof typeof a.calculation_results] as number) * 100),
    colors: colors
  }));
  
  // Draw bar chart - REDUCED SIZE for page 2 fit
  const chartHeight = 55;
  drawBarChart(
    doc,
    LAYOUT.marginX,
    y,
    LAYOUT.contentWidth,
    chartHeight,
    chartData,
    'Yield & Return Comparison',
    'Percentage (%)'
  );
  y += chartHeight + SPACE.xs;
  
  // Data table below chart - COMPACT
  const tableData: any[] = [];
  metrics.forEach(metric => {
    const row = [
      { content: metric.name, styles: { fontStyle: 'bold' } }
    ];
    
    analyses.forEach((analysis, idx) => {
      const value = (analysis.calculation_results[metric.key as keyof typeof analysis.calculation_results] as number) * 100;
      const rgbColor = hexToRgb(colors[idx]);
      row.push({
        content: `${value.toFixed(2)}%`,
        styles: {
          textColor: rgbColor,
          fontStyle: 'bold'
        }
      });
    });
    
    tableData.push(row);
  });
  
  const headers = [
    'Metric',
    ...analyses.map((a, idx) => {
      const rgbColor = hexToRgb(colors[idx]);
      return {
        content: a.property_name || `Property ${idx + 1}`,
        styles: { fillColor: rgbColor, textColor: COLORS.white }
      };
    })
  ];
  
  autoTable(doc, {
    startY: y,
    head: [headers],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fontSize: TYPE.bodySmall,
      fontStyle: 'bold',
      cellPadding: 2,
    },
    bodyStyles: {
      fontSize: TYPE.bodySmall,
      halign: 'right',
      cellPadding: 2,
    },
    columnStyles: {
      0: { halign: 'left', cellWidth: 45 }
    },
    margin: { left: LAYOUT.marginX, right: LAYOUT.marginX },
  });
  
  return (doc as any).lastAutoTable.finalY + SPACE.lg;
}

// ==================== 5-YEAR PROJECTION WITH CHART ====================

function renderFiveYearProjection(doc: jsPDF, analyses: ComparisonAnalysis[], yPos: number): number {
  if (!analyses.every(a => a.calculation_results.projection)) {
    return yPos;
  }
  
  let y = renderSectionHeader(doc, '5-Year Cash Flow Trajectory', yPos);
  
  const colors = ['#1e2875', '#14b8a6', '#f59e0b', '#6366f1'];
  
  // Prepare line chart data
  const lineChartData = [1, 2, 3, 4, 5].map(year => ({
    year: `Year ${year}`,
    values: analyses.map(a => a.calculation_results.projection[year - 1].cashFlow),
    colors: colors,
    names: analyses.map(a => a.property_name || 'Property')
  }));
  
  // Draw line chart - REDUCED SIZE for page 2 fit
  const chartHeight = 55;
  drawLineChart(
    doc,
    LAYOUT.marginX,
    y,
    LAYOUT.contentWidth,
    chartHeight,
    lineChartData,
    '5-Year Cash Flow Trajectory',
    'Annual Cash Flow (AED)'
  );
  y += chartHeight + SPACE.sm;
  
  // Build projection table - COMPACT
  const tableData: any[] = [];
  
  for (let year = 1; year <= 5; year++) {
    const row = [
      { content: `Year ${year}`, styles: { fontStyle: 'bold' } }
    ];
    
    analyses.forEach((analysis, idx) => {
      const projection = analysis.calculation_results.projection[year - 1];
      if (projection) {
        const rgbColor = hexToRgb(colors[idx]);
        row.push({
          content: formatCurrency(projection.cashFlow),
          styles: { 
            textColor: rgbColor,
            fontStyle: 'bold'
          }
        });
      }
    });
    
    tableData.push(row);
  }
  
  const headers = [
    'Year',
    ...analyses.map((a, idx) => {
      const rgbColor = hexToRgb(colors[idx]);
      return {
        content: a.property_name || `Property ${idx + 1}`,
        styles: { fillColor: rgbColor, textColor: COLORS.white }
      };
    })
  ];
  
  autoTable(doc, {
    startY: y,
    head: [headers],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fontSize: TYPE.bodySmall,
      fontStyle: 'bold',
      cellPadding: 2,
    },
    bodyStyles: {
      fontSize: TYPE.bodySmall,
      halign: 'right',
      cellPadding: 2,
    },
    columnStyles: {
      0: { halign: 'left', fontStyle: 'bold' }
    },
    margin: { left: LAYOUT.marginX, right: LAYOUT.marginX },
  });
  
  y = (doc as any).lastAutoTable.finalY + SPACE.sm;
  
  // Explanation - COMPACT
  doc.setFontSize(TYPE.caption);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...COLORS.textLight);
  const explanation = doc.splitTextToSize(
    'This chart shows how annual cash flow evolves over 5 years for each property.',
    LAYOUT.contentWidth
  );
  doc.text(explanation, LAYOUT.marginX, y);
  
  return y + (explanation.length * 3.5) + SPACE.md;
}

// ==================== RISK PROFILE WITH CHART ====================

function renderRiskProfile(doc: jsPDF, analyses: ComparisonAnalysis[], yPos: number): number {
  let y = renderSectionHeader(doc, 'Risk Profile Comparison', yPos);
  
  // Calculate risk scores
  const getRiskScores = (a: ComparisonAnalysis) => {
    const rentRisk = Math.min(100, (a.expected_monthly_rent / a.purchase_price) * 1000);
    const rentStability = 100 - rentRisk;
    
    const cf = a.calculation_results.monthlyCashFlow;
    const cashFlow = cf >= 1000 ? 100 : cf >= 0 ? 70 : Math.max(0, 50 + (cf / 100));
    
    const ltv = (a.calculation_results.loanAmount / a.purchase_price) * 100;
    const leverage = ltv <= 50 ? 100 : ltv <= 70 ? 80 : ltv <= 80 ? 60 : 40;
    
    const netYield = a.calculation_results.netRentalYield * 100;
    const returns = netYield >= 8 ? 100 : netYield >= 6 ? 80 : netYield >= 4 ? 60 : 40;
    
    const affordability = a.calculation_results.totalInitialInvestment <= 100000 ? 100 :
                          a.calculation_results.totalInitialInvestment <= 200000 ? 80 :
                          a.calculation_results.totalInitialInvestment <= 300000 ? 60 : 40;
    
    return {
      'Rent Stability': rentStability,
      'Cash Flow': cashFlow,
      'Leverage': leverage,
      'Returns': returns,
      'Affordability': affordability
    };
  };
  
  const colors = ['#1e2875', '#14b8a6', '#f59e0b', '#6366f1'];
  const riskFactors = ['Rent Stability', 'Cash Flow', 'Leverage', 'Returns', 'Affordability'];
  
  // Prepare radar chart data
  const radarData = riskFactors.map(factor => ({
    factor: factor,
    values: analyses.map(a => {
      const scores = getRiskScores(a);
      return scores[factor as keyof typeof scores];
    }),
    colors: colors,
    names: analyses.map(a => a.property_name || 'Property')
  }));
  
  // Draw radar chart
  if (y > LAYOUT.pageHeight - 120) {
    doc.addPage();
    y = LAYOUT.marginTop;
  }
  
  // Add explanation first
  doc.setFontSize(TYPE.bodySmall);
  doc.setFont('helvetica', 'italic');
  doc.setTextColor(...COLORS.textLight);
  const explanation = doc.splitTextToSize(
    'Higher scores indicate lower risk. This radar chart visualizes the relative risk profile across key factors.',
    LAYOUT.contentWidth
  );
  doc.text(explanation, LAYOUT.marginX, y);
  y += (explanation.length * 4) + SPACE.sm;
  
  const chartHeight = 90;
  drawRadarChart(
    doc,
    LAYOUT.marginX,
    y,
    LAYOUT.contentWidth,
    chartHeight,
    radarData,
    'Risk Profile Radar Chart'
  );
  y += chartHeight + SPACE.md;
  
  // Data table below chart
  if (y > LAYOUT.pageHeight - 50) {
    doc.addPage();
    y = LAYOUT.marginTop;
  }
  
  // Build risk table
  const tableData: any[] = [];
  
  riskFactors.forEach(factor => {
    const row = [
      { content: factor, styles: { fontStyle: 'bold' } }
    ];
    
    analyses.forEach((analysis, idx) => {
      const scores = getRiskScores(analysis);
      const score = scores[factor as keyof typeof scores];
      
      row.push({
        content: `${score.toFixed(0)}/100`,
        styles: {
          textColor: score >= 80 ? COLORS.success : score >= 60 ? COLORS.warning : COLORS.destructive,
          fontStyle: 'bold'
        }
      });
    });
    
    tableData.push(row);
  });
  
  const headers = [
    'Risk Factor',
    ...analyses.map((a, idx) => {
      const rgbColor = hexToRgb(colors[idx]);
      return {
        content: a.property_name || `Property ${idx + 1}`,
        styles: { fillColor: rgbColor, textColor: COLORS.white }
      };
    })
  ];
  
  autoTable(doc, {
    startY: y,
    head: [headers],
    body: tableData,
    theme: 'grid',
    headStyles: {
      fontSize: TYPE.bodySmall,
      fontStyle: 'bold',
      cellPadding: 3,
    },
    bodyStyles: {
      fontSize: TYPE.bodySmall,
      halign: 'center',
      cellPadding: 3,
    },
    columnStyles: {
      0: { halign: 'left', cellWidth: 45 }
    },
    margin: { left: LAYOUT.marginX, right: LAYOUT.marginX },
  });
  
  return (doc as any).lastAutoTable.finalY + SPACE.xl;
}

// ==================== INVESTMENT DECISION HELPER ====================

function renderDecisionHelper(doc: jsPDF, analyses: ComparisonAnalysis[], yPos: number): number {
  let y = renderSectionHeader(doc, 'Investment Decision Helper', yPos);
  
  // Best for Cash Flow
  const cashFlows = analyses.map((a, idx) => ({
    value: a.calculation_results.monthlyCashFlow,
    index: idx,
    name: a.property_name
  }));
  const bestCashFlow = cashFlows.reduce((prev, curr) => curr.value > prev.value ? curr : prev);
  
  // Best for Total Return
  let bestReturn = null;
  if (analyses.every(a => a.calculation_results.projection?.[4])) {
    const returns = analyses.map((a, idx) => ({
      value: a.calculation_results.projection[4].totalReturn,
      index: idx,
      name: a.property_name
    }));
    bestReturn = returns.reduce((prev, curr) => curr.value > prev.value ? curr : prev);
  }
  
  // Lowest Initial Investment
  const investments = analyses.map((a, idx) => ({
    value: a.calculation_results.totalInitialInvestment,
    index: idx,
    name: a.property_name
  }));
  const lowestInvestment = investments.reduce((prev, curr) => curr.value < prev.value ? curr : prev);
  
  // Best Net Yield
  const yields = analyses.map((a, idx) => ({
    value: a.calculation_results.netRentalYield,
    index: idx,
    name: a.property_name
  }));
  const bestYield = yields.reduce((prev, curr) => curr.value > prev.value ? curr : prev);
  
  const summaryData = [
    [
      { content: 'Best for Cash Flow', styles: { fontStyle: 'bold' } },
      bestCashFlow.name || `Property ${bestCashFlow.index + 1}`,
      { content: formatCurrency(bestCashFlow.value) + '/month', styles: { textColor: COLORS.success, fontStyle: 'bold' } }
    ],
    [
      { content: 'Lowest Entry Cost', styles: { fontStyle: 'bold' } },
      lowestInvestment.name || `Property ${lowestInvestment.index + 1}`,
      { content: formatCurrency(lowestInvestment.value), styles: { textColor: COLORS.success, fontStyle: 'bold' } }
    ],
    [
      { content: 'Best Net Yield', styles: { fontStyle: 'bold' } },
      bestYield.name || `Property ${bestYield.index + 1}`,
      { content: formatPercent(bestYield.value), styles: { textColor: COLORS.success, fontStyle: 'bold' } }
    ],
  ];
  
  if (bestReturn) {
    summaryData.splice(1, 0, [
      { content: 'Best 5-Year Return', styles: { fontStyle: 'bold' } },
      bestReturn.name || `Property ${bestReturn.index + 1}`,
      { content: formatCurrency(bestReturn.value), styles: { textColor: COLORS.teal, fontStyle: 'bold' } }
    ]);
  }
  
  autoTable(doc, {
    startY: y,
    head: [['Category', 'Winner', 'Value']],
    body: summaryData,
    theme: 'grid',
    headStyles: {
      fillColor: COLORS.teal,
      textColor: COLORS.white,
      fontSize: TYPE.bodySmall,
      fontStyle: 'bold',
      cellPadding: 3,
    },
    bodyStyles: {
      fontSize: TYPE.bodySmall,
      cellPadding: 3,
    },
    columnStyles: {
      0: { cellWidth: 60 },
      1: { cellWidth: 70 }
    },
    margin: { left: LAYOUT.marginX, right: LAYOUT.marginX },
  });
  
  return (doc as any).lastAutoTable.finalY + SPACE.xl;
}

// ==================== NOTES SECTION ====================

function renderNotes(doc: jsPDF, analyses: ComparisonAnalysis[], yPos: number): number {
  const hasNotes = analyses.some(a => a.notes);
  if (!hasNotes) return yPos;
  
  let y = renderSectionHeader(doc, 'Your Notes', yPos);
  
  analyses.forEach((analysis, idx) => {
    if (analysis.notes) {
      if (y > LAYOUT.pageHeight - 40) {
        doc.addPage();
        y = LAYOUT.marginTop;
      }
      
      // Property header
      doc.setFontSize(TYPE.subsectionTitle);
      doc.setFont('helvetica', 'bold');
      doc.setTextColor(...COLORS.navy);
      doc.text(`${analysis.property_name || 'Unnamed Property'} (${formatReportId(analysis.id)})`, LAYOUT.marginX, y);
      
      y += SPACE.sm;
      
      // Notes content
      doc.setFontSize(TYPE.bodySmall);
      doc.setFont('helvetica', 'normal');
      doc.setTextColor(...COLORS.text);
      const splitNotes = doc.splitTextToSize(analysis.notes, LAYOUT.contentWidth);
      doc.text(splitNotes, LAYOUT.marginX, y);
      
      y += splitNotes.length * 4 + SPACE.lg;
    }
  });
  
  return y;
}

// ==================== MAIN PDF GENERATION ====================

export async function generateComparisonPDF(analyses: ComparisonAnalysis[]) {
  const doc = new jsPDF({
    orientation: 'portrait',
    unit: 'mm',
    format: 'a4',
  });
  
  // Generate export timestamp
  const exportTimestamp = new Date().toLocaleDateString('en-AE', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
  
  // COVER PAGE
  renderCoverPage(doc, analyses, exportTimestamp);
  
  // PAGE 1: Key Metrics Comparison ONLY
  doc.addPage();
  let y = LAYOUT.marginTop;
  y = renderKeyMetricsTable(doc, analyses, y);
  
  // PAGE 2: Yield & Return + 5-Year Cash Flow
  doc.addPage();
  y = LAYOUT.marginTop;
  y = renderYieldComparison(doc, analyses, y);
  y = renderFiveYearProjection(doc, analyses, y);
  
  // PAGE 3: Risk Profile + Investment Decision Helper
  doc.addPage();
  y = LAYOUT.marginTop;
  y = renderRiskProfile(doc, analyses, y);
  
  // Decision Helper on same page if space allows, otherwise skip check
  y = renderDecisionHelper(doc, analyses, y);
  
  // Notes (if any)
  if (analyses.some(a => a.notes)) {
    // Check if we need a new page
    if (y > LAYOUT.pageHeight - 80) {
      doc.addPage();
      y = LAYOUT.marginTop;
    }
    y = renderNotes(doc, analyses, y);
  }
  
  // ==================== HEADERS AND FOOTERS ====================
  const totalPages = doc.getNumberOfPages();
  
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    const isCoverPage = i === 1;
    
    if (!isCoverPage) {
      // Header
      doc.setFontSize(TYPE.caption);
      doc.setTextColor(...COLORS.textMuted);
      doc.text('YieldPulse Property Comparison Report', LAYOUT.marginX, 10);
      doc.text(exportTimestamp, LAYOUT.pageWidth - LAYOUT.marginX, 10, { align: 'right' });
      
      // Header line
      doc.setDrawColor(...COLORS.border);
      doc.setLineWidth(0.3);
      doc.line(LAYOUT.marginX, 12, LAYOUT.pageWidth - LAYOUT.marginX, 12);
      
      // Footer with page number (excluding cover page from count)
      doc.setFontSize(TYPE.caption);
      doc.setTextColor(...COLORS.textMuted);
      doc.text(
        `Page ${i - 1} of ${totalPages - 1}`,
        LAYOUT.pageWidth / 2,
        LAYOUT.pageHeight - 10,
        { align: 'center' }
      );
      doc.text(
        'www.yieldpulse.ae',
        LAYOUT.pageWidth - LAYOUT.marginX,
        LAYOUT.pageHeight - 10,
        { align: 'right' }
      );
    }
  }
  
  // ==================== DOWNLOAD ====================
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-AE', { 
    year: 'numeric', 
    month: 'short', 
    day: 'numeric' 
  }).replace(/\//g, '-');
  const timeStr = now.toLocaleTimeString('en-AE', {
    hour: '2-digit',
    minute: '2-digit',
    hour12: true
  }).replace(/:/g, '-');
  
  const fileName = `YieldPulse Comparison - ${dateStr} ${timeStr}.pdf`;
  doc.save(fileName);
}