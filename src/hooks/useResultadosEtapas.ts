import { create } from "zustand";
import { DetailedCosts, PhaseData } from "../utils/cocomoCalculations";

interface ResultadosEtapasState {
  resultados: PhaseData[];
  detailedCosts: DetailedCosts;
  fasesActivas: boolean
  setFasesActivas: (active: boolean) => void;
  setResultsPhases: (results: PhaseData[]) => void;
  setDetailedCosts: (detailedCosts: DetailedCosts) => void;
}

export const useResultadosEtapasStore = create<ResultadosEtapasState>((set) => ({
    resultados: [],
    detailedCosts: {
        requirements: { percentage: 0, cost: 0 },
        analysis: { percentage: 0, cost: 0 },
        design: { percentage: 0, cost: 0 },
        development: { percentage: 0, cost: 0 },
        testing: { percentage: 0, cost: 0 }
    },
    fasesActivas: false,

    setFasesActivas: (active: boolean) => set({ fasesActivas: active }),
    setResultsPhases: (results: PhaseData[]) => set({ resultados: results }),
    setDetailedCosts: (detailedCosts: DetailedCosts | ((prev: DetailedCosts) => DetailedCosts)) => 
      set(state => ({ detailedCosts: typeof detailedCosts === 'function' ? detailedCosts(state.detailedCosts) : detailedCosts })),

    
}));
