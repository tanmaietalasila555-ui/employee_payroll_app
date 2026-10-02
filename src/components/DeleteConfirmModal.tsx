import React from 'react';
import { Employee, ViewMode } from '../types/payroll';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface DeleteConfirmModalProps {
  isOpen: boolean;
  employee: Employee | null;
  mode: ViewMode;
  onConfirm: () => void;
  onCancel: () => void;
}

export const DeleteConfirmModal: React.FC<DeleteConfirmModalProps> = ({
  isOpen,
  employee,
  mode,
  onConfirm,
  onCancel,
}) => {
  if (!isOpen || !employee) return null;

  const isWin32 = mode === 'win32';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div
        className={
          isWin32
            ? 'w-full max-w-md bg-[#ece9d8] text-black win32-bevel-outset p-1 select-none font-win32 shadow-xl'
            : 'w-full max-w-md bg-slate-900 text-slate-100 border border-slate-700 rounded-xl shadow-2xl p-6'
        }
      >
        {isWin32 ? (
          <>
            {/* Win32 Dialog Title */}
            <div className="flex items-center justify-between px-3 py-1 bg-gradient-to-r from-[#0a246a] to-[#a6caf0] text-white font-bold text-xs select-none">
              <span>Confirm Delete - records.dat</span>
              <button
                onClick={onCancel}
                className="win32-button w-5 h-5 flex items-center justify-center text-black font-bold text-xs leading-none bg-[#dfdfdf] hover:bg-red-200"
              >
                ✕
              </button>
            </div>

            {/* Win32 Dialog Body */}
            <div className="p-4 flex items-start gap-4">
              <div className="w-10 h-10 flex-shrink-0 flex items-center justify-center bg-amber-400 text-black font-bold text-2xl rounded-full border-2 border-black">
                !
              </div>
              <div className="space-y-2 text-xs">
                <p className="font-bold text-slate-900">
                  Delete employee record {employee.code}?
                </p>
                <p className="text-slate-700">
                  Are you sure you want to permanently remove <strong>{employee.name}</strong> ({employee.designation}) from the payroll system?
                </p>
                <p className="text-[11px] text-slate-500 italic">
                  This will perform binary file re-indexing and update <code>records.dat</code>.
                </p>
              </div>
            </div>

            {/* Win32 Yes / No Buttons */}
            <div className="flex justify-end gap-2 px-4 pb-3">
              <button
                onClick={onConfirm}
                className="win32-button px-5 py-1 text-black font-bold cursor-pointer text-xs"
              >
                &Yes
              </button>
              <button
                onClick={onCancel}
                className="win32-button px-5 py-1 text-black cursor-pointer text-xs"
              >
                &No
              </button>
            </div>
          </>
        ) : (
          <div className="space-y-4">
            <div className="flex items-start gap-3">
              <div className="p-2.5 bg-rose-500/10 text-rose-400 rounded-lg">
                <AlertTriangle className="w-6 h-6" />
              </div>
              <div className="flex-1">
                <h3 className="text-base font-semibold text-white">
                  Remove Employee Record
                </h3>
                <p className="text-xs text-slate-400 mt-1">
                  Are you sure you want to delete <span className="font-semibold text-slate-200">{employee.name}</span> ({employee.code})? This record will be expunged from the local payroll database.
                </p>
              </div>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-800">
              <button
                onClick={onCancel}
                className="px-4 py-2 text-xs font-medium text-slate-300 hover:text-white bg-slate-800 hover:bg-slate-700 rounded transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                className="px-4 py-2 text-xs font-medium text-white bg-rose-600 hover:bg-rose-500 rounded transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>Delete Record</span>
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
