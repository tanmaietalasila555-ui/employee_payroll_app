import React, { useState } from 'react';
import { Employee } from '../types/payroll';
import { STRUCT_FIELD_LAYOUT, TOTAL_STRUCT_SIZE } from '../utils/fileHandling';
import { Cpu, Binary, Layers, X, FileText } from 'lucide-react';

interface MemoryInspectorModalProps {
  isOpen: boolean;
  onClose: () => void;
  employees: Employee[];
}

export const MemoryInspectorModal: React.FC<MemoryInspectorModalProps> = ({
  isOpen,
  onClose,
  employees,
}) => {
  if (!isOpen) return null;

  const [selectedEmpIndex, setSelectedEmpIndex] = useState(0);
  const currentEmp = employees[selectedEmpIndex] || employees[0];

  // Generate simulated hex dump for the current employee's struct in memory
  const hexLines = React.useMemo(() => {
    if (!currentEmp) return [];

    // Construct mock byte stream based on employee record
    const encoder = new TextEncoder();
    const bytes = new Uint8Array(TOTAL_STRUCT_SIZE);

    // Write empId (32-bit int)
    const view = new DataView(bytes.buffer);
    view.setInt32(0, currentEmp.empId, true);

    // Helper to write string to byte offset
    const writeString = (str: string, offset: number, maxLen: number) => {
      const encoded = encoder.encode(str);
      for (let i = 0; i < maxLen; i++) {
        bytes[offset + i] = i < encoded.length ? encoded[i] : 0;
      }
    };

    writeString(currentEmp.code, 4, 16);
    writeString(currentEmp.name, 20, 50);
    writeString(currentEmp.department, 70, 30);
    writeString(currentEmp.designation, 100, 30);
    writeString(currentEmp.phone, 130, 15);
    writeString(currentEmp.email, 145, 50);
    writeString(currentEmp.dateOfJoining, 195, 12);
    writeString(currentEmp.bankAccount, 207, 24);

    view.setFloat64(232, currentEmp.basicSalary, true);
    view.setFloat64(240, currentEmp.hra, true);
    view.setFloat64(248, currentEmp.da, true);
    view.setFloat64(256, currentEmp.medicalAllowance, true);
    view.setFloat64(264, currentEmp.pf, true);
    view.setFloat64(272, currentEmp.tax, true);
    view.setFloat64(280, currentEmp.grossSalary, true);
    view.setFloat64(288, currentEmp.netSalary, true);

    // Format into 16-byte hex dump rows
    const lines = [];
    for (let i = 0; i < TOTAL_STRUCT_SIZE; i += 16) {
      const offsetHex = '0x' + i.toString(16).padStart(4, '0').toUpperCase();
      const chunk = bytes.slice(i, i + 16);
      
      let hexPart = '';
      let asciiPart = '';
      for (let j = 0; j < 16; j++) {
        if (j < chunk.length) {
          const byteVal = chunk[j];
          hexPart += byteVal.toString(16).padStart(2, '0').toUpperCase() + ' ';
          asciiPart += byteVal >= 32 && byteVal <= 126 ? String.fromCharCode(byteVal) : '.';
        } else {
          hexPart += '   ';
        }
      }
      lines.push({ offsetHex, hexPart: hexPart.trim(), asciiPart });
    }
    return lines;
  }, [currentEmp]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-4xl bg-slate-900 border border-slate-700 rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/10 text-emerald-400 rounded-lg">
              <Binary className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-sm font-semibold text-white flex items-center gap-2">
                <span>C Struct Memory & File Handling Inspector</span>
                <span className="text-[11px] font-mono px-2 py-0.5 bg-slate-700 text-emerald-300 rounded">
                  sizeof(Employee) = {TOTAL_STRUCT_SIZE} bytes
                </span>
              </h2>
              <p className="text-xs text-slate-400">
                Binary representation of in-memory struct written to <code>records.dat</code>
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <select
              value={selectedEmpIndex}
              onChange={(e) => setSelectedEmpIndex(Number(e.target.value))}
              className="bg-slate-700 border border-slate-600 rounded px-2.5 py-1 text-xs text-white focus:outline-none"
            >
              {employees.map((emp, idx) => (
                <option key={emp.empId} value={idx}>
                  {emp.code} - {emp.name}
                </option>
              ))}
            </select>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Content Tabs / Split */}
        <div className="flex-1 grid grid-cols-1 md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-slate-800 overflow-hidden">
          
          {/* Left: Struct Field Alignment & Offsets */}
          <div className="p-4 overflow-y-auto max-h-[500px]">
            <h3 className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-1.5">
              <Layers className="w-4 h-4 text-blue-400" />
              <span>struct Employee Member Offsets</span>
            </h3>

            <div className="space-y-1.5 text-xs font-mono">
              {STRUCT_FIELD_LAYOUT.map((field) => (
                <div
                  key={field.fieldName}
                  className="p-2 rounded bg-slate-800/60 border border-slate-700/60 flex items-center justify-between"
                >
                  <div>
                    <span className="text-blue-400 font-bold">{field.cType}</span>{' '}
                    <span className="text-slate-200">{field.fieldName};</span>
                    <span className="block text-[10px] text-slate-400 font-sans mt-0.5">
                      {field.description}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="text-[11px] text-emerald-400 block tabular-nums">
                      +{field.offsetBytes} B
                    </span>
                    <span className="text-[10px] text-slate-500 tabular-nums">
                      {field.sizeBytes} bytes
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Right: Live Binary Hex Dump */}
          <div className="p-4 bg-slate-950 overflow-y-auto max-h-[500px] font-mono text-[11px]">
            <h3 className="text-xs font-semibold text-slate-300 mb-3 flex items-center gap-1.5 font-sans">
              <Cpu className="w-4 h-4 text-emerald-400" />
              <span>Simulated Hex Dump [records.dat at record #{selectedEmpIndex}]</span>
            </h3>

            <div className="text-slate-500 border-b border-slate-800 pb-1 mb-2 flex justify-between">
              <span>Offset</span>
              <span>00 01 02 03 04 05 06 07 08 09 0A 0B 0C 0D 0E 0F</span>
              <span>Decoded ASCII</span>
            </div>

            <div className="space-y-1 select-text">
              {hexLines.map((line, idx) => (
                <div key={idx} className="flex justify-between items-center text-slate-300 hover:bg-slate-900 px-1 py-0.5 rounded">
                  <span className="text-slate-500">{line.offsetHex}</span>
                  <span className="text-emerald-400 tracking-wide font-medium">{line.hexPart}</span>
                  <span className="text-amber-200/90">{line.asciiPart}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

        {/* Footer info */}
        <div className="px-6 py-3 bg-slate-800/80 border-t border-slate-700 flex items-center justify-between text-xs text-slate-400">
          <span>File Pointer Offset: record_index × sizeof(struct Employee)</span>
          <span className="font-mono text-emerald-400">
            Total Database Size: {(employees.length * TOTAL_STRUCT_SIZE).toLocaleString()} bytes
          </span>
        </div>

      </div>
    </div>
  );
};
