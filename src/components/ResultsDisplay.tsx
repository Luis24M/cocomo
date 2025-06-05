import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useResultadosEtapasStore } from '@/hooks/useResultadosEtapas';
import { CocomoResults } from '@/utils/cocomoCalculations';
import { Input } from './ui/input';

interface ResultsDisplayProps {
  results: CocomoResults;
  listResults?: CocomoResults[];
  addResult?: (result: CocomoResults) => void;
  clearResults?: () => void;
  showStages?: boolean;
  showOnlyStages?: boolean;
}

export default function ResultsDisplay({
  results,
  listResults,
  addResult = () => {},
  clearResults = () => {},
  showStages = true,
  showOnlyStages = false,
}: ResultsDisplayProps) {
  const { effort, duration, staffing, totalCost, costPerMonth } = results;
  const detailedCosts = useResultadosEtapasStore((state) => state.detailedCosts);
  const fasesActivas = useResultadosEtapasStore((state) => state.fasesActivas);
  console.log(detailedCosts);

  if (showOnlyStages) {
    return (
      <Card className="shadow-sm border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Resultados</CardTitle>
        </CardHeader>
        <CardContent>
          <table className="table-auto w-full text-sm text-center">
            <thead className="bg-gray-100">
              <tr className="text-xs text-gray-600">
                <th className="px-4 py-2 font-medium">Fase</th>
                <th className="px-4 py-2 font-medium">Porcentaje (%)</th>
                <th className="px-4 py-2 font-medium">Costo Mensual</th>
                {/* <th className="px-4 py-2 font-medium">Esfuerzo (PM)</th>
                <th className="px-4 py-2 font-medium">Tiempo (Meses)</th> */}
                <th className="px-4 py-2 font-medium">Costo Total</th>
              </tr>
            </thead>
            <tbody>
              {
                fasesActivas && Object.entries(detailedCosts).map(([phase, data]) => {
                  const phaseLabels = {
                    requirements: 'Requerimientos',
                    analysis: 'Análisis',
                    design: 'Diseño',
                    development: 'Desarrollo',
                    testing: 'Pruebas'
                  };
                  // solo resultados nada de inputs
                  return (
                    <tr key={phase} className="hover:bg-gray-50">
                      <td className="border border-gray-300 px-3 py-2 text-sm font-medium">
                        {phaseLabels[phase as keyof typeof phaseLabels]}
                      </td>
                      {/* porcentaje no es necesario ingresar datos */}
                      <td className="border border-gray-300 px-2 py-2">
                        <span className="block py-2">{data.percentage ?? 0}</span>
                      </td>

                      <td className="border border-gray-300 px-2 py-2">
                        <span className="block py-2">{data.cost ?? 0}</span>
                      </td>
                      {/* <td className="border border-gray-300 px-2 py-2">
                        <span className="block py-2">{data.effort ?? 0}</span>
                      </td>
                      <td className="border border-gray-300 px-2 py-2">
                        <span className="block py-2">{data.time ?? 0}</span>  
                      </td> */}
                      {/* costo total no es necesario ingresar datos */}
                      <td className="border border-gray-300 px-2 py-2">
                        <span className="block py-2">{data.totalCost ?? 0}</span>  
                      </td>
                    </tr>) 
              })
            }
            </tbody>
          </table>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="space-y-4">
      <Card className="shadow-sm border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg">Resultados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex justify-between items-center">
              <span className=" font-medium">Esfuerzo</span>
              <span className="">{effort.toFixed(1)} personas-mes</span>
            </div>

            <div className="flex justify-between items-center">
              <span className=" font-medium">Duración</span>
              <span className="">{duration.toFixed(1)} meses</span>
            </div>

            <div className="flex justify-between items-center">
              <span className=" font-medium">Tamaño de equipo</span>
              <span className="">{staffing.toFixed(1)} personas</span>
            </div>

            <div className="flex justify-between items-center">
              <span className=" font-medium">Costo Total</span>
              <span className="">{totalCost.toFixed(1)} </span>
            </div>

            <div className="flex justify-between items-center">
              <span className=" font-medium">Costo por mes</span>
              <span className="">{costPerMonth.toFixed(1)} </span>
            </div>
          </div>

          {/* <div className='flex justify-between items-center mt-4'>
            <button onClick={()=>addResult(results)} className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600">
              <span className="font-medium">Guardar</span>
            </button>
            <button onClick={clearResults} className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600">
              <span className="font-medium">Limpiar</span>
            </button>
          </div> */}
        </CardContent>
      </Card>

      {showStages && (
        <Card className="shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Etapas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-sm font-medium mb-1">Esfuerzo</div>
                <div className="text-xs text-gray-600">-</div>
              </div>
              <div>
                <div className="text-sm font-medium mb-1">Duración</div>
                <div className="text-xs text-gray-600">-</div>
              </div>
              <div>
                <div className="text-sm font-medium mb-1">Tamaño de equipo</div>
                <div className="text-xs text-gray-600">-</div>
              </div>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
