
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
      <div 
        className="h-32 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      <CardHeader>
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      <CardContent className="text-sm text-muted-foreground">
        {modelType === "cocomo81" ? (
          <p>
            The original COCOMO model for software cost estimation. Best for small to medium-sized projects with standard development processes.
          </p>
        ) : (
          <p>
            The enhanced version with additional parameters for modern software development. Suitable for complex projects with varied development methodologies.
          </p>
        )}
      </CardContent>
      <CardFooter>
        <Button asChild className="w-full">
          <Link to={`/calculator/${modelType}`}>Select Model</Link>
        </Button>
      </CardFooter>
    </Card>
  );
}
