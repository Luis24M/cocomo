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

export type CostDrivers = {
  rely: number; // Required Software Reliability
  data: number; // Database Size
  cplx: number; // Product Complexity
  ruse: number; // Developed for Reusability
  docu: number; // Documentation Match to Life-cycle Needs
  time: number; // Execution Time Constraint
  stor: number; // Main Storage Constraint
  pvol: number; // Platform Volatility
  acap: number; // Analyst Capability
  pcap: number; // Programmer Capability
  pcon: number; // Personnel Continuity
  apex: number; // Applications Experience
  plex: number; // Platform Experience
  ltex: number; // Language and Tool Experience
  tool: number; // Use of Software Tools
  site: number; // Multisite Development
  sced: number; // Required Development Schedule
};

export type Cocomo2Input = {
  size: number; // Size in KLOC or Function Points
  scaleDrivers: ScaleDrivers;
  costDrivers: CostDrivers;
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
export function calculateCocomo2({ size, scaleDrivers, costDrivers, usesFunctionPoints, developerSalary = 5000 }: Cocomo2Input): CocomoResults {
  // Convert function points to KLOC if needed (simplified conversion)
  const sizeInKLOC = usesFunctionPoints ? size * 0.1 : size;
  
  // Calculate scale factor
  const scaleFactorSum = Object.values(scaleDrivers).reduce((sum, value) => sum + value, 0);
  const scaleFactor = 0.91 + 0.01 * scaleFactorSum;
  
  // Calculate Effort Multiplier (EM)
  const effortMultiplier = Object.values(costDrivers).reduce((product, value) => product * value, 1.0);
  
  // Calculate effort
  const effort = 2.94 * Math.pow(sizeInKLOC, scaleFactor) * effortMultiplier;
  
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

// Constants and ranges for COCOMO II parameters
export const scaleDriverRanges = {
  precedentedness: { min: 0, max: 6, labels: ["Very High", "High", "Nominal", "Low", "Very Low"] },
  developmentFlexibility: { min: 0, max: 6, labels: ["Very High", "High", "Nominal", "Low", "Very Low"] },
  architectureRiskResolution: { min: 0, max: 6, labels: ["Very High", "High", "Nominal", "Low", "Very Low"] },
  teamCohesion: { min: 0, max: 6, labels: ["Very High", "High", "Nominal", "Low", "Very Low"] },
  processMaturiy: { min: 0, max: 6, labels: ["Very High", "High", "Nominal", "Low", "Very Low"] }
};

export const costDriverRanges = {
  rely: { values: [0.75, 0.88, 1.00, 1.15, 1.39], labels: ["Very Low", "Low", "Nominal", "High", "Very High"] },
  data: { values: [0.93, 1.00, 1.09, 1.19], labels: ["Low", "Nominal", "High", "Very High"] },
  cplx: { values: [0.75, 0.88, 1.00, 1.15, 1.30, 1.66], labels: ["Very Low", "Low", "Nominal", "High", "Very High", "Extra High"] },
  ruse: { values: [0.91, 1.00, 1.14, 1.29, 1.49], labels: ["Low", "Nominal", "High", "Very High", "Extra High"] },
  docu: { values: [0.81, 0.91, 1.00, 1.11, 1.23], labels: ["Very Low", "Low", "Nominal", "High", "Very High"] },
  time: { values: [1.00, 1.11, 1.29, 1.63], labels: ["Nominal", "High", "Very High", "Extra High"] },
  stor: { values: [1.00, 1.05, 1.17, 1.46], labels: ["Nominal", "High", "Very High", "Extra High"] },
  pvol: { values: [0.87, 1.00, 1.15, 1.30], labels: ["Low", "Nominal", "High", "Very High"] },
  acap: { values: [1.42, 1.19, 1.00, 0.85, 0.71], labels: ["Very Low", "Low", "Nominal", "High", "Very High"] },
  pcap: { values: [1.34, 1.15, 1.00, 0.88, 0.76], labels: ["Very Low", "Low", "Nominal", "High", "Very High"] },
  pcon: { values: [1.29, 1.12, 1.00, 0.90, 0.81], labels: ["Very Low", "Low", "Nominal", "High", "Very High"] },
  apex: { values: [1.22, 1.10, 1.00, 0.88, 0.81], labels: ["Very Low", "Low", "Nominal", "High", "Very High"] },
  plex: { values: [1.19, 1.09, 1.00, 0.91, 0.85], labels: ["Very Low", "Low", "Nominal", "High", "Very High"] },
  ltex: { values: [1.20, 1.09, 1.00, 0.91, 0.84], labels: ["Very Low", "Low", "Nominal", "High", "Very High"] },
  tool: { values: [1.17, 1.09, 1.00, 0.90, 0.78], labels: ["Very Low", "Low", "Nominal", "High", "Very High"] },
  site: { values: [1.22, 1.09, 1.00, 0.93, 0.86, 0.80], labels: ["Very Low", "Low", "Nominal", "High", "Very High", "Extra High"] },
  sced: { values: [1.43, 1.14, 1.00, 1.00, 1.00], labels: ["Very Low", "Low", "Nominal", "High", "Very High"] }
};
