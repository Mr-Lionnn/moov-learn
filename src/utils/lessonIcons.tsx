import { 
  CheckCircle,
  PlayCircle,
  BookOpen,
  Headphones,
  Target
} from "lucide-react";

export const getLessonIcon = (type: string, completed: boolean) => {
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
    default:
      return <PlayCircle className="h-4 w-4 text-gray-600" />;
  }
};