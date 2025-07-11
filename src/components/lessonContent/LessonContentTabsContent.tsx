import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { 
  PlayCircle, 
  FileText, 
  Volume2,
  CheckCircle2
} from "lucide-react";
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
      <TabsList className="grid w-full grid-cols-4">
        <TabsTrigger value="video" className="flex items-center gap-2">
          <PlayCircle className="h-4 w-4" />
          Vidéo
        </TabsTrigger>
        <TabsTrigger value="text" className="flex items-center gap-2">
          <FileText className="h-4 w-4" />
          Lecture
        </TabsTrigger>
        <TabsTrigger value="audio" className="flex items-center gap-2">
          <Volume2 className="h-4 w-4" />
          Audio
        </TabsTrigger>
        <TabsTrigger value="quiz" className="flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4" />
          Quiz
        </TabsTrigger>
      </TabsList>

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