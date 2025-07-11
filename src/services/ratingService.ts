
import { ModuleRatingData } from "@/components/ModuleRating";

export interface StoredRating extends ModuleRatingData {
  userId: string;
  id: string;
  difficulty: number; // 1-5 scale where higher = more difficult
  understanding: number; // 1-5 scale where higher = better understanding
}

class RatingService {
  private storageKey = 'module_ratings';
  private progressKey = 'user_progress';

  // Save rating to localStorage with enhanced data
  saveRating(rating: ModuleRatingData, userId: string, difficulty: number = 3, understanding: number = 3): StoredRating {
    const storedRating: StoredRating = {
      ...rating,
      userId,
      id: `${userId}_${rating.moduleId}_${Date.now()}`,
      difficulty,
      understanding
    };

    const existingRatings = this.getAllRatings();
    
    // Remove any existing rating from the same user for the same module
    const filteredRatings = existingRatings.filter(
      r => !(r.userId === userId && r.moduleId === rating.moduleId)
    );
    
    filteredRatings.push(storedRating);
    
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(filteredRatings));
      console.log('✅ Rating saved successfully:', storedRating);
      
      // Dispatch custom event to notify other components
      window.dispatchEvent(new CustomEvent('ratingUpdated', { detail: storedRating }));
      
      return storedRating;
    } catch (error) {
      console.error('❌ Error saving rating:', error);
      throw error;
    }
  }

  // Get all ratings from localStorage
  getAllRatings(): StoredRating[] {
    try {
      const ratings = localStorage.getItem(this.storageKey);
      return ratings ? JSON.parse(ratings) : [];
    } catch (error) {
      console.error('Error loading ratings:', error);
      return [];
    }
  }

  // Get ratings for a specific module
  getModuleRatings(moduleId: string): StoredRating[] {
    return this.getAllRatings().filter(rating => rating.moduleId === moduleId);
  }

  // Get average rating for a module
  getModuleAverageRating(moduleId: string): number {
    const ratings = this.getModuleRatings(moduleId);
    if (ratings.length === 0) return 0;
    
    const sum = ratings.reduce((acc, rating) => acc + rating.rating, 0);
    return Math.round((sum / ratings.length) * 10) / 10;
  }

  // Get average difficulty for a module
  getModuleAverageDifficulty(moduleId: string): number {
    const ratings = this.getModuleRatings(moduleId);
    if (ratings.length === 0) return 0;
    
    const sum = ratings.reduce((acc, rating) => acc + (rating.difficulty || 3), 0);
    return Math.round((sum / ratings.length) * 10) / 10;
  }

  // Get average understanding for a module
  getModuleAverageUnderstanding(moduleId: string): number {
    const ratings = this.getModuleRatings(moduleId);
    if (ratings.length === 0) return 0;
    
    const sum = ratings.reduce((acc, rating) => acc + (rating.understanding || 3), 0);
    return Math.round((sum / ratings.length) * 10) / 10;
  }

  // Get user's rating for a specific module
  getUserModuleRating(userId: string, moduleId: string): StoredRating | null {
    const userRatings = this.getAllRatings().filter(
      rating => rating.userId === userId && rating.moduleId === moduleId
    );
    
    // Return the most recent rating
    return userRatings.length > 0 
      ? userRatings.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime())[0]
      : null;
  }

  // Get total number of ratings for a module
  getModuleRatingCount(moduleId: string): number {
    return this.getModuleRatings(moduleId).length;
  }

  // Save user progress
  saveUserProgress(userId: string, moduleId: string, progress: number, completed: boolean = false): void {
    try {
      const progressData = this.getUserProgress();
      const userKey = `${userId}_${moduleId}`;
      
      progressData[userKey] = {
        userId,
        moduleId,
        progress,
        completed,
        lastUpdated: new Date().toISOString()
      };
      
      localStorage.setItem(this.progressKey, JSON.stringify(progressData));
      console.log('✅ Progress saved:', { userId, moduleId, progress, completed });
    } catch (error) {
      console.error('❌ Error saving progress:', error);
    }
  }

  // Get all user progress
  getUserProgress(): Record<string, any> {
    try {
      const progress = localStorage.getItem(this.progressKey);
      return progress ? JSON.parse(progress) : {};
    } catch (error) {
      console.error('Error loading progress:', error);
      return {};
    }
  }

  // Get specific user module progress
  getModuleProgress(userId: string, moduleId: string): { progress: number; completed: boolean } | null {
    const progressData = this.getUserProgress();
    const userKey = `${userId}_${moduleId}`;
    return progressData[userKey] || null;
  }

  // Delete a rating
  deleteRating(ratingId: string): boolean {
    try {
      const ratings = this.getAllRatings();
      const filteredRatings = ratings.filter(rating => rating.id !== ratingId);
      localStorage.setItem(this.storageKey, JSON.stringify(filteredRatings));
      
      // Dispatch update event
      window.dispatchEvent(new CustomEvent('ratingUpdated'));
      
      return true;
    } catch (error) {
      console.error('Error deleting rating:', error);
      return false;
    }
  }

  // Clear all ratings (for testing purposes)
  clearAllRatings(): void {
    localStorage.removeItem(this.storageKey);
    localStorage.removeItem(this.progressKey);
  }
}

export const ratingService = new RatingService();
