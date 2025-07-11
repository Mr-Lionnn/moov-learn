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
            lesson={{
              id: currentLesson.id.toString(),
              title: currentLesson.title,
              type: currentLesson.type,
              content: '',
              duration: parseInt(currentLesson.duration || '0'),
              hasQuiz: currentLesson.type === 'quiz',
              description: currentLesson.title
            }}
            onComplete={onLessonComplete}
            onNext={() => console.log('Next lesson')}
            onPrevious={() => console.log('Previous lesson')}
            hasNext={false}
            hasPrevious={false}
            currentLessonIndex={0}
            totalLessons={1}
          />
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonContentRenderer;