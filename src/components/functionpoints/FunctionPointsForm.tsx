import { Label } from '@radix-ui/react-label';
import React, { useState, ChangeEvent, useEffect } from 'react';
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
import {
  HelpCircle,
  BookOpen,
  Calculator,
  Target,
  Lightbulb,
} from 'lucide-react';

const ldcValues: Record<string, number> = {
  Default: 1,
  '4GL': 40,
  'Ada 83': 71,
  'Ada 95': 49,
  APL: 32,
  'BASIC - compilado': 91,
  'BASIC - interpretado': 128,
  'BASIC ANSI/Quick/Turbo': 64,
  C: 128,
  'C++': 29,
  Clipper: 19,
  'Cobol ANSI 85': 91,
  'Delphi 1': 29,
  Ensamblador: 119,
  'Ensamblador (Macro)': 213,
  Forth: 64,
  'Fortran 77': 105,
  'FoxPro 2.5': 34,
  Java: 53,
  'Modula 2': 80,
  Oracle: 40,
  'Oracle 2000': 23,
  Paradox: 36,
  Pascal: 91,
  'Pascal Turbo 5': 49,
  'Power Builder': 16,
  Prolog: 64,
  'Visual Basic 3': 32,
  'Visual C++': 34,
  'Visual Cobol': 20,
};

interface FormData {
  language: string;
  adjustmentFactor: number;
}

interface FunctionPointsFormProps {
  setLdcValue: (ldcValue: number) => void;
  setAdjustFactor: (adjustFactor: number) => void;
}

function FunctionPointsFormInner({
  setLdcValue,
  setAdjustFactor,
}: FunctionPointsFormProps) {
  const [selectedLanguage, setSelectedLanguage] = useState<string>('Default');
  const { watch } = useForm<FormData>();

  const handleLanguageChange = (e: ChangeEvent<HTMLSelectElement>) => {
    const newLanguage = e.target.value;
    setSelectedLanguage(newLanguage);
    setLdcValue(ldcValues[newLanguage]);
  };

  // Enviar valores iniciales al montar el componente
  useEffect(() => {
    setLdcValue(ldcValues[selectedLanguage]);
  }, [setLdcValue, selectedLanguage]);

  return (
    <div className="flex gap-4">
      <div>
        <div className="flex items-center justify-between mb-1">
          <Label>Lenguaje de programación</Label>
        </div>

        <select
          value={selectedLanguage}
          onChange={handleLanguageChange}
          className="w-full py-2 my-2 border rounded"
        >
          {Object.keys(ldcValues).map((language) => (
            <option key={language} value={language}>
              {language}{' '}
              {language !== 'Default' ? `(${ldcValues[language]} LOC/FP)` : ''}
            </option>
          ))}
        </select>
      </div>

      <FormField
        name="adjustmentFactor"
        rules={{
          required: 'Por favor ingresa un valor numérico',
          min: {
            value: 0.65,
            message: 'El factor de ajuste debe ser mayor o igual a 0.65',
          },
          max: {
            value: 1.35,
            message: 'El factor de ajuste debe ser menor o igual a 1.35',
          },
          validate: (value) => {
            const numValue = Number(value);
            if (isNaN(numValue)) {
              return 'Por favor ingresa un valor numérico válido';
            }
            return true;
          },
        }}
        render={({ field }) => (
          <div className="flex gap-4 items-center">
            <div>
              <Label>Factor de Ajuste (0.65 - 1.35)</Label>
              <Input
                type="number"
                step="0.01"
                min="0.65"
                max="1.35"
                placeholder="1.0"
                className="mt-2"
                {...field}
                onChange={(e) => {
                  let value = Number(e.target.value);

                  // Validar y limitar el valor dentro del rango
                  if (value < 0.65) {
                    value = 0.65;
                  } else if (value > 1.35) {
                    value = 1.35;
                  }

                  field.onChange(value);
                  setAdjustFactor(value);
                }}
              />
              <FormErrorMessage />
            </div>
            <Dialog>
              <DialogTrigger asChild>
                <Button variant="outline" size="sm" className="gap-2">
                  <HelpCircle className="h-4 w-4" />
                  Ayuda
                </Button>
              </DialogTrigger>
              <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
                <DialogHeader>
                  <DialogTitle className="flex items-center gap-2">
                    <BookOpen className="h-5 w-5" />
                    Guía de Puntos de Función
                  </DialogTitle>
                  <DialogDescription>
                    Aprende a medir el tamaño funcional de tu software paso a
                    paso
                  </DialogDescription>
                </DialogHeader>

                <div className="space-y-6 py-4">
                  {/* Introducción */}
                  <div className="bg-blue-50 p-4 rounded-lg border-l-4 border-blue-400">
                    <div className="flex items-start gap-3">
                      <Target className="h-5 w-5 text-blue-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-blue-900 mb-2">
                          ¿Qué miden los Puntos de Función?
                        </h3>
                        <p className="text-blue-800 text-sm">
                          Cuantifican el tamaño del software basándose en su
                          funcionalidad desde el punto de vista del usuario, sin
                          importar la tecnología empleada.
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Proceso de 4 pasos */}
                  <div>
                    <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                      <Calculator className="h-5 w-5" />
                      Proceso de Medición en 4 Etapas
                    </h3>

                    <div className="space-y-6">
                      {/* Paso 1 */}
                      <div className="border rounded-lg p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="bg-green-100 text-green-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                            1
                          </div>
                          <h4 className="font-semibold text-gray-800">
                            Identifica y Cuenta las Funciones del Usuario
                          </h4>
                        </div>
                        <p className="text-gray-600 mb-3 ml-11">
                          Examina tu aplicación y cuenta las funciones en estas
                          cinco categorías:
                        </p>

                        <div className="ml-11 space-y-3">
                          <div className="flex items-start gap-3">
                            <span className="bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium">
                              Entradas
                            </span>
                            <span className="text-sm text-gray-700">
                              Pantallas donde el usuario ingresa información que
                              altera datos (ejemplo: registro de cliente).
                            </span>
                          </div>

                          <div className="flex items-start gap-3">
                            <span className="bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-medium">
                              Salidas
                            </span>
                            <span className="text-sm text-gray-700">
                              Reportes o información procesada que el sistema
                              presenta (ejemplo: reporte de ventas mensuales).
                            </span>
                          </div>

                          <div className="flex items-start gap-3">
                            <span className="bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-medium">
                              Consultas
                            </span>
                            <span className="text-sm text-gray-700">
                              Búsquedas donde el usuario solicita información
                              sin modificarla (ejemplo: consultar datos de un
                              producto).
                            </span>
                          </div>

                          <div className="flex items-start gap-3">
                            <span className="bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-medium">
                              Archivos
                            </span>
                            <span className="text-sm text-gray-700">
                              Grupos lógicos de datos que la aplicación almacena
                              (ejemplo: base de datos de productos).
                            </span>
                          </div>

                          <div className="flex items-start gap-3">
                            <span className="bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium">
                              Interfaces
                            </span>
                            <span className="text-sm text-gray-700">
                              Información intercambiada con sistemas externos.
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Paso 2 */}
                      <div className="border rounded-lg p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="bg-yellow-100 text-yellow-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                            2
                          </div>
                          <h4 className="font-semibold text-gray-800">
                            Determina el Nivel de Complejidad
                          </h4>
                        </div>
                        <p className="text-gray-600 ml-11">
                          Clasifica cada función según su complejidad:
                          <span className="mx-1 px-2 py-0.5 bg-green-100 text-green-800 rounded text-sm">
                            Baja
                          </span>
                          ,
                          <span className="mx-1 px-2 py-0.5 bg-yellow-100 text-yellow-800 rounded text-sm">
                            Media
                          </span>{' '}
                          o
                          <span className="mx-1 px-2 py-0.5 bg-red-100 text-red-800 rounded text-sm">
                            Alta
                          </span>
                          según la cantidad de elementos de datos y archivos
                          involucrados.
                        </p>
                      </div>

                      {/* Paso 3 */}
                      <div className="border rounded-lg p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="bg-blue-100 text-blue-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                            3
                          </div>
                          <h4 className="font-semibold text-gray-800">
                            Aplica los Factores de Peso
                          </h4>
                        </div>
                        <p className="text-gray-600 ml-11">
                          Multiplica el número de funciones de cada nivel de
                          complejidad por su factor de peso correspondiente
                          (valores predefinidos en la tabla de pesos).
                        </p>
                      </div>

                      {/* Paso 4 */}
                      <div className="border rounded-lg p-4">
                        <div className="flex items-start gap-3 mb-3">
                          <div className="bg-purple-100 text-purple-800 rounded-full w-8 h-8 flex items-center justify-center font-bold text-sm">
                            4
                          </div>
                          <h4 className="font-semibold text-gray-800">
                            Calcula el Total
                          </h4>
                        </div>
                        <p className="text-gray-600 ml-11">
                          Suma todos los valores obtenidos para conseguir los
                          <span className="mx-1 px-2 py-0.5 bg-green-100 text-green-800 rounded text-sm font-medium">
                            Puntos de Función No Ajustados
                          </span>
                          .
                        </p>
                      </div>
                    </div>
                  </div>

                  {/* Factor de Ajuste */}
                  <div className="bg-green-50 p-4 rounded-lg border-l-4 border-green-400">
                    <div className="flex items-start gap-3">
                      <Target className="h-5 w-5 text-green-600 mt-0.5" />
                      <div>
                        <h3 className="font-semibold text-green-900 mb-2">
                          Factor de Ajuste Técnico
                        </h3>
                        <p className="text-green-800 text-sm">
                          Este multiplicador (rango: 0.65 - 1.35) refleja
                          características técnicas como complejidad de
                          comunicaciones, procesamiento distribuido, requisitos
                          de rendimiento, entre otros. El valor 1.0 representa
                          un ajuste neutro.
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
                          Recomendación para Principiantes
                        </h3>
                        <p className="text-amber-800 text-sm">
                          Si es tu primera experiencia con Puntos de Función,
                          enfócate en las funciones más evidentes para el
                          usuario final y utiliza complejidad "Media" como
                          referencia inicial mientras desarrollas experiencia en
                          la técnica.
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </DialogContent>
            </Dialog>
          </div>
        )}
      />
    </div>
  );
}

export default function FunctionPointsForm({
  setAdjustFactor,
  setLdcValue,
}: FunctionPointsFormProps) {
  const form = useForm<FormData>({
    defaultValues: {
      language: 'Default',
      adjustmentFactor: 1.0,
    },
    mode: 'onChange',
  });

  // Enviar el factor de ajuste inicial
  useEffect(() => {
    setAdjustFactor(1.0);
  }, [setAdjustFactor]);

  return (
    <FormProvider {...form}>
      <FunctionPointsFormInner
        setAdjustFactor={setAdjustFactor}
        setLdcValue={setLdcValue}
      />
    </FormProvider>
  );
}
