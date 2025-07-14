import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, BookOpen } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CompletionConfirmationProps {
  moduleTitle: string;
  onReturnHome: () => void;
  onStartNewTraining: () => void;
}

const CompletionConfirmation = ({ 
  moduleTitle, 
  onReturnHome, 
  onStartNewTraining 
}: CompletionConfirmationProps) => {
  const navigate = useNavigate();

  const handleReturnHome = () => {
    navigate("/");
    onReturnHome();
  };

  const handleStartNewTraining = () => {
    navigate("/");
    onStartNewTraining();
  };

  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <Card className="max-w-lg mx-auto">
        <CardHeader className="text-center">
          <div className="mx-auto mb-4 w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-xl">
            Félicitations !
          </CardTitle>
          <p className="text-muted-foreground">
            Votre évaluation a été enregistrée avec succès
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          <div className="text-center p-4 bg-gray-50 rounded-lg">
            <h3 className="font-medium">"{moduleTitle}"</h3>
            <p className="text-sm text-muted-foreground mt-1">
              Formation terminée
            </p>
          </div>

          <div className="text-center text-sm text-muted-foreground">
            Merci d'avoir pris le temps de nous faire part de vos commentaires. 
            Votre avis nous aide à améliorer continuellement nos formations.
          </div>

          <div className="space-y-3">
            <Button
              onClick={handleReturnHome}
              className="w-full moov-gradient text-white"
            >
              <Home className="h-4 w-4 mr-2" />
              Retour à l'accueil
            </Button>
            
            <Button
              onClick={handleStartNewTraining}
              variant="outline"
              className="w-full"
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Commencer une nouvelle formation
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompletionConfirmation;