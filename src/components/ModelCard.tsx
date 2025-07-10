
import { Link } from "react-router-dom";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface ModelCardProps {
  title: string;
  description: string;
  imageUrl: string;
  modelType?: "cocomo81" | "cocomo2" | "functionpoints" | "usecasepoints";
  intro?: string;
}

export default function ModelCard({ title, description, imageUrl, modelType, intro }: ModelCardProps) {
  return (
    <Card className="card-hover overflow-hidden h-full drop-shadow-md hover:shadow-black ">
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
        {intro ? (
          <p className="mb-2">{intro}</p>
        ) : (
          <p className="mb-2">Selecciona este modelo para comenzar tu estimación.</p>
        )}
        <p className="text-xs text-gray-500">Haz clic para comenzar</p>
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
        </Button>
      </CardFooter>
          </Link>
    </Card>
  );
}
