import { DocumentPreset, DocumentType, Party } from './types';

export const DOCUMENT_PRESETS: Record<DocumentType, DocumentPreset> = {
  NDA: {
    id: 'nda-preset',
    label: 'Mutual Non-Disclosure Agreement',
    badge: 'Popular',
    documentType: 'NDA',
    customTitle: 'MUTUAL NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT',
    parties: [
      {
        id: 'p1',
        role: 'Disclosing Party',
        name: 'Nexus Innovations Inc.',
        address: '100 Montgomery St, Suite 1400, San Francisco, CA 94104',
        email: 'legal@nexusinnovations.io',
      },
      {
        id: 'p2',
        role: 'Receiving Party',
        name: 'Vanguard Partners LLC',
        address: '450 Lexington Ave, 22nd Floor, New York, NY 10017',
        email: 'contracts@vanguardpartners.com',
      },
    ],
    terms: [
      'Confidential Information encompasses all technical data, trade secrets, software code, customer records, and product roadmaps.',
      'Receiving Party shall preserve confidentiality and exercise reasonable care for a term of three (3) years from disclosure.',
      'Exceptions apply to information publicly known through no breach, or independently developed without reference.',
      'Governed by and construed under the laws of the State of Delaware.',
      'Right to equitable injunctive relief without posting bond in the event of threatened or actual unauthorized disclosure.',
      'Return or certified permanent destruction of all confidential media within fourteen (14) days upon written request.',
    ],
    jurisdiction: 'State of Delaware',
    description: 'Bilateral protection of proprietary information, trade secrets, and trade discussions.',
  },
  'Employment Contract': {
    id: 'employment-preset',
    label: 'Executive Employment Agreement',
    badge: 'Standard',
    documentType: 'Employment Contract',
    customTitle: 'EMPLOYMENT AND COMPENSATION AGREEMENT',
    parties: [
      {
        id: 'p1',
        role: 'Employer',
        name: 'Aether Technologies Corp.',
        address: '500 Tech Parkway, Suite 300, Austin, TX 78701',
        email: 'hr@aethertech.com',
      },
      {
        id: 'p2',
        role: 'Employee',
        name: 'David R. Sterling',
        address: '2840 River Oaks Blvd, Austin, TX 78703',
        email: 'david.sterling@email.com',
      },
    ],
    terms: [
      'Title: Principal Solutions Architect with an annualized base compensation of $165,000 paid bi-weekly.',
      'Exempt full-time position requiring devotion of primary professional time and best efforts.',
      'At-will employment relationship terminable by either party with thirty (30) days prior written notice.',
      'Eligibility for comprehensive medical, dental, 401(k) matching up to 4%, and 20 days paid vacation annually.',
      'Invention assignment: all proprietary work product created within scope of employment belongs solely to Employer.',
      'Non-solicitation of clients and staff for twelve (12) months following termination of employment.',
    ],
    jurisdiction: 'State of Texas',
    description: 'Comprehensive agreement outlining compensation, duties, at-will status, IP, and non-solicitation.',
  },
  'Lease Agreement': {
    id: 'lease-preset',
    label: 'Residential Property Lease',
    badge: 'Real Estate',
    documentType: 'Lease Agreement',
    customTitle: 'RESIDENTIAL REAL PROPERTY LEASE AGREEMENT',
    parties: [
      {
        id: 'p1',
        role: 'Landlord',
        name: 'Highland Property Holdings LLC',
        address: '120 Beacon Street, Boston, MA 02116',
        email: 'management@highlandholdings.com',
      },
      {
        id: 'p2',
        role: 'Tenant',
        name: 'Sarah E. Jenkins',
        address: '42 Commonwealth Ave, Unit 3B, Boston, MA 02116',
        email: 'sjenkins@gmail.com',
      },
    ],
    terms: [
      'Leased Premises: 42 Commonwealth Avenue, Unit 3B, Boston, MA 02116.',
      'Fixed lease term of twelve (12) consecutive months commencing on Effective Date.',
      'Monthly rent of $2,850 payable on or before the 1st day of each calendar month.',
      'Security deposit in the amount of $2,850 held in an interest-bearing escrow account.',
      'No pets allowed on premises without Landlord prior written consent and executed pet addendum.',
      'Tenant is responsible for residential electric, gas, and internet utilities.',
      'Quiet enjoyment covenant with routine landlord inspection permissible upon 24 hours prior written notice.',
    ],
    jurisdiction: 'Commonwealth of Massachusetts',
    description: 'Standard residential lease covering tenancy term, rent, deposits, upkeep, and inspections.',
  },
  'Freelance Contract': {
    id: 'freelance-preset',
    label: 'Independent Contractor Agreement',
    badge: 'Services',
    documentType: 'Freelance Contract',
    customTitle: 'INDEPENDENT CONTRACTOR SERVICES AGREEMENT',
    parties: [
      {
        id: 'p1',
        role: 'Client',
        name: 'Horizon Digital Brands Inc.',
        address: '770 Broadway, Floor 8, New York, NY 10003',
        email: 'projects@horizondigital.com',
      },
      {
        id: 'p2',
        role: 'Contractor',
        name: 'Elena Rostova Studio LLC',
        address: '142 S 4th St, Brooklyn, NY 11211',
        email: 'elena@rostovastudio.design',
      },
    ],
    terms: [
      'Services Scope: UI/UX system design, Figma component architecture, and design tokens documentation.',
      'Project compensation: Flat fee of $7,500 payable in two equal tranches (50% deposit, 50% upon milestone delivery).',
      'Delivery schedule: Draft mockups within 14 calendar days; final deliverables within 30 days.',
      'Intellectual Property: Full ownership transfer of deliverables to Client upon receipt of final cleared payment.',
      'Independent contractor status: Contractor retains autonomy over hours, equipment, and methods.',
      'Two (2) iterative review and revision cycles included within the contracted project scope.',
    ],
    jurisdiction: 'State of New York',
    description: 'Independent contractor engagement defining milestones, payment tranches, IP handover, and revisions.',
  },
  Custom: {
    id: 'custom-preset',
    label: 'Custom Commercial Agreement',
    badge: 'Flexible',
    documentType: 'Custom',
    customTitle: 'GENERAL COMMERCIAL UNDERTAKING AGREEMENT',
    parties: [
      {
        id: 'p1',
        role: 'Party One',
        name: 'Sterling Capital Holdings LLC',
        address: '200 LaSalle St, Suite 1800, Chicago, IL 60604',
        email: 'legal@sterlingcapital.com',
      },
      {
        id: 'p2',
        role: 'Party Two',
        name: 'Apex Strategic Logistics Corp.',
        address: '880 Industrial Way, Indianapolis, IN 46241',
        email: 'ops@apexlogistics.com',
      },
    ],
    terms: [
      'Parties agree to collaborate on designated commercial milestones outlined in Schedule A.',
      'Each party bears its own out-of-pocket operational costs and overhead expenses.',
      'Neither party shall bind or commit the other without prior express written authorization.',
      'Mutual confidentiality maintained for all shared commercial correspondence.',
      'Agreement terminable by either party with thirty (30) days written notice without penalty.',
      'Disputes resolved through binding American Arbitration Association (AAA) commercial arbitration.',
    ],
    jurisdiction: 'State of Illinois',
    description: 'Versatile legal framework for bespoke business agreements, joint ventures, or covenants.',
  },
};

export const QUICK_SUGGESTED_TERMS: Record<DocumentType, string[]> = {
  NDA: [
    '3-year confidentiality survival period',
    'Delaware governing law and jurisdiction',
    'Injunctive relief without requirement of posting bond',
    'Immediate return or destruction of confidential materials',
    'Standard exclusions for public knowledge or court orders',
  ],
  'Employment Contract': [
    'At-will employment relationship',
    'Comprehensive health insurance & 401(k) matching',
    'Invention assignment to Employer',
    '12-month post-termination non-solicitation',
    '30-day written notice for voluntary resignation',
  ],
  'Lease Agreement': [
    '12-month fixed residential lease term',
    'Security deposit equal to one month rent',
    'No pets without prior written consent',
    'Tenant responsible for electric and gas utilities',
    '24 hours written notice for landlord maintenance entry',
  ],
  'Freelance Contract': [
    '50% deposit upfront, 50% on final milestone approval',
    'IP ownership assigns to Client upon final cleared payment',
    'Two rounds of revisions included',
    'Contractor retains portfolio showcase rights',
    'Independent contractor tax and withholding status',
  ],
  Custom: [
    'Governing law in mutual home jurisdiction',
    'Severability of invalid provisions',
    'Entire agreement supersedes prior understandings',
    'Binding arbitration under AAA rules',
    'Written amendments required to modify agreement',
  ],
};

/**
 * Builds a deterministic, highly polished legal document matching the exact
 * legal standards of a court-recognized contract.
 */
export function generateFallbackLegalDocument(
  docType: DocumentType,
  parties: Party[],
  terms: string[],
  effectiveDate: string,
  jurisdiction: string = 'State of Delaware',
  customTitle?: string
): { title: string; content: string; summary: string } {
  const p1 = parties[0] || { role: 'First Party', name: 'Party A', address: 'Registered Office' };
  const p2 = parties[1] || { role: 'Second Party', name: 'Party B', address: 'Registered Office' };

  const title =
    customTitle?.trim() ||
    (docType === 'NDA'
      ? 'MUTUAL NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT'
      : docType === 'Employment Contract'
      ? 'EXECUTIVE EMPLOYMENT AND SERVICES AGREEMENT'
      : docType === 'Lease Agreement'
      ? 'RESIDENTIAL PROPERTY LEASE AGREEMENT'
      : docType === 'Freelance Contract'
      ? 'INDEPENDENT CONTRACTOR MASTER SERVICES AGREEMENT'
      : 'GENERAL COMMERCIAL BINDING AGREEMENT');

  const termClauses =
    terms.length > 0
      ? terms
      : [
          'The parties agree to perform all obligations in good faith and in timely compliance with industry standards.',
          'All notices shall be delivered in writing to the addresses specified herein.',
          'Governed by and construed in accordance with the applicable state laws.',
        ];

  const formattedClauses = termClauses
    .map((term, index) => {
      const sectionNum = index + 3;
      // Derive clean clause title from first 3-5 words
      const words = term.split(' ');
      const rawHeader = words.slice(0, Math.min(4, words.length)).join(' ').toUpperCase().replace(/[^A-Z\s]/g, '');
      const header = rawHeader.length > 3 ? rawHeader : `OPERATIVE TERM ${index + 1}`;

      return `SECTION ${sectionNum}. ${header}
${sectionNum}.1 Specific Covenant. ${term}
${sectionNum}.2 Compliance & Duty. Each party agrees and covenants that the requirements set forth in this Section constitute material representations upon which both parties have relied in entering into this Agreement. Neither party shall willfully omit, delay, or undermine the fulfillment of these covenants.`;
    })
    .join('\n\n');

  const content = `${title}

THIS AGREEMENT (the "Agreement") is entered into and made effective as of ${effectiveDate || 'the date of mutual execution'} (the "Effective Date"), by and between:

PARTIES:
1. ${p1.name.toUpperCase()}, having its principal place of business or residence at ${p1.address || 'Address on file'} (hereinafter designated as the "${p1.role || 'Party 1'}" or "First Party"), and
2. ${p2.name.toUpperCase()}, having its principal place of business or residence at ${p2.address || 'Address on file'} (hereinafter designated as the "${p2.role || 'Party 2'}" or "Second Party").

(The foregoing entities may hereinafter individually be referred to as a "Party" and collectively as the "Parties".)

RECITALS (WITNESSETH):
WHEREAS, the Parties desire to formally establish their mutual understandings, representations, rights, and operational covenants in accordance with the specifications herein; and
WHEREAS, both Parties acknowledge that this Agreement represents a legally binding instrument entered into voluntarily for good and valuable consideration, the sufficiency and receipt of which are hereby mutually acknowledged;

NOW, THEREFORE, in consideration of the mutual covenants, premises, and promises hereinafter contained, the Parties hereby agree as follows:

SECTION 1. PURPOSE AND DEFINED TERMS
1.1 Intent. This Agreement sets forth the definitive terms governing the relationship between ${p1.name} and ${p2.name} in respect of the subject matter hereof.
1.2 Definitions. As utilized throughout this document:
    (a) "Confidential Information" shall denote proprietary data, technical designs, trade secrets, customer records, and internal business correspondence disclosed by either Party.
    (b) "Applicable Law" refers to the statutes, administrative codes, and common law precedents in force within the designated governing jurisdiction.

SECTION 2. TERM AND DURATION
2.1 Term. The term of this Agreement shall officially commence on the Effective Date (${effectiveDate || 'the date first written above'}) and shall persist in full force and effect until terminated in accordance with the specific termination provisions set forth herein or upon complete satisfaction of all obligations.
2.2 Survival. Any covenants, warranties, and obligations which by their nature are intended to outlast termination (including non-disclosure, indemnification, and dispute resolution) shall indefinitely survive termination.

${formattedClauses}

SECTION ${termClauses.length + 3}. GENERAL PROVISIONS & BOILERPLATE
${termClauses.length + 3}.1 Governing Law and Forum. This Agreement, and all claims or causes of action arising out of or relating to this Agreement, shall be governed by, enforced, and construed in accordance with the laws of the ${jurisdiction || 'State of Delaware'}, without giving effect to any choice of law principles.
${termClauses.length + 3}.2 Severability. If any provision of this Agreement is held to be invalid, illegal, or unenforceable by an arbitrator or court of competent jurisdiction, such invalidity shall not affect any other provision, and this Agreement shall be reformed to the minimum extent necessary to make it valid and enforceable.
${termClauses.length + 3}.3 Entire Agreement. This Agreement constitutes the complete, final, and exclusive understanding between the Parties regarding the subject matter hereof, superseding all prior or contemporaneous negotiations, drafts, warranties, representations, or collateral agreements.
${termClauses.length + 3}.4 Amendments. No modification, supplement, amendment, or waiver of any provision of this Agreement shall be valid or binding unless executed in writing by authorized representatives of both Parties.
${termClauses.length + 3}.5 Counterparts & Electronic Execution. This Agreement may be executed in two or more counterparts, each of which shall be deemed an original, but all of which together shall constitute one and the same instrument. Delivery of an executed counterpart via electronic signature or PDF transmission shall be legally binding and effective.

[SIGNATURE PAGE FOLLOWS]

IN WITNESS WHEREOF, the Parties hereto have caused this ${title} to be duly executed by their respective authorized signatories as of the Effective Date written above.

_______________________________________________
FOR: ${p1.name.toUpperCase()} (${p1.role})
By:       ____________________________________
Name:     ____________________________________
Title:    Authorized Representative / Principal
Date:     ${effectiveDate || '__________________'}

_______________________________________________
FOR: ${p2.name.toUpperCase()} (${p2.role})
By:       ____________________________________
Name:     ____________________________________
Title:    Authorized Representative / Principal
Date:     ${effectiveDate || '__________________'}
`;

  const summary = `Executed between ${p1.name} (${p1.role}) and ${p2.name} (${p2.role}), effective ${effectiveDate}. Incorporates ${termClauses.length} core operative covenants governed by the laws of ${jurisdiction}.`;

  return { title, content, summary };
}
