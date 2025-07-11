import { Tabs, TabsContent } from "@/components/ui/tabs";
import VideoLessonTab from "./VideoLessonTab";
import AudioLessonTab from "./AudioLessonTab";
import TextLessonTab from "./TextLessonTab";
import QuizLessonTab from "./QuizLessonTab";
import { QuizResult } from "@/types/quiz";
import { useState } from "react";

interface LessonContentTabsContentProps {
  title: string;
  content?: string;
  duration?: string;
  onComplete: () => void;
  onQuizComplete: (result: QuizResult) => void;
}

const LessonContentTabsContent = ({ 
  title, 
  content, 
  duration, 
  onComplete, 
  onQuizComplete 
}: LessonContentTabsContentProps) => {
  const [activeTab, setActiveTab] = useState("video");

  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsContent value="video" className="space-y-4">
        <VideoLessonTab onComplete={onComplete} />
      </TabsContent>

      <TabsContent value="text" className="space-y-4">
        <TextLessonTab
          title={title}
          content={content}
          onComplete={onComplete}
        />
      </TabsContent>

      <TabsContent value="audio" className="space-y-4">
        <AudioLessonTab
          title={title}
          duration={duration || "18:20"}
          onComplete={onComplete}
        />
      </TabsContent>

      <TabsContent value="quiz" className="space-y-4">
        <QuizLessonTab
          title={`Quiz d'Évaluation - ${title}`}
          onComplete={onQuizComplete}
        />
      </TabsContent>
    </Tabs>
  );
};

export default LessonContentTabsContent;