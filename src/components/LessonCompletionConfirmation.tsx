import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, Home, BookOpen } from "lucide-react";

interface LessonCompletionConfirmationProps {
  moduleTitle: string;
  onReturnHome: () => void;
  onStartNewTraining: () => void;
}

const LessonCompletionConfirmation = ({
  moduleTitle,
  onReturnHome,
  onStartNewTraining,
}: LessonCompletionConfirmationProps) => {
  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4 mx-auto">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-foreground">
            Module Terminé !
          </CardTitle>
          <CardDescription>
            Félicitations ! Vous avez terminé le module "{moduleTitle}" avec succès.
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          <Button
            onClick={onReturnHome}
            variant="default"
            size="lg"
            className="w-full flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Retour à l'accueil
          </Button>
          
          <Button
            onClick={onStartNewTraining}
            variant="outline"
            size="lg"
            className="w-full flex items-center gap-2"
          >
            <BookOpen className="h-4 w-4" />
            Commencer une nouvelle formation
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default LessonCompletionConfirmation;