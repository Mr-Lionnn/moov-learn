
import { QuizResult, QuizAttempt } from '@/types/quiz';

interface LearningProgress {
  userId: string;
  courseId: string;
  completedQuizzes: string[];
  averageScore: number;
  totalQuizzes: number;
  lastActivity: string;
  skillAreas: {
    [area: string]: {
      score: number;
      attempts: number;
      improvement: number;
    };
  };
}

interface AnalyticsData {
  totalUsers: number;
  totalQuizzes: number;
  averageCompletionRate: number;
  averageScore: number;
  topPerformers: {
    userId: string;
    name: string;
    score: number;
  }[];
  skillGaps: {
    area: string;
    averageScore: number;
    usersCount: number;
  }[];
}

class ProgressService {
  private storageKey = 'moov_learning_progress';
  private analyticsKey = 'moov_analytics_data';

  saveQuizResult(result: QuizResult, userId: string = 'current_user'): void {
    const progress = this.getUserProgress(userId);
    
    // Update quiz completion
    if (!progress.completedQuizzes.includes(result.quiz.id)) {
      progress.completedQuizzes.push(result.quiz.id);
    }
    
    // Update scoring
    progress.totalQuizzes = Math.max(progress.totalQuizzes, progress.completedQuizzes.length);
    progress.averageScore = this.calculateAverageScore(progress, result.percentage);
    progress.lastActivity = new Date().toISOString();
    
    // Update skill areas (based on quiz difficulty)
    const skillArea = this.getSkillAreaFromQuiz(result.quiz);
    if (!progress.skillAreas[skillArea]) {
      progress.skillAreas[skillArea] = { score: 0, attempts: 0, improvement: 0 };
    }
    
    const oldScore = progress.skillAreas[skillArea].score;
    progress.skillAreas[skillArea].attempts++;
    progress.skillAreas[skillArea].score = 
      (progress.skillAreas[skillArea].score + result.percentage) / 2;
    progress.skillAreas[skillArea].improvement = 
      progress.skillAreas[skillArea].score - oldScore;
    
    this.saveUserProgress(userId, progress);
    this.updateAnalytics(result, userId);
  }

  getUserProgress(userId: string): LearningProgress {
    const allProgress = this.getAllProgress();
    return allProgress[userId] || {
      userId,
      courseId: 'default',
      completedQuizzes: [],
      averageScore: 0,
      totalQuizzes: 0,
      lastActivity: new Date().toISOString(),
      skillAreas: {}
    };
  }

  getAllProgress(): { [userId: string]: LearningProgress } {
    const stored = localStorage.getItem(this.storageKey);
    return stored ? JSON.parse(stored) : {};
  }

  saveUserProgress(userId: string, progress: LearningProgress): void {
    const allProgress = this.getAllProgress();
    allProgress[userId] = progress;
    localStorage.setItem(this.storageKey, JSON.stringify(allProgress));
  }

  getAnalytics(): AnalyticsData {
    const stored = localStorage.getItem(this.analyticsKey);
    return stored ? JSON.parse(stored) : {
      totalUsers: 0,
      totalQuizzes: 0,
      averageCompletionRate: 0,
      averageScore: 0,
      topPerformers: [],
      skillGaps: []
    };
  }

  private calculateAverageScore(progress: LearningProgress, newScore: number): number {
    if (progress.totalQuizzes === 0) return newScore;
    return Math.round(((progress.averageScore * (progress.totalQuizzes - 1)) + newScore) / progress.totalQuizzes);
  }

  private getSkillAreaFromQuiz(quiz: any): string {
    // Simple skill area classification based on quiz title
    const title = quiz.title.toLowerCase();
    if (title.includes('réseau') || title.includes('tcp')) return 'Réseaux';
    if (title.includes('sécurité')) return 'Sécurité';
    if (title.includes('développement')) return 'Développement';
    return 'Général';
  }

  private updateAnalytics(result: QuizResult, userId: string): void {
    const analytics = this.getAnalytics();
    const allProgress = this.getAllProgress();
    
    analytics.totalUsers = Object.keys(allProgress).length;
    analytics.totalQuizzes = Object.values(allProgress)
      .reduce((sum, p) => sum + p.totalQuizzes, 0);
    
    const allScores = Object.values(allProgress)
      .filter(p => p.averageScore > 0)
      .map(p => p.averageScore);
    
    analytics.averageScore = allScores.length > 0 
      ? Math.round(allScores.reduce((sum, score) => sum + score, 0) / allScores.length)
      : 0;
    
    analytics.averageCompletionRate = analytics.totalUsers > 0
      ? Math.round((analytics.totalQuizzes / analytics.totalUsers) * 100) / 100
      : 0;
    
    // Update top performers
    analytics.topPerformers = Object.entries(allProgress)
      .filter(([_, p]) => p.averageScore > 0)
      .map(([userId, p]) => ({
        userId,
        name: `Utilisateur ${userId.slice(-4)}`,
        score: p.averageScore
      }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 5);
    
    // Update skill gaps
    const skillAreas: { [area: string]: { total: number, count: number } } = {};
    Object.values(allProgress).forEach(p => {
      Object.entries(p.skillAreas).forEach(([area, data]) => {
        if (!skillAreas[area]) skillAreas[area] = { total: 0, count: 0 };
        skillAreas[area].total += data.score;
        skillAreas[area].count++;
      });
    });
    
    analytics.skillGaps = Object.entries(skillAreas)
      .map(([area, data]) => ({
        area,
        averageScore: Math.round(data.total / data.count),
        usersCount: data.count
      }))
      .sort((a, b) => a.averageScore - b.averageScore);
    
    localStorage.setItem(this.analyticsKey, JSON.stringify(analytics));
  }
}

export const progressService = new ProgressService();
