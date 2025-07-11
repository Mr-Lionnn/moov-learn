
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CheckCircle, Home, BookOpen, Star, Trophy } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface CompletionConfirmationProps {
  moduleTitle: string;
  completionScore?: number;
  userRating?: number;
  onClose?: () => void;
}

const CompletionConfirmation = ({ 
  moduleTitle, 
  completionScore, 
  userRating,
  onClose 
}: CompletionConfirmationProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [isAnimating, setIsAnimating] = useState(true);

  const handleReturnHome = () => {
    navigate("/");
    if (onClose) onClose();
  };

  const handleStartNewTraining = () => {
    navigate("/my-trainings");
    if (onClose) onClose();
  };

  const getCompletionMessage = () => {
    if (completionScore && completionScore >= 80) {
      return "Excellent travail !";
    } else if (completionScore && completionScore >= 60) {
      return "Bon travail !";
    }
    return "Formation terminée !";
  };

  const getScoreColor = () => {
    if (completionScore && completionScore >= 80) {
      return "text-green-600";
    } else if (completionScore && completionScore >= 60) {
      return "text-yellow-600";
    }
    return "text-blue-600";
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className={`max-w-2xl w-full mx-auto transform transition-all duration-500 ${
        isAnimating ? 'scale-95 opacity-0' : 'scale-100 opacity-100'
      }`}>
        <CardHeader className="text-center pb-4">
          <div className="flex justify-center mb-4">
            <div className="relative">
              <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center animate-pulse">
                <CheckCircle className="h-12 w-12 text-green-600" />
              </div>
              {completionScore && completionScore >= 80 && (
                <div className="absolute -top-2 -right-2 w-8 h-8 bg-yellow-100 rounded-full flex items-center justify-center">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                </div>
              )}
            </div>
          </div>
          <CardTitle className="text-2xl font-bold text-gray-900 mb-2">
            {getCompletionMessage()}
          </CardTitle>
          <p className="text-gray-600">
            Votre feedback a été enregistré avec succès
          </p>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Module Summary */}
          <div className="text-center p-6 bg-gradient-to-r from-blue-50 to-green-50 rounded-lg">
            <h3 className="font-semibold text-lg text-gray-900 mb-2">
              {moduleTitle}
            </h3>
            
            <div className="flex justify-center items-center gap-6 mt-4">
              {completionScore && (
                <div className="text-center">
                  <p className={`text-3xl font-bold ${getScoreColor()}`}>
                    {completionScore}%
                  </p>
                  <p className="text-sm text-gray-600">Score Final</p>
                </div>
              )}
              
              {userRating && (
                <div className="text-center">
                  <div className="flex justify-center gap-1 mb-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Star
                        key={star}
                        className={`h-5 w-5 ${
                          star <= userRating
                            ? 'fill-yellow-400 text-yellow-400'
                            : 'text-gray-300'
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600">Votre Évaluation</p>
                </div>
              )}
            </div>
          </div>

          {/* Thank You Message */}
          <div className="text-center py-4">
            <h4 className="font-medium text-gray-900 mb-2">
              Merci pour votre participation !
            </h4>
            <p className="text-sm text-gray-600">
              Vos commentaires nous aident à améliorer continuellement nos formations.
              {user?.name && ` Continuez votre excellent travail, ${user.name} !`}
            </p>
          </div>

          {/* Action Buttons */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-6 border-t">
            <Button
              onClick={handleReturnHome}
              variant="outline"
              className="flex items-center justify-center gap-2 h-12"
            >
              <Home className="h-5 w-5" />
              Retour à l'accueil
            </Button>
            
            <Button
              onClick={handleStartNewTraining}
              className="flex items-center justify-center gap-2 h-12 moov-gradient text-white"
            >
              <BookOpen className="h-5 w-5" />
              Commencer une nouvelle formation
            </Button>
          </div>

          {/* Progress Indicator */}
          <div className="text-center pt-4">
            <p className="text-xs text-gray-500">
              Formation terminée • Feedback enregistré • Progression sauvegardée
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CompletionConfirmation;
