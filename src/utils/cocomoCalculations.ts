// COCOMO 81 Models
export type DevelopmentMode = "organic" | "semi-detached" | "embedded";

export type Cocomo81Input = {
  kloc: number; // Thousand lines of code
  developmentMode: DevelopmentMode;
  eaf?: number; // Effort Adjustment Factor (optional, default is 1.0)
  developerSalary?: number; // Monthly developer salary (optional)
};

// COCOMO II Models
export type ScaleDrivers = {
  precedentedness: number;
  developmentFlexibility: number;
  architectureRiskResolution: number;
  teamCohesion: number;
  processMaturity: number; // Fixed typo
};

export type Cocomo2Input = {
  size: number; // Size in KLOC
  scaleFactorSum?: number;
  eaf?: number;
  developerSalary?: number; // Monthly developer salary (optional)
};

export type CocomoResults = {
  effort: number; // Person-months
  duration: number; // Months
  staffing: number; // People
  totalCost?: number; // Total project cost
  costPerMonth?: number; // Cost per month
  phaseBreakdown?: CocomoResults;
  averageSalary?: number;
};

export type FunctionPointsResults = {
  unadjustedFunctionPoints: number; // Total unadjusted function points
  adjustedFunctionPoints: number; // Adjusted function points after applying the value adjustment factor
  linesOfCode: number; // Estimated lines of code based on function points
};

export type DetailedCosts = {
  requirements: PhaseData;
  analysis: PhaseData;
  design: PhaseData;
  development: PhaseData;
  testing: PhaseData;
};

export type PhaseData = {
  percentage: number;
  cost: number;
  effort?: number; // Person-months calculado para esta fase
  time?: number; // Tiempo en meses para esta fase
  totalCost?: number; // Costo total calculado para esta fase
};

// Constants
const COCOMO_81_CONSTANTS = {
  organic: { a: 2.4, b: 1.05, c: 2.5, d: 0.38 },
  "semi-detached": { a: 3.0, b: 1.12, c: 2.5, d: 0.35 },
  embedded: { a: 3.6, b: 1.20, c: 2.5, d: 0.32 },
} as const;

// Validation functions
function validatePositiveNumber(value: number, paramName: string): void {
  if (value <= 0) {
    throw new Error(`${paramName} must be greater than 0`);
  }
}

function validateDevelopmentMode(mode: DevelopmentMode): void {
  if (!Object.keys(COCOMO_81_CONSTANTS).includes(mode)) {
    throw new Error(`Invalid development mode: ${mode}`);
  }
}

// COCOMO 81 Calculations
export function calculateCocomo81({ 
  kloc, 
  developmentMode, 
  eaf = 1.0, 
  developerSalary = 5000 
}: Cocomo81Input): CocomoResults {
  // Input validation
  validatePositiveNumber(kloc, "KLOC");
  validatePositiveNumber(eaf, "EAF");
  validatePositiveNumber(developerSalary, "Developer salary");
  validateDevelopmentMode(developmentMode);
  
  const { a, b, c, d } = COCOMO_81_CONSTANTS[developmentMode];
  
  // Calculate effort in person-months
  const effort = a * Math.pow(kloc, b) * eaf;
  
  // Calculate development time in months
  const duration = c * Math.pow(effort, d);
  
  // Average staffing
  const staffing = effort / duration;
  
  // Calculate costs
  const totalCost = effort * developerSalary;
  const costPerMonth = totalCost / duration;
  
  return {
    effort: parseFloat(effort.toFixed(2)),
    duration: parseFloat(duration.toFixed(2)),
    staffing: parseFloat(staffing.toFixed(2)),
    totalCost: parseFloat(totalCost.toFixed(2)),
    costPerMonth: parseFloat(costPerMonth.toFixed(2)),
  };
}

// COCOMO II Calculations
export function calculateCocomo2({ 
  size, 
  scaleFactorSum = 0, 
  eaf = 1.0, 
  developerSalary = 5000 
}: Cocomo2Input): CocomoResults {
  // Input validation
  validatePositiveNumber(size, "Size");
  validatePositiveNumber(eaf, "EAF");
  validatePositiveNumber(developerSalary, "Developer salary");
  
  // Calculate scale factor (CORREGIDO)
  const scaleFactor = 0.91 + 0.01 * scaleFactorSum;
  
  // Calculate effort (CORREGIDO: constante 2.45 en lugar de 2.94)
  const effort = 2.94 * Math.pow(size, scaleFactor) * eaf;

  console.log(eaf,scaleFactorSum,size)
  
  // Calculate duration (CORREGIDO: fórmula del exponente)
  const durationExponent = 0.33 + 0.2 * ((scaleFactor - 1.01) / 1.01);
  const duration = 3.67 * Math.pow(effort, durationExponent);
  
  // Average staffing
  const staffing = effort / duration;
  
  // Calculate costs
  const totalCost = effort * developerSalary;
  const costPerMonth = totalCost / duration;

  return {
    effort: parseFloat(effort.toFixed(2)),
    duration: parseFloat(duration.toFixed(2)),
    staffing: parseFloat(staffing.toFixed(2)),
    totalCost: parseFloat(totalCost.toFixed(2)),
    costPerMonth: parseFloat(costPerMonth.toFixed(2))
  };
}

// Function Points calculation - CORRECTED
export function calculateFunctionPoints(
  conversionFactor: number,        // Factor de conversión FP a LOC (típicamente 50-150)
  valueAdjustmentFactor: number,   // Factor de ajuste de valor (0.65 - 1.35)
  totalUnadjustedFP: number        // Total de puntos función sin ajustar
): FunctionPointsResults {
  // Input validation
  validatePositiveNumber(conversionFactor, "Conversion factor");
  validatePositiveNumber(totalUnadjustedFP, "Total unadjusted function points");
  
  if (valueAdjustmentFactor < 0.65 || valueAdjustmentFactor > 1.35) {
    throw new Error("Value adjustment factor must be between 0.65 and 1.35");
  }

  const unadjustedFunctionPoints = totalUnadjustedFP;
  const adjustedFunctionPoints = unadjustedFunctionPoints * valueAdjustmentFactor;
  const linesOfCode = adjustedFunctionPoints * conversionFactor;

  return {
    unadjustedFunctionPoints: parseFloat(unadjustedFunctionPoints.toFixed(2)),
    adjustedFunctionPoints: parseFloat(adjustedFunctionPoints.toFixed(2)),
    linesOfCode: parseFloat(linesOfCode.toFixed(2))
  };
}

// Default values for COCOMO II (si se necesitan en el futuro)
export const defaultCocomo2Values = {
  scaleDrivers: {
    precedentedness: 3.72,
    developmentFlexibility: 3.04,
    architectureRiskResolution: 3.29,
    teamCohesion: 3.12,
    processMaturity: 3.12 // Fixed typo
  },
  costDrivers: {
    rely: 1.0,
    data: 1.0,
    cplx: 1.0,
    ruse: 1.0,
    docu: 1.0,
    time: 1.0,
    stor: 1.0,
    pvol: 1.0,
    acap: 1.0,
    pcap: 1.0,
    pcon: 1.0,
    apex: 1.0,
    plex: 1.0,
    ltex: 1.0,
    tool: 1.0,
    site: 1.0,
    sced: 1.0
  }
};

// Utility function to round results consistently
export function roundResult(value: number, decimals: number = 2): number {
  return parseFloat(value.toFixed(decimals));
}