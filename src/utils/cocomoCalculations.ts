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
  processMaturiy: number;
};

export type Cocomo2Input = {
  size: number; // Size in KLOC or Function Points
  //scaleDrivers: ScaleDrivers; // no se usan aqui
  //costDrivers: CostDrivers; // no se usan aqui
  scaleFactorSum?:number;
  eaf?: number;
  usesFunctionPoints: boolean;
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
}

export type DetailedCosts = {
  requirements: PhaseData;
  analysis: PhaseData;
  design: PhaseData;
  development: PhaseData;
  testing: PhaseData;
}

export type PhaseData = {
  percentage: number;
  cost: number;
  effort?: number; // Person-months calculado para esta fase
  time?: number; // Tiempo en meses para esta fase
  totalCost?: number; // Costo total calculado para esta fase
};

// COCOMO 81 Calculations
export function calculateCocomo81({ kloc, developmentMode, eaf = 1.0, developerSalary = 5000 }: Cocomo81Input): CocomoResults {
  const constants = {
    organic: { a: 2.4, b: 1.05, c: 2.5, d: 0.38 },
    "semi-detached": { a: 3.0, b: 1.12, c: 2.5, d: 0.35 },
    embedded: { a: 3.6, b: 1.20, c: 2.5, d: 0.32 },
  };
  
  const { a, b, c, d } = constants[developmentMode];
  
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
    costPerMonth: parseFloat(costPerMonth.toFixed(2))
  };
}

// COCOMO II Calculations
export function calculateCocomo2({ size, scaleFactorSum, eaf = 1.0 , usesFunctionPoints, developerSalary = 5000 }: Cocomo2Input): CocomoResults {
  // Convert function points to KLOC if needed (simplified conversion)
  const sizeInKLOC = usesFunctionPoints ? size * 0.1 : size;
  
  // Calculate scale factor
  //const scaleFactorSum = Object.values(scaleDrivers).reduce((sum, value) => sum + value, 0);
  const scaleFactor = 0.91 + 0.01 * scaleFactorSum;
  
  // Calculate Effort Multiplier (EM)
  //const effortMultiplier = Object.values(costDrivers).reduce((product, value) => product * value, 1.0);
  
  // Calculate effort
  const effort = 2.94 * Math.pow(sizeInKLOC, scaleFactor) * eaf;
  
  // Calculate duration
  const durationExponent = 0.33 + 0.2 * (scaleFactor - 1.01);
  const duration = 3.67 * Math.pow(effort, durationExponent);
  
  // Average staffing
  const staffing = effort / duration;
  
  // Calculate costs
  const totalCost = effort * developerSalary;
  const costPerMonth = totalCost / duration;
  
  console.log(totalCost, costPerMonth)

  return {
    effort: parseFloat(effort.toFixed(2)),
    duration: parseFloat(duration.toFixed(2)),
    staffing: parseFloat(staffing.toFixed(2)),
    totalCost: parseFloat(totalCost.toFixed(2)),
    costPerMonth: parseFloat(costPerMonth.toFixed(2))
  };
}

// Default values for COCOMO II
export const defaultCocomo2Values = {
  scaleDrivers: {
    precedentedness: 3.72,
    developmentFlexibility: 3.04,
    architectureRiskResolution: 3.29,
    teamCohesion: 3.12,
    processMaturiy: 3.12
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

// Function to calculate Function Points from KLOC
export function calculateFunctionPoints(FP: number, adjustFactor: number, functionPointsWeight: number): FunctionPointsResults {
  const adjustedFunctionPoints = functionPointsWeight * adjustFactor;
  const linesOfCode = functionPointsWeight * FP ;

  return {
    unadjustedFunctionPoints: functionPointsWeight,
    adjustedFunctionPoints: adjustedFunctionPoints,
    linesOfCode: linesOfCode
  };
}