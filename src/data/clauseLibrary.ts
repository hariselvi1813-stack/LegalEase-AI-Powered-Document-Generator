export interface BoilerplateClause {
  id: string;
  title: string;
  category: 'Boilerplate' | 'Risk & Liability' | 'Dispute & Law' | 'Covenants' | 'Execution';
  description: string;
  text: string;
  tags: string[];
}

export const CLAUSE_LIBRARY: BoilerplateClause[] = [
  {
    id: 'force-majeure',
    title: 'Force Majeure',
    category: 'Boilerplate',
    description: 'Excuses performance delay or non-performance caused by unforeseeable events beyond reasonable control.',
    tags: ['act of god', 'disaster', 'pandemic', 'delay', 'excuse'],
    text: `SECTION. FORCE MAJEURE
Neither Party shall be liable or responsible to the other Party, nor be deemed to have defaulted under or breached this Agreement, for any failure or delay in fulfilling or performing any term of this Agreement, when and to the extent such failure or delay is caused by or results from acts of God, flood, fire, earthquake, explosion, war, hostilities, terrorist threats or acts, riot, strikes or labor disputes, epidemics, pandemics, government emergency orders or regulations, or other events beyond the reasonable control of the impacted Party ("Force Majeure Event"). The impacted Party shall promptly give written notice to the other Party stating the period of time the occurrence is expected to continue and shall use diligent efforts to end the failure or delay and minimize the effects of such Force Majeure Event.`,
  },
  {
    id: 'governing-law',
    title: 'Governing Law and Jurisdiction',
    category: 'Dispute & Law',
    description: 'Specifies which state or sovereign law governs contract interpretation and selects exclusive court venue.',
    tags: ['jurisdiction', 'court', 'venue', 'applicable law'],
    text: `SECTION. GOVERNING LAW AND EXCLUSIVE VENUE
This Agreement, and all claims or causes of action (whether in contract, tort, or statute) that may be based upon, arise out of, or relate to this Agreement, shall be governed by, and enforced in accordance with, the internal laws of the designated Governing Jurisdiction, without giving effect to any choice of law or conflict of law rules or provisions. Each Party irrevocably submits to the exclusive personal jurisdiction and venue of the federal and state courts located within the designated jurisdiction for any action or proceeding arising out of or relating to this Agreement.`,
  },
  {
    id: 'indemnification',
    title: 'Indemnification & Hold Harmless',
    category: 'Risk & Liability',
    description: 'Obligates one party to compensate and defend the other against third-party claims, damages, and legal costs.',
    tags: ['indemnity', 'damages', 'defense', 'hold harmless', 'liability'],
    text: `SECTION. INDEMNIFICATION
Each Party (the "Indemnifying Party") agrees to defend, indemnify, and hold harmless the other Party, its affiliates, and their respective officers, directors, employees, agents, successors, and permitted assigns (collectively, the "Indemnified Parties") from and against any and all losses, damages, liabilities, deficiencies, claims, actions, judgments, settlements, interest, awards, penalties, fines, costs, or expenses of whatever kind, including reasonable attorneys' fees, arising out of or resulting from any third-party claim alleging: (a) a material breach of any representation, warranty, or covenant made by the Indemnifying Party in this Agreement; (b) gross negligence, willful misconduct, or fraud of the Indemnifying Party; or (c) violation of applicable laws by the Indemnifying Party in connection with its obligations hereunder.`,
  },
  {
    id: 'severability',
    title: 'Severability',
    category: 'Boilerplate',
    description: 'Ensures the remainder of the agreement stays legally effective if any particular provision is held invalid.',
    tags: ['invalidity', 'enforceability', 'reformation'],
    text: `SECTION. SEVERABILITY
If any term or provision of this Agreement is held to be invalid, illegal, or unenforceable in any jurisdiction, such invalidity, illegality, or unenforceability shall not affect any other term or provision of this Agreement or invalidate or render unenforceable such term or provision in any other jurisdiction. Upon such determination that any term or provision is invalid, illegal, or unenforceable, the Parties shall negotiate in good faith to modify this Agreement so as to effect the original intent of the Parties as closely as possible in a mutually acceptable manner.`,
  },
  {
    id: 'entire-agreement',
    title: 'Entire Agreement (Merger Clause)',
    category: 'Boilerplate',
    description: 'States this written instrument supersedes all prior verbal or written discussions, negotiations, and understandings.',
    tags: ['integration', 'merger', 'supersede', 'oral agreements'],
    text: `SECTION. ENTIRE AGREEMENT
This Agreement, together with any exhibits, schedules, and attachments hereto, constitutes the sole and entire agreement of the Parties with respect to the subject matter contained herein, and supersedes all prior and contemporaneous understandings, representations, warranties, and agreements, both written and oral, with respect to such subject matter. No amendment to or modification of this Agreement is effective unless it is in writing and signed by an authorized representative of each Party.`,
  },
  {
    id: 'limitation-of-liability',
    title: 'Limitation of Liability & Consequential Damages Waiver',
    category: 'Risk & Liability',
    description: 'Caps monetary exposure and disclaims indirect, punitive, special, or consequential damages.',
    tags: ['damages cap', 'consequential', 'loss of profits', 'cap'],
    text: `SECTION. LIMITATION OF LIABILITY
TO THE MAXIMUM EXTENT PERMITTED BY APPLICABLE LAW, IN NO EVENT SHALL EITHER PARTY BE LIABLE TO THE OTHER PARTY FOR ANY INDIRECT, INCIDENTAL, CONSEQUENTIAL, SPECIAL, PUNITIVE, OR EXEMPLARY DAMAGES, INCLUDING BUT NOT LIMITED TO DAMAGES FOR LOSS OF PROFITS, REVENUE, DATA, OR USE, WHETHER INCURRED IN CONTRACT, TORT, OR UNDER ANY OTHER THEORY OF LIABILITY, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGES. EXCEPT FOR INDEMNIFICATION OBLIGATIONS AND BREACHES OF CONFIDENTIALITY, EACH PARTY'S TOTAL AGGREGATE LIABILITY ARISING OUT OF OR RELATED TO THIS AGREEMENT SHALL BE LIMITED TO THE AMOUNTS ACTUALLY PAID OR PAYABLE UNDER THIS AGREEMENT IN THE TWELVE (12) MONTHS PRECEDING THE CLAIM.`,
  },
  {
    id: 'confidentiality',
    title: 'Confidentiality and Non-Disclosure',
    category: 'Covenants',
    description: 'Restricts disclosure and unauthorized use of proprietary commercial information and technical data.',
    tags: ['nda', 'secrets', 'proprietary', 'non-disclosure'],
    text: `SECTION. CONFIDENTIALITY
Each Party acknowledges that it may receive or have access to confidential, proprietary, or non-public information of the other Party ("Confidential Information"). The receiving Party agrees to: (a) protect the disclosing Party's Confidential Information with the same degree of care that it uses to protect its own sensitive information, but not less than a reasonable degree of care; (b) not disclose Confidential Information to any third party except to its employees, legal counsel, and financial advisors who have a need to know and are bound by confidentiality covenants at least as restrictive as this Agreement; and (c) use Confidential Information solely to exercise its rights and perform its obligations under this Agreement. This covenant survives for a period of three (3) years following the termination or expiration of this Agreement.`,
  },
  {
    id: 'dispute-arbitration',
    title: 'Dispute Resolution & Binding Arbitration',
    category: 'Dispute & Law',
    description: 'Mandates informal negotiation and binding arbitration in lieu of lengthy, public court litigation.',
    tags: ['arbitration', 'mediation', 'adr', 'dispute', 'jams', 'aaa'],
    text: `SECTION. DISPUTE RESOLUTION AND BINDING ARBITRATION
In the event of any controversy, claim, or dispute arising out of or relating to this Agreement, the Parties shall first attempt in good faith to resolve the dispute informally through executive-level negotiations within thirty (30) days of written notice. If the dispute is not resolved through informal negotiations, it shall be finally settled by binding arbitration administered by the American Arbitration Association (AAA) in accordance with its Commercial Arbitration Rules then in effect. The arbitration shall be conducted by a single neutral arbitrator, in the English language, and judgment on the award rendered by the arbitrator may be entered in any court having jurisdiction thereof.`,
  },
  {
    id: 'non-solicitation',
    title: 'Non-Solicitation of Personnel',
    category: 'Covenants',
    description: 'Prohibits poaching, hiring, or soliciting employees or contractors of the other party during the term.',
    tags: ['poaching', 'employees', 'hiring', 'solicitation', 'recruiting'],
    text: `SECTION. NON-SOLICITATION
During the term of this Agreement and for a period of twelve (12) months following its expiration or termination for any reason, neither Party shall, directly or indirectly, solicit for employment, recruit, induce, or hire any person who is then an employee, contractor, or officer of the other Party with whom such Party had contact in connection with this Agreement, without obtaining prior express written approval from the other Party; provided, however, that general public job advertisements not specifically targeted at such individuals shall not constitute a violation of this provision.`,
  },
  {
    id: 'counterparts-electronic-sign',
    title: 'Counterparts and Electronic Signatures',
    category: 'Execution',
    description: 'Authorizes execution in counterparts and validates digital/PDF signatures under the ESIGN Act and UETA.',
    tags: ['docusign', 'pdf', 'counterparts', 'e-sign', 'execution'],
    text: `SECTION. COUNTERPARTS AND ELECTRONIC EXECUTION
This Agreement may be executed in multiple counterparts, each of which shall be deemed an original, but all of which together shall constitute one and the same instrument. A signed copy of this Agreement delivered by facsimile, email, PDF transmission, or electronically through an electronic signature verification platform (including DocuSign or Adobe Sign) shall be deemed to have the same legal validity, admissibility, and enforceability as delivery of an original ink signature, in accordance with the Electronic Signatures in Global and National Commerce Act (15 U.S.C. § 7001 et seq.) and applicable state electronic transaction acts.`,
  },
  {
    id: 'notices',
    title: 'Notices and Formal Communications',
    category: 'Boilerplate',
    description: 'Defines how formal legal notices, breaches, or termination notices must be officially communicated and deemed received.',
    tags: ['certified mail', 'formal notice', 'communication', 'address'],
    text: `SECTION. NOTICES
All notices, requests, consents, claims, demands, waivers, and other communications hereunder must be in writing and addressed to the Parties at the addresses set forth on the first page of this Agreement (or to such other address as may be designated by the receiving Party from time to time in accordance with this Section). All notices shall be delivered by personal delivery, nationally recognized overnight courier (with all fees prepaid), certified or registered mail (return receipt requested, postage prepaid), or electronic mail with confirmation of transmission. Notices shall be deemed delivered upon receipt if by personal delivery or courier, or three (3) business days after mailing if by certified mail.`,
  },
  {
    id: 'waiver-jury-trial',
    title: 'Waiver of Jury Trial',
    category: 'Dispute & Law',
    description: 'Both parties knowingly and voluntarily waive their constitutional right to a jury trial for any litigation.',
    tags: ['jury', 'waiver', 'trial', 'bench trial', 'court'],
    text: `SECTION. WAIVER OF JURY TRIAL
EACH PARTY HERETO HEREBY IRREVOCABLY WAIVES, TO THE FULLEST EXTENT PERMITTED BY APPLICABLE LAW, ANY RIGHT IT MAY HAVE TO A TRIAL BY JURY IN ANY LEGAL PROCEEDING DIRECTLY OR INDIRECTLY ARISING OUT OF OR RELATING TO THIS AGREEMENT OR THE TRANSACTIONS CONTEMPLATED HEREBY (WHETHER BASED ON CONTRACT, TORT, OR ANY OTHER THEORY). EACH PARTY CERTIFIES AND ACKNOWLEDGES THAT IT HAS CONSIDERED THE IMPLICATIONS OF THIS WAIVER AND MAKES THIS WAIVER VOLUNTARILY.`,
  },
];
