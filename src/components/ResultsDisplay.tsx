
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CocomoResults } from "@/utils/cocomoCalculations";

interface ResultsDisplayProps {
  results: CocomoResults;
  showStages?: boolean;
  showOnlyStages?: boolean;
}

export default function ResultsDisplay({ results, showStages = true, showOnlyStages = false }: ResultsDisplayProps) {
  const { effort, duration, staffing } = results;
  
  if (showOnlyStages) {
    return (
      <Card className="shadow-sm border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Etapas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 text-center">
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
    );
  }
  
  return (
    <div className="space-y-4">
      <Card className="shadow-sm border-0">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">Resultados</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 gap-4">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Esfuerzo</span>
              <span className="text-sm">{effort.toFixed(1)} personas-mes</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Duración</span>
              <span className="text-sm">{duration.toFixed(1)} meses</span>
            </div>
            
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Tamaño de equipo</span>
              <span className="text-sm">{staffing.toFixed(1)} personas</span>
            </div>
          </div>
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
