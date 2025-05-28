
import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";
import ResultsDisplay from "./ResultsDisplay";
import Cocomo81Form from "./cocomo81/Cocomo81Form";
import Cocomo2Form from "./cocomo2/Cocomo2Form";
import ModelSelector from "./ModelSelector";
import { CocomoResults } from "@/utils/cocomoCalculations";

export default function CocomoCalculator() {
  const { modelType } = useParams<{ modelType: string }>();
  const navigate = useNavigate();
  
  const [results, setResults] = useState<CocomoResults | null>(null);
  
  useEffect(() => {
    // Validate that the model type is valid
    if (modelType !== "cocomo81" && modelType !== "cocomo2") {
      navigate("/");
      toast.error("Invalid model type selected");
    }
  }, [modelType, navigate]);
  
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
                <Cocomo81Form setResults={setResults} showCostDrivers={false} />
              ) : (
                <Cocomo2Form setResults={setResults} />
              )}
              
              <ModelSelector modelType={modelType} />
            </CardContent>
          </Card>
          
          <div className="lg:col-span-2">
            {results && <ResultsDisplay results={results} showStages={false} />}
          </div>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2">
            {modelType === "cocomo81" && (
              <Cocomo81Form setResults={setResults} showOnlyCostDrivers={true} />
            )}
          </div>
          
          <div>
            {results && <ResultsDisplay results={results} showOnlyStages={true} />}
          </div>
        </div>
      </div>
    </div>
  );
}
