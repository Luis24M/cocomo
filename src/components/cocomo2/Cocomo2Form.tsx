
import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { Checkbox } from "@/components/ui/checkbox";
import { calculateCocomo2, defaultCocomo2Values, CocomoResults } from "@/utils/cocomoCalculations";
import ScaleDriversForm from "./ScaleDriversForm";
import CostDriversForm from "./CostDriversForm";

interface Cocomo2FormProps {
  setResults: (results: CocomoResults) => void;
}

export default function Cocomo2Form({ setResults }: Cocomo2FormProps) {
  const [size, setSize] = useState<number>(10);
  const [usesFunctionPoints, setUsesFunctionPoints] = useState<boolean>(false);
  const [scaleDrivers, setScaleDrivers] = useState(defaultCocomo2Values.scaleDrivers);
  const [costDrivers, setCostDrivers] = useState(defaultCocomo2Values.costDrivers);

  // Calculate results in real-time when any input changes
  useEffect(() => {
    try {
      const newResults = calculateCocomo2({
        size,
        usesFunctionPoints,
        scaleDrivers,
        costDrivers
      });
      setResults(newResults);
    } catch (error) {
      console.error(error);
    }
  }, [size, usesFunctionPoints, scaleDrivers, costDrivers, setResults]);

  const updateScaleDriver = (key: keyof typeof scaleDrivers, value: number) => {
    setScaleDrivers(prev => ({ ...prev, [key]: value }));
  };
  
  const updateCostDriver = (key: keyof typeof costDrivers, value: number) => {
    setCostDrivers(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="size" className="text-sm">Tamaño del projecto</Label>
        <Input 
          id="size" 
          type="number" 
          min="0"
          step="0.1"
          value={size}
          onChange={(e) => setSize(Number(e.target.value))}
          className="h-9"
        />
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox
          id="usesFunctionPoints"
          checked={usesFunctionPoints}
          onCheckedChange={(checked) => setUsesFunctionPoints(checked as boolean)}
        />
        <Label htmlFor="usesFunctionPoints" className="text-sm">Function Points</Label>
      </div>
      
      <Tabs defaultValue="scale-drivers" className="w-full">
        <TabsList className="grid w-full grid-cols-1 h-9">
          <TabsTrigger value="scale-drivers" className="text-xs">Conductores de escala</TabsTrigger>
        </TabsList>
        <TabsContent value="scale-drivers" className="space-y-3 pt-3">
          <ScaleDriversForm 
            scaleDrivers={scaleDrivers} 
            updateScaleDriver={updateScaleDriver} 
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}
