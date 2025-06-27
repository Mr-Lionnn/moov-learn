
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { Clock, AlertTriangle, CheckCircle, XCircle } from "lucide-react";
import { Quiz, QuizResult } from "@/types/quiz";
import { useQuizManager } from "@/hooks/useQuizManager";

interface QuizInterfaceProps {
  quiz: Quiz;
  onComplete: (result: QuizResult) => void;
  onAbandon: () => void;
}

const QuizInterface = ({ quiz, onComplete, onAbandon }: QuizInterfaceProps) => {
  const { quizAttempt, submitAnswer, submitQuiz } = useQuizManager();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState((quiz.timeLimit || 30) * 60);
  const [showConfirmSubmit, setShowConfirmSubmit] = useState(false);

  const currentQuestion = quiz.questions[currentQuestionIndex];
  const progress = ((currentQuestionIndex + 1) / quiz.questions.length) * 100;
  const selectedAnswer = quizAttempt?.answers[currentQuestionIndex] ?? -1;

  useEffect(() => {
    if (timeRemaining <= 0) {
      handleSubmitQuiz();
      return;
    }

    const timer = setInterval(() => {
      setTimeRemaining(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleAnswerSelect = (answerIndex: number) => {
    submitAnswer(currentQuestionIndex, answerIndex);
  };

  const handleNext = () => {
    if (currentQuestionIndex < quiz.questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setShowConfirmSubmit(true);
    }
  };

  const handlePrevious = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  const handleSubmitQuiz = () => {
    const result = submitQuiz();
    if (result) {
      onComplete(result);
    }
  };

  const isAnswerComplete = selectedAnswer !== -1;
  const allQuestionsAnswered = quizAttempt?.answers.every(answer => answer !== -1) ?? false;

  if (showConfirmSubmit) {
    return (
      <Card className="max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle className="text-center">Confirmer la Soumission</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Alert>
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>
              Vous êtes sur le point de soumettre votre quiz. Cette action est irréversible.
            </AlertDescription>
          </Alert>

          <div className="space-y-2">
            <p className="text-center">
              <strong>Questions répondues:</strong> {quizAttempt?.answers.filter(a => a !== -1).length} / {quiz.questions.length}
            </p>
            <p className="text-center">
              <strong>Temps restant:</strong> {formatTime(timeRemaining)}
            </p>
            <p className="text-center">
              <strong>Note de passage requise:</strong> {quiz.passingGrade}%
            </p>
          </div>

          <div className="flex gap-4 justify-center">
            <Button
              variant="outline"
              onClick={() => setShowConfirmSubmit(false)}
            >
              Continuer le Quiz
            </Button>
            <Button
              onClick={handleSubmitQuiz}
              className="bg-primary text-white"
            >
              Soumettre le Quiz
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="max-w-4xl mx-auto">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{quiz.title}</CardTitle>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 text-sm ${
              timeRemaining < 300 ? 'text-red-600' : 'text-gray-600'
            }`}>
              <Clock className="h-4 w-4" />
              <span>{formatTime(timeRemaining)}</span>
            </div>
            <Badge variant="outline">
              {currentQuestionIndex + 1} / {quiz.questions.length}
            </Badge>
          </div>
        </div>
        <Progress value={progress} className="h-2" />
      </CardHeader>

      <CardContent className="space-y-6">
        {timeRemaining < 300 && (
          <Alert className="border-red-200 bg-red-50">
            <Clock className="h-4 w-4 text-red-600" />
            <AlertDescription className="text-red-700">
              Attention! Il vous reste moins de 5 minutes pour terminer le quiz.
            </AlertDescription>
          </Alert>
        )}

        <div>
          <div className="mb-4">
            <Badge variant="secondary" className="mb-2">
              Question {currentQuestionIndex + 1}
            </Badge>
            <Badge variant="outline" className="ml-2">
              {currentQuestion.difficulty === 'easy' ? 'Facile' : 
               currentQuestion.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
            </Badge>
          </div>

          <h3 className="text-lg font-semibold mb-6">
            {currentQuestion.question}
          </h3>

          <RadioGroup
            value={selectedAnswer.toString()}
            onValueChange={(value) => handleAnswerSelect(parseInt(value))}
          >
            {currentQuestion.options.map((option, index) => (
              <div key={index} className="flex items-center space-x-2 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                <RadioGroupItem value={index.toString()} id={`option-${index}`} />
                <Label 
                  htmlFor={`option-${index}`} 
                  className="flex-1 cursor-pointer text-sm leading-relaxed"
                >
                  {option}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>

        <div className="flex justify-between items-center">
          <div className="flex gap-2">
            <Button 
              variant="outline" 
              onClick={handlePrevious}
              disabled={currentQuestionIndex === 0}
            >
              Précédent
            </Button>
            <Button 
              variant="ghost" 
              onClick={onAbandon}
              className="text-red-600 hover:text-red-700"
            >
              Abandonner
            </Button>
          </div>
          
          <Button 
            onClick={handleNext}
            disabled={!isAnswerComplete}
            className="bg-primary text-white"
          >
            {currentQuestionIndex === quiz.questions.length - 1 ? 'Terminer' : 'Suivant'}
          </Button>
        </div>

        <div className="mt-4 p-3 bg-gray-50 rounded-lg">
          <p className="text-sm text-gray-600">
            Progression: {quizAttempt?.answers.filter(a => a !== -1).length || 0} / {quiz.questions.length} questions répondues
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default QuizInterface;
