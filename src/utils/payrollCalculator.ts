import { Employee, PayrollRules } from '../types/payroll';

export const DEFAULT_PAYROLL_RULES: PayrollRules = {
  hraPercentage: 20, // 20% of Basic Salary
  daPercentage: 15,  // 15% of Basic Salary
  medicalFlatAllowance: 1250, // Fixed monthly allowance
  pfPercentage: 12,  // 12% of Basic Salary (Provident Fund deduction)
  taxRateStandard: 5,// 5% if Gross > threshold
  taxThreshold: 50000,
  currencySymbol: '$',
};

/**
 * Automatically computes HRA, DA, PF, Gross, and Net salary in accordance with C payroll logic
 */
export function computeSalaryComponents(
  basicSalary: number,
  rules: PayrollRules = DEFAULT_PAYROLL_RULES
): {
  hra: number;
  da: number;
  medicalAllowance: number;
  pf: number;
  tax: number;
  grossSalary: number;
  netSalary: number;
} {
  const safeBasic = Math.max(0, Number(basicSalary) || 0);

  // HRA = (Basic * HRA%) / 100
  const hra = Math.round(((safeBasic * rules.hraPercentage) / 100) * 100) / 100;

  // DA = (Basic * DA%) / 100
  const da = Math.round(((safeBasic * rules.daPercentage) / 100) * 100) / 100;

  // Medical Allowance (flat rate if basic > 0)
  const medicalAllowance = safeBasic > 0 ? rules.medicalFlatAllowance : 0;

  // Gross Salary = Basic + HRA + DA + Medical Allowance
  const grossSalary = Math.round((safeBasic + hra + da + medicalAllowance) * 100) / 100;

  // PF (Provident Fund deduction) = (Basic * PF%) / 100
  const pf = Math.round(((safeBasic * rules.pfPercentage) / 100) * 100) / 100;

  // Tax deduction
  let tax = 0;
  if (grossSalary > rules.taxThreshold) {
    tax = Math.round((((grossSalary - rules.taxThreshold) * rules.taxRateStandard) / 100) * 100) / 100;
  }

  // Net Salary = Gross - (PF + Tax)
  const netSalary = Math.max(0, Math.round((grossSalary - pf - tax) * 100) / 100);

  return {
    hra,
    da,
    medicalAllowance,
    pf,
    tax,
    grossSalary,
    netSalary,
  };
}

/**
 * Formats a currency amount with thousands separators and 2 decimal points
 */
export function formatCurrency(amount: number, symbol: string = '$'): string {
  const safeAmount = Number(amount) || 0;
  return `${symbol}${safeAmount.toLocaleString('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  })}`;
}

/**
 * Converts a numeric amount to legal English words for official payslip generation
 */
export function numberToWords(amount: number, currencyName: string = 'Dollars'): string {
  const safeNum = Math.floor(Math.abs(amount));
  if (safeNum === 0) return `Zero ${currencyName} Only`;

  const ones = [
    '', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine',
    'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen',
    'Seventeen', 'Eighteen', 'Nineteen'
  ];

  const tens = [
    '', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'
  ];

  function convertHundreds(n: number): string {
    let str = '';
    if (n >= 100) {
      str += ones[Math.floor(n / 100)] + ' Hundred ';
      n %= 100;
    }
    if (n >= 20) {
      str += tens[Math.floor(n / 10)] + ' ';
      n %= 10;
    }
    if (n > 0) {
      str += ones[n] + ' ';
    }
    return str.trim();
  }

  let words = '';
  const millions = Math.floor(safeNum / 1000000);
  const thousands = Math.floor((safeNum % 1000000) / 1000);
  const remainder = safeNum % 1000;

  if (millions > 0) {
    words += convertHundreds(millions) + ' Million ';
  }
  if (thousands > 0) {
    words += convertHundreds(thousands) + ' Thousand ';
  }
  if (remainder > 0) {
    words += convertHundreds(remainder) + ' ';
  }

  // Cents / fractional
  const cents = Math.round((Math.abs(amount) - safeNum) * 100);
  let centsStr = '';
  if (cents > 0) {
    centsStr = ` and ${cents}/100 Cents`;
  }

  return `${words.trim()} ${currencyName}${centsStr} Only`;
}
