import React, { useState } from 'react';
import { AlertCircle, CheckCircle2, RefreshCw, Settings, Sparkles, WifiOff } from 'lucide-react';
import { API_BASE_URL } from '../config';

interface DemoBannerProps {
  isUnreachable: boolean;
  isDemoMode: boolean;
  errorMessage?: string;
  onEnableDemoMode: () => void;
  onRetryConnection: () => void;
  currentBaseUrl: string;
  onChangeBaseUrl: (url: string) => void;
}

export const DemoBanner: React.FC<DemoBannerProps> = ({
  isUnreachable,
  isDemoMode,
  errorMessage,
  onEnableDemoMode,
  onRetryConnection,
  currentBaseUrl,
  onChangeBaseUrl,
}) => {
  const [showConfig, setShowConfig] = useState(false);
  const [tempUrl, setTempUrl] = useState(currentBaseUrl);

  const handleSaveUrl = () => {
    onChangeBaseUrl(tempUrl.trim());
    setShowConfig(false);
    onRetryConnection();
  };

  if (!isUnreachable && !isDemoMode) {
    return null;
  }

  return (
    <div className="no-print my-4 p-4 rounded-xl bg-[#14233D] border border-amber-500/40 text-slate-200 shadow-md">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 shrink-0 mt-0.5 sm:mt-0">
            {isUnreachable ? <WifiOff className="w-5 h-5" /> : <Sparkles className="w-5 h-5" />}
          </div>
          <div>
            <h2 className="text-sm font-semibold text-amber-300 flex items-center gap-2">
              {isUnreachable
                ? 'Backend Service Unreachable - Demo Mode Active'
                : 'Demo Mode Activated'}
            </h2>
            <p className="text-xs text-slate-300 mt-0.5 leading-relaxed">
              {isUnreachable
                ? errorMessage ||
                  `The backend at "${currentBaseUrl || 'local /api'}" is unreachable. Using high-fidelity demo mode with full sample templates.`
                : 'Generating and previewing documents with verified local legal templates and sample covenants.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
          <button
            type="button"
            onClick={onRetryConnection}
            className="px-3 py-1.5 rounded-lg bg-[#1C3252] border border-slate-600 text-xs font-medium text-slate-200 hover:bg-[#25426C] transition-colors flex items-center gap-1.5"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Retry
          </button>
          {!isDemoMode && isUnreachable && (
            <button
              type="button"
              onClick={onEnableDemoMode}
              className="px-3 py-1.5 rounded-lg bg-[#C5A880] text-[#0A1424] text-xs font-semibold hover:bg-[#D4AF37] transition-colors"
            >
              Continue in Demo Mode
            </button>
          )}
          <button
            type="button"
            onClick={() => setShowConfig(!showConfig)}
            className="p-1.5 rounded-lg bg-[#1C3252] border border-slate-600 text-slate-300 hover:text-white"
            title="Configure backend base URL"
          >
            <Settings className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Config Drawer for Base URL */}
      {showConfig && (
        <div className="mt-3 pt-3 border-t border-slate-700/60 flex flex-col sm:flex-row gap-2 items-center text-xs">
          <label className="text-slate-300 shrink-0 font-medium">Backend Base URL:</label>
          <input
            type="text"
            value={tempUrl}
            onChange={(e) => setTempUrl(e.target.value)}
            placeholder="Leave blank for same-origin /api or enter https://..."
            className="flex-1 w-full bg-[#0D182A] border border-slate-700 rounded-md px-3 py-1.5 text-xs text-slate-100 focus:outline-none focus:ring-1 focus:ring-[#C5A880]"
          />
          <button
            type="button"
            onClick={handleSaveUrl}
            className="px-3 py-1.5 rounded-md bg-[#C5A880] text-[#0A1424] font-semibold hover:bg-[#D4AF37]"
          >
            Apply & Test
          </button>
        </div>
      )}
    </div>
  );
};
