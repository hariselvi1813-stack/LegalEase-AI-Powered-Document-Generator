import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { createServer as createViteServer } from 'vite';
import { GoogleGenAI } from '@google/genai';
import { DOCUMENT_PRESETS, generateFallbackLegalDocument } from './src/templates';

dotenv.config();

// Global crash handlers to prevent node process termination
process.on('unhandledRejection', (reason, promise) => {
  console.error('Unhandled Rejection observed (handled safely):', reason);
});

process.on('uncaughtException', (err) => {
  console.error('Uncaught Exception caught (process guarded):', err);
});

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const isProduction = process.env.NODE_ENV === 'production';
const PORT = process.env.PORT || 3000;

// Dynamic AI client getter to pick up current env keys seamlessly
function getAiClient(): GoogleGenAI | null {
  const apiKey = process.env.GEMINI_API_KEY || process.env.API_KEY;
  if (!apiKey || apiKey === 'MY_GEMINI_API_KEY') {
    return null;
  }
  try {
    return new GoogleGenAI({
      apiKey,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    });
  } catch (err) {
    console.error('Failed to initialize GoogleGenAI client (safe fallback engaged):', err);
    return null;
  }
}

async function startServer() {
  const app = express();

  // Basic middleware
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // CORS headers for flexible frontend/backend setup
  app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }
    next();
  });

  // Health check endpoint
  app.get('/api/health', (req, res) => {
    const ai = getAiClient();
    res.json({
      status: 'healthy',
      service: 'LegalEase Backend API',
      aiAvailable: Boolean(ai),
      timestamp: new Date().toISOString(),
    });
  });

  // Presets endpoint
  app.get('/api/presets', (req, res) => {
    res.json({
      success: true,
      presets: DOCUMENT_PRESETS,
    });
  });

  // Generate Document API contract
  app.post(['/api/generate-document', '/api/generate'], async (req, res) => {
    const ai = getAiClient();
    try {
      const {
        documentType = 'NDA',
        customTitle,
        parties = [],
        terms = [],
        effectiveDate = new Date().toISOString().split('T')[0],
        jurisdiction = 'State of Delaware',
        specialInstructions = '',
        isDemo = false,
      } = req.body || {};

      // Ensure at least two parties exist with safe default values if empty
      const normalizedParties =
        Array.isArray(parties) && parties.length >= 2
          ? parties
          : [
              {
                id: 'p1',
                role: 'First Party',
                name: parties[0]?.name || 'Disclosing Party Inc.',
                address: parties[0]?.address || '100 Legal Way, Suite 100',
              },
              {
                id: 'p2',
                role: 'Second Party',
                name: parties[1]?.name || 'Receiving Party LLC',
                address: parties[1]?.address || '200 Commercial Blvd',
              },
            ];

      const cleanTerms =
        Array.isArray(terms) && terms.length > 0
          ? terms
          : [
              'Confidentiality shall be maintained in accordance with standard commercial practices.',
              'Governed by the applicable jurisdiction and laws.',
            ];

      // If requested in Demo mode or if AI client is not available, use deterministic legal engine
      if (isDemo || !ai) {
        const fallback = generateFallbackLegalDocument(
          documentType,
          normalizedParties,
          cleanTerms,
          effectiveDate,
          jurisdiction,
          customTitle
        );
        return res.json({
          success: true,
          document: {
            title: fallback.title,
            documentType,
            content: fallback.content,
            summary: fallback.summary,
            parties: normalizedParties,
            effectiveDate,
            jurisdiction,
            termsIncluded: cleanTerms,
            generatedAt: new Date().toISOString(),
            isAiGenerated: false,
            isDemo: Boolean(isDemo),
          },
        });
      }

      // If AI client is available, draft with Gemini
      const partyDescriptions = normalizedParties
        .map(
          (p, i) =>
            `Party ${i + 1}: ${p.name || p.role} (Role: "${p.role}", Address: "${p.address || 'Address on file'}")`
        )
        .join('\n');

      const termsList = cleanTerms.map((t, i) => `${i + 1}. ${t}`).join('\n');

      const prompt = `You are an expert contract attorney and legal drafter. 
Draft a complete, comprehensive, legally binding, and enforceable ${documentType} in formal legal contract format.

Document Specifics:
- Document Type: ${documentType}
- Specific Title: ${customTitle || documentType.toUpperCase()}
- Effective Date: ${effectiveDate}
- Governing Jurisdiction: ${jurisdiction}

Parties:
${partyDescriptions}

Key Operative Terms & Clauses to Incorporate (make each term a comprehensive, legally sound clause with clear covenants, remedies, and boundaries):
${termsList}

${specialInstructions ? `Additional Special Instructions:\n${specialInstructions}\n` : ''}

Drafting Requirements:
1. Output ONLY the complete legal contract text without conversational preface, introduction, markdown quotes, or concluding conversational notes.
2. Structure must include:
   - Centered formal Title in ALL CAPS
   - Introductory preamble identifying Effective Date and Parties
   - Recitals (WHEREAS clauses and WITNESSETH)
   - Numbered Sections (SECTION 1. DEFINITIONS, SECTION 2. OPERATIVE PROVISIONS, up to GENERAL PROVISIONS)
   - Every single listed key operative term must be represented as a full, articulate contractual section
   - Standard legal boilerplate: Governing Law & Jurisdiction (${jurisdiction}), Severability, Entire Agreement, Amendments, Counterparts, Notices
   - Full signature execution block at the end with lines for Signatures, Printed Names, Titles, and Dates for each party.
3. Use authoritative, precise, court-tested legal language.`;

      let generatedContent = '';
      // Models to try
      const modelsToTry = ['gemini-2.5-flash', 'gemini-flash-latest'];
      let lastAiError: any = null;

      for (const modelName of modelsToTry) {
        try {
          const aiPromise = ai.models.generateContent({
            model: modelName,
            contents: prompt,
            config: {
              systemInstruction:
                'You are a senior contract partner at a top commercial law firm. You generate complete, flawless, and enforceable legal documents in formal legal contractual syntax without conversational filler.',
            },
          });

          const timeoutPromise = new Promise<never>((_, reject) =>
            setTimeout(() => reject(new Error('AI generation timed out')), 12000)
          );

          const response: any = await Promise.race([aiPromise, timeoutPromise]);
          const candidateText = response?.text?.trim();
          if (candidateText && candidateText.length > 100) {
            generatedContent = candidateText;
            break;
          }
        } catch (modelErr: any) {
          lastAiError = modelErr;
          console.warn(`Model ${modelName} call issue:`, modelErr.message);
        }
      }

      if (!generatedContent) {
        throw lastAiError || new Error('Incomplete response received from legal model.');
      }

      const title = customTitle?.trim() || `${documentType.toUpperCase()} AGREEMENT`;
      const summary = `Executed between ${normalizedParties[0].name} (${normalizedParties[0].role}) and ${normalizedParties[1].name} (${normalizedParties[1].role}), effective ${effectiveDate}. Incorporates ${cleanTerms.length} core operative terms under ${jurisdiction}.`;

      return res.json({
        success: true,
        document: {
          title,
          documentType,
          content: generatedContent,
          summary,
          parties: normalizedParties,
          effectiveDate,
          jurisdiction,
          termsIncluded: cleanTerms,
          generatedAt: new Date().toISOString(),
          isAiGenerated: true,
          isDemo: false,
        },
      });
    } catch (err: any) {
      console.warn(
        'AI generation encountered an issue, gracefully falling back to deterministic legal drafting engine:',
        err.message
      );

      // Graceful fallback to rich deterministic template
      const {
        documentType = 'NDA',
        customTitle,
        parties = [],
        terms = [],
        effectiveDate = new Date().toISOString().split('T')[0],
        jurisdiction = 'State of Delaware',
      } = req.body || {};

      const normalizedParties =
        Array.isArray(parties) && parties.length >= 2
          ? parties
          : [
              {
                id: 'p1',
                role: 'First Party',
                name: parties[0]?.name || 'Party One Inc.',
                address: 'Address on file',
              },
              {
                id: 'p2',
                role: 'Second Party',
                name: parties[1]?.name || 'Party Two LLC',
                address: 'Address on file',
              },
            ];

      const cleanTerms =
        Array.isArray(terms) && terms.length > 0
          ? terms
          : [
              'Mutual confidentiality covenant',
              'Delaware jurisdiction & severability',
            ];

      const fallback = generateFallbackLegalDocument(
        documentType,
        normalizedParties,
        cleanTerms,
        effectiveDate,
        jurisdiction,
        customTitle
      );

      return res.json({
        success: true,
        document: {
          title: fallback.title,
          documentType,
          content: fallback.content,
          summary: fallback.summary,
          parties: normalizedParties,
          effectiveDate,
          jurisdiction,
          termsIncluded: cleanTerms,
          generatedAt: new Date().toISOString(),
          isAiGenerated: false,
          isDemo: false,
        },
        message: 'Generated using verified legal standard drafting engine.',
      });
    }
  });

  // Global error handling middleware to catch any unhandled Express errors
  app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
    console.error('Handled server express error:', err?.message || err);
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        error: 'Internal server error handled safely',
        message: err?.message || 'Unexpected server error',
      });
    }
  });

  // Vite middleware in development; static serving in production
  if (!isProduction) {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  } else {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
  }

  app.listen(PORT, () => {
    console.log(`LegalEase Server listening on port ${PORT} [production: ${isProduction}]`);
  });
}

startServer().catch((err) => {
  console.error('Fatal error starting LegalEase server:', err);
  process.exit(1);
});
