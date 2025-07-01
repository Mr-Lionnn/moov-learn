
export interface ProgressData {
  courseId: string;
  lessonId: string;
  completed: boolean;
  score?: number;
}

class ProgressService {
  saveProgress(courseId: string, lessonId: string, completed: boolean = true) {
    const key = `progress_${courseId}_${lessonId}`;
    const progressData: ProgressData = {
      courseId,
      lessonId,
      completed,
    };
    localStorage.setItem(key, JSON.stringify(progressData));
  }

  getProgress(courseId: string, lessonId: string): ProgressData | null {
    const key = `progress_${courseId}_${lessonId}`;
    const data = localStorage.getItem(key);
    if (data) {
      try {
        return JSON.parse(data);
      } catch (error) {
        console.error('Error parsing progress data:', error);
        return null;
      }
    }
    return null;
  }

  saveQuizResult(result: any) {
    const key = `quiz_result_${result.attempt.quizId}_${Date.now()}`;
    localStorage.setItem(key, JSON.stringify(result));
  }

  getQuizResults(quizId: string) {
    const results = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith(`quiz_result_${quizId}`)) {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            results.push(JSON.parse(data));
          } catch (error) {
            console.error('Error parsing quiz result:', error);
          }
        }
      }
    }
    return results;
  }

  getAnalytics() {
    const allResults = this.getAllQuizResults();
    const userIds = [...new Set(allResults.map(r => r.userId || 'anonymous'))];
    
    const totalQuizzes = allResults.length;
    const averageScore = totalQuizzes > 0 
      ? Math.round(allResults.reduce((sum, r) => sum + (r.percentage || 0), 0) / totalQuizzes)
      : 0;
    
    const topPerformers = userIds.map(userId => {
      const userResults = allResults.filter(r => (r.userId || 'anonymous') === userId);
      const avgScore = userResults.length > 0 
        ? Math.round(userResults.reduce((sum, r) => sum + (r.percentage || 0), 0) / userResults.length)
        : 0;
      return {
        userId,
        name: `Utilisateur ${userId}`,
        score: avgScore
      };
    }).sort((a, b) => b.score - a.score).slice(0, 5);

    const skillGaps = this.getSkillGaps(allResults);

    return {
      totalUsers: userIds.length,
      totalQuizzes,
      averageScore,
      averageCompletionRate: `${Math.round((totalQuizzes / Math.max(userIds.length, 1)) * 100)}%`,
      topPerformers,
      skillGaps
    };
  }

  getUserProgress(userId: string) {
    const allResults = this.getAllQuizResults();
    const userResults = allResults.filter(r => (r.userId || 'current_user') === userId);
    
    const totalQuizzes = userResults.length;
    const averageScore = totalQuizzes > 0 
      ? Math.round(userResults.reduce((sum, r) => sum + (r.percentage || 0), 0) / totalQuizzes)
      : 0;
    
    const skillAreas = this.getSkillAreasForUser(userResults);
    const lastActivity = userResults.length > 0 
      ? Math.max(...userResults.map(r => new Date(r.timestamp || Date.now()).getTime()))
      : null;

    return {
      totalQuizzes,
      averageScore,
      skillAreas,
      lastActivity
    };
  }

  getAllProgress() {
    const progress = {};
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('progress_')) {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            progress[key] = JSON.parse(data);
          } catch (error) {
            console.error('Error parsing progress data:', error);
          }
        }
      }
    }
    return progress;
  }

  private getAllQuizResults() {
    const results = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key && key.startsWith('quiz_result_')) {
        const data = localStorage.getItem(key);
        if (data) {
          try {
            results.push(JSON.parse(data));
          } catch (error) {
            console.error('Error parsing quiz result:', error);
          }
        }
      }
    }
    return results;
  }

  private getSkillGaps(results: any[]) {
    const skillAreas = {};
    
    results.forEach(result => {
      const area = result.skillArea || 'Général';
      if (!skillAreas[area]) {
        skillAreas[area] = { scores: [], usersCount: new Set() };
      }
      skillAreas[area].scores.push(result.percentage || 0);
      skillAreas[area].usersCount.add(result.userId || 'anonymous');
    });

    return Object.entries(skillAreas).map(([area, data]: [string, any]) => ({
      area,
      averageScore: Math.round(data.scores.reduce((sum, score) => sum + score, 0) / data.scores.length),
      usersCount: data.usersCount.size
    })).filter(gap => gap.averageScore < 80);
  }

  private getSkillAreasForUser(userResults: any[]) {
    const skillAreas = {};
    
    userResults.forEach(result => {
      const area = result.skillArea || 'Général';
      if (!skillAreas[area]) {
        skillAreas[area] = { scores: [], attempts: 0 };
      }
      skillAreas[area].scores.push(result.percentage || 0);
      skillAreas[area].attempts++;
    });

    const processedAreas = {};
    Object.entries(skillAreas).forEach(([area, data]: [string, any]) => {
      const scores = data.scores;
      const currentScore = scores[scores.length - 1] || 0;
      const previousScore = scores.length > 1 ? scores[scores.length - 2] : currentScore;
      
      processedAreas[area] = {
        score: Math.round(scores.reduce((sum, score) => sum + score, 0) / scores.length),
        attempts: data.attempts,
        improvement: currentScore - previousScore
      };
    });

    return processedAreas;
  }
}

export const progressService = new ProgressService();
