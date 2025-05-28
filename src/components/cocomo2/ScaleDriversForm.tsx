
import { Label } from "@/components/ui/label";
import { Slider } from "@/components/ui/slider";
import { ScaleDrivers } from "@/utils/cocomoCalculations";

interface ScaleDriversFormProps {
  scaleDrivers: ScaleDrivers;
  updateScaleDriver: (key: keyof ScaleDrivers, value: number) => void;
}

export default function ScaleDriversForm({ scaleDrivers, updateScaleDriver }: ScaleDriversFormProps) {
  return (
    <div className="space-y-4">
      <h3 className="text-sm font-medium">Scale Drivers</h3>
      
      <div className="space-y-3">
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Precedentedness</Label>
            <span className="text-xs font-medium">{scaleDrivers.precedentedness.toFixed(2)}</span>
          </div>
          <Slider
            min={0}
            max={6}
            step={0.1}
            value={[scaleDrivers.precedentedness]}
            onValueChange={(vals) => updateScaleDriver('precedentedness', vals[0])}
          />
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Development Flexibility</Label>
            <span className="text-xs font-medium">{scaleDrivers.developmentFlexibility.toFixed(2)}</span>
          </div>
          <Slider
            min={0}
            max={6}
            step={0.1}
            value={[scaleDrivers.developmentFlexibility]}
            onValueChange={(vals) => updateScaleDriver('developmentFlexibility', vals[0])}
          />
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Architecture Risk Resolution</Label>
            <span className="text-xs font-medium">{scaleDrivers.architectureRiskResolution.toFixed(2)}</span>
          </div>
          <Slider
            min={0}
            max={6}
            step={0.1}
            value={[scaleDrivers.architectureRiskResolution]}
            onValueChange={(vals) => updateScaleDriver('architectureRiskResolution', vals[0])}
          />
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Team Cohesion</Label>
            <span className="text-xs font-medium">{scaleDrivers.teamCohesion.toFixed(2)}</span>
          </div>
          <Slider
            min={0}
            max={6}
            step={0.1}
            value={[scaleDrivers.teamCohesion]}
            onValueChange={(vals) => updateScaleDriver('teamCohesion', vals[0])}
          />
        </div>
        
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label className="text-xs">Process Maturity</Label>
            <span className="text-xs font-medium">{scaleDrivers.processMaturiy.toFixed(2)}</span>
          </div>
          <Slider
            min={0}
            max={6}
            step={0.1}
            value={[scaleDrivers.processMaturiy]}
            onValueChange={(vals) => updateScaleDriver('processMaturiy', vals[0])}
          />
        </div>
      </div>
    </div>
  );
}
