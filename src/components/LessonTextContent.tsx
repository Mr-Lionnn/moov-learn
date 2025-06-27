import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { BookOpen, Clock, CheckCircle, Eye, Download } from "lucide-react";

interface LessonTextContentProps {
  title: string;
  content: string;
  progress: number;
  onComplete?: () => void;
}

const LessonTextContent = ({ title, content, progress, onComplete }: LessonTextContentProps) => {
  const [readingProgress, setReadingProgress] = useState(progress);
  const [estimatedTime] = useState("12 min");

  const handleMarkComplete = () => {
    setReadingProgress(100);
    if (onComplete) {
      onComplete();
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-primary" />
              {title}
            </CardTitle>
            <Badge variant="outline" className="flex items-center gap-1 bg-blue-50 text-primary border-primary">
              <Clock className="h-3 w-3" />
              {estimatedTime}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {/* Reading Progress */}
            <div className="space-y-2">
              <div className="flex justify-between text-sm text-gray-600">
                <span>Progression de lecture</span>
                <span>{readingProgress}%</span>
              </div>
              <Progress value={readingProgress} className="h-2" />
            </div>

            {/* Reading Content */}
            <div className="prose max-w-none">
              <div className="text-gray-700 leading-relaxed space-y-4">
                {content.split('\n\n').map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </div>

            {/* Reading Actions */}
            <div className="flex gap-2 pt-4 border-t">
              <Button 
                className="moov-gradient text-white"
                onClick={handleMarkComplete}
                disabled={readingProgress === 100}
              >
                {readingProgress === 100 ? (
                  <>
                    <CheckCircle className="h-4 w-4 mr-2" />
                    Lecture Terminée
                  </>
                ) : (
                  "Marquer comme Lu"
                )}
              </Button>
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Mode Focus
              </Button>
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Télécharger PDF
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LessonTextContent;
