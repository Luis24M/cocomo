import { useState } from "react";
import Header from "@/components/Header";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export default function Documentation() {
  const [activeTab, setActiveTab] = useState("cocomo81");
  
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="container max-w-4xl mx-auto py-8 px-4">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Documentación de Modelos COCOMO</h1>
          <p className="text-muted-foreground max-w-3xl">
            Aprende sobre los Modelos Constructivos de Coste (COCOMO) utilizados para la estimación de proyectos de software.
          </p>
        </div>
        
        <Tabs defaultValue="cocomo81" onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="cocomo81">COCOMO 81</TabsTrigger>
            <TabsTrigger value="cocomo2">COCOMO II</TabsTrigger>
          </TabsList>
          
          <TabsContent value="cocomo81" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Modelo COCOMO 81</CardTitle>
                <CardDescription>
                  El modelo constructivo original desarrollado por Barry Boehm en 1981
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-lg font-medium">Resumen</h3>
                <p>
                  COCOMO (Constructive Cost Model) es un modelo de regresión basado en líneas de código (LOC), 
                  utilizado para estimar el coste, esfuerzo y cronograma de proyectos de software. Fue desarrollado 
                  por Barry Boehm en 1981 y es uno de los modelos de estimación de software más utilizados.
                </p>
                
                <h3 className="text-lg font-medium">Modos de Desarrollo</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Modo Orgánico:</strong> Equipos pequeños con buena experiencia trabajando con requisitos poco rígidos.
                  </li>
                  <li>
                    <strong>Modo Semi-acoplado:</strong> Equipos medianos con experiencia mixta trabajando con una mezcla de requisitos rígidos y flexibles.
                  </li>
                  <li>
                    <strong>Modo Empotrado:</strong> Proyectos desarrollados con un conjunto de restricciones estrictas (hardware, software, operativas, etc.).
                  </li>
                </ul>
                
                <h3 className="text-lg font-medium">Fórmula Básica</h3>
                <div className="bg-gray-100 p-4 rounded-md font-mono text-sm">
                  <p>Esfuerzo = a × (KLOC)<sup>b</sup></p>
                  <p>Tiempo = c × (Esfuerzo)<sup>d</sup></p>
                  <p>Donde a, b, c, d son constantes según el modo de desarrollo</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cocomo2" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Modelo COCOMO II</CardTitle>
                <CardDescription>
                  Una versión actualizada del modelo COCOMO que aborda las prácticas de desarrollo de software de los años 90 y 2000
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-lg font-medium">Resumen</h3>
                <p>
                  COCOMO II es una versión actualizada del modelo COCOMO original, diseñada para abordar las prácticas 
                  de desarrollo de software en los años 90 y 2000. Soporta diferentes enfoques de desarrollo, 
                  desarrollo orientado a reutilización y los efectos del cambio constante en el software.
                </p>
                
                <h3 className="text-lg font-medium">Submodelos</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Modelo de Composición de Aplicaciones:</strong> Utilizado para proyectos construidos con herramientas modernas de interfaces gráficas.
                  </li>
                  <li>
                    <strong>Modelo de Diseño Temprano:</strong> Utilizado para explorar alternativas arquitectónicas o estrategias de desarrollo incremental.
                  </li>
                  <li>
                    <strong>Modelo Post-Arquitectura:</strong> Utilizado cuando el proyecto ya está listo para desarrollar y mantener un producto de software.
                  </li>
                </ul>
                
                <h3 className="text-lg font-medium">Factores de Escala y Multiplicadores de Esfuerzo</h3>
                <p>
                  COCOMO II introduce factores de escala que afectan el exponente en la ecuación del esfuerzo, 
                  y 17 multiplicadores de esfuerzo que modifican el esfuerzo nominal para calcular el esfuerzo real.
                </p>
                
                <h3 className="text-lg font-medium">Fórmula Básica</h3>
                <div className="bg-gray-100 p-4 rounded-md font-mono text-sm">
                  <p>Esfuerzo = A × Tamaño<sup>E</sup> × ∏EM<sub>i</sub></p>
                  <p>Donde:</p>
                  <p>- A es una constante (2.94 para COCOMO II)</p>
                  <p>- E es un exponente derivado de cinco factores de escala</p>
                  <p>- ∏EM<sub>i</sub> es el producto de 17 multiplicadores de esfuerzo</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
