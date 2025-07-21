
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  CheckCircle,
  Clock,
  PlayCircle,
  BookOpen,
  Headphones,
  Target,
  FileText
} from "lucide-react";
import { Lesson } from "@/types/lesson";

interface CourseCurriculumProps {
  lessons: Lesson[];
  currentLesson: Lesson;
  completedLessons: number[];
  onLessonClick: (lesson: Lesson) => void;
}

const CourseCurriculum = ({ 
  lessons, 
  currentLesson, 
  completedLessons, 
  onLessonClick 
}: CourseCurriculumProps) => {
  const getLessonIcon = (type: string, completed: boolean) => {
    if (completed) return <CheckCircle className="h-4 w-4 text-green-600" />;
    
    switch (type) {
      case "video":
        return <PlayCircle className="h-4 w-4 text-blue-600" />;
      case "quiz":
        return <Target className="h-4 w-4 text-purple-600" />;
      case "text":
        return <BookOpen className="h-4 w-4 text-orange-600" />;
      case "audio":
        return <Headphones className="h-4 w-4 text-green-600" />;
      case "document":
        return <FileText className="h-4 w-4 text-indigo-600" />;
      default:
        return <PlayCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const getTypeLabel = (type: string) => {
    switch (type) {
      case "video":
        return "Vidéo";
      case "quiz":
        return "Quiz";
      case "text":
        return "Lecture";
      case "audio":
        return "Audio";
      case "document":
        return "Document";
      default:
        return "Contenu";
    }
  };

  return (
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
                onClick={() => onLessonClick(lesson)}
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
  );
};

export default CourseCurriculum;
