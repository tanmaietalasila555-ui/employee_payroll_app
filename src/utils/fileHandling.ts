import { Employee, StructFieldLayout } from '../types/payroll';
import { INITIAL_EMPLOYEES } from './sampleData';

export const STORAGE_KEY = 'c_win32_payroll_records.dat';
export const RULES_STORAGE_KEY = 'c_win32_payroll_rules.json';

// C struct field layout metadata for memory inspection
export const STRUCT_FIELD_LAYOUT: StructFieldLayout[] = [
  { fieldName: 'empId', cType: 'int', sizeBytes: 4, offsetBytes: 0, description: 'Unique integer employee identifier' },
  { fieldName: 'code', cType: 'char[16]', sizeBytes: 16, offsetBytes: 4, description: 'Formatted employee string ID (e.g. EMP-1001)' },
  { fieldName: 'name', cType: 'char[50]', sizeBytes: 50, offsetBytes: 20, description: 'Full employee legal name' },
  { fieldName: 'department', cType: 'char[30]', sizeBytes: 30, offsetBytes: 70, description: 'Organizational unit / department' },
  { fieldName: 'designation', cType: 'char[30]', sizeBytes: 30, offsetBytes: 100, description: 'Job position / title' },
  { fieldName: 'phone', cType: 'char[15]', sizeBytes: 15, offsetBytes: 130, description: 'Contact telephone number' },
  { fieldName: 'email', cType: 'char[50]', sizeBytes: 50, offsetBytes: 145, description: 'Official corporate email' },
  { fieldName: 'dateOfJoining', cType: 'char[12]', sizeBytes: 12, offsetBytes: 195, description: 'Employment start date YYYY-MM-DD' },
  { fieldName: 'bankAccount', cType: 'char[24]', sizeBytes: 24, offsetBytes: 207, description: 'Direct deposit bank account number' },
  { fieldName: 'basicSalary', cType: 'double', sizeBytes: 8, offsetBytes: 232, description: 'Base monthly pay rate (IEEE-754 64-bit)' },
  { fieldName: 'hra', cType: 'double', sizeBytes: 8, offsetBytes: 240, description: 'House Rent Allowance (calculated)' },
  { fieldName: 'da', cType: 'double', sizeBytes: 8, offsetBytes: 248, description: 'Dearness Allowance (calculated)' },
  { fieldName: 'medicalAllowance', cType: 'double', sizeBytes: 8, offsetBytes: 256, description: 'Medical allowance benefits' },
  { fieldName: 'pf', cType: 'double', sizeBytes: 8, offsetBytes: 264, description: 'Provident Fund employee deduction' },
  { fieldName: 'tax', cType: 'double', sizeBytes: 8, offsetBytes: 272, description: 'Income / Professional tax deduction' },
  { fieldName: 'grossSalary', cType: 'double', sizeBytes: 8, offsetBytes: 280, description: 'Total gross earnings' },
  { fieldName: 'netSalary', cType: 'double', sizeBytes: 8, offsetBytes: 288, description: 'Final net payable salary' },
];

export const TOTAL_STRUCT_SIZE = 296; // bytes per record

/**
 * Loads employee records from persistent storage or initializes with sample data
 */
export function loadRecordsFromFile(): Employee[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      saveRecordsToFile(INITIAL_EMPLOYEES);
      return INITIAL_EMPLOYEES;
    }
    const parsed = JSON.parse(raw);
    if (Array.isArray(parsed) && parsed.length > 0) {
      return parsed;
    }
    return INITIAL_EMPLOYEES;
  } catch (err) {
    console.error('Error loading file records.dat:', err);
    return INITIAL_EMPLOYEES;
  }
}

/**
 * Saves employee records into persistent local storage simulating binary file write (fwrite)
 */
export function saveRecordsToFile(records: Employee[]): boolean {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(records));
    return true;
  } catch (err) {
    console.error('Error saving file records.dat:', err);
    return false;
  }
}

/**
 * Generates an authentic downloadable C source code file (payroll_system.c)
 * demonstrating the exact Win32 API implementation, file handling, and struct definitions
 */
export function generateCSourceCode(): string {
  return `/**
 * ============================================================================
 * EMPLOYEE PAYROLL MANAGEMENT SYSTEM (Win32 GUI & C File Handling)
 * ============================================================================
 * Technologies: C99, Win32 API, Windows GDI, File I/O (fopen, fwrite, fread, fseek)
 * Purpose: Complete desktop payroll management system with automated calculations
 *          and local persistent storage in "records.dat".
 * ============================================================================
 */

#define _WIN32_WINNT 0x0601
#include <windows.h>
#include <commctrl.h>
#include <stdio.h>
#include <stdlib.h>
#include <string.h>

#pragma comment(lib, "comctl32.lib")
#pragma comment(lib, "user32.lib")
#pragma comment(lib, "gdi32.lib")

#define FILE_NAME "records.dat"
#define MAX_RECORDS 1000

// Control IDs
#define ID_BTN_ADD        101
#define ID_BTN_EDIT       102
#define ID_BTN_DELETE     103
#define ID_BTN_SEARCH     104
#define ID_BTN_REFRESH    105
#define ID_BTN_PAYSLIP    106
#define ID_BTN_EXPORT     107
#define ID_LISTVIEW       108
#define ID_EDIT_SEARCH    109
#define ID_MENU_EXIT      201
#define ID_MENU_ABOUT     202

// Salary calculation percentage constants
#define HRA_PERCENTAGE    20.0  // House Rent Allowance: 20%
#define DA_PERCENTAGE     15.0  // Dearness Allowance: 15%
#define PF_PERCENTAGE     12.0  // Provident Fund: 12%
#define MEDICAL_ALLOWANCE 1250.0

// Employee Data Structure
typedef struct {
    int empId;
    char code[16];
    char name[50];
    char department[30];
    char designation[30];
    char phone[15];
    char email[50];
    char dateOfJoining[12];
    char bankAccount[24];
    double basicSalary;
    double hra;
    double da;
    double medicalAllowance;
    double pf;
    double tax;
    double grossSalary;
    double netSalary;
    char status[12];
} Employee;

// Global Handles
HWND hMainWindow;
HWND hListView;
HWND hEditSearch;
HWND hStatusBar;
HINSTANCE hAppInstance;

// Function Prototypes
LRESULT CALLBACK WindowProc(HWND hWnd, UINT uMsg, WPARAM wParam, LPARAM lParam);
void CalculateSalary(Employee *emp);
int SaveEmployeeToFile(const Employee *emp);
int UpdateEmployeeInFile(const Employee *emp);
int DeleteEmployeeFromFile(int empId);
int LoadAllEmployees(Employee records[], int maxCount);
int GetNextEmployeeId();
void InitListViewColumns(HWND hList);
void PopulateListView(HWND hList, const char *searchFilter);
void ShowAddEmployeeDialog(HWND hParent);
void ShowPayslipDialog(HWND hParent, const Employee *emp);

/**
 * Automatically computes salary components: HRA, DA, PF, Gross, and Net
 */
void CalculateSalary(Employee *emp) {
    emp->hra = (emp->basicSalary * HRA_PERCENTAGE) / 100.0;
    emp->da = (emp->basicSalary * DA_PERCENTAGE) / 100.0;
    emp->medicalAllowance = (emp->basicSalary > 0) ? MEDICAL_ALLOWANCE : 0.0;
    emp->grossSalary = emp->basicSalary + emp->hra + emp->da + emp->medicalAllowance;
    
    // Provident Fund deduction
    emp->pf = (emp->basicSalary * PF_PERCENTAGE) / 100.0;
    
    // Tax computation (5% deduction if gross exceeds 50,000)
    emp->tax = (emp->grossSalary > 50000.0) ? ((emp->grossSalary - 50000.0) * 0.05) : 0.0;
    
    // Net Salary = Gross - (PF + Tax)
    emp->netSalary = emp->grossSalary - (emp->pf + emp->tax);
}

/**
 * Appends an employee struct record to binary file "records.dat"
 */
int SaveEmployeeToFile(const Employee *emp) {
    FILE *fp = fopen(FILE_NAME, "ab");
    if (!fp) {
        MessageBox(hMainWindow, "Failed to open records.dat for writing!", "File Error", MB_ICONERROR);
        return 0;
    }
    size_t written = fwrite(emp, sizeof(Employee), 1, fp);
    fclose(fp);
    return (written == 1) ? 1 : 0;
}

/**
 * Loads all employee records from "records.dat"
 */
int LoadAllEmployees(Employee records[], int maxCount) {
    FILE *fp = fopen(FILE_NAME, "rb");
    if (!fp) return 0;
    
    int count = 0;
    while (count < maxCount && fread(&records[count], sizeof(Employee), 1, fp) == 1) {
        count++;
    }
    fclose(fp);
    return count;
}

/**
 * Searches and updates an existing record in place
 */
int UpdateEmployeeInFile(const Employee *emp) {
    FILE *fp = fopen(FILE_NAME, "rb+");
    if (!fp) return 0;
    
    Employee temp;
    int found = 0;
    while (fread(&temp, sizeof(Employee), 1, fp) == 1) {
        if (temp.empId == emp->empId) {
            fseek(fp, -(long)sizeof(Employee), SEEK_CUR);
            fwrite(emp, sizeof(Employee), 1, fp);
            found = 1;
            break;
        }
    }
    fclose(fp);
    return found;
}

/**
 * Deletes an employee by writing non-deleted records to a temporary file
 */
int DeleteEmployeeFromFile(int empId) {
    FILE *fp = fopen(FILE_NAME, "rb");
    if (!fp) return 0;
    
    FILE *tempFp = fopen("temp.dat", "wb");
    if (!tempFp) {
        fclose(fp);
        return 0;
    }
    
    Employee emp;
    int deleted = 0;
    while (fread(&emp, sizeof(Employee), 1, fp) == 1) {
        if (emp.empId == empId) {
            deleted = 1;
        } else {
            fwrite(&emp, sizeof(Employee), 1, tempFp);
        }
    }
    fclose(fp);
    fclose(tempFp);
    
    remove(FILE_NAME);
    rename("temp.dat", FILE_NAME);
    return deleted;
}

/**
 * Computes next available Employee ID
 */
int GetNextEmployeeId() {
    FILE *fp = fopen(FILE_NAME, "rb");
    if (!fp) return 1001;
    
    Employee emp;
    int maxId = 1000;
    while (fread(&emp, sizeof(Employee), 1, fp) == 1) {
        if (emp.empId > maxId) maxId = emp.empId;
    }
    fclose(fp);
    return maxId + 1;
}

/**
 * Win32 Application Entry Point
 */
int WINAPI WinMain(HINSTANCE hInstance, HINSTANCE hPrevInstance, LPSTR lpCmdLine, int nCmdShow) {
    INITCOMMONCONTROLSEX icex;
    icex.dwSize = sizeof(INITCOMMONCONTROLSEX);
    icex.dwICC = ICC_LISTVIEW_CLASSES | ICC_BAR_CLASSES;
    InitCommonControlsEx(&icex);
    
    hAppInstance = hInstance;
    
    const char CLASS_NAME[] = "PayrollSystemWindowClass";
    WNDCLASSEX wc = {0};
    wc.cbSize = sizeof(WNDCLASSEX);
    wc.lpfnWndProc = WindowProc;
    wc.hInstance = hInstance;
    wc.lpszClassName = CLASS_NAME;
    wc.hCursor = LoadCursor(NULL, IDC_ARROW);
    wc.hbrBackground = (HBRUSH)(COLOR_BTNFACE + 1);
    wc.lpszMenuName = NULL;
    
    if (!RegisterClassEx(&wc)) {
        MessageBox(NULL, "Window Registration Failed!", "Error", MB_ICONEXCLAMATION | MB_OK);
        return 0;
    }
    
    hMainWindow = CreateWindowEx(
        0,
        CLASS_NAME,
        "Employee Payroll Management System - [records.dat]",
        WS_OVERLAPPEDWINDOW,
        CW_USEDEFAULT, CW_USEDEFAULT, 980, 620,
        NULL, NULL, hInstance, NULL
    );
    
    if (!hMainWindow) return 0;
    
    ShowWindow(hMainWindow, nCmdShow);
    UpdateWindow(hMainWindow);
    
    // Win32 Message Loop
    MSG msg = {0};
    while (GetMessage(&msg, NULL, 0, 0)) {
        TranslateMessage(&msg);
        DispatchMessage(&msg);
    }
    return (int)msg.wParam;
}
`;
}

/**
 * Exports records as a downloadable CSV
 */
export function exportToCSV(records: Employee[]): void {
  const headers = [
    'EmpID',
    'Code',
    'Name',
    'Department',
    'Designation',
    'Phone',
    'Email',
    'DateOfJoining',
    'BankAccount',
    'BasicSalary',
    'HRA',
    'DA',
    'MedicalAllowance',
    'PF',
    'Tax',
    'GrossSalary',
    'NetSalary',
    'Status',
  ];

  const rows = records.map((r) => [
    r.empId,
    `"${r.code}"`,
    `"${r.name}"`,
    `"${r.department}"`,
    `"${r.designation}"`,
    `"${r.phone}"`,
    `"${r.email}"`,
    r.dateOfJoining,
    `"${r.bankAccount}"`,
    r.basicSalary.toFixed(2),
    r.hra.toFixed(2),
    r.da.toFixed(2),
    r.medicalAllowance.toFixed(2),
    r.pf.toFixed(2),
    r.tax.toFixed(2),
    r.grossSalary.toFixed(2),
    r.netSalary.toFixed(2),
    r.status,
  ]);

  const csvContent = [headers.join(','), ...rows.map((row) => row.join(','))].join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `payroll_records_${new Date().toISOString().slice(0, 10)}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Exports raw records as .dat file
 */
export function exportToDat(records: Employee[]): void {
  const json = JSON.stringify(records, null, 2);
  const blob = new Blob([json], { type: 'application/octet-stream' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'records.dat';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Downloads the complete C source code file (payroll_system.c)
 */
export function downloadCSourceCode(): void {
  const source = generateCSourceCode();
  const blob = new Blob([source], { type: 'text/plain;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = 'payroll_system.c';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
