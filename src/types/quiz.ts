
export interface Quiz {
  id: string;
  courseId: string;
  title: string;
  description: string;
  passingGrade: number;
  timeLimit?: number;
  questions: QuizQuestion[];
  createdBy: string;
  createdAt: string;
  isActive: boolean;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  answers: number[];
  score: number;
  passed: boolean;
  completedAt: string;
  timeSpent: number;
}

export interface QuizResult {
  attempt: QuizAttempt;
  quiz: Quiz;
  correctAnswers: number;
  totalQuestions: number;
  percentage: number;
  feedback: QuizFeedback[];
}

export interface QuizFeedback {
  questionId: string;
  userAnswer: number;
  correctAnswer: number;
  explanation: string;
  isCorrect: boolean;
}
