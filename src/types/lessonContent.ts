export interface LessonContentProps {
  lessonId: number;
  title: string;
  type: "video" | "text" | "audio" | "quiz";
  content?: string;
  duration?: string;
  onComplete?: () => void;
}

export type LessonType = "video" | "text" | "audio" | "quiz";