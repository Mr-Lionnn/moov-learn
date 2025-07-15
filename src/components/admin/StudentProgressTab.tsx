import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { AlertTriangle } from "lucide-react";
import { StudentProgress } from "@/types/admin";

interface StudentProgressTabProps {
  studentProgress: StudentProgress[];
}

const StudentProgressTab = ({ studentProgress }: StudentProgressTabProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Suivi des Progrès des Employés</CardTitle>
          <CardDescription>
            Surveillez les performances et les progrès de tous les tudia , incluant les résultats aux quiz
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {studentProgress.map((student) => (
              <div key={student.id} className={`flex items-center justify-between p-4 border rounded-lg ${student.needsFollowup ? 'border-orange-200 bg-orange-50' : ''}`}>
                <div className="flex items-center gap-4">
                  <Avatar>
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>
                      {student.name.split(' ').map(n => n[0]).join('')}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <h4 className="font-medium">{student.name}</h4>
                    <p className="text-sm text-gray-600">{student.email}</p>
                  </div>
                </div>
                
                <div className="flex items-center gap-6">
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Cours Inscrits</p>
                    <Badge variant="outline">{student.coursesEnrolled}</Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Quiz Réussis</p>
                    <Badge className="bg-green-100 text-green-800">{student.quizzesPassed}</Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Dernier Quiz</p>
                    <Badge className={student.lastQuizScore >= 70 ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                      {student.lastQuizScore}%
                    </Badge>
                  </div>
                  <div className="text-center">
                    <p className="text-sm text-gray-600">Score Moyen</p>
                    <span className="text-sm font-medium">{student.avgScore}%</span>
                  </div>
                  {student.needsFollowup && (
                    <Button size="sm" className="bg-orange-500 text-white">
                      <AlertTriangle className="h-3 w-3 mr-1" />
                      Suivi Requis
                    </Button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default StudentProgressTab;