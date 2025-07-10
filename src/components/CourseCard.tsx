
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  Clock, 
  Users, 
  Star, 
  Play, 
  BookOpen, 
  Edit, 
  BarChart3,
  Award,
  CheckCircle,
  Lock,
  Download,
  AlertCircle
} from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

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
  moduleCount?: number;
  certificateStatus?: 'available' | 'pending' | 'requires_completion' | 'none';
  certificateUrl?: string;
}

interface CourseCardProps {
  course: Course;
  userRole?: "student" | "admin";
  onClick?: () => void;
}

const CourseCard = ({ course, userRole = "student", onClick }: CourseCardProps) => {
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

  const getCertificateInfo = (status: string) => {
    switch (status) {
      case 'available':
        return {
          text: 'Certificat disponible',
          icon: <CheckCircle className="h-4 w-4 text-green-600" />,
          color: 'text-green-600',
          action: 'Télécharger'
        };
      case 'pending':
        return {
          text: 'Certificat en traitement',
          icon: <AlertCircle className="h-4 w-4 text-orange-600" />,
          color: 'text-orange-600',
          action: 'En attente'
        };
      case 'requires_completion':
        return {
          text: 'Terminer pour obtenir le certificat',
          icon: <Lock className="h-4 w-4 text-blue-600" />,
          color: 'text-blue-600',
          action: 'Continuer'
        };
      case 'none':
      default:
        return {
          text: 'Aucun certificat',
          icon: <Award className="h-4 w-4 text-gray-400" />,
          color: 'text-gray-400',
          action: null
        };
    }
  };

  const formatDuration = (duration: string) => {
    // Convert duration like "32.5" to "32.5h" or "3" to "3 modules"
    if (duration.includes('.') || !isNaN(parseFloat(duration))) {
      return `${duration}h`;
    }
    return duration;
  };

  const handleCardClick = () => {
    if (onClick) {
      onClick();
    }
  };

  const handleCertificateAction = (e: React.MouseEvent) => {
    e.stopPropagation();
    const certInfo = getCertificateInfo(course.certificateStatus || 'none');
    
    if (course.certificateStatus === 'available' && course.certificateUrl) {
      // Download certificate
      window.open(course.certificateUrl, '_blank');
    } else if (course.certificateStatus === 'requires_completion') {
      // Continue course
      handleCardClick();
    }
  };

  const certificateInfo = getCertificateInfo(course.certificateStatus || 'none');

  return (
    <TooltipProvider>
      <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 overflow-hidden cursor-pointer" onClick={handleCardClick}>
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
          
          {/* Certificate Status Badge */}
          {course.certificateStatus && course.certificateStatus !== 'none' && (
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="absolute top-2 right-2">
                  {certificateInfo.icon}
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>{certificateInfo.text}</p>
              </TooltipContent>
            </Tooltip>
          )}
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
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1">
                  <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{formatDuration(course.duration)}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Durée totale du cours</p>
              </TooltipContent>
            </Tooltip>
            
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center gap-1">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span>{course.students.toLocaleString()}</span>
                </div>
              </TooltipTrigger>
              <TooltipContent>
                <p>Nombre d'étudiants inscrits</p>
              </TooltipContent>
            </Tooltip>
            
            {course.moduleCount && (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span>{course.moduleCount} modules</span>
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Nombre de modules dans le cours</p>
                </TooltipContent>
              </Tooltip>
            )}
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

          {/* Certificate Status Section */}
          {course.certificateStatus && course.certificateStatus !== 'none' && (
            <div className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-2">
                {certificateInfo.icon}
                <span className={`text-xs font-medium ${certificateInfo.color}`}>
                  {certificateInfo.text}
                </span>
              </div>
              {certificateInfo.action && (
                <Button
                  size="sm"
                  variant={course.certificateStatus === 'available' ? 'default' : 'outline'}
                  onClick={handleCertificateAction}
                  className="h-6 text-xs px-2"
                >
                  {course.certificateStatus === 'available' && <Download className="h-3 w-3 mr-1" />}
                  {certificateInfo.action}
                </Button>
              )}
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
              onClick={(e) => {
                e.stopPropagation();
                handleCardClick();
              }}
            >
              {course.progress > 0 ? "Continuer l'Apprentissage" : "Commencer le Cours"}
            </Button>
          )}
        </CardContent>
      </Card>
    </TooltipProvider>
  );
};

export default CourseCard;
