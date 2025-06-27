import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Settings, 
  Bookmark,
  CheckCircle,
  Clock,
  PlayCircle
} from "lucide-react";

interface Lesson {
  id: number;
  title: string;
  duration: string;
  completed: boolean;
  type: "video" | "quiz" | "reading";
}

interface CoursePlayerProps {
  courseTitle: string;
  currentLesson: Lesson;
  lessons: Lesson[];
  onCourseComplete?: () => void;
}

const CoursePlayer = ({ courseTitle, currentLesson, lessons, onCourseComplete }: CoursePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(45);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const getLessonIcon = (type: string, completed: boolean) => {
    if (completed) return <CheckCircle className="h-4 w-4 text-green-600" />;
    
    switch (type) {
      case "video":
        return <PlayCircle className="h-4 w-4 text-blue-600" />;
      case "quiz":
        return <CheckCircle className="h-4 w-4 text-purple-600" />;
      case "reading":
        return <Clock className="h-4 w-4 text-orange-600" />;
      default:
        return <PlayCircle className="h-4 w-4 text-gray-600" />;
    }
  };

  const handleCourseComplete = () => {
    if (onCourseComplete) {
      onCourseComplete();
    }
  };

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Video Player */}
      <div className="lg:col-span-2">
        <Card>
          <CardContent className="p-0">
            {/* Video Display with actual video */}
            <div className="aspect-video bg-black rounded-t-lg relative overflow-hidden">
              <video
                className="w-full h-full object-cover"
                controls
                poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&h=900&q=80"
              >
                <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
                <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4" type="video/mp4" />
                Votre navigateur ne supporte pas la lecture vidéo.
              </video>
              
              <div className="absolute top-4 left-4">
                <Badge className="bg-black/70 text-white border-none">
                  {currentLesson.type === "video" ? "Vidéo" : currentLesson.type === "quiz" ? "Quiz" : "Lecture"}
                </Badge>
              </div>
            </div>

            {/* Video Controls */}
            <div className="p-4 bg-gray-50">
              <div className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>12:45</span>
                    <span>{currentLesson.duration}</span>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="ghost">
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button size="icon" onClick={togglePlay} className="moov-gradient text-white">
                      {isPlaying ? (
                        <Pause className="h-4 w-4" />
                      ) : (
                        <Play className="h-4 w-4" />
                      )}
                    </Button>
                    <Button size="icon" variant="ghost">
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="ghost">
                      <Bookmark className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Volume2 className="h-4 w-4" />
                    </Button>
                    <Button size="icon" variant="ghost">
                      <Settings className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Lesson Info */}
        <Card className="mt-6">
          <CardHeader>
            <div className="flex items-start justify-between">
              <div>
                <CardTitle className="text-xl">{currentLesson.title}</CardTitle>
                <p className="text-gray-600 mt-1">{courseTitle}</p>
              </div>
              <Badge variant="secondary">{currentLesson.duration}</Badge>
            </div>
          </CardHeader>
          <CardContent>
            <p className="text-gray-700 leading-relaxed mb-4">
              Dans cette leçon, vous apprendrez les concepts fondamentaux qui serviront de base 
              à votre compréhension de ce sujet. Nous couvrirons des exemples pratiques et des 
              applications du monde réel pour vous aider à saisir efficacement le matériel.
            </p>
            <div className="flex gap-2">
              <Button className="moov-gradient text-white" onClick={handleCourseComplete}>
                Marquer comme Terminé
              </Button>
              <Button variant="outline">
                Prendre des Notes
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Course Curriculum */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Contenu du Cours
              <Badge variant="outline" className="bg-blue-50 text-primary border-primary">
                {lessons.filter(l => l.completed).length}/{lessons.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {lessons.map((lesson, index) => (
                <div key={lesson.id}>
                  <div 
                    className={`p-4 hover:bg-blue-50 cursor-pointer transition-colors ${
                      lesson.id === currentLesson.id ? 'bg-blue-50 border-r-4 border-primary' : ''
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      {getLessonIcon(lesson.type, lesson.completed)}
                      <div className="flex-1">
                        <h4 className={`font-medium ${
                          lesson.completed ? 'text-gray-900' : 'text-gray-700'
                        }`}>
                          {lesson.title}
                        </h4>
                        <div className="flex items-center gap-2 mt-1">
                          <Badge variant="outline" className="text-xs">
                            {lesson.type === "video" ? "Vidéo" : lesson.type === "quiz" ? "Quiz" : "Lecture"}
                          </Badge>
                          <span className="text-xs text-gray-500">{lesson.duration}</span>
                        </div>
                      </div>
                      {lesson.completed && (
                        <CheckCircle className="h-5 w-5 text-green-600" />
                      )}
                    </div>
                  </div>
                  {index < lessons.length - 1 && <Separator />}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Course Actions */}
        <Card className="mt-4">
          <CardContent className="p-4">
            <div className="space-y-3">
              <Button className="w-full moov-gradient text-white">
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
      </div>
    </div>
  );
};

export default CoursePlayer;
