import { 
  PlayCircle, 
  FileText, 
  Headphones, 
  CheckCircle2,
  BookOpen
} from "lucide-react";

export const getLessonIcon = (lessonType: string) => {
  switch (lessonType) {
    case "video":
      return <PlayCircle className="h-5 w-5" />;
    case "text":
      return <FileText className="h-5 w-5" />;
    case "audio":
      return <Headphones className="h-5 w-5" />;
    case "quiz":
      return <CheckCircle2 className="h-5 w-5" />;
    default:
      return <BookOpen className="h-5 w-5" />;
  }
};

export const getTypeLabel = (lessonType: string) => {
  switch (lessonType) {
    case "video":
      return "Vidéo";
    case "text":
      return "Lecture";
    case "audio":
      return "Audio";
    case "quiz":
      return "Quiz";
    default:
      return "Contenu";
  }
};