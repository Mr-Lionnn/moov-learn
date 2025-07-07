import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Clock } from "lucide-react";

interface QuizHeaderProps {
  title: string;
  currentQuestionIndex: number;
  totalQuestions: number;
  progress: number;
}

const QuizHeader = ({ title, currentQuestionIndex, totalQuestions, progress }: QuizHeaderProps) => {
  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{title}</h2>
        <Badge variant="outline" className="flex items-center gap-1">
          <Clock className="h-3 w-3" />
          Question {currentQuestionIndex + 1}/{totalQuestions}
        </Badge>
      </div>
      <div className="space-y-2 mt-4">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Progression</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
      </div>
    </div>
  );
};

export default QuizHeader;