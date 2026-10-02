import React, { useState, useEffect } from 'react';
import { Employee, PayrollRules, ViewMode } from '../types/payroll';
import { computeSalaryComponents, formatCurrency } from '../utils/payrollCalculator';
import { UserPlus, UserCheck, X, Calculator, AlertCircle, Building, Briefcase, Phone, Mail, Calendar, CreditCard } from 'lucide-react';

interface EmployeeFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (employee: Employee) => void;
  initialData?: Employee | null;
  existingRecords: Employee[];
  rules: PayrollRules;
  mode: ViewMode;
}

export const EmployeeFormModal: React.FC<EmployeeFormModalProps> = ({
  isOpen,
  onClose,
  onSave,
  initialData,
  existingRecords,
  rules,
  mode,
}) => {
  if (!isOpen) return null;

  const isEditing = !!initialData;

  // Auto-generate next employee ID
  const nextId = React.useMemo(() => {
    if (initialData) return initialData.empId;
    if (existingRecords.length === 0) return 1001;
    const max = Math.max(...existingRecords.map((r) => r.empId));
    return max + 1;
  }, [existingRecords, initialData]);

  const [formData, setFormData] = useState({
    empId: nextId,
    code: initialData ? initialData.code : `EMP-${nextId}`,
    name: initialData?.name || '',
    department: initialData?.department || 'Engineering',
    designation: initialData?.designation || '',
    phone: initialData?.phone || '',
    email: initialData?.email || '',
    dateOfJoining: initialData?.dateOfJoining || new Date().toISOString().slice(0, 10),
    bankAccount: initialData?.bankAccount || '',
    basicSalary: initialData ? initialData.basicSalary.toString() : '50000',
    status: initialData?.status || ('Active' as const),
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Compute live salary preview
  const numBasic = parseFloat(formData.basicSalary) || 0;
  const salaryCalc = computeSalaryComponents(numBasic, rules);

  const departments = [
    'Engineering',
    'Finance',
    'Human Resources',
    'Operations',
    'Marketing',
    'Legal & Compliance',
    'Quality Assurance',
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Employee name is required.';
    }
    if (!formData.designation.trim()) {
      newErrors.designation = 'Job designation is required.';
    }
    if (numBasic <= 0) {
      newErrors.basicSalary = 'Basic salary must be greater than zero.';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    const updatedEmployee: Employee = {
      empId: formData.empId,
      code: formData.code,
      name: formData.name.trim(),
      department: formData.department,
      designation: formData.designation.trim(),
      phone: formData.phone.trim() || '+1 (555) 000-0000',
      email: formData.email.trim() || `${formData.name.toLowerCase().replace(/\s+/g, '.')}@enterprise.internal`,
      dateOfJoining: formData.dateOfJoining,
      bankAccount: formData.bankAccount.trim() || `US${Math.floor(10 + Math.random() * 89)}-${Math.floor(1000 + Math.random() * 9000)}-${Math.floor(1000 + Math.random() * 9000)}`,
      basicSalary: numBasic,
      hra: salaryCalc.hra,
      da: salaryCalc.da,
      medicalAllowance: salaryCalc.medicalAllowance,
      pf: salaryCalc.pf,
      tax: salaryCalc.tax,
      grossSalary: salaryCalc.grossSalary,
      netSalary: salaryCalc.netSalary,
      status: formData.status,
      createdAt: initialData?.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    onSave(updatedEmployee);
    onClose();
  };

  const isWin32 = mode === 'win32';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div
        className={
          isWin32
            ? 'w-full max-w-2xl bg-[#ece9d8] text-black win32-bevel-outset p-1 select-none font-win32'
            : 'w-full max-w-2xl bg-slate-900 text-slate-100 border border-slate-700 rounded-xl shadow-2xl overflow-hidden'
        }
      >
        {/* Win32 Window Header */}
        {isWin32 ? (
          <div className="flex items-center justify-between px-3 py-1 bg-gradient-to-r from-[#0a246a] to-[#a6caf0] text-white font-bold text-xs select-none">
            <span className="flex items-center gap-1.5">
              {isEditing ? 'Edit Employee Record - [records.dat]' : 'Add New Employee Record - [records.dat]'}
            </span>
            <button
              onClick={onClose}
              className="win32-button w-5 h-5 flex items-center justify-center text-black font-bold text-xs leading-none bg-[#dfdfdf] hover:bg-red-200"
            >
              ✕
            </button>
          </div>
        ) : (
          <div className="flex items-center justify-between px-6 py-4 bg-slate-800/80 border-b border-slate-700">
            <div className="flex items-center gap-2">
              {isEditing ? (
                <UserCheck className="w-5 h-5 text-blue-400" />
              ) : (
                <UserPlus className="w-5 h-5 text-emerald-400" />
              )}
              <h2 className="text-base font-semibold text-white">
                {isEditing ? 'Update Employee Record' : 'Register New Employee'}
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-700 transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Modal Form Body */}
        <form onSubmit={handleSubmit} className={isWin32 ? 'p-3 space-y-3 text-xs' : 'p-6 space-y-5 text-sm'}>
          
          {/* General Information Section */}
          <div
            className={
              isWin32
                ? 'border border-[#7f7f7f] p-2 relative bg-white'
                : 'border border-slate-800 bg-slate-800/40 rounded-lg p-4 space-y-3'
            }
          >
            {isWin32 && (
              <span className="absolute -top-2.5 left-2 bg-white px-1 text-[11px] font-bold text-[#0a246a]">
                Employee Identification & Role
              </span>
            )}
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
              <div>
                <label className={isWin32 ? 'block mb-0.5 text-slate-700' : 'block mb-1 text-xs text-slate-400'}>
                  Employee ID (Auto)
                </label>
                <input
                  type="text"
                  disabled
                  value={formData.code}
                  className={
                    isWin32
                      ? 'w-full px-2 py-1 bg-[#f0f0f0] border border-[#808080] font-mono text-slate-700'
                      : 'w-full px-3 py-2 bg-slate-800/80 border border-slate-700 rounded text-slate-400 font-mono text-xs'
                  }
                />
              </div>

              <div className="md:col-span-2">
                <label className={isWin32 ? 'block mb-0.5 text-slate-700 font-bold' : 'block mb-1 text-xs text-slate-300 font-medium'}>
                  Full Legal Name *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Johnathan Doe"
                  value={formData.name}
                  onChange={(e) => {
                    setFormData({ ...formData, name: e.target.value });
                    if (errors.name) setErrors({ ...errors, name: '' });
                  }}
                  className={
                    isWin32
                      ? 'w-full px-2 py-1 bg-white border border-[#808080] win32-bevel-inset focus:outline-none'
                      : 'w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500'
                  }
                />
                {errors.name && <span className="text-[11px] text-red-500">{errors.name}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mt-3">
              <div>
                <label className={isWin32 ? 'block mb-0.5 text-slate-700' : 'block mb-1 text-xs text-slate-400'}>
                  Department
                </label>
                <select
                  value={formData.department}
                  onChange={(e) => setFormData({ ...formData, department: e.target.value })}
                  className={
                    isWin32
                      ? 'w-full px-2 py-1 bg-white border border-[#808080] win32-bevel-inset'
                      : 'w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500'
                  }
                >
                  {departments.map((dept) => (
                    <option key={dept} value={dept}>
                      {dept}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className={isWin32 ? 'block mb-0.5 text-slate-700 font-bold' : 'block mb-1 text-xs text-slate-300 font-medium'}>
                  Job Designation *
                </label>
                <input
                  type="text"
                  placeholder="e.g. Senior Software Architect"
                  value={formData.designation}
                  onChange={(e) => {
                    setFormData({ ...formData, designation: e.target.value });
                    if (errors.designation) setErrors({ ...errors, designation: '' });
                  }}
                  className={
                    isWin32
                      ? 'w-full px-2 py-1 bg-white border border-[#808080] win32-bevel-inset focus:outline-none'
                      : 'w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500'
                  }
                />
                {errors.designation && <span className="text-[11px] text-red-500">{errors.designation}</span>}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mt-3">
              <div>
                <label className={isWin32 ? 'block mb-0.5 text-slate-700' : 'block mb-1 text-xs text-slate-400'}>
                  Date of Joining
                </label>
                <input
                  type="date"
                  value={formData.dateOfJoining}
                  onChange={(e) => setFormData({ ...formData, dateOfJoining: e.target.value })}
                  className={
                    isWin32
                      ? 'w-full px-2 py-1 bg-white border border-[#808080] win32-bevel-inset'
                      : 'w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500'
                  }
                />
              </div>

              <div>
                <label className={isWin32 ? 'block mb-0.5 text-slate-700' : 'block mb-1 text-xs text-slate-400'}>
                  Contact Phone
                </label>
                <input
                  type="text"
                  placeholder="+1 (555) 000-0000"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className={
                    isWin32
                      ? 'w-full px-2 py-1 bg-white border border-[#808080] win32-bevel-inset'
                      : 'w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500'
                  }
                />
              </div>

              <div>
                <label className={isWin32 ? 'block mb-0.5 text-slate-700' : 'block mb-1 text-xs text-slate-400'}>
                  Bank Account / IBAN
                </label>
                <input
                  type="text"
                  placeholder="US12-3456-7890-1234"
                  value={formData.bankAccount}
                  onChange={(e) => setFormData({ ...formData, bankAccount: e.target.value })}
                  className={
                    isWin32
                      ? 'w-full px-2 py-1 bg-white border border-[#808080] win32-bevel-inset'
                      : 'w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white focus:outline-none focus:border-blue-500'
                  }
                />
              </div>
            </div>

          </div>

          {/* Automated Salary Calculations Section */}
          <div
            className={
              isWin32
                ? 'border border-[#7f7f7f] p-2 relative bg-[#fdfdfd]'
                : 'border border-blue-900/50 bg-blue-950/20 rounded-lg p-4 space-y-3'
            }
          >
            {isWin32 ? (
              <span className="absolute -top-2.5 left-2 bg-[#fdfdfd] px-1 text-[11px] font-bold text-[#0a246a]">
                Automated Payroll Engine (C Calculation Subsystem)
              </span>
            ) : (
              <div className="flex items-center gap-1.5 text-blue-400 text-xs font-semibold">
                <Calculator className="w-4 h-4" />
                <span>Automated Salary Calculation Engine</span>
              </div>
            )}

            <div>
              <label className={isWin32 ? 'block mb-0.5 font-bold text-slate-800' : 'block mb-1 text-xs text-slate-200 font-semibold'}>
                Basic Salary ({rules.currencySymbol}) *
              </label>
              <div className="relative">
                <input
                  type="number"
                  min="0"
                  step="500"
                  value={formData.basicSalary}
                  onChange={(e) => {
                    setFormData({ ...formData, basicSalary: e.target.value });
                    if (errors.basicSalary) setErrors({ ...errors, basicSalary: '' });
                  }}
                  className={
                    isWin32
                      ? 'w-full px-2 py-1 bg-white border border-[#808080] win32-bevel-inset text-base font-bold font-mono text-blue-900'
                      : 'w-full px-3 py-2 bg-slate-800 border border-blue-600 rounded text-white text-base font-bold font-mono focus:outline-none focus:ring-1 focus:ring-blue-500'
                  }
                />
              </div>
              {errors.basicSalary && <span className="text-[11px] text-red-500">{errors.basicSalary}</span>}
              <p className={isWin32 ? 'text-[10px] text-slate-500 mt-0.5' : 'text-[11px] text-slate-400 mt-1'}>
                Changing Basic Salary will automatically recalculate HRA ({rules.hraPercentage}%), DA ({rules.daPercentage}%), PF ({rules.pfPercentage}%), Gross, and Net in real-time.
              </p>
            </div>

            {/* Real-time Computed Breakdown Grid */}
            <div
              className={
                isWin32
                  ? 'grid grid-cols-2 md:grid-cols-5 gap-2 pt-2 border-t border-[#dfdfdf] text-[11px]'
                  : 'grid grid-cols-2 md:grid-cols-5 gap-3 pt-3 border-t border-slate-700/50 text-xs'
              }
            >
              <div className={isWin32 ? 'p-1.5 bg-slate-100 border border-slate-300' : 'p-2 bg-slate-800/80 rounded border border-slate-700'}>
                <span className="text-slate-500 block text-[10px]">HRA ({rules.hraPercentage}%)</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                  {formatCurrency(salaryCalc.hra, rules.currencySymbol)}
                </span>
              </div>

              <div className={isWin32 ? 'p-1.5 bg-slate-100 border border-slate-300' : 'p-2 bg-slate-800/80 rounded border border-slate-700'}>
                <span className="text-slate-500 block text-[10px]">DA ({rules.daPercentage}%)</span>
                <span className="font-mono font-semibold text-slate-900 dark:text-slate-100 tabular-nums">
                  {formatCurrency(salaryCalc.da, rules.currencySymbol)}
                </span>
              </div>

              <div className={isWin32 ? 'p-1.5 bg-slate-100 border border-slate-300' : 'p-2 bg-slate-800/80 rounded border border-slate-700'}>
                <span className="text-slate-500 block text-[10px]">PF Deduction ({rules.pfPercentage}%)</span>
                <span className="font-mono font-semibold text-rose-700 dark:text-rose-400 tabular-nums">
                  -{formatCurrency(salaryCalc.pf, rules.currencySymbol)}
                </span>
              </div>

              <div className={isWin32 ? 'p-1.5 bg-blue-50 border border-blue-200' : 'p-2 bg-blue-900/30 rounded border border-blue-800'}>
                <span className="text-blue-700 dark:text-blue-300 block text-[10px] font-semibold">Gross Salary</span>
                <span className="font-mono font-bold text-blue-900 dark:text-blue-200 tabular-nums">
                  {formatCurrency(salaryCalc.grossSalary, rules.currencySymbol)}
                </span>
              </div>

              <div className={isWin32 ? 'p-1.5 bg-emerald-50 border border-emerald-300' : 'p-2 bg-emerald-900/30 rounded border border-emerald-800'}>
                <span className="text-emerald-700 dark:text-emerald-300 block text-[10px] font-semibold">Net Salary</span>
                <span className="font-mono font-bold text-emerald-900 dark:text-emerald-200 tabular-nums">
                  {formatCurrency(salaryCalc.netSalary, rules.currencySymbol)}
                </span>
              </div>
            </div>

          </div>

          {/* Form Action Controls */}
          <div className={isWin32 ? 'flex justify-end gap-2 pt-2' : 'flex justify-end gap-3 pt-3 border-t border-slate-800'}>
            <button
              type="button"
              onClick={onClose}
              className={
                isWin32
                  ? 'win32-button px-4 py-1 text-black cursor-pointer font-win32'
                  : 'px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer'
              }
            >
              Cancel
            </button>
            <button
              type="submit"
              className={
                isWin32
                  ? 'win32-button px-5 py-1 text-black font-bold cursor-pointer font-win32'
                  : 'px-5 py-2 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded transition-colors cursor-pointer shadow-sm'
              }
            >
              {isEditing ? 'Save Changes' : 'Write Record (fwrite)'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
};
