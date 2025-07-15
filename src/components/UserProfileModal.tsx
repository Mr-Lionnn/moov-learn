
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Award, BookOpen, Clock, TrendingUp, MessageCircle } from "lucide-react";

interface UserProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  member: {
    id: number;
    name: string;
    role: string;
    department: string;
    avatar: string;
    status: string;
    currentCourse: string;
    progress: number;
    completedCourses: number;
    totalHours: number;
    certifications: number;
    expertise: string[];
  };
}

const UserProfileModal = ({ isOpen, onClose, member }: UserProfileModalProps) => {
  // Return null if member is not provided
  if (!member) {
    return null;
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "En ligne":
        return "bg-green-500";
      case "Occupé":
        return "bg-yellow-500";
      case "Absent":
        return "bg-gray-500";
      default:
        return "bg-gray-500";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[95vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-lg sm:text-xl">Profil Utilisateur</DialogTitle>
          <DialogDescription className="text-sm">
            Informations détaillées sur ce membre de l'équipe
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-4 sm:space-y-6">
          <div className="flex flex-col sm:flex-row items-center gap-4 sm:gap-6">
            <div className="relative">
              <Avatar className="h-16 w-16 sm:h-20 sm:w-20">
                <AvatarImage src={member.avatar} />
                <AvatarFallback className="text-sm sm:text-lg">
                  {member.name.split(' ').map(n => n[0]).join('')}
                </AvatarFallback>
              </Avatar>
              <div className={`absolute -bottom-1 -right-1 w-4 h-4 sm:w-6 sm:h-6 rounded-full border-2 border-white ${getStatusColor(member.status)}`}></div>
            </div>
            <div className="flex-1 text-center sm:text-left">
              <h2 className="text-xl sm:text-2xl font-bold">{member.name}</h2>
              <p className="text-gray-600 text-base sm:text-lg">{member.role}</p>
              <div className="flex flex-wrap justify-center sm:justify-start gap-2 mt-2">
                <Badge variant="outline">{member.department}</Badge>
                <Badge variant={member.status === "En ligne" ? "default" : "secondary"}>
                  {member.status}
                </Badge>
              </div>
            </div>
          </div>

          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <BookOpen className="h-6 w-6 mx-auto mb-2 text-blue-600" />
                <p className="text-2xl font-bold">{member.completedCourses}</p>
                <p className="text-xs text-gray-600">Formations</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-6 w-6 mx-auto mb-2 text-green-600" />
                <p className="text-2xl font-bold">{member.totalHours}h</p>
                <p className="text-xs text-gray-600">Heures</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Award className="h-6 w-6 mx-auto mb-2 text-purple-600" />
                <p className="text-2xl font-bold">{member.certifications}</p>
                <p className="text-xs text-gray-600">Certifications</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-6 w-6 mx-auto mb-2 text-orange-600" />
                <p className="text-2xl font-bold">{member.progress}%</p>
                <p className="text-xs text-gray-600">Progression</p>
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Formation en cours</h3>
            <Card>
              <CardContent className="p-4">
                <div className="flex justify-between items-center mb-2">
                  <span className="font-medium">{member.currentCourse}</span>
                  <span className="text-sm text-gray-600">{member.progress}%</span>
                </div>
                <Progress value={member.progress} className="h-2" />
              </CardContent>
            </Card>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Expertise</h3>
            <div className="flex flex-wrap gap-2">
              {member.expertise.map((skill, index) => (
                <Badge key={index} variant="secondary">
                  {skill}
                </Badge>
              ))}
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
            <Button className="flex-1">
              <MessageCircle className="h-4 w-4 mr-2" />
              Envoyer un message
            </Button>
            <Button variant="outline" className="flex-1 sm:flex-none">
              Voir l'historique
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default UserProfileModal;
