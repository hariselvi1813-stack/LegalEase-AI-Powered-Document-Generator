export type DocumentType =
  | 'NDA'
  | 'Employment Contract'
  | 'Lease Agreement'
  | 'Freelance Contract'
  | 'Custom';

export interface Party {
  id: string;
  role: string;
  name: string;
  address?: string;
  email?: string;
}

export interface GenerateDocumentRequest {
  documentType: DocumentType;
  customTitle?: string;
  parties: Party[];
  terms: string[];
  effectiveDate: string;
  jurisdiction?: string;
  specialInstructions?: string;
  isDemo?: boolean;
}

export interface GenerateDocumentResponse {
  success: boolean;
  document: {
    title: string;
    documentType: DocumentType;
    content: string;
    summary: string;
    parties: Party[];
    effectiveDate: string;
    jurisdiction?: string;
    termsIncluded: string[];
    generatedAt: string;
    isAiGenerated: boolean;
    isDemo?: boolean;
  };
  error?: string;
  message?: string;
}

export interface DocumentPreset {
  id: string;
  label: string;
  badge: string;
  documentType: DocumentType;
  customTitle: string;
  parties: Party[];
  terms: string[];
  jurisdiction: string;
  description: string;
}
