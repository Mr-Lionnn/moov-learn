import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { QuizQuestion as QuizQuestionType } from "@/types/quiz";

interface QuizQuestionProps {
  question: QuizQuestionType;
  questionIndex: number;
  selectedAnswer: number;
  onAnswerSelect: (answerIndex: number) => void;
}

const QuizQuestion = ({ question, questionIndex, selectedAnswer, onAnswerSelect }: QuizQuestionProps) => {
  return (
    <div className="space-y-4">
      <div className="flex items-center gap-2 mb-4">
        <Badge variant="secondary">
          Question {questionIndex + 1}
        </Badge>
        <Badge variant="outline">
          {question.difficulty === 'easy' ? 'Facile' : 
           question.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
        </Badge>
      </div>
      
      <h3 className="text-lg font-medium">{question.question}</h3>
      
      <RadioGroup
        value={selectedAnswer.toString()}
        onValueChange={(value) => onAnswerSelect(parseInt(value))}
      >
        {question.options.map((option, index) => (
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
  );
};

export default QuizQuestion;