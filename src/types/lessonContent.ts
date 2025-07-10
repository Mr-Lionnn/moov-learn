
export interface LessonContentProps {
  lessonId: number;
  title: string;
  type: "video" | "text" | "audio" | "quiz";
  content?: string;
  duration?: string;
  onComplete?: () => void;
}

export interface LessonContent {
  id: string;
  title: string;
  type: "video" | "text" | "audio" | "quiz";
  duration: number;
  content?: string;
  level?: string;
  hasQuiz?: boolean;
}

export type LessonType = "video" | "text" | "audio" | "quiz";
