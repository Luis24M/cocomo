
import CostDriverSelect from "./CostDriverSelect";

interface CostDriver {
  id: string;
  name: string;
  description: string;
  values: number[];
  selectedIndex: number;
}

interface CategorySectionProps {
  name: string;
  drivers: CostDriver[];
  onDriverChange: (driverId: string, selectedIndex: number) => void;
}

export default function CategorySection({ name, drivers, onDriverChange }: CategorySectionProps) {
  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900 text-center pb-2 border-b border-gray-200">
        {name}
      </h3>
      
      <div className="space-y-3">
        {drivers.map((driver) => (
          <CostDriverSelect
            key={driver.id}
            driver={driver}
            onValueChange={onDriverChange}
          />
        ))}
      </div>
    </div>
  );
}
