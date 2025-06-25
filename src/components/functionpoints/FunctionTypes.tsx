import React, { useState, ChangeEvent, useEffect } from 'react';
import { Label } from '@radix-ui/react-label';
import { Input } from '../ui/input';

type Complexity = 'Baja' | 'Media' | 'Alta';
type FunctionType = 'Entradas' | 'Salidas' | 'Consultas' | 'Archivos' | 'Interfaces';

interface FunctionPointCounts {
  [key: string]: {
    [key: string]: string;
  };
}

interface FunctionTypesProps {
  setWeight: (weight: number) => void;
}

const complexityWeights: Record<FunctionType, Record<Complexity, number>> = {
  Entradas: { Baja: 3, Media: 4, Alta: 6 },
  Salidas: { Baja: 4, Media: 5, Alta: 7 },
  Consultas: { Baja: 3, Media: 4, Alta: 6 },
  Archivos: { Baja: 7, Media: 10, Alta: 15 },
  Interfaces: { Baja: 5, Media: 7, Alta: 10 },
};

const initialFunctionCounts: FunctionPointCounts = {
  Entradas: { Baja: '', Media: '', Alta: '' },
  Salidas: { Baja: '', Media: '', Alta: '' },
  Consultas: { Baja: '', Media: '', Alta: '' },
  Archivos: { Baja: '', Media: '', Alta: '' },
  Interfaces: { Baja: '', Media: '', Alta: '' },
};

export default function FunctionTypes({ setWeight }: FunctionTypesProps) {
  const [functionCounts, setFunctionCounts] = useState<FunctionPointCounts>(
    initialFunctionCounts
  );

  // Calcular el peso total cuando cambien los valores
  const calculateTotalWeight = (): number => {
    let totalWeight = 0;

    (Object.keys(functionCounts) as FunctionType[]).forEach((type) => {
      (Object.keys(functionCounts[type]) as Complexity[]).forEach((complexity) => {
        const count = Number(functionCounts[type][complexity]) || 0;
        const weight = complexityWeights[type][complexity];
        totalWeight += count * weight;
      });
    });

    return totalWeight;
  };

  // Ejecutar el cálculo y enviar al componente padre cuando cambien los valores
  useEffect(() => {
    const totalWeight = calculateTotalWeight();
    setWeight(totalWeight);
  }, [functionCounts, setWeight]);

  const handleInputChange = (
    e: ChangeEvent<HTMLInputElement>,
    type: FunctionType,
    complexity: Complexity
  ) => {
    const value = e.target.value;

    if (value === '' || (!isNaN(Number(value)) && Number(value) >= 0 && Number(value) <= 999)) {
      setFunctionCounts((prev) => ({
        ...prev,
        [type]: {
          ...prev[type],
          [complexity]: value,
        },
      }));
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(Object.keys(functionCounts) as FunctionType[]).map((type) => (
          <div key={type} className="border rounded-lg p-4 space-y-3">
            <h3 className="font-semibold text-blue-600 text-center">{type}</h3>
            
            <div className="overflow-x-auto">
              <table className="w-full text-sm border-collapse border border-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="border border-gray-200 px-2 py-1 text-xs font-medium">
                      Complejidad
                    </th>
                    <th className="border border-gray-200 px-2 py-1 text-xs font-medium">
                      Cantidad
                    </th>
                    <th className="border border-gray-200 px-2 py-1 text-xs font-medium">
                      Peso
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {(Object.keys(functionCounts[type]) as Complexity[]).map((complexity) => (
                    <tr key={complexity}>
                      <td className="border border-gray-200 px-2 py-1 text-sm">
                        {complexity}
                      </td>
                      <td className="border border-gray-200 px-1 py-1">
                        <Input
                          type="number"
                          min="0"
                          max="999"
                          value={functionCounts[type][complexity]}
                          onChange={(e) => handleInputChange(e, type, complexity)}
                          placeholder="0"
                          className="h-8 text-sm border-0 focus:ring-1 focus:ring-blue-500"
                        />
                      </td>
                      <td className="border border-gray-200 px-2 py-1 text-sm text-gray-600 text-center">
                        {complexityWeights[type][complexity]}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}