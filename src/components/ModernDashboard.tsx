import React from 'react';
import { Employee, PayrollRules } from '../types/payroll';
import { formatCurrency } from '../utils/payrollCalculator';
import { TOTAL_STRUCT_SIZE, exportToCSV, exportToDat } from '../utils/fileHandling';
import {
  Users,
  DollarSign,
  TrendingUp,
  ShieldCheck,
  Search,
  Plus,
  FileText,
  Sliders,
  Code2,
  Binary,
  Download,
  Save,
  Monitor,
  Edit2,
  Trash2,
  Eye,
  RefreshCw,
} from 'lucide-react';

interface ModernDashboardProps {
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

export const ModernDashboard: React.FC<ModernDashboardProps> = ({
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
  // Aggregate Metrics
  const totalGross = employees.reduce((sum, e) => sum + e.grossSalary, 0);
  const totalNet = employees.reduce((sum, e) => sum + e.netSalary, 0);
  const totalPF = employees.reduce((sum, e) => sum + e.pf, 0);
  const averageNet = employees.length > 0 ? totalNet / employees.length : 0;
  const dbBytes = employees.length * TOTAL_STRUCT_SIZE;

  // Filtered list
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch =
      emp.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      emp.designation.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesDept = departmentFilter === 'All' || emp.department === departmentFilter;
    return matchesSearch && matchesDept;
  });

  const departments = ['All', ...Array.from(new Set(employees.map((e) => e.department)))];

  return (
    <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 space-y-6">
      
      {/* 1. Header & Quick Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2.5">
            <h1 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
              Employee Payroll Operations
            </h1>
            <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 px-2 py-0.5 rounded border border-emerald-800/60">
              records.dat ({dbBytes.toLocaleString()} B)
            </span>
          </div>
          <div className="flex items-center gap-2 text-xs text-slate-400 mt-1">
            <span>C Architecture</span>
            <span aria-hidden="true">·</span>
            <span>Win32 API Subsystem</span>
            <span aria-hidden="true">·</span>
            <span>Automated HRA/DA/PF</span>
            <span aria-hidden="true">·</span>
            <span>Local File Persistence</span>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <button
            onClick={onToggleViewMode}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Switch to Authentic Win32 Desktop Mode"
          >
            <Monitor className="w-3.5 h-3.5 text-blue-400" />
            <span>Classic Win32 Mode</span>
          </button>

          <button
            onClick={onOpenRules}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Adjust Payroll Rules"
          >
            <Sliders className="w-3.5 h-3.5 text-slate-400" />
            <span>Payroll Formula</span>
          </button>

          <button
            onClick={onOpenMemory}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            title="Inspect struct byte alignment and hex memory"
          >
            <Binary className="w-3.5 h-3.5 text-emerald-400" />
            <span>Memory Map</span>
          </button>

          <button
            onClick={onOpenCSource}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-200 bg-slate-800 hover:bg-slate-700 border border-slate-700 rounded-lg transition-colors cursor-pointer"
            title="View C source code (payroll_system.c)"
          >
            <Code2 className="w-3.5 h-3.5 text-purple-400" />
            <span>C Source</span>
          </button>

          <button
            onClick={onAddEmployee}
            className="flex items-center gap-1.5 px-4 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg shadow-sm transition-colors cursor-pointer"
          >
            <Plus className="w-4 h-4" />
            <span>Add Employee</span>
          </button>
        </div>
      </div>

      {/* 2. Statistical Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 bg-slate-800/60 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Monthly Net Disbursal</span>
            <DollarSign className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums tracking-tight">
            {formatCurrency(totalNet, rules.currencySymbol)}
          </div>
          <div className="text-[11px] text-slate-500">
            Across {employees.length} active employee records
          </div>
        </div>

        <div className="p-4 bg-slate-800/60 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Total Gross Compensation</span>
            <TrendingUp className="w-4 h-4 text-blue-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums tracking-tight">
            {formatCurrency(totalGross, rules.currencySymbol)}
          </div>
          <div className="text-[11px] text-slate-500">
            Basic + HRA ({rules.hraPercentage}%) + DA ({rules.daPercentage}%)
          </div>
        </div>

        <div className="p-4 bg-slate-800/60 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Provident Fund (PF) Pool</span>
            <ShieldCheck className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums tracking-tight">
            {formatCurrency(totalPF, rules.currencySymbol)}
          </div>
          <div className="text-[11px] text-slate-500">
            Automated {rules.pfPercentage}% retirement deductions
          </div>
        </div>

        <div className="p-4 bg-slate-800/60 border border-slate-800 rounded-xl space-y-1">
          <div className="flex items-center justify-between text-slate-400 text-xs font-medium">
            <span>Average Net Pay / Employee</span>
            <Users className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl font-bold font-mono text-white tabular-nums tracking-tight">
            {formatCurrency(averageNet, rules.currencySymbol)}
          </div>
          <div className="text-[11px] text-slate-500">
            Mean take-home compensation
          </div>
        </div>
      </div>

      {/* 3. Filter Bar & Table Controls */}
      <div className="bg-slate-800/40 border border-slate-800 rounded-xl p-4 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
          
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by code, employee name, or designation..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 bg-slate-900 border border-slate-700 rounded-lg text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Export & Disk Actions */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => exportToDat(employees)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              title="Download records.dat binary payload"
            >
              <Save className="w-3.5 h-3.5 text-blue-400" />
              <span>Save .DAT</span>
            </button>
            <button
              onClick={() => exportToCSV(employees)}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              title="Export all records as CSV spreadsheet"
            >
              <Download className="w-3.5 h-3.5 text-emerald-400" />
              <span>Export CSV</span>
            </button>
            <button
              onClick={onReload}
              className="p-1.5 text-slate-400 hover:text-white bg-slate-800 hover:bg-slate-700 rounded-lg border border-slate-700 transition-colors cursor-pointer"
              title="Reload from local storage"
            >
              <RefreshCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Department Segmented Filter Buttons */}
        <div className="flex items-center gap-1 overflow-x-auto pb-1 text-xs">
          <span className="text-slate-500 text-[11px] mr-1 whitespace-nowrap">Department:</span>
          {departments.map((dept) => (
            <button
              key={dept}
              onClick={() => setDepartmentFilter(dept)}
              className={`px-3 py-1 rounded-md whitespace-nowrap transition-colors cursor-pointer ${
                departmentFilter === dept
                  ? 'bg-blue-600 text-white font-medium'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* 4. Employee Records Data Table */}
      <div className="border border-slate-800 rounded-xl overflow-hidden bg-slate-900/60 shadow-lg">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-slate-800/80 border-b border-slate-800 text-slate-400 font-medium select-none">
                <th className="py-3 px-4">Employee</th>
                <th className="py-3 px-4">Department & Role</th>
                <th className="py-3 px-4 text-right">Basic Pay</th>
                <th className="py-3 px-4 text-right">HRA ({rules.hraPercentage}%)</th>
                <th className="py-3 px-4 text-right">DA ({rules.daPercentage}%)</th>
                <th className="py-3 px-4 text-right">PF ({rules.pfPercentage}%)</th>
                <th className="py-3 px-4 text-right">Gross Total</th>
                <th className="py-3 px-4 text-right font-semibold text-emerald-400">Net Salary</th>
                <th className="py-3 px-4 text-center">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filteredEmployees.length === 0 ? (
                <tr>
                  <td colSpan={9} className="py-12 text-center text-slate-500 text-xs">
                    No matching employee records found. Adjust your search or click &quot;Add Employee&quot;.
                  </td>
                </tr>
              ) : (
                filteredEmployees.map((emp) => {
                  const isSelected = emp.empId === selectedId;
                  return (
                    <tr
                      key={emp.empId}
                      onClick={() => onSelectEmployee(emp.empId)}
                      className={`hover:bg-slate-800/40 transition-colors cursor-pointer ${
                        isSelected ? 'bg-slate-800/70 border-l-2 border-l-blue-500' : ''
                      }`}
                    >
                      <td className="py-3 px-4">
                        <div className="font-semibold text-slate-200">{emp.name}</div>
                        <div className="font-mono text-[11px] text-slate-400">{emp.code}</div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="text-slate-300">{emp.designation}</div>
                        <div className="text-[11px] text-slate-500">{emp.department}</div>
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-300">
                        {formatCurrency(emp.basicSalary, rules.currencySymbol)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-400">
                        {formatCurrency(emp.hra, rules.currencySymbol)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-slate-400">
                        {formatCurrency(emp.da, rules.currencySymbol)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums text-rose-400">
                        -{formatCurrency(emp.pf, rules.currencySymbol)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums font-medium text-slate-200">
                        {formatCurrency(emp.grossSalary, rules.currencySymbol)}
                      </td>
                      <td className="py-3 px-4 text-right font-mono tabular-nums font-bold text-emerald-400">
                        {formatCurrency(emp.netSalary, rules.currencySymbol)}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center justify-center gap-1.5" onClick={(e) => e.stopPropagation()}>
                          <button
                            onClick={() => onViewPayslip(emp)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
                            title="Generate Payslip"
                          >
                            <FileText className="w-4 h-4 text-blue-400" />
                          </button>
                          <button
                            onClick={() => onEditEmployee(emp)}
                            className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-800 rounded transition-colors cursor-pointer"
                            title="Edit Employee"
                          >
                            <Edit2 className="w-4 h-4 text-slate-300" />
                          </button>
                          <button
                            onClick={() => onDeleteEmployee(emp)}
                            className="p-1.5 text-slate-400 hover:text-rose-400 hover:bg-slate-800 rounded transition-colors cursor-pointer"
                            title="Delete Record"
                          >
                            <Trash2 className="w-4 h-4 text-rose-500" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer info bar */}
        <div className="px-4 py-3 bg-slate-800/40 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-400 gap-2">
          <span>Showing {filteredEmployees.length} of {employees.length} records in <code>records.dat</code></span>
          <div className="flex items-center gap-4">
            <span>Record struct size: 296 Bytes</span>
            <span>Total Payroll: <strong className="font-mono text-emerald-400">{formatCurrency(totalNet, rules.currencySymbol)}</strong></span>
          </div>
        </div>
      </div>

    </div>
  );
};
