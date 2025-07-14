import { Star } from "lucide-react";

interface StarRatingDisplayProps {
  rating: number;
  maxRating?: number;
  size?: "sm" | "md" | "lg";
  showValue?: boolean;
  ratingCount?: number;
}

const StarRatingDisplay = ({ 
  rating, 
  maxRating = 5, 
  size = "md", 
  showValue = true,
  ratingCount
}: StarRatingDisplayProps) => {
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

  const renderStars = () => {
    const stars = [];
    const fullStars = Math.floor(rating);
    const hasHalfStar = rating % 1 !== 0;

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
    const emptyStars = maxRating - Math.ceil(rating);
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

  if (rating === 0) {
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

  return (
    <div className="flex items-center gap-2">
      <div className="flex gap-0.5">
        {renderStars()}
      </div>
      {showValue && (
        <span className={`${getTextSize()} text-gray-600`}>
          {rating.toFixed(1)}
          {ratingCount !== undefined && (
            <span className="text-gray-500 ml-1">
              ({ratingCount} avis)
            </span>
          )}
        </span>
      )}
    </div>
  );
};

export default StarRatingDisplay;