import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";
import { 
  BookOpen, 
  Clock, 
  Users, 
  Play, 
  Pause, 
  Volume2, 
  VolumeX,
  FileText, 
  Video, 
  Music, 
  Image,
  Target,
  Award,
  ChevronRight,
  ChevronLeft,
  X,
  Maximize,
  Eye,
  CheckCircle,
  Star,
  User
} from "lucide-react";
import { CourseData } from "../CourseCreationWorkflow";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import FilePreview from "@/components/FilePreview";

interface CoursePreviewProps {
  courseData: CourseData;
}

const contentTypeIcons = {
  text: FileText,
  pdf: FileText,
  video: Video,
  audio: Music,
  mixed: Image
};

const CoursePreview = ({ courseData }: CoursePreviewProps) => {
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [progress, setProgress] = useState(0);

  const currentChapter = courseData.chapters[currentChapterIndex];
  const totalDuration = courseData.chapters.reduce((total, chapter) => total + chapter.estimatedDuration, 0);
  const completedDuration = courseData.chapters.slice(0, currentChapterIndex).reduce((total, chapter) => total + chapter.estimatedDuration, 0);
  const overallProgress = totalDuration > 0 ? (completedDuration / totalDuration) * 100 : 0;

  const nextChapter = () => {
    if (currentChapterIndex < courseData.chapters.length - 1) {
      setCurrentChapterIndex(currentChapterIndex + 1);
      setProgress(0);
    }
  };

  const previousChapter = () => {
    if (currentChapterIndex > 0) {
      setCurrentChapterIndex(currentChapterIndex - 1);
      setProgress(0);
    }
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="lg" className="w-full">
          <Eye className="h-4 w-4 mr-2" />
          Aperçu Interactif de la Formation
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-7xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Aperçu: {courseData.title}
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content Area */}
          <div className="lg:col-span-2 space-y-4">
            {/* Course Header */}
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div>
                    <h2 className="text-2xl font-bold">{courseData.title}</h2>
                    <p className="text-gray-600 mt-1">{courseData.description}</p>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    <Badge variant="outline">{courseData.category}</Badge>
                    <Badge variant="outline">{courseData.level}</Badge>
                    <Badge variant="outline">{courseData.duration}</Badge>
                  </div>
                </div>
                
                {/* Course Stats */}
                <div className="grid grid-cols-4 gap-4 mt-4">
                  <div className="text-center p-2 bg-blue-50 rounded-lg">
                    <Clock className="h-5 w-5 text-blue-600 mx-auto mb-1" />
                    <p className="text-sm font-bold text-blue-900">{totalDuration} min</p>
                    <p className="text-xs text-blue-700">Durée</p>
                  </div>
                  <div className="text-center p-2 bg-green-50 rounded-lg">
                    <BookOpen className="h-5 w-5 text-green-600 mx-auto mb-1" />
                    <p className="text-sm font-bold text-green-900">{courseData.chapters.length}</p>
                    <p className="text-xs text-green-700">Chapitres</p>
                  </div>
                  <div className="text-center p-2 bg-purple-50 rounded-lg">
                    <Award className="h-5 w-5 text-purple-600 mx-auto mb-1" />
                    <p className="text-sm font-bold text-purple-900">{courseData.quizzes.length}</p>
                    <p className="text-xs text-purple-700">Quiz</p>
                  </div>
                  <div className="text-center p-2 bg-orange-50 rounded-lg">
                    <Star className="h-5 w-5 text-orange-600 mx-auto mb-1" />
                    <p className="text-sm font-bold text-orange-900">4.8</p>
                    <p className="text-xs text-orange-700">Note</p>
                  </div>
                </div>

                {/* Overall Progress */}
                <div className="mt-4">
                  <div className="flex justify-between text-sm mb-2">
                    <span>Progression Globale</span>
                    <span>{Math.round(overallProgress)}%</span>
                  </div>
                  <Progress value={overallProgress} className="h-2" />
                </div>
              </CardHeader>
            </Card>

            {/* Chapter Content */}
            {currentChapter && (
              <Card>
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <Badge variant="default">Chapitre {currentChapter.order}</Badge>
                      {React.createElement(contentTypeIcons[currentChapter.contentType], { 
                        className: "h-5 w-5 text-gray-500" 
                      })}
                      <div>
                        <h3 className="text-lg font-semibold">{currentChapter.title}</h3>
                        <p className="text-sm text-gray-600">{currentChapter.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-gray-500">
                      <Clock className="h-4 w-4" />
                      {currentChapter.estimatedDuration} min
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  {/* Mock Content Display */}
                  <div className="space-y-4">
                    {currentChapter.contentType === 'video' && (
                      <div className="aspect-video bg-gray-900 rounded-lg relative flex items-center justify-center">
                        <div className="text-white text-center">
                          <Video className="h-12 w-12 mx-auto mb-2" />
                          <p className="text-sm">Contenu Vidéo - {currentChapter.title}</p>
                        </div>
                        
                        {/* Video Controls */}
                        <div className="absolute bottom-4 left-4 right-4 bg-black/50 rounded p-2 flex items-center gap-2">
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={togglePlay}
                            className="text-white hover:bg-white/20"
                          >
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Progress value={progress} className="flex-1 h-1" />
                          <span className="text-white text-xs">2:30 / 15:30</span>
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={toggleMute}
                            className="text-white hover:bg-white/20"
                          >
                            {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
                          </Button>
                        </div>
                      </div>
                    )}

                    {currentChapter.contentType === 'audio' && (
                      <div className="bg-gray-100 rounded-lg p-6">
                        <div className="flex items-center justify-center mb-4">
                          <Music className="h-12 w-12 text-gray-500" />
                        </div>
                        <div className="flex items-center gap-2">
                          <Button size="sm" onClick={togglePlay}>
                            {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
                          </Button>
                          <Progress value={progress} className="flex-1" />
                          <span className="text-sm text-gray-600">8:45 / 20:30</span>
                        </div>
                      </div>
                    )}

                    {(currentChapter.contentType === 'text' || currentChapter.contentType === 'pdf') && (
                      <div className="prose max-w-none">
                        <div className="bg-gray-50 p-6 rounded-lg">
                          <FileText className="h-8 w-8 text-gray-500 mb-3" />
                          <h4 className="font-medium mb-2">Contenu Textuel</h4>
                          <p className="text-gray-600 text-sm leading-relaxed">
                            {currentChapter.content || "Ce chapitre contient du contenu textuel détaillé sur le sujet traité. Les apprenants pourront lire et assimiler les informations à leur rythme."}
                          </p>
                        </div>
                      </div>
                    )}

                    {/* File Attachments Preview */}
                    {currentChapter.files && currentChapter.files.length > 0 && (
                      <div className="space-y-2">
                        <h4 className="font-medium text-sm">Fichiers Joints:</h4>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {currentChapter.files.map((file, index) => (
                            <FilePreview key={index} file={file} />
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Chapter Navigation */}
                  <div className="flex justify-between items-center mt-6 pt-4 border-t">
                    <Button
                      variant="outline"
                      onClick={previousChapter}
                      disabled={currentChapterIndex === 0}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Précédent
                    </Button>
                    
                    <span className="text-sm text-gray-500">
                      {currentChapterIndex + 1} / {courseData.chapters.length}
                    </span>
                    
                    <Button
                      onClick={nextChapter}
                      disabled={currentChapterIndex === courseData.chapters.length - 1}
                    >
                      Suivant
                      <ChevronRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>

          {/* Sidebar */}
          <div className="space-y-4">
            {/* Course Outline */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Plan du Cours</CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {courseData.chapters.map((chapter, index) => {
                  const Icon = contentTypeIcons[chapter.contentType];
                  const isActive = index === currentChapterIndex;
                  const isCompleted = index < currentChapterIndex;
                  
                  return (
                    <div
                      key={chapter.id}
                      className={`p-3 rounded-lg cursor-pointer transition-colors ${
                        isActive 
                          ? 'bg-primary text-white' 
                          : isCompleted 
                            ? 'bg-green-50 hover:bg-green-100' 
                            : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setCurrentChapterIndex(index)}
                    >
                      <div className="flex items-center gap-2">
                        {isCompleted ? (
                          <CheckCircle className="h-4 w-4 text-green-500" />
                        ) : (
                          <Icon className={`h-4 w-4 ${isActive ? 'text-white' : 'text-gray-500'}`} />
                        )}
                        <div className="flex-1 min-w-0">
                          <p className={`text-sm font-medium truncate ${
                            isActive ? 'text-white' : isCompleted ? 'text-green-800' : 'text-gray-900'
                          }`}>
                            {chapter.title}
                          </p>
                          <p className={`text-xs truncate ${
                            isActive ? 'text-white/80' : isCompleted ? 'text-green-600' : 'text-gray-500'
                          }`}>
                            {chapter.estimatedDuration} min
                          </p>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </CardContent>
            </Card>

            {/* Learning Objectives */}
            {courseData.learningObjectives.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Target className="h-5 w-5" />
                    Objectifs
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {courseData.learningObjectives.map((objective, index) => (
                      <li key={index} className="flex items-start gap-2 text-sm">
                        <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0 mt-0.5" />
                        <span>{objective}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            )}

            {/* Target Audience */}
            {courseData.targetAudience.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg flex items-center gap-2">
                    <Users className="h-5 w-5" />
                    Public Cible
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex flex-wrap gap-2">
                    {courseData.targetAudience.map((audience, index) => (
                      <Badge key={index} variant="secondary" className="text-xs">
                        {audience}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Instructor Info */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg flex items-center gap-2">
                  <User className="h-5 w-5" />
                  Formateur
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <div>
                    <p className="font-medium">Admin Moov</p>
                    <p className="text-sm text-gray-600">Expert en Formation</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CoursePreview;