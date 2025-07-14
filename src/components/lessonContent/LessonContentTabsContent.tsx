import { TabsContent } from "@/components/ui/tabs";
import LessonTextContent from "@/components/LessonTextContent";
import LessonAudioContent from "@/components/LessonAudioContent";
import QuizPlayer from "@/components/QuizPlayer";
import VideoLessonTab from "./VideoLessonTab";
import { networkingQuiz } from "@/data/networkingQuiz";
import { QuizResult } from "@/types/quiz";

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
  return (
    <>
      <TabsContent value="video" className="space-y-4">
        <VideoLessonTab onComplete={onComplete} />
      </TabsContent>

      <TabsContent value="text">
        <LessonTextContent
          title={title}
          content={content || "Contenu de la leçon en cours de chargement..."}
          progress={0}
          onComplete={onComplete}
        />
      </TabsContent>

      <TabsContent value="audio">
        <LessonAudioContent
          title={title}
          duration={duration || "15:30"}
          onComplete={onComplete}
        />
      </TabsContent>

      <TabsContent value="quiz">
        <QuizPlayer
          quiz={networkingQuiz}
          onComplete={onQuizComplete}
        />
      </TabsContent>
    </>
  );
};

export default LessonContentTabsContent;