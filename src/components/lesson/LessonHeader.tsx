import { CardHeader, CardTitle } from "@/components/ui/card";
import { getLessonIcon } from "@/utils/lessonIcons";
import { Lesson } from "@/types/lesson";

interface LessonHeaderProps {
  lesson: Lesson;
  isCompleted: boolean;
}

const LessonHeader = ({ lesson, isCompleted }: LessonHeaderProps) => {
  return (
    <CardHeader>
      <CardTitle className="text-xl flex items-center gap-2">
        {getLessonIcon(lesson.type, isCompleted)}
        {lesson.title}
      </CardTitle>
    </CardHeader>
  );
};

export default LessonHeader;