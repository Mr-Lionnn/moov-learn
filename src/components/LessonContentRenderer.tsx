import { Card, CardContent } from "@/components/ui/card";
import LessonHeader from "./lesson/LessonHeader";
import LessonContentSwitch from "./lesson/LessonContentSwitch";
import { LessonContentProps } from "@/types/lesson";

const LessonContentRenderer = ({ 
  currentLesson, 
  completedLessons, 
  onLessonComplete,
  courseTitle = "Formation"
}: LessonContentProps) => {
  const isCompleted = completedLessons.includes(currentLesson.id);

  return (
    <Card>
      <LessonHeader 
        lesson={currentLesson} 
        isCompleted={isCompleted} 
      />
      <CardContent>
        <div className="space-y-4">
          <LessonContentSwitch
            lesson={currentLesson}
            courseTitle={courseTitle}
            onLessonComplete={onLessonComplete}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonContentRenderer;