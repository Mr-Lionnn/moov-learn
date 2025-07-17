import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, BookOpen, Eye, Home } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface CourseData {
  title: string;
  description: string;
  duration: string;
  objectives: string[];
  targetAudience: string;
  chapters: Array<{
    title: string;
    description: string;
    content: string;
    contentType: string;
    files: File[];
  }>;
  quizzes: Array<{
    title: string;
    questions: Array<{
      question: string;
      options: string[];
      correctAnswer: number;
      explanation?: string;
    }>;
  }>;
  assignedTeams: number[];
  deadline: string;
  createdAt: string;
}

const CompletionConfirmation = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const courseData = location.state?.courseData as CourseData;

  if (!courseData) {
    navigate('/');
    return null;
  }

  const handlePreview = () => {
    // Navigate to a preview/view mode of the course
    navigate('/my-trainings', { state: { highlightCourse: courseData.title } });
  };

  const handleReturnToDashboard = () => {
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <div className="bg-card border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-center h-16">
            <div className="flex items-center gap-2">
              <CheckCircle className="h-6 w-6 text-green-500" />
              <h1 className="text-xl font-semibold text-foreground">Formation Créée avec Succès</h1>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="h-8 w-8 text-green-600" />
          </div>
          <h2 className="text-2xl font-bold text-foreground mb-2">
            Formation "{courseData.title}" créée avec succès!
          </h2>
          <p className="text-muted-foreground">
            Votre formation a été créée et est maintenant disponible dans "Mes Formations"
          </p>
        </div>

        {/* Module Preview */}
        <Card className="mb-8">
          <CardHeader>
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              <CardTitle>Aperçu du Module</CardTitle>
            </div>
            <CardDescription>
              Voici comment votre formation apparaît dans "Mes Formations"
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="border rounded-lg p-4 bg-muted/50">
              <div className="flex items-start justify-between mb-3">
                <div>
                  <h3 className="font-semibold text-lg text-foreground">{courseData.title}</h3>
                  <p className="text-sm text-muted-foreground mt-1">{courseData.description}</p>
                </div>
                <Badge variant="secondary">{courseData.duration}</Badge>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                <div>
                  <h4 className="font-medium text-sm text-foreground mb-2">Chapitres</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {courseData.chapters.map((chapter, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-primary rounded-full"></div>
                        {chapter.title}
                      </li>
                    ))}
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-medium text-sm text-foreground mb-2">Évaluations</h4>
                  <ul className="text-sm text-muted-foreground space-y-1">
                    {courseData.quizzes.map((quiz, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <div className="w-2 h-2 bg-secondary rounded-full"></div>
                        {quiz.title}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>

              <div className="mt-4 pt-4 border-t">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    Public cible: {courseData.targetAudience}
                  </span>
                  <span className="text-muted-foreground">
                    Échéance: {new Date(courseData.deadline).toLocaleDateString('fr-FR')}
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button
            onClick={handlePreview}
            variant="default"
            size="lg"
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" />
            Voir un aperçu du module
          </Button>
          
          <Button
            onClick={handleReturnToDashboard}
            variant="outline"
            size="lg"
            className="flex items-center gap-2"
          >
            <Home className="h-4 w-4" />
            Retourner au tableau de bord
          </Button>
        </div>
      </div>
    </div>
  );
};

export default CompletionConfirmation;