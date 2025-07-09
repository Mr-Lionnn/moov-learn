import { ModuleRatingData } from "@/components/ModuleRating";

export interface StoredRating extends ModuleRatingData {
  userId: string;
  id: string;
}

class RatingService {
  private storageKey = 'module_ratings';

  // Save rating to localStorage
  saveRating(rating: ModuleRatingData, userId: string): StoredRating {
    const storedRating: StoredRating = {
      ...rating,
      userId,
      id: `${userId}_${rating.moduleId}_${Date.now()}`
    };

    const existingRatings = this.getAllRatings();
    existingRatings.push(storedRating);
    
    localStorage.setItem(this.storageKey, JSON.stringify(existingRatings));
    return storedRating;
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
    return Math.round((sum / ratings.length) * 10) / 10; // Round to 1 decimal
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

  // Delete a rating
  deleteRating(ratingId: string): boolean {
    try {
      const ratings = this.getAllRatings();
      const filteredRatings = ratings.filter(rating => rating.id !== ratingId);
      localStorage.setItem(this.storageKey, JSON.stringify(filteredRatings));
      return true;
    } catch (error) {
      console.error('Error deleting rating:', error);
      return false;
    }
  }

  // Clear all ratings (for testing purposes)
  clearAllRatings(): void {
    localStorage.removeItem(this.storageKey);
  }
}

export const ratingService = new RatingService();