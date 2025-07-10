import { PhaseData, DetailedCosts } from "@/utils/cocomoCalculations";
import React from 'react';
import { Input } from '../ui/input';

interface DetailedCostsProps {
  detailedCosts?: DetailedCosts;
  onDetailedCostChange?: (phase: keyof DetailedCosts, field: keyof PhaseData, value: number) => void;
  calculateAverageSalary?: () => number;
  getTotalPercentage?: () => number;
}


export default function DetailedCostsView({detailedCosts,
  onDetailedCostChange,
  calculateAverageSalary,
  getTotalPercentage,} : DetailedCostsProps) {
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
  return (
    <div className="space-y-4 p-4 border rounded-lg bg-gray-50">
      <div className="flex justify-between items-center">
        <h3 className="text-sm font-medium">Costos detallados por fase</h3>
        <div
          className={`text-sm ${
            isPercentageValid() ? 'text-green-600' : 'text-red-600'
          }`}
        >
          Total: {getTotalPercentageValue()}%{' '}
          {!isPercentageValid() && '(debe ser 100%)'}{' '}
          {getAverageSalary().toLocaleString('es-ES', {
            style: 'currency',
            currency: 'PEN',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
          })}
        </div>
      </div>

      {detailedCosts && (
        <div className="overflow-x-auto">
          <table className="w-full border-collapse border border-gray-300">
            <thead>
              <tr className="bg-gray-100">
                <th className="border border-gray-300 px-3 py-2 text-left text-sm font-medium">
                  Fase
                </th>
                <th className="border border-gray-300 px-3 py-2 text-center text-sm font-medium">
                  Porcentaje (%)
                </th>
                <th className="border border-gray-300 px-3 py-2 text-center text-sm font-medium">
                  Costo Mensual
                </th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(detailedCosts).map(([phase, data]) => {
                const phaseLabels = {
                  requirements: 'Requerimientos',
                  analysis: 'Análisis',
                  design: 'Diseño',
                  development: 'Desarrollo',
                  testing: 'Pruebas',
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
                        onChange={(e) =>
                          onDetailedCostChange &&
                          onDetailedCostChange(
                            phase as keyof DetailedCosts,
                            'percentage',
                            e.target.value === '' ? 0 : Number(e.target.value)
                          )
                        }
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
                        onChange={(e) =>
                          onDetailedCostChange &&
                          onDetailedCostChange(
                            phase as keyof DetailedCosts,
                            'cost',
                            e.target.value === '' ? 0 : Number(e.target.value)
                          )
                        }
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
                <td className="border border-gray-300 px-3 py-2 text-sm">
                  TOTAL
                </td>
                <td className="border border-gray-300 px-2 py-2 text-center text-sm">
                  {getTotalPercentageValue()}%
                </td>
                <td className="border border-gray-300 px-2 py-2 text-center text-sm">
                  {getAverageSalary().toLocaleString('es-ES', {
                    style: 'currency',
                    currency: 'PEN',
                    minimumFractionDigits: 0,
                    maximumFractionDigits: 0,
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
          * Los porcentajes deben sumar exactamente 100% para calcular
          correctamente
        </div>
      )}
      {/* </div> */}
    </div>
  );
}
