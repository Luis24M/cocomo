
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import CategorySection from "./CategorySection";
import EafDisplay from "./EafDisplay";

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
    // PRODUCT ATTRIBUTES
    {
      id: "rely",
      name: "Required software reliability",
      description: "RSS",
      values: [0.75, 0.88, 1.00, 1.15, 1.40],
      selectedIndex: 2
    },
    {
      id: "data",
      name: "Size of application database",
      description: "TBD",
      values: [0.94, 1.00, 1.08, 1.16],
      selectedIndex: 1
    },
    {
      id: "cplx",
      name: "Complexity of the product",
      description: "CPR",
      values: [0.70, 0.85, 1.00, 1.15, 1.30, 1.65],
      selectedIndex: 2
    },
    // HARDWARE ATTRIBUTES
    {
      id: "time",
      name: "Run-time performance constraints",
      description: "RTE",
      values: [1.00, 1.11, 1.30, 1.66],
      selectedIndex: 0
    },
    {
      id: "stor",
      name: "Memory constraints",
      description: "RMP",
      values: [1.00, 1.06, 1.21, 1.56],
      selectedIndex: 0
    },
    {
      id: "virt",
      name: "Volatility of the virtual machine environment",
      description: "VMC",
      values: [0.87, 1.00, 1.15, 1.30],
      selectedIndex: 1
    },
    {
      id: "turn",
      name: "Required turnaround time",
      description: "TRC",
      values: [0.87, 1.00, 1.07, 1.15],
      selectedIndex: 1
    },
    // PERSONNEL ATTRIBUTES
    {
      id: "acap",
      name: "Analyst capability",
      description: "CAN",
      values: [1.46, 1.19, 1.00, 0.86, 0.71],
      selectedIndex: 2
    },
    {
      id: "aexp",
      name: "Applications experience",
      description: "EAN",
      values: [1.29, 1.13, 1.00, 0.91, 0.82],
      selectedIndex: 2
    },
    {
      id: "pcap",
      name: "Software engineer capability",
      description: "CPRO",
      values: [1.42, 1.17, 1.00, 0.86, 0.70],
      selectedIndex: 2
    },
    {
      id: "vexp",
      name: "Virtual machine experience",
      description: "ESO",
      values: [1.21, 1.10, 1.00, 0.90],
      selectedIndex: 2
    },
    {
      id: "lexp",
      name: "Programming language experience",
      description: "ELP",
      values: [1.14, 1.07, 1.00, 0.95],
      selectedIndex: 2
    },
    // PROJECT ATTRIBUTES
    {
      id: "modp",
      name: "Use of modern programming practices",
      description: "UTP",
      values: [1.24, 1.10, 1.00, 0.91, 0.82],
      selectedIndex: 2
    },
    {
      id: "tool",
      name: "Use of software tools",
      description: "UHS",
      values: [1.24, 1.10, 1.00, 0.91, 0.83],
      selectedIndex: 2
    },
    {
      id: "sced",
      name: "Required development schedule",
      description: "RPL",
      values: [1.23, 1.08, 1.00, 1.04, 1.10],
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
      drivers: costDrivers.slice(0, 3),
    },
    { 
      name: "Plataforma", 
      drivers: costDrivers.slice(3, 7),
    },
    { 
      name: "Personal", 
      drivers: costDrivers.slice(7, 12),
    },
    { 
      name: "Proyecto", 
      drivers: costDrivers.slice(12),
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
