/**
 * Employee Payroll Management System
 * C Data Structures and Types Definition
 */

export interface Employee {
  empId: number;           // int empId (C 4-byte integer)
  code: string;            // Formatted EMP-1001
  name: string;            // char name[50]
  department: string;      // char department[30]
  designation: string;     // char designation[30]
  phone: string;           // char phone[15]
  email: string;           // char email[50]
  dateOfJoining: string;   // char dateOfJoining[12] (YYYY-MM-DD)
  bankAccount: string;     // char bankAccount[20]
  basicSalary: number;     // double basicSalary
  hra: number;             // double hra (House Rent Allowance)
  da: number;              // double da (Dearness Allowance)
  medicalAllowance: number;// double medicalAllowance
  pf: number;              // double pf (Provident Fund - deduction)
  tax: number;             // double tax (Income/Professional Tax - deduction)
  grossSalary: number;     // double grossSalary = basic + hra + da + medical
  netSalary: number;       // double netSalary = gross - pf - tax
  status: 'Active' | 'On Leave' | 'Terminated';
  createdAt: string;
  updatedAt: string;
}

export interface PayrollRules {
  hraPercentage: number;          // Default 20%
  daPercentage: number;           // Default 15%
  medicalFlatAllowance: number;   // Default 1250
  pfPercentage: number;           // Default 12%
  taxRateStandard: number;        // Default 5% for gross > 50000
  taxThreshold: number;           // 50000
  currencySymbol: string;         // $ or ₹ or £
}

export type ViewMode = 'win32' | 'modern';
export type ActiveTab = 'records' | 'payroll' | 'analytics' | 'c_source' | 'hex_memory';

export interface StructFieldLayout {
  fieldName: string;
  cType: string;
  sizeBytes: number;
  offsetBytes: number;
  description: string;
}
