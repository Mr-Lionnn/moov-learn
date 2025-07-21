export interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  type: "video" | "quiz" | "text" | "audio" | "document";
}

export interface LessonContentProps {
  currentLesson: Lesson;
  completedLessons: number[];
  onLessonComplete: () => void;
  courseTitle?: string;
}