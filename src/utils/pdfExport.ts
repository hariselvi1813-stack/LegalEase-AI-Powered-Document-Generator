import { jsPDF } from 'jspdf';
import { Party } from '../types';

export function exportToPdf(
  title?: string,
  content?: string,
  parties: Party[] = [],
  effectiveDate?: string
): void {
  const safeTitle = (title || 'LEGAL AGREEMENT').trim();
  const safeContent = (content || '').trim();
  const safeParties = Array.isArray(parties) && parties.length > 0 ? parties : [
    { id: 'p1', role: 'First Party', name: 'Party One' },
    { id: 'p2', role: 'Second Party', name: 'Party Two' }
  ];
  const safeDate = effectiveDate || new Date().toISOString().split('T')[0];

  // Letter size in points: 612 x 792 pt (8.5 x 11 in)
  const doc = new jsPDF({
    unit: 'pt',
    format: 'letter',
    orientation: 'portrait',
  });

  const pageWidth = 612;
  const pageHeight = 792;
  const marginX = 54; // 0.75 in
  const marginY = 54;
  const contentWidth = pageWidth - marginX * 2; // 504 pt
  const maxContentY = pageHeight - marginY;
  let cursorY = marginY;

  const checkPageBreak = (neededHeight: number) => {
    if (cursorY + neededHeight > maxContentY) {
      doc.addPage();
      cursorY = marginY;
      return true;
    }
    return false;
  };

  // 1. Header: Subtitle
  doc.setFont('times', 'bold');
  doc.setFontSize(9);
  doc.setTextColor(100, 100, 100);
  doc.text('FORMAL CONTRACTUAL INSTRUMENT - LEGALEASE STUDIO', pageWidth / 2, cursorY, {
    align: 'center',
  });
  cursorY += 18;

  // 2. Main Title
  doc.setFont('times', 'bold');
  doc.setFontSize(16);
  doc.setTextColor(0, 0, 0);
  const titleLines = doc.splitTextToSize(safeTitle.toUpperCase(), contentWidth);
  titleLines.forEach((line: string) => {
    doc.text(line, pageWidth / 2, cursorY, { align: 'center' });
    cursorY += 20;
  });

  // 3. Metadata line
  cursorY += 4;
  doc.setFont('times', 'italic');
  doc.setFontSize(10);
  doc.setTextColor(80, 80, 80);
  doc.text(
    `Effective Date: ${safeDate}       Parties: ${safeParties.length}`,
    pageWidth / 2,
    cursorY,
    { align: 'center' }
  );
  cursorY += 14;

  // Horizontal divider rule
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1.5);
  doc.line(marginX, cursorY, marginX + contentWidth, cursorY);
  cursorY += 22;

  // 4. Body Content
  // Strip trailing raw signature markers if present to avoid duplication
  const cleanBody = safeContent
    .split(/\[SIGNATURE PAGE FOLLOWS\]|IN WITNESS WHEREOF/i)[0]
    .trim();

  const paragraphs = cleanBody.split('\n');
  paragraphs.forEach((rawPara) => {
    const trimmed = rawPara.trim();
    if (!trimmed) {
      cursorY += 10;
      return;
    }

    const isHeading =
      trimmed.startsWith('SECTION ') ||
      trimmed.startsWith('ARTICLE ') ||
      trimmed.startsWith('PARTIES:') ||
      trimmed.startsWith('RECITALS') ||
      trimmed.startsWith('NOW, THEREFORE') ||
      trimmed.startsWith('GENERAL PROVISIONS');

    if (isHeading) {
      checkPageBreak(36);
      cursorY += 10;
      doc.setFont('times', 'bold');
      doc.setFontSize(11);
      doc.setTextColor(0, 0, 0);
      const headingLines = doc.splitTextToSize(trimmed, contentWidth);
      headingLines.forEach((line: string) => {
        doc.text(line, marginX, cursorY);
        cursorY += 15;
      });
      cursorY += 4;
    } else {
      doc.setFont('times', 'normal');
      doc.setFontSize(10);
      doc.setTextColor(20, 20, 20);
      const bodyLines = doc.splitTextToSize(trimmed, contentWidth);
      bodyLines.forEach((line: string) => {
        checkPageBreak(14);
        doc.text(line, marginX, cursorY);
        cursorY += 14;
      });
      cursorY += 6;
    }
  });

  // 5. SIGNATURE BLOCK SECTION
  // Ensure enough room for witness statement and signature blocks (needs ~220 pt)
  if (cursorY + 220 > maxContentY) {
    doc.addPage();
    cursorY = marginY;
  } else {
    cursorY += 20;
  }

  // Top border for signature section
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1);
  doc.line(marginX, cursorY, marginX + contentWidth, cursorY);
  cursorY += 18;

  // Witness statement
  doc.setFont('times', 'italic');
  doc.setFontSize(9.5);
  doc.setTextColor(50, 50, 50);
  const witnessText =
    'IN WITNESS WHEREOF, the Parties hereto have caused this Agreement to be duly executed and delivered by their respective authorized signatories as of the Effective Date written above.';
  const witnessLines = doc.splitTextToSize(witnessText, contentWidth);
  witnessLines.forEach((line: string) => {
    doc.text(line, marginX, cursorY);
    cursorY += 13;
  });
  cursorY += 20;

  // Render party signature blocks
  if (safeParties.length === 2) {
    checkPageBreak(160);
    const colWidth = (contentWidth - 40) / 2;
    const leftX = marginX;
    const rightX = marginX + colWidth + 40;
    const partyYStart = cursorY;

    // Party 1
    renderPartySignBlock(doc, safeParties[0], leftX, partyYStart, colWidth, safeDate);
    // Party 2
    renderPartySignBlock(doc, safeParties[1], rightX, partyYStart, colWidth, safeDate);
    cursorY += 160;
  } else {
    safeParties.forEach((party) => {
      checkPageBreak(150);
      renderPartySignBlock(doc, party, marginX, cursorY, contentWidth * 0.75, safeDate);
      cursorY += 150;
    });
  }

  // Footer text on each page
  try {
    const totalPages = (doc as any).internal.getNumberOfPages();
    for (let i = 1; i <= totalPages; i++) {
      doc.setPage(i);
      doc.setFont('times', 'normal');
      doc.setFontSize(8);
      doc.setTextColor(120, 120, 120);
      // Footer divider
      doc.setDrawColor(200, 200, 200);
      doc.setLineWidth(0.5);
      doc.line(marginX, pageHeight - 36, marginX + contentWidth, pageHeight - 36);
      doc.text('Executed Instrument - LegalEase Studio', marginX, pageHeight - 24);
      doc.text(`Page ${i} of ${totalPages}`, marginX + contentWidth, pageHeight - 24, {
        align: 'right',
      });
    }
  } catch (pageErr) {
    console.warn('Page numbering warning:', pageErr);
  }

  // Save PDF directly to user's computer
  const cleanFilename = `${safeTitle
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '') || 'legal-document'}.pdf`;
  doc.save(cleanFilename);
}

function renderPartySignBlock(
  doc: jsPDF,
  party: Party,
  x: number,
  y: number,
  width: number,
  effectiveDate: string
) {
  let curY = y;
  const pName = party?.name || 'Party';
  const pRole = party?.role || 'Signatory';

  // Party Header
  doc.setFont('times', 'bold');
  doc.setFontSize(10);
  doc.setTextColor(0, 0, 0);
  doc.text(`FOR: ${(pName || pRole).toUpperCase()}`, x, curY);
  curY += 13;

  doc.setFont('times', 'italic');
  doc.setFontSize(9);
  doc.setTextColor(80, 80, 80);
  doc.text(`(${pRole})`, x, curY);
  curY += 28;

  // Signature line "By:"
  doc.setFont('times', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(0, 0, 0);
  doc.text('By:', x, curY);

  // Line for signature
  doc.setDrawColor(0, 0, 0);
  doc.setLineWidth(1);
  doc.line(x + 28, curY, x + width, curY);
  curY += 12;

  doc.setFont('times', 'italic');
  doc.setFontSize(8);
  doc.setTextColor(110, 110, 110);
  doc.text('(Authorized Signature)', x + width, curY, { align: 'right' });
  curY += 16;

  // Name Line
  doc.setFont('times', 'normal');
  doc.setFontSize(9.5);
  doc.setTextColor(0, 0, 0);
  doc.text('Name:', x, curY);
  doc.setFont('times', 'bold');
  doc.text(pName || '__________________________________', x + 38, curY);
  doc.line(x + 38, curY + 2, x + width, curY + 2);
  curY += 22;

  // Title Line
  doc.setFont('times', 'normal');
  doc.setFontSize(9.5);
  doc.text('Title:', x, curY);
  doc.text('Authorized Signatory', x + 38, curY);
  doc.line(x + 38, curY + 2, x + width, curY + 2);
  curY += 22;

  // Date Line
  doc.setFont('times', 'normal');
  doc.setFontSize(9.5);
  doc.text('Date:', x, curY);
  doc.text(effectiveDate || '__________________________________', x + 38, curY);
  doc.line(x + 38, curY + 2, x + width, curY + 2);
}
