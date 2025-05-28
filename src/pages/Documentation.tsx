
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
          <h1 className="text-3xl font-bold mb-2">COCOMO Models Documentation</h1>
          <p className="text-muted-foreground max-w-3xl">
            Learn about the Constructive Cost Models (COCOMO) used for software project estimation.
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
                <CardTitle>COCOMO 81 Model</CardTitle>
                <CardDescription>
                  The original Constructive Cost Model developed by Barry Boehm in 1981
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-lg font-medium">Overview</h3>
                <p>
                  COCOMO (Constructive Cost Model) is a regression model based on lines of code (LOC), 
                  used to estimate the cost, effort, and schedule of software projects. It was developed by 
                  Barry Boehm in 1981 and is one of the most widely used software estimation models.
                </p>
                
                <h3 className="text-lg font-medium">Development Modes</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Organic Mode:</strong> Small teams with good experience working with less rigid requirements.
                  </li>
                  <li>
                    <strong>Semi-detached Mode:</strong> Medium teams with mixed experience working with a mix of rigid and less rigid requirements.
                  </li>
                  <li>
                    <strong>Embedded Mode:</strong> Projects developed within a set of tight constraints (hardware, software, operational, etc.).
                  </li>
                </ul>
                
                <h3 className="text-lg font-medium">Basic Formula</h3>
                <div className="bg-gray-100 p-4 rounded-md font-mono text-sm">
                  <p>Effort = a × (KLOC)<sup>b</sup></p>
                  <p>Time = c × (Effort)<sup>d</sup></p>
                  <p>Where a, b, c, d are constants based on the development mode</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="cocomo2" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>COCOMO II Model</CardTitle>
                <CardDescription>
                  An updated version of the COCOMO model to address software development practices of the 1990s and 2000s
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <h3 className="text-lg font-medium">Overview</h3>
                <p>
                  COCOMO II is an updated version of the original COCOMO model, designed to address software 
                  development practices in the 1990s and 2000s. It supports different approaches to software 
                  development, reuse-driven approaches, and the effects of software turmoil.
                </p>
                
                <h3 className="text-lg font-medium">Sub-models</h3>
                <ul className="list-disc pl-6 space-y-2">
                  <li>
                    <strong>Application Composition Model:</strong> Used for projects built with modern GUI builders.
                  </li>
                  <li>
                    <strong>Early Design Model:</strong> Used to explore architectural alternatives or incremental development strategies.
                  </li>
                  <li>
                    <strong>Post-Architecture Model:</strong> Used when the project is ready to develop and sustain a software product.
                  </li>
                </ul>
                
                <h3 className="text-lg font-medium">Scale Factors and Cost Drivers</h3>
                <p>
                  COCOMO II introduces scale factors that affect the exponent in the effort equation, 
                  and 17 cost drivers that multiply the nominal effort to calculate the actual effort.
                </p>
                
                <h3 className="text-lg font-medium">Basic Formula</h3>
                <div className="bg-gray-100 p-4 rounded-md font-mono text-sm">
                  <p>Effort = A × Size<sup>E</sup> × ∏EM<sub>i</sub></p>
                  <p>Where:</p>
                  <p>- A is a constant (2.94 for COCOMO II)</p>
                  <p>- E is an exponent derived from five scale factors</p>
                  <p>- ∏EM<sub>i</sub> is the product of 17 effort multipliers</p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </main>
    </div>
  );
}
