
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { 
  CheckCircle,
  PlayCircle,
  BookOpen,
  Headphones,
  Target
} from "lucide-react";
import QuizPlayer from "./QuizPlayer";
import { Quiz, QuizResult } from "@/types/quiz";

interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  type: "video" | "quiz" | "text" | "audio";
}

interface LessonContentRendererProps {
  currentLesson: Lesson;
  completedLessons: number[];
  onLessonComplete: () => void;
}

// Sample quiz data for the current lesson
const sampleQuiz: Quiz = {
  id: "quiz_evaluation",
  courseId: "course_1",
  title: "Quiz d'Évaluation",
  description: "Testez vos connaissances acquises dans ce cours",
  passingGrade: 70,
  timeLimit: 1800,
  questions: [
    {
      id: "q1",
      question: "Quelle est la première étape pour gérer un client mécontent ?",
      options: [
        "Défendre immédiatement la position de l'entreprise",
        "Écouter activement et montrer de l'empathie",
        "Transférer le client vers un superviseur",
        "Proposer immédiatement une solution"
      ],
      correctAnswer: 1,
      explanation: "L'écoute active et l'empathie permettent de comprendre le problème et de calmer le client.",
      difficulty: "easy"
    },
    {
      id: "q2",
      question: "Comment appliquer la technique de désescalade ?",
      options: [
        "Parler plus fort que le client",
        "Utiliser un ton calme et des mots apaisants",
        "Ignorer les émotions du client",
        "Répéter les règles de l'entreprise"
      ],
      correctAnswer: 1,
      explanation: "Un ton calme et des mots apaisants aident à réduire la tension et à créer un environnement de résolution.",
      difficulty: "medium"
    },
    {
      id: "q3",
      question: "Quelle est la meilleure approche pour fidéliser un client après un problème résolu ?",
      options: [
        "Oublier l'incident et passer au client suivant",
        "Faire un suivi pour s'assurer de sa satisfaction",
        "Offrir automatiquement une compensation",
        "Transférer le dossier à un autre service"
      ],
      correctAnswer: 1,
      explanation: "Le suivi démontre l'engagement de l'entreprise envers la satisfaction client et renforce la relation.",
      difficulty: "medium"
    }
  ],
  createdBy: "instructor_1",
  createdAt: "2024-01-15T10:00:00Z",
  isActive: true
};

const LessonContentRenderer = ({ 
  currentLesson, 
  completedLessons, 
  onLessonComplete 
}: LessonContentRendererProps) => {
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
      default:
        return <PlayCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const sampleContent = `Introduction aux Réseaux TCP/IP

Les réseaux informatiques constituent l'épine dorsale de notre monde numérique moderne. Dans ce chapitre, nous explorerons les fondements des protocoles TCP/IP qui permettent la communication entre les ordinateurs du monde entier.

Le protocole TCP/IP (Transmission Control Protocol/Internet Protocol) est une suite de protocoles de communication qui définit comment les données sont transmises sur Internet. Développé dans les années 1970, il est devenu la norme universelle pour les communications réseau.

Comprendre TCP/IP est essentiel pour tout professionnel de l'informatique, car il sous-tend pratiquement tous les aspects de la connectivité réseau moderne, des sites web aux applications mobiles.`;

  const handleQuizComplete = (result: QuizResult) => {
    console.log("Quiz completed with result:", result);
    onLessonComplete();
  };

  const handleQuizAbandon = () => {
    console.log("Quiz abandoned");
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-xl flex items-center gap-2">
          {getLessonIcon(currentLesson.type, completedLessons.includes(currentLesson.id))}
          {currentLesson.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {currentLesson.type === "video" && (
            <>
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
              <Button onClick={onLessonComplete} className="moov-gradient text-white w-full">
                Marquer comme Terminé
              </Button>
            </>
          )}
          
          {currentLesson.type === "text" && (
            <>
              <div className="prose max-w-none">
                <div className="text-gray-700 leading-relaxed space-y-4">
                  {sampleContent.split('\n\n').map((paragraph, index) => (
                    <p key={index}>{paragraph}</p>
                  ))}
                </div>
              </div>
              <Button onClick={onLessonComplete} className="moov-gradient text-white w-full">
                Marquer comme Terminé
              </Button>
            </>
          )}
          
          {currentLesson.type === "audio" && (
            <>
              <div className="bg-gray-50 p-6 rounded-lg">
                <div className="flex items-center gap-4 mb-4">
                  <Headphones className="h-8 w-8 text-primary" />
                  <div>
                    <h3 className="font-medium">{currentLesson.title}</h3>
                    <p className="text-sm text-gray-600">Durée: {currentLesson.duration}</p>
                  </div>
                </div>
                <audio controls className="w-full">
                  <source src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" type="audio/wav" />
                  Votre navigateur ne supporte pas la lecture audio.
                </audio>
              </div>
              <Button onClick={onLessonComplete} className="moov-gradient text-white w-full">
                Marquer comme Terminé
              </Button>
            </>
          )}
          
          {currentLesson.type === "quiz" && (
            <QuizPlayer
              quiz={sampleQuiz}
              onComplete={handleQuizComplete}
              onAbandon={handleQuizAbandon}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonContentRenderer;
