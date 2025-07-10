import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { DevelopmentMode } from "@/utils/cocomoCalculations";
import CostDriversTable from "./CostDriversTable";


interface Cocomo81FormProps {
  kloc?: number;
  setKloc?: (value: number) => void;
  developmentMode?: DevelopmentMode;
  setDevelopmentMode?: (value: DevelopmentMode) => void;
  developerSalary?: number;
  setDeveloperSalary?: (value: number) => void;
  useDetailedCosts?: boolean;
  setUseDetailedCosts?: (value: boolean) => void;
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
  showCostDrivers = true, 
  showOnlyCostDrivers = false,
}: Cocomo81FormProps) {

  

  if (showOnlyCostDrivers) {
    return (
      <div>
        <CostDriversTable onEafChange={() => {}} />
      </div>
    );
  }

  return (
    <div className="">
      <div className=" flex gap-5">
        <div className="">
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
        
        <div className="">
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

        <div className="flex gap-2 items-center ">
          <div className="flex items-center space-x-2 order-last ">
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
            <div className="">
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
      
      {showCostDrivers && (
        <div className="mt-8">
          <CostDriversTable onEafChange={() => {}} />
        </div>
      )}
    </div>
  );
}