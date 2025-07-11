
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  BookOpen, 
  PlayCircle, 
  FileText, 
  Users, 
  Clock, 
  Star,
  CheckCircle,
  ArrowRight,
  Trophy,
  Target
} from "lucide-react";
import LessonContentTabs from "../lessonContent/LessonContentTabs";
import LessonContentTabsContent from "../lessonContent/LessonContentTabsContent";
import QuizInterface from "../QuizInterface";
import ModuleRating from "../ModuleRating";
import CompletionConfirmation from "../CompletionConfirmation";
import { LessonContent } from "@/types/lessonContent";
import { QuizResult } from "@/types/quiz";

interface LessonContentSwitchProps {
  lesson: LessonContent;
  onComplete: () => void;
  onNext: () => void;
  onPrevious: () => void;
  hasNext: boolean;
  hasPrevious: boolean;
  currentLessonIndex: number;
  totalLessons: number;
}

const LessonContentSwitch = ({ 
  lesson, 
  onComplete, 
  onNext, 
  onPrevious, 
  hasNext, 
  hasPrevious,
  currentLessonIndex,
  totalLessons
}: LessonContentSwitchProps) => {
  const [showQuiz, setShowQuiz] = useState(false);
  const [showRating, setShowRating] = useState(false);
  const [showCompletion, setShowCompletion] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);

  const handleLessonComplete = () => {
    if (lesson.hasQuiz && !quizCompleted) {
      setShowQuiz(true);
    } else {
      setShowRating(true);
    }
  };

  const handleQuizComplete = (result: QuizResult) => {
    console.log(`Quiz completed with score: ${result.percentage}`);
    setQuizCompleted(true);
    setShowQuiz(false);
    setShowRating(true);
  };

  const handleRatingSubmit = (ratingData: any) => {
    console.log('Rating submitted:', ratingData);
    setShowRating(false);
    setShowCompletion(true);
  };

  const handleReturnHome = () => {
    window.location.href = "/";
  };

  const handleStartNewTraining = () => {
    window.location.href = "/my-trainings";
  };

  if (showCompletion) {
    return (
      <CompletionConfirmation 
        moduleTitle={lesson.title}
        completionScore={85} // Could be passed from quiz result
        userRating={5} // Could be passed from rating component
        onClose={() => {
          setShowCompletion(false);
          onComplete(); // Call the completion handler
        }}
      />
    );
  }

  if (showRating) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-2xl w-full">
          <Card className="shadow-xl border-0">
            <CardHeader className="text-center pb-6">
              <div className="flex justify-center mb-4">
                <div className="bg-green-100 p-3 rounded-full">
                  <Trophy className="h-8 w-8 text-green-600" />
                </div>
              </div>
              <CardTitle className="text-2xl font-bold text-gray-900">
                Félicitations !
              </CardTitle>
              <p className="text-gray-600 mt-2">
                Vous avez terminé le module avec succès
              </p>
            </CardHeader>
            <CardContent>
              <ModuleRating 
                moduleId={lesson.id} 
                moduleTitle={lesson.title}
                onSubmit={handleRatingSubmit}
                onClose={() => setShowRating(false)}
              />
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (showQuiz && lesson.hasQuiz) {
    return (
      <div className="min-h-screen bg-gray-50 p-4">
        <div className="max-w-4xl mx-auto">
          <QuizInterface
            quiz={{ 
              id: lesson.id,
              courseId: lesson.id,
              title: lesson.title,
              description: lesson.description || '',
              passingGrade: 70,
              timeLimit: 30,
              questions: [],
              createdBy: 'system',
              createdAt: new Date().toISOString(),
              isActive: true
            }}
            onComplete={handleQuizComplete}
            onAbandon={() => setShowQuiz(false)}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Progress Header */}
      <div className="bg-white border-b sticky top-0 z-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Badge variant="outline" className="text-sm">
                Leçon {currentLessonIndex + 1} / {totalLessons}
              </Badge>
              <h1 className="text-xl font-semibold text-gray-900 truncate">
                {lesson.title}
              </h1>
            </div>
            
            <div className="flex items-center space-x-3">
              {hasPrevious && (
                <Button variant="outline" onClick={onPrevious} size="sm">
                  Précédent
                </Button>
              )}
              
              {hasNext ? (
                <Button onClick={onNext} size="sm">
                  Suivant
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              ) : (
                <Button onClick={handleLessonComplete} size="sm" className="bg-green-600 hover:bg-green-700">
                  <CheckCircle className="mr-2 h-4 w-4" />
                  Terminer
                </Button>
              )}
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="mt-4">
            <div className="flex justify-between text-sm text-gray-600 mb-2">
              <span>Progression du module</span>
              <span>{Math.round(((currentLessonIndex + 1) / totalLessons) * 100)}%</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2">
              <div 
                className="bg-blue-600 h-2 rounded-full transition-all duration-300"
                style={{ width: `${((currentLessonIndex + 1) / totalLessons) * 100}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Lesson Metadata */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center text-sm text-gray-600">
              <BookOpen className="h-4 w-4 mr-2" />
              <span>{lesson.type === 'video' ? 'Vidéo' : lesson.type === 'text' ? 'Texte' : 'Audio'}</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Clock className="h-4 w-4 mr-2" />
              <span>{lesson.duration} min</span>
            </div>
            <div className="flex items-center text-sm text-gray-600">
              <Target className="h-4 w-4 mr-2" />
              <span>Niveau {lesson.level || 'Intermédiaire'}</span>
            </div>
            {lesson.hasQuiz && (
              <div className="flex items-center text-sm text-blue-600">
                <CheckCircle className="h-4 w-4 mr-2" />
                <span>Quiz inclus</span>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <LessonContentTabsContent
          title={lesson.title}
          content={lesson.content}
          duration={lesson.duration?.toString()}
          onComplete={handleLessonComplete}
          onQuizComplete={handleQuizComplete}
        />
      </div>
    </div>
  );
};

export default LessonContentSwitch;
