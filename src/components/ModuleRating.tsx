import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Star } from "lucide-react";

interface ModuleRatingProps {
  moduleTitle: string;
  onSubmit: (rating: ModuleRatingData) => void;
}

export interface ModuleRatingData {
  moduleId: string;
  rating: number;
  feedback?: string;
  timestamp: Date;
}

const ModuleRating = ({ moduleTitle, onSubmit }: ModuleRatingProps) => {
  const [rating, setRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [hoveredStar, setHoveredStar] = useState(0);

  const isFormValid = rating > 0;

  const handleSubmit = () => {
    if (isFormValid) {
      onSubmit({
        moduleId: moduleTitle,
        rating,
        feedback: feedback.trim() || undefined,
        timestamp: new Date()
      });
    }
  };

  const StarRating = () => {
    return (
      <div className="flex gap-1 justify-center">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            className="p-2 rounded transition-colors hover:bg-gray-100"
            onClick={() => setRating(star)}
            onMouseEnter={() => setHoveredStar(star)}
            onMouseLeave={() => setHoveredStar(0)}
          >
            <Star
              className={`h-8 w-8 transition-colors ${
                star <= (hoveredStar || rating)
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

        {/* Star Rating */}
        <div className="space-y-4 text-center">
          <Label className="text-base font-medium">
            Notez votre expérience *
          </Label>
          <StarRating />
          {rating > 0 && (
            <p className="text-sm text-muted-foreground">
              {rating}/5 étoiles
            </p>
          )}
        </div>

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
            disabled={!isFormValid}
            className="w-full moov-gradient text-white"
          >
            Soumettre l'Évaluation
          </Button>
          
          {!isFormValid && (
            <p className="text-sm text-red-600 text-center mt-2">
              Veuillez donner une note avant de soumettre
            </p>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ModuleRating;