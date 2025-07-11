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
    <div className="w-full bg-white rounded-lg shadow-sm border">
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <div className="border-b bg-gray-50 rounded-t-lg">
          <TabsList className="w-full h-auto p-1 bg-transparent grid grid-cols-4 gap-1">
            <TabsTrigger 
              value="video" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <PlayCircle className="h-4 w-4" />
              Vidéo
            </TabsTrigger>
            <TabsTrigger 
              value="text" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <FileText className="h-4 w-4" />
              Lecture
            </TabsTrigger>
            <TabsTrigger 
              value="audio" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <Volume2 className="h-4 w-4" />
              Audio
            </TabsTrigger>
            <TabsTrigger 
              value="quiz" 
              className="flex items-center gap-2 data-[state=active]:bg-white data-[state=active]:shadow-sm"
            >
              <CheckCircle2 className="h-4 w-4" />
              Quiz
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="video" className="p-6">
          <VideoLessonTab onComplete={onComplete} />
        </TabsContent>

        <TabsContent value="text" className="p-6">
          <TextLessonTab
            title={title}
            content={content}
            onComplete={onComplete}
          />
        </TabsContent>

        <TabsContent value="audio" className="p-6">
          <AudioLessonTab
            title={title}
            duration={duration || "18:20"}
            onComplete={onComplete}
          />
        </TabsContent>

        <TabsContent value="quiz" className="p-6">
          <QuizLessonTab
            title={`Quiz d'Évaluation - ${title}`}
            onComplete={onQuizComplete}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default LessonContentTabsContent;