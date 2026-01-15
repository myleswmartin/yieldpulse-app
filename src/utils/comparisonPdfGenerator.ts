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

export async function generateComparisonPDF(analyses: ComparisonAnalysis[]) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  let yPos = 20;

  // Header
  doc.setFillColor(30, 40, 117); // Navy
  doc.rect(0, 0, pageWidth, 35, 'F');
  
  doc.setFontSize(24);
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.text('YieldPulse', 20, 15);
  
  doc.setFontSize(14);
  doc.setFont('helvetica', 'normal');
  doc.text('Property Investment Comparison', 20, 25);
  
  // Date
  doc.setFontSize(9);
  doc.setTextColor(200, 200, 200);
  doc.text(`Generated: ${new Date().toLocaleDateString('en-AE')}`, pageWidth - 20, 15, { align: 'right' });

  yPos = 45;

  // Summary Section
  doc.setFontSize(16);
  doc.setTextColor(30, 40, 117);
  doc.setFont('helvetica', 'bold');
  doc.text(`Comparing ${analyses.length} Properties`, 20, yPos);
  
  yPos += 10;

  // Key Metrics Table
  const tableData = [];
  const headers = ['Metric', ...analyses.map((a, idx) => `Property ${idx + 1}`)];
  
  // Property Names
  tableData.push([
    'Property Name',
    ...analyses.map(a => a.property_name || 'Unnamed Property')
  ]);

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

  // Cost per sq ft
  if (analyses.every(a => a.calculation_results.costPerSqft)) {
    tableData.push([
      'Cost per sq ft',
      ...analyses.map(a => formatCurrency(a.calculation_results.costPerSqft || 0))
    ]);
  }

  // Rent per sq ft
  if (analyses.every(a => a.calculation_results.rentPerSqft)) {
    tableData.push([
      'Rent per sq ft (Annual)',
      ...analyses.map(a => formatCurrency(a.calculation_results.rentPerSqft || 0))
    ]);
  }

  // Gross Yield
  tableData.push([
    'Gross Yield',
    ...analyses.map(a => formatPercent(a.calculation_results.grossRentalYield))
  ]);

  // Net Yield
  tableData.push([
    'Net Yield',
    ...analyses.map(a => formatPercent(a.calculation_results.netRentalYield))
  ]);

  // Cap Rate
  if (analyses.every(a => a.calculation_results.capRate)) {
    tableData.push([
      'Cap Rate',
      ...analyses.map(a => formatPercent(a.calculation_results.capRate))
    ]);
  }

  // Monthly Cash Flow
  tableData.push([
    'Monthly Cash Flow',
    ...analyses.map(a => formatCurrency(a.calculation_results.monthlyCashFlow))
  ]);

  // Cash on Cash Return
  tableData.push([
    'Cash on Cash Return',
    ...analyses.map(a => formatPercent(a.calculation_results.cashOnCashReturn))
  ]);

  // Initial Investment
  tableData.push([
    'Initial Investment',
    ...analyses.map(a => formatCurrency(a.calculation_results.totalInitialInvestment))
  ]);

  // Year 5 Total Return (if available)
  if (analyses.every(a => a.calculation_results.projection?.[4])) {
    tableData.push([
      'Year 5 Total Return',
      ...analyses.map(a => formatCurrency(a.calculation_results.projection[4].totalReturn))
    ]);

    tableData.push([
      'Year 5 ROI %',
      ...analyses.map(a => formatPercent(a.calculation_results.projection[4].roiPercent))
    ]);
  }

  autoTable(doc, {
    startY: yPos,
    head: [headers],
    body: tableData,
    theme: 'striped',
    headStyles: {
      fillColor: [30, 40, 117],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 9
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 45 }
    },
    margin: { left: 20, right: 20 }
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Best Performers Section
  if (yPos > pageHeight - 60) {
    doc.addPage();
    yPos = 20;
  }

  doc.setFontSize(14);
  doc.setTextColor(30, 40, 117);
  doc.setFont('helvetica', 'bold');
  doc.text('Investment Decision Helper', 20, yPos);

  yPos += 10;

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
    ['Best for Cash Flow', bestCashFlow.name || `Property ${bestCashFlow.index + 1}`, formatCurrency(bestCashFlow.value) + '/month'],
    ['Lowest Entry Cost', lowestInvestment.name || `Property ${lowestInvestment.index + 1}`, formatCurrency(lowestInvestment.value)],
    ['Best Net Yield', bestYield.name || `Property ${bestYield.index + 1}`, formatPercent(bestYield.value)],
  ];

  if (bestReturn) {
    summaryData.splice(1, 0, ['Best 5-Year Return', bestReturn.name || `Property ${bestReturn.index + 1}`, formatCurrency(bestReturn.value)]);
  }

  autoTable(doc, {
    startY: yPos,
    head: [['Category', 'Winner', 'Value']],
    body: summaryData,
    theme: 'grid',
    headStyles: {
      fillColor: [20, 184, 166],
      textColor: [255, 255, 255],
      fontSize: 10,
      fontStyle: 'bold'
    },
    bodyStyles: {
      fontSize: 9
    },
    columnStyles: {
      0: { fontStyle: 'bold', cellWidth: 50 },
      1: { cellWidth: 70 }
    },
    margin: { left: 20, right: 20 }
  });

  yPos = (doc as any).lastAutoTable.finalY + 15;

  // Notes Section (if any property has notes)
  if (analyses.some(a => a.notes)) {
    if (yPos > pageHeight - 60) {
      doc.addPage();
      yPos = 20;
    }

    doc.setFontSize(14);
    doc.setTextColor(30, 40, 117);
    doc.setFont('helvetica', 'bold');
    doc.text('Your Notes', 20, yPos);

    yPos += 10;

    analyses.forEach((analysis, idx) => {
      if (analysis.notes) {
        if (yPos > pageHeight - 40) {
          doc.addPage();
          yPos = 20;
        }

        doc.setFontSize(11);
        doc.setTextColor(30, 40, 117);
        doc.setFont('helvetica', 'bold');
        doc.text(`Property ${idx + 1}: ${analysis.property_name || 'Unnamed Property'}`, 20, yPos);

        yPos += 6;

        doc.setFontSize(9);
        doc.setTextColor(60, 60, 60);
        doc.setFont('helvetica', 'normal');
        const splitNotes = doc.splitTextToSize(analysis.notes, pageWidth - 40);
        doc.text(splitNotes, 20, yPos);
        
        yPos += splitNotes.length * 4 + 8;
      }
    });
  }

  // Footer
  const totalPages = (doc as any).internal.pages.length - 1;
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(128, 128, 128);
    doc.text(
      `Page ${i} of ${totalPages}`,
      pageWidth / 2,
      pageHeight - 10,
      { align: 'center' }
    );
    doc.text(
      'www.yieldpulse.ae',
      pageWidth - 20,
      pageHeight - 10,
      { align: 'right' }
    );
  }

  // Download
  const propertyNames = analyses.map(a => a.property_name || 'Property').join('_vs_');
  const fileName = `YieldPulse_Comparison_${propertyNames.substring(0, 50)}_${new Date().toISOString().split('T')[0]}.pdf`;
  doc.save(fileName);
}
