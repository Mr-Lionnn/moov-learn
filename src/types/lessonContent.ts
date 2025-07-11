export interface LessonContent {
  id: string;
  title: string;
  type: "video" | "text" | "audio" | "quiz";
  content?: string;
  duration?: number;
  level?: string;
  hasQuiz?: boolean;
  description?: string;
  videoUrl?: string;
  audioUrl?: string;
}

export interface LessonContentProps {
  lessonId: number;
  title: string;
  type: "video" | "text" | "audio" | "quiz";
  content?: string;
  duration?: string;
  onComplete?: () => void;
}

export type LessonType = "video" | "text" | "audio" | "quiz";