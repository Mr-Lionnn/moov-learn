
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PlayCircle, 
  FileText, 
  Headphones, 
  CheckCircle2,
  BookOpen,
  Volume2
} from "lucide-react";
import LessonTextContent from "./LessonTextContent";
import LessonAudioContent from "./LessonAudioContent";
import QuizPlayer from "./QuizPlayer";
import { Quiz, QuizResult } from "@/types/quiz";

interface LessonContentProps {
  lessonId: number;
  title: string;
  type: "video" | "text" | "audio" | "quiz";
  content?: string;
  duration?: string;
  onComplete?: () => void;
}

// Sample quiz data
const sampleQuiz: Quiz = {
  id: "quiz_1",
  courseId: "course_1",
  title: "Quiz: Fondamentaux des Réseaux TCP/IP",
  description: "Testez vos connaissances sur les protocoles réseau",
  passingGrade: 70,
  timeLimit: 1800,
  questions: [
    {
      id: "q1",
      question: "Que signifie TCP/IP?",
      options: [
        "Transmission Control Protocol/Internet Protocol",
        "Transfer Control Protocol/Internal Protocol",
        "Text Control Protocol/Internet Protocol",
        "Technical Control Protocol/Internet Protocol"
      ],
      correctAnswer: 0,
      explanation: "TCP/IP signifie Transmission Control Protocol/Internet Protocol, la base d'Internet.",
      difficulty: "easy"
    },
    {
      id: "q2",
      question: "Quel est le numéro de port par défaut pour HTTP?",
      options: ["21", "80", "443", "25"],
      correctAnswer: 1,
      explanation: "Le port 80 est le port par défaut pour le protocole HTTP.",
      difficulty: "medium"
    },
    {
      id: "q3",
      question: "Combien de couches a le modèle OSI?",
      options: ["5", "6", "7", "8"],
      correctAnswer: 2,
      explanation: "Le modèle OSI a 7 couches distinctes.",
      difficulty: "easy"
    }
  ],
  createdBy: "instructor_1",
  createdAt: "2024-01-15T10:00:00Z",
  isActive: true
};

const LessonContent = ({ lessonId, title, type, content, duration, onComplete }: LessonContentProps) => {
  const [activeTab, setActiveTab] = useState<"video" | "text" | "audio" | "quiz">(type);
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    if (onComplete) {
      onComplete();
    }
  };

  const handleQuizComplete = (result: QuizResult) => {
    console.log("Quiz completed:", result);
    handleComplete();
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as "video" | "text" | "audio" | "quiz");
  };

  const getLessonIcon = (lessonType: string) => {
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

  const getTypeLabel = (lessonType: string) => {
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

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              {getLessonIcon(type)}
              {title}
            </CardTitle>
            <div className="flex items-center gap-2">
              <Badge variant="outline" className="flex items-center gap-1">
                {getTypeLabel(type)}
              </Badge>
              {duration && (
                <Badge variant="secondary" className="flex items-center gap-1">
                  {duration}
                </Badge>
              )}
              {completed && (
                <Badge className="bg-green-100 text-green-800 border-green-200">
                  <CheckCircle2 className="h-3 w-3 mr-1" />
                  Terminé
                </Badge>
              )}
            </div>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="video" className="flex items-center gap-2">
            <PlayCircle className="h-4 w-4" />
            Vidéo
          </TabsTrigger>
          <TabsTrigger value="text" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Lecture
          </TabsTrigger>
          <TabsTrigger value="audio" className="flex items-center gap-2">
            <Volume2 className="h-4 w-4" />
            Audio
          </TabsTrigger>
          <TabsTrigger value="quiz" className="flex items-center gap-2">
            <CheckCircle2 className="h-4 w-4" />
            Quiz
          </TabsTrigger>
        </TabsList>

        <TabsContent value="video" className="space-y-4">
          <Card>
            <CardContent className="p-0">
              <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
                <video
                  className="w-full h-full object-cover"
                  controls
                  poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&h=900&q=80"
                >
                  <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                  Votre navigateur ne supporte pas la lecture vidéo.
                </video>
              </div>
            </CardContent>
          </Card>
          <Button onClick={handleComplete} className="moov-gradient text-white">
            Marquer comme Terminé
          </Button>
        </TabsContent>

        <TabsContent value="text">
          <LessonTextContent
            title={title}
            content={content || "Contenu de la leçon en cours de chargement..."}
            progress={0}
            onComplete={handleComplete}
          />
        </TabsContent>

        <TabsContent value="audio">
          <LessonAudioContent
            title={title}
            duration={duration || "15:30"}
            onComplete={handleComplete}
          />
        </TabsContent>

        <TabsContent value="quiz">
          <QuizPlayer
            quiz={sampleQuiz}
            onComplete={handleQuizComplete}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LessonContent;
