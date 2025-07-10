import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";

interface CostDriver {
  id: string;
  name: string;
  description: string;
  values: number[];
  selectedIndex: number;
}

interface CostDriverSelectProps {
  driver: CostDriver;
  onValueChange: (driverId: string, selectedIndex: number) => void;
}

export default function CostDriverSelect({ driver, onValueChange }: CostDriverSelectProps) {
  const getSelectValue = () => {
    return `${driver.selectedIndex}`;
  };

  const getSelectLabel = (index: number) => {
    const value = driver.values[index];
    
    // Encontrar el índice del valor nominal (1.00)
    const nominalIndex = driver.values.findIndex(v => v === 1.00);
    
    let level = "";
    
    if (nominalIndex === -1) {
      // Si no hay valor nominal, usar etiquetas genéricas
      level = `Nivel ${index + 1}`;
    } else {
      // Determinar la etiqueta basada en la posición relativa al nominal
      const distance = index - nominalIndex;
      
      if (distance === 0) {
        level = "Nominal";
      } else if (distance === -2) {
        level = "Muy bajo";
      } else if (distance === -1) {
        level = "Bajo";
      } else if (distance === 1) {
        level = "Alto";
      } else if (distance === 2) {
        level = "Muy alto";
      } else if (distance === 3) {
        level = "Extra alto";
      } else {
        // Para casos edge que no encajan en las categorías estándar
        level = distance < 0 ? `Bajo ${Math.abs(distance)}` : `Alto ${distance}`;
      }
    }
    
    return `${level} (${value.toFixed(2)})`;
  };

  return (
    <div className="space-y-1">
      <Label className="text-sm font-medium text-gray-700">
        {driver.description}
      </Label>
      <Select 
        value={getSelectValue()}
        onValueChange={(value) => onValueChange(driver.id, parseInt(value))}
      >
        <SelectTrigger className="w-full h-9 bg-white border border-gray-300 text-sm">
          <SelectValue placeholder="Select" />
        </SelectTrigger>
        <SelectContent className="bg-white border border-gray-200 shadow-lg z-50">
          {driver.values.map((value, index) => (
            <SelectItem 
              key={index} 
              value={`${index}`}
              className="cursor-pointer hover:bg-gray-50 text-sm"
            >
              {getSelectLabel(index)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}