import React, { useState } from 'react';
import { Copy, Check, FileCode, Terminal } from 'lucide-react';

interface CodeSnippet {
  filename: string;
  language: string;
  description: string;
  code: string;
}

const SNIPPETS: CodeSnippet[] = [
  {
    filename: 'theme/colors.css',
    language: 'css',
    description: 'CSS variables defining the vivid modern theme color palette.',
    code: `:root {
  --primary: #FD1843;       /* Vivid pink-red */
  --background: #FFF9FA;    /* Soft warm white */
  --accent: #0B0B0B;        /* Near-black */
}`,
  },
  {
    filename: 'components/Pill.tsx',
    language: 'tsx',
    description: 'Pill button component with rounded-full shape and active scale.',
    code: `import React from 'react';

export const Pill: React.FC<{ label: string; onClick?: () => void }> = ({ label, onClick }) => (
  <button
    onClick={onClick}
    className="rounded-full px-5 py-2 bg-[#FD1843] text-white hover:bg-[#0B0B0B] text-xs font-mono font-bold uppercase transition-all duration-200 active:scale-95 cursor-pointer"
  >
    {label}
  </button>
);`,
  },
];

export const CodeViewer: React.FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [copied, setCopied] = useState(false);

  const activeSnippet = SNIPPETS[activeTab] || SNIPPETS[0];

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(activeSnippet.code);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy code: ', err);
    }
  };

  return (
    <div className="w-full bg-[#FFFFFF] border-2 border-[#FD1843]/30 rounded-[16px] p-5 sm:p-8 text-[#0B0B0B] select-none shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-[#0B0B0B]/10 gap-4">
        <div>
          <span className="text-[10px] sm:text-xs font-mono font-bold uppercase tracking-[0.24em] text-[#FD1843] flex items-center gap-2">
            <Terminal className="w-4 h-4 text-[#FD1843]" />
            THEME CODE ARCHITECTURE
          </span>
          <h2 className="font-editorial-heading text-2xl sm:text-3xl text-[#0B0B0B] tracking-tight uppercase mt-1">
            Production CSS & TSX
          </h2>
        </div>
        <button
          type="button"
          onClick={handleCopy}
          className="px-4 py-2 rounded-full border-2 border-[#FD1843] text-[#FD1843] hover:bg-[#FD1843] hover:text-white text-xs font-mono font-bold tracking-wider uppercase transition-all duration-200 flex items-center gap-2 self-start sm:self-auto cursor-pointer"
        >
          {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
          <span>{copied ? 'Copied!' : 'Copy Code'}</span>
        </button>
      </div>

      <div className="flex items-center gap-2 pt-4 pb-3 overflow-x-auto">
        {SNIPPETS.map((snip, index) => {
          const isActive = activeTab === index;
          return (
            <button
              key={snip.filename}
              type="button"
              onClick={() => setActiveTab(index)}
              className={`px-3 py-1.5 rounded-full text-xs font-mono font-bold tracking-wider uppercase transition-colors shrink-0 cursor-pointer ${
                isActive
                  ? 'bg-[#FD1843] text-white border-2 border-[#FD1843]'
                  : 'bg-[#FFF9FA] text-[#0B0B0B]/70 border border-[#0B0B0B]/15 hover:border-[#FD1843]'
              }`}
            >
              {snip.filename}
            </button>
          );
        })}
      </div>

      <div className="relative rounded-[12px] bg-[#0B0B0B] text-white p-4 sm:p-6 overflow-x-auto">
        <pre className="font-mono text-xs sm:text-sm leading-relaxed whitespace-pre text-white/90">
          <code>{activeSnippet.code}</code>
        </pre>
      </div>
    </div>
  );
};
