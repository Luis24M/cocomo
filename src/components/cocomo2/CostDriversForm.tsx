
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { CostDrivers } from "@/utils/cocomoCalculations";

interface CostDriversFormProps {
  costDrivers: CostDrivers;
  updateCostDriver: (key: keyof CostDrivers, value: number) => void;
}

export default function CostDriversForm({ costDrivers, updateCostDriver }: CostDriversFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Cost Drivers</h3>
      
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Required Software Reliability</Label>
            <span className="text-xs font-medium">{costDrivers.rely.toFixed(2)}</span>
          </div>
          <Slider
            min={0.5}
            max={1.5}
            step={0.01}
            value={[costDrivers.rely]}
            onValueChange={(vals) => updateCostDriver('rely', vals[0])}
          />
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Database Size</Label>
            <span className="text-xs font-medium">{costDrivers.data.toFixed(2)}</span>
          </div>
          <Slider
            min={0.5}
            max={1.5}
            step={0.01}
            value={[costDrivers.data]}
            onValueChange={(vals) => updateCostDriver('data', vals[0])}
          />
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Product Complexity</Label>
            <span className="text-xs font-medium">{costDrivers.cplx.toFixed(2)}</span>
          </div>
          <Slider
            min={0.5}
            max={1.7}
            step={0.01}
            value={[costDrivers.cplx]}
            onValueChange={(vals) => updateCostDriver('cplx', vals[0])}
          />
        </div>
      </div>
    </div>
  );
}
