
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import CoursePlayer from "@/components/CoursePlayer";
import QuizComponent from "@/components/QuizComponent";

const Course = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<"video" | "quiz">("video");

  const lessons = [
    { id: 1, title: "Introduction au Développement Web", duration: "15:30", completed: true, type: "video" as const },
    { id: 2, title: "Fondamentaux HTML", duration: "22:45", completed: true, type: "video" as const },
    { id: 3, title: "Quiz Bases CSS", duration: "10:00", completed: false, type: "quiz" as const },
    { id: 4, title: "Stylisation CSS", duration: "28:15", completed: false, type: "video" as const },
    { id: 5, title: "Introduction JavaScript", duration: "35:20", completed: false, type: "video" as const },
    { id: 6, title: "Évaluation Finale", duration: "20:00", completed: false, type: "quiz" as const },
  ];

  const currentLesson = lessons.find(l => l.id === 3) || lessons[0];

  const quizQuestions = [
    {
      id: 1,
      question: "Que signifie CSS ?",
      options: [
        "Creative Style Sheets",
        "Cascading Style Sheets",
        "Computer Style Sheets",
        "Colorful Style Sheets"
      ],
      correctAnswer: 1,
      explanation: "CSS signifie Cascading Style Sheets. Il est utilisé pour styliser et organiser les pages web."
    },
    {
      id: 2,
      question: "Quelle propriété est utilisée pour changer la couleur d'arrière-plan en CSS ?",
      options: [
        "color",
        "background-color",
        "bg-color",
        "background"
      ],
      correctAnswer: 1,
      explanation: "La propriété background-color est spécifiquement utilisée pour définir la couleur d'arrière-plan d'un élément."
    },
    {
      id: 3,
      question: "Comment sélectionne-t-on un élément avec l'id 'header' en CSS ?",
      options: [
        ".header",
        "#header",
        "header",
        "*header"
      ],
      correctAnswer: 1,
      explanation: "Le symbole # est utilisé pour sélectionner les éléments par leur ID en CSS."
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-6">
        <div className="mb-6">
          <Button 
            variant="ghost" 
            onClick={() => navigate("/")}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour au Tableau de Bord
          </Button>
          
          <div className="flex gap-4 mb-6">
            <Button 
              variant={currentView === "video" ? "default" : "outline"}
              onClick={() => setCurrentView("video")}
            >
              Leçon Vidéo
            </Button>
            <Button 
              variant={currentView === "quiz" ? "default" : "outline"}
              onClick={() => setCurrentView("quiz")}
            >
              Faire le Quiz
            </Button>
          </div>
        </div>

        {currentView === "video" ? (
          <CoursePlayer
            courseTitle="Introduction au Développement Web"
            currentLesson={currentLesson}
            lessons={lessons}
          />
        ) : (
          <QuizComponent
            title="Quiz Bases CSS"
            questions={quizQuestions}
            timeLimit={600}
          />
        )}
      </main>
    </div>
  );
};

export default Course;
