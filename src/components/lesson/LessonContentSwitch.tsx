import { useState } from "react";
import MediaPlayer from "@/components/MediaPlayer";
import TextLessonContent from "./TextLessonContent";
import QuizPlayer from "@/components/QuizPlayer";
import CourseRating, { CourseRatingData } from "@/components/CourseRating";
import { sampleQuiz } from "@/data/sampleQuiz";
import { Lesson } from "@/types/lesson";
import { QuizResult } from "@/types/quiz";

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
  const [showRating, setShowRating] = useState(false);

  const handleQuizComplete = (result: QuizResult) => {
    console.log("Quiz completed with result:", result);
    // Don't show rating immediately - let quiz results show first
    // Rating will be shown when user clicks "Continue" on quiz results
  };

  const handleQuizContinue = () => {
    console.log("User clicked continue after quiz");
    setShowRating(true);
  };

  const handleRatingSubmit = (rating: CourseRatingData) => {
    console.log("Course rating submitted:", rating);
    setShowRating(false);
    onLessonComplete();
  };

  if (showRating) {
    return (
      <CourseRating
        courseTitle={courseTitle}
        onSubmit={handleRatingSubmit}
      />
    );
  }

  switch (lesson.type) {
    case "video":
      return (
        <MediaPlayer
          type="video"
          title={lesson.title}
          duration={lesson.duration}
          onComplete={onLessonComplete}
        />
      );
    
    case "audio":
      return (
        <MediaPlayer
          type="audio"
          title={lesson.title}
          duration={lesson.duration}
          onComplete={onLessonComplete}
        />
      );
    
    case "text":
      return <TextLessonContent onComplete={onLessonComplete} />;
    
    case "quiz":
      return (
        <QuizPlayer
          quiz={sampleQuiz}
          onComplete={handleQuizComplete}
          onContinue={handleQuizContinue}
        />
      );
    
    default:
      return <div>Type de contenu non supporté</div>;
  }
};

export default LessonContentSwitch;