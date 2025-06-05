import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { useState, useEffect } from "react";
import { DevelopmentMode } from "@/utils/cocomoCalculations";
import CostDriversTable from "./CostDriversTable";

interface PhaseData {
  percentage: number;
  cost: number;
  effort?: number; // Person-months calculado para esta fase
  time?: number; // Tiempo en meses para esta fase
  totalCost?: number; // Costo total calculado para esta fase
}

interface DetailedCosts {
  requirements: PhaseData;
  analysis: PhaseData;
  design: PhaseData;
  development: PhaseData;
  testing: PhaseData;
}

interface Cocomo81FormProps {
  kloc?: number;
  setKloc?: (value: number) => void;
  developmentMode?: DevelopmentMode;
  setDevelopmentMode?: (value: DevelopmentMode) => void;
  developerSalary?: number;
  setDeveloperSalary?: (value: number) => void;
  showCostDrivers?: boolean;
  showOnlyCostDrivers?: boolean;
  // Props para compatibilidad hacia atrás (cuando se usa de forma independiente)
  setResults?: (results: any) => void;
}

export default function Cocomo81Form({ 
  kloc = 10,
  setKloc,
  developmentMode = "organic",
  setDevelopmentMode,
  developerSalary = 5000,
  setDeveloperSalary,
  showCostDrivers = true, 
  showOnlyCostDrivers = false,
  setResults 
}: Cocomo81FormProps) {
  const [useDetailedCosts, setUseDetailedCosts] = useState(false);
  const [detailedCosts, setDetailedCosts] = useState<DetailedCosts>({
    requirements: { percentage: 0, cost: 0 },
    analysis: { percentage: 0, cost: 0 },
    design: { percentage: 0, cost: 0 },
    development: { percentage: 0, cost: 0 },
    testing: { percentage: 0, cost: 0 }
  });

  // Calcular el salario promedio basado en los costos detallados
  const calculateAverageSalary = () => {
    const phases = Object.values(detailedCosts);
    const totalPercentage = phases.reduce((sum, phase) => sum + phase.percentage, 0);
    
    if (totalPercentage === 0) return 0;
    
    const weightedSum = phases.reduce((sum, phase) => {
      return sum + (phase.percentage / 100) * phase.cost;
    }, 0);
    
    return weightedSum;
  };

  // Calcular resultados por fase (simulación básica de COCOMO)
  const calculatePhaseResults = () => {
    if (!kloc || kloc === 0) return detailedCosts;
    
    // Constantes básicas de COCOMO según el modo
    const cocomoConstants = {
      organic: { a: 2.4, b: 1.05, c: 2.5, d: 0.38 },
      'semi-detached': { a: 3.0, b: 1.12, c: 2.5, d: 0.35 },
      embedded: { a: 3.6, b: 1.20, c: 2.5, d: 0.32 }
    };
    
    const constants = cocomoConstants[developmentMode];
    
    // Cálculo básico de COCOMO
    const totalEffort = constants.a * Math.pow(kloc, constants.b); // Person-months
    const totalTime = constants.c * Math.pow(totalEffort, constants.d); // Months
    
    // Calcular resultados por fase
    const updatedCosts = { ...detailedCosts };
    
    Object.keys(updatedCosts).forEach(phase => {
      const phaseData = updatedCosts[phase as keyof DetailedCosts];
      if (phaseData.percentage > 0) {
        // Distribuir el esfuerzo y tiempo según el porcentaje
        phaseData.effort = (phaseData.percentage / 100) * totalEffort;
        phaseData.time = (phaseData.percentage / 100) * totalTime;
        phaseData.totalCost = phaseData.effort * phaseData.cost;
      } else {
        phaseData.effort = 0;
        phaseData.time = 0;
        phaseData.totalCost = 0;
      }
    });
    console.log(updatedCosts)
    return updatedCosts;
  };

  // Actualizar el salario cuando cambien los costos detallados
  useEffect(() => {
    if (useDetailedCosts && setDeveloperSalary) {
      const avgSalary = calculateAverageSalary();
      setDeveloperSalary(avgSalary);
    }
    
    // Calcular y pasar resultados por fase si se proporciona setResults
    if (useDetailedCosts && setResults && kloc) {
      const phaseResults = calculatePhaseResults();
      setResults({
        phaseBreakdown: phaseResults,
        averageSalary: calculateAverageSalary(),
        totalPercentage: getTotalPercentage()
      });
    }
  }, [detailedCosts, useDetailedCosts, setDeveloperSalary, kloc, developmentMode, setResults]);

  const handleDetailedCostChange = (
    phase: keyof DetailedCosts, 
    field: keyof PhaseData, 
    value: number
  ) => {
    setDetailedCosts(prev => ({
      ...prev,
      [phase]: {
        ...prev[phase],
        [field]: value
      }
    }));
  };

  const getTotalPercentage = () => {
    return Object.values(detailedCosts).reduce((sum, phase) => sum + phase.percentage, 0);
  };

  const isPercentageValid = () => {
    const total = getTotalPercentage();
    return total === 100;
  };

  if (showOnlyCostDrivers) {
    return (
      <div>
        <CostDriversTable onEafChange={() => {}} />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="kloc" className="text-sm font-medium">Tamaño (KLDC)</Label>
          <Input 
            id="kloc" 
            type="number" 
            min="0"
            step="0.1"
            value={kloc || ''}
            onChange={(e) => setKloc && setKloc(e.target.value === '' ? 0 : Number(e.target.value))}
            className="h-9"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mode" className="text-sm font-medium">Tipo de desarrollo</Label>
          <Select 
            value={developmentMode} 
            onValueChange={(value) => setDevelopmentMode && setDevelopmentMode(value as DevelopmentMode)}
          >
            <SelectTrigger className="h-9">
              <SelectValue placeholder="Seleccionar modo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="organic">Orgánico</SelectItem>
              <SelectItem value="semi-detached">Semi-independiente</SelectItem>
              <SelectItem value="embedded">Empotrado</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <div className="flex items-center space-x-2">
            <Checkbox 
              id="detailed-costs"
              checked={useDetailedCosts}
              onCheckedChange={(checked) => setUseDetailedCosts(checked as boolean)}
            />
            <Label htmlFor="detailed-costs" className="text-sm font-medium">
              Usar costos detallados por fase
            </Label>
          </div>

          {!useDetailedCosts ? (
            <div className="space-y-2">
              <Label htmlFor="salary" className="text-sm font-medium">Salario del desarrollador (mensual)</Label>
              <Input 
                id="salary" 
                type="number" 
                min="0"
                step="100"
                value={developerSalary || ''}
                onChange={(e) => setDeveloperSalary && setDeveloperSalary(e.target.value === '' ? 0 : Number(e.target.value))}
                className="h-9"
                placeholder="Ej: 5000"
              />
            </div>
          ) : (
            <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
              <div className="flex justify-between items-center">
                <h3 className="text-sm font-medium">Costos detallados por fase</h3>
                <div className={`text-sm ${isPercentageValid() ? 'text-green-600' : 'text-red-600'}`}>
                  Total: {getTotalPercentage()}% {!isPercentageValid() && '(debe ser 100%)'}
                </div>
              </div>
              
              <div className="overflow-x-auto">
                <table className="w-full border-collapse border border-gray-300">
                  <thead>
                    <tr className="bg-gray-100">
                      <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">Fase</th>
                      <th className="border border-gray-300 px-3 py-2 text-center text-sm font-medium">Porcentaje (%)</th>
                      <th className="border border-gray-300 px-3 py-2 text-center text-sm font-medium">Costo Mensual</th>
                      <th className="border border-gray-300 px-3 py-2 text-center text-sm font-medium">Esfuerzo (PM)</th>
                      <th className="border border-gray-300 px-3 py-2 text-center text-sm font-medium">Tiempo (Meses)</th>
                      <th className="border border-gray-300 px-3 py-2 text-center text-sm font-medium">Costo Total</th>
                    </tr>
                  </thead>
                  <tbody>
                    {Object.entries(calculatePhaseResults()).map(([phase, data]) => {
                      const phaseLabels = {
                        requirements: 'Requerimientos',
                        analysis: 'Análisis',
                        design: 'Diseño',
                        development: 'Desarrollo',
                        testing: 'Pruebas'
                      };
                      
                      return (
                        <tr key={phase} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-3 py-2 text-sm font-medium">
                            {phaseLabels[phase as keyof typeof phaseLabels]}
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <Input
                              type="number"
                              min="0"
                              max="100"
                              step="1"
                              value={data.percentage || ''}
                              onChange={(e) => handleDetailedCostChange(
                                phase as keyof DetailedCosts, 
                                'percentage', 
                                e.target.value === '' ? 0 : Number(e.target.value)
                              )}
                              className="h-8 text-sm text-center"
                              placeholder="0"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2">
                            <Input
                              type="number"
                              min="0"
                              step="100"
                              value={data.cost || ''}
                              onChange={(e) => handleDetailedCostChange(
                                phase as keyof DetailedCosts, 
                                'cost', 
                                e.target.value === '' ? 0 : Number(e.target.value)
                              )}
                              className="h-8 text-sm text-center"
                              placeholder="0"
                            />
                          </td>
                          <td className="border border-gray-300 px-2 py-2 text-center text-sm">
                            {data.effort ? data.effort.toFixed(2) : '-'}
                          </td>
                          <td className="border border-gray-300 px-2 py-2 text-center text-sm">
                            {data.time ? data.time.toFixed(2) : '-'}
                          </td>
                          <td className="border border-gray-300 px-2 py-2 text-center text-sm font-medium">
                            {data.totalCost ? 
                              data.totalCost.toLocaleString('es-ES', { 
                                style: 'currency', 
                                currency: 'USD',
                                minimumFractionDigits: 0,
                                maximumFractionDigits: 0 
                              }) : '-'
                            }
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot>
                    <tr className="bg-blue-50 font-medium">
                      <td className="border border-gray-300 px-3 py-2 text-sm">TOTAL</td>
                      <td className="border border-gray-300 px-2 py-2 text-center text-sm">
                        {getTotalPercentage()}%
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center text-sm">
                        {calculateAverageSalary().toLocaleString('es-ES', { 
                          style: 'currency', 
                          currency: 'USD',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0 
                        })}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center text-sm">
                        {Object.values(calculatePhaseResults()).reduce((sum, phase) => sum + (phase.effort || 0), 0).toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center text-sm">
                        {Math.max(...Object.values(calculatePhaseResults()).map(phase => phase.time || 0)).toFixed(2)}
                      </td>
                      <td className="border border-gray-300 px-2 py-2 text-center text-sm">
                        {Object.values(calculatePhaseResults()).reduce((sum, phase) => sum + (phase.totalCost || 0), 0).toLocaleString('es-ES', { 
                          style: 'currency', 
                          currency: 'USD',
                          minimumFractionDigits: 0,
                          maximumFractionDigits: 0 
                        })}
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
              
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded">
                <div className="text-sm text-blue-800">
                  <strong>Salario promedio calculado: </strong>
                  {calculateAverageSalary().toLocaleString('es-ES', { 
                    style: 'currency', 
                    currency: 'USD',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0 
                  })}
                </div>
                {!isPercentageValid() && (
                  <div className="text-xs text-red-600 mt-1">
                    * Los porcentajes deben sumar exactamente 100% para calcular correctamente
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
      
      {showCostDrivers && (
        <div className="mt-8">
          <CostDriversTable onEafChange={() => {}} />
        </div>
      )}
    </div>
  );
}