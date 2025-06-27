
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { 
  CheckCircle, 
  Clock, 
  AlertCircle, 
  ArrowRight, 
  ArrowLeft,
  Award
} from "lucide-react";
import { useQuizManager } from "@/hooks/useQuizManager";
import { Quiz, QuizResult } from "@/types/quiz";

interface QuizPlayerProps {
  quiz: Quiz;
  onComplete?: (result: QuizResult) => void;
  onAbandon?: () => void;
}

const QuizPlayer = ({ quiz, onComplete, onAbandon }: QuizPlayerProps) => {
  const { 
    currentQuiz, 
    quizAttempt, 
    isQuizActive, 
    startQuiz, 
    submitAnswer, 
    submitQuiz, 
    abandonQuiz 
  } = useQuizManager();
  
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number>(-1);
  const [showResult, setShowResult] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);

  // Start quiz if not active
  if (!isQuizActive && !showResult) {
    startQuiz(quiz);
  }

  const handleAnswerSelect = (answerIndex: number) => {
    setSelectedAnswer(answerIndex);
    submitAnswer(currentQuestionIndex, answerIndex);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedAnswer(quizAttempt?.answers[currentQuestionIndex + 1] || -1);
    }
  };

  const handlePreviousQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
      setSelectedAnswer(quizAttempt?.answers[currentQuestionIndex - 1] || -1);
    }
  };

  const handleSubmitQuiz = () => {
    const result = submitQuiz();
    if (result) {
      setQuizResult(result);
      setShowResult(true);
      if (onComplete) {
        onComplete(result);
      }
    }
  };

  const handleAbandonQuiz = () => {
    abandonQuiz();
    if (onAbandon) {
      onAbandon();
    }
  };

  if (showResult && quizResult) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {quizResult.passed ? (
              <Award className="h-16 w-16 text-green-500" />
            ) : (
              <AlertCircle className="h-16 w-16 text-red-500" />
            )}
          </div>
          <CardTitle className="text-2xl">
            {quizResult.passed ? "Félicitations!" : "Résultat"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="text-center space-y-2">
            <div className="text-3xl font-bold text-primary">
              {quizResult.percentage}%
            </div>
            <p className="text-gray-600">
              {quizResult.correctAnswers} sur {quizResult.totalQuestions} questions correctes
            </p>
            <Badge variant={quizResult.passed ? "default" : "destructive"} className="mt-2">
              {quizResult.passed ? "Réussi" : "Échoué"}
            </Badge>
          </div>
          
          <div className="space-y-4">
            <h3 className="font-semibold">Détails des réponses:</h3>
            {quizResult.feedback.map((feedback, index) => (
              <div key={feedback.questionId} className="border rounded-lg p-4">
                <div className="flex items-start gap-3">
                  {feedback.isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-500 mt-1 flex-shrink-0" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-red-500 mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <p className="font-medium">Question {index + 1}</p>
                    <p className="text-sm text-gray-600 mt-1">{feedback.explanation}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="flex gap-2 justify-center">
            <Button onClick={() => window.location.reload()} className="moov-gradient text-white">
              Recommencer
            </Button>
            <Button variant="outline" onClick={handleAbandonQuiz}>
              Fermer
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!currentQuiz || !quizAttempt) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardContent className="p-8 text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p>Chargement du quiz...</p>
        </CardContent>
      </Card>
    );
  }

  const currentQuestion = currentQuiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / currentQuiz.questions.length) * 100;

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{currentQuiz.title}</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            Question {currentQuestionIndex + 1}/{currentQuiz.questions.length}
          </Badge>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progression</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="space-y-4">
          <h3 className="text-lg font-medium">{currentQuestion.question}</h3>
          
          <RadioGroup
            value={selectedAnswer.toString()}
            onValueChange={(value) => handleAnswerSelect(parseInt(value))}
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label 
                  htmlFor={`option-${index}`} 
                  className="flex-1 cursor-pointer p-3 rounded-lg border hover:bg-gray-50"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
        
        <div className="flex justify-between items-center">
          <Button
            variant="outline"
            onClick={handlePreviousQuestion}
            disabled={currentQuestionIndex === 0}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Précédent
          </Button>
          
          <Button variant="outline" onClick={handleAbandonQuiz}>
            Abandonner
          </Button>
          
          {currentQuestionIndex === currentQuiz.questions.length - 1 ? (
            <Button
              onClick={handleSubmitQuiz}
              disabled={selectedAnswer === -1}
              className="moov-gradient text-white"
            >
              Terminer le Quiz
            </Button>
          ) : (
            <Button
              onClick={handleNextQuestion}
              disabled={selectedAnswer === -1}
              className="moov-gradient text-white"
            >
              Suivant
              <ArrowRight className="h-4 w-4 ml-2" />
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizPlayer;
