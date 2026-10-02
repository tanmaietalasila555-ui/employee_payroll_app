import React, { useState } from 'react';
import { Employee, PayrollRules } from '../types/payroll';
import { formatCurrency } from '../utils/payrollCalculator';
import { TOTAL_STRUCT_SIZE, exportToCSV, exportToDat } from '../utils/fileHandling';
import {
  FileText,
  UserPlus,
  Edit3,
  Trash2,
  Printer,
  Save,
  Download,
  Sliders,
  Code2,
  Binary,
  RefreshCw,
  Search,
  FolderOpen,
  HelpCircle,
  Laptop,
} from 'lucide-react';

interface Win32WindowProps {
  employees: Employee[];
  rules: PayrollRules;
  selectedId: number | null;
  onSelectEmployee: (id: number) => void;
  onAddEmployee: () => void;
  onEditEmployee: (employee: Employee) => void;
  onDeleteEmployee: (employee: Employee) => void;
  onViewPayslip: (employee: Employee) => void;
  onOpenRules: () => void;
  onOpenCSource: () => void;
  onOpenMemory: () => void;
  onReload: () => void;
  onToggleViewMode: () => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  departmentFilter: string;
  setDepartmentFilter: (dept: string) => void;
}

export const Win32Window: React.FC<Win32WindowProps> = ({
  employees,
  rules,
  selectedId,
  onSelectEmployee,
  onAddEmployee,
  onEditEmployee,
  onDeleteEmployee,
  onViewPayslip,
  onOpenRules,
  onOpenCSource,
  onOpenMemory,
  onReload,
  onToggleViewMode,
  searchQuery,
  setSearchQuery,
  departmentFilter,
  setDepartmentFilter,
}) => {
  const [activeMenu, setActiveMenu] = useState<string | null>(null);
  const [statusMessage, setStatusMessage] = useState('Ready (Connected to records.dat)');

  const selectedEmployee = employees.find((e) => e.empId === selectedId) || null;

  const totalPayroll = employees.reduce((acc, curr) => acc + curr.netSalary, 0);
  const fileSize = employees.length * TOTAL_STRUCT_SIZE;

  // Filtered employees
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = departmentFilter === 'All' || emp.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const departments = ['All', ...Array.from(new Set(employees.map((e) => e.department)))];

  const handleMenuClick = (menu: string) => {
    setActiveMenu(activeMenu === menu ? null : menu);
  };

  const closeMenu = () => setActiveMenu(null);

  return (
    <div
      className="w-full max-w-6xl mx-auto my-4 bg-[#ece9d8] text-black win32-bevel-outset shadow-2xl font-win32 select-none relative"
      onClick={() => {
        if (activeMenu) closeMenu();
      }}
    >
      {/* 1. Win32 Title Bar */}
      <div className="flex items-center justify-between px-2 py-1 bg-gradient-to-r from-[#0a246a] via-[#1f4a9c] to-[#a6caf0] text-white font-bold text-xs select-none">
        <div className="flex items-center gap-1.5">
          {/* Win32 Executable Icon */}
          <div className="w-4 h-4 bg-slate-200 text-blue-900 font-black text-[10px] flex items-center justify-center rounded-xs shadow-inner">
            C
          </div>
          <span className="tracking-wide">
            Employee Payroll Management System - [C:\PAYROLL\records.dat]
          </span>
        </div>
        <div className="flex items-center gap-1">
          <button
            onClick={() => setStatusMessage('Window minimized to taskbar')}
            className="win32-button w-4 h-4 flex items-center justify-center text-black font-bold text-[10px] leading-none bg-[#dfdfdf] hover:bg-slate-300"
            title="Minimize"
          >
            _
          </button>
          <button
            onClick={() => setStatusMessage('Window at maximum resolution')}
            className="win32-button w-4 h-4 flex items-center justify-center text-black font-bold text-[10px] leading-none bg-[#dfdfdf] hover:bg-slate-300"
            title="Maximize"
          >
            □
          </button>
          <button
            onClick={() => setStatusMessage('To exit, close browser tab or switch views')}
            className="win32-button w-4 h-4 flex items-center justify-center text-black font-bold text-[10px] leading-none bg-[#dfdfdf] hover:bg-red-400"
            title="Close"
          >
            ✕
          </button>
        </div>
      </div>

      {/* 2. Win32 Menu Bar */}
      <div className="flex items-center px-1 py-0.5 bg-[#ece9d8] border-b border-[#808080] text-xs relative select-none">
        {/* File Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMenuClick('file');
            }}
            className={`px-2 py-0.5 hover:bg-[#0a246a] hover:text-white rounded-none cursor-pointer ${
              activeMenu === 'file' ? 'bg-[#0a246a] text-white' : 'text-black'
            }`}
          >
            <span className="underline">F</span>ile
          </button>
          {activeMenu === 'file' && (
            <div className="absolute left-0 top-full z-30 w-52 bg-[#ece9d8] win32-bevel-outset shadow-md py-1 text-xs">
              <button
                onClick={() => {
                  closeMenu();
                  onAddEmployee();
                }}
                className="w-full text-left px-4 py-1 hover:bg-[#0a246a] hover:text-white flex justify-between cursor-pointer"
              >
                <span>New Employee...</span>
                <span className="text-slate-500 hover:text-white font-mono">Ctrl+N</span>
              </button>
              <button
                onClick={() => {
                  closeMenu();
                  exportToDat(employees);
                  setStatusMessage('Saved binary payload to records.dat');
                }}
                className="w-full text-left px-4 py-1 hover:bg-[#0a246a] hover:text-white flex justify-between cursor-pointer"
              >
                <span>Save to records.dat</span>
                <span className="text-slate-500 hover:text-white font-mono">Ctrl+S</span>
              </button>
              <button
                onClick={() => {
                  closeMenu();
                  exportToCSV(employees);
                  setStatusMessage('Exported employee table to CSV');
                }}
                className="w-full text-left px-4 py-1 hover:bg-[#0a246a] hover:text-white flex justify-between cursor-pointer"
              >
                <span>Export CSV...</span>
                <span className="text-slate-500 hover:text-white font-mono">Ctrl+E</span>
              </button>
              <div className="border-t border-[#808080] my-1" />
              <button
                onClick={() => {
                  closeMenu();
                  if (selectedEmployee) onViewPayslip(selectedEmployee);
                }}
                disabled={!selectedEmployee}
                className="w-full text-left px-4 py-1 hover:bg-[#0a246a] hover:text-white flex justify-between disabled:text-slate-400 cursor-pointer"
              >
                <span>Print Salary Advice</span>
                <span className="text-slate-500 hover:text-white font-mono">Ctrl+P</span>
              </button>
              <div className="border-t border-[#808080] my-1" />
              <button
                onClick={() => {
                  closeMenu();
                  onToggleViewMode();
                }}
                className="w-full text-left px-4 py-1 hover:bg-[#0a246a] hover:text-white cursor-pointer"
              >
                Switch to Modern View
              </button>
            </div>
          )}
        </div>

        {/* Records Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMenuClick('records');
            }}
            className={`px-2 py-0.5 hover:bg-[#0a246a] hover:text-white rounded-none cursor-pointer ${
              activeMenu === 'records' ? 'bg-[#0a246a] text-white' : 'text-black'
            }`}
          >
            <span className="underline">R</span>ecords
          </button>
          {activeMenu === 'records' && (
            <div className="absolute left-0 top-full z-30 w-52 bg-[#ece9d8] win32-bevel-outset shadow-md py-1 text-xs">
              <button
                onClick={() => {
                  closeMenu();
                  onAddEmployee();
                }}
                className="w-full text-left px-4 py-1 hover:bg-[#0a246a] hover:text-white cursor-pointer"
              >
                Add Employee Record
              </button>
              <button
                onClick={() => {
                  closeMenu();
                  if (selectedEmployee) onEditEmployee(selectedEmployee);
                }}
                disabled={!selectedEmployee}
                className="w-full text-left px-4 py-1 hover:bg-[#0a246a] hover:text-white disabled:text-slate-400 cursor-pointer"
              >
                Edit Selected Record
              </button>
              <button
                onClick={() => {
                  closeMenu();
                  if (selectedEmployee) onDeleteEmployee(selectedEmployee);
                }}
                disabled={!selectedEmployee}
                className="w-full text-left px-4 py-1 hover:bg-[#0a246a] hover:text-white disabled:text-slate-400 cursor-pointer"
              >
                Delete Selected Record
              </button>
              <div className="border-t border-[#808080] my-1" />
              <button
                onClick={() => {
                  closeMenu();
                  onReload();
                  setStatusMessage('Reloaded records from disk file');
                }}
                className="w-full text-left px-4 py-1 hover:bg-[#0a246a] hover:text-white flex justify-between cursor-pointer"
              >
                <span>Reload from Disk</span>
                <span className="text-slate-500 font-mono">F5</span>
              </button>
            </div>
          )}
        </div>

        {/* Payroll Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMenuClick('payroll');
            }}
            className={`px-2 py-0.5 hover:bg-[#0a246a] hover:text-white rounded-none cursor-pointer ${
              activeMenu === 'payroll' ? 'bg-[#0a246a] text-white' : 'text-black'
            }`}
          >
            <span className="underline">P</span>ayroll
          </button>
          {activeMenu === 'payroll' && (
            <div className="absolute left-0 top-full z-30 w-56 bg-[#ece9d8] win32-bevel-outset shadow-md py-1 text-xs">
              <button
                onClick={() => {
                  closeMenu();
                  onOpenRules();
                }}
                className="w-full text-left px-4 py-1 hover:bg-[#0a246a] hover:text-white cursor-pointer"
              >
                Payroll Calculation Rules...
              </button>
              <button
                onClick={() => {
                  closeMenu();
                  if (selectedEmployee) onViewPayslip(selectedEmployee);
                }}
                disabled={!selectedEmployee}
                className="w-full text-left px-4 py-1 hover:bg-[#0a246a] hover:text-white disabled:text-slate-400 cursor-pointer"
              >
                Generate Payslip Advice
              </button>
            </div>
          )}
        </div>

        {/* View Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMenuClick('view');
            }}
            className={`px-2 py-0.5 hover:bg-[#0a246a] hover:text-white rounded-none cursor-pointer ${
              activeMenu === 'view' ? 'bg-[#0a246a] text-white' : 'text-black'
            }`}
          >
            <span className="underline">V</span>iew
          </button>
          {activeMenu === 'view' && (
            <div className="absolute left-0 top-full z-30 w-56 bg-[#ece9d8] win32-bevel-outset shadow-md py-1 text-xs">
              <button
                onClick={() => {
                  closeMenu();
                  onOpenMemory();
                }}
                className="w-full text-left px-4 py-1 hover:bg-[#0a246a] hover:text-white cursor-pointer"
              >
                C Struct Memory Inspector (Hex)
              </button>
              <button
                onClick={() => {
                  closeMenu();
                  onOpenCSource();
                }}
                className="w-full text-left px-4 py-1 hover:bg-[#0a246a] hover:text-white cursor-pointer"
              >
                C Source Code (payroll_system.c)
              </button>
              <div className="border-t border-[#808080] my-1" />
              <button
                onClick={() => {
                  closeMenu();
                  onToggleViewMode();
                }}
                className="w-full text-left px-4 py-1 hover:bg-[#0a246a] hover:text-white cursor-pointer"
              >
                Toggle Modern SaaS UI Mode
              </button>
            </div>
          )}
        </div>

        {/* Help Menu */}
        <div className="relative">
          <button
            onClick={(e) => {
              e.stopPropagation();
              handleMenuClick('help');
            }}
            className={`px-2 py-0.5 hover:bg-[#0a246a] hover:text-white rounded-none cursor-pointer ${
              activeMenu === 'help' ? 'bg-[#0a246a] text-white' : 'text-black'
            }`}
          >
            <span className="underline">H</span>elp
          </button>
          {activeMenu === 'help' && (
            <div className="absolute left-0 top-full z-30 w-56 bg-[#ece9d8] win32-bevel-outset shadow-md py-1 text-xs">
              <button
                onClick={() => {
                  closeMenu();
                  setStatusMessage('C Win32 System: Automated calculations & local file handling');
                }}
                className="w-full text-left px-4 py-1 hover:bg-[#0a246a] hover:text-white cursor-pointer"
              >
                About Payroll System
              </button>
            </div>
          )}
        </div>
      </div>

      {/* 3. Win32 Toolbar */}
      <div className="flex items-center gap-1 px-2 py-1 bg-[#ece9d8] border-b border-[#808080] overflow-x-auto text-xs">
        <button
          onClick={onAddEmployee}
          className="win32-button px-2.5 py-1 flex items-center gap-1.5 hover:bg-slate-200 cursor-pointer"
          title="Add New Employee Record"
        >
          <UserPlus className="w-3.5 h-3.5 text-emerald-700" />
          <span>Add Record</span>
        </button>

        <button
          onClick={() => selectedEmployee && onEditEmployee(selectedEmployee)}
          disabled={!selectedEmployee}
          className="win32-button px-2.5 py-1 flex items-center gap-1.5 hover:bg-slate-200 disabled:opacity-50 cursor-pointer"
          title="Edit Selected Employee Record"
        >
          <Edit3 className="w-3.5 h-3.5 text-blue-700" />
          <span>Edit</span>
        </button>

        <button
          onClick={() => selectedEmployee && onDeleteEmployee(selectedEmployee)}
          disabled={!selectedEmployee}
          className="win32-button px-2.5 py-1 flex items-center gap-1.5 hover:bg-slate-200 disabled:opacity-50 cursor-pointer"
          title="Delete Selected Employee Record"
        >
          <Trash2 className="w-3.5 h-3.5 text-red-700" />
          <span>Delete</span>
        </button>

        <div className="w-[1px] h-5 bg-[#808080] mx-1" />

        <button
          onClick={() => selectedEmployee && onViewPayslip(selectedEmployee)}
          disabled={!selectedEmployee}
          className="win32-button px-2.5 py-1 flex items-center gap-1.5 hover:bg-slate-200 disabled:opacity-50 cursor-pointer"
          title="Generate Formal Salary Slip"
        >
          <FileText className="w-3.5 h-3.5 text-slate-800" />
          <span>Pay Slip</span>
        </button>

        <button
          onClick={() => {
            exportToDat(employees);
            setStatusMessage('Saved records to records.dat');
          }}
          className="win32-button px-2.5 py-1 flex items-center gap-1.5 hover:bg-slate-200 cursor-pointer"
          title="Save records to records.dat"
        >
          <Save className="w-3.5 h-3.5 text-blue-800" />
          <span>Save File</span>
        </button>

        <button
          onClick={() => {
            exportToCSV(employees);
            setStatusMessage('Exported employee table to CSV');
          }}
          className="win32-button px-2.5 py-1 flex items-center gap-1.5 hover:bg-slate-200 cursor-pointer"
          title="Export CSV"
        >
          <Download className="w-3.5 h-3.5 text-slate-700" />
          <span>Export CSV</span>
        </button>

        <div className="w-[1px] h-5 bg-[#808080] mx-1" />

        <button
          onClick={onOpenRules}
          className="win32-button px-2.5 py-1 flex items-center gap-1.5 hover:bg-slate-200 cursor-pointer"
          title="Adjust Payroll Rules (HRA/DA/PF %)"
        >
          <Sliders className="w-3.5 h-3.5 text-slate-800" />
          <span>Rules ({rules.hraPercentage}%/{rules.daPercentage}%/{rules.pfPercentage}%)</span>
        </button>

        <button
          onClick={onOpenMemory}
          className="win32-button px-2.5 py-1 flex items-center gap-1.5 hover:bg-slate-200 cursor-pointer"
          title="Inspect C struct memory alignment and binary hex bytes"
        >
          <Binary className="w-3.5 h-3.5 text-emerald-800" />
          <span>Struct Map</span>
        </button>

        <button
          onClick={onOpenCSource}
          className="win32-button px-2.5 py-1 flex items-center gap-1.5 hover:bg-slate-200 cursor-pointer"
          title="View and download C source code"
        >
          <Code2 className="w-3.5 h-3.5 text-purple-800" />
          <span>C Code</span>
        </button>

        <div className="ml-auto">
          <button
            onClick={onToggleViewMode}
            className="win32-button px-3 py-1 flex items-center gap-1.5 hover:bg-blue-100 font-bold text-blue-900 cursor-pointer"
            title="Switch between Classic Win32 and Modern Enterprise Layout"
          >
            <Laptop className="w-3.5 h-3.5 text-blue-800" />
            <span>Modern Mode</span>
          </button>
        </div>
      </div>

      {/* 4. Win32 Search & Filter Panel (Controls) */}
      <div className="p-2 bg-[#ece9d8] border-b border-[#808080] flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 flex-1 max-w-md">
          <label className="text-slate-800 font-bold whitespace-nowrap">Search Record:</label>
          <div className="relative flex-1">
            <input
              type="text"
              placeholder="Search by ID, name, or title..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full px-2 py-1 bg-white border border-[#808080] win32-bevel-inset text-xs focus:outline-none"
            />
          </div>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="win32-button px-2 py-0.5 text-xs cursor-pointer"
            >
              Clear
            </button>
          )}
        </div>

        <div className="flex items-center gap-2">
          <label className="text-slate-800 font-bold whitespace-nowrap">Department:</label>
          <select
            value={departmentFilter}
            onChange={(e) => setDepartmentFilter(e.target.value)}
            className="px-2 py-1 bg-white border border-[#808080] win32-bevel-inset text-xs"
          >
            {departments.map((dept) => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
          <button
            onClick={onReload}
            className="win32-button px-2 py-1 flex items-center gap-1 cursor-pointer"
            title="Refresh from disk"
          >
            <RefreshCw className="w-3 h-3 text-slate-800" />
            <span>Refresh</span>
          </button>
        </div>
      </div>

      {/* 5. Win32 ListView (Table Grid) */}
      <div className="p-1 bg-[#ece9d8]">
        <div className="bg-white win32-bevel-inset overflow-x-auto min-h-[360px] max-h-[500px]">
          <table className="w-full border-collapse text-xs select-text">
            <thead>
              <tr className="bg-[#dfdfdf] border-b border-[#808080] text-slate-800 font-semibold text-left select-none sticky top-0 z-10">
                <th className="p-1.5 border-r border-[#808080] win32-bevel-outset">Emp ID</th>
                <th className="p-1.5 border-r border-[#808080] win32-bevel-outset">Full Name</th>
                <th className="p-1.5 border-r border-[#808080] win32-bevel-outset">Department</th>
                <th className="p-1.5 border-r border-[#808080] win32-bevel-outset">Designation</th>
                <th className="p-1.5 border-r border-[#808080] win32-bevel-outset text-right">Basic Salary</th>
                <th className="p-1.5 border-r border-[#808080] win32-bevel-outset text-right">HRA ({rules.hraPercentage}%)</th>
                <th className="p-1.5 border-r border-[#808080] win32-bevel-outset text-right">DA ({rules.daPercentage}%)</th>
                <th className="p-1.5 border-r border-[#808080] win32-bevel-outset text-right">PF ({rules.pfPercentage}%)</th>
                <th className="p-1.5 border-r border-[#808080] win32-bevel-outset text-right">Gross Salary</th>
                <th className="p-1.5 win32-bevel-outset text-right font-bold text-[#0a246a]">Net Salary</th>
              </tr>
            </thead>
            <tbody>
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={10} className="p-8 text-center text-slate-500 italic">
                    No matching employee records found in records.dat. Click &quot;Add Record&quot; to insert.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => {
                  const isSelected = emp.empId === selectedId;
                  return (
                    <tr
                      key={emp.empId}
                      onClick={() => onSelectEmployee(emp.empId)}
                      onDoubleClick={() => onViewPayslip(emp)}
                      className={`cursor-pointer transition-colors ${
                        isSelected
                          ? 'bg-[#0a246a] text-white font-medium'
                          : 'hover:bg-[#b5d5ff] text-black border-b border-[#f0f0f0]'
                      }`}
                    >
                      <td className="p-1.5 font-mono text-[11px] border-r border-slate-200">
                        {emp.code}
                      </td>
                      <td className="p-1.5 font-medium border-r border-slate-200">
                        {emp.name}
                      </td>
                      <td className="p-1.5 border-r border-slate-200">
                        {emp.department}
                      </td>
                      <td className="p-1.5 border-r border-slate-200">
                        {emp.designation}
                      </td>
                      <td className="p-1.5 text-right font-mono tabular-nums border-r border-slate-200">
                        {formatCurrency(emp.basicSalary, rules.currencySymbol)}
                      </td>
                      <td className="p-1.5 text-right font-mono tabular-nums border-r border-slate-200">
                        {formatCurrency(emp.hra, rules.currencySymbol)}
                      </td>
                      <td className="p-1.5 text-right font-mono tabular-nums border-r border-slate-200">
                        {formatCurrency(emp.da, rules.currencySymbol)}
                      </td>
                      <td
                        className={`p-1.5 text-right font-mono tabular-nums border-r border-slate-200 ${
                          isSelected ? 'text-rose-200' : 'text-rose-700'
                        }`}
                      >
                        -{formatCurrency(emp.pf, rules.currencySymbol)}
                      </td>
                      <td className="p-1.5 text-right font-mono tabular-nums font-semibold border-r border-slate-200">
                        {formatCurrency(emp.grossSalary, rules.currencySymbol)}
                      </td>
                      <td
                        className={`p-1.5 text-right font-mono tabular-nums font-bold ${
                          isSelected ? 'text-amber-200' : 'text-emerald-800'
                        }`}
                      >
                        {formatCurrency(emp.netSalary, rules.currencySymbol)}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* 6. Win32 Status Bar */}
      <div className="flex items-center bg-[#ece9d8] border-t border-[#808080] text-[11px] p-0.5 select-none overflow-x-auto">
        <div className="win32-bevel-inset px-2 py-0.5 flex-1 text-slate-800 truncate">
          {statusMessage}
        </div>
        <div className="win32-bevel-inset px-2 py-0.5 whitespace-nowrap text-slate-700">
          Records: <strong>{filteredEmployees.length}</strong> of {employees.length}
        </div>
        <div className="win32-bevel-inset px-2 py-0.5 whitespace-nowrap text-slate-700">
          File Size: <strong>{fileSize.toLocaleString()}</strong> B
        </div>
        <div className="win32-bevel-inset px-2 py-0.5 whitespace-nowrap text-[#0a246a] font-bold">
          Total Net: {formatCurrency(totalPayroll, rules.currencySymbol)}
        </div>
        <div className="win32-bevel-inset px-2 py-0.5 whitespace-nowrap text-slate-500 font-mono">
          CAPS
        </div>
        <div className="win32-bevel-inset px-2 py-0.5 whitespace-nowrap text-slate-700 font-mono font-bold">
          NUM
        </div>
      </div>
    </div>
  );
};
