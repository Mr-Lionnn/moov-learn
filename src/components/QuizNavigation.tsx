import { Button } from "@/components/ui/button";
import { ArrowLeft, ArrowRight } from "lucide-react";

interface QuizNavigationProps {
  currentQuestionIndex: number;
  totalQuestions: number;
  selectedAnswer: number;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const QuizNavigation = ({ 
  currentQuestionIndex, 
  totalQuestions, 
  selectedAnswer, 
  onPrevious, 
  onNext, 
  onSubmit 
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
      
      {isLastQuestion ? (
        <Button
          onClick={onSubmit}
          disabled={!isAnswerSelected}
          className="moov-gradient text-white ml-auto"
        >
          Terminer le Quiz
        </Button>
      ) : (
        <Button
          onClick={onNext}
          disabled={!isAnswerSelected}
          className="moov-gradient text-white ml-auto"
        >
          Suivant
          <ArrowRight className="h-4 w-4 ml-2" />
        </Button>
      )}
    </div>
  );
};

export default QuizNavigation;