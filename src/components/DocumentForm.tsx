import React, { useState } from 'react';
import { DocumentType, Party } from '../types';
import { QUICK_SUGGESTED_TERMS } from '../templates';
import {
  FileText,
  Users,
  Plus,
  X,
  Calendar,
  Sparkles,
  MapPin,
  ClipboardPaste,
  ChevronDown,
  ArrowRight,
} from 'lucide-react';

interface DocumentFormProps {
  documentType: DocumentType;
  onChangeDocumentType: (type: DocumentType) => void;
  parties: Party[];
  onChangeParties: (parties: Party[]) => void;
  terms: string[];
  onChangeTerms: (terms: string[]) => void;
  effectiveDate: string;
  onChangeEffectiveDate: (date: string) => void;
  jurisdiction: string;
  onChangeJurisdiction: (jurisdiction: string) => void;
  customTitle: string;
  onChangeCustomTitle: (title: string) => void;
  onGenerate: () => void;
  isGenerating: boolean;
  generationStep?: string;
}

export const DocumentForm: React.FC<DocumentFormProps> = ({
  documentType,
  onChangeDocumentType,
  parties = [],
  onChangeParties,
  terms = [],
  onChangeTerms,
  effectiveDate,
  onChangeEffectiveDate,
  jurisdiction,
  onChangeJurisdiction,
  customTitle,
  onChangeCustomTitle,
  onGenerate,
  isGenerating,
  generationStep = 'Drafting operative terms...',
}) => {
  const [newTermInput, setNewTermInput] = useState('');
  const [showPasteModal, setShowPasteModal] = useState(false);
  const [pastedLines, setPastedLines] = useState('');

  // Handle party field update
  const handleUpdateParty = (index: number, field: keyof Party, value: string) => {
    const updated = [...parties];
    updated[index] = { ...updated[index], [field]: value };
    onChangeParties(updated);
  };

  // Add party
  const handleAddParty = () => {
    const newParty: Party = {
      id: `party-${Date.now()}`,
      role: `Party ${parties.length + 1}`,
      name: '',
      address: '',
    };
    onChangeParties([...parties, newParty]);
  };

  // Remove party
  const handleRemoveParty = (index: number) => {
    if (parties.length <= 2) return;
    const updated = parties.filter((_, i) => i !== index);
    onChangeParties(updated);
  };

  // Add a single term chip
  const handleAddTerm = () => {
    const trimmed = newTermInput.trim();
    if (!trimmed) return;
    if (!terms.includes(trimmed)) {
      onChangeTerms([...terms, trimmed]);
    }
    setNewTermInput('');
  };

  // Remove a term chip
  const handleRemoveTerm = (index: number) => {
    const updated = terms.filter((_, i) => i !== index);
    onChangeTerms(updated);
  };

  // Quick suggestion click
  const handleAddSuggestedTerm = (suggested: string) => {
    if (!terms.includes(suggested)) {
      onChangeTerms([...terms, suggested]);
    }
  };

  // Multi-line paste handler
  const handleApplyPastedTerms = () => {
    const lines = pastedLines
      .split('\n')
      .map((l) => l.trim().replace(/^[-* \d.]+\s*/, ''))
      .filter((l) => l.length > 2);

    const merged = Array.from(new Set([...terms, ...lines]));
    onChangeTerms(merged);
    setPastedLines('');
    setShowPasteModal(false);
  };

  // Quick Date presets
  const setQuickDate = (type: 'today' | 'firstNextMonth') => {
    const now = new Date();
    if (type === 'today') {
      onChangeEffectiveDate(now.toISOString().split('T')[0]);
    } else {
      const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1);
      onChangeEffectiveDate(nextMonth.toISOString().split('T')[0]);
    }
  };

  const suggestions = QUICK_SUGGESTED_TERMS[documentType] || [];

  return (
    <article
      aria-label="AI Document Drafting Form"
      className="w-full rounded-[16px] bg-[#FFFFFF] border-2 border-[#FD1843]/30 p-6 sm:p-9 md:p-10 text-[#0B0B0B] select-none transition-all"
    >
      {/* Form Header */}
      <header className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#0B0B0B]/10 gap-4">
        <div>
          <span className="text-[11px] sm:text-xs font-mono font-bold uppercase tracking-[0.2em] text-[#FD1843] flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-[#FD1843]" />
            SPECIFICATIONS & OPERATIVE TERMS
          </span>
          <h2 className="font-editorial-heading text-3xl sm:text-4xl text-[#0B0B0B] tracking-tight uppercase mt-1">
            Contract Terms & Parties
          </h2>
        </div>

        {/* Document Type Dropdown */}
        <div className="relative min-w-[220px]">
          <label className="block text-[10px] font-mono font-bold text-[#FD1843] uppercase tracking-widest mb-1.5">
            Document Type
          </label>
          <div className="relative">
            <select
              value={documentType}
              onChange={(e) => onChangeDocumentType(e.target.value as DocumentType)}
              className="w-full appearance-none bg-[#FFF9FA] border-2 border-[#FD1843] text-[#0B0B0B] font-sans font-bold py-2 pl-3.5 pr-10 rounded-full focus:outline-none focus:ring-2 focus:ring-[#FD1843] text-xs sm:text-sm cursor-pointer"
            >
              <option value="NDA">Non-Disclosure Agreement (NDA)</option>
              <option value="Employment Contract">Employment Contract</option>
              <option value="Lease Agreement">Residential Lease Agreement</option>
              <option value="Freelance Contract">Freelance / Contractor SOW</option>
              <option value="Custom">Custom Agreement</option>
            </select>
            <ChevronDown className="w-4 h-4 text-[#FD1843] absolute right-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          </div>
        </div>
      </header>

      <div className="mt-8 space-y-7">
        {/* Document Specific Title */}
        <div>
          <label className="block text-[10px] sm:text-xs font-mono font-bold text-[#FD1843] uppercase tracking-widest mb-2">
            Document Formal Title (Optional)
          </label>
          <input
            type="text"
            value={customTitle}
            onChange={(e) => onChangeCustomTitle(e.target.value)}
            placeholder="e.g. MUTUAL NON-DISCLOSURE AND CONFIDENTIALITY AGREEMENT"
            className="w-full bg-[#FFF9FA] border-2 border-[#0B0B0B]/15 focus:border-[#FD1843] rounded-[12px] px-4 py-3 text-sm text-[#0B0B0B] placeholder-[#0B0B0B]/40 focus:outline-none font-sans font-medium transition-colors"
          />
        </div>

        {/* Parties Section */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <label className="text-[10px] sm:text-xs font-mono font-bold text-[#FD1843] uppercase tracking-widest flex items-center gap-2">
              <Users className="w-4 h-4 text-[#FD1843]" />
              Contracting Parties ({parties.length})
            </label>
            {parties.length < 4 && (
              <button
                type="button"
                onClick={handleAddParty}
                className="text-xs text-[#FD1843] hover:text-[#0B0B0B] font-mono font-bold flex items-center gap-1 transition-colors cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" /> + Add Party
              </button>
            )}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {parties.map((party, index) => (
              <div
                key={party?.id || index}
                className="p-4 sm:p-5 rounded-[16px] bg-[#FFF9FA] border-2 border-[#FD1843]/30 hover:border-[#FD1843] transition-colors relative"
              >
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono font-bold uppercase tracking-widest text-[#FD1843]">
                    Party {index + 1}
                  </span>
                  {parties.length > 2 && (
                    <button
                      type="button"
                      onClick={() => handleRemoveParty(index)}
                      className="text-[#0B0B0B]/40 hover:text-[#FD1843] transition-colors cursor-pointer"
                      title="Remove party"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  )}
                </div>

                <div className="space-y-3">
                  <div>
                    <label className="block text-[10px] font-mono text-[#0B0B0B]/60 uppercase mb-1">
                      Entity / Person Name
                    </label>
                    <input
                      type="text"
                      value={party?.name || ''}
                      onChange={(e) => handleUpdateParty(index, 'name', e.target.value)}
                      placeholder="e.g. Acme Innovations Inc."
                      className="w-full bg-[#FFFFFF] border border-[#0B0B0B]/15 focus:border-[#FD1843] rounded-lg px-3 py-2 text-xs sm:text-sm text-[#0B0B0B] placeholder-[#0B0B0B]/40 focus:outline-none"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="block text-[10px] font-mono text-[#0B0B0B]/60 uppercase mb-1">
                        Contractual Role
                      </label>
                      <input
                        type="text"
                        value={party?.role || ''}
                        onChange={(e) => handleUpdateParty(index, 'role', e.target.value)}
                        placeholder="e.g. Disclosing Party"
                        className="w-full bg-[#FFFFFF] border border-[#0B0B0B]/15 focus:border-[#FD1843] rounded-lg px-3 py-2 text-xs sm:text-sm text-[#0B0B0B] focus:outline-none"
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-[#0B0B0B]/60 uppercase mb-1">
                        Address / State
                      </label>
                      <input
                        type="text"
                        value={party?.address || ''}
                        onChange={(e) => handleUpdateParty(index, 'address', e.target.value)}
                        placeholder="100 Tech Blvd, CA"
                        className="w-full bg-[#FFFFFF] border border-[#0B0B0B]/15 focus:border-[#FD1843] rounded-lg px-3 py-2 text-xs sm:text-sm text-[#0B0B0B] placeholder-[#0B0B0B]/40 focus:outline-none"
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Operative Terms & Key Clauses */}
        <div>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-2 gap-2">
            <label className="text-[10px] sm:text-xs font-mono font-bold text-[#FD1843] uppercase tracking-widest flex items-center gap-2">
              <FileText className="w-4 h-4 text-[#FD1843]" />
              Operative Clauses & Terms ({terms.length})
            </label>
            <button
              type="button"
              onClick={() => setShowPasteModal(!showPasteModal)}
              className="text-xs text-[#0B0B0B]/70 hover:text-[#FD1843] font-mono font-bold flex items-center gap-1 transition-colors self-start cursor-pointer"
            >
              <ClipboardPaste className="w-3.5 h-3.5" />
              {showPasteModal ? 'Hide Paste Box' : 'Paste Multiple Clauses'}
            </button>
          </div>

          {/* Paste Multiple Lines Area */}
          {showPasteModal && (
            <div className="mb-4 p-4 rounded-[14px] bg-[#FFF9FA] border-2 border-[#FD1843]/40 space-y-3">
              <p className="text-xs text-[#0B0B0B]/70 font-sans">
                Paste numbered lists, bullet points, or paragraphs. Each line will become a separate operative clause.
              </p>
              <textarea
                value={pastedLines}
                onChange={(e) => setPastedLines(e.target.value)}
                placeholder="1. 3-year term from effective date&#10;2. Mutual non-solicitation for 12 months&#10;3. Confidentiality applies to technical source code"
                rows={4}
                className="w-full bg-[#FFFFFF] border border-[#0B0B0B]/20 rounded-lg p-3 text-xs sm:text-sm text-[#0B0B0B] font-mono placeholder-[#0B0B0B]/40 focus:outline-none focus:border-[#FD1843]"
              />
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPasteModal(false)}
                  className="px-3 py-1 text-xs font-mono text-[#0B0B0B]/60 hover:text-[#0B0B0B] cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="button"
                  onClick={handleApplyPastedTerms}
                  className="px-4 py-1.5 rounded-full bg-[#FD1843] text-white text-xs font-mono font-bold uppercase hover:bg-[#0B0B0B] transition-colors cursor-pointer"
                >
                  Apply Clauses
                </button>
              </div>
            </div>
          )}

          {/* Single Term Input Bar */}
          <div className="flex gap-2">
            <input
              type="text"
              value={newTermInput}
              onChange={(e) => setNewTermInput(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  handleAddTerm();
                }
              }}
              placeholder="Add an operative clause (e.g. '3-year confidentiality term', 'Work-for-hire IP assignment')..."
              className="flex-1 bg-[#FFF9FA] border-2 border-[#0B0B0B]/15 focus:border-[#FD1843] rounded-full px-4 py-2.5 text-xs sm:text-sm text-[#0B0B0B] placeholder-[#0B0B0B]/40 focus:outline-none"
            />
            <button
              type="button"
              onClick={handleAddTerm}
              className="px-5 py-2.5 rounded-full bg-[#FD1843] text-white hover:bg-[#0B0B0B] text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 shrink-0 cursor-pointer active:scale-95"
            >
              + Add
            </button>
          </div>

          {/* Active Term Chips */}
          <div className="mt-3 flex flex-wrap gap-2">
            {terms.map((term, index) => (
              <span
                key={index}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FFF9FA] border border-[#FD1843]/40 text-[#0B0B0B] text-xs font-sans group hover:border-[#FD1843] transition-colors"
              >
                <span>{term}</span>
                <button
                  type="button"
                  onClick={() => handleRemoveTerm(index)}
                  className="text-[#0B0B0B]/40 hover:text-[#FD1843] p-0.5 cursor-pointer"
                  title="Remove term"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </span>
            ))}
          </div>

          {/* Quick Suggestions Chips */}
          {suggestions.length > 0 && (
            <div className="mt-4 pt-3 border-t border-[#0B0B0B]/10">
              <span className="text-[10px] font-mono text-[#FD1843] uppercase tracking-wider block mb-2 font-bold">
                Quick Suggested Clauses for {documentType}:
              </span>
              <div className="flex flex-wrap gap-1.5">
                {suggestions.map((sug, i) => {
                  const alreadyAdded = terms.includes(sug);
                  return (
                    <button
                      key={i}
                      type="button"
                      disabled={alreadyAdded}
                      onClick={() => handleAddSuggestedTerm(sug)}
                      className={`text-[11px] font-mono px-3 py-1 rounded-full border transition-all cursor-pointer ${
                        alreadyAdded
                          ? 'border-[#0B0B0B]/15 text-[#0B0B0B]/30 cursor-not-allowed bg-transparent'
                          : 'border-[#0B0B0B]/20 text-[#0B0B0B]/80 hover:border-[#FD1843] hover:text-[#FD1843] bg-[#FFF9FA]'
                      }`}
                    >
                      {alreadyAdded ? '✓ Added' : `+ ${sug}`}
                    </button>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* Date & Jurisdiction Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-2">
          {/* Effective Date */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="text-[10px] sm:text-xs font-mono font-bold text-[#FD1843] uppercase tracking-widest flex items-center gap-1.5">
                <Calendar className="w-3.5 h-3.5 text-[#FD1843]" />
                Effective Date
              </label>
              <div className="flex gap-2 text-[10px] font-mono text-[#0B0B0B]/60">
                <button
                  type="button"
                  onClick={() => setQuickDate('today')}
                  className="hover:text-[#FD1843] underline cursor-pointer"
                >
                  Today
                </button>
                <span>•</span>
                <button
                  type="button"
                  onClick={() => setQuickDate('firstNextMonth')}
                  className="hover:text-[#FD1843] underline cursor-pointer"
                >
                  1st Next Mo
                </button>
              </div>
            </div>
            <input
              type="date"
              value={effectiveDate}
              onChange={(e) => onChangeEffectiveDate(e.target.value)}
              className="w-full bg-[#FFF9FA] border-2 border-[#0B0B0B]/15 focus:border-[#FD1843] rounded-full px-4 py-2 text-xs sm:text-sm text-[#0B0B0B] font-mono focus:outline-none"
            />
          </div>

          {/* Governing Jurisdiction */}
          <div>
            <label className="block text-[10px] sm:text-xs font-mono font-bold text-[#FD1843] uppercase tracking-widest mb-1.5">
              <span className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-[#FD1843]" />
                Governing Jurisdiction
              </span>
            </label>
            <input
              type="text"
              value={jurisdiction}
              onChange={(e) => onChangeJurisdiction(e.target.value)}
              placeholder="e.g. State of Delaware, United States"
              className="w-full bg-[#FFF9FA] border-2 border-[#0B0B0B]/15 focus:border-[#FD1843] rounded-full px-4 py-2 text-xs sm:text-sm text-[#0B0B0B] font-mono focus:outline-none"
            />
          </div>
        </div>

        {/* Primary Generate Button (Rounded Pill Button) */}
        <div className="pt-4">
          <button
            type="button"
            onClick={onGenerate}
            disabled={isGenerating}
            className="w-full py-4 px-8 rounded-full bg-[#FD1843] text-white hover:bg-[#0B0B0B] text-sm sm:text-base font-mono font-bold tracking-widest uppercase transition-all duration-200 flex items-center justify-center gap-3 cursor-pointer shadow-md hover:shadow-lg active:scale-95 disabled:opacity-50"
          >
            {isGenerating ? (
              <>
                <Sparkles className="w-5 h-5 animate-spin" />
                <span>{generationStep}</span>
              </>
            ) : (
              <>
                <span>GENERATE COURT-READY CONTRACT</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>
        </div>
      </div>
    </article>
  );
};
