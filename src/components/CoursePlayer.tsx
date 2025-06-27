
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle,
  Clock,
  PlayCircle,
  BookOpen,
  Headphones,
  Target
} from "lucide-react";
import LessonContent from "./LessonContent";

interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  type: "video" | "quiz" | "reading" | "audio";
}

interface CoursePlayerProps {
  courseTitle: string;
  currentLesson: Lesson;
  lessons: Lesson[];
  onCourseComplete?: () => void;
}

const CoursePlayer = ({ courseTitle, currentLesson, lessons, onCourseComplete }: CoursePlayerProps) => {
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  const getLessonIcon = (type: string, completed: boolean) => {
    if (completed) return <CheckCircle className="h-4 w-4 text-green-600" />;
    
    switch (type) {
      case "video":
        return <PlayCircle className="h-4 w-4 text-blue-600" />;
      case "quiz":
        return <Target className="h-4 w-4 text-purple-600" />;
      case "reading":
        return <BookOpen className="h-4 w-4 text-orange-600" />;
      case "audio":
        return <Headphones className="h-4 w-4 text-green-600" />;
      default:
        return <PlayCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleLessonComplete = () => {
    if (!completedLessons.includes(currentLesson.id)) {
      setCompletedLessons([...completedLessons, currentLesson.id]);
    }
    
    if (onCourseComplete) {
      onCourseComplete();
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "video":
        return "Vidéo";
      case "quiz":
        return "Quiz";
      case "reading":
        return "Lecture";
      case "audio":
        return "Audio";
      default:
        return "Contenu";
    }
  };

  const sampleContent = `Introduction aux Réseaux TCP/IP

  Les réseaux informatiques constituent l'épine dorsale de notre monde numérique moderne. Dans ce chapitre, nous explorerons les fondements des protocoles TCP/IP qui permettent la communication entre les ordinateurs du monde entier.

  Le protocole TCP/IP (Transmission Control Protocol/Internet Protocol) est une suite de protocoles de communication qui définit comment les données sont transmises sur Internet. Développé dans les années 1970, il est devenu la norme universelle pour les communications réseau.

  Comprendre TCP/IP est essentiel pour tout professionnel de l'informatique, car il sous-tend pratiquement tous les aspects de la connectivité réseau moderne, des sites web aux applications mobiles.`;

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2">
        <LessonContent
          lessonId={currentLesson.id}
          title={currentLesson.title}
          type={currentLesson.type}
          content={sampleContent}
          duration={currentLesson.duration}
          onComplete={handleLessonComplete}
        />
      </div>

      {/* Course Curriculum */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Contenu du Cours
              <Badge variant="outline" className="bg-blue-50 text-primary border-primary">
                {lessons.filter(l => l.completed || completedLessons.includes(l.id)).length}/{lessons.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {lessons.map((lesson, index) => (
                <div key={lesson.id}>
                  <div 
                    className={`p-4 hover:bg-blue-50 cursor-pointer transition-colors ${
                      lesson.id === currentLesson.id ? 'bg-blue-50 border-r-4 border-primary' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {getLessonIcon(lesson.type, lesson.completed || completedLessons.includes(lesson.id))}
                      <div className="flex-1">
                        <h4 className={`font-medium ${
                          lesson.completed || completedLessons.includes(lesson.id) ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {lesson.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {getTypeLabel(lesson.type)}
                          </Badge>
                          <span className="text-xs text-gray-500">{lesson.duration}</span>
                        </div>
                      </div>
                      {(lesson.completed || completedLessons.includes(lesson.id)) && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                  </div>
                  {index < lessons.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Course Actions */}
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="space-y-3">
              <Button className="w-full moov-gradient text-white">
                Leçon Suivante
              </Button>
              <Button variant="outline" className="w-full">
                Télécharger les Ressources
              </Button>
              <Button variant="outline" className="w-full">
                Rejoindre la Discussion
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CoursePlayer;
