import React from 'react';
import { ScalesOfJusticeIcon } from './ScalesLogo';
import { DocumentType } from '../types';
import { FileText, ShieldCheck, Download, Sparkles, CheckCircle2 } from 'lucide-react';

interface HeroProps {
  onSelectPreset: (docType: DocumentType) => void;
  activeType: DocumentType;
}

export const Hero: React.FC<HeroProps> = ({ onSelectPreset, activeType }) => {
  const presets: { type: DocumentType; label: string; desc: string }[] = [
    { type: 'NDA', label: 'Mutual NDA', desc: 'Protect trade secrets & IP' },
    { type: 'Employment Contract', label: 'Employment', desc: 'Roles, duties & compensation' },
    { type: 'Lease Agreement', label: 'Residential Lease', desc: 'Tenancy terms & deposits' },
    { type: 'Freelance Contract', label: 'Freelance SOW', desc: 'Milestones, IP & pay terms' },
    { type: 'Custom', label: 'Custom Contract', desc: 'Bespoke commercial pact' },
  ];

  return (
    <section className="relative overflow-hidden pt-10 pb-8 text-center sm:pt-14 sm:pb-12">
      {/* Subtle background ambient gradients */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-gradient-to-tr from-[#1B3B6F]/20 via-[#C5A880]/10 to-transparent blur-3xl rounded-full pointer-events-none -z-10" />

      {/* Trust pill */}
      <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#12233C]/80 border border-[#C5A880]/30 text-[#E0C9A6] text-xs font-medium tracking-wide shadow-sm mb-5">
        <Sparkles className="w-3.5 h-3.5 text-[#D4AF37]" />
        <span>AI-Powered Legal Drafting Engine</span>
        <span className="w-1 h-1 rounded-full bg-[#C5A880]" />
        <span className="text-slate-300">Enforceable & Structured</span>
      </div>

      {/* Main Tagline */}
      <h1 className="text-4xl sm:text-5xl md:text-6xl font-serif font-bold text-[#FBF8F1] tracking-tight max-w-4xl mx-auto leading-[1.15]">
        Legal documents, <span className="italic text-[#D4AF37] font-normal">made simple.</span>
      </h1>

      {/* Editorial subtitle */}
      <p className="mt-4 text-base sm:text-lg text-slate-300 max-w-2xl mx-auto leading-relaxed font-sans font-light">
        Draft rigorous, court-tested agreements in minutes. Define your parties, specify operative covenants, and receive an authentic paper-ready contract with complete boilerplate.
      </p>

      {/* Quick preset selector buttons */}
      <div className="mt-8 flex flex-wrap items-center justify-center gap-2 sm:gap-3 max-w-3xl mx-auto px-4">
        <span className="text-xs uppercase tracking-wider text-[#A99375] font-semibold mr-1 w-full sm:w-auto text-center">
          Quick Start:
        </span>
        {presets.map((preset) => {
          const isSelected = activeType === preset.type;
          return (
            <button
              key={preset.type}
              type="button"
              onClick={() => onSelectPreset(preset.type)}
              className={`px-3.5 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all duration-200 border flex items-center gap-2 ${
                isSelected
                  ? 'bg-[#C5A880] text-[#0A1424] border-[#C5A880] shadow-md shadow-[#C5A880]/20 font-semibold'
                  : 'bg-[#0E1D33]/90 text-slate-200 border-slate-700/80 hover:border-[#C5A880]/50 hover:bg-[#152742]'
              }`}
            >
              {isSelected && <CheckCircle2 className="w-3.5 h-3.5 text-[#0A1424]" />}
              <span>{preset.label}</span>
            </button>
          );
        })}
      </div>

      {/* Value pillars */}
      <div className="mt-8 grid grid-cols-1 sm:grid-cols-3 gap-4 max-w-3xl mx-auto text-left px-4">
        <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0F1E36]/60 border border-slate-800/80">
          <div className="p-2 rounded-lg bg-[#182C4B] text-[#D4AF37] shrink-0">
            <ShieldCheck className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-semibold text-slate-200">Formal Recitals & Boilers</h2>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
              Includes severability, choice of venue, entire agreement, and counter-signatures.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0F1E36]/60 border border-slate-800/80">
          <div className="p-2 rounded-lg bg-[#182C4B] text-[#D4AF37] shrink-0">
            <FileText className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-semibold text-slate-200">Paper-Style Ivory View</h2>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
              Authentic contract aesthetic with inline live editing and word counts.
            </p>
          </div>
        </div>

        <div className="flex items-start gap-3 p-3 rounded-xl bg-[#0F1E36]/60 border border-slate-800/80">
          <div className="p-2 rounded-lg bg-[#182C4B] text-[#D4AF37] shrink-0">
            <Download className="w-4 h-4" />
          </div>
          <div>
            <h2 className="text-xs font-semibold text-slate-200">DOCX, PDF & TXT Exports</h2>
            <p className="text-[11px] text-slate-400 mt-0.5 leading-normal">
              Export directly to Word, print to PDF, or copy clean text with 1 click.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};
