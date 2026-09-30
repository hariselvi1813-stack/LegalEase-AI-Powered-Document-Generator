import React, { useState, useMemo, useEffect } from 'react';
import { CLAUSE_LIBRARY, BoilerplateClause } from '../data/clauseLibrary';
import {
  BookOpen,
  Search,
  X,
  Plus,
  Check,
  Copy,
  AlertCircle,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface ClauseLibraryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsertClause: (clauseText: string, clauseTitle: string) => void;
}

const CATEGORIES = [
  'ALL',
  'Boilerplate',
  'Risk & Liability',
  'Dispute & Law',
  'Covenants',
  'Execution',
];

export const ClauseLibraryModal: React.FC<ClauseLibraryModalProps> = ({
  isOpen,
  onClose,
  onInsertClause,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('ALL');
  const [expandedClauseIds, setExpandedClauseIds] = useState<Record<string, boolean>>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [recentlyInsertedId, setRecentlyInsertedId] = useState<string | null>(null);

  // Close on Escape key
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  // Filter clauses
  const filteredClauses = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return CLAUSE_LIBRARY.filter((clause) => {
      const matchesCategory =
        selectedCategory === 'ALL' || clause.category === selectedCategory;
      if (!matchesCategory) return false;
      if (!q) return true;

      const titleMatch = clause.title.toLowerCase().includes(q);
      const descMatch = clause.description.toLowerCase().includes(q);
      const tagsMatch = clause.tags.some((t) => t.toLowerCase().includes(q));
      const textMatch = clause.text.toLowerCase().includes(q);

      return titleMatch || descMatch || tagsMatch || textMatch;
    });
  }, [searchQuery, selectedCategory]);

  const toggleExpand = (id: string) => {
    setExpandedClauseIds((prev) => ({
      ...prev,
      [id]: !prev[id],
    }));
  };

  const handleCopyClause = async (clause: BoilerplateClause, e: React.MouseEvent) => {
    e.stopPropagation();
    try {
      await navigator.clipboard.writeText(clause.text);
      setCopiedId(clause.id);
      setTimeout(() => setCopiedId(null), 2000);
    } catch (err) {
      console.error('Failed to copy clause:', err);
    }
  };

  const handleInsert = (clause: BoilerplateClause) => {
    onInsertClause(clause.text, clause.title);
    setRecentlyInsertedId(clause.id);
    setTimeout(() => setRecentlyInsertedId(null), 2500);
  };

  if (!isOpen) return null;

  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-labelledby="clause-library-title"
      className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/75 backdrop-blur-sm animate-in fade-in duration-200"
    >
      {/* Modal Container (16px radius, #FFFFFF / #FFF9FA, #FD1843 border) */}
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-[#FFFFFF] border-2 border-[#FD1843] rounded-[16px] shadow-2xl flex flex-col overflow-hidden text-[#0B0B0B]">
        {/* Header */}
        <header className="p-6 border-b border-[#0B0B0B]/10 bg-[#FFF9FA] shrink-0">
          <div className="flex items-start justify-between gap-4">
            <div>
              <div className="inline-flex items-center gap-1.5 px-3 py-0.5 rounded-full border border-[#FD1843] text-[#FD1843] text-[10px] font-mono font-bold uppercase tracking-widest mb-1.5">
                <BookOpen className="w-3 h-3" />
                <span>Standardized Legal Provisions</span>
              </div>
              <h2
                id="clause-library-title"
                className="font-editorial-heading text-2xl sm:text-3xl text-[#0B0B0B] tracking-wider uppercase"
              >
                BOILERPLATE <span className="text-[#FD1843]">CLAUSE LIBRARY</span>
              </h2>
              <p className="text-xs text-[#0B0B0B]/60 font-sans mt-0.5">
                Select and insert court-tested legal covenants directly into your contract draft.
              </p>
            </div>
            {/* Close Button */}
            <button
              type="button"
              onClick={onClose}
              className="p-2 rounded-full bg-[#FFFFFF] border border-[#0B0B0B]/20 text-[#0B0B0B]/70 hover:text-[#FD1843] hover:border-[#FD1843] transition-colors cursor-pointer"
              aria-label="Close clause library"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Search & Categories Bar */}
          <div className="mt-4 space-y-3">
            {/* Search Input */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3.5 top-1/2 -translate-y-1/2 text-[#0B0B0B]/40" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search clauses by keyword (e.g., 'Force Majeure', 'Indemnification', 'Arbitration', 'Liability')..."
                className="w-full bg-[#FFFFFF] border border-[#0B0B0B]/20 rounded-full py-2 pl-10 pr-10 text-xs sm:text-sm font-mono text-[#0B0B0B] placeholder-[#0B0B0B]/40 focus:outline-none focus:border-[#FD1843]"
                autoFocus
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#0B0B0B]/40 hover:text-[#0B0B0B] text-xs cursor-pointer"
                >
                  ✕
                </button>
              )}
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none text-[11px] font-mono font-bold">
              {CATEGORIES.map((cat) => (
                <button
                  key={cat}
                  type="button"
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-3 py-1 rounded-full uppercase transition-all shrink-0 cursor-pointer ${
                    selectedCategory === cat
                      ? 'bg-[#FD1843] text-white font-bold shadow-sm'
                      : 'bg-[#FFFFFF] text-[#0B0B0B]/70 hover:text-[#0B0B0B] border border-[#0B0B0B]/15'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>
          </div>
        </header>

        {/* Clauses List Body */}
        <div className="flex-1 overflow-y-auto p-6 space-y-4 scrollbar-thin bg-[#FFF9FA]">
          {filteredClauses.length === 0 ? (
            <div className="py-16 text-center text-[#0B0B0B]/40 font-mono text-xs space-y-3">
              <AlertCircle className="w-8 h-8 mx-auto text-[#0B0B0B]/20" />
              <p>No clauses found matching "{searchQuery}" in category "{selectedCategory}"</p>
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('ALL');
                }}
                className="text-[#FD1843] underline text-xs cursor-pointer"
              >
                Reset search & categories
              </button>
            </div>
          ) : (
            filteredClauses.map((clause) => {
              const isExpanded = expandedClauseIds[clause.id] ?? false;
              const isInserted = recentlyInsertedId === clause.id;
              const isCopied = copiedId === clause.id;

              return (
                <article
                  key={clause.id}
                  className="p-5 rounded-[16px] bg-[#FFFFFF] border border-[#0B0B0B]/10 hover:border-[#FD1843] transition-all space-y-3 group shadow-sm"
                >
                  {/* Title & Category Row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-editorial-heading text-lg sm:text-xl text-[#0B0B0B] tracking-wide group-hover:text-[#FD1843] transition-colors">
                        {clause.title}
                      </h3>
                      <span className="text-[10px] font-mono uppercase px-2.5 py-0.5 rounded-full bg-[#FFF9FA] border border-[#FD1843]/40 text-[#FD1843]">
                        {clause.category}
                      </span>
                    </div>

                    {/* Action Buttons: Copy & Insert */}
                    <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
                      {/* Copy Text */}
                      <button
                        type="button"
                        onClick={(e) => handleCopyClause(clause, e)}
                        className="p-2 rounded-full border border-[#0B0B0B]/15 text-[#0B0B0B]/70 hover:text-[#FD1843] hover:border-[#FD1843] text-xs font-mono transition-colors cursor-pointer"
                        title="Copy clause text"
                      >
                        {isCopied ? (
                          <Check className="w-3.5 h-3.5 text-emerald-600" />
                        ) : (
                          <Copy className="w-3.5 h-3.5" />
                        )}
                      </button>

                      {/* Primary Insert Button */}
                      <button
                        type="button"
                        onClick={() => handleInsert(clause)}
                        className={`px-4 py-1.5 rounded-full text-xs font-mono font-bold uppercase tracking-wider transition-all duration-200 flex items-center gap-1.5 cursor-pointer shadow-sm active:scale-95 ${
                          isInserted
                            ? 'bg-emerald-600 text-white'
                            : 'bg-[#FD1843] text-white hover:bg-[#0B0B0B]'
                        }`}
                      >
                        {isInserted ? (
                          <>
                            <Check className="w-3.5 h-3.5" />
                            <span>Inserted!</span>
                          </>
                        ) : (
                          <>
                            <Plus className="w-3.5 h-3.5" />
                            <span>Insert into Contract</span>
                          </>
                        )}
                      </button>
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-xs text-[#0B0B0B]/75 font-sans leading-relaxed">
                    {clause.description}
                  </p>

                  {/* Legal Text Snippet & Expandable Box */}
                  <div className="pt-2">
                    <button
                      type="button"
                      onClick={() => toggleExpand(clause.id)}
                      className="text-[11px] font-mono text-[#FD1843] hover:underline flex items-center gap-1 cursor-pointer mb-2 font-bold"
                    >
                      {isExpanded ? (
                        <>
                          <ChevronUp className="w-3.5 h-3.5" /> Hide Legal Text
                        </>
                      ) : (
                        <>
                          <ChevronDown className="w-3.5 h-3.5" /> Preview Legal Contract Wording
                        </>
                      )}
                    </button>

                    {isExpanded && (
                      <div className="p-4 rounded-[12px] bg-[#FFF9FA] border border-[#0B0B0B]/15 text-xs font-mono text-[#0B0B0B] whitespace-pre-wrap leading-relaxed animate-in fade-in duration-150">
                        {clause.text}
                      </div>
                    )}
                  </div>

                  {/* Tags */}
                  <div className="flex items-center gap-1.5 flex-wrap pt-1">
                    {clause.tags.map((tag) => (
                      <span
                        key={tag}
                        className="text-[9px] font-mono text-[#0B0B0B]/50 uppercase bg-[#FFF9FA] border border-[#0B0B0B]/10 px-2 py-0.5 rounded"
                      >
                        #{tag}
                      </span>
                    ))}
                  </div>
                </article>
              );
            })
          )}
        </div>

        {/* Modal Footer */}
        <footer className="p-4 border-t border-[#0B0B0B]/10 bg-[#FFFFFF] flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-[#0B0B0B]/50 gap-2 shrink-0">
          <span>Clicking "Insert into Contract" appends the clause right before the execution block.</span>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 rounded-full border border-[#0B0B0B]/20 text-[#0B0B0B] hover:border-[#FD1843] hover:text-[#FD1843] text-xs uppercase cursor-pointer"
          >
            Done
          </button>
        </footer>
      </div>
    </div>
  );
};
