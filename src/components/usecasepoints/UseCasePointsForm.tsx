import { Label } from '@radix-ui/react-label';
import React, { useState, useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { FormErrorMessage, FormField } from '../ui/form';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '../ui/dialog';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '../ui/card';
import {
  HelpCircle,
  BookOpen,
  Calculator,
  Target,
  Lightbulb,
  Users,
  GitBranch,
  Settings,
  BarChart3,
  Clock,
} from 'lucide-react';

// Factores de peso para actores
const actorWeights = {
  simple: 1,
  average: 2,
  complex: 3,
};

// Factores de peso para casos de uso
const useCaseWeights = {
  simple: 5,
  average: 10,
  complex: 15,
};

// Factores técnicos (TCF)
const technicalFactors = [
  { id: 'T1', name: 'Sistema distribuido', weight: 2 },
  { id: 'T2', name: 'Tiempo de respuesta', weight: 1 },
  { id: 'T3', name: 'Eficiencia del usuario final', weight: 1 },
  { id: 'T4', name: 'Procesamiento interno complejo', weight: 1 },
  { id: 'T5', name: 'Código reutilizable', weight: 1 },
  { id: 'T6', name: 'Facilidad de instalación', weight: 0.5 },
  { id: 'T7', name: 'Facilidad de uso', weight: 0.5 },
  { id: 'T8', name: 'Portabilidad', weight: 2 },
  { id: 'T9', name: 'Facilidad de cambio', weight: 1 },
  { id: 'T10', name: 'Concurrencia', weight: 1 },
  { id: 'T11', name: 'Objetivos especiales de seguridad', weight: 1 },
  { id: 'T12', name: 'Acceso directo para terceros', weight: 1 },
  { id: 'T13', name: 'Facilidades especiales de entrenamiento', weight: 1 },
];

// Factores del entorno (ECF)
const environmentalFactors = [
  { id: 'E1', name: 'Familiaridad con el modelo de proyecto', weight: 1.5 },
  { id: 'E2', name: 'Experiencia en la aplicación', weight: 0.5 },
  { id: 'E3', name: 'Experiencia en orientación a objetos', weight: 1 },
  { id: 'E4', name: 'Capacidad del analista líder', weight: 0.5 },
  { id: 'E5', name: 'Motivación', weight: 1 },
  { id: 'E6', name: 'Estabilidad de requerimientos', weight: 2 },
  { id: 'E7', name: 'Personal de medio tiempo', weight: -1 },
  { id: 'E8', name: 'Dificultad del lenguaje de programación', weight: -1 },
];

interface FormData {
  simpleActors: number;
  averageActors: number;
  complexActors: number;
  simpleUseCases: number;
  averageUseCases: number;
  complexUseCases: number;
  technicalFactors: Record<string, number>;
  environmentalFactors: Record<string, number>;
  productivityFactor: number;
}

interface UseCasePointsFormProps {
  setUcpValue: (ucpValue: number) => void;
  setUawValue: (uawValue: number) => void;
  setUucwValue: (uucwValue: number) => void;
  setTcfValue: (tcfValue: number) => void;
  setEcfValue: (ecfValue: number) => void;
}

function UseCasePointsFormInner({
  setUcpValue,
  setUawValue,
  setUucwValue,
  setTcfValue,
  setEcfValue,
}: UseCasePointsFormProps) {
  const { watch } = useForm<FormData>();
  const [actors, setActors] = useState({
    simple: 0,
    average: 0,
    complex: 0,
  });

  const [useCases, setUseCases] = useState({
    simple: 0,
    average: 0,
    complex: 0,
  });

  const [techFactors, setTechFactors] = useState<Record<string, number>>({});
  const [envFactors, setEnvFactors] = useState<Record<string, number>>({});
  const [productivityFactor, setProductivityFactor] = useState(20);

  // Cálculo de PAA (Peso Ajustado de Actores)
  const calculatePAA = () => {
    return (
      actors.simple * actorWeights.simple +
      actors.average * actorWeights.average +
      actors.complex * actorWeights.complex
    );
  };

  // Cálculo de PCU (Peso de Casos de Uso)
  const calculatePCU = () => {
    return (
      useCases.simple * useCaseWeights.simple +
      useCases.average * useCaseWeights.average +
      useCases.complex * useCaseWeights.complex
    );
  };

  // Cálculo de FCT (Factor de Complejidad Técnica)
  const calculateFCT = () => {
    const tFactor = technicalFactors.reduce((sum, factor) => {
      const value = techFactors[factor.id] || 0;
      return sum + factor.weight * value;
    }, 0);
    return 0.6 + 0.01 * tFactor;
  };

  // Cálculo de FAE (Factor de Ambiente del Entorno)
  const calculateFAE = () => {
    const eFactor = environmentalFactors.reduce((sum, factor) => {
      const value = envFactors[factor.id] || 0;
      return sum + factor.weight * value;
    }, 0);
    return 1.4 + -0.03 * eFactor;
  };

  // Cálculo de PCUSA (Puntos de Casos de Uso Sin Ajustar)
  const calculatePCUSA = () => {
    return calculatePAA() + calculatePCU();
  };

  // Cálculo de PCU (Puntos de Casos de Uso Ajustados)
  const calculatePCUAjustado = () => {
    return calculatePCUSA() * calculateFCT() * calculateFAE();
  };

  // Cálculo del Esfuerzo en Horas
  const calculateEsfuerzo = () => {
    return calculatePCUAjustado() * productivityFactor;
  };

  // Efecto para recalcular cuando cambian los valores
  useEffect(() => {
    const paa = calculatePAA();
    const pcu = calculatePCU();
    const fct = calculateFCT();
    const fae = calculateFAE();
    const pcuAjustado = calculatePCUAjustado();

    setUawValue(paa);
    setUucwValue(pcu);
    setTcfValue(fct);
    setEcfValue(fae);
    setUcpValue(pcuAjustado);
  }, [
    actors,
    useCases,
    techFactors,
    envFactors,
    setUawValue,
    setUucwValue,
    setTcfValue,
    setEcfValue,
    setUcpValue,
  ]);

  return (
    <div className="h-[calc(100vh-200px)] max-w-7xl mx-auto p-4">
      <div className="flex gap-6 h-full">
        {/* Panel izquierdo - Pestañas */}
        <div className="flex-1">
          <Tabs defaultValue="actors" className="h-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="actors" className="flex items-center gap-2">
                <Users className="h-4 w-4" />
                Actores
              </TabsTrigger>
              <TabsTrigger value="usecases" className="flex items-center gap-2">
                <GitBranch className="h-4 w-4" />
                Casos de Uso
              </TabsTrigger>
              <TabsTrigger
                value="technical"
                className="flex items-center gap-2"
              >
                <Settings className="h-4 w-4" />
                Técnicos
              </TabsTrigger>
              <TabsTrigger
                value="environmental"
                className="flex items-center gap-2"
              >
                <Target className="h-4 w-4" />
                Entorno
              </TabsTrigger>
            </TabsList>

            <div className="mt-4 h-[calc(100%-60px)] overflow-y-auto">
              <TabsContent value="actors" className="space-y-4 h-full">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Users className="h-5 w-5" />
                      Clasificación de Actores
                    </CardTitle>
                    <CardDescription>
                      Identifica y cuenta los diferentes tipos de actores
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <div className="bg-green-50 p-3 rounded-lg">
                          <Label className="text-sm font-semibold text-green-800">
                            Simples (1 pt)
                          </Label>
                          <p className="text-xs text-green-600 mt-1">
                            Sistemas externos con API definida
                          </p>
                        </div>
                        <Input
                          type="number"
                          min="0"
                          value={actors.simple}
                          onChange={(e) =>
                            setActors((prev) => ({
                              ...prev,
                              simple: Number(e.target.value),
                            }))
                          }
                          className="text-center text-lg"
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="bg-yellow-50 p-3 rounded-lg">
                          <Label className="text-sm font-semibold text-yellow-800">
                            Promedio (2 pts)
                          </Label>
                          <p className="text-xs text-yellow-600 mt-1">
                            Sistemas externos con protocolo
                          </p>
                        </div>
                        <Input
                          type="number"
                          min="0"
                          value={actors.average}
                          onChange={(e) =>
                            setActors((prev) => ({
                              ...prev,
                              average: Number(e.target.value),
                            }))
                          }
                          className="text-center text-lg"
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="bg-red-50 p-3 rounded-lg">
                          <Label className="text-sm font-semibold text-red-800">
                            Complejos (3 pts)
                          </Label>
                          <p className="text-xs text-red-600 mt-1">
                            Personas usando interfaz gráfica
                          </p>
                        </div>
                        <Input
                          type="number"
                          min="0"
                          value={actors.complex}
                          onChange={(e) =>
                            setActors((prev) => ({
                              ...prev,
                              complex: Number(e.target.value),
                            }))
                          }
                          className="text-center text-lg"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="usecases" className="space-y-4 h-full">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <GitBranch className="h-5 w-5" />
                      Clasificación de Casos de Uso
                    </CardTitle>
                    <CardDescription>
                      Clasifica los casos de uso según su complejidad
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                      <div className="space-y-3">
                        <div className="bg-green-50 p-3 rounded-lg">
                          <Label className="text-sm font-semibold text-green-800">
                            Simples (5 pts)
                          </Label>
                          <p className="text-xs text-green-600 mt-1">
                            Hasta 3 transacciones, 1 actor
                          </p>
                        </div>
                        <Input
                          type="number"
                          min="0"
                          value={useCases.simple}
                          onChange={(e) =>
                            setUseCases((prev) => ({
                              ...prev,
                              simple: Number(e.target.value),
                            }))
                          }
                          className="text-center text-lg"
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="bg-yellow-50 p-3 rounded-lg">
                          <Label className="text-sm font-semibold text-yellow-800">
                            Promedio (10 pts)
                          </Label>
                          <p className="text-xs text-yellow-600 mt-1">
                            4-7 transacciones, 2+ actores
                          </p>
                        </div>
                        <Input
                          type="number"
                          min="0"
                          value={useCases.average}
                          onChange={(e) =>
                            setUseCases((prev) => ({
                              ...prev,
                              average: Number(e.target.value),
                            }))
                          }
                          className="text-center text-lg"
                        />
                      </div>

                      <div className="space-y-3">
                        <div className="bg-red-50 p-3 rounded-lg">
                          <Label className="text-sm font-semibold text-red-800">
                            Complejos (15 pts)
                          </Label>
                          <p className="text-xs text-red-600 mt-1">
                            Más de 7 transacciones, 3+ actores
                          </p>
                        </div>
                        <Input
                          type="number"
                          min="0"
                          value={useCases.complex}
                          onChange={(e) =>
                            setUseCases((prev) => ({
                              ...prev,
                              complex: Number(e.target.value),
                            }))
                          }
                          className="text-center text-lg"
                        />
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="technical" className="space-y-4 h-full">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Settings className="h-5 w-5" />
                      Factores Técnicos (FCT)
                    </CardTitle>
                    <CardDescription>
                      Califica de 0 a 5 donde: 0 = No relevante, 3 = Promedio, 5
                      = Esencial
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {technicalFactors.map((factor) => (
                        <div
                          key={factor.id}
                          className="flex items-center gap-3 p-2 bg-gray-50 rounded"
                        >
                          <div className="w-8 text-xs font-bold text-purple-700 bg-purple-100 rounded px-2 py-1">
                            {factor.id}
                          </div>
                          <div className="flex-1">
                            <Label className="text-sm font-medium">
                              {factor.name}
                            </Label>
                            <p className="text-xs text-gray-500">
                              Peso: {factor.weight}
                            </p>
                          </div>
                          <Input
                            type="number"
                            min="0"
                            max="5"
                            value={techFactors[factor.id] || 0}
                            onChange={(e) =>
                              setTechFactors((prev) => ({
                                ...prev,
                                [factor.id]: Number(e.target.value),
                              }))
                            }
                            className="w-20 text-center"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="environmental" className="space-y-4 h-full">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                      <Target className="h-5 w-5" />
                      Factores del Entorno (FAE)
                    </CardTitle>
                    <CardDescription>
                      Califica de 0 a 5 donde: 0 = Sin importancia, 3 =
                      Promedio, 5 = Muy importante
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3 max-h-[400px] overflow-y-auto">
                      {environmentalFactors.map((factor) => (
                        <div
                          key={factor.id}
                          className="flex items-center gap-3 p-2 bg-gray-50 rounded"
                        >
                          <div className="w-8 text-xs font-bold text-orange-700 bg-orange-100 rounded px-2 py-1">
                            {factor.id}
                          </div>
                          <div className="flex-1">
                            <Label className="text-sm font-medium">
                              {factor.name}
                            </Label>
                            <p className="text-xs text-gray-500">
                              Peso: {factor.weight}
                            </p>
                          </div>
                          <Input
                            type="number"
                            min="0"
                            max="5"
                            value={envFactors[factor.id] || 0}
                            onChange={(e) =>
                              setEnvFactors((prev) => ({
                                ...prev,
                                [factor.id]: Number(e.target.value),
                              }))
                            }
                            className="w-20 text-center"
                          />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </div>
          </Tabs>
        </div>

        {/* Panel derecho - Resultados */}
        <div className="w-80 bg-gray-50 p-4 rounded-lg">
          <div className="flex items-center gap-2 mb-4">
            <BarChart3 className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-bold text-gray-800">Resultados</h3>
          </div>

          <div className="space-y-4">
            {/* Métricas básicas */}
            {/* <div className="bg-white p-3 rounded border">
              <div className="text-sm text-gray-600 mb-2">Peso Ajustado de Actores</div>
              <div className="text-xl font-bold text-blue-600">
                PAA: {calculatePAA()}
              </div>
            </div>

            <div className="bg-white p-3 rounded border">
              <div className="text-sm text-gray-600 mb-2">Peso de Casos de Uso</div>
              <div className="text-xl font-bold text-green-600">
                PCU: {calculatePCU()}
              </div>
            </div> */}

            <div className="bg-white p-3 rounded border">
              <div className="text-sm text-gray-600 mb-2">
                Puntos de Casos de Uso Sin Ajustar
              </div>
              <div className="text-xl font-bold text-purple-600">
                PCUSA: {calculatePCUSA()}
              </div>
            </div>

            {/* Factores de ajuste */}
            <div className="bg-white p-3 rounded border">
              <div className="text-sm text-gray-600 mb-2">
                Factor de Complejidad Técnica
              </div>
              <div className="text-lg font-bold text-orange-600">
                FCT: {calculateFCT().toFixed(3)}
              </div>
            </div>

            <div className="bg-white p-3 rounded border">
              <div className="text-sm text-gray-600 mb-2">
                Factor de Ambiente del Entorno
              </div>
              <div className="text-lg font-bold text-red-600">
                FAE: {calculateFAE().toFixed(3)}
              </div>
            </div>

            {/* Resultado final */}
            <div className="bg-gradient-to-r from-blue-500 to-purple-600 p-4 rounded-lg text-white">
              <div className="text-sm opacity-90 mb-1">
                Puntos de Casos de Uso Ajustados
              </div>
              <div className="text-2xl font-bold">
                PCU: {calculatePCUAjustado().toFixed(2)}
              </div>
              <div className="text-xs opacity-80 mt-1">
                Fórmula: PCUSA × FCT × FAE
              </div>
            </div>

            {/* Cálculo del esfuerzo */}
            {/* <div className="bg-white p-3 rounded border">
              <div className="flex items-center gap-2 mb-2">
                <Clock className="h-4 w-4 text-gray-600" />
                <div className="text-sm text-gray-600">Factor de Productividad</div>
              </div>
              <Input
                type="number"
                min="15"
                max="30"
                value={productivityFactor}
                onChange={(e) => setProductivityFactor(Number(e.target.value))}
                className="mb-2"
              />
              <div className="text-sm text-gray-500">
                Rango típico: 20-28 horas/punto
              </div>
            </div> */}

            <div className="bg-gradient-to-r from-green-500 to-blue-600 p-4 rounded-lg text-white">
              <div className="text-sm opacity-90 mb-1">Esfuerzo Total</div>
              <div className="text-2xl font-bold">
                {calculateEsfuerzo().toFixed(0)} horas
              </div>
              <div className="text-sm opacity-80 mt-1">
                ≈ {(calculateEsfuerzo() / 8).toFixed(1)} días
              </div>
              <div className="text-xs opacity-70 mt-1">
                PCU × {productivityFactor} h/punto
              </div>
            </div>
          </div>

          {/* Botón de ayuda */}
          <div className="mt-6 w-full">
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Guía de Puntos de Caso de Uso
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Guía de Puntos de Caso de Uso
                  </DialogTitle>
                  <DialogDescription>
                    Aprende a estimar el esfuerzo de desarrollo usando UCP
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* Introducción */}
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                    <div className="flex items-start gap-3">
                      <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-blue-900 mb-2">
                          ¿Qué son los Puntos de Caso de Uso?
                        </h3>
                        <p className="text-blue-800 text-sm">
                          Una técnica para estimar el esfuerzo de desarrollo
                          basada en casos de uso, actores y factores técnicos y
                          del entorno del proyecto.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Proceso */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      Proceso de Cálculo
                    </h3>

                    <div className="space-y-4">
                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-2">
                          1. Clasificación de Actores
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>
                            <strong>Simples:</strong> Sistemas externos con API
                            definida
                          </li>
                          <li>
                            <strong>Promedio:</strong> Sistemas externos con
                            protocolo
                          </li>
                          <li>
                            <strong>Complejos:</strong> Personas usando interfaz
                            gráfica
                          </li>
                        </ul>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-2">
                          2. Clasificación de Casos de Uso
                        </h4>
                        <ul className="text-sm text-gray-600 space-y-1">
                          <li>
                            <strong>Simples:</strong> Hasta 3 transacciones, 1
                            actor
                          </li>
                          <li>
                            <strong>Promedio:</strong> 4-7 transacciones, 2+
                            actores
                          </li>
                          <li>
                            <strong>Complejos:</strong> Más de 7 transacciones,
                            3+ actores
                          </li>
                        </ul>
                      </div>

                      <div className="border rounded-lg p-4">
                        <h4 className="font-semibold text-gray-800 mb-2">
                          3. Factores de Ajuste
                        </h4>
                        <p className="text-sm text-gray-600">
                          Los factores técnicos (TCF) y del entorno (ECF)
                          ajustan la estimación según la complejidad técnica y
                          las características del equipo de desarrollo.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Consejo */}
                  <div className="bg-amber-50 p-4 rounded-lg border-l-4 border-amber-400">
                    <div className="flex items-start gap-3">
                      <Lightbulb className="h-5 w-5 text-amber-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-amber-900 mb-2">
                          Conversión a Horas
                        </h3>
                        <p className="text-amber-800 text-sm">
                          Para convertir UCP a horas de desarrollo, multiplica
                          por un factor entre 20-28 horas por punto, dependiendo
                          de la productividad del equipo.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        </div>
      </div>
    </div>
  );
}

export default function UseCasePointsForm({
  setUcpValue,
  setUawValue,
  setUucwValue,
  setTcfValue,
  setEcfValue,
}: UseCasePointsFormProps) {
  const form = useForm<FormData>({
    defaultValues: {
      simpleActors: 0,
      averageActors: 0,
      complexActors: 0,
      simpleUseCases: 0,
      averageUseCases: 0,
      complexUseCases: 0,
      technicalFactors: {},
      environmentalFactors: {},
      productivityFactor: 20,
    },
    mode: 'onChange',
  });

  return (
    <FormProvider {...form}>
      <UseCasePointsFormInner
        setUcpValue={setUcpValue}
        setUawValue={setUawValue}
        setUucwValue={setUucwValue}
        setTcfValue={setTcfValue}
        setEcfValue={setEcfValue}
      />
    </FormProvider>
  );
}
