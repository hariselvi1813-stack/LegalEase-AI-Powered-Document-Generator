import React, { useState, useEffect, useCallback } from 'react';
import { Pill } from './components/Pill';
import { NavArrows } from './components/NavArrows';
import { DocumentForm } from './components/DocumentForm';
import { DocumentPreview } from './components/DocumentPreview';
import { SavedDraftsColumn, SavedDraft } from './components/SavedDraftsColumn';
import { DOCUMENT_PRESETS, generateFallbackLegalDocument } from './templates';
import { DocumentType, Party, GenerateDocumentResponse } from './types';
import { API_BASE_URL } from './config';
import {
  Sparkles,
  FileCheck2,
  Wifi,
  WifiOff,
  FolderClock,
  Save,
  Plus,
  Shield,
  Users,
  Download,
  ArrowRight,
  Scale,
  FileText,
} from 'lucide-react';

const PRESET_KEYS: DocumentType[] = [
  'NDA',
  'Employment Contract',
  'Lease Agreement',
  'Freelance Contract',
  'Custom',
];

const INITIAL_SAVED_DRAFTS: SavedDraft[] = [
  {
    id: 'draft-mutual-nda-01',
    title: 'Mutual Non-Disclosure Agreement (Nexus & Vertex)',
    documentType: 'NDA',
    customTitle: 'MUTUAL NON-DISCLOSURE AGREEMENT',
    parties: DOCUMENT_PRESETS.NDA.parties,
    terms: DOCUMENT_PRESETS.NDA.terms,
    effectiveDate: '2026-10-01',
    jurisdiction: 'State of Delaware',
    status: 'generated',
    summary: 'Standard bilateral non-disclosure agreement for technical evaluation with 3-year confidentiality and Delaware governing law.',
    content: generateFallbackLegalDocument(
      'NDA',
      DOCUMENT_PRESETS.NDA.parties,
      DOCUMENT_PRESETS.NDA.terms,
      '2026-10-01',
      'State of Delaware',
      'MUTUAL NON-DISCLOSURE AGREEMENT'
    ).content,
    updatedAt: new Date(Date.now() - 3600000 * 2).toISOString(),
  },
  {
    id: 'draft-lease-02',
    title: 'Residential Lease Agreement (Austin Downtown Loft)',
    documentType: 'Lease Agreement',
    customTitle: 'RESIDENTIAL LEASE AGREEMENT',
    parties: DOCUMENT_PRESETS['Lease Agreement'].parties,
    terms: DOCUMENT_PRESETS['Lease Agreement'].terms,
    effectiveDate: '2026-11-01',
    jurisdiction: 'State of Texas',
    status: 'draft',
    summary: '12-month fixed-term lease for residential property with quiet enjoyment clauses.',
    updatedAt: new Date(Date.now() - 3600000 * 24).toISOString(),
  },
  {
    id: 'draft-consultant-03',
    title: 'Senior Full-Stack Consultant SOW (Aurora Labs)',
    documentType: 'Freelance Contract',
    customTitle: 'CONSULTING SERVICES & WORK-FOR-HIRE AGREEMENT',
    parties: DOCUMENT_PRESETS['Freelance Contract'].parties,
    terms: DOCUMENT_PRESETS['Freelance Contract'].terms,
    effectiveDate: '2026-10-15',
    jurisdiction: 'State of California',
    status: 'draft',
    summary: 'Freelance technical consulting agreement with full IP assignment and bi-weekly milestone invoicing.',
    updatedAt: new Date(Date.now() - 3600000 * 48).toISOString(),
  },
];

export default function App() {
  // Saved Drafts State
  const [drafts, setDrafts] = useState<SavedDraft[]>(() => {
    try {
      const stored = localStorage.getItem('legalease_saved_drafts');
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          return parsed;
        }
      }
    } catch (e) {
      console.error('Error loading saved drafts from localStorage:', e);
    }
    return INITIAL_SAVED_DRAFTS;
  });

  const [activeDraftId, setActiveDraftId] = useState<string | null>('draft-mutual-nda-01');
  const [isDraftsColumnVisibleMobile, setIsDraftsColumnVisibleMobile] = useState<boolean>(false);

  // Sync drafts to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('legalease_saved_drafts', JSON.stringify(drafts));
    } catch (e) {
      console.error('Error persisting drafts to localStorage:', e);
    }
  }, [drafts]);

  // AI Studio Form State
  const [documentType, setDocumentType] = useState<DocumentType>('NDA');
  const [customTitle, setCustomTitle] = useState<string>(DOCUMENT_PRESETS.NDA.customTitle);
  const [parties, setParties] = useState<Party[]>(DOCUMENT_PRESETS.NDA.parties);
  const [terms, setTerms] = useState<string[]>(DOCUMENT_PRESETS.NDA.terms);
  const [effectiveDate, setEffectiveDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [jurisdiction, setJurisdiction] = useState<string>(DOCUMENT_PRESETS.NDA.jurisdiction);

  // Backend / Connection state
  const [isBackendHealthy, setIsBackendHealthy] = useState<boolean | null>(null);
  const [isDemoMode, setIsDemoMode] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Generation State
  const [isGenerating, setIsGenerating] = useState<boolean>(false);
  const [generationStep, setGenerationStep] = useState<string>('Drafting operative terms...');
  const [hasGenerated, setHasGenerated] = useState<boolean>(true);
  const [documentTitle, setDocumentTitle] = useState<string>(
    INITIAL_SAVED_DRAFTS[0].title
  );
  const [documentContent, setDocumentContent] = useState<string>(
    INITIAL_SAVED_DRAFTS[0].content || ''
  );
  const [documentSummary, setDocumentSummary] = useState<string>(
    INITIAL_SAVED_DRAFTS[0].summary || ''
  );
  const [originalDraft, setOriginalDraft] = useState<string>(
    INITIAL_SAVED_DRAFTS[0].content || ''
  );
  const [isAiGenerated, setIsAiGenerated] = useState<boolean>(false);

  const showToast = (message: string) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(null), 2200);
  };

  // Check health on mount
  useEffect(() => {
    const checkHealth = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/api/health`);
        setIsBackendHealthy(res.ok);
      } catch {
        setIsBackendHealthy(false);
      }
    };
    checkHealth();
  }, []);

  // Handle Preset Selection
  const handleSelectPreset = useCallback((type: DocumentType) => {
    setDocumentType(type);
    const preset = DOCUMENT_PRESETS[type];
    if (preset) {
      setCustomTitle(preset.customTitle);
      setParties(preset.parties);
      setTerms(preset.terms);
      setJurisdiction(preset.jurisdiction);
    }
  }, []);

  // Cycle Next Preset
  const handleNextPreset = useCallback(() => {
    const currentIndex = PRESET_KEYS.indexOf(documentType);
    const nextIndex = (currentIndex + 1) % PRESET_KEYS.length;
    handleSelectPreset(PRESET_KEYS[nextIndex]);
    showToast(`Loaded ${PRESET_KEYS[nextIndex]} Template`);
  }, [documentType, handleSelectPreset]);

  // Cycle Previous Preset
  const handlePrevPreset = useCallback(() => {
    const currentIndex = PRESET_KEYS.indexOf(documentType);
    const prevIndex = (currentIndex - 1 + PRESET_KEYS.length) % PRESET_KEYS.length;
    handleSelectPreset(PRESET_KEYS[prevIndex]);
    showToast(`Loaded ${PRESET_KEYS[prevIndex]} Template`);
  }, [documentType, handleSelectPreset]);

  // Reset to default NDA
  const handleResetPreset = useCallback(() => {
    handleSelectPreset('NDA');
    showToast('Reset to Mutual NDA Template');
  }, [handleSelectPreset]);

  // Handle Loading a Saved Draft
  const handleSelectDraft = (draft: SavedDraft) => {
    setActiveDraftId(draft.id);
    setDocumentType(draft.documentType);
    setCustomTitle(draft.customTitle);
    setParties(draft.parties);
    setTerms(draft.terms);
    setEffectiveDate(draft.effectiveDate);
    setJurisdiction(draft.jurisdiction);
    if (draft.content) {
      setDocumentTitle(draft.title);
      setDocumentContent(draft.content);
      setOriginalDraft(draft.content);
      setDocumentSummary(draft.summary || '');
      setHasGenerated(true);
    } else {
      setHasGenerated(false);
    }
    showToast(`Loaded "${draft.title.slice(0, 24)}..."`);
    setIsDraftsColumnVisibleMobile(false);

    if (draft.content) {
      setTimeout(() => {
        document.getElementById('document-preview-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    } else {
      setTimeout(() => {
        document.getElementById('document-form-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 150);
    }
  };

  // Save Current Form & Document as Draft
  const handleSaveCurrentAsDraft = () => {
    const currentTitle =
      hasGenerated && documentTitle
        ? documentTitle
        : customTitle || `${documentType} Agreement`;

    if (activeDraftId) {
      setDrafts((prev) =>
        prev.map((d) =>
          d.id === activeDraftId
            ? {
                ...d,
                title: currentTitle,
                documentType,
                customTitle,
                parties,
                terms,
                effectiveDate,
                jurisdiction,
                content: hasGenerated ? documentContent : d.content,
                summary: hasGenerated ? documentSummary : d.summary,
                status: hasGenerated ? 'generated' : 'draft',
                updatedAt: new Date().toISOString(),
              }
            : d
        )
      );
      showToast('Updated draft in saved items');
    } else {
      const newDraft: SavedDraft = {
        id: `draft-${Date.now()}`,
        title: currentTitle,
        documentType,
        customTitle,
        parties,
        terms,
        effectiveDate,
        jurisdiction,
        content: hasGenerated ? documentContent : undefined,
        summary: hasGenerated ? documentSummary : undefined,
        status: hasGenerated ? 'generated' : 'draft',
        updatedAt: new Date().toISOString(),
      };
      setDrafts((prev) => [newDraft, ...prev]);
      setActiveDraftId(newDraft.id);
      showToast('Saved new draft to column');
    }
  };

  // Create Brand New Blank Draft
  const handleCreateNewDraft = () => {
    handleSelectPreset('NDA');
    setActiveDraftId(null);
    setHasGenerated(false);
    setDocumentTitle('');
    setDocumentContent('');
    setDocumentSummary('');
    showToast('Started new document draft');
  };

  // Delete Draft
  const handleDeleteDraft = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setDrafts((prev) => prev.filter((d) => d.id !== id));
    if (activeDraftId === id) {
      setActiveDraftId(null);
    }
    showToast('Deleted draft');
  };

  // Duplicate Draft
  const handleDuplicateDraft = (draft: SavedDraft, e: React.MouseEvent) => {
    e.stopPropagation();
    const duplicated: SavedDraft = {
      ...draft,
      id: `draft-${Date.now()}`,
      title: `${draft.title} (Copy)`,
      updatedAt: new Date().toISOString(),
    };
    setDrafts((prev) => [duplicated, ...prev]);
    showToast('Duplicated draft item');
  };

  // Generate Document
  const handleGenerate = async () => {
    setIsGenerating(true);
    setGenerationStep('Analyzing contracting parties & legal roles...');

    const step1 = setTimeout(() => {
      setGenerationStep('Formulating operative covenants and obligations...');
    }, 800);

    const step2 = setTimeout(() => {
      setGenerationStep('Applying governing law boilerplate & dispute terms...');
    }, 1800);

    const step3 = setTimeout(() => {
      setGenerationStep('Assembling authentic execution instrument...');
    }, 2800);

    try {
      if (isDemoMode) {
        await new Promise((r) => setTimeout(r, 1000));
        const demoDoc = generateFallbackLegalDocument(
          documentType,
          parties,
          terms,
          effectiveDate,
          jurisdiction,
          customTitle
        );
        setDocumentTitle(demoDoc.title);
        setDocumentContent(demoDoc.content);
        setOriginalDraft(demoDoc.content);
        setDocumentSummary(demoDoc.summary);
        setIsAiGenerated(false);
        setHasGenerated(true);

        if (activeDraftId) {
          setDrafts((prev) =>
            prev.map((d) =>
              d.id === activeDraftId
                ? {
                    ...d,
                    title: demoDoc.title,
                    content: demoDoc.content,
                    summary: demoDoc.summary,
                    status: 'generated',
                    updatedAt: new Date().toISOString(),
                  }
                : d
            )
          );
        }
      } else {
        const endpoint = `${API_BASE_URL}/api/generate-document`;
        const payload = {
          documentType,
          customTitle,
          parties,
          terms,
          effectiveDate,
          jurisdiction,
        };

        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 12000);

        const response = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          signal: controller.signal,
        });
        clearTimeout(timeoutId);

        if (!response.ok) {
          throw new Error(`HTTP ${response.status}`);
        }

        const data: GenerateDocumentResponse = await response.json();
        if (data.success && data.document) {
          setDocumentTitle(data.document.title);
          setDocumentContent(data.document.content);
          setOriginalDraft(data.document.content);
          setDocumentSummary(data.document.summary);
          setIsAiGenerated(data.document.isAiGenerated);
          setHasGenerated(true);

          if (activeDraftId) {
            setDrafts((prev) =>
              prev.map((d) =>
                d.id === activeDraftId
                  ? {
                      ...d,
                      title: data.document?.title || d.title,
                      content: data.document?.content,
                      summary: data.document?.summary,
                      status: 'generated',
                      updatedAt: new Date().toISOString(),
                    }
                  : d
              )
            );
          }
        } else {
          throw new Error(data.error || 'Generation error');
        }
      }
    } catch (err: any) {
      console.warn('Backend notice, using verified legal drafting engine:', err.message);
      const fallback = generateFallbackLegalDocument(
        documentType,
        parties,
        terms,
        effectiveDate,
        jurisdiction,
        customTitle
      );
      setDocumentTitle(fallback.title);
      setDocumentContent(fallback.content);
      setOriginalDraft(fallback.content);
      setDocumentSummary(fallback.summary);
      setIsAiGenerated(false);
      setHasGenerated(true);
      showToast('Generated using standard legal template engine');
    } finally {
      clearTimeout(step1);
      clearTimeout(step2);
      clearTimeout(step3);
      setIsGenerating(false);
      setTimeout(() => {
        document.getElementById('document-preview-section')?.scrollIntoView({ behavior: 'smooth' });
      }, 200);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#FFF9FA] text-[#0B0B0B] flex flex-col font-sans select-none overflow-x-hidden">
      {/* Toast Notification */}
      {toastMessage && (
        <div
          role="status"
          aria-live="polite"
          className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#0B0B0B] border-2 border-[#FD1843] text-white px-5 py-2.5 rounded-full text-xs font-mono font-bold tracking-widest uppercase transition-all duration-300 shadow-2xl"
        >
          {toastMessage}
        </div>
      )}

      {/* ========================================================
          1. STICKY NAVBAR
          Minimalist, sticky, accessible, with brand and studio controls
         ======================================================== */}
      <header className="no-print border-b border-[#0B0B0B]/10 bg-[#FFFFFF]/95 backdrop-blur-md sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between gap-4">
          {/* Brand Wordmark */}
          <div className="flex items-center gap-2.5">
            <span className="w-3.5 h-3.5 rounded-full bg-[#FD1843]" />
            <span className="font-editorial-heading text-xl sm:text-2xl text-[#0B0B0B] tracking-wider uppercase">
              LEGALEASE <span className="text-[#FD1843]">STUDIO</span>
            </span>
            <span className="hidden sm:inline-block text-[10px] font-mono text-[#0B0B0B]/60 tracking-widest uppercase border border-[#0B0B0B]/20 px-2 py-0.5 rounded-full ml-1">
              AI DRAFTING
            </span>
          </div>

          {/* Navigation Anchors for Smooth Scrolling */}
          <nav className="hidden lg:flex items-center gap-6 text-xs font-mono font-bold uppercase tracking-wider text-[#0B0B0B]/70">
            <a
              href="#hero-section"
              className="hover:text-[#FD1843] transition-colors"
            >
              Overview
            </a>
            <a
              href="#features-section"
              className="hover:text-[#FD1843] transition-colors"
            >
              Capabilities
            </a>
            <a
              href="#document-form-section"
              className="hover:text-[#FD1843] transition-colors"
            >
              Draft Studio
            </a>
            <a
              href="#cta-banner-section"
              className="hover:text-[#FD1843] transition-colors"
            >
              Get Started
            </a>
          </nav>

          {/* Right Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            {/* Mobile Toggle for Saved Drafts Column */}
            <button
              type="button"
              onClick={() => setIsDraftsColumnVisibleMobile(!isDraftsColumnVisibleMobile)}
              className="lg:hidden px-3 py-1.5 rounded-full border border-[#FD1843] text-[#FD1843] text-xs font-mono font-bold flex items-center gap-1.5 cursor-pointer active:scale-95"
            >
              <FolderClock className="w-3.5 h-3.5" />
              <span>Drafts ({drafts.length})</span>
            </button>

            {/* Quick Save Current Action */}
            <button
              type="button"
              onClick={handleSaveCurrentAsDraft}
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-[#FD1843] text-[#FD1843] hover:bg-[#FD1843] hover:text-white text-xs font-mono font-bold tracking-wider uppercase transition-all cursor-pointer active:scale-95"
              title="Save current state to drafts column"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save Draft</span>
            </button>

            {/* Backend Status indicator */}
            <div
              className={`hidden md:flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-mono font-bold uppercase tracking-wider border ${
                isDemoMode
                  ? 'bg-[#FFF9FA] text-[#FD1843] border-[#FD1843]'
                  : isBackendHealthy
                  ? 'bg-[#FFF9FA] text-emerald-600 border-emerald-500/40'
                  : 'bg-[#FFF9FA] text-[#0B0B0B]/60 border-[#0B0B0B]/20'
              }`}
            >
              {isDemoMode ? (
                <>
                  <Sparkles className="w-3 h-3 text-[#FD1843]" />
                  <span>Demo Mode</span>
                </>
              ) : isBackendHealthy ? (
                <>
                  <Wifi className="w-3 h-3 text-emerald-600" />
                  <span>AI Engine Online</span>
                </>
              ) : (
                <>
                  <WifiOff className="w-3 h-3 text-[#0B0B0B]/40" />
                  <span>Fallback Engine</span>
                </>
              )}
            </div>

            {/* Toggle Demo Mode Pill */}
            <Pill
              label={isDemoMode ? 'LIVE AI MODE' : 'DEMO MODE'}
              variant={isDemoMode ? 'pink' : 'black'}
              onClick={() => {
                setIsDemoMode(!isDemoMode);
                showToast(isDemoMode ? 'Switched to Live AI' : 'Switched to Demo Mode');
              }}
            />
          </div>
        </div>
      </header>

      {/* ========================================================
          2. FULL-WIDTH PINK HERO SECTION (#FD1843)
          Bold, energetic, big headline, two buttons (black filled + white outlined)
         ======================================================== */}
      <section
        id="hero-section"
        aria-label="Full-Width Pink Hero Section"
        className="no-print w-full bg-[#FD1843] text-white py-16 sm:py-24 px-4 sm:px-6 relative overflow-hidden"
      >
        <div className="max-w-5xl mx-auto text-center space-y-6">
          {/* Subtitle tag */}
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-white/40 bg-black/10 text-white text-xs font-mono font-bold uppercase tracking-widest backdrop-blur-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>AI LEGAL DOCUMENT GENERATOR • VIVID THEME</span>
          </div>

          {/* Big Condensed Uppercase Headline with Tight Letter Spacing */}
          <h1 className="font-editorial-heading text-4xl sm:text-6xl md:text-7xl lg:text-8xl text-white tracking-tight leading-[0.92] uppercase max-w-4xl mx-auto">
            Legal documents, <span className="text-[#0B0B0B]">made simple.</span>
          </h1>

          {/* Body description */}
          <p className="text-sm sm:text-base md:text-lg text-white/95 max-w-2xl mx-auto font-sans leading-relaxed">
            Construct enforceable, court-tested contracts in minutes. Define parties, enter operative covenants, and generate a bespoke, paper-ready agreement with full standard boilerplate.
          </p>

          {/* Two Buttons: One Black Filled, One White Outlined */}
          <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-4">
            {/* Button 1: Black Filled */}
            <button
              type="button"
              onClick={() => {
                document.getElementById('document-form-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full bg-[#0B0B0B] text-white hover:bg-white hover:text-[#0B0B0B] text-xs sm:text-sm font-mono font-bold tracking-widest uppercase transition-all duration-200 shadow-lg active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>START DRAFTING NOW</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {/* Button 2: White Outlined */}
            <button
              type="button"
              onClick={() => {
                document.getElementById('features-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="w-full sm:w-auto px-8 py-3.5 rounded-full border-2 border-white text-white hover:bg-white hover:text-[#FD1843] text-xs sm:text-sm font-mono font-bold tracking-widest uppercase transition-all duration-200 active:scale-95 cursor-pointer flex items-center justify-center gap-2"
            >
              <span>EXPLORE CAPABILITIES</span>
            </button>
          </div>

          {/* Template Quick Selection Pills inside Hero */}
          <div className="pt-6 border-t border-white/20 flex flex-wrap items-center justify-center gap-2">
            <span className="text-xs font-mono font-bold text-white uppercase tracking-wider mr-1">
              Select Template:
            </span>
            {PRESET_KEYS.map((type) => {
              const isSelected = documentType === type;
              return (
                <button
                  key={type}
                  type="button"
                  onClick={() => handleSelectPreset(type)}
                  className={`px-3.5 py-1.5 rounded-full text-xs font-mono font-bold transition-all duration-200 uppercase cursor-pointer ${
                    isSelected
                      ? 'bg-[#0B0B0B] text-white border-2 border-[#0B0B0B] shadow-md'
                      : 'bg-white/15 text-white border border-white/40 hover:bg-white hover:text-[#FD1843]'
                  }`}
                >
                  {isSelected ? '✓ ' : ''}
                  {type}
                </button>
              );
            })}
          </div>
        </div>
      </section>

      {/* ========================================================
          3. FEATURES GRID OF CARDS
          Alternating between white with pink border and solid pink with white text
          Rounded cards (16px radius), generous whitespace, flat design
         ======================================================== */}
      <section
        id="features-section"
        aria-label="Features Grid"
        className="no-print w-full max-w-7xl mx-auto px-4 sm:px-6 py-16"
      >
        <div className="text-center space-y-2 mb-12">
          <span className="text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#FD1843]">
            STANDARDIZED INTEGRATION
          </span>
          <h2 className="font-editorial-heading text-3xl sm:text-4xl text-[#0B0B0B] uppercase tracking-tight">
            POWERFUL CONTRACT ARCHITECTURE
          </h2>
          <p className="text-xs sm:text-sm text-[#0B0B0B]/70 max-w-xl mx-auto">
            Engineered for corporate counsels, founders, landlords, and consultants requiring strict legal compliance.
          </p>
        </div>

        {/* 4 Alternating Feature Cards (16px radius) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Card 1: White with pink border */}
          <div className="card-theme bg-[#FFF9FA] border-2 border-[#FD1843] text-[#0B0B0B] p-6 flex flex-col justify-between space-y-4 shadow-sm transition-transform duration-200 hover:-translate-y-1">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#FD1843]/10 flex items-center justify-center text-[#FD1843]">
                <Shield className="w-5 h-5" />
              </div>
              <h3 className="font-editorial-heading text-xl text-[#0B0B0B] uppercase tracking-wide">
                COURT-TESTED ENFORCEABILITY
              </h3>
              <p className="text-xs font-sans text-[#0B0B0B]/75 leading-relaxed">
                Every agreement incorporates governing law, severability, and dispute resolution boilerplate tailored to your jurisdiction.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FD1843]">
              01 • GOVERNING LAW
            </span>
          </div>

          {/* Card 2: Solid pink with white text */}
          <div className="card-theme bg-[#FD1843] text-white p-6 flex flex-col justify-between space-y-4 shadow-sm transition-transform duration-200 hover:-translate-y-1">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                <Sparkles className="w-5 h-5" />
              </div>
              <h3 className="font-editorial-heading text-xl text-white uppercase tracking-wide">
                INSTANT AI SYNTHESIS
              </h3>
              <p className="text-xs font-sans text-white/90 leading-relaxed">
                Formulates bespoke commercial covenants and multi-party relationships in seconds using specialized attorney-grade legal syntax.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/80">
              02 • GEMINI 3.8 ENGINE
            </span>
          </div>

          {/* Card 3: White with pink border */}
          <div className="card-theme bg-[#FFF9FA] border-2 border-[#FD1843] text-[#0B0B0B] p-6 flex flex-col justify-between space-y-4 shadow-sm transition-transform duration-200 hover:-translate-y-1">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-[#FD1843]/10 flex items-center justify-center text-[#FD1843]">
                <Users className="w-5 h-5" />
              </div>
              <h3 className="font-editorial-heading text-xl text-[#0B0B0B] uppercase tracking-wide">
                AUTHENTIC EXECUTION BLOCKS
              </h3>
              <p className="text-xs font-sans text-[#0B0B0B]/75 leading-relaxed">
                Generates dynamic signature lines for Date, Name, Title, and Authorized Signatures for all contracting entities side by side.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-[#FD1843]">
              03 • MULTI-PARTY SIGN
            </span>
          </div>

          {/* Card 4: Solid pink with white text */}
          <div className="card-theme bg-[#FD1843] text-white p-6 flex flex-col justify-between space-y-4 shadow-sm transition-transform duration-200 hover:-translate-y-1">
            <div className="space-y-3">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center text-white">
                <Download className="w-5 h-5" />
              </div>
              <h3 className="font-editorial-heading text-xl text-white uppercase tracking-wide">
                TRUE PDF & DOCX EXPORTS
              </h3>
              <p className="text-xs font-sans text-white/90 leading-relaxed">
                Directly downloads clean multi-page .pdf files and formatted Word (.docx) documents with pagination and signature tables.
              </p>
            </div>
            <span className="text-[10px] font-mono font-bold uppercase tracking-wider text-white/80">
              04 • INSTANT EXPORT
            </span>
          </div>
        </div>
      </section>

      {/* ========================================================
          4. MAIN WORKSPACE WITH DEDICATED SAVED DRAFTS COLUMN
         ======================================================== */}
      <main className="flex-1 w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Specific Column: Saved & Draft Items */}
          <div
            className={`lg:col-span-4 lg:sticky lg:top-24 ${
              isDraftsColumnVisibleMobile ? 'block mb-6 lg:mb-0' : 'hidden lg:block'
            }`}
          >
            <SavedDraftsColumn
              drafts={drafts}
              activeDraftId={activeDraftId}
              onSelectDraft={handleSelectDraft}
              onSaveCurrentAsDraft={handleSaveCurrentAsDraft}
              onCreateNewDraft={handleCreateNewDraft}
              onDeleteDraft={handleDeleteDraft}
              onDuplicateDraft={handleDuplicateDraft}
              isCurrentSaved={Boolean(activeDraftId)}
            />
          </div>

          {/* Primary Editor & Document Studio Column (lg:col-span-8) */}
          <div className="lg:col-span-8 space-y-8">
            {/* Active Document Header Banner */}
            <div className="no-print flex items-center justify-between p-3.5 rounded-[14px] bg-[#FFFFFF] border border-[#0B0B0B]/10 text-xs font-mono shadow-sm">
              <div className="flex items-center gap-2 truncate">
                <span className="w-2.5 h-2.5 rounded-full bg-[#FD1843]" />
                <span className="text-[#0B0B0B]/60 uppercase">Active Item:</span>
                <span className="text-[#0B0B0B] font-bold truncate">
                  {documentTitle || customTitle || `${documentType} Agreement`}
                </span>
              </div>
              <div className="flex items-center gap-2 shrink-0">
                <button
                  type="button"
                  onClick={handleSaveCurrentAsDraft}
                  className="px-3 py-1 rounded-full bg-[#FD1843] text-white text-[10px] font-bold uppercase hover:bg-[#0B0B0B] transition-colors cursor-pointer"
                >
                  Save Draft
                </button>
                <button
                  type="button"
                  onClick={handleCreateNewDraft}
                  className="px-3 py-1 rounded-full border border-[#0B0B0B]/20 text-[#0B0B0B] text-[10px] font-bold uppercase hover:border-[#FD1843] hover:text-[#FD1843] transition-colors cursor-pointer"
                >
                  + New
                </button>
              </div>
            </div>

            {/* Document Configuration Form */}
            <section id="document-form-section" aria-label="Document Configuration Form">
              <DocumentForm
                documentType={documentType}
                onChangeDocumentType={handleSelectPreset}
                parties={parties}
                onChangeParties={setParties}
                terms={terms}
                onChangeTerms={setTerms}
                effectiveDate={effectiveDate}
                onChangeEffectiveDate={setEffectiveDate}
                jurisdiction={jurisdiction}
                onChangeJurisdiction={setJurisdiction}
                customTitle={customTitle}
                onChangeCustomTitle={setCustomTitle}
                onGenerate={handleGenerate}
                isGenerating={isGenerating}
                generationStep={generationStep}
              />
            </section>

            {/* Result: Paper-Style Preview, Edit Toggle, Downloads (TXT/DOCX/PDF) */}
            {hasGenerated && (
              <section
                id="document-preview-section"
                aria-label="Generated Document Preview"
                className="pt-4 scroll-mt-24 space-y-4"
              >
                <div className="no-print flex items-center justify-between pb-2 border-b border-[#0B0B0B]/10">
                  <div className="flex items-center gap-2">
                    <FileCheck2 className="w-5 h-5 text-[#FD1843]" />
                    <h2 className="font-editorial-heading text-2xl sm:text-3xl text-[#0B0B0B] uppercase tracking-wider">
                      Generated Instrument
                    </h2>
                  </div>
                  <span className="text-xs font-mono text-[#0B0B0B]/50">
                    Ready for Review & Execution
                  </span>
                </div>

                <DocumentPreview
                  title={documentTitle}
                  content={documentContent}
                  onChangeContent={setDocumentContent}
                  parties={parties}
                  effectiveDate={effectiveDate}
                  summary={documentSummary}
                  isAiGenerated={isAiGenerated}
                  isDemo={isDemoMode}
                  onResetOriginal={() => setDocumentContent(originalDraft)}
                  canReset={documentContent !== originalDraft}
                />
              </section>
            )}
          </div>
        </div>

        {/* ========================================================
            5. BLACK CALL-TO-ACTION BANNER WITH PINK BUTTON
           ======================================================== */}
        <section
          id="cta-banner-section"
          aria-label="Call to Action Banner"
          className="no-print mt-16 rounded-[16px] bg-[#0B0B0B] text-white p-8 sm:p-14 text-center space-y-6 shadow-xl"
        >
          <span className="inline-block text-[11px] font-mono font-bold uppercase tracking-[0.25em] text-[#FD1843]">
            EXPEDITE YOUR WORKFLOW
          </span>
          <h2 className="font-editorial-heading text-3xl sm:text-5xl md:text-6xl text-white tracking-tight uppercase max-w-3xl mx-auto leading-[0.95]">
            READY TO DRAFT YOUR NEXT <span className="text-[#FD1843]">ENFORCEABLE CONTRACT?</span>
          </h2>
          <p className="text-sm sm:text-base text-white/75 max-w-xl mx-auto font-sans leading-relaxed">
            Select a verified template or input custom terms. Export instant, court-tested agreements complete with dynamic multi-party signature blocks.
          </p>
          <div className="pt-2">
            <button
              type="button"
              onClick={() => {
                handleCreateNewDraft();
                document.getElementById('document-form-section')?.scrollIntoView({ behavior: 'smooth' });
              }}
              className="px-9 py-4 rounded-full bg-[#FD1843] text-white hover:bg-white hover:text-[#0B0B0B] text-xs sm:text-sm font-mono font-bold tracking-widest uppercase transition-all duration-200 active:scale-95 shadow-lg cursor-pointer"
            >
              CREATE NEW AGREEMENT
            </button>
          </div>
        </section>
      </main>

      {/* ========================================================
          6. FOOTER (#0B0B0B Near-Black)
         ======================================================== */}
      <footer className="no-print mt-20 border-t border-[#0B0B0B]/20 bg-[#0B0B0B] py-12 text-white/70 text-xs font-mono">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2.5">
            <span className="w-3 h-3 rounded-full bg-[#FD1843]" />
            <span className="font-editorial-heading text-lg sm:text-xl text-white tracking-wider uppercase">
              LEGALEASE <span className="text-[#FD1843]">STUDIO</span>
            </span>
          </div>

          <div className="text-[11px] text-white/60 flex items-center gap-2 flex-wrap justify-center">
            <span>Color Palette:</span>
            <span className="inline-flex items-center gap-1 font-mono text-[#FD1843] bg-white/5 px-2 py-0.5 rounded">
              <span className="w-2 h-2 rounded-full bg-[#FD1843]" /> #FD1843 (Primary)
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-white/80 bg-white/5 px-2 py-0.5 rounded">
              <span className="w-2 h-2 rounded-full bg-[#FFF9FA]" /> #FFF9FA (Background)
            </span>
            <span className="inline-flex items-center gap-1 font-mono text-white/80 bg-white/5 px-2 py-0.5 rounded">
              <span className="w-2 h-2 rounded-full bg-[#0B0B0B] border border-white/20" /> #0B0B0B (Accent)
            </span>
          </div>

          <div className="text-[10px] text-white/40 text-center md:text-right">
            © {new Date().getFullYear()} LegalEase Studio. Educational self-help legal document generator.
          </div>
        </div>
      </footer>
    </div>
  );
}
