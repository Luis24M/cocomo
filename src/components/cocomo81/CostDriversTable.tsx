import { useState, useEffect } from "react";
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
  // Props para COCOMO 81 (manteniendo compatibilidad)
  onEafChange?: (eaf: number) => void;
  
  // Props para COCOMO II (nuevas)
  costDrivers?: {
    rely: number;
    data: number;
    cplx: number;
    ruse: number;
    docu: number;
    time: number;
    stor: number;
    pvol: number;
    acap: number;
    pcap: number;
    pcon: number;
    apex: number;
    plex: number;
    ltex: number;
    tool: number;
    site: number;
    sced: number;
  };
  onCostDriversChange?: (costDrivers: any) => void;
}

export default function CostDriversTable({ 
  onEafChange, 
  costDrivers, 
  onCostDriversChange 
}: CostDriversTableProps) {
  // Determinar si estamos en modo COCOMO II o COCOMO 81
  const isCocomoII = !!(costDrivers && onCostDriversChange);
  
  // Mapeo de los valores de COCOMO II a índices de selección
  const getSelectedIndex = (driverId: string, value: number): number => {
    const driverConfig = costDriverConfigs.find(d => d.id === driverId);
    if (!driverConfig) return 0;
    
    const closestIndex = driverConfig.values.findIndex(v => Math.abs(v - value) < 0.01);
    return closestIndex !== -1 ? closestIndex : 2; // Default a nominal (index 2) si no encuentra
  };

  // Configuración original de COCOMO 81 (manteniendo compatibilidad)
  const cocomo81DriverConfigs = [
    // PRODUCT ATTRIBUTES
    {
      id: "rely",
      name: "Required software reliability",
      description: "RSS",
      values: [0.75, 0.88, 1.00, 1.15, 1.40],
    },
    {
      id: "data",
      name: "Size of application database",
      description: "TBD",
      values: [0.94, 1.00, 1.08, 1.16],
    },
    {
      id: "cplx",
      name: "Complexity of the product",
      description: "CPR",
      values: [0.70, 0.85, 1.00, 1.15, 1.30, 1.65],
    },
    // HARDWARE ATTRIBUTES
    {
      id: "time",
      name: "Run-time performance constraints",
      description: "RTE",
      values: [1.00, 1.11, 1.30, 1.66],
    },
    {
      id: "stor",
      name: "Memory constraints",
      description: "RMP",
      values: [1.00, 1.06, 1.21, 1.56],
    },
    {
      id: "virt",
      name: "Volatility of the virtual machine environment",
      description: "VMC",
      values: [0.87, 1.00, 1.15, 1.30],
    },
    {
      id: "turn",
      name: "Required turnaround time",
      description: "TRC",
      values: [0.87, 1.00, 1.07, 1.15],
    },
    // PERSONNEL ATTRIBUTES
    {
      id: "acap",
      name: "Analyst capability",
      description: "CAN",
      values: [1.46, 1.19, 1.00, 0.86, 0.71],
    },
    {
      id: "aexp",
      name: "Applications experience",
      description: "EAN",
      values: [1.29, 1.13, 1.00, 0.91, 0.82],
    },
    {
      id: "pcap",
      name: "Software engineer capability",
      description: "CPRO",
      values: [1.42, 1.17, 1.00, 0.86, 0.70],
    },
    {
      id: "vexp",
      name: "Virtual machine experience",
      description: "ESO",
      values: [1.21, 1.10, 1.00, 0.90],
    },
    {
      id: "lexp",
      name: "Programming language experience",
      description: "ELP",
      values: [1.14, 1.07, 1.00, 0.95],
    },
    // PROJECT ATTRIBUTES
    {
      id: "modp",
      name: "Use of modern programming practices",
      description: "UTP",
      values: [1.24, 1.10, 1.00, 0.91, 0.82],
    },
    {
      id: "tool",
      name: "Use of software tools",
      description: "UHS",
      values: [1.24, 1.10, 1.00, 0.91, 0.83],
    },
    {
      id: "sced",
      name: "Required development schedule",
      description: "RPL",
      values: [1.23, 1.08, 1.00, 1.04, 1.10],
    }
  ];

  // Configuración de los cost drivers con sus valores posibles para COCOMO II
  const cocomo2DriverConfigs = [
    // PRODUCT ATTRIBUTES
    {
      id: "rely",
      name: "Required software reliability",
      description: "RSS",
      values: [0.75, 0.88, 1.00, 1.15, 1.39],
      cocomoKey: "rely" as keyof typeof costDrivers
    },
    {
      id: "data",
      name: "Size of application database",
      description: "TBD",
      values: [0.93, 1.00, 1.09, 1.19],
      cocomoKey: "data" as keyof typeof costDrivers
    },
    {
      id: "cplx",
      name: "Complexity of the product",
      description: "CPR",
      values: [0.75, 0.88, 1.00, 1.15, 1.30, 1.66],
      cocomoKey: "cplx" as keyof typeof costDrivers
    },
    {
      id: "ruse",
      name: "Developed for Reusability",
      description: "RUSE",
      values: [0.91, 1.00, 1.14, 1.29, 1.49],
      cocomoKey: "ruse" as keyof typeof costDrivers
    },
    {
      id: "docu",
      name: "Documentation Match to Life-cycle Needs",
      description: "DOCU",
      values: [0.81, 0.91, 1.00, 1.11, 1.23],
      cocomoKey: "docu" as keyof typeof costDrivers
    },
    // HARDWARE ATTRIBUTES
    {
      id: "time",
      name: "Run-time performance constraints",
      description: "RTE",
      values: [1.00, 1.11, 1.29, 1.63],
      cocomoKey: "time" as keyof typeof costDrivers
    },
    {
      id: "stor",
      name: "Memory constraints",
      description: "RMP",
      values: [1.00, 1.05, 1.17, 1.46],
      cocomoKey: "stor" as keyof typeof costDrivers
    },
    {
      id: "pvol",
      name: "Platform Volatility",
      description: "PVOL",
      values: [0.87, 1.00, 1.15, 1.30],
      cocomoKey: "pvol" as keyof typeof costDrivers
    },
    // PERSONNEL ATTRIBUTES
    {
      id: "acap",
      name: "Analyst capability",
      description: "CAN",
      values: [1.42, 1.19, 1.00, 0.85, 0.71],
      cocomoKey: "acap" as keyof typeof costDrivers
    },
    {
      id: "pcap",
      name: "Programmer Capability",
      description: "PCAP",
      values: [1.34, 1.15, 1.00, 0.88, 0.76],
      cocomoKey: "pcap" as keyof typeof costDrivers
    },
    {
      id: "pcon",
      name: "Personnel Continuity",
      description: "PCON",
      values: [1.29, 1.12, 1.00, 0.90, 0.81],
      cocomoKey: "pcon" as keyof typeof costDrivers
    },
    {
      id: "apex",
      name: "Applications Experience",
      description: "APEX",
      values: [1.22, 1.10, 1.00, 0.88, 0.81],
      cocomoKey: "apex" as keyof typeof costDrivers
    },
    {
      id: "plex",
      name: "Platform Experience",
      description: "PLEX",
      values: [1.19, 1.09, 1.00, 0.91, 0.85],
      cocomoKey: "plex" as keyof typeof costDrivers
    },
    {
      id: "ltex",
      name: "Language and Tool Experience",
      description: "LTEX",
      values: [1.20, 1.09, 1.00, 0.91, 0.84],
      cocomoKey: "ltex" as keyof typeof costDrivers
    },
    // PROJECT ATTRIBUTES
    {
      id: "tool",
      name: "Use of software tools",
      description: "TOOL",
      values: [1.17, 1.09, 1.00, 0.90, 0.78],
      cocomoKey: "tool" as keyof typeof costDrivers
    },
    {
      id: "site",
      name: "Multisite Development",
      description: "SITE",
      values: [1.22, 1.09, 1.00, 0.93, 0.86, 0.80],
      cocomoKey: "site" as keyof typeof costDrivers
    },
    {
      id: "sced",
      name: "Required development schedule",
      description: "SCED",
      values: [1.43, 1.14, 1.00, 1.00, 1.00],
      cocomoKey: "sced" as keyof typeof costDrivers
    }
  ];

  // Seleccionar configuración según el modo
  const costDriverConfigs = isCocomoII ? cocomo2DriverConfigs : cocomo81DriverConfigs;

  const [internalDrivers, setInternalDrivers] = useState<CostDriver[]>(() => {
    if (isCocomoII && costDrivers) {
      // Modo COCOMO II - sincronizar con props externas
      return cocomo2DriverConfigs.map(config => ({
        id: config.id,
        name: config.name,
        description: config.description,
        values: config.values,
        selectedIndex: getSelectedIndex(config.id, costDrivers[config.cocomoKey])
      }));
    } else {
      // Modo COCOMO 81 - usar configuración original
      return cocomo81DriverConfigs.map(config => ({
        id: config.id,
        name: config.name,
        description: config.description,
        values: config.values,
        selectedIndex: 2 // Nominal por defecto
      }));
    }
  });

  // Sincronizar cuando cambien los costDrivers externos (solo en modo COCOMO II)
  useEffect(() => {
    if (isCocomoII && costDrivers) {
      setInternalDrivers(cocomo2DriverConfigs.map(config => ({
        id: config.id,
        name: config.name,
        description: config.description,
        values: config.values,
        selectedIndex: getSelectedIndex(config.id, costDrivers[config.cocomoKey])
      })));
    }
  }, [costDrivers, isCocomoII]);

  const updateCostDriver = (driverId: string, selectedIndex: number) => {
    const updatedDrivers = internalDrivers.map(driver => 
      driver.id === driverId ? { ...driver, selectedIndex } : driver
    );
    setInternalDrivers(updatedDrivers);
    
    if (isCocomoII && onCostDriversChange && costDrivers) {
      // Modo COCOMO II - convertir de vuelta al formato de COCOMO II
      const newCostDrivers = { ...costDrivers };
      const config = cocomo2DriverConfigs.find(c => c.id === driverId);
      if (config) {
        newCostDrivers[config.cocomoKey] = config.values[selectedIndex];
      }
      onCostDriversChange(newCostDrivers);
    } else if (onEafChange) {
      // Modo COCOMO 81 - calcular EAF
      const eaf = updatedDrivers.reduce((product, driver) => 
        product * driver.values[driver.selectedIndex], 1.0
      );
      onEafChange(eaf);
    }
  };

  const currentEaf = isCocomoII && costDrivers 
    ? Object.values(costDrivers).reduce((product, value) => product * value, 1.0)
    : internalDrivers.reduce((product, driver) => product * driver.values[driver.selectedIndex], 1.0);

  const categories = isCocomoII ? [
    { 
      name: "Producto", 
      drivers: internalDrivers.slice(0, 5),
    },
    { 
      name: "Plataforma", 
      drivers: internalDrivers.slice(5, 8),
    },
    { 
      name: "Personal", 
      drivers: internalDrivers.slice(8, 14),
    },
    { 
      name: "Proyecto", 
      drivers: internalDrivers.slice(14),
    }
  ] : [
    { 
      name: "Producto", 
      drivers: internalDrivers.slice(0, 3),
    },
    { 
      name: "Plataforma", 
      drivers: internalDrivers.slice(3, 7),
    },
    { 
      name: "Personal", 
      drivers: internalDrivers.slice(7, 12),
    },
    { 
      name: "Proyecto", 
      drivers: internalDrivers.slice(12),
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