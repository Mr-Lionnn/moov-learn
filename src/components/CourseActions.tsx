
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

  const handleDownloadResources = () => {
    // Simulate file download
    const link = document.createElement('a');
    link.href = 'data:text/plain;charset=utf-8,Course Resources - Study Materials and Practice Exercises';
    link.download = 'course-resources.txt';
    link.style.display = 'none';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    // Show success message
    console.log('Resources downloaded successfully');
  };

  const handleJoinDiscussion = () => {
    // Open discussion in new tab (simulate forum)
    window.open('https://example.com/course-discussion', '_blank');
    console.log('Joining course discussion');
  };

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
          <Button variant="outline" className="w-full" onClick={handleDownloadResources}>
            Télécharger les Ressources
          </Button>
          <Button variant="outline" className="w-full" onClick={handleJoinDiscussion}>
            Rejoindre la Discussion
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default CourseActions;
