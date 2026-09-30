import {
  Document,
  Packer,
  Paragraph,
  TextRun,
  AlignmentType,
  Table,
  TableRow,
  TableCell,
  WidthType,
  BorderStyle,
} from 'docx';
import { Party } from '../types';

export async function exportToDocx(
  title?: string,
  content?: string,
  parties: Party[] = [],
  effectiveDate?: string
): Promise<void> {
  const safeTitle = (title || 'LEGAL AGREEMENT').trim();
  const safeContent = (content || '').trim();
  const safeParties = Array.isArray(parties) && parties.length > 0 ? parties : [
    { id: 'p1', role: 'First Party', name: 'Party One' },
    { id: 'p2', role: 'Second Party', name: 'Party Two' }
  ];
  const safeDate = effectiveDate || new Date().toISOString().split('T')[0];

  // Strip any raw trailing signature text to avoid duplication
  const cleanBody = safeContent.split(/\[SIGNATURE PAGE FOLLOWS\]|IN WITNESS WHEREOF/i)[0].trim();
  const lines = cleanBody.split('\n');

  const paragraphs: (Paragraph | Table)[] = [];

  // Header Title
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { before: 200, after: 300 },
      children: [
        new TextRun({
          text: safeTitle,
          bold: true,
          size: 32, // 16pt
          font: 'Times New Roman',
          allCaps: true,
        }),
      ],
    })
  );

  // Subtitle Effective Date
  paragraphs.push(
    new Paragraph({
      alignment: AlignmentType.CENTER,
      spacing: { after: 400 },
      children: [
        new TextRun({
          text: `Effective Date: ${safeDate}`,
          italics: true,
          size: 22, // 11pt
          font: 'Times New Roman',
          color: '555555',
        }),
      ],
    })
  );

  // Parse lines into paragraphs
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) {
      paragraphs.push(new Paragraph({ spacing: { after: 120 } }));
      continue;
    }

    if (
      trimmed.startsWith('SECTION ') ||
      trimmed.startsWith('ARTICLE ') ||
      trimmed.startsWith('PARTIES:') ||
      trimmed.startsWith('RECITALS')
    ) {
      paragraphs.push(
        new Paragraph({
          spacing: { before: 240, after: 120 },
          children: [
            new TextRun({
              text: trimmed,
              bold: true,
              size: 24, // 12pt
              font: 'Times New Roman',
            }),
          ],
        })
      );
    } else {
      paragraphs.push(
        new Paragraph({
          spacing: { after: 140 },
          alignment: AlignmentType.JUSTIFIED,
          children: [
            new TextRun({
              text: trimmed,
              size: 22, // 11pt
              font: 'Times New Roman',
            }),
          ],
        })
      );
    }
  }

  // Witness statement before signature block
  paragraphs.push(
    new Paragraph({
      spacing: { before: 400, after: 300 },
      children: [
        new TextRun({
          text: 'IN WITNESS WHEREOF, the Parties hereto have caused this Agreement to be duly executed and delivered by their authorized signatories as of the Effective Date.',
          italics: true,
          size: 22,
          font: 'Times New Roman',
        }),
      ],
    })
  );

  // Dynamic signature block table with lines for Name, Title, and Date
  const cells = safeParties.map(
    (party) => {
      const pName = party?.name || 'Party';
      const pRole = party?.role || 'Signatory';
      return new TableCell({
        width: {
          size: Math.floor(100 / Math.max(safeParties.length, 1)),
          type: WidthType.PERCENTAGE,
        },
        borders: {
          top: { style: BorderStyle.NONE },
          bottom: { style: BorderStyle.NONE },
          left: { style: BorderStyle.NONE },
          right: { style: BorderStyle.NONE },
        },
        children: [
          new Paragraph({
            spacing: { after: 200 },
            children: [
              new TextRun({
                text: `FOR: ${(pName || pRole).toUpperCase()}`,
                bold: true,
                size: 22,
                font: 'Times New Roman',
              }),
              new TextRun({
                text: ` (${pRole})`,
                size: 20,
                italics: true,
                font: 'Times New Roman',
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'By:       _________________________________',
                font: 'Times New Roman',
                size: 22,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: `Name:   ${pName || '_________________________________'}`,
                font: 'Times New Roman',
                size: 22,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 120 },
            children: [
              new TextRun({
                text: 'Title:     Authorized Signatory',
                font: 'Times New Roman',
                size: 22,
              }),
            ],
          }),
          new Paragraph({
            spacing: { after: 240 },
            children: [
              new TextRun({
                text: `Date:     ${safeDate}`,
                font: 'Times New Roman',
                size: 22,
              }),
            ],
          }),
        ],
      });
    }
  );

  paragraphs.push(
    new Table({
      rows: [new TableRow({ children: cells })],
      width: { size: 100, type: WidthType.PERCENTAGE },
    })
  );

  // Create document
  const doc = new Document({
    sections: [
      {
        properties: {
          page: {
            margin: {
              top: 1440, // 1 inch
              right: 1440,
              bottom: 1440,
              left: 1440,
            },
          },
        },
        children: paragraphs,
      },
    ],
  });

  // Generate blob & trigger download
  const blob = await Packer.toBlob(doc);
  const cleanFilename = `${safeTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.docx`;
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.download = cleanFilename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(downloadUrl);
}

export function exportToTxt(
  title?: string,
  content?: string,
  parties: Party[] = [],
  effectiveDate?: string
): void {
  const safeTitle = (title || 'LEGAL AGREEMENT').trim();
  let fullText = (content || '').trim();
  const safeDate = effectiveDate || new Date().toISOString().split('T')[0];
  const safeParties = Array.isArray(parties) && parties.length > 0 ? parties : [];
  const cleanFilename = `${safeTitle.toLowerCase().replace(/[^a-z0-9]+/g, '-')}.txt`;

  // Append signature lines if not already present
  if (safeParties.length > 0 && !fullText.includes('IN WITNESS WHEREOF')) {
    fullText += '\n\nIN WITNESS WHEREOF, the Parties hereto have caused this Agreement to be duly executed as of the Effective Date.\n\n';
    safeParties.forEach((party) => {
      const pName = party?.name || 'Party';
      const pRole = party?.role || 'Signatory';
      fullText += `FOR: ${(pName || pRole).toUpperCase()} (${pRole})\n`;
      fullText += 'By:    _______________________________________\n';
      fullText += `Name:  ${pName || '_______________________________________'}\n`;
      fullText += 'Title: Authorized Signatory\n';
      fullText += `Date:  ${safeDate}\n\n`;
    });
  }

  const blob = new Blob([fullText], { type: 'text/plain;charset=utf-8' });
  const downloadUrl = URL.createObjectURL(blob);
  const anchor = document.createElement('a');
  anchor.href = downloadUrl;
  anchor.download = cleanFilename;
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(downloadUrl);
}

export function printDocument(): void {
  try {
    window.print();
  } catch (err) {
    console.warn('Browser print invocation notice:', err);
  }
}
