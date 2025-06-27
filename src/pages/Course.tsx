
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import CoursePlayer from "@/components/CoursePlayer";
import QuizComponent from "@/components/QuizComponent";
import QuizInterface from "@/components/QuizInterface";
import LessonFormatSelector from "@/components/LessonFormatSelector";
import LessonTextContent from "@/components/LessonTextContent";
import LessonAudioContent from "@/components/LessonAudioContent";
import { useQuizManager } from "@/hooks/useQuizManager";
import { Quiz, QuizResult } from "@/types/quiz";

const Course = () => {
  const navigate = useNavigate();
  const [currentView, setCurrentView] = useState<"content" | "quiz" | "mandatory-quiz">("content");
  const [selectedFormat, setSelectedFormat] = useState<"video" | "text" | "audio">("video");
  const [courseCompleted, setCourseCompleted] = useState(false);
  const [quizResult, setQuizResult] = useState<QuizResult | null>(null);
  
  const { startQuiz, isQuizActive } = useQuizManager();

  const lessons = [
    { id: 1, title: "Introduction aux Réseaux TCP/IP", duration: "18:30", completed: true, type: "video" as const },
    { id: 2, title: "Modèle OSI et Encapsulation", duration: "25:45", completed: true, type: "video" as const },
    { id: 3, title: "Quiz Protocoles de Base", duration: "15:00", completed: false, type: "quiz" as const },
    { id: 4, title: "Configuration VLAN", duration: "32:15", completed: false, type: "video" as const },
    { id: 5, title: "Routage Statique et Dynamique", duration: "28:20", completed: false, type: "video" as const },
    { id: 6, title: "Évaluation Finale Obligatoire", duration: "30:00", completed: false, type: "quiz" as const },
  ];

  // Mandatory course quiz
  const mandatoryQuiz: Quiz = {
    id: "mandatory_quiz_1",
    courseId: "course_1",
    title: "Évaluation Finale - Réseaux TCP/IP",
    description: "Quiz obligatoire pour valider votre compréhension du cours",
    passingGrade: 70,
    timeLimit: 30,
    questions: [
      {
        id: "q1",
        question: "Quel protocole est utilisé pour attribuer automatiquement des adresses IP ?",
        options: ["DNS", "DHCP", "FTP", "HTTP"],
        correctAnswer: 1,
        explanation: "DHCP (Dynamic Host Configuration Protocol) est le protocole standard pour attribuer automatiquement des adresses IP aux dispositifs réseau.",
        difficulty: "medium"
      },
      {
        id: "q2",
        question: "Quelle est la plage d'adresses IP privées de classe A ?",
        options: [
          "192.168.0.0 à 192.168.255.255",
          "172.16.0.0 à 172.31.255.255", 
          "10.0.0.0 à 10.255.255.255",
          "169.254.0.0 à 169.254.255.255"
        ],
        correctAnswer: 2,
        explanation: "La plage d'adresses IP privées de classe A va de 10.0.0.0 à 10.255.255.255, avec un masque de sous-réseau /8.",
        difficulty: "easy"
      },
      {
        id: "q3",
        question: "Quel port TCP utilise le protocole HTTPS ?",
        options: ["80", "443", "21", "23"],
        correctAnswer: 1,
        explanation: "HTTPS utilise le port TCP 443 pour les connexions sécurisées, tandis que HTTP utilise le port 80.",
        difficulty: "easy"
      }
    ],
    createdBy: "instructor",
    createdAt: "2024-01-01",
    isActive: true
  };

  const currentLesson = lessons.find(l => l.id === 1) || lessons[0];

  const lessonTextContent = `
Les réseaux TCP/IP constituent l'épine dorsale d'Internet et des réseaux modernes. Cette technologie fondamentale permet la communication entre milliards d'appareils à travers le monde.

Le protocole TCP/IP (Transmission Control Protocol/Internet Protocol) est en réalité une suite de protocoles qui travaillent ensemble pour assurer une communication fiable et efficace. TCP s'occupe de la transmission fiable des données, tandis qu'IP gère l'adressage et le routage.

Le modèle OSI (Open Systems Interconnection) propose une approche structurée de la communication réseau en 7 couches distinctes :

1. Couche Physique : Transmission des bits sur le support physique
2. Couche Liaison : Contrôle d'accès au medium et détection d'erreurs
3. Couche Réseau : Routage et adressage logique (IP)
4. Couche Transport : Transmission fiable (TCP) ou rapide (UDP)
5. Couche Session : Gestion des sessions de communication
6. Couche Présentation : Chiffrement et compression des données
7. Couche Application : Interface avec les applications utilisateur

L'encapsulation est un processus clé où chaque couche ajoute ses propres informations d'en-tête aux données reçues de la couche supérieure. Ce processus permet un acheminement précis et fiable des informations à travers le réseau.

Comprendre ces concepts est essentiel pour tout professionnel IT, car ils forment la base de toutes les communications modernes, des emails aux services cloud en passant par le streaming vidéo.
  `;

  const quizQuestions = [
    {
      id: 1,
      question: "Quel protocole est utilisé pour attribuer automatiquement des adresses IP ?",
      options: ["DNS", "DHCP", "FTP", "HTTP"],
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
      options: ["80", "443", "21", "23"],
      correctAnswer: 1,
      explanation: "HTTPS utilise le port TCP 443 pour les connexions sécurisées, tandis que HTTP utilise le port 80."
    }
  ];

  const handleCourseComplete = () => {
    setCourseCompleted(true);
    setCurrentView("mandatory-quiz");
  };

  const handleStartMandatoryQuiz = () => {
    startQuiz(mandatoryQuiz);
  };

  const handleQuizComplete = (result: QuizResult) => {
    setQuizResult(result);
    if (result.passed) {
      // Course is now fully completed
      console.log("Cours terminé avec succès!");
    } else {
      console.log("Quiz échoué, nouvelle tentative requise");
    }
  };

  const handleQuizAbandon = () => {
    setCurrentView("content");
  };

  const renderContent = () => {
    if (isQuizActive) {
      return (
        <QuizInterface
          quiz={mandatoryQuiz}
          onComplete={handleQuizComplete}
          onAbandon={handleQuizAbandon}
        />
      );
    }

    if (currentView === "mandatory-quiz") {
      return (
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="p-8 border-2 border-dashed border-primary rounded-lg">
            <h2 className="text-2xl font-bold text-primary mb-4">Quiz Obligatoire</h2>
            <p className="text-gray-600 mb-6">
              Vous avez terminé le contenu du cours. Pour obtenir votre certification, 
              vous devez maintenant réussir le quiz final avec une note minimale de 70%.
            </p>
            <div className="space-y-4">
              <div className="flex justify-center gap-8 text-sm text-gray-600">
                <span>• {mandatoryQuiz.questions.length} questions</span>
                <span>• {mandatoryQuiz.timeLimit} minutes</span>
                <span>• Note minimale: {mandatoryQuiz.passingGrade}%</span>
              </div>
              <Button 
                onClick={handleStartMandatoryQuiz} 
                size="lg"
                className="bg-primary text-white px-8"
              >
                Commencer le Quiz Final
              </Button>
            </div>
          </div>
        </div>
      );
    }

    if (currentView === "quiz") {
      return (
        <QuizComponent
          title="Test de Connaissances - Protocoles Réseau"
          questions={quizQuestions}
          timeLimit={900}
        />
      );
    }

    return (
      <div className="space-y-6">
        <LessonFormatSelector
          onFormatSelect={setSelectedFormat}
          selectedFormat={selectedFormat}
          lessonTitle={currentLesson.title}
          duration={currentLesson.duration}
        />
        
        {selectedFormat === "video" && (
          <CoursePlayer
            courseTitle="Fondamentaux des Réseaux TCP/IP"
            currentLesson={currentLesson}
            lessons={lessons}
            onCourseComplete={handleCourseComplete}
          />
        )}
        
        {selectedFormat === "text" && (
          <LessonTextContent
            title={currentLesson.title}
            content={lessonTextContent}
            progress={45}
            onComplete={handleCourseComplete}
          />
        )}
        
        {selectedFormat === "audio" && (
          <LessonAudioContent
            title={currentLesson.title}
            duration={currentLesson.duration}
            transcript="Transcription disponible pour ce contenu audio..."
            onComplete={handleCourseComplete}
          />
        )}
      </div>
    );
  };

  return (
    <div className="min-h-screen moov-gradient-subtle">
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
              variant={currentView === "content" ? "default" : "outline"}
              onClick={() => setCurrentView("content")}
              className={currentView === "content" ? "moov-gradient text-white" : ""}
            >
              Module de Formation
            </Button>
            <Button 
              variant={currentView === "quiz" ? "default" : "outline"}
              onClick={() => setCurrentView("quiz")}
              className={currentView === "quiz" ? "moov-gradient text-white" : ""}
            >
              Test de Connaissances
            </Button>
            {courseCompleted && (
              <Button 
                variant={currentView === "mandatory-quiz" ? "default" : "outline"}
                onClick={() => setCurrentView("mandatory-quiz")}
                className={`${currentView === "mandatory-quiz" ? "moov-gradient text-white" : ""} border-primary text-primary`}
              >
                Quiz Final Obligatoire
              </Button>
            )}
          </div>
        </div>

        {quizResult && (
          <div className={`p-4 rounded-lg mb-6 ${
            quizResult.passed ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
          }`}>
            <h3 className={`font-semibold ${quizResult.passed ? 'text-green-800' : 'text-red-800'}`}>
              {quizResult.passed ? 'Félicitations! Quiz réussi' : 'Quiz échoué'}
            </h3>
            <p className={`text-sm ${quizResult.passed ? 'text-green-600' : 'text-red-600'}`}>
              Score: {quizResult.percentage}% (Minimum requis: {quizResult.quiz.passingGrade}%)
            </p>
          </div>
        )}

        {renderContent()}
      </main>
    </div>
  );
};

export default Course;
