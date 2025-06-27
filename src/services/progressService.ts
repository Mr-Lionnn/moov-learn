
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
}

export const progressService = new ProgressService();
