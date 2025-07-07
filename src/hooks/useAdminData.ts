import { useState } from "react";
import { NewCourse, FailedAttempt, QuestionAnalytic, StudentProgress } from "@/types/admin";

export const useAdminData = () => {
  const [newCourse, setNewCourse] = useState<NewCourse>({
    title: "",
    description: "",
    instructor: "",
    duration: "",
    category: "",
    level: "",
    requiresQuiz: true
  });

  // Sample data for quiz analytics
  const failedAttempts: FailedAttempt[] = [
    { user: "Marie Martin", quiz: "Réseaux TCP/IP", score: 45, date: "2024-01-25", attempts: 2 },
    { user: "Pierre Durand", quiz: "Sécurité Avancée", score: 62, date: "2024-01-24", attempts: 1 },
    { user: "Sophie Laurent", quiz: "Linux Administration", score: 58, date: "2024-01-23", attempts: 3 }
  ];

  const questionAnalytics: QuestionAnalytic[] = [
    { question: "Quel port utilise HTTPS?", correctRate: 85, totalAttempts: 120 },
    { question: "Définition d'un VLAN", correctRate: 45, totalAttempts: 120 },
    { question: "Commande Linux pour les permissions", correctRate: 72, totalAttempts: 95 }
  ];

  const studentProgress: StudentProgress[] = [
    { id: 1, name: "Marie Martin", email: "marie@example.com", coursesEnrolled: 5, coursesCompleted: 3, quizzesPassed: 2, totalHours: 45, avgScore: 87, lastQuizScore: 45, needsFollowup: true },
    { id: 2, name: "Pierre Durand", email: "pierre@example.com", coursesEnrolled: 3, coursesCompleted: 2, quizzesPassed: 1, totalHours: 32, avgScore: 92, lastQuizScore: 92, needsFollowup: false },
    { id: 3, name: "Sophie Laurent", email: "sophie@example.com", coursesEnrolled: 7, coursesCompleted: 4, quizzesPassed: 3, totalHours: 68, avgScore: 78, lastQuizScore: 58, needsFollowup: true }
  ];

  return {
    newCourse,
    setNewCourse,
    failedAttempts,
    questionAnalytics,
    studentProgress
  };
};