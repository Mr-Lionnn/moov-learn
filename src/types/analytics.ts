// Improved type definitions to replace 'any' types

export interface SkillAreaData {
  attempts: number;
  score: number;
  progress: number;
  level: string;
}

export interface TopPerformer {
  userId: string;
  name: string;
  score: number;
  completedCourses: number;
  avatar?: string;
}

export interface SkillGap {
  area: string;
  currentLevel: number;
  targetLevel: number;
  priority: 'high' | 'medium' | 'low';
}

export interface UserProgress {
  userId: string;
  skillAreas: Record<string, SkillAreaData>;
  overallProgress: number;
  completedModules: string[];
  activeCourses: string[];
}

export interface AnalyticsData {
  topPerformers: TopPerformer[];
  skillGaps: SkillGap[];
  userProgress: UserProgress[];
  totalUsers: number;
  activeUsers: number;
  completionRate: number;
}

export interface QuestionAnalytic {
  questionId: string;
  question: string;
  correctAnswers: number;
  totalAnswers: number;
  difficulty: 'easy' | 'medium' | 'hard';
}

export interface FailedAttempt {
  userId: string;
  userName: string;
  moduleId: string;
  moduleName: string;
  score: number;
  attemptDate: string;
  answers: Record<string, string>;
}