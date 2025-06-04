
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

const levelLabels = ["Muy bajo", "Bajo", "Nominal", "Alto", "Muy alto", "Extra alto"];

export default function CostDriverSelect({ driver, onValueChange }: CostDriverSelectProps) {
  const getSelectValue = () => {
    return `${driver.selectedIndex}`;
  };

  const getSelectLabel = (index: number) => {
    const level = levelLabels[index] || `Level ${index + 1}`;
    return `${level} (${driver.values[index]?.toFixed(2)})`;
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
