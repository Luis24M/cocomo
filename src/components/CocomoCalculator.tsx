import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ResultsDisplay from "./ResultsDisplay";
import Cocomo81Form from "./cocomo81/Cocomo81Form";
import Cocomo2Form from "./cocomo2/Cocomo2Form";
import ModelSelector from "./ModelSelector";
import CostDriversTable from "./cocomo81/CostDriversTable";
import { CocomoResults, DevelopmentMode, calculateCocomo81 } from "@/utils/cocomoCalculations";

const CocomoResultsKey = "CocomoResults";

export default function CocomoCalculator() {
  const { modelType } = useParams<{ modelType: string }>();
  const navigate = useNavigate();

  const [results, setResults] = useState<CocomoResults | null>(null);
  const [listResults, setListResults] = useState<CocomoResults[]>([]);
  
  // Estados específicos para COCOMO 81
  const [kloc, setKloc] = useState<number>(10);
  const [developmentMode, setDevelopmentMode] = useState<DevelopmentMode>("organic");
  const [developerSalary, setDeveloperSalary] = useState<number>(5000);
  const [eaf, setEaf] = useState<number>(1.0);

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

  // Efecto para calcular resultados de COCOMO 81 cuando cambien los parámetros
  useEffect(() => {
    if (modelType === "cocomo81") {
      try {
        const newResults = calculateCocomo81({ 
          kloc, 
          developmentMode, 
          eaf,
          developerSalary 
        });
        setResults(newResults);
      } catch (error) {
        console.error(error);
      }
    }
  }, [kloc, developmentMode, eaf, developerSalary, modelType]);

  const addResult = (newResult: CocomoResults) => {
    setListResults([...listResults, newResult]);
  };

  const clearResults = () => {
    setListResults([]);
    localStorage.removeItem(CocomoResultsKey);
  }
  
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
                  showCostDrivers={false}
                />
              ) : (
                <Cocomo2Form setResults={setResults} />
              )}
              
              {/* <ModelSelector modelType={modelType} /> */}
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