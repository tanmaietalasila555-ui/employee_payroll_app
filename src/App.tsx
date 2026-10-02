import React, { useState, useEffect } from 'react';
import { Employee, PayrollRules, ViewMode } from './types/payroll';
import {
  loadRecordsFromFile,
  saveRecordsToFile,
  RULES_STORAGE_KEY,
} from './utils/fileHandling';
import { DEFAULT_PAYROLL_RULES, computeSalaryComponents } from './utils/payrollCalculator';
import { Win32Window } from './components/Win32Window';
import { ModernDashboard } from './components/ModernDashboard';
import { EmployeeFormModal } from './components/EmployeeFormModal';
import { PayslipModal } from './components/PayslipModal';
import { DeleteConfirmModal } from './components/DeleteConfirmModal';
import { PayrollRulesModal } from './components/PayrollRulesModal';
import { CSourceInspectorModal } from './components/CSourceInspectorModal';
import { MemoryInspectorModal } from './components/MemoryInspectorModal';
import {
  Monitor,
  LayoutDashboard,
  Plus,
  Sliders,
  Code2,
  Binary,
  Layers,
  FileCode,
} from 'lucide-react';

export default function App() {
  const [employees, setEmployees] = useState<Employee[]>(() => loadRecordsFromFile());
  const [rules, setRules] = useState<PayrollRules>(() => {
    try {
      const stored = localStorage.getItem(RULES_STORAGE_KEY);
      return stored ? JSON.parse(stored) : DEFAULT_PAYROLL_RULES;
    } catch {
      return DEFAULT_PAYROLL_RULES;
    }
  });

  const [viewMode, setViewMode] = useState<ViewMode>('win32');
  const [selectedId, setSelectedId] = useState<number | null>(() => {
    return employees.length > 0 ? employees[0].empId : null;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('All');

  // Modals
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingEmployee, setEditingEmployee] = useState<Employee | null>(null);

  const [isPayslipOpen, setIsPayslipOpen] = useState(false);
  const [payslipEmployee, setPayslipEmployee] = useState<Employee | null>(null);

  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [deletingEmployee, setDeletingEmployee] = useState<Employee | null>(null);

  const [isRulesOpen, setIsRulesOpen] = useState(false);
  const [isCSourceOpen, setIsCSourceOpen] = useState(false);
  const [isMemoryOpen, setIsMemoryOpen] = useState(false);

  // Sync to local storage
  const persistEmployees = (updatedList: Employee[]) => {
    setEmployees(updatedList);
    saveRecordsToFile(updatedList);
  };

  // Keyboard shortcut listener
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Ctrl+N: Add employee
      if ((e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'n') {
        e.preventDefault();
        setEditingEmployee(null);
        setIsFormOpen(true);
      }
      // Escape: Close topmost modal
      if (e.key === 'Escape') {
        setIsFormOpen(false);
        setIsPayslipOpen(false);
        setIsDeleteOpen(false);
        setIsRulesOpen(false);
        setIsCSourceOpen(false);
        setIsMemoryOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // CRUD Actions
  const handleSaveEmployee = (emp: Employee) => {
    const exists = employees.some((e) => e.empId === emp.empId);
    let updated: Employee[];
    if (exists) {
      updated = employees.map((e) => (e.empId === emp.empId ? emp : e));
    } else {
      updated = [...employees, emp];
    }
    persistEmployees(updated);
    setSelectedId(emp.empId);
  };

  const handleDeleteConfirm = () => {
    if (!deletingEmployee) return;
    const updated = employees.filter((e) => e.empId !== deletingEmployee.empId);
    persistEmployees(updated);
    if (selectedId === deletingEmployee.empId) {
      setSelectedId(updated.length > 0 ? updated[0].empId : null);
    }
    setIsDeleteOpen(false);
    setDeletingEmployee(null);
  };

  const handleSaveRules = (newRules: PayrollRules) => {
    setRules(newRules);
    try {
      localStorage.setItem(RULES_STORAGE_KEY, JSON.stringify(newRules));
    } catch (err) {
      console.error(err);
    }

    // Automatically recalculate salary for all records
    const updated = employees.map((emp) => {
      const comp = computeSalaryComponents(emp.basicSalary, newRules);
      return {
        ...emp,
        hra: comp.hra,
        da: comp.da,
        medicalAllowance: comp.medicalAllowance,
        pf: comp.pf,
        tax: comp.tax,
        grossSalary: comp.grossSalary,
        netSalary: comp.netSalary,
        updatedAt: new Date().toISOString(),
      };
    });
    persistEmployees(updated);
  };

  const handleReload = () => {
    const data = loadRecordsFromFile();
    setEmployees(data);
    if (data.length > 0 && !data.some((e) => e.empId === selectedId)) {
      setSelectedId(data[0].empId);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-blue-600 selection:text-white">
      
      {/* 3-Zone Top Bar Contract */}
      <header className="no-print flex items-center justify-between px-6 py-3.5 border-b border-slate-800 bg-slate-900/90 backdrop-blur-md sticky top-0 z-40">
        
        {/* Zone 1: Single text element wordmark */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center font-bold text-white font-mono text-sm shadow-sm">
            C
          </div>
          <span className="text-base font-bold tracking-tight text-white">
            Apex Payroll Subsystem
          </span>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-medium text-slate-400">
          <button
            onClick={() => setIsRulesOpen(true)}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Payroll Formula ({rules.hraPercentage}% / {rules.daPercentage}% / {rules.pfPercentage}%)
          </button>
          <button
            onClick={() => setIsMemoryOpen(true)}
            className="hover:text-white transition-colors cursor-pointer"
          >
            C Struct Memory (296B)
          </button>
          <button
            onClick={() => setIsCSourceOpen(true)}
            className="hover:text-white transition-colors cursor-pointer"
          >
            payroll_system.c
          </button>
          <button
            onClick={handleReload}
            className="hover:text-white transition-colors cursor-pointer"
          >
            Disk Sync
          </button>
        </nav>

        {/* Zone 3: Primary Action Controls */}
        <div className="flex items-center gap-3">
          {/* GUI Mode Segmented Switch */}
          <div className="flex items-center p-0.5 bg-slate-800 border border-slate-700 rounded-lg text-xs">
            <button
              onClick={() => setViewMode('win32')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                viewMode === 'win32'
                  ? 'bg-blue-600 text-white font-medium shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Switch to Authentic Windows Win32 API Desktop Window"
            >
              <Monitor className="w-3.5 h-3.5" />
              <span>Win32 GUI</span>
            </button>
            <button
              onClick={() => setViewMode('modern')}
              className={`flex items-center gap-1.5 px-2.5 py-1 rounded-md transition-colors cursor-pointer ${
                viewMode === 'modern'
                  ? 'bg-blue-600 text-white font-medium shadow-xs'
                  : 'text-slate-400 hover:text-white'
              }`}
              title="Switch to Modern Enterprise SaaS View"
            >
              <LayoutDashboard className="w-3.5 h-3.5" />
              <span>Modern View</span>
            </button>
          </div>

          <button
            onClick={() => {
              setEditingEmployee(null);
              setIsFormOpen(true);
            }}
            className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-white bg-blue-600 hover:bg-blue-500 rounded-lg transition-colors cursor-pointer shadow-sm"
          >
            <Plus className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Add Record</span>
          </button>
        </div>

      </header>

      {/* Main Content Viewport */}
      <main className="flex-1 flex flex-col justify-start">
        {viewMode === 'win32' ? (
          <div className="flex-1 flex flex-col items-center justify-center p-2 sm:p-4 bg-gradient-to-b from-[#3a6ea5] via-[#244f7d] to-[#0f2c4e] min-h-[calc(100vh-60px)]">
            <div className="w-full text-center text-xs text-blue-100/80 mb-2 font-mono flex items-center justify-center gap-2">
              <span>Simulated C Win32 Desktop Application</span>
              <span>·</span>
              <span>Direct File I/O (fread / fwrite)</span>
              <span>·</span>
              <button
                onClick={() => setViewMode('modern')}
                className="underline hover:text-white cursor-pointer"
              >
                Switch to Modern View
              </button>
            </div>
            <Win32Window
              employees={employees}
              rules={rules}
              selectedId={selectedId}
              onSelectEmployee={(id) => setSelectedId(id)}
              onAddEmployee={() => {
                setEditingEmployee(null);
                setIsFormOpen(true);
              }}
              onEditEmployee={(emp) => {
                setEditingEmployee(emp);
                setIsFormOpen(true);
              }}
              onDeleteEmployee={(emp) => {
                setDeletingEmployee(emp);
                setIsDeleteOpen(true);
              }}
              onViewPayslip={(emp) => {
                setPayslipEmployee(emp);
                setIsPayslipOpen(true);
              }}
              onOpenRules={() => setIsRulesOpen(true)}
              onOpenCSource={() => setIsCSourceOpen(true)}
              onOpenMemory={() => setIsMemoryOpen(true)}
              onReload={handleReload}
              onToggleViewMode={() => setViewMode('modern')}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              departmentFilter={departmentFilter}
              setDepartmentFilter={setDepartmentFilter}
            />
          </div>
        ) : (
          <ModernDashboard
            employees={employees}
            rules={rules}
            selectedId={selectedId}
            onSelectEmployee={(id) => setSelectedId(id)}
            onAddEmployee={() => {
              setEditingEmployee(null);
              setIsFormOpen(true);
            }}
            onEditEmployee={(emp) => {
              setEditingEmployee(emp);
              setIsFormOpen(true);
            }}
            onDeleteEmployee={(emp) => {
              setDeletingEmployee(emp);
              setIsDeleteOpen(true);
            }}
            onViewPayslip={(emp) => {
              setPayslipEmployee(emp);
              setIsPayslipOpen(true);
            }}
            onOpenRules={() => setIsRulesOpen(true)}
            onOpenCSource={() => setIsCSourceOpen(true)}
            onOpenMemory={() => setIsMemoryOpen(true)}
            onReload={handleReload}
            onToggleViewMode={() => setViewMode('win32')}
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            departmentFilter={departmentFilter}
            setDepartmentFilter={setDepartmentFilter}
          />
        )}
      </main>

      {/* Global Modals & Dialogs */}
      <EmployeeFormModal
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingEmployee(null);
        }}
        onSave={handleSaveEmployee}
        initialData={editingEmployee}
        existingRecords={employees}
        rules={rules}
        mode={viewMode}
      />

      <PayslipModal
        employee={payslipEmployee}
        rules={rules}
        onClose={() => {
          setIsPayslipOpen(false);
          setPayslipEmployee(null);
        }}
      />

      <DeleteConfirmModal
        isOpen={isDeleteOpen}
        employee={deletingEmployee}
        mode={viewMode}
        onConfirm={handleDeleteConfirm}
        onCancel={() => {
          setIsDeleteOpen(false);
          setDeletingEmployee(null);
        }}
      />

      <PayrollRulesModal
        isOpen={isRulesOpen}
        onClose={() => setIsRulesOpen(false)}
        rules={rules}
        onSaveRules={handleSaveRules}
      />

      <CSourceInspectorModal
        isOpen={isCSourceOpen}
        onClose={() => setIsCSourceOpen(false)}
      />

      <MemoryInspectorModal
        isOpen={isMemoryOpen}
        onClose={() => setIsMemoryOpen(false)}
        employees={employees}
      />

    </div>
  );
}
