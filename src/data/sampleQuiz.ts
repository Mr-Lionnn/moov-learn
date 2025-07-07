import { Quiz } from "@/types/quiz";

export const sampleQuiz: Quiz = {
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