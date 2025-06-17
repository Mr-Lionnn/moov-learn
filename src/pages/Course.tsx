
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
    { id: 1, title: "Introduction to Web Development", duration: "15:30", completed: true, type: "video" as const },
    { id: 2, title: "HTML Fundamentals", duration: "22:45", completed: true, type: "video" as const },
    { id: 3, title: "CSS Basics Quiz", duration: "10:00", completed: false, type: "quiz" as const },
    { id: 4, title: "CSS Styling", duration: "28:15", completed: false, type: "video" as const },
    { id: 5, title: "JavaScript Introduction", duration: "35:20", completed: false, type: "video" as const },
    { id: 6, title: "Final Assessment", duration: "20:00", completed: false, type: "quiz" as const },
  ];

  const currentLesson = lessons.find(l => l.id === 3) || lessons[0];

  const quizQuestions = [
    {
      id: 1,
      question: "What does CSS stand for?",
      options: [
        "Creative Style Sheets",
        "Cascading Style Sheets",
        "Computer Style Sheets",
        "Colorful Style Sheets"
      ],
      correctAnswer: 1,
      explanation: "CSS stands for Cascading Style Sheets. It's used to style and layout web pages."
    },
    {
      id: 2,
      question: "Which property is used to change the background color in CSS?",
      options: [
        "color",
        "background-color",
        "bg-color",
        "background"
      ],
      correctAnswer: 1,
      explanation: "The background-color property is specifically used to set the background color of an element."
    },
    {
      id: 3,
      question: "How do you select an element with id 'header' in CSS?",
      options: [
        ".header",
        "#header",
        "header",
        "*header"
      ],
      correctAnswer: 1,
      explanation: "The # symbol is used to select elements by their ID in CSS."
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
            Back to Dashboard
          </Button>
          
          <div className="flex gap-4 mb-6">
            <Button 
              variant={currentView === "video" ? "default" : "outline"}
              onClick={() => setCurrentView("video")}
            >
              Video Lesson
            </Button>
            <Button 
              variant={currentView === "quiz" ? "default" : "outline"}
              onClick={() => setCurrentView("quiz")}
            >
              Take Quiz
            </Button>
          </div>
        </div>

        {currentView === "video" ? (
          <CoursePlayer
            courseTitle="Introduction to Web Development"
            currentLesson={currentLesson}
            lessons={lessons}
          />
        ) : (
          <QuizComponent
            title="CSS Basics Quiz"
            questions={quizQuestions}
            timeLimit={600}
          />
        )}
      </main>
    </div>
  );
};

export default Course;
