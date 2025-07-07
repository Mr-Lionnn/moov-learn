import { Quiz } from "@/types/quiz";

export const networkingQuiz: Quiz = {
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