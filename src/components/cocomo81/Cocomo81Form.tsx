
import { useState, useEffect } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DevelopmentMode, calculateCocomo81, CocomoResults } from "@/utils/cocomoCalculations";
import CostDriversTable from "./CostDriversTable";

interface Cocomo81FormProps {
  setResults: (results: CocomoResults) => void;
  showCostDrivers?: boolean;
  showOnlyCostDrivers?: boolean;
}

export default function Cocomo81Form({ setResults, showCostDrivers = true, showOnlyCostDrivers = false }: Cocomo81FormProps) {
  const [kloc, setKloc] = useState<number>(10);
  const [developmentMode, setDevelopmentMode] = useState<DevelopmentMode>("organic");
  const [eaf, setEaf] = useState<number>(1.0);
  
  // Calculate results in real-time when any input changes
  useEffect(() => {
    try {
      const newResults = calculateCocomo81({ 
        kloc, 
        developmentMode, 
        eaf 
      });
      setResults(newResults);
    } catch (error) {
      console.error(error);
    }
  }, [kloc, developmentMode, eaf, setResults]);

  if (showOnlyCostDrivers) {
    return (
      <div>
        <CostDriversTable onEafChange={setEaf} />
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
            value={kloc}
            onChange={(e) => setKloc(Number(e.target.value))}
            className="h-9"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="mode" className="text-sm font-medium">Tipo de desarrollo</Label>
          <Select 
            value={developmentMode} 
            onValueChange={(value) => setDevelopmentMode(value as DevelopmentMode)}
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
      </div>
      
      {showCostDrivers && (
        <div className="mt-8">
          <CostDriversTable onEafChange={setEaf} />
        </div>
      )}
    </div>
  );
}
