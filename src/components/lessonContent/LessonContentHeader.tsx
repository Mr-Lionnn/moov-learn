import { Card, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CheckCircle2 } from "lucide-react";
import { getLessonIcon, getTypeLabel } from "@/utils/lessonContentHelpers";

interface LessonContentHeaderProps {
  title: string;
  type: string;
  duration?: string;
  completed: boolean;
}

const LessonContentHeader = ({ title, type, duration, completed }: LessonContentHeaderProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl flex items-center gap-2">
            {getLessonIcon(type)}
            {title}
          </CardTitle>
          <div className="flex items-center gap-2">
            <Badge variant="outline" className="flex items-center gap-1">
              {getTypeLabel(type)}
            </Badge>
            {duration && (
              <Badge variant="secondary" className="flex items-center gap-1">
                {duration}
              </Badge>
            )}
            {completed && (
              <Badge className="bg-green-100 text-green-800 border-green-200">
                <CheckCircle2 className="h-3 w-3 mr-1" />
                Terminé
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
    </Card>
  );
};

export default LessonContentHeader;