import { useState } from "react";
import LessonContentHeader from "./lessonContent/LessonContentHeader";
import LessonContentTabs from "./lessonContent/LessonContentTabs";
import LessonContentTabsContent from "./lessonContent/LessonContentTabsContent";
import { LessonContentProps, LessonType } from "@/types/lessonContent";
import { QuizResult } from "@/types/quiz";

const LessonContent = ({ lessonId, title, type, content, duration, onComplete }: LessonContentProps) => {
  const [activeTab, setActiveTab] = useState<LessonType>(type);
  const [completed, setCompleted] = useState(false);

  const handleComplete = () => {
    setCompleted(true);
    if (onComplete) {
      onComplete();
    }
  };

  const handleQuizComplete = (result: QuizResult) => {
    console.log("Quiz completed:", result);
    handleComplete();
  };

  const handleTabChange = (value: string) => {
    setActiveTab(value as LessonType);
  };

  return (
    <div className="space-y-6">
      <LessonContentHeader
        title={title}
        type={type}
        duration={duration}
        completed={completed}
      />

      <LessonContentTabs activeTab={activeTab} onTabChange={handleTabChange} />
      <LessonContentTabsContent
        title={title}
        content={content}
        duration={duration}
        onComplete={handleComplete}
        onQuizComplete={handleQuizComplete}
      />
    </div>
  );
};

export default LessonContent;