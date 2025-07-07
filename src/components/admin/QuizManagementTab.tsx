import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Plus } from "lucide-react";
import { FailedAttempt, QuestionAnalytic } from "@/types/admin";

interface QuizManagementTabProps {
  failedAttempts: FailedAttempt[];
  questionAnalytics: QuestionAnalytic[];
  onCreateQuiz: () => void;
}

const QuizManagementTab = ({ failedAttempts, questionAnalytics, onCreateQuiz }: QuizManagementTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Gestion des Quiz</CardTitle>
          <CardDescription>
            Créez et gérez les évaluations obligatoires
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <Button onClick={onCreateQuiz}>
            <Plus className="h-4 w-4 mr-2" />
            Créer un Quiz
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Échecs aux Quiz - Suivi Requis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {failedAttempts.map((attempt, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-lg bg-red-50">
                <div>
                  <h4 className="font-medium text-red-800">{attempt.user}</h4>
                  <p className="text-sm text-red-600">{attempt.quiz} • Score: {attempt.score}% • {attempt.attempts} tentatives</p>
                </div>
                <div className="flex gap-2">
                  <Badge className="bg-red-100 text-red-800">Échec</Badge>
                  <Button size="sm" variant="outline">Programmer un Suivi</Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Analyse des Questions</CardTitle>
          <CardDescription>Questions avec taux d'échec élevé nécessitant révision</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {questionAnalytics.map((q, index) => (
              <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                <div className="flex-1">
                  <h4 className="font-medium">{q.question}</h4>
                  <p className="text-sm text-gray-600">{q.totalAttempts} tentatives totales</p>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-24">
                    <Progress value={q.correctRate} className="h-2" />
                  </div>
                  <Badge className={q.correctRate < 60 ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}>
                    {q.correctRate}%
                  </Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default QuizManagementTab;