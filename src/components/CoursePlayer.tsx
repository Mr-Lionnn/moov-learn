
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
}

const CoursePlayer = ({ courseTitle, currentLesson, lessons }: CoursePlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(45);
  const [volume, setVolume] = useState(80);

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

  return (
    <div className="grid lg:grid-cols-3 gap-6">
      {/* Video Player */}
      <div className="lg:col-span-2">
        <Card>
          <CardContent className="p-0">
            {/* Video Display */}
            <div className="aspect-video bg-black rounded-t-lg relative overflow-hidden">
              <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="text-white text-center">
                  <h3 className="text-xl font-semibold mb-2">{currentLesson.title}</h3>
                  <p className="text-gray-300">Video content would play here</p>
                </div>
              </div>
              
              {/* Play Button Overlay */}
              <Button
                size="icon"
                onClick={togglePlay}
                className="absolute inset-0 m-auto h-16 w-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:bg-white/30"
              >
                {isPlaying ? (
                  <Pause className="h-6 w-6 text-white" />
                ) : (
                  <Play className="h-6 w-6 text-white ml-1" />
                )}
              </Button>
            </div>

            {/* Video Controls */}
            <div className="p-4 bg-gray-50">
              <div className="space-y-4">
                {/* Progress Bar */}
                <div className="space-y-2">
                  <Progress value={progress} className="h-2" />
                  <div className="flex justify-between text-sm text-gray-600">
                    <span>12:45</span>
                    <span>28:30</span>
                  </div>
                </div>

                {/* Control Buttons */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button size="icon" variant="ghost">
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button size="icon" onClick={togglePlay}>
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
            <p className="text-gray-700 leading-relaxed">
              In this lesson, you'll learn the fundamental concepts that will serve as the foundation 
              for your understanding of this topic. We'll cover practical examples and real-world 
              applications to help you grasp the material effectively.
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Course Curriculum */}
      <div>
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              Course Content
              <Badge variant="outline">
                {lessons.filter(l => l.completed).length}/{lessons.length}
              </Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="max-h-96 overflow-y-auto">
              {lessons.map((lesson, index) => (
                <div key={lesson.id}>
                  <div 
                    className={`p-4 hover:bg-gray-50 cursor-pointer transition-colors ${
                      lesson.id === currentLesson.id ? 'bg-blue-50 border-r-2 border-blue-600' : ''
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
                            {lesson.type}
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
      </div>
    </div>
  );
};

export default CoursePlayer;
