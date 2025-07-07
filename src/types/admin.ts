export interface AdminPanelProps {
  onClose: () => void;
}

export interface NewCourse {
  title: string;
  description: string;
  instructor: string;
  duration: string;
  category: string;
  level: string;
  requiresQuiz: boolean;
}

export interface FailedAttempt {
  user: string;
  quiz: string;
  score: number;
  date: string;
  attempts: number;
}

export interface QuestionAnalytic {
  question: string;
  correctRate: number;
  totalAttempts: number;
}

export interface StudentProgress {
  id: number;
  name: string;
  email: string;
  coursesEnrolled: number;
  coursesCompleted: number;
  quizzesPassed: number;
  totalHours: number;
  avgScore: number;
  lastQuizScore: number;
  needsFollowup: boolean;
}