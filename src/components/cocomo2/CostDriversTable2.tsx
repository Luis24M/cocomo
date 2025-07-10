import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CategorySection from "./CategorySection";
import EafDisplay from "../cocomo81/EafDisplay";

interface CostDriver {
  id: string;
  name: string;
  description: string;
  values: number[];
  selectedIndex: number;
}

interface CostDriversTableProps {
  onEafChange: (eaf: number) => void;
}

export default function CostDriversTable({ onEafChange }: CostDriversTableProps) {
const [costDrivers, setCostDrivers] = useState<CostDriver[]>([
  // PRODUCTO
  {
    id: "rss",
    name: "Required software reliability",
    description: "RSS",
    values: [0.82, 0.92, 1.00, 1.10, 1.26],
    selectedIndex: 2
  },
  {
    id: "tbd",
    name: "Size of application database",
    description: "TBD",
    values: [0.90, 1.00, 1.14, 1.28],
    selectedIndex: 1
  },
  {
    id: "cpr",
    name: "Complexity of the product",
    description: "CPR",
    values: [0.73, 0.87, 1.00, 1.17, 1.34, 1.74],
    selectedIndex: 2
  },
  {
    id: "ruse",
    name: "Required reusability",
    description: "RUSE",
    values: [0.95, 1.00, 1.07, 1.15, 1.24],
    selectedIndex: 1
  },
  {
    id: "doc",
    name: "Documentation match to life-cycle needs",
    description: "DOC",
    values: [0.81, 0.91, 1.00, 1.11, 1.23],
    selectedIndex: 2
  },
  // PLATAFORMA (COMPUTADOR)
  {
    id: "rte",
    name: "Execution time constraint",
    description: "RTE",
    values: [1.00, 1.11, 1.29, 1.63],
    selectedIndex: 0
  },
  {
    id: "rmp",
    name: "Main storage constraint",
    description: "RMP",
    values: [1.00, 1.05, 1.17, 1.46],
    selectedIndex: 0
  },
  {
    id: "vmc",
    name: "Platform volatility",
    description: "VMC",
    values: [0.87, 1.00, 1.15, 1.30],
    selectedIndex: 1
  },
  // PERSONAL
  {
    id: "can",
    name: "Analyst capability",
    description: "CAN",
    values: [1.42, 1.19, 1.00, 0.85, 0.71],
    selectedIndex: 2
  },
  {
    id: "eapl",
    name: "Applications experience",
    description: "EAPL",
    values: [1.22, 1.10, 1.00, 0.88, 0.81],
    selectedIndex: 2
  },
  {
    id: "cpro",
    name: "Programmer capability",
    description: "CPRO",
    values: [1.34, 1.15, 1.00, 0.88, 0.76],
    selectedIndex: 2
  },
  {
    id: "cper",
    name: "Personnel continuity",
    description: "CPER",
    values: [1.29, 1.12, 1.00, 0.90, 0.81],
    selectedIndex: 2
  },
  {
    id: "epla",
    name: "Platform experience",
    description: "EPLA",
    values: [1.19, 1.09, 1.00, 0.91, 0.85],
    selectedIndex: 2
  },
  {
    id: "elp",
    name: "Language and tool experience",
    description: "ELP",
    values: [1.20, 1.09, 1.00, 0.91, 0.84],
    selectedIndex: 2
  },
  // PROYECTO
  {
    id: "uhs",
    name: "Use of software tools",
    description: "UHS",
    values: [1.17, 1.09, 1.00, 0.90, 0.78],
    selectedIndex: 2
  },
  {
    id: "rpl",
    name: "Required development schedule",
    description: "RPL",
    values: [1.43, 1.14, 1.00],
    selectedIndex: 2
  },
  {
    id: "dms",
    name: "Multisite development",
    description: "DMS",
    values: [1.22, 1.09, 1.00, 0.93, 0.86, 0.80],
    selectedIndex: 2
  }
]);


  const updateCostDriver = (driverId: string, selectedIndex: number) => {
    const updatedDrivers = costDrivers.map(driver => 
      driver.id === driverId ? { ...driver, selectedIndex } : driver
    );
    setCostDrivers(updatedDrivers);
    
    // Calculate new EAF
    const eaf = updatedDrivers.reduce((product, driver) => 
      product * driver.values[driver.selectedIndex], 1.0
    );
    onEafChange(eaf);
  };

  const currentEaf = costDrivers.reduce((product, driver) => 
    product * driver.values[driver.selectedIndex], 1.0
  );

  const categories = [
    { 
      name: "Producto", 
      drivers: costDrivers.slice(0, 5),
    },
    { 
      name: "Plataforma", 
      drivers: costDrivers.slice(5, 8),
    },
    { 
      name: "Personal", 
      drivers: costDrivers.slice(8, 14),
    },
    { 
      name: "Proyecto", 
      drivers: costDrivers.slice(14),
    }
  ];

  return (
    <Card className="w-full">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-semibold">Conductores de coste</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {categories.map((category) => (
            <CategorySection
              key={category.name}
              name={category.name}
              drivers={category.drivers}
              onDriverChange={updateCostDriver}
            />
          ))}
        </div>
        
        <EafDisplay eaf={currentEaf} />
      </CardContent>
    </Card>
  );
}