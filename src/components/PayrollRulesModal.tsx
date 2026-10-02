import React, { useState } from 'react';
import { PayrollRules } from '../types/payroll';
import { Sliders, RefreshCw, X, Check, DollarSign } from 'lucide-react';

interface PayrollRulesModalProps {
  isOpen: boolean;
  onClose: () => void;
  rules: PayrollRules;
  onSaveRules: (newRules: PayrollRules) => void;
}

export const PayrollRulesModal: React.FC<PayrollRulesModalProps> = ({
  isOpen,
  onClose,
  rules,
  onSaveRules,
}) => {
  if (!isOpen) return null;

  const [formData, setFormData] = useState<PayrollRules>({ ...rules });

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onSaveRules(formData);
    onClose();
  };

  const handleReset = () => {
    setFormData({
      hraPercentage: 20,
      daPercentage: 15,
      medicalFlatAllowance: 1250,
      pfPercentage: 12,
      taxRateStandard: 5,
      taxThreshold: 50000,
      currencySymbol: '$',
    });
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="w-full max-w-lg bg-slate-900 text-slate-100 border border-slate-700 rounded-xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-slate-800 border-b border-slate-700">
          <div className="flex items-center gap-2.5">
            <Sliders className="w-5 h-5 text-blue-400" />
            <h2 className="text-sm font-semibold text-white">Payroll Calculation Rules</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-white rounded hover:bg-slate-700 transition-colors cursor-pointer"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSave} className="p-6 space-y-4 text-xs">
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-slate-300 font-medium">
                HRA (House Rent Allowance %)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={formData.hraPercentage}
                onChange={(e) => setFormData({ ...formData, hraPercentage: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white font-mono text-sm focus:outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">Applied to Basic Salary</span>
            </div>

            <div>
              <label className="block mb-1 text-slate-300 font-medium">
                DA (Dearness Allowance %)
              </label>
              <input
                type="number"
                min="0"
                max="100"
                step="1"
                value={formData.daPercentage}
                onChange={(e) => setFormData({ ...formData, daPercentage: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white font-mono text-sm focus:outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">Cost of living adjustment</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-slate-300 font-medium">
                PF (Provident Fund Deduction %)
              </label>
              <input
                type="number"
                min="0"
                max="50"
                step="1"
                value={formData.pfPercentage}
                onChange={(e) => setFormData({ ...formData, pfPercentage: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white font-mono text-sm focus:outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">Statutory retirement deduction</span>
            </div>

            <div>
              <label className="block mb-1 text-slate-300 font-medium">
                Medical Allowance (Flat)
              </label>
              <input
                type="number"
                min="0"
                step="100"
                value={formData.medicalFlatAllowance}
                onChange={(e) => setFormData({ ...formData, medicalFlatAllowance: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white font-mono text-sm focus:outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">Monthly healthcare benefit</span>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block mb-1 text-slate-300 font-medium">
                Tax Deduction Threshold
              </label>
              <input
                type="number"
                min="0"
                step="5000"
                value={formData.taxThreshold}
                onChange={(e) => setFormData({ ...formData, taxThreshold: Number(e.target.value) })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white font-mono text-sm focus:outline-none focus:border-blue-500"
              />
              <span className="text-[10px] text-slate-500 mt-0.5 block">Exemption baseline</span>
            </div>

            <div>
              <label className="block mb-1 text-slate-300 font-medium">
                Currency Symbol
              </label>
              <select
                value={formData.currencySymbol}
                onChange={(e) => setFormData({ ...formData, currencySymbol: e.target.value })}
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded text-white text-sm focus:outline-none focus:border-blue-500"
              >
                <option value="$">$ (USD - United States Dollar)</option>
                <option value="₹">₹ (INR - Indian Rupee)</option>
                <option value="€">€ (EUR - Euro)</option>
                <option value="£">£ (GBP - British Pound)</option>
              </select>
              <span className="text-[10px] text-slate-500 mt-0.5 block">Display formatting</span>
            </div>
          </div>

          <div className="p-3 bg-blue-950/30 border border-blue-900/50 rounded text-[11px] text-blue-300">
            Applying updated rules will automatically recalculate HRA, DA, PF, Gross, and Net salary for all records currently in <code>records.dat</code>.
          </div>

          <div className="flex items-center justify-between pt-3 border-t border-slate-800">
            <button
              type="button"
              onClick={handleReset}
              className="text-xs text-slate-400 hover:text-white flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              <span>Reset to Defaults</span>
            </button>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs text-slate-300 hover:text-white bg-slate-800 rounded cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="px-4 py-1.5 text-xs font-medium text-white bg-blue-600 hover:bg-blue-500 rounded cursor-pointer flex items-center gap-1"
              >
                <Check className="w-3.5 h-3.5" />
                <span>Apply to All Records</span>
              </button>
            </div>
          </div>

        </form>

      </div>
    </div>
  );
};
