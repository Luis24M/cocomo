import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { calculateCocomo2, defaultCocomo2Values, CocomoResults } from "@/utils/cocomoCalculations";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { DevelopmentMode } from "@/utils/cocomoCalculations";
import CostDriversTable from "../cocomo81/CostDriversTable";
import { PhaseData, DetailedCosts } from "@/utils/cocomoCalculations";


interface Cocomo2FormProps {
  kloc?: number;
  setKloc?: (value: number) => void;
  developerSalary?: number;
  setDeveloperSalary?: (value: number) => void;
  useDetailedCosts?: boolean;
  setUseDetailedCosts?: (value: boolean) => void;
  showOnlyCostDrivers?: boolean;
}

export default function Cocomo2Form({ 
  kloc = 10,
  setKloc,
  developerSalary = 5000,
  setDeveloperSalary,
  useDetailedCosts = false,
  setUseDetailedCosts,
  showOnlyCostDrivers = false,
 }: Cocomo2FormProps) {

  // DESARROLLO DE FASES 

    if (showOnlyCostDrivers) {
      return (
        <div>
          <CostDriversTable onEafChange={() => {}} />
        </div>
      );
    }
  

  return (
      <div className="space-y-6">
        <div className="flex gap-4">
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
          
  
          <div className="flex gap-4">
            <div className="flex items-center space-x-2 order-last">
              <Checkbox 
                id="detailed-costs"
                checked={useDetailedCosts}
                onCheckedChange={(checked) => setUseDetailedCosts && setUseDetailedCosts(checked as boolean)}
              />
              <Label htmlFor="detailed-costs" className="text-sm font-medium">
                Usar costos detallados por fase
              </Label>
            </div>
  
            {!useDetailedCosts && (
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
            ) }
          </div>
        </div>
      </div>
  );
}