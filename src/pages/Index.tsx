
import Header from "@/components/Header";
import ModelCard from "@/components/ModelCard";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function Index() {
  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <main className="container max-w-4xl mx-auto py-8 px-4">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-2">COCOMO Estimation Models</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Professional software cost estimation using industry-standard COCOMO models.
            Select a model to begin your estimation.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ModelCard
            title="COCOMO 81"
            description="The original software cost estimation model"
            imageUrl="/placeholder.svg"
            modelType="cocomo81"
          />
          <ModelCard
            title="COCOMO II"
            description="Enhanced model for modern software projects"
            imageUrl="/placeholder.svg"
            modelType="cocomo2"
          />
        </div>
      </main>
    </div>
  );
}
