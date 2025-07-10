
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star, TrendingUp, Brain } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { ratingService } from "@/services/ratingService";

interface ModuleRatingProps {
  moduleTitle: string;
  moduleId?: string;
  onSubmit: (rating: ModuleRatingData) => void;
  onClose?: () => void;
}

export interface ModuleRatingData {
  moduleId: string;
  rating: number;
  feedback?: string;
  timestamp: Date;
}

const ModuleRating = ({ moduleTitle, moduleId, onSubmit, onClose }: ModuleRatingProps) => {
  const { user } = useAuth();
  const [rating, setRating] = useState(0);
  const [difficulty, setDifficulty] = useState(0);
  const [understanding, setUnderstanding] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);
  const [hoveredCategory, setHoveredCategory] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const actualModuleId = moduleId || moduleTitle;
  const isFormValid = rating > 0 && difficulty > 0 && understanding > 0;

  // Load existing rating if user has already rated this module
  useEffect(() => {
    if (user?.id) {
      const existingRating = ratingService.getUserModuleRating(user.id.toString(), actualModuleId);
      if (existingRating) {
        setRating(existingRating.rating);
        setDifficulty(existingRating.difficulty || 3);
        setUnderstanding(existingRating.understanding || 3);
        setFeedback(existingRating.feedback || "");
      }
    }
  }, [user?.id, actualModuleId]);

  const handleSubmit = async () => {
    if (!isFormValid || !user?.id || isSubmitting) return;

    setIsSubmitting(true);

    try {
      const ratingData: ModuleRatingData = {
        moduleId: actualModuleId,
        rating,
        feedback: feedback.trim() || undefined,
        timestamp: new Date()
      };

      // Save to rating service with enhanced data
      const savedRating = ratingService.saveRating(
        ratingData,
        user.id.toString(),
        difficulty,
        understanding
      );

      console.log('Rating submitted successfully:', savedRating);
      onSubmit(ratingData);
      
      if (onClose) {
        setTimeout(onClose, 1000); // Allow user to see success message
      }
    } catch (error) {
      console.error('Error submitting rating:', error);
      alert('Erreur lors de la soumission de l\'évaluation. Veuillez réessayer.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const StarRating = ({ 
    value,
    onChange,
    category,
    icon: Icon,
    label
  }: { 
    value: number;
    onChange: (rating: number) => void;
    category: string;
    icon: any;
    label: string;
  }) => {
    return (
      <div className="space-y-2">
        <Label className="text-base font-medium flex items-center gap-2">
          <Icon className="h-4 w-4" />
          {label} *
        </Label>
        <div className="flex gap-1 justify-center">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              className="p-2 rounded transition-colors hover:bg-gray-100"
              onClick={() => onChange(star)}
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
                className={`h-8 w-8 transition-colors ${
                  star <= (hoveredCategory === category ? hoveredStar : value)
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300'
                }`}
              />
            </button>
          ))}
        </div>
        {value > 0 && (
          <p className="text-sm text-muted-foreground text-center">
            {value}/5 étoiles
          </p>
        )}
      </div>
    );
  };

  return (
    <Card className="max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle className="text-center">
          Évaluez ce module
        </CardTitle>
        <p className="text-center text-muted-foreground">
          Votre avis nous aide à améliorer nos formations
        </p>
      </CardHeader>
      
      <CardContent className="space-y-6">
        <div className="text-center p-4 bg-gray-50 rounded-lg">
          <h3 className="font-medium text-lg">{moduleTitle}</h3>
        </div>

        {/* Overall Rating */}
        <StarRating
          value={rating}
          onChange={setRating}
          category="overall"
          icon={Star}
          label="Note Générale"
        />

        {/* Difficulty Rating */}
        <StarRating
          value={difficulty}
          onChange={setDifficulty}
          category="difficulty"
          icon={TrendingUp}
          label="Niveau de Difficulté"
        />

        {/* Understanding Rating */}
        <StarRating
          value={understanding}
          onChange={setUnderstanding}
          category="understanding"
          icon={Brain}
          label="Niveau de Compréhension"
        />

        {/* Optional Feedback */}
        <div className="space-y-2">
          <Label htmlFor="feedback" className="text-base font-medium">
            Commentaires (Optionnel)
          </Label>
          <Textarea
            id="feedback"
            placeholder="Partagez vos commentaires sur ce module..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
            className="min-h-[100px]"
            maxLength={300}
          />
          <p className="text-xs text-muted-foreground text-right">
            {feedback.length}/300 caractères
          </p>
        </div>

        {/* Submit Button */}
        <div className="pt-4">
          <Button
            onClick={handleSubmit}
            disabled={!isFormValid || isSubmitting}
            className="w-full moov-gradient text-white"
          >
            {isSubmitting ? 'Soumission...' : 'Soumettre l\'Évaluation'}
          </Button>
          
          {!isFormValid && (
            <p className="text-sm text-red-600 text-center mt-2">
              Veuillez donner une note pour tous les critères avant de soumettre
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleRating;
