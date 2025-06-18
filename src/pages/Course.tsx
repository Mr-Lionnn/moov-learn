
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
    { id: 1, title: "Introduction aux Réseaux TCP/IP", duration: "18:30", completed: true, type: "video" as const },
    { id: 2, title: "Modèle OSI et Encapsulation", duration: "25:45", completed: true, type: "video" as const },
    { id: 3, title: "Quiz Protocoles de Base", duration: "15:00", completed: false, type: "quiz" as const },
    { id: 4, title: "Configuration VLAN", duration: "32:15", completed: false, type: "video" as const },
    { id: 5, title: "Routage Statique et Dynamique", duration: "28:20", completed: false, type: "video" as const },
    { id: 6, title: "Évaluation Certification", duration: "30:00", completed: false, type: "quiz" as const },
  ];

  const currentLesson = lessons.find(l => l.id === 3) || lessons[0];

  const quizQuestions = [
    {
      id: 1,
      question: "Quel protocole est utilisé pour attribuer automatiquement des adresses IP ?",
      options: [
        "DNS",
        "DHCP",
        "FTP",
        "HTTP"
      ],
      correctAnswer: 1,
      explanation: "DHCP (Dynamic Host Configuration Protocol) est le protocole standard pour attribuer automatiquement des adresses IP aux dispositifs réseau."
    },
    {
      id: 2,
      question: "Quelle est la plage d'adresses IP privées de classe A ?",
      options: [
        "192.168.0.0 à 192.168.255.255",
        "172.16.0.0 à 172.31.255.255",
        "10.0.0.0 à 10.255.255.255",
        "169.254.0.0 à 169.254.255.255"
      ],
      correctAnswer: 2,
      explanation: "La plage d'adresses IP privées de classe A va de 10.0.0.0 à 10.255.255.255, avec un masque de sous-réseau /8."
    },
    {
      id: 3,
      question: "Quel port TCP utilise le protocole HTTPS ?",
      options: [
        "80",
        "443",
        "21",
        "23"
      ],
      correctAnswer: 1,
      explanation: "HTTPS utilise le port TCP 443 pour les connexions sécurisées, tandis que HTTP utilise le port 80."
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
              Module de Formation
            </Button>
            <Button 
              variant={currentView === "quiz" ? "default" : "outline"}
              onClick={() => setCurrentView("quiz")}
            >
              Test de Connaissances
            </Button>
          </div>
        </div>

        {currentView === "video" ? (
          <CoursePlayer
            courseTitle="Fondamentaux des Réseaux TCP/IP"
            currentLesson={currentLesson}
            lessons={lessons}
          />
        ) : (
          <QuizComponent
            title="Test de Connaissances - Protocoles Réseau"
            questions={quizQuestions}
            timeLimit={900}
          />
        )}
      </main>
    </div>
  );
};

export default Course;
