
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  type: "video" | "quiz" | "text" | "audio";
}

interface CourseActionsProps {
  lessons: Lesson[];
  currentLesson: Lesson;
  onNextLesson: () => void;
}

const CourseActions = ({ lessons, currentLesson, onNextLesson }: CourseActionsProps) => {
  const isLastLesson = lessons.findIndex(l => l.id === currentLesson.id) === lessons.length - 1;

  return (
    <Card className="mt-4">
      <CardContent className="p-4">
        <div className="space-y-3">
          <Button 
            className="w-full moov-gradient text-white"
            onClick={onNextLesson}
            disabled={isLastLesson}
          >
            Leçon Suivante
          </Button>
          <Button variant="outline" className="w-full">
            Télécharger les Ressources
          </Button>
          <Button variant="outline" className="w-full">
            Rejoindre la Discussion
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseActions;
