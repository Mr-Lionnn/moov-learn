import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PlayCircle, 
  FileText, 
  Volume2,
  CheckCircle2
} from "lucide-react";
import { LessonType } from "@/types/lessonContent";

interface LessonContentTabsProps {
  activeTab: LessonType;
  onTabChange: (value: string) => void;
}

const LessonContentTabs = ({ activeTab, onTabChange }: LessonContentTabsProps) => {
  return (
    <div className="w-full">
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
    </div>
  );
};

export default LessonContentTabs;