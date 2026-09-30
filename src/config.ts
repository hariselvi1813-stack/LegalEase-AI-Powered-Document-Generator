/**
 * LegalEase API Configuration
 * Base URL for the backend legal drafting service.
 * Configurable in this single constant. 
 * Default is "" which uses the co-located fullstack Express server endpoints (/api/generate-document).
 */
export const API_BASE_URL: string = '';

export const API_ENDPOINTS = {
  generateDocument: `${API_BASE_URL}/api/generate-document`,
  healthCheck: `${API_BASE_URL}/api/health`,
  presets: `${API_BASE_URL}/api/presets`,
};
