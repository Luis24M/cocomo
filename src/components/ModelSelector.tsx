
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { FileText } from "lucide-react";

interface ModelSelectorProps {
  modelType: string | undefined;
}

export default function ModelSelector({ modelType }: ModelSelectorProps) {
  const navigate = useNavigate();
  
  return (
    <div className="mt-4 flex justify-between items-center">
      <Button 
        variant="outline" 
        size="sm" 
        className="gap-2"
        onClick={() => navigate("/documentation")}
      >
        <FileText className="h-4 w-4" />
        Documentation
      </Button>
      <Button variant="outline" size="sm" onClick={() => navigate("/")}>
        Change Model
      </Button>
    </div>
  );
}
