
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
  // Validar que los drivers tengan datos válidos
  const validDrivers = drivers.filter(driver => {
    const isValid = driver.values && 
                   driver.values.length > 0 && 
                   driver.selectedIndex >= 0 && 
                   driver.selectedIndex < driver.values.length;
    
    if (!isValid) {
      console.warn(`Driver inválido encontrado: ${driver.id}`, driver);
    }
    
    return isValid;
  });

  // Función para manejar cambios con validación adicional
  const handleDriverChange = (driverId: string, selectedIndex: number) => {
    const driver = validDrivers.find(d => d.id === driverId);
    if (driver && selectedIndex >= 0 && selectedIndex < driver.values.length) {
      onDriverChange(driverId, selectedIndex);
    } else {
      console.error(`Índice inválido para driver ${driverId}: ${selectedIndex}`);
    }
  };

  if (validDrivers.length === 0) {
    return (
      <div className="space-y-4">
        <h3 className="font-semibold text-gray-900 text-center pb-2 border-b border-gray-200">
          {name}
        </h3>
        <div className="text-center text-gray-500 py-4">
          No hay drivers válidos en esta categoría
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <h3 className="font-semibold text-gray-900 text-center pb-2 border-b border-gray-200">
        {name}
      </h3>
      
      <div className="space-y-3">
        {validDrivers.map((driver) => (
          <CostDriverSelect
            key={driver.id}
            driver={driver}
            onValueChange={handleDriverChange}
          />
        ))}
      </div>
    </div>
  );
}