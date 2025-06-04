
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ModelCardProps {
  title: string;
  description: string;
  imageUrl: string;
  modelType: "cocomo81" | "cocomo2";
}

export default function ModelCard({ title, description, imageUrl, modelType }: ModelCardProps) {
  return (
    <Card className="card-hover overflow-hidden">
      {/* <div 
        className="h-32 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      /> */}
        <Link to={`/calculator/${modelType}`}>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {modelType === "cocomo81" ? (
          <p>
            El modelo COCOMO original para la estimación de costos de software. Ideal para proyectos pequeños y medianos con procesos de desarrollo estándar.
          </p>
        ) : (
          <p>
            La versión mejorada con parámetros adicionales para el desarrollo de software moderno. Ideal para proyectos complejos con diversas metodologías de desarrollo.
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
        </Button>
      </CardFooter>
          </Link>
    </Card>
  );
}
