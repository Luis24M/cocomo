import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ResultsDisplay from "./ResultsDisplay";
import Cocomo81Form from "./cocomo81/Cocomo81Form";
import Cocomo2Form from "./cocomo2/Cocomo2Form";
import ModelSelector from "./ModelSelector";
import CostDriversTable from "./cocomo81/CostDriversTable";
import { CocomoResults, DevelopmentMode, calculateCocomo81, DetailedCosts, PhaseData } from "@/utils/cocomoCalculations";
import { useResultadosEtapasStore } from "@/hooks/useResultadosEtapas";

const CocomoResultsKey = "CocomoResults";

export default function CocomoCalculator() {
  const { modelType } = useParams<{ modelType: string }>();
  const navigate = useNavigate();

  const detailedCosts = useResultadosEtapasStore((state) => state.detailedCosts);
  const setDetailedCosts = useResultadosEtapasStore((state) => state.setDetailedCosts);

  const [results, setResults] = useState<CocomoResults | null>(null);
  const [listResults, setListResults] = useState<CocomoResults[]>([]);
  
  // Estados específicos para COCOMO 81
  const [kloc, setKloc] = useState<number>(10);
  const [developmentMode, setDevelopmentMode] = useState<DevelopmentMode>("organic");
  const [developerSalary, setDeveloperSalary] = useState<number>(5000);
  const [eaf, setEaf] = useState<number>(1.0);
  const useDetailedCosts = useResultadosEtapasStore((state) => state.fasesActivas);
  const setUseDetailedCosts = useResultadosEtapasStore((state) => state.setFasesActivas);

  // Función para calcular el salario promedio basado en los costos detallados
  const calculateAverageSalary = () => {
    const phases = Object.values(detailedCosts);
    const totalPercentage = phases.reduce((sum, phase) => sum + phase.percentage, 0);
    
    if (totalPercentage === 0) return 0;
    
    const weightedSum = phases.reduce((sum, phase) => {
      return sum + (phase.percentage / 100) * phase.cost;
    }, 0);
    
    return weightedSum;
  };

  // Función para calcular resultados por fase con todos los parámetros disponibles
  const calculatePhaseResults = () => {
    if (!kloc || kloc === 0) return detailedCosts;
    
    // Constantes básicas de COCOMO según el modo
    const cocomoConstants = {
      organic: { a: 2.4, b: 1.05, c: 2.5, d: 0.38 },
      'semi-detached': { a: 3.0, b: 1.12, c: 2.5, d: 0.35 },
      embedded: { a: 3.6, b: 1.20, c: 2.5, d: 0.32 }
    };
    
    const constants = cocomoConstants[developmentMode];
    
    // Cálculo básico de COCOMO con EAF
    const baseEffort = constants.a * Math.pow(kloc, constants.b);
    const totalEffort = baseEffort * eaf; // Aplicar EAF aquí
    const totalTime = constants.c * Math.pow(totalEffort, constants.d);
    
    // Calcular resultados por fase
    const updatedCosts = { ...detailedCosts };
    
    Object.keys(updatedCosts).forEach(phase => {
      const phaseData = updatedCosts[phase as keyof DetailedCosts];
      if (phaseData.percentage > 0) {
        // Distribuir el esfuerzo y tiempo según el porcentaje
        phaseData.effort = (phaseData.percentage / 100) * totalEffort;
        phaseData.time = (phaseData.percentage / 100) * totalTime;
        phaseData.totalCost = phaseData.effort * phaseData.cost;
      } else {
        phaseData.effort = 0;
        phaseData.time = 0;
        phaseData.totalCost = 0;
      }
    });

    return updatedCosts;
  };

  useEffect(() => {
    // Load previous results from localStorage
    const storedResults = localStorage.getItem(CocomoResultsKey);
    if (storedResults) {
      setListResults(JSON.parse(storedResults));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(CocomoResultsKey, JSON.stringify(listResults));
  }, [listResults]);
  
  useEffect(() => {
    // Validate that the model type is valid
    if (modelType !== "cocomo81" && modelType !== "cocomo2") {
      navigate("/");
      toast.error("Invalid model type selected");
    }
  }, [modelType, navigate]);

  // Efecto para actualizar el salario cuando se usen costos detallados
  useEffect(() => {
    if (useDetailedCosts) {
      const avgSalary = calculateAverageSalary();
      setDeveloperSalary(avgSalary);
    }
  }, [detailedCosts, useDetailedCosts]);

  // Efecto para calcular resultados de COCOMO 81 cuando cambien los parámetros
  useEffect(() => {
    if (modelType === "cocomo81") {
      try {
        const salary = useDetailedCosts ? calculateAverageSalary() : developerSalary;
        
        const newResults = calculateCocomo81({ 
          kloc, 
          developmentMode, 
          eaf,
          developerSalary: salary 
        });

        // Si se usan costos detallados, agregar la información de fases
        if (useDetailedCosts) {
          const phaseResults = calculatePhaseResults();
          // setDetailedCosts(phaseResults);
        }

        setResults(newResults);
      } catch (error) {
        console.error(error);
      }
    }
  }, [kloc, developmentMode, eaf, developerSalary, modelType, detailedCosts, useDetailedCosts]);

  const getTotalPercentage = () => {
    return Object.values(detailedCosts).reduce((sum, phase) => sum + phase.percentage, 0);
  };

  const addResult = (newResult: CocomoResults) => {
    setListResults([...listResults, newResult]);
  };

  const clearResults = () => {
    setListResults([]);
    localStorage.removeItem(CocomoResultsKey);
  };

  // Función para manejar cambios en los costos detallados desde el componente hijo
  const handleDetailedCostChange = (
    phase: keyof DetailedCosts, 
    field: keyof PhaseData, 
    value: number
  ) => {
    const updated = {
      ...detailedCosts,
      [phase]: {
        ...detailedCosts[phase],
        [field]: value
      }
    };
    setDetailedCosts(updated);
  };
  
  if (modelType !== "cocomo81" && modelType !== "cocomo2") {
    return <div>Loading...</div>;
  }
  
  return (
    <div className="container py-4 max-w-7xl mx-auto">
      <h1 className="text-xl font-medium mb-4">
        {modelType === "cocomo81" ? "COCOMO 81" : "COCOMO II"}
      </h1>
      
      <div className="space-y-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <Card className="shadow-sm border-0">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Parámetros</CardTitle>
            </CardHeader>
            <CardContent>
              {modelType === "cocomo81" ? (
                <Cocomo81Form 
                  kloc={kloc}
                  setKloc={setKloc}
                  developmentMode={developmentMode}
                  setDevelopmentMode={setDevelopmentMode}
                  developerSalary={developerSalary}
                  setDeveloperSalary={setDeveloperSalary}
                  useDetailedCosts={useDetailedCosts}
                  setUseDetailedCosts={setUseDetailedCosts}
                  detailedCosts={detailedCosts}
                  onDetailedCostChange={handleDetailedCostChange}
                  calculateAverageSalary={calculateAverageSalary}
                  getTotalPercentage={getTotalPercentage}
                  showCostDrivers={false}
                />
              ) : (
                <Cocomo2Form setResults={setResults} />
              )}
            </CardContent>
          </Card>
          
          {/* Card de Conductores de coste */}
          <div className="lg:col-span-2">
            {modelType === "cocomo81" && (
              <Card className="shadow-sm border-0">
                <CardHeader className="pb-2">
                  <CardTitle className="text-base">Conductores de Costo</CardTitle>
                </CardHeader>
                <CardContent>
                  <CostDriversTable onEafChange={setEaf} />
                </CardContent>
              </Card>
            )}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {/* Card de Resultados */}
          <div className="lg:col-span-1">
            {results && <ResultsDisplay results={results} showStages={false} addResult={addResult} clearResults={clearResults}/>}
          </div>
          
          <div className="lg:col-span-2">
            {/* Card de Etapas */}
            {results && <ResultsDisplay results={results} showOnlyStages={true} listResults={listResults} />}
          </div>
        </div>
      </div>
    </div>
  );
}