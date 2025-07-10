import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';

// Components
import ResultsDisplay from './ResultsDisplay';
import Cocomo81Form from './cocomo81/Cocomo81Form';
import Cocomo2Form from './cocomo2/Cocomo2Form';
import ModelSelector from './ModelSelector';
import CostDriversTable from './cocomo81/CostDriversTable';
import FunctionPointsForm from './functionpoints/FunctionPointsForm';
import ScaleDriversForm from './cocomo2/ScaleDriversForm';
import CostDriversTable2 from './cocomo2/CostDriversTable2';

// Types and Utils
import {
  CocomoResults,
  FunctionPointsResults,
  DevelopmentMode,
  calculateCocomo81,
  calculateCocomo2,
  DetailedCosts,
  PhaseData,
  calculateFunctionPoints,
} from '@/utils/cocomoCalculations';
import { useResultadosEtapasStore } from '@/hooks/useResultadosEtapas';
import FunctionTypes from './functionpoints/FunctionTypes';
import ResultsFunctionPoints from './ResultsFunctionPoints';

// Constants
const COCOMO_RESULTS_KEY = 'CocomoResults';
const VALID_MODEL_TYPES = ['cocomo81', 'cocomo2', 'functionpoints'] as const;
type ValidModelType = (typeof VALID_MODEL_TYPES)[number];

const COCOMO_CONSTANTS = {
  organic: { a: 2.4, b: 1.05, c: 2.5, d: 0.38 },
  'semi-detached': { a: 3.0, b: 1.12, c: 2.5, d: 0.35 },
  embedded: { a: 3.6, b: 1.2, c: 2.5, d: 0.32 },
} as const;

export default function CocomoCalculator() {
  const { modelType } = useParams<{ modelType: string }>();
  const navigate = useNavigate();

  // Store hooks
  const detailedCosts = useResultadosEtapasStore(
    (state) => state.detailedCosts
  );
  const setDetailedCosts = useResultadosEtapasStore(
    (state) => state.setDetailedCosts
  );
  const useDetailedCosts = useResultadosEtapasStore(
    (state) => state.fasesActivas
  );
  const setUseDetailedCosts = useResultadosEtapasStore(
    (state) => state.setFasesActivas
  );

  // State
  const [results, setResults] = useState<CocomoResults | null>(null);
  const [resultfunctionpoints, setResultFunctionPoints] =
    useState<FunctionPointsResults | null>(null);
  const [listResults, setListResults] = useState<CocomoResults[]>([]);

  // COCOMO 81 specific states
  const [kloc, setKloc] = useState<number>(10);
  const [developmentMode, setDevelopmentMode] =
    useState<DevelopmentMode>('organic');
  const [developerSalary, setDeveloperSalary] = useState<number>(5000);
  const [eaf, setEaf] = useState<number>(1.0);

  // COMO 2 STATES
  const [size, setSize] = useState<number>(5000);
  const [scaleFactorSum, setScaleFactorSum] = useState<number>(0.0);

  // Function Points specific states
  const [functionPointsWeight, setFunctionPointsWeight] = useState<number>(0);
  const [FP, setFP] = useState<number>(0);
  const [adjustFactor, setAdjustFactor] = useState<number>(1.0);

  // Utility functions
  const isValidModelType = (type: string): type is ValidModelType => {
    return VALID_MODEL_TYPES.includes(type as ValidModelType);
  };

  const calculateAverageSalary = (): number => {
    const phases = Object.values(detailedCosts);
    const totalPercentage = phases.reduce(
      (sum, phase) => sum + phase.percentage,
      0
    );

    if (totalPercentage === 0) return 0;

    const weightedSum = phases.reduce((sum, phase) => {
      return sum + (phase.percentage / 100) * phase.cost;
    }, 0);

    return weightedSum;
  };

  const getTotalPercentage = (): number => {
    return Object.values(detailedCosts).reduce(
      (sum, phase) => sum + phase.percentage,
      0
    );
  };

  const calculatePhaseResults = (): DetailedCosts => {
    if (!kloc || kloc === 0) return detailedCosts;

    const constants = COCOMO_CONSTANTS[developmentMode];

    // Basic COCOMO calculation with EAF
    const baseEffort = constants.a * Math.pow(kloc, constants.b);
    const totalEffort = baseEffort * eaf;
    const totalTime = constants.c * Math.pow(totalEffort, constants.d);

    // Calculate results per phase
    const updatedCosts = { ...detailedCosts };

    Object.keys(updatedCosts).forEach((phase) => {
      const phaseData = updatedCosts[phase as keyof DetailedCosts];
      if (phaseData.percentage > 0) {
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

  const calculateCocomo81Results = (): void => {
    if (modelType !== 'cocomo81') return;

    try {
      const salary = useDetailedCosts
        ? calculateAverageSalary()
        : developerSalary;

      const newResults = calculateCocomo81({
        kloc,
        developmentMode,
        eaf,
        developerSalary: salary,
      });

      // Add phase information if using detailed costs
      if (useDetailedCosts) {
        calculatePhaseResults();
      }

      setResults(newResults);
    } catch (error) {
      console.error('Error calculating COCOMO 81 results:', error);
      toast.error('Error calculating COCOMO 81 results');
    }
  };

const calculateCocomo2Results = (): void => {
  if (modelType !== 'cocomo2') return;
  
  try {
    const salary = useDetailedCosts
      ? calculateAverageSalary()
      : developerSalary;
    
    const newResults = calculateCocomo2({
      size,
      scaleFactorSum,
      eaf,
      developerSalary: salary,
    });
    
    console.log(newResults)
    setResults(newResults);
    
    if (useDetailedCosts) {
      calculatePhaseResults();
    }
  } catch (error) {
    console.error('Error calculating COCOMO II results:', error);
    toast.error('Error calculating COCOMO II results');
  }
};

  const calculateFunctionPointsResults = (): void => {
    try {
      const result = calculateFunctionPoints(
        FP,
        adjustFactor,
        functionPointsWeight,
      );
      setResultFunctionPoints(result);
      setResults(null); // Clear COCOMO results if switching to Function Points
    } catch (error) {
      console.error('Error calculating Function Points results:', error);
      toast.error('Error calculating Function Points results');
    }
  };

  // Event handlers
  const handleDetailedCostChange = (
    phase: keyof DetailedCosts,
    field: keyof PhaseData,
    value: number
  ): void => {
    const updated = {
      ...detailedCosts,
      [phase]: {
        ...detailedCosts[phase],
        [field]: value,
      },
    };
    setDetailedCosts(updated);
  };

  const addResult = (newResult: CocomoResults): void => {
    setListResults((prev) => [...prev, newResult]);
  };

  const clearResults = (): void => {
    setListResults([]);
    localStorage.removeItem(COCOMO_RESULTS_KEY);
  };

  // Effects
  useEffect(() => {
    // Load previous results from localStorage
    const storedResults = localStorage.getItem(COCOMO_RESULTS_KEY);
    if (storedResults) {
      try {
        setListResults(JSON.parse(storedResults));
      } catch (error) {
        console.error('Error parsing stored results:', error);
        localStorage.removeItem(COCOMO_RESULTS_KEY);
      }
    }
  }, []);

  useEffect(() => {
    // Save results to localStorage
    localStorage.setItem(COCOMO_RESULTS_KEY, JSON.stringify(listResults));
  }, [listResults]);

  useEffect(() => {
    // Validate model type
    if (!modelType || !isValidModelType(modelType)) {
      navigate('/');
      toast.error('Invalid model type selected');
    }
  }, [modelType, navigate]);

  useEffect(() => {
    // Update salary when using detailed costs
    if (useDetailedCosts) {
      const avgSalary = calculateAverageSalary();
      setDeveloperSalary(avgSalary);
    }
  }, [detailedCosts, useDetailedCosts]);

  useEffect(() => {
    // Calculate COCOMO 81 results when parameters change
    calculateCocomo81Results();
  }, [
    kloc,
    developmentMode,
    eaf,
    developerSalary,
    modelType,
    detailedCosts,
    useDetailedCosts,
  ]);

  useEffect(() => {
  if (modelType === 'cocomo2') {
    calculateCocomo2Results();
  }
}, [
  size,
  scaleFactorSum,
  eaf,
  developerSalary,
  detailedCosts,
  useDetailedCosts,
]);

  useEffect(() => {
    // Calculate Function Points results when parameters change
    if (modelType === 'functionpoints') {
      calculateFunctionPointsResults();
    }
  }, [FP, adjustFactor, functionPointsWeight, modelType]);

  // Render helpers
  const renderParametersCard = () => (
    <Card className="shadow-sm border-0">
      <CardHeader className="pb-2">
        <CardTitle className="text-base">Parámetros</CardTitle>
      </CardHeader>
      <CardContent>
        {modelType === 'cocomo81' && (
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
        )}
        {modelType === 'cocomo2' && <Cocomo2Form 
            kloc={size}
            setKloc={setSize}
            developerSalary={developerSalary}
            setDeveloperSalary={setDeveloperSalary}
            useDetailedCosts={useDetailedCosts}
            setUseDetailedCosts={setUseDetailedCosts}
            detailedCosts={detailedCosts}
            onDetailedCostChange={handleDetailedCostChange}
            calculateAverageSalary={calculateAverageSalary}
            getTotalPercentage={getTotalPercentage}
            showCostDrivers={false}
             />}
        {modelType === 'functionpoints' && <FunctionPointsForm setAdjustFactor={setAdjustFactor} setLdcValue={setFP} />}
      </CardContent>
    </Card>
  );

  const renderCostDriversCard = () => {
    if (modelType === 'cocomo81') {
      return (
        <Card className="shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Conductores de Costo</CardTitle>
          </CardHeader>
          <CardContent>
            <CostDriversTable onEafChange={setEaf} />
          </CardContent>
        </Card>
      );
    }
    if (modelType === 'cocomo2') {
      return (
        <Card className="shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Conductores de Costo</CardTitle>
          </CardHeader>
          <CardContent>
            <CostDriversTable2 onEafChange={setEaf} />
          </CardContent>
          <CardContent>
            <ScaleDriversForm onScaleFactorChange={setScaleFactorSum} />
          </CardContent>
        </Card>
      );
    }

    if (modelType === 'functionpoints') {
      return (
        <Card className="shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Tipos de Funciones</CardTitle>
          </CardHeader>
          <CardContent>
            <FunctionTypes  setWeight={setFunctionPointsWeight} />
          </CardContent>
        </Card>
      );
    }
  };

  const renderResultsCards = () => {
    if (results) 
    return (
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <div className="lg:col-span-1">
          <ResultsDisplay
            results={results}
            showStages={false}
            addResult={addResult}
            clearResults={clearResults}
          />
        </div>
        <div className="lg:col-span-2">
          <ResultsDisplay
            results={results}
            showOnlyStages={true}
            listResults={listResults}
          />
        </div>
      </div>
    );

    if (resultfunctionpoints) {
      return (
        <Card className="shadow-sm border-0">
          <CardHeader className="pb-2">
            <CardTitle className="text-base">Resultados</CardTitle>
          </CardHeader>
          <CardContent>
            <ResultsFunctionPoints results={resultfunctionpoints} adjustmentFactor={adjustFactor} />
          </CardContent>
        </Card>
      );
    }
  };

  const getPageTitle = (): string => {
    switch (modelType) {
      case 'cocomo81':
        return 'COCOMO 81';
      case 'cocomo2':
        return 'COCOMO II';
      case 'functionpoints':
        return 'PUNTOS DE FUNCIÓN';
      default:
        return 'Calculadora';
    }
  };

  // Loading state
  if (!modelType || !isValidModelType(modelType)) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container py-4 max-w-7xl mx-auto">
      <h1 className="text-xl font-medium mb-4">{getPageTitle()}</h1>

      <div className="space-y-4">
        {/* Parameters and Cost Drivers Row */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          {renderParametersCard()}
          <div className="lg:col-span-2">{renderCostDriversCard()}</div>
        </div>

        {/* Results Row */}
        {renderResultsCards()}
      </div>
    </div>
  );
}
