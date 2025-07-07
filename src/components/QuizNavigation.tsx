import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface QuizNavigationProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedAnswer: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
  onAbandon: () => void;
}

const QuizNavigation = ({ 
  currentQuestionIndex, 
  totalQuestions, 
  selectedAnswer, 
  onPrevious, 
  onNext, 
  onSubmit, 
  onAbandon 
}: QuizNavigationProps) => {
  const isLastQuestion = currentQuestionIndex === totalQuestions - 1;
  const isAnswerSelected = selectedAnswer !== -1;

  return (
    <div className="flex justify-between items-center">
      <Button
        variant="outline"
        onClick={onPrevious}
        disabled={currentQuestionIndex === 0}
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Précédent
      </Button>
      
      <Button variant="outline" onClick={onAbandon}>
        Abandonner
      </Button>
      
      {isLastQuestion ? (
        <Button
          onClick={onSubmit}
          disabled={!isAnswerSelected}
          className="moov-gradient text-white"
        >
          Terminer le Quiz
        </Button>
      ) : (
        <Button
          onClick={onNext}
          disabled={!isAnswerSelected}
          className="moov-gradient text-white"
        >
          Suivant
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      )}
    </div>
  );
};

export default QuizNavigation;