
import { useState } from "react";
import LessonContentRenderer from "./LessonContentRenderer";
import CourseCurriculum from "./CourseCurriculum";
import CourseActions from "./CourseActions";

interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  type: "video" | "quiz" | "text" | "audio";
}

interface CoursePlayerProps {
  courseTitle: string;
  currentLesson: Lesson;
  lessons: Lesson[];
  onCourseComplete?: () => void;
}

const CoursePlayer = ({ courseTitle, currentLesson: initialLesson, lessons, onCourseComplete }: CoursePlayerProps) => {
  const [currentLesson, setCurrentLesson] = useState<Lesson>(initialLesson);
  const [completedLessons, setCompletedLessons] = useState<number[]>([]);

  const handleLessonComplete = () => {
    if (!completedLessons.includes(currentLesson.id)) {
      setCompletedLessons([...completedLessons, currentLesson.id]);
    }
    
    // Auto-navigate to next lesson if available
    const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex < lessons.length - 1) {
      setCurrentLesson(lessons[currentIndex + 1]);
    } else if (onCourseComplete) {
      onCourseComplete();
    }
  };

  const handleLessonClick = (lesson: Lesson) => {
    setCurrentLesson(lesson);
  };

  const handleNextLesson = () => {
    const currentIndex = lessons.findIndex(l => l.id === currentLesson.id);
    if (currentIndex < lessons.length - 1) {
      setCurrentLesson(lessons[currentIndex + 1]);
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-4 sm:gap-6">
      {/* Main Content */}
      <div className="lg:col-span-2">
        <LessonContentRenderer
          currentLesson={currentLesson}
          completedLessons={completedLessons}
          onLessonComplete={handleLessonComplete}
        />
      </div>

      {/* Course Curriculum and Actions */}
      <div>
        <CourseCurriculum
          lessons={lessons}
          currentLesson={currentLesson}
          completedLessons={completedLessons}
          onLessonClick={handleLessonClick}
        />
        
        <CourseActions
          lessons={lessons}
          currentLesson={currentLesson}
          onNextLesson={handleNextLesson}
        />
      </div>
    </div>
  );
};

export default CoursePlayer;
