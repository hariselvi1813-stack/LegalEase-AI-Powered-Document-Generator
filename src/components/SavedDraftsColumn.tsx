import React, { useState, useMemo } from 'react';
import { DocumentType, Party } from '../types';
import {
  FolderClock,
  Plus,
  Search,
  Trash2,
  Copy,
  Clock,
  Save,
  CheckCircle2,
  Layers,
} from 'lucide-react';

export interface SavedDraft {
  id: string;
  title: string;
  documentType: DocumentType;
  customTitle: string;
  parties: Party[];
  terms: string[];
  effectiveDate: string;
  jurisdiction: string;
  content?: string;
  summary?: string;
  status: 'draft' | 'generated';
  updatedAt: string; // ISO string
}

interface SavedDraftsColumnProps {
  drafts: SavedDraft[];
  activeDraftId: string | null;
  onSelectDraft: (draft: SavedDraft) => void;
  onSaveCurrentAsDraft: () => void;
  onCreateNewDraft: () => void;
  onDeleteDraft: (id: string, e: React.MouseEvent) => void;
  onDuplicateDraft: (draft: SavedDraft, e: React.MouseEvent) => void;
  isCurrentSaved?: boolean;
}

export const SavedDraftsColumn: React.FC<SavedDraftsColumnProps> = ({
  drafts = [],
  activeDraftId,
  onSelectDraft,
  onSaveCurrentAsDraft,
  onCreateNewDraft,
  onDeleteDraft,
  onDuplicateDraft,
  isCurrentSaved,
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredDrafts = useMemo(() => {
    const q = searchQuery.trim().toLowerCase();
    return (drafts || []).filter((draft) => {
      if (!draft) return false;
      const title = (draft.title || draft.customTitle || '').toLowerCase();
      const docType = (draft.documentType || '').toLowerCase();
      const partiesMatch = Array.isArray(draft.parties)
        ? draft.parties.some(
            (p) =>
              (p?.name || '').toLowerCase().includes(q) ||
              (p?.role || '').toLowerCase().includes(q)
          )
        : false;

      const matchesSearch = !q || title.includes(q) || docType.includes(q) || partiesMatch;
      if (filterType === 'ALL') return matchesSearch;
      if (filterType === 'GENERATED') return matchesSearch && draft.status === 'generated';
      if (filterType === 'DRAFT') return matchesSearch && draft.status === 'draft';
      return matchesSearch && draft.documentType === filterType;
    });
  }, [drafts, searchQuery, filterType]);

  const formatDate = (isoStr?: string) => {
    if (!isoStr) return 'Recently';
    try {
      const date = new Date(isoStr);
      if (isNaN(date.getTime())) return 'Recently';
      const now = new Date();
      const diffMs = now.getTime() - date.getTime();
      const diffMins = Math.floor(diffMs / 60000);
      const diffHours = Math.floor(diffMins / 60);
      const diffDays = Math.floor(diffHours / 24);

      if (diffMins < 2) return 'Just now';
      if (diffMins < 60) return `${diffMins}m ago`;
      if (diffHours < 24) return `${diffHours}h ago`;
      if (diffDays === 1) return 'Yesterday';
      if (diffDays < 7) return `${diffDays}d ago`;
      return date.toLocaleDateString(undefined, {
        month: 'short',
        day: 'numeric',
      });
    } catch {
      return 'Recently';
    }
  };

  return (
    <aside
      aria-label="Saved and Draft Items Column"
      className="no-print bg-[#FFFFFF] border-2 border-[#FD1843]/30 rounded-[16px] p-5 flex flex-col h-full shadow-sm relative text-[#0B0B0B]"
    >
      {/* Column Header */}
      <div className="pb-4 border-b border-[#0B0B0B]/10">
        <div className="flex items-center justify-between gap-2 mb-3">
          <div className="flex items-center gap-2">
            <FolderClock className="w-5 h-5 text-[#FD1843]" />
            <h2 className="font-editorial-heading text-xl sm:text-2xl text-[#0B0B0B] tracking-wider uppercase">
              SAVED DRAFTS
            </h2>
            <span className="px-2 py-0.5 rounded-full bg-[#FFF9FA] border border-[#FD1843] text-[#FD1843] text-[10px] font-mono font-bold">
              {drafts.length}
            </span>
          </div>

          {/* Quick New Draft Button */}
          <button
            type="button"
            onClick={onCreateNewDraft}
            className="p-1.5 rounded-full bg-[#FFF9FA] border border-[#FD1843] text-[#FD1843] hover:bg-[#FD1843] hover:text-white transition-all duration-200 active:scale-95 cursor-pointer"
            title="Create blank draft"
            aria-label="Create blank draft"
          >
            <Plus className="w-4 h-4" />
          </button>
        </div>

        {/* Action Button: Save Current Work */}
        <button
          type="button"
          onClick={onSaveCurrentAsDraft}
          className="w-full py-2.5 px-4 rounded-full bg-[#FD1843] text-white hover:bg-[#0B0B0B] text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer active:scale-95 shadow-sm"
        >
          {isCurrentSaved ? (
            <>
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>DRAFT SAVED</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>SAVE CURRENT DRAFT</span>
            </>
          )}
        </button>

        {/* Search Input */}
        <div className="relative mt-3">
          <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-[#0B0B0B]/40" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search saved items..."
            className="w-full bg-[#FFF9FA] border border-[#0B0B0B]/15 rounded-full py-1.5 pl-9 pr-3 text-xs font-mono text-[#0B0B0B] placeholder-[#0B0B0B]/40 focus:outline-none focus:border-[#FD1843]"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-[#0B0B0B]/40 hover:text-[#0B0B0B] text-xs cursor-pointer"
            >
              ✕
            </button>
          )}
        </div>

        {/* Filter Pills */}
        <div className="flex items-center gap-1.5 mt-2.5 overflow-x-auto pb-1 scrollbar-none text-[10px] font-mono font-bold">
          {['ALL', 'GENERATED', 'DRAFT'].map((f) => (
            <button
              key={f}
              type="button"
              onClick={() => setFilterType(f)}
              className={`px-2.5 py-1 rounded-full uppercase transition-colors shrink-0 cursor-pointer ${
                filterType === f
                  ? 'bg-[#FD1843] text-white'
                  : 'bg-[#FFF9FA] text-[#0B0B0B]/70 hover:text-[#0B0B0B] border border-[#0B0B0B]/15'
              }`}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Items Scrollable List */}
      <div className="flex-1 overflow-y-auto mt-3 space-y-2.5 pr-1 max-h-[520px] lg:max-h-[640px] scrollbar-thin">
        {filteredDrafts.length === 0 ? (
          <div className="py-12 text-center text-[#0B0B0B]/40 font-mono text-xs space-y-3">
            <Layers className="w-8 h-8 mx-auto text-[#0B0B0B]/20" />
            <p>No saved drafts found</p>
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[#FD1843] underline text-[11px] cursor-pointer"
              >
                Clear search filter
              </button>
            )}
          </div>
        ) : (
          filteredDrafts.map((draft) => {
            const isActive = activeDraftId === draft.id;
            const draftTermsCount = Array.isArray(draft.terms) ? draft.terms.length : 0;
            const draftParties = Array.isArray(draft.parties) ? draft.parties : [];

            return (
              <div
                key={draft.id}
                onClick={() => onSelectDraft(draft)}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    onSelectDraft(draft);
                  }
                }}
                className={`group relative p-3.5 rounded-[14px] border transition-all duration-200 cursor-pointer select-none text-left ${
                  isActive
                    ? 'bg-[#FFF9FA] border-2 border-[#FD1843] shadow-sm'
                    : 'bg-[#FFFFFF] border border-[#0B0B0B]/15 hover:border-[#FD1843] hover:bg-[#FFF9FA]'
                }`}
              >
                {/* Active Indicator Bar */}
                {isActive && (
                  <div className="absolute left-0 top-3 bottom-3 w-1.5 bg-[#FD1843] rounded-r" />
                )}

                {/* Top Row: Type Badge + Date */}
                <div className="flex items-center justify-between gap-2 mb-1.5">
                  <div className="flex items-center gap-1.5">
                    <span
                      className={`text-[9px] font-mono font-bold tracking-wider px-2 py-0.5 rounded-full uppercase ${
                        draft.status === 'generated'
                          ? 'bg-[#FD1843]/10 text-[#FD1843] border border-[#FD1843]/30'
                          : 'bg-[#0B0B0B]/5 text-[#0B0B0B]/70 border border-[#0B0B0B]/15'
                      }`}
                    >
                      {draft.documentType || 'Custom'}
                    </span>
                    {draft.status === 'generated' && (
                      <span className="flex items-center gap-0.5 text-[8px] font-mono text-[#FD1843] font-bold">
                        <CheckCircle2 className="w-2.5 h-2.5" /> Ready
                      </span>
                    )}
                  </div>

                  <span className="text-[10px] font-mono text-[#0B0B0B]/50 flex items-center gap-1">
                    <Clock className="w-2.5 h-2.5" />
                    {formatDate(draft.updatedAt)}
                  </span>
                </div>

                {/* Document Title */}
                <h3 className="font-editorial-heading text-base sm:text-lg text-[#0B0B0B] group-hover:text-[#FD1843] transition-colors leading-tight truncate">
                  {draft.title || draft.customTitle || 'Untitled Agreement'}
                </h3>

                {/* Parties Preview */}
                <div className="mt-1 text-[11px] font-sans text-[#0B0B0B]/70 truncate">
                  {draftParties.map((p) => p.name || p.role).filter(Boolean).join(' • ') ||
                    'Parties defined upon execution'}
                </div>

                {/* Terms count & bottom actions */}
                <div className="mt-2.5 pt-2 border-t border-[#0B0B0B]/10 flex items-center justify-between text-[10px] font-mono text-[#0B0B0B]/50">
                  <span>
                    {draftTermsCount} clause{draftTermsCount !== 1 ? 's' : ''} •{' '}
                    {draft.effectiveDate || 'Undated'}
                  </span>

                  {/* Actions: Duplicate & Delete */}
                  <div className="flex items-center gap-1 opacity-70 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={(e) => onDuplicateDraft(draft, e)}
                      title="Duplicate this draft"
                      className="p-1 hover:text-[#FD1843] transition-colors cursor-pointer"
                      aria-label="Duplicate draft"
                    >
                      <Copy className="w-3 h-3" />
                    </button>
                    <button
                      type="button"
                      onClick={(e) => onDeleteDraft(draft.id, e)}
                      title="Delete this draft"
                      className="p-1 hover:text-[#FD1843] transition-colors cursor-pointer"
                      aria-label="Delete draft"
                    >
                      <Trash2 className="w-3 h-3" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Footer Info */}
      <div className="pt-3 mt-3 border-t border-[#0B0B0B]/10 flex items-center justify-between text-[10px] font-mono text-[#0B0B0B]/50">
        <span>Persistent Storage</span>
        <span className="text-[#FD1843] font-bold">LEGALEASE DRAFTS</span>
      </div>
    </aside>
  );
};
