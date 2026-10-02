import React, { useState } from 'react';
import { generateCSourceCode, downloadCSourceCode } from '../utils/fileHandling';
import { Code2, Copy, Check, Download, X, Terminal, Cpu } from 'lucide-react';

interface CSourceInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CSourceInspectorModal: React.FC<CSourceInspectorModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  const [copied, setCopied] = useState(false);
  const code = generateCSourceCode();

  const handleCopy = () => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-blue-500/10 text-blue-400 rounded-lg">
              <Code2 className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <span>C Source Implementation</span>
                <span className="text-[11px] font-mono px-2 py-0.5 bg-slate-700 text-slate-300 rounded">
                  payroll_system.c
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Pure C99 & Win32 API implementation with file handling and structures
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-slate-700 hover:bg-slate-600 text-slate-200 rounded transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy Code'}</span>
            </button>
            <button
              onClick={downloadCSourceCode}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Download .C File</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-700 transition-colors cursor-pointer ml-1"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Technical Concepts Header */}
        <div className="px-6 py-3 bg-slate-950/60 border-b border-slate-800 grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
          <div>
            <span className="text-slate-500 block text-[10px]">Data Architecture</span>
            <span className="font-mono text-slate-300">struct Employee (296B)</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Persistence Mode</span>
            <span className="font-mono text-slate-300">fopen &quot;rb+&quot; / fwrite</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">GUI Subsystem</span>
            <span className="font-mono text-slate-300">Win32 API (comctl32)</span>
          </div>
          <div>
            <span className="text-slate-500 block text-[10px]">Salary Engine</span>
            <span className="font-mono text-slate-300">Automated HRA/DA/PF</span>
          </div>
        </div>

        {/* Code Content */}
        <div className="flex-1 overflow-auto p-4 bg-slate-950 font-mono text-xs text-slate-300 leading-relaxed select-text">
          <pre className="overflow-x-auto whitespace-pre">
            <code>{code}</code>
          </pre>
        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-800/80 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
          <span>Target Compiler: GCC / MinGW / MSVC (cl.exe payroll_system.c -lcomctl32 -luser32 -lgdi32)</span>
          <span>Size: ~8.4 KB · 250+ Lines</span>
        </div>

      </div>
    </div>
  );
};
