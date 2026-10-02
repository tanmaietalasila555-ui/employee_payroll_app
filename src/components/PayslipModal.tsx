import React from 'react';
import { Employee, PayrollRules } from '../types/payroll';
import { formatCurrency, numberToWords } from '../utils/payrollCalculator';
import { Printer, Download, X, Building2, ShieldCheck, CheckCircle2 } from 'lucide-react';

interface PayslipModalProps {
  employee: Employee | null;
  rules: PayrollRules;
  onClose: () => void;
}

export const PayslipModal: React.FC<PayslipModalProps> = ({ employee, rules, onClose }) => {
  if (!employee) return null;

  const currentMonthYear = new Date().toLocaleDateString('en-US', { month: 'long', year: 'numeric' });
  const totalDeductions = employee.pf + employee.tax;

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4 overflow-y-auto">
      <div className="relative w-full max-w-3xl bg-white text-slate-900 rounded-lg shadow-2xl border border-slate-300 overflow-hidden my-6">
        
        {/* Top Control Bar (Hidden during print) */}
        <div className="no-print flex items-center justify-between px-6 py-3 bg-slate-800 text-slate-100 border-b border-slate-700">
          <div className="flex items-center gap-2">
            <Building2 className="w-5 h-5 text-blue-400" />
            <span className="font-semibold text-sm tracking-wide">
              Salary Payslip Generator · {employee.code}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium bg-blue-600 hover:bg-blue-500 text-white rounded transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>Print / Save PDF</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-700 transition-colors cursor-pointer"
              title="Close Dialog"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Printable Payslip Document */}
        <div className="p-8 bg-white printable-card font-sans">
          
          {/* Company Header */}
          <div className="border-b-2 border-slate-900 pb-5 mb-6 text-center">
            <div className="inline-flex items-center justify-center gap-2 mb-1">
              <Building2 className="w-7 h-7 text-blue-900" />
              <h1 className="text-2xl font-bold tracking-tight text-slate-900">
                APEX GLOBAL ENTERPRISES LTD.
              </h1>
            </div>
            <p className="text-xs text-slate-600 tracking-wider">
              100 Technology Plaza, Financial District, New York, NY 10005
            </p>
            <div className="mt-3 inline-block px-4 py-1 bg-slate-100 border border-slate-300 rounded text-xs font-semibold text-slate-800">
              PAYSLIP FOR THE MONTH OF {currentMonthYear.toUpperCase()}
            </div>
          </div>

          {/* Employee Metadata Grid */}
          <div className="grid grid-cols-2 gap-4 text-xs border border-slate-200 rounded p-4 mb-6 bg-slate-50/50">
            <div className="space-y-1.5">
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500 font-medium">Employee ID:</span>
                <span className="font-mono font-bold text-slate-900">{employee.code}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500 font-medium">Employee Name:</span>
                <span className="font-semibold text-slate-900">{employee.name}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500 font-medium">Department:</span>
                <span className="font-medium text-slate-800">{employee.department}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Designation:</span>
                <span className="font-medium text-slate-800">{employee.designation}</span>
              </div>
            </div>

            <div className="space-y-1.5">
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500 font-medium">Date of Joining:</span>
                <span className="font-mono text-slate-800">{employee.dateOfJoining}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500 font-medium">Bank Account:</span>
                <span className="font-mono text-slate-800">{employee.bankAccount}</span>
              </div>
              <div className="flex justify-between border-b border-slate-100 pb-1">
                <span className="text-slate-500 font-medium">Work Phone:</span>
                <span className="font-mono text-slate-800">{employee.phone}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-500 font-medium">Employment Status:</span>
                <span className="font-semibold text-emerald-700">{employee.status}</span>
              </div>
            </div>
          </div>

          {/* Earnings & Deductions Tables */}
          <div className="grid grid-cols-2 gap-4 mb-6">
            
            {/* Earnings Column */}
            <div className="border border-slate-200 rounded overflow-hidden">
              <div className="bg-slate-100 px-3 py-2 border-b border-slate-200">
                <span className="font-semibold text-xs text-slate-800">EARNINGS</span>
              </div>
              <div className="p-3 space-y-2 text-xs">
                <div className="flex justify-between text-slate-700">
                  <span>Basic Salary</span>
                  <span className="font-mono tabular-nums font-medium">{formatCurrency(employee.basicSalary, rules.currencySymbol)}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>House Rent Allowance (HRA {rules.hraPercentage}%)</span>
                  <span className="font-mono tabular-nums font-medium">{formatCurrency(employee.hra, rules.currencySymbol)}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Dearness Allowance (DA {rules.daPercentage}%)</span>
                  <span className="font-mono tabular-nums font-medium">{formatCurrency(employee.da, rules.currencySymbol)}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Medical Allowance</span>
                  <span className="font-mono tabular-nums font-medium">{formatCurrency(employee.medicalAllowance, rules.currencySymbol)}</span>
                </div>
                <div className="pt-2 border-t border-slate-200 flex justify-between font-semibold text-slate-900">
                  <span>Total Gross Earnings (A)</span>
                  <span className="font-mono tabular-nums">{formatCurrency(employee.grossSalary, rules.currencySymbol)}</span>
                </div>
              </div>
            </div>

            {/* Deductions Column */}
            <div className="border border-slate-200 rounded overflow-hidden">
              <div className="bg-slate-100 px-3 py-2 border-b border-slate-200">
                <span className="font-semibold text-xs text-slate-800">DEDUCTIONS</span>
              </div>
              <div className="p-3 space-y-2 text-xs">
                <div className="flex justify-between text-slate-700">
                  <span>Provident Fund (PF {rules.pfPercentage}%)</span>
                  <span className="font-mono tabular-nums font-medium text-rose-700">-{formatCurrency(employee.pf, rules.currencySymbol)}</span>
                </div>
                <div className="flex justify-between text-slate-700">
                  <span>Income / Professional Tax (TDS)</span>
                  <span className="font-mono tabular-nums font-medium text-rose-700">
                    {employee.tax > 0 ? `-${formatCurrency(employee.tax, rules.currencySymbol)}` : '$0.00'}
                  </span>
                </div>
                <div className="flex justify-between text-slate-400">
                  <span>Other Statutory Deductions</span>
                  <span className="font-mono tabular-nums">$0.00</span>
                </div>
                <div className="pt-6 border-t border-slate-200 flex justify-between font-semibold text-slate-900">
                  <span>Total Deductions (B)</span>
                  <span className="font-mono tabular-nums text-rose-700">-{formatCurrency(totalDeductions, rules.currencySymbol)}</span>
                </div>
              </div>
            </div>

          </div>

          {/* Net Pay Callout */}
          <div className="border-2 border-slate-900 rounded p-4 bg-slate-50 mb-6 flex items-center justify-between">
            <div>
              <span className="text-xs font-semibold text-slate-600 block">
                NET PAYABLE AMOUNT (Gross Earnings - Deductions)
              </span>
              <span className="text-xs text-slate-500 italic mt-0.5 block">
                Amount in words: {numberToWords(employee.netSalary, rules.currencySymbol === '₹' ? 'Rupees' : 'Dollars')}
              </span>
            </div>
            <div className="text-right">
              <span className="text-2xl font-bold font-mono text-blue-900 tabular-nums">
                {formatCurrency(employee.netSalary, rules.currencySymbol)}
              </span>
              <span className="text-[10px] block text-emerald-700 font-semibold flex items-center justify-end gap-1 mt-0.5">
                <CheckCircle2 className="w-3 h-3" /> DIRECT DEPOSIT VERIFIED
              </span>
            </div>
          </div>

          {/* Signatures & Footer Notice */}
          <div className="grid grid-cols-2 gap-8 pt-8 border-t border-slate-200 text-xs">
            <div className="text-center">
              <div className="border-b border-slate-400 pb-6 mb-2">
                <span className="font-serif italic text-slate-400 text-sm">System Verified</span>
              </div>
              <span className="font-medium text-slate-700 block">Employer Authorized Signatory</span>
              <span className="text-[10px] text-slate-400">Apex Payroll & Human Capital Division</span>
            </div>
            <div className="text-center">
              <div className="border-b border-slate-400 pb-6 mb-2">
                <span className="text-transparent">Signature</span>
              </div>
              <span className="font-medium text-slate-700 block">Employee Signature / Acknowledgment</span>
              <span className="text-[10px] text-slate-400">Received on Direct Account</span>
            </div>
          </div>

          <div className="mt-8 text-center text-[10px] text-slate-400 border-t border-slate-100 pt-3">
            This is a computer-generated payroll advice document from the C Win32 Payroll Management Subsystem. No physical signature is required for electronic validation.
          </div>

        </div>

      </div>
    </div>
  );
};
