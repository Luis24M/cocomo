import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DevelopmentMode } from "@/utils/cocomoCalculations";
import CostDriversTable from "./CostDriversTable";

interface Cocomo81FormProps {
  kloc?: number;
  setKloc?: (value: number) => void;
  developmentMode?: DevelopmentMode;
  setDevelopmentMode?: (value: DevelopmentMode) => void;
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
  showCostDrivers = true, 
  showOnlyCostDrivers = false,
  setResults 
}: Cocomo81FormProps) {

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
            value={kloc}
            onChange={(e) => setKloc && setKloc(Number(e.target.value))}
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
      </div>
      
      {showCostDrivers && (
        <div className="mt-8">
          <CostDriversTable onEafChange={() => {}} />
        </div>
      )}
    </div>
  );
}