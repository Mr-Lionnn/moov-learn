import { useState } from "react";
import MediaPlayer from "@/components/MediaPlayer";
import TextLessonContent from "./TextLessonContent";
import QuizPlayer from "@/components/QuizPlayer";
import ModuleRating, { ModuleRatingData } from "@/components/ModuleRating";
import LessonCompletionConfirmation from "@/components/LessonCompletionConfirmation";
import MoovDocumentContent from "./MoovDocumentContent";
import { sampleQuiz } from "@/data/sampleQuiz";
import { MoovCourseQuiz } from "@/MoovCourse/MoovCourseQuiz";
import { Lesson } from "@/types/lesson";
import { QuizResult } from "@/types/quiz";
import { ratingService } from "@/services/ratingService";
import { useAuth } from "@/contexts/AuthContext";

interface LessonContentSwitchProps {
  lesson: Lesson;
  courseTitle: string;
  onLessonComplete: () => void;
}

const LessonContentSwitch = ({ 
  lesson, 
  courseTitle, 
  onLessonComplete 
}: LessonContentSwitchProps) => {
  const { user } = useAuth();
  const [showRating, setShowRating] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);

  const handleQuizComplete = (result: QuizResult) => {
    console.log("Quiz completed with result:", result);
    // Don't show rating immediately - let quiz results show first
    // Rating will be shown when user clicks "Continue" on quiz results
  };

  const handleQuizContinue = () => {
    console.log("User clicked continue after quiz");
    setShowRating(true);
  };

  const handleRatingSubmit = (rating: ModuleRatingData) => {
    console.log("Module rating submitted:", rating);
    
    // Save rating to localStorage
    if (user) {
      ratingService.saveRating(rating, user.id.toString());
    }
    
    setShowRating(false);
    setShowConfirmation(true);
  };

  const handleConfirmationComplete = () => {
    setShowConfirmation(false);
    onLessonComplete();
  };

  if (showConfirmation) {
    return (
      <LessonCompletionConfirmation
        moduleTitle={lesson.title}
        onReturnHome={handleConfirmationComplete}
        onStartNewTraining={handleConfirmationComplete}
      />
    );
  }

  if (showRating) {
    return (
      <ModuleRating
        moduleTitle={lesson.title}
        onSubmit={handleRatingSubmit}
      />
    );
  }

  switch (lesson.type) {
    case "video":
      // Check if it's a Moov course video with file
      if (courseTitle?.includes("Moov") && (lesson as any).fileName) {
        return (
          <MoovDocumentContent
            title={lesson.title}
            fileName={(lesson as any).fileName}
            fileType={(lesson as any).fileType}
            duration={lesson.duration}
            onComplete={() => setShowRating(true)}
          />
        );
      }
      return (
        <MediaPlayer
          type="video"
          title={lesson.title}
          duration={lesson.duration}
          onComplete={() => setShowRating(true)}
        />
      );
    
    case "audio":
      return (
        <MediaPlayer
          type="audio"
          title={lesson.title}
          duration={lesson.duration}
          onComplete={() => setShowRating(true)}
        />
      );
    
    case "text":
      return <TextLessonContent onComplete={() => setShowRating(true)} />;
    
    case "document":
      return (
        <MoovDocumentContent
          title={lesson.title}
          fileName={(lesson as any).fileName}
          fileType={(lesson as any).fileType}
          duration={lesson.duration}
          onComplete={() => setShowRating(true)}
        />
      );
    
    case "quiz":
      // Use MoovCourseQuiz for Moov formation, otherwise use sample quiz
      const quizToUse = courseTitle?.includes("Moov") ? MoovCourseQuiz : sampleQuiz;
      return (
        <QuizPlayer
          quiz={quizToUse}
          onComplete={handleQuizComplete}
          onContinue={handleQuizContinue}
        />
      );
    
    default:
      return <div>Type de contenu non supporté</div>;
  }
};

export default LessonContentSwitch;