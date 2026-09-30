import React, { useState, useRef } from 'react';
import { Party } from '../types';
import { exportToDocx, exportToTxt, printDocument } from '../utils/docxExport';
import { exportToPdf } from '../utils/pdfExport';
import { ClauseLibraryModal } from './ClauseLibraryModal';
import {
  Edit3,
  Eye,
  Download,
  Copy,
  Check,
  Printer,
  Sparkles,
  RotateCcw,
  ShieldAlert,
  Info,
  FileDown,
  CheckCircle2,
  BookOpen,
  Plus,
} from 'lucide-react';

interface DocumentPreviewProps {
  title: string;
  content: string;
  onChangeContent: (content: string) => void;
  parties: Party[];
  effectiveDate: string;
  summary?: string;
  isAiGenerated?: boolean;
  isDemo?: boolean;
  onResetOriginal?: () => void;
  canReset?: boolean;
}

export const DocumentPreview: React.FC<DocumentPreviewProps> = ({
  title,
  content,
  onChangeContent,
  parties = [],
  effectiveDate,
  summary,
  isAiGenerated,
  isDemo,
  onResetOriginal,
  canReset,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [copied, setCopied] = useState(false);
  const [isExportingDocx, setIsExportingDocx] = useState(false);
  const [isExportingPdf, setIsExportingPdf] = useState(false);
  const [pdfSuccess, setPdfSuccess] = useState(false);
  const [isClauseLibraryOpen, setIsClauseLibraryOpen] = useState(false);
  const [clauseToast, setClauseToast] = useState<string | null>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  // Copy to clipboard
  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content || '');
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy: ', err);
    }
  };

  // Download DOCX
  const handleDownloadDocx = async () => {
    try {
      setIsExportingDocx(true);
      await exportToDocx(title, content, parties, effectiveDate);
    } catch (err) {
      console.error('DOCX export error: ', err);
    } finally {
      setIsExportingDocx(false);
    }
  };

  // Download TXT
  const handleDownloadTxt = () => {
    exportToTxt(title, content, parties, effectiveDate);
  };

  // DIRECT DOWNLOAD AS PDF (Guaranteed true PDF file with complete signature blocks)
  const handleDownloadPdf = () => {
    try {
      setIsExportingPdf(true);
      exportToPdf(title, content, parties, effectiveDate);
      setPdfSuccess(true);
      setTimeout(() => setPdfSuccess(false), 2500);
    } catch (err) {
      console.error('PDF export error: ', err);
      printDocument();
    } finally {
      setIsExportingPdf(false);
    }
  };

  // Browser Print Dialog
  const handleBrowserPrint = () => {
    printDocument();
  };

  // Insert boilerplate clause into editor
  const handleInsertClause = (clauseText: string, clauseTitle: string) => {
    const raw = content || '';
    const textarea = textareaRef.current;
    let updatedContent = '';

    if (isEditing && textarea && typeof textarea.selectionStart === 'number') {
      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const before = raw.substring(0, start);
      const after = raw.substring(end);
      const spacerBefore = before.endsWith('\n\n') ? '' : before.endsWith('\n') ? '\n' : '\n\n';
      const spacerAfter = after.startsWith('\n\n') ? '' : after.startsWith('\n') ? '\n' : '\n\n';
      updatedContent = `${before}${spacerBefore}${clauseText.trim()}${spacerAfter}${after}`;
    } else {
      const witnessIndex = raw.search(/\[SIGNATURE PAGE FOLLOWS\]|IN WITNESS WHEREOF/i);
      if (witnessIndex !== -1) {
        const before = raw.slice(0, witnessIndex).trimEnd();
        const after = raw.slice(witnessIndex).trimStart();
        updatedContent = `${before}\n\n${clauseText.trim()}\n\n${after}`;
      } else {
        updatedContent = `${raw.trimEnd()}\n\n${clauseText.trim()}\n`;
      }
    }

    onChangeContent(updatedContent);
    setClauseToast(`Inserted "${clauseTitle}"`);
    setTimeout(() => setClauseToast(null), 3000);
  };

  const wordCount = (content || '').trim().split(/\s+/).filter(Boolean).length;
  const charCount = (content || '').length;

  const cleanBodyContent = (content || '')
    .split(/\[SIGNATURE PAGE FOLLOWS\]|IN WITNESS WHEREOF/i)[0]
    .trim();

  return (
    <div className="space-y-6">
      {/* Clause Insertion Toast Notification */}
      {clauseToast && (
        <div
          role="status"
          className="fixed bottom-6 right-6 z-50 bg-[#0B0B0B] border-2 border-[#FD1843] text-white px-5 py-2.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase shadow-2xl flex items-center gap-2 animate-in slide-in-from-bottom-2"
        >
          <CheckCircle2 className="w-4 h-4 text-[#FD1843]" />
          <span>{clauseToast}</span>
        </div>
      )}

      {/* Top Action Toolbar (Warm White / White card with Pink accents) */}
      <div className="no-print bg-[#FFFFFF] border-2 border-[#FD1843]/30 rounded-[16px] p-4 sm:p-5 flex flex-wrap items-center justify-between gap-4 shadow-sm">
        <div className="flex items-center gap-2.5 sm:gap-3 flex-wrap">
          {/* Edit / Preview Pill Toggle */}
          <div className="inline-flex rounded-full bg-[#FFF9FA] p-1 border border-[#0B0B0B]/15">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                !isEditing
                  ? 'bg-[#FD1843] text-white'
                  : 'text-[#0B0B0B]/70 hover:text-[#0B0B0B]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Paper View</span>
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(true)}
              className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 cursor-pointer ${
                isEditing
                  ? 'bg-[#FD1843] text-white'
                  : 'text-[#0B0B0B]/70 hover:text-[#0B0B0B]'
              }`}
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Edit Text</span>
            </button>
          </div>

          {/* Quick Access to Clause Library */}
          <button
            type="button"
            onClick={() => {
              setIsEditing(true);
              setIsClauseLibraryOpen(true);
            }}
            className="px-3.5 py-1.5 rounded-full bg-[#FFF9FA] border border-[#FD1843] text-[#FD1843] hover:bg-[#FD1843] hover:text-white text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Browse and insert boilerplate clauses (Force Majeure, Indemnification, Governing Law, etc.)"
          >
            <BookOpen className="w-3.5 h-3.5" />
            <span>Clause Library</span>
          </button>

          {/* Badges */}
          {isAiGenerated && (
            <span className="hidden sm:inline-flex items-center gap-1 px-3 py-1 rounded-full border border-[#FD1843] text-[#FD1843] text-[10px] font-mono font-bold uppercase tracking-widest bg-[#FD1843]/5">
              <Sparkles className="w-3 h-3" />
              AI Synthesized
            </span>
          )}

          {isDemo && (
            <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full border border-[#0B0B0B]/20 text-[#0B0B0B]/80 text-[10px] font-mono font-bold uppercase tracking-widest bg-[#FFF9FA]">
              <Info className="w-3 h-3 text-[#FD1843]" />
              Demo Mode
            </span>
          )}

          {canReset && onResetOriginal && (
            <button
              type="button"
              onClick={onResetOriginal}
              className="text-xs font-mono text-[#0B0B0B]/50 hover:text-[#FD1843] flex items-center gap-1 px-2 py-1 transition-colors cursor-pointer"
              title="Reset edits to initial generated document"
            >
              <RotateCcw className="w-3 h-3" />
              Reset Draft
            </button>
          )}
        </div>

        {/* Action & Download Outlined Pills */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          {/* Copy Button */}
          <button
            type="button"
            onClick={handleCopy}
            className="px-3.5 py-1.5 rounded-full border-[1.5px] border-[#0B0B0B] text-[#0B0B0B] hover:bg-[#0B0B0B] hover:text-white text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Copy plain text"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? 'Copied!' : 'Copy'}</span>
          </button>

          {/* TXT Download */}
          <button
            type="button"
            onClick={handleDownloadTxt}
            className="px-3.5 py-1.5 rounded-full border-[1.5px] border-[#FD1843] text-[#FD1843] hover:bg-[#FD1843] hover:text-white text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 cursor-pointer active:scale-95"
            title="Download TXT file"
          >
            <Download className="w-3.5 h-3.5" />
            <span>TXT</span>
          </button>

          {/* DOCX Download */}
          <button
            type="button"
            onClick={handleDownloadDocx}
            disabled={isExportingDocx}
            className="px-3.5 py-1.5 rounded-full border-[1.5px] border-[#FD1843] text-[#FD1843] hover:bg-[#FD1843] hover:text-white text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 cursor-pointer disabled:opacity-40 active:scale-95"
            title="Download formatted Microsoft Word DOCX file with signature tables"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>{isExportingDocx ? 'Saving...' : 'DOCX'}</span>
          </button>

          {/* Primary Action: Direct Download as PDF */}
          <button
            type="button"
            onClick={handleDownloadPdf}
            disabled={isExportingPdf}
            className="px-4 py-1.5 rounded-full bg-[#FD1843] text-white hover:bg-[#0B0B0B] text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
            title="Directly download clean PDF with formatted signature blocks"
          >
            {pdfSuccess ? (
              <>
                <CheckCircle2 className="w-3.5 h-3.5 text-white" />
                <span>Downloaded PDF!</span>
              </>
            ) : (
              <>
                <Download className="w-3.5 h-3.5" />
                <span>{isExportingPdf ? 'Exporting...' : 'Download as PDF'}</span>
              </>
            )}
          </button>

          {/* Browser Print View Button */}
          <button
            type="button"
            onClick={handleBrowserPrint}
            className="p-1.5 rounded-full border border-[#0B0B0B]/20 text-[#0B0B0B] hover:bg-[#FD1843] hover:text-white hover:border-[#FD1843] transition-all duration-200 cursor-pointer"
            title="Open browser print dialog"
          >
            <Printer className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Summary Banner */}
      {summary && (
        <div className="no-print p-4 rounded-[14px] bg-[#FFFFFF] border border-[#FD1843]/30 text-xs text-[#0B0B0B]/80 font-mono flex flex-col sm:flex-row sm:items-center justify-between gap-2 shadow-sm">
          <div>
            <span className="text-[#FD1843] font-bold uppercase tracking-widest mr-2">
              Summary:
            </span>
            <span>{summary}</span>
          </div>
          <span className="text-[#0B0B0B]/40 text-[10px] shrink-0">
            {wordCount} words • {charCount} chars
          </span>
        </div>
      )}

      {/* Paper-Style Document Container */}
      <div className="relative">
        {isEditing ? (
          /* Editable Document Textarea View with Clause Library Action */
          <div className="no-print bg-[#FFFFFF] border-2 border-[#FD1843] rounded-[16px] p-6 sm:p-8 space-y-4 shadow-sm">
            <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-[#0B0B0B]/10">
              <div className="flex items-center gap-3">
                <span className="text-xs font-mono font-bold text-[#FD1843] uppercase tracking-widest flex items-center gap-2">
                  <Edit3 className="w-4 h-4" /> Live Contract Editor
                </span>
                <span className="text-xs font-mono text-[#0B0B0B]/40 hidden sm:inline">
                  Direct edits reflected in all exports
                </span>
              </div>

              {/* Browse Clause Library Button in Editor Header */}
              <button
                type="button"
                onClick={() => setIsClauseLibraryOpen(true)}
                className="px-3.5 py-1.5 rounded-full bg-[#FD1843] text-white hover:bg-[#0B0B0B] text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95"
              >
                <BookOpen className="w-3.5 h-3.5" />
                <span>+ Browse Clause Library</span>
              </button>
            </div>

            <textarea
              ref={textareaRef}
              value={content}
              onChange={(e) => onChangeContent(e.target.value)}
              rows={24}
              className="w-full bg-[#FFF9FA] border border-[#0B0B0B]/15 rounded-[12px] p-5 font-mono text-xs sm:text-sm text-[#0B0B0B] leading-relaxed focus:outline-none focus:border-[#FD1843] resize-y"
              placeholder="Enter document text..."
            />

            <div className="pt-2 flex flex-wrap items-center justify-between text-xs font-mono text-[#0B0B0B]/60 gap-3">
              <div className="flex items-center gap-3">
                <span>{wordCount} words • {charCount} characters</span>
                <button
                  type="button"
                  onClick={() => setIsClauseLibraryOpen(true)}
                  className="text-[#FD1843] hover:underline flex items-center gap-1 cursor-pointer font-bold"
                >
                  <Plus className="w-3 h-3" /> Insert Boilerplate Clause
                </button>
              </div>

              <button
                type="button"
                onClick={() => setIsEditing(false)}
                className="px-4 py-1.5 rounded-full bg-[#FD1843] text-white font-bold uppercase tracking-wider hover:bg-[#0B0B0B] transition-colors cursor-pointer"
              >
                Back to Paper View
              </button>
            </div>
          </div>
        ) : null}

        {/* Paper-Style Authentic Legal Document Sheet (Targeted by print media queries) */}
        <div
          id="printable-document-container"
          className={`printable-document-container print-document-sheet print-page relative max-w-4xl mx-auto bg-[#FFFFFF] text-[#000000] rounded-[16px] border-2 border-[#0B0B0B]/10 p-8 sm:p-14 md:p-16 select-text transition-all font-serif shadow-sm ${
            isEditing ? 'hidden print:block' : 'block'
          }`}
        >
          {/* Document Header */}
          <div className="text-center pb-8 border-b-2 border-[#000000]">
            <span className="text-[10px] tracking-[0.28em] uppercase text-black/60 font-sans font-bold block mb-1">
              Formal Contractual Instrument
            </span>
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-black tracking-tight text-[#000000] uppercase font-editorial-heading leading-tight">
              {title}
            </h1>
            <div className="mt-2 text-xs font-sans text-black/70 flex items-center justify-center gap-3">
              <span>Effective Date: <strong>{effectiveDate || 'Upon Execution'}</strong></span>
              <span>•</span>
              <span>Parties: <strong>{(parties || []).length}</strong></span>
            </div>
          </div>

          {/* Document Body Content */}
          <div className="mt-8 text-xs sm:text-sm leading-relaxed whitespace-pre-wrap text-[#000000] font-serif">
            {cleanBodyContent}
          </div>

          {/* ========================================================
              DYNAMICALLY APPENDED SIGNATURE BLOCK SECTION
              With lines for 'Date', 'Name', and 'Title' for each party
             ======================================================== */}
          <section
            aria-label="Signature Execution Blocks"
            className="signature-block keep-together mt-14 pt-8 border-t-2 border-[#000000]"
          >
            {/* Formal Attestation Witness Heading */}
            <p className="text-xs sm:text-sm italic text-black/80 font-serif leading-relaxed mb-8">
              IN WITNESS WHEREOF, the Parties hereto have caused this Agreement to be duly executed and delivered by their respective authorized signatories as of the Effective Date written above.
            </p>

            {/* Dynamic Grid of Parties Signature Blocks */}
            <div
              className={`grid gap-8 ${
                (parties || []).length === 1
                  ? 'grid-cols-1 max-w-md mx-auto'
                  : (parties || []).length === 2
                  ? 'grid-cols-1 md:grid-cols-2'
                  : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3'
              }`}
            >
              {(parties || []).map((party, index) => (
                <div
                  key={party?.id || index}
                  className="space-y-4 p-4 rounded-xl border border-black/15 bg-black/[0.015]"
                >
                  {/* Party Header */}
                  <div className="border-b border-black/20 pb-2">
                    <span className="text-[10px] font-sans font-bold tracking-widest uppercase text-black/60 block">
                      {party?.role || `Party ${index + 1}`}
                    </span>
                    <h2 className="text-sm font-sans font-bold text-black uppercase tracking-wide truncate">
                      {party?.name || `[Designated ${party?.role || 'Signatory'}]`}
                    </h2>
                  </div>

                  {/* Execution Lines: Signature, Name, Title, Date */}
                  <div className="space-y-3 font-serif text-xs">
                    {/* Signature Line */}
                    <div className="pt-2">
                      <div className="flex items-end justify-between gap-2 border-b border-black/80 pb-1">
                        <span className="text-black/60 font-sans text-[11px] font-medium shrink-0">By:</span>
                        <div className="h-4 flex-1" />
                      </div>
                      <span className="text-[9px] font-sans text-black/50 block text-right mt-0.5">
                        (Authorized Signature)
                      </span>
                    </div>

                    {/* Name Line */}
                    <div className="flex items-end justify-between gap-2 border-b border-black/80 pb-1">
                      <span className="text-black/60 font-sans text-[11px] font-medium shrink-0">Name:</span>
                      <span className="font-serif text-xs text-black font-semibold truncate">
                        {party?.name || '___________________________'}
                      </span>
                    </div>

                    {/* Title Line */}
                    <div className="flex items-end justify-between gap-2 border-b border-black/80 pb-1">
                      <span className="text-black/60 font-sans text-[11px] font-medium shrink-0">Title:</span>
                      <span className="font-serif text-xs text-black/70">
                        Authorized Representative
                      </span>
                    </div>

                    {/* Date Line */}
                    <div className="flex items-end justify-between gap-2 border-b border-black/80 pb-1">
                      <span className="text-black/60 font-sans text-[11px] font-medium shrink-0">Date:</span>
                      <span className="font-serif text-xs text-black">
                        {effectiveDate || '___________________________'}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Document Footer / Attestation */}
          <div className="mt-12 pt-6 border-t border-black/20 flex flex-col sm:flex-row items-center justify-between text-[11px] font-sans text-black/60 gap-2">
            <span className="font-semibold uppercase tracking-wider text-[10px]">
              Executed Instrument • LegalEase Studio
            </span>
            <span className="font-mono text-[10px]">
              Verified Binding Structure
            </span>
          </div>
        </div>
      </div>

      {/* Required "Not Legal Advice" Disclaimer */}
      <div className="no-print p-5 rounded-[16px] bg-[#0B0B0B] text-white text-xs flex items-start gap-3.5 shadow-sm">
        <ShieldAlert className="w-5 h-5 text-[#FD1843] shrink-0 mt-0.5" />
        <div className="space-y-1">
          <span className="font-mono font-bold text-[#FD1843] text-xs uppercase tracking-widest block">
            Not Legal Advice Notice:
          </span>
          <p className="leading-relaxed text-[11px] text-white/70 font-sans">
            LegalEase provides automated legal document templates and AI-assisted drafting for informational and educational purposes only. LegalEase is not a law firm, does not provide legal advice, and its use does not create an attorney-client relationship. Review this agreement with licensed legal counsel in your jurisdiction before signing.
          </p>
        </div>
      </div>

      {/* Boilerplate Clause Library Modal */}
      <ClauseLibraryModal
        isOpen={isClauseLibraryOpen}
        onClose={() => setIsClauseLibraryOpen(false)}
        onInsertClause={handleInsertClause}
      />
    </div>
  );
};
