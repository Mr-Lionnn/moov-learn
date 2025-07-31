
import { useState } from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { useQuizManager } from "@/hooks/useQuizManager";
import { Quiz, QuizResult } from "@/types/quiz";
import EnhancedQuizResults from "./EnhancedQuizResults";
import QuizHeader from "./QuizHeader";
import QuizQuestion from "./QuizQuestion";
import QuizNavigation from "./QuizNavigation";
import { progressService } from "@/services/progressService";

interface QuizPlayerProps {
  quiz: Quiz;
  onComplete?: (result: QuizResult) => void;
  onContinue?: () => void;
  onExploreFormations?: () => void;
}

const QuizPlayer = ({ quiz, onComplete, onContinue, onExploreFormations }: QuizPlayerProps) => {
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
    console.log("Quiz submitted, result:", result);
    if (result) {
      // Save progress
      progressService.saveQuizResult(result);
      
      setQuizResult(result);
      setShowResult(true);
      console.log("Quiz results set, showResult:", true);
      if (onComplete) {
        onComplete(result);
      }
    } else {
      console.error("No quiz result generated");
    }
  };

  const handleRetryQuiz = () => {
    setShowResult(false);
    setQuizResult(null);
    setCurrentQuestionIndex(0);
    setSelectedAnswer(-1);
    startQuiz(quiz);
  };


  if (showResult && quizResult) {
    return (
      <EnhancedQuizResults
        result={quizResult}
        onRetry={handleRetryQuiz}
        onContinue={onContinue}
        onExploreFormations={onExploreFormations}
      />
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
        <QuizHeader
          title={currentQuiz.title}
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={currentQuiz.questions.length}
          progress={progress}
        />
      </CardHeader>
      
      <CardContent className="space-y-6">
        <QuizQuestion
          question={currentQuestion}
          questionIndex={currentQuestionIndex}
          selectedAnswer={selectedAnswer}
          onAnswerSelect={handleAnswerSelect}
        />
        
        <QuizNavigation
          currentQuestionIndex={currentQuestionIndex}
          totalQuestions={currentQuiz.questions.length}
          selectedAnswer={selectedAnswer}
          onPrevious={handlePreviousQuestion}
          onNext={handleNextQuestion}
          onSubmit={handleSubmitQuiz}
        />
      </CardContent>
    </Card>
  );
};

export default QuizPlayer;
