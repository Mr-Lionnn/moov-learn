import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";

interface CourseRatingProps {
  courseTitle: string;
  onSubmit: (rating: CourseRatingData) => void;
}

export interface CourseRatingData {
  overallQuality: number;
  contentClarity: number;
  courseStructure: number;
  feedback?: string;
  timestamp: Date;
}

const CourseRating = ({ courseTitle, onSubmit }: CourseRatingProps) => {
  const [overallQuality, setOverallQuality] = useState(0);
  const [contentClarity, setContentClarity] = useState(0);
  const [courseStructure, setCourseStructure] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [hoveredStar, setHoveredStar] = useState(0);

  const isFormValid = overallQuality > 0 && contentClarity > 0 && courseStructure > 0;

  const handleSubmit = () => {
    if (isFormValid) {
      onSubmit({
        overallQuality,
        contentClarity,
        courseStructure,
        feedback: feedback.trim() || undefined,
        timestamp: new Date()
      });
    }
  };

  const StarRating = ({ 
    rating, 
    onRatingChange, 
    category 
  }: { 
    rating: number; 
    onRatingChange: (rating: number) => void;
    category: string;
  }) => {
    return (
      <div className="flex gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="p-1 rounded transition-colors hover:bg-gray-100"
            onClick={() => onRatingChange(star)}
            onMouseEnter={() => {
              setHoveredCategory(category);
              setHoveredStar(star);
            }}
            onMouseLeave={() => {
              setHoveredCategory(null);
              setHoveredStar(0);
            }}
          >
            <Star
              className={`h-6 w-6 transition-colors ${
                star <= (hoveredCategory === category ? hoveredStar : rating)
                  ? 'fill-yellow-400 text-yellow-400'
                  : 'text-gray-300'
              }`}
            />
          </button>
        ))}
      </div>
    );
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          Évaluez votre expérience
        </CardTitle>
        <p className="text-center text-muted-foreground">
          Votre avis nous aide à améliorer la qualité de nos formations
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-lg">{courseTitle}</h3>
        </div>

        {/* Overall Quality Rating */}
        <div className="space-y-2">
          <Label className="text-base font-medium">
            Qualité Générale du Cours *
          </Label>
          <div className="flex items-center gap-4">
            <StarRating 
              rating={overallQuality} 
              onRatingChange={setOverallQuality}
              category="overall"
            />
            <span className="text-sm text-muted-foreground">
              {overallQuality > 0 && `${overallQuality}/5 étoiles`}
            </span>
          </div>
        </div>

        {/* Content Clarity Rating */}
        <div className="space-y-2">
          <Label className="text-base font-medium">
            Clarté du Contenu *
          </Label>
          <p className="text-sm text-muted-foreground">
            Le contenu était-il facile à comprendre?
          </p>
          <div className="flex items-center gap-4">
            <StarRating 
              rating={contentClarity} 
              onRatingChange={setContentClarity}
              category="clarity"
            />
            <span className="text-sm text-muted-foreground">
              {contentClarity > 0 && `${contentClarity}/5 étoiles`}
            </span>
          </div>
        </div>

        {/* Course Structure Rating */}
        <div className="space-y-2">
          <Label className="text-base font-medium">
            Structure du Cours *
          </Label>
          <p className="text-sm text-muted-foreground">
            Le cours était-il bien organisé et structuré?
          </p>
          <div className="flex items-center gap-4">
            <StarRating 
              rating={courseStructure} 
              onRatingChange={setCourseStructure}
              category="structure"
            />
            <span className="text-sm text-muted-foreground">
              {courseStructure > 0 && `${courseStructure}/5 étoiles`}
            </span>
          </div>
        </div>

        {/* Optional Feedback */}
        <div className="space-y-2">
          <Label htmlFor="feedback" className="text-base font-medium">
            Commentaires Additionnels (Optionnel)
          </Label>
          <Textarea
            id="feedback"
            placeholder="Partagez vos commentaires pour nous aider à améliorer ce cours..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[100px]"
            maxLength={500}
          />
          <p className="text-xs text-muted-foreground text-right">
            {feedback.length}/500 caractères
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid}
            className="w-full moov-gradient text-white"
          >
            Soumettre l'Évaluation
          </Button>
          
          {!isFormValid && (
            <p className="text-sm text-red-600 text-center mt-2">
              Veuillez noter tous les critères avant de soumettre
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseRating;