
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  CheckCircle, 
  XCircle, 
  Award, 
  RefreshCw,
  ArrowRight 
} from "lucide-react";
import { QuizResult } from "@/types/quiz";

interface EnhancedQuizResultsProps {
  result: QuizResult;
  onRetry?: () => void;
  onContinue?: () => void;
  onExploreFormations?: () => void;
}

const EnhancedQuizResults = ({ result, onRetry, onContinue, onExploreFormations }: EnhancedQuizResultsProps) => {
  const { percentage, passed, correctAnswers, totalQuestions, feedback } = result;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader className="text-center">
        <div className="flex justify-center mb-4">
          {passed ? (
            <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center">
              <Award className="h-8 w-8 text-green-600" />
            </div>
          ) : (
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center">
              <XCircle className="h-8 w-8 text-red-600" />
            </div>
          )}
        </div>
        
        <CardTitle className="text-2xl mb-2">
          {passed ? "Félicitations !" : "Quiz non réussi"}
        </CardTitle>
        
        <div className="space-y-2">
          <div className="text-3xl font-bold text-primary">
            {percentage}%
          </div>
          <Progress value={percentage} className="h-3" />
          <p className="text-gray-600">
            {correctAnswers} sur {totalQuestions} réponses correctes
          </p>
        </div>
        
        <Badge variant={passed ? "default" : "outline"} className="mt-4">
          {passed ? "Réussi" : "Échec"} - Note de passage: {result.quiz.passingGrade}%
        </Badge>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="font-semibold text-lg">Détails des réponses</h3>
          
          {feedback.map((item, index) => (
            <div key={item.questionId} className="border rounded-lg p-4">
              <div className="flex items-start gap-3">
                {item.isCorrect ? (
                  <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                ) : (
                  <XCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                )}
                
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <span className="font-medium">Question {index + 1}</span>
                    <Badge variant={item.isCorrect ? "default" : "destructive"}>
                      {item.isCorrect ? "Correct" : "Incorrect"}
                    </Badge>
                  </div>
                  
                  <p className="text-sm text-gray-700 mb-2">
                    {item.explanation}
                  </p>
                  
                  {!item.isCorrect && (
                    <div className="text-sm">
                      <p className="text-red-600">
                        Votre réponse: Réponse {item.userAnswer + 1} - {result.quiz.questions.find(q => q.id === item.questionId)?.options[item.userAnswer]}
                      </p>
                      <p className="text-green-600">
                        Bonne réponse: Réponse {item.correctAnswer + 1} - {result.quiz.questions.find(q => q.id === item.questionId)?.options[item.correctAnswer]}
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
        
        <div className="flex flex-col gap-3 items-center">
          <div className="flex gap-3">
            {onRetry && (
              <Button variant="outline" onClick={onRetry}>
                <RefreshCw className="h-4 w-4 mr-2" />
                Recommencer
              </Button>
            )}
            
            {onContinue && passed && (
              <Button onClick={onContinue} className="moov-gradient text-white">
                Continuer
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            )}
          </div>
          
          {onExploreFormations && (
            <Button 
              variant="secondary" 
              onClick={onExploreFormations}
              className="w-full max-w-md"
            >
              Souhaitez-vous explorer d'autres formations ?
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default EnhancedQuizResults;
