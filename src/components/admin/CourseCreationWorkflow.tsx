import { useState, useEffect } from "react";
import { useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { 
  ChevronLeft, 
  ChevronRight, 
  Plus, 
  FileText, 
  Video, 
  Music, 
  Image, 
  Upload,
  CheckCircle,
  Eye,
  BookOpen,
  Clock,
  Users
} from "lucide-react";
import BasicInfoForm from "./workflow/BasicInfoForm";
import ChapterSetupForm from "./workflow/ChapterSetupForm";
import QuizCreationForm from "./workflow/QuizCreationForm";
import CourseReviewForm from "./workflow/CourseReviewForm";
import { ContentFile, Team } from "@/types/content";
import { Quiz } from "@/types/quiz";

export interface CourseData {
  id?: string;
  title: string;
  description: string;
  duration: string;
  learningObjectives: string[];
  targetAudience: string[];
  level: 'beginner' | 'intermediate' | 'advanced';
  category: string;
  chapters: Chapter[];
  quizzes: Quiz[];
  createdBy?: string;
  createdAt?: string;
}

export interface Chapter {
  id: string;
  title: string;
  description: string;
  order: number;
  contentType: 'text' | 'pdf' | 'video' | 'audio' | 'mixed';
  content?: string;
  files: ContentFile[];
  estimatedDuration: number; // in minutes
  isCompleted: boolean;
}

interface CourseCreationWorkflowProps {
  onSave: (course: CourseData) => void;
  onCancel: () => void;
  teams: Team[];
}

const phases = [
  { id: 1, name: "Informations de Base", description: "Détails du cours et structure" },
  { id: 2, name: "Création des Évaluations", description: "Quiz et tests" },
  { id: 3, name: "Révision et Finalisation", description: "Aperçu et publication" }
];

const CourseCreationWorkflow = ({ onSave, onCancel, teams }: CourseCreationWorkflowProps) => {
  const location = useLocation();
  const [currentPhase, setCurrentPhase] = useState(1);
  const [courseData, setCourseData] = useState<CourseData>({
    title: "",
    description: "",
    duration: "",
    learningObjectives: [],
    targetAudience: [],
    level: 'beginner',
    category: "",
    chapters: [],
    quizzes: []
  });

  // Load from session storage on component mount
  useEffect(() => {
    const savedData = sessionStorage.getItem('courseCreationData');
    if (savedData) {
      try {
        const parsedData = JSON.parse(savedData);
        setCourseData(parsedData);
      } catch (error) {
        console.error('Error loading course data from session storage:', error);
      }
    }
  }, []);

  // Save to session storage whenever course data changes
  useEffect(() => {
    sessionStorage.setItem('courseCreationData', JSON.stringify(courseData));
  }, [courseData]);

  // Handle file upload integration
  useEffect(() => {
    const uploadedFiles = sessionStorage.getItem('uploadedFiles');
    const uploadContext = sessionStorage.getItem('uploadContext');
    
    if (uploadedFiles && uploadContext) {
      try {
        const files: ContentFile[] = JSON.parse(uploadedFiles);
        const context = JSON.parse(uploadContext);
        
        if (files.length > 0 && context.chapterId) {
          // Clear uploaded files from session storage
          sessionStorage.removeItem('uploadedFiles');
          sessionStorage.removeItem('uploadContext');
          
          // Find the specific chapter that needs these files
          setCourseData(prev => {
            const updatedChapters = prev.chapters.map(chapter =>
              chapter.id === context.chapterId
                ? { ...chapter, files: [...chapter.files, ...files] }
                : chapter
            );
            return { ...prev, chapters: updatedChapters };
          });
        }
      } catch (error) {
        console.error('Error processing uploaded files:', error);
      }
    }
  }, [location.pathname]);

  // Clear session storage when component unmounts (completed or cancelled)
  useEffect(() => {
    return () => {
      if (location.pathname !== '/upload-files') {
        sessionStorage.removeItem('courseCreationData');
      }
    };
  }, [location.pathname]);

  const progress = (currentPhase / phases.length) * 100;

  const handleNext = () => {
    if (currentPhase < phases.length) {
      setCurrentPhase(currentPhase + 1);
    }
  };

  const handlePrevious = () => {
    if (currentPhase > 1) {
      setCurrentPhase(currentPhase - 1);
    }
  };

  const handleBasicInfoSubmit = (data: Partial<CourseData>) => {
    setCourseData(prev => ({ ...prev, ...data }));
    handleNext();
  };

  const handleChapterUpdate = (chapters: Chapter[]) => {
    setCourseData(prev => ({ ...prev, chapters }));
  };

  const handleQuizSubmit = (quizzes: Quiz[]) => {
    setCourseData(prev => ({ ...prev, quizzes }));
    handleNext();
  };


  const handleFinalSave = () => {
    const finalCourse: CourseData = {
      ...courseData,
      id: `course_${Date.now()}`,
      createdBy: "Admin",
      createdAt: new Date().toISOString()
    };
    onSave(finalCourse);
  };

  const canProceedToNext = () => {
    switch (currentPhase) {
      case 1:
        return courseData.title && courseData.description && courseData.chapters.length > 0;
      case 2:
        return true; // Quiz is optional
      case 3:
        return true;
      default:
        return false;
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-gray-900">Créer une Formation</h1>
          <Button variant="outline" onClick={onCancel}>
            Annuler
          </Button>
        </div>
        
        {/* Progress Bar */}
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Phase {currentPhase} sur {phases.length}</span>
            <span>{Math.round(progress)}% complété</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        {/* Phase Indicators */}
        <div className="flex items-center space-x-4">
          {phases.map((phase) => (
            <div key={phase.id} className="flex items-center space-x-2">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                phase.id === currentPhase 
                  ? 'bg-primary text-white' 
                  : phase.id < currentPhase 
                    ? 'bg-green-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
              }`}>
                {phase.id < currentPhase ? (
                  <CheckCircle className="h-4 w-4" />
                ) : (
                  phase.id
                )}
              </div>
              <div className="hidden sm:block">
                <p className="text-sm font-medium">{phase.name}</p>
                <p className="text-xs text-gray-500">{phase.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Phase Content */}
      <Card>
        <CardContent className="p-6">
          {currentPhase === 1 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Phase 1: Informations de Base & Structure</h2>
                <p className="text-gray-600">Définissez les détails de votre formation et organisez-la en chapitres.</p>
              </div>
              
              <BasicInfoForm 
                courseData={courseData}
                onUpdate={setCourseData}
              />
              
              <ChapterSetupForm
                chapters={courseData.chapters}
                onUpdate={handleChapterUpdate}
              />
            </div>
          )}

          {currentPhase === 2 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Phase 2: Création des Évaluations</h2>
                <p className="text-gray-600">Ajoutez des quiz et des évaluations pour mesurer les progrès.</p>
              </div>
              
              <QuizCreationForm
                courseId={courseData.id || `temp_${Date.now()}`}
                chapters={courseData.chapters}
                existingQuizzes={courseData.quizzes}
                onQuizzesUpdate={handleQuizSubmit}
              />
            </div>
          )}

          {currentPhase === 3 && (
            <div className="space-y-6">
              <div>
                <h2 className="text-xl font-semibold mb-2">Phase 3: Révision et Finalisation</h2>
                <p className="text-gray-600">Vérifiez votre formation avant de la publier.</p>
              </div>
              
              <CourseReviewForm
                courseData={courseData}
                onFinalSave={handleFinalSave}
              />
            </div>
          )}
        </CardContent>
      </Card>

      {/* Navigation */}
      <div className="flex justify-between">
        <Button
          variant="outline"
          onClick={handlePrevious}
          disabled={currentPhase === 1}
        >
          <ChevronLeft className="h-4 w-4 mr-2" />
          Précédent
        </Button>
        
        <div className="flex gap-2">
          {currentPhase < phases.length ? (
            <Button
              onClick={handleNext}
              disabled={!canProceedToNext()}
            >
              Suivant
              <ChevronRight className="h-4 w-4 ml-2" />
            </Button>
          ) : (
            <Button
              onClick={handleFinalSave}
              className="bg-green-600 hover:bg-green-700 text-white"
            >
              <CheckCircle className="h-4 w-4 mr-2" />
              Publier la Formation
            </Button>
          )}
        </div>
      </div>

    </div>
  );
};

export default CourseCreationWorkflow;