import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { 
  BookOpen, 
  Clock, 
  Users, 
  CheckCircle, 
  AlertCircle, 
  FileText, 
  Video, 
  Music, 
  Image,
  Target,
  Award,
  Play
} from "lucide-react";
import { CourseData } from "../CourseCreationWorkflow";

interface CourseReviewFormProps {
  courseData: CourseData;
  onFinalSave: () => void;
}

const contentTypeIcons = {
  text: FileText,
  pdf: FileText,
  video: Video,
  audio: Music,
  mixed: Image
};

const CourseReviewForm = ({ courseData, onFinalSave }: CourseReviewFormProps) => {
  const totalDuration = courseData.chapters.reduce((total, chapter) => total + chapter.estimatedDuration, 0);
  const totalQuestions = courseData.quizzes.reduce((total, quiz) => total + quiz.questions.length, 0);
  const completedChapters = courseData.chapters.filter(chapter => 
    chapter.title && chapter.description && (chapter.content || chapter.files.length > 0)
  ).length;
  
  const isReadyToPublish = courseData.title && 
                          courseData.description && 
                          courseData.chapters.length > 0 && 
                          completedChapters === courseData.chapters.length;

  return (
    <div className="space-y-6">
      {/* Course Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Aperçu de la Formation
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="text-xl font-bold text-gray-900">{courseData.title}</h3>
              <p className="text-gray-600 mt-2">{courseData.description}</p>
              
              <div className="flex flex-wrap gap-2 mt-4">
                <Badge variant="outline">{courseData.category}</Badge>
                <Badge variant="outline">{courseData.level}</Badge>
                <Badge variant="outline">{courseData.duration}</Badge>
              </div>
            </div>
            
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-center">
                <div className="p-3 bg-blue-50 rounded-lg">
                  <Clock className="h-6 w-6 text-blue-600 mx-auto mb-1" />
                  <p className="text-lg font-bold text-blue-900">{totalDuration}</p>
                  <p className="text-xs text-blue-700">Minutes</p>
                </div>
                <div className="p-3 bg-green-50 rounded-lg">
                  <BookOpen className="h-6 w-6 text-green-600 mx-auto mb-1" />
                  <p className="text-lg font-bold text-green-900">{courseData.chapters.length}</p>
                  <p className="text-xs text-green-700">Chapitres</p>
                </div>
                <div className="p-3 bg-purple-50 rounded-lg">
                  <Award className="h-6 w-6 text-purple-600 mx-auto mb-1" />
                  <p className="text-lg font-bold text-purple-900">{courseData.quizzes.length}</p>
                  <p className="text-xs text-purple-700">Quiz</p>
                </div>
                <div className="p-3 bg-orange-50 rounded-lg">
                  <Target className="h-6 w-6 text-orange-600 mx-auto mb-1" />
                  <p className="text-lg font-bold text-orange-900">{totalQuestions}</p>
                  <p className="text-xs text-orange-700">Questions</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Learning Objectives */}
      {courseData.learningObjectives.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5" />
              Objectifs d'Apprentissage
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-2">
              {courseData.learningObjectives.map((objective, index) => (
                <li key={index} className="flex items-center gap-2">
                  <CheckCircle className="h-4 w-4 text-green-500 flex-shrink-0" />
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
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Public Cible
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {courseData.targetAudience.map((audience, index) => (
                <Badge key={index} variant="secondary">{audience}</Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Chapters Structure */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Structure des Chapitres
            </div>
            <Badge variant={completedChapters === courseData.chapters.length ? "default" : "secondary"}>
              {completedChapters}/{courseData.chapters.length} terminés
            </Badge>
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {courseData.chapters.map((chapter, index) => {
            const Icon = contentTypeIcons[chapter.contentType];
            const isComplete = chapter.title && chapter.description && (chapter.content || chapter.files.length > 0);
            
            return (
              <div key={chapter.id} className="flex items-center gap-4 p-4 border rounded-lg">
                <div className="flex items-center gap-3">
                  <Badge variant="outline">Ch. {chapter.order}</Badge>
                  <Icon className="h-5 w-5 text-gray-500" />
                  <div className="flex-1">
                    <h4 className="font-medium">{chapter.title}</h4>
                    <p className="text-sm text-gray-600">{chapter.description}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <Clock className="h-3 w-3 text-gray-400" />
                      <span className="text-xs text-gray-500">{chapter.estimatedDuration} min</span>
                      {chapter.files.length > 0 && (
                        <>
                          <Separator orientation="vertical" className="h-3" />
                          <span className="text-xs text-gray-500">{chapter.files.length} fichier(s)</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  {isComplete ? (
                    <CheckCircle className="h-5 w-5 text-green-500" />
                  ) : (
                    <AlertCircle className="h-5 w-5 text-yellow-500" />
                  )}
                </div>
              </div>
            );
          })}
        </CardContent>
      </Card>

      {/* Quizzes Overview */}
      {courseData.quizzes.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5" />
              Évaluations
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-3">
            {courseData.quizzes.map((quiz) => (
              <div key={quiz.id} className="flex items-center justify-between p-3 border rounded-lg">
                <div>
                  <h4 className="font-medium">{quiz.title}</h4>
                  <p className="text-sm text-gray-600">
                    {quiz.questions.length} questions • Note de passage: {quiz.passingGrade}%
                    {quiz.timeLimit && ` • Temps limité: ${quiz.timeLimit} min`}
                  </p>
                </div>
                <Badge variant="default">
                  <Award className="h-3 w-3 mr-1" />
                  Quiz
                </Badge>
              </div>
            ))}
          </CardContent>
        </Card>
      )}

      {/* Readiness Check */}
      <Card className={isReadyToPublish ? "border-green-200 bg-green-50" : "border-yellow-200 bg-yellow-50"}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            {isReadyToPublish ? (
              <CheckCircle className="h-5 w-5 text-green-600" />
            ) : (
              <AlertCircle className="h-5 w-5 text-yellow-600" />
            )}
            État de Préparation
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isReadyToPublish ? (
            <div>
              <p className="text-green-800 mb-4">
                ✅ Votre formation est prête à être publiée ! Tous les éléments essentiels sont en place.
              </p>
              <Button onClick={onFinalSave} size="lg" className="bg-green-600 hover:bg-green-700 text-white">
                <Play className="h-4 w-4 mr-2" />
                Publier la Formation
              </Button>
            </div>
          ) : (
            <div>
              <p className="text-yellow-800 mb-4">
                ⚠️ Certains éléments nécessitent encore votre attention avant la publication.
              </p>
              <ul className="space-y-1 text-sm text-yellow-700">
                {!courseData.title && <li>• Titre de la formation manquant</li>}
                {!courseData.description && <li>• Description de la formation manquante</li>}
                {courseData.chapters.length === 0 && <li>• Aucun chapitre créé</li>}
                {completedChapters < courseData.chapters.length && (
                  <li>• {courseData.chapters.length - completedChapters} chapitre(s) incomplet(s)</li>
                )}
              </ul>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default CourseReviewForm;