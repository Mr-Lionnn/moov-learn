
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { PlayCircle, Clock, Users, Award, Download, Eye } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CourseDetailModalProps {
  isOpen: boolean;
  onClose: () => void;
  course: {
    id: number;
    title: string;
    instructor: string;
    duration: string;
    students: number;
    rating: number;
    progress: number;
    level: string;
    nextLesson: string;
    estimatedTime: string;
  };
}

const CourseDetailModal = ({ isOpen, onClose, course }: CourseDetailModalProps) => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate(`/course/${course.id}`);
    onClose();
  };

  const handleDownloadResources = () => {
    // Simulate file download
    const link = document.createElement('a');
    link.href = '#';
    link.download = `${course.title}-resources.pdf`;
    link.click();
    console.log(`Downloading resources for: ${course.title}`);
  };

  const handleViewCertificate = () => {
    navigate(`/certifications`);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="text-xl">{course.title}</DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          <div className="flex items-center gap-4 text-sm text-gray-600">
            <div className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>{course.duration}</span>
            </div>
            <div className="flex items-center gap-1">
              <Users className="h-4 w-4" />
              <span>{course.students} étudiants</span>
            </div>
            <Badge variant="outline">{course.level}</Badge>
          </div>

          <div className="space-y-2">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Progression</span>
              <span className="text-sm text-gray-600">{course.progress}%</span>
            </div>
            <Progress value={course.progress} className="h-2" />
          </div>

          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-medium text-blue-900 mb-2">Prochaine leçon:</h4>
            <p className="text-blue-800">{course.nextLesson}</p>
            <p className="text-sm text-blue-600 mt-1">Temps estimé: {course.estimatedTime}</p>
          </div>

          <div className="flex gap-3">
            <Button onClick={handleContinue} className="flex-1 moov-gradient text-white">
              <PlayCircle className="h-4 w-4 mr-2" />
              Continuer
            </Button>
            <Button variant="outline" onClick={handleDownloadResources}>
              <Download className="h-4 w-4 mr-2" />
              Ressources
            </Button>
            {course.progress === 100 && (
              <Button variant="outline" onClick={handleViewCertificate}>
                <Award className="h-4 w-4 mr-2" />
                Certificat
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CourseDetailModal;
