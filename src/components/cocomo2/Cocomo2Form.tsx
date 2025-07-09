import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Checkbox } from "@/components/ui/checkbox";
import { calculateCocomo2, defaultCocomo2Values, CocomoResults } from "@/utils/cocomoCalculations";
import ScaleDriversForm from "./ScaleDriversForm";
import { DevelopmentMode } from "@/utils/cocomoCalculations";
import CostDriversTable from "../cocomo81/CostDriversTable";


interface Cocomo2FormProps {
  kloc?: number;
  setKloc?: (value: number) => void;
  developmentMode?: DevelopmentMode;
  setDevelopmentMode?: (value: DevelopmentMode) => void;
  developerSalary?: number;
  setDeveloperSalary?: (value: number) => void;
  setResults: (results: CocomoResults) => void;
}

export default function Cocomo2Form({ setResults,
 }: Cocomo2FormProps) {
  const [size, setSize] = useState<number>(10);
  const [usesFunctionPoints, setUsesFunctionPoints] = useState<boolean>(false);
  const [scaleDrivers, setScaleDrivers] = useState(defaultCocomo2Values.scaleDrivers);
  const [costDrivers, setCostDrivers] = useState(defaultCocomo2Values.costDrivers);
  const [developerSalary, setDeveloperSalary] = useState<number>(5000);
  // Eliminamos eafFromTable ya que ahora usaremos los costDrivers directamente

  // Calculate results in real-time when any input changes
  useEffect(() => {
    try {
      // Calculamos COCOMO II con los cost drivers actualizados
      const results = calculateCocomo2({
        size,
        usesFunctionPoints,
        scaleDrivers,
        developerSalary
      });
      
      setResults(results);
    } catch (error) {
      console.error(error);
    }
  }, [size, usesFunctionPoints, scaleDrivers, costDrivers, developerSalary, setResults]);

  const updateScaleDriver = (key: keyof typeof scaleDrivers, value: number) => {
    setScaleDrivers(prev => ({ ...prev, [key]: value }));
  };

  // Nueva función para manejar cambios en los cost drivers desde la tabla
  const handleCostDriversChange = (newCostDrivers: typeof costDrivers) => {
    setCostDrivers(newCostDrivers);
  };

  return (
    <div className="flex flex-col gap-6">
      {/* Formulario principal */}
      <div className="space-y-6">
        {/* Inputs básicos */}
        <div className="flex flex-col md:grid-cols-3 gap-4">
          <div className="space-y-2">
            <Label htmlFor="size" className="text-sm font-medium">Tamaño del Proyecto (KLDC)</Label>
            <Input 
              id="size" 
              type="number" 
              min="0"
              step="0.1"
              value={size}
              onChange={(e) => setSize(Number(e.target.value))}
              className="h-9"
            />
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="salary" className="text-sm font-medium">Salario del desarrollador (mensual)</Label>
            <Input 
              id="salary" 
              type="number" 
              min="0"
              step="100"
              value={developerSalary}
              onChange={(e) => setDeveloperSalary(Number(e.target.value))}
              className="h-9"
              placeholder="Ej: 5000"
            />
          </div>

          <div className="flex items-center space-x-2 pt-6">
            <Checkbox
              id="usesFunctionPoints"
              checked={usesFunctionPoints}
              onCheckedChange={(checked) => setUsesFunctionPoints(checked as boolean)}
            />
            <Label htmlFor="usesFunctionPoints" className="text-sm font-medium">Function Points</Label>
          </div>
        </div>


      </div>
    </div>
  );
}