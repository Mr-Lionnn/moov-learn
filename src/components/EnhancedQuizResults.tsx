
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { 
  Trophy, 
  Target, 
  TrendingUp, 
  CheckCircle, 
  XCircle, 
  AlertCircle,
  Award,
  BookOpen
} from "lucide-react";
import { QuizResult } from "@/types/quiz";

interface EnhancedQuizResultsProps {
  result: QuizResult;
  onRetry: () => void;
  onContinue: () => void;
}

const EnhancedQuizResults = ({ result, onRetry, onContinue }: EnhancedQuizResultsProps) => {
  const getGradeClassification = (percentage: number) => {
    if (percentage >= 90) return { grade: 'A', label: 'Excellent', color: 'bg-green-500' };
    if (percentage >= 80) return { grade: 'B', label: 'Très Bien', color: 'bg-blue-500' };
    if (percentage >= 70) return { grade: 'C', label: 'Bien', color: 'bg-yellow-500' };
    if (percentage >= 60) return { grade: 'D', label: 'Passable', color: 'bg-orange-500' };
    return { grade: 'F', label: 'Insuffisant', color: 'bg-red-500' };
  };

  const getPerformanceInsights = () => {
    const insights = [];
    const { percentage, feedback } = result;
    
    if (percentage >= 90) {
      insights.push("Excellente maîtrise du sujet !");
    } else if (percentage >= 70) {
      insights.push("Bonne compréhension générale.");
    } else {
      insights.push("Des révisions sont recommandées.");
    }
    
    const difficultyStats = feedback.reduce((acc, item, index) => {
      const difficulty = result.quiz.questions[index].difficulty;
      if (!acc[difficulty]) acc[difficulty] = { correct: 0, total: 0 };
      acc[difficulty].total++;
      if (item.isCorrect) acc[difficulty].correct++;
      return acc;
    }, {} as any);
    
    Object.entries(difficultyStats).forEach(([difficulty, stats]: [string, any]) => {
      const rate = (stats.correct / stats.total) * 100;
      if (rate < 50) {
        insights.push(`Attention aux questions ${difficulty === 'easy' ? 'faciles' : difficulty === 'medium' ? 'moyennes' : 'difficiles'}.`);
      }
    });
    
    return insights;
  };

  const gradeInfo = getGradeClassification(result.percentage);
  const insights = getPerformanceInsights();

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Overall Results */}
      <Card>
        <CardHeader className="text-center">
          <div className="flex justify-center mb-4">
            {result.passed ? (
              <div className="p-4 bg-green-100 rounded-full">
                <Trophy className="h-12 w-12 text-green-600" />
              </div>
            ) : (
              <div className="p-4 bg-red-100 rounded-full">
                <Target className="h-12 w-12 text-red-600" />
              </div>
            )}
          </div>
          <CardTitle className="text-2xl">
            {result.passed ? "Félicitations !" : "Continuez vos efforts !"}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center">
              <div className={`inline-flex items-center justify-center w-16 h-16 rounded-full ${gradeInfo.color} text-white text-2xl font-bold mb-2`}>
                {gradeInfo.grade}
              </div>
              <p className="text-sm text-gray-600">{gradeInfo.label}</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {result.percentage}%
              </div>
              <p className="text-sm text-gray-600">Score Final</p>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-primary mb-2">
                {result.correctAnswers}/{result.totalQuestions}
              </div>
              <p className="text-sm text-gray-600">Réponses Correctes</p>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span>Progression</span>
              <span>{result.percentage}%</span>
            </div>
            <Progress value={result.percentage} className="h-3" />
          </div>
          
          <Badge 
            variant={result.passed ? "default" : "destructive"} 
            className="w-full justify-center py-2"
          >
            {result.passed ? "Quiz Réussi" : "Quiz Non Réussi"} 
            - Note de passage: {result.quiz.passingGrade}%
          </Badge>
        </CardContent>
      </Card>

      {/* Performance Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Analyse de Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {insights.map((insight, index) => (
              <div key={index} className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
                <AlertCircle className="h-4 w-4 text-blue-600" />
                <span className="text-sm text-blue-800">{insight}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Detailed Feedback */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Révision Détaillée
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {result.feedback.map((feedback, index) => {
            const question = result.quiz.questions[index];
            return (
              <div 
                key={feedback.questionId} 
                className={`border rounded-lg p-4 ${
                  feedback.isCorrect ? 'border-green-200 bg-green-50' : 'border-red-200 bg-red-50'
                }`}
              >
                <div className="flex items-start gap-3">
                  {feedback.isCorrect ? (
                    <CheckCircle className="h-5 w-5 text-green-600 mt-1 flex-shrink-0" />
                  ) : (
                    <XCircle className="h-5 w-5 text-red-600 mt-1 flex-shrink-0" />
                  )}
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <h4 className="font-medium">Question {index + 1}</h4>
                      <Badge variant="outline" className="text-xs">
                        {question.difficulty === 'easy' ? 'Facile' : 
                         question.difficulty === 'medium' ? 'Moyen' : 'Difficile'}
                      </Badge>
                    </div>
                    <p className="text-sm mb-3">{question.question}</p>
                    
                    <div className="space-y-2 text-sm">
                      <div>
                        <span className="font-medium">Votre réponse: </span>
                        <span className={feedback.isCorrect ? 'text-green-700' : 'text-red-700'}>
                          {question.options[feedback.userAnswer] || 'Non répondu'}
                        </span>
                      </div>
                      {!feedback.isCorrect && (
                        <div>
                          <span className="font-medium">Réponse correcte: </span>
                          <span className="text-green-700">
                            {question.options[feedback.correctAnswer]}
                          </span>
                        </div>
                      )}
                      <div className="mt-2 p-2 bg-white rounded border-l-4 border-blue-500">
                        <span className="font-medium text-blue-800">Explication: </span>
                        <span className="text-gray-700">{feedback.explanation}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Actions */}
      <Card>
        <CardContent className="p-6">
          <div className="flex gap-4 justify-center">
            <Button onClick={onRetry} variant="outline" className="flex items-center gap-2">
              <Target className="h-4 w-4" />
              Reprendre le Quiz
            </Button>
            <Button onClick={onContinue} className="moov-gradient text-white flex items-center gap-2">
              <Award className="h-4 w-4" />
              Continuer l'Apprentissage
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default EnhancedQuizResults;
