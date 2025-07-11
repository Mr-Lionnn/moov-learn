
import { Star, TrendingUp, Brain } from "lucide-react";
import { useEffect, useState } from "react";
import { ratingService } from "@/services/ratingService";

interface StarRatingDisplayProps {
  rating?: number;
  moduleId?: string;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  ratingCount?: number;
  showCategories?: boolean;
}

const StarRatingDisplay = ({ 
  rating,
  moduleId,
  maxRating = 5, 
  size = "md", 
  showValue = true,
  ratingCount,
  showCategories = false
}: StarRatingDisplayProps) => {
  const [moduleRatings, setModuleRatings] = useState({
    overall: rating || 0,
    difficulty: 0,
    understanding: 0,
    count: ratingCount || 0
  });

  useEffect(() => {
    if (moduleId) {
      const loadRatings = () => {
        const overall = ratingService.getModuleAverageRating(moduleId);
        const difficulty = ratingService.getModuleAverageDifficulty(moduleId);
        const understanding = ratingService.getModuleAverageUnderstanding(moduleId);
        const count = ratingService.getModuleRatingCount(moduleId);
        
        setModuleRatings({
          overall: overall || 0,
          difficulty: difficulty || 0,
          understanding: understanding || 0,
          count
        });
      };

      loadRatings();

      // Listen for rating updates
      const handleRatingUpdate = () => loadRatings();
      window.addEventListener('ratingUpdated', handleRatingUpdate);

      return () => {
        window.removeEventListener('ratingUpdated', handleRatingUpdate);
      };
    }
  }, [moduleId]);

  const getSizeClasses = () => {
    switch (size) {
      case "sm":
        return "h-3 w-3";
      case "lg":
        return "h-6 w-6";
      default:
        return "h-4 w-4";
    }
  };

  const getTextSize = () => {
    switch (size) {
      case "sm":
        return "text-xs";
      case "lg":
        return "text-base";
      default:
        return "text-sm";
    }
  };

  const renderStars = (ratingValue: number) => {
    const stars = [];
    const fullStars = Math.floor(ratingValue);
    const hasHalfStar = ratingValue % 1 !== 0;

    // Full stars
    for (let i = 0; i < fullStars; i++) {
      stars.push(
        <Star
          key={`full-${i}`}
          className={`${getSizeClasses()} fill-yellow-400 text-yellow-400`}
        />
      );
    }

    // Half star
    if (hasHalfStar) {
      stars.push(
        <div key="half" className="relative">
          <Star className={`${getSizeClasses()} text-gray-300`} />
          <div className="absolute inset-0 overflow-hidden w-1/2">
            <Star className={`${getSizeClasses()} fill-yellow-400 text-yellow-400`} />
          </div>
        </div>
      );
    }

    // Empty stars
    const emptyStars = maxRating - Math.ceil(ratingValue);
    for (let i = 0; i < emptyStars; i++) {
      stars.push(
        <Star
          key={`empty-${i}`}
          className={`${getSizeClasses()} text-gray-300`}
        />
      );
    }

    return stars;
  };

  const displayRating = moduleId ? moduleRatings.overall : (rating || 0);
  const displayCount = moduleId ? moduleRatings.count : ratingCount;

  if (displayRating === 0 && !moduleId) {
    return (
      <div className="flex items-center gap-2">
        <div className="flex gap-0.5">
          {Array.from({ length: maxRating }, (_, i) => (
            <Star key={i} className={`${getSizeClasses()} text-gray-300`} />
          ))}
        </div>
        {showValue && (
          <span className={`${getTextSize()} text-gray-500`}>
            Pas encore noté
          </span>
        )}
      </div>
    );
  }

  if (showCategories && moduleId) {
    return (
      <div className="space-y-3">
        {/* Overall Rating */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Star className="h-4 w-4 text-yellow-500" />
            <span className="text-sm font-medium">Global:</span>
          </div>
          <div className="flex gap-0.5">
            {renderStars(moduleRatings.overall)}
          </div>
          <span className={`${getTextSize()} text-gray-600`}>
            {moduleRatings.overall.toFixed(1)}
          </span>
        </div>

        {/* Difficulty Rating */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <TrendingUp className="h-4 w-4 text-orange-500" />
            <span className="text-sm font-medium">Difficulté:</span>
          </div>
          <div className="flex gap-0.5">
            {renderStars(moduleRatings.difficulty)}
          </div>
          <span className={`${getTextSize()} text-gray-600`}>
            {moduleRatings.difficulty.toFixed(1)}
          </span>
        </div>

        {/* Understanding Rating */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1">
            <Brain className="h-4 w-4 text-blue-500" />
            <span className="text-sm font-medium">Compréhension:</span>
          </div>
          <div className="flex gap-0.5">
            {renderStars(moduleRatings.understanding)}
          </div>
          <span className={`${getTextSize()} text-gray-600`}>
            {moduleRatings.understanding.toFixed(1)}
          </span>
        </div>

        {displayCount !== undefined && displayCount > 0 && (
          <p className="text-xs text-gray-500">
            Basé sur {displayCount} évaluation{displayCount !== 1 ? 's' : ''}
          </p>
        )}
      </div>
    );
  }

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {renderStars(displayRating)}
      </div>
      {showValue && (
        <span className={`${getTextSize()} text-gray-600`}>
          {displayRating.toFixed(1)}
          {displayCount !== undefined && displayCount > 0 && (
            <span className="text-gray-500 ml-1">
              ({displayCount} avis)
            </span>
          )}
        </span>
      )}
    </div>
  );
};

export default StarRatingDisplay;
