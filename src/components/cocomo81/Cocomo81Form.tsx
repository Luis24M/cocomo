import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DevelopmentMode } from "@/utils/cocomoCalculations";
import CostDriversTable from "./CostDriversTable";
import { PhaseData, DetailedCosts } from "@/utils/cocomoCalculations";

interface Cocomo81FormProps {
  kloc?: number;
  setKloc?: (value: number) => void;
  developmentMode?: DevelopmentMode;
  setDevelopmentMode?: (value: DevelopmentMode) => void;
  developerSalary?: number;
  setDeveloperSalary?: (value: number) => void;
  useDetailedCosts?: boolean;
  setUseDetailedCosts?: (value: boolean) => void;
  detailedCosts?: DetailedCosts;
  onDetailedCostChange?: (phase: keyof DetailedCosts, field: keyof PhaseData, value: number) => void;
  calculateAverageSalary?: () => number;
  getTotalPercentage?: () => number;
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
  useDetailedCosts = false,
  setUseDetailedCosts,
  detailedCosts,
  onDetailedCostChange,
  calculateAverageSalary,
  getTotalPercentage,
  showCostDrivers = true, 
  showOnlyCostDrivers = false,
  setResults 
}: Cocomo81FormProps) {

  const isPercentageValid = () => {
    if (!getTotalPercentage) return true;
    const total = getTotalPercentage();
    return total === 100;
  };

  const getAverageSalary = () => {
    return calculateAverageSalary ? calculateAverageSalary() : 0;
  };

  const getTotalPercentageValue = () => {
    return getTotalPercentage ? getTotalPercentage() : 0;
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
              onCheckedChange={(checked) => setUseDetailedCosts && setUseDetailedCosts(checked as boolean)}
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
                  Total: {getTotalPercentageValue()}% {!isPercentageValid() && '(debe ser 100%)'} {getAverageSalary().toLocaleString('es-ES', { 
                    style: 'currency', 
                    currency: 'PEN',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0 
                  })}
                </div>
              </div>
              
              {detailedCosts && (
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse border border-gray-300">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">Fase</th>
                        <th className="border border-gray-300 px-3 py-2 text-center text-sm font-medium">Porcentaje (%)</th>
                        <th className="border border-gray-300 px-3 py-2 text-center text-sm font-medium">Costo Mensual</th>
                      </tr>
                    </thead>
                    <tbody>
                      {Object.entries(detailedCosts).map(([phase, data]) => {
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
                                onChange={(e) => onDetailedCostChange && onDetailedCostChange(
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
                                onChange={(e) => onDetailedCostChange && onDetailedCostChange(
                                  phase as keyof DetailedCosts, 
                                  'cost', 
                                  e.target.value === '' ? 0 : Number(e.target.value)
                                )}
                                className="h-8 text-sm text-center"
                                placeholder="0"
                              />
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                    <tfoot>
                      <tr className="bg-blue-50 font-medium">
                        <td className="border border-gray-300 px-3 py-2 text-sm">TOTAL</td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-sm">
                          {getTotalPercentageValue()}%
                        </td>
                        <td className="border border-gray-300 px-2 py-2 text-center text-sm">
                          {getAverageSalary().toLocaleString('es-ES', { 
                            style: 'currency', 
                            currency: 'PEN',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0 
                          })}
                        </td>
                      </tr>
                    </tfoot>
                  </table>
                </div>
              )}
              
              {/* <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded"> */}
                {!isPercentageValid() && (
                  <div className="text-xs text-red-600 mt-1">
                    * Los porcentajes deben sumar exactamente 100% para calcular correctamente
                  </div>
                )}
              {/* </div> */}
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