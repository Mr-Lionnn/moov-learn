
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";
import Header from "@/components/Header";
import CoursePlayer from "@/components/CoursePlayer";

const Course = () => {
  const navigate = useNavigate();

  const lessons = [
    { id: 1, title: "Introduction aux Réseaux TCP/IP", duration: "18:30", completed: true, type: "video" as const },
    { id: 2, title: "Modèle OSI et Encapsulation", duration: "25:45", completed: true, type: "text" as const },
    { id: 3, title: "Quiz Protocoles de Base", duration: "15:00", completed: false, type: "quiz" as const },
    { id: 4, title: "Configuration VLAN", duration: "32:15", completed: false, type: "audio" as const },
    { id: 5, title: "Routage Statique et Dynamique", duration: "28:20", completed: false, type: "video" as const },
  ];

  const currentLesson = lessons.find(l => l.id === 1) || lessons[0];

  const handleCourseComplete = () => {
    console.log("Course completed!");
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
        </div>

        <CoursePlayer
          courseTitle="Fondamentaux des Réseaux TCP/IP"
          currentLesson={currentLesson}
          lessons={lessons}
          onCourseComplete={handleCourseComplete}
        />
      </main>
    </div>
  );
};

export default Course;
