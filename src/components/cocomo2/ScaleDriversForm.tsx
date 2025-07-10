import { useState, useEffect } from "react";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface ScaleDriversFormProps {
  onScaleFactorChange: (scaleFactor: number) => void;
  showScaleFactor?: boolean;
}

type ScaleDrivers = {
  precedentedness: number;
  developmentFlexibility: number;
  architectureRiskResolution: number;
  teamCohesion: number;
  processMaturiy: number;
};

const levelOptions = {
  precedentedness: [
    { label: "Muy bajo", value: 6.20 },
    { label: "Bajo", value: 4.96 },
    { label: "Nominal", value: 3.72 },
    { label: "Alto", value: 2.48 },
    { label: "Muy alto", value: 1.24 },
    { label: "Extra alto", value: 0.00 },
  ],
  developmentFlexibility: [
    { label: "Muy bajo", value: 5.07 },
    { label: "Bajo", value: 4.05 },
    { label: "Nominal", value: 3.04 },
    { label: "Alto", value: 2.03 },
    { label: "Muy alto", value: 1.01 },
    { label: "Extra alto", value: 0.00 },
  ],
  architectureRiskResolution: [
    { label: "Muy bajo", value: 7.07 },
    { label: "Bajo", value: 5.65 },
    { label: "Nominal", value: 4.24 },
    { label: "Alto", value: 2.83 },
    { label: "Muy alto", value: 1.41 },
    { label: "Extra alto", value: 0.00 },
  ],
  teamCohesion: [
    { label: "Muy bajo", value: 5.48 },
    { label: "Bajo", value: 4.38 },
    { label: "Nominal", value: 3.29 },
    { label: "Alto", value: 2.19 },
    { label: "Muy alto", value: 1.10 },
    { label: "Extra alto", value: 0.00 },
  ],
  processMaturiy: [
    { label: "Muy bajo", value: 7.80 },
    { label: "Bajo", value: 6.24 },
    { label: "Nominal", value: 4.68 },
    { label: "Alto", value: 3.12 },
    { label: "Muy alto", value: 1.56 },
    { label: "Extra alto", value: 0.00 },
  ],
};

export default function ScaleDriversForm({ onScaleFactorChange, showScaleFactor = true }: ScaleDriversFormProps) {
  const [scaleDrivers, setScaleDrivers] = useState<ScaleDrivers>({
    precedentedness: 3.72,
    developmentFlexibility: 3.04,
    architectureRiskResolution: 4.24,
    teamCohesion: 3.29,
    processMaturiy: 4.68,
  });

  const scaleFactor = Object.values(scaleDrivers).reduce((sum, val) => sum + val, 0);
  const B = 0.91;
  const exponent = B + 0.01 * scaleFactor;

  useEffect(() => {
    onScaleFactorChange(scaleFactor);
  }, [scaleFactor, onScaleFactorChange]);

  const handleChange = (key: keyof ScaleDrivers, value: number) => {
    setScaleDrivers(prev => ({ ...prev, [key]: value }));
  };

  const renderSelect = (
    label: string,
    key: keyof ScaleDrivers,
    currentValue: number
  ) => {
    const options = levelOptions[key];
    return (
      <div className="space-y-2">
        <Label className="text-xs font-medium">{label}</Label>
        <Select
          value={currentValue.toString()}
          onValueChange={(val) => handleChange(key, parseFloat(val))}
        >
          <SelectTrigger className="w-full h-8">
            <SelectValue>
              {
                (() => {
                  const selected = options.find(opt => opt.value.toFixed(2) === currentValue.toFixed(2));
                  return selected ? `${selected.label} (${selected.value.toFixed(2)})` : "Seleccionar...";
                })()
              }
            </SelectValue>
          </SelectTrigger>
          <SelectContent>
            {options.map((level, index) => (
              <SelectItem key={index} value={level.value.toString()}>
                {`${level.label} (${level.value.toFixed(2)})`}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
    );
  };

  return (
    <div className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {renderSelect("Precedencia", "precedentedness", scaleDrivers.precedentedness)}
        {renderSelect("Flexibilidad en el desarrollo", "developmentFlexibility", scaleDrivers.developmentFlexibility)}
        {renderSelect("Arquitectura y determinación del riesgo", "architectureRiskResolution", scaleDrivers.architectureRiskResolution)}
        {renderSelect("Cohesión del equipo", "teamCohesion", scaleDrivers.teamCohesion)}
        {renderSelect("Madurez del proceso", "processMaturiy", scaleDrivers.processMaturiy)}
      </div>

      {showScaleFactor && (
        <div className="mt-6 border rounded-lg p-4 bg-gray-50 shadow-sm">
          <h4 className="text-sm font-semibold mb-2">Resultados</h4>
          <p className="text-sm font-medium">∑SFj = <span className="font-mono text-blue-600">{scaleFactor.toFixed(2)}</span></p>
          <p className="text-sm font-medium">Exponente E = B + 0.01 × ∑SFj = <span className="font-mono text-green-600">{exponent.toFixed(3)}</span></p>
        </div>
      )}
    </div>
  );
}
