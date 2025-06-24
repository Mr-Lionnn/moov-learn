
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Clock, Users, Star, Play, BookOpen, Edit, BarChart3 } from "lucide-react";

interface Course {
  id: number;
  title: string;
  instructor: string;
  duration: string;
  students: number;
  rating: number;
  progress: number;
  image: string;
  category: string;
  level: string;
}

interface CourseCardProps {
  course: Course;
  userRole?: "student" | "admin";
}

const CourseCard = ({ course, userRole = "student" }: CourseCardProps) => {
  const getLevelColor = (level: string) => {
    switch (level) {
      case "Débutant":
        return "bg-green-100 text-green-800";
      case "Intermédiaire":
        return "bg-yellow-100 text-yellow-800";
      case "Avancé":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden">
      <div className="relative">
        <div className="aspect-video bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
          <div className="text-white text-center">
            <BookOpen className="h-8 w-8 sm:h-12 sm:w-12 mx-auto mb-2 opacity-80" />
            <p className="text-xs sm:text-sm opacity-80">{course.category}</p>
          </div>
          <Button 
            size="icon" 
            className="absolute inset-0 m-auto h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-white/20 backdrop-blur-sm border-2 border-white/30 hover:bg-white/30 transition-all duration-300 opacity-0 group-hover:opacity-100"
          >
            <Play className="h-4 w-4 sm:h-6 sm:w-6 text-white ml-1" />
          </Button>
        </div>
        <Badge className={`absolute top-2 left-2 text-xs ${getLevelColor(course.level)}`}>
          {course.level}
        </Badge>
      </div>

      <CardHeader className="pb-3 p-4 sm:p-6">
        <div className="flex justify-between items-start gap-2">
          <CardTitle className="text-base sm:text-lg font-bold line-clamp-2 group-hover:text-blue-600 transition-colors">
            {course.title}
          </CardTitle>
          <div className="flex items-center gap-1 text-sm text-gray-600 shrink-0">
            <Star className="h-3 w-3 sm:h-4 sm:w-4 fill-yellow-400 text-yellow-400" />
            <span className="font-medium text-xs sm:text-sm">{course.rating}</span>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Avatar className="h-5 w-5 sm:h-6 sm:w-6">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="text-xs">{course.instructor.split(' ').map(n => n[0]).join('')}</AvatarFallback>
          </Avatar>
          <CardDescription className="text-xs sm:text-sm truncate">{course.instructor}</CardDescription>
        </div>
      </CardHeader>

      <CardContent className="pt-0 space-y-4 p-4 sm:p-6">
        <div className="flex items-center gap-4 text-xs sm:text-sm text-gray-600">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{course.duration}</span>
          </div>
          <div className="flex items-center gap-1">
            <Users className="h-3 w-3 sm:h-4 sm:w-4" />
            <span>{course.students.toLocaleString()}</span>
          </div>
        </div>

        {course.progress > 0 && userRole === "student" && (
          <div className="space-y-2">
            <div className="flex justify-between text-xs sm:text-sm">
              <span className="text-gray-600">Progrès</span>
              <span className="font-medium">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>
        )}

        {userRole === "admin" ? (
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" className="flex-1 text-xs sm:text-sm">
              <Edit className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Modifier
            </Button>
            <Button variant="outline" className="flex-1 text-xs sm:text-sm">
              <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4 mr-1 sm:mr-2" />
              Statistiques
            </Button>
          </div>
        ) : (
          <Button 
            className="w-full text-xs sm:text-sm"
            variant={course.progress > 0 ? "default" : "outline"}
          >
            {course.progress > 0 ? "Continuer l'Apprentissage" : "Commencer le Cours"}
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default CourseCard;
