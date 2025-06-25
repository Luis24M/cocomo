import { FunctionPointsResults } from '@/utils/cocomoCalculations';
import { Label } from '@radix-ui/react-label';

interface ResultsFunctionPointsProps {
  results: FunctionPointsResults;
  adjustmentFactor: number;
}

export default function ResultsFunctionPoints({ 
  results, 
  adjustmentFactor
}: ResultsFunctionPointsProps) {  
  return (
    <div className="space-y-6">
      <div className="border rounded-lg p-6 bg-white shadow-sm">
        <div className="flex gap-6 justify-around">
          {/* Columna izquierda */}
            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Puntos de Función sin Ajustar
              </Label>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-gray-900">
                  {results.unadjustedFunctionPoints}
                </span>
                <span className="text-sm font-medium text-gray-500 italic">FP</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Puntos de Función Ajustados
              </Label>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-green-600">
                  {results.adjustedFunctionPoints.toFixed(2)}
                </span>
                <span className="text-sm font-medium text-gray-500 italic">FP</span>
              </div>
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium text-gray-700">
                Líneas de Código Estimadas
              </Label>
              <div className="flex items-center space-x-2">
                <span className="text-2xl font-bold text-blue-600">
                  {Math.round(results.linesOfCode).toLocaleString()}
                </span>
                <span className="text-sm font-medium text-gray-500 italic">LOC</span>
              </div>
            </div>
        </div>

        {/* Resumen */}
        {/* <div className="mt-6 p-4 bg-green-50 border border-green-200 rounded-md">
          <div className="space-y-2">
            <Label className="font-semibold text-green-800">
              Resumen del Proyecto
            </Label>
            <p className="text-sm text-green-700 leading-relaxed">
              Basado en <strong>{results.unadjustedFunctionPoints} puntos de función sin ajustar</strong> con 
              un factor de ajuste de <strong>{adjustmentFactor}</strong>, el tamaño estimado del proyecto 
              es de <strong>{results.adjustedFunctionPoints.toFixed(2)} puntos de función</strong>, 
              equivalente a aproximadamente <strong>{Math.round(results.linesOfCode).toLocaleString()} líneas de código</strong>.
            </p>
          </div>
        </div> */}

        {/* Métricas adicionales */}
        {/* <div className="mt-6 grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">
              {results.adjustedFunctionPoints > 0 ? 
                (results.linesOfCode / results.adjustedFunctionPoints).toFixed(1) : '0'}
            </div>
            <div className="text-xs text-gray-600 mt-1">LOC por FP</div>
          </div>

          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">
              {adjustmentFactor}
            </div>
            <div className="text-xs text-gray-600 mt-1">Factor de Ajuste</div>
          </div>

          <div className="text-center p-3 bg-gray-50 rounded-lg">
            <div className="text-lg font-semibold text-gray-900">
              {results.adjustedFunctionPoints > 0 ? 
                ((results.adjustedFunctionPoints - results.unadjustedFunctionPoints) / results.unadjustedFunctionPoints * 100).toFixed(1) : '0'}%
            </div>
            <div className="text-xs text-gray-600 mt-1">Variación por Ajuste</div>
          </div>
        </div> */}
      </div>
    </div>
  );
}