import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Plus, Edit, Trash2, CheckCircle, AlertCircle } from "lucide-react";
import { Quiz } from "@/types/quiz";
import { Chapter } from "../CourseCreationWorkflow";
import QuizCreator from "../../QuizCreator";

interface QuizCreationFormProps {
  courseId: string;
  chapters: Chapter[];
  existingQuizzes: Quiz[];
  onQuizzesUpdate: (quizzes: Quiz[]) => void;
}

const QuizCreationForm = ({ 
  courseId, 
  chapters, 
  existingQuizzes, 
  onQuizzesUpdate 
}: QuizCreationFormProps) => {
  const [quizzes, setQuizzes] = useState<Quiz[]>(existingQuizzes);
  const [showQuizCreator, setShowQuizCreator] = useState(false);
  const [editingQuiz, setEditingQuiz] = useState<Quiz | null>(null);
  const [selectedChapterForQuiz, setSelectedChapterForQuiz] = useState<string | null>(null);

  const handleQuizSave = (quiz: Quiz) => {
    const updatedQuizzes = editingQuiz 
      ? quizzes.map(q => q.id === editingQuiz.id ? quiz : q)
      : [...quizzes, quiz];
    
    setQuizzes(updatedQuizzes);
    setShowQuizCreator(false);
    setEditingQuiz(null);
    setSelectedChapterForQuiz(null);
  };

  const handleQuizDelete = (quizId: string) => {
    const updatedQuizzes = quizzes.filter(q => q.id !== quizId);
    setQuizzes(updatedQuizzes);
  };

  const createChapterQuiz = (chapterId: string) => {
    const chapter = chapters.find(c => c.id === chapterId);
    setSelectedChapterForQuiz(chapterId);
    setEditingQuiz(null);
    setShowQuizCreator(true);
  };

  const createCourseQuiz = () => {
    setSelectedChapterForQuiz(null);
    setEditingQuiz(null);
    setShowQuizCreator(true);
  };

  const editQuiz = (quiz: Quiz) => {
    setEditingQuiz(quiz);
    setShowQuizCreator(true);
  };

  const handleContinue = () => {
    onQuizzesUpdate(quizzes);
  };

  const getQuizForChapter = (chapterId: string) => {
    return quizzes.find(q => q.courseId === chapterId);
  };

  const getCourseQuizzes = () => {
    return quizzes.filter(q => q.courseId === courseId);
  };

  if (showQuizCreator) {
    const chapter = selectedChapterForQuiz ? chapters.find(c => c.id === selectedChapterForQuiz) : null;
    const quizTitle = editingQuiz?.title || (chapter ? `Quiz - ${chapter.title}` : "Quiz Final");
    
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold">{editingQuiz ? 'Modifier' : 'Créer'} un Quiz</h3>
            <p className="text-gray-600">
              {chapter ? `Pour le chapitre: ${chapter.title}` : 'Quiz général de la formation'}
            </p>
          </div>
          <Button variant="outline" onClick={() => setShowQuizCreator(false)}>
            Retour
          </Button>
        </div>
        
        <QuizCreator
          courseId={selectedChapterForQuiz || courseId}
          onSave={handleQuizSave}
          onCancel={() => setShowQuizCreator(false)}
          initialQuiz={editingQuiz || undefined}
          suggestedTitle={quizTitle}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Quiz Overview */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-500" />
            Évaluations de la Formation
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-center">
            <div>
              <p className="text-2xl font-bold text-primary">{quizzes.length}</p>
              <p className="text-sm text-gray-600">Quiz créés</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">
                {quizzes.reduce((total, quiz) => total + quiz.questions.length, 0)}
              </p>
              <p className="text-sm text-gray-600">Questions totales</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">
                {Math.round(quizzes.reduce((total, quiz) => total + (quiz.timeLimit || 0), 0) / 60)}
              </p>
              <p className="text-sm text-gray-600">Minutes d'évaluation</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Chapter-specific Quizzes */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Quiz par Chapitre</h3>
        
        {chapters.map((chapter) => {
          const chapterQuiz = getQuizForChapter(chapter.id);
          
          return (
            <Card key={chapter.id}>
              <CardContent className="p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge variant="outline">Chapitre {chapter.order}</Badge>
                    <div>
                      <h4 className="font-medium">{chapter.title}</h4>
                      <p className="text-sm text-gray-600">
                        Durée: {chapter.estimatedDuration} minutes
                      </p>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    {chapterQuiz ? (
                      <>
                        <Badge variant="default" className="flex items-center gap-1">
                          <CheckCircle className="h-3 w-3" />
                          Quiz créé ({chapterQuiz.questions.length} questions)
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => editQuiz(chapterQuiz)}
                        >
                          <Edit className="h-4 w-4 mr-1" />
                          Modifier
                        </Button>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleQuizDelete(chapterQuiz.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Badge variant="secondary" className="flex items-center gap-1">
                          <AlertCircle className="h-3 w-3" />
                          Pas de quiz
                        </Badge>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => createChapterQuiz(chapter.id)}
                        >
                          <Plus className="h-4 w-4 mr-1" />
                          Créer un Quiz
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      {/* Course-level Quizzes */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold">Quiz Généraux de la Formation</h3>
          <Button onClick={createCourseQuiz}>
            <Plus className="h-4 w-4 mr-2" />
            Créer un Quiz Final
          </Button>
        </div>
        
        {getCourseQuizzes().length > 0 ? (
          <div className="space-y-3">
            {getCourseQuizzes().map((quiz) => (
              <Card key={quiz.id}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="font-medium">{quiz.title}</h4>
                      <p className="text-sm text-gray-600">
                        {quiz.questions.length} questions • 
                        {quiz.timeLimit ? ` ${quiz.timeLimit} minutes • ` : ' '}
                        Note de passage: {quiz.passingGrade}%
                      </p>
                    </div>
                    
                    <div className="flex items-center gap-2">
                      <Badge variant="default">Quiz Final</Badge>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => editQuiz(quiz)}
                      >
                        <Edit className="h-4 w-4 mr-1" />
                        Modifier
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleQuizDelete(quiz.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <Card className="text-center py-8">
            <CardContent>
              <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <h4 className="text-lg font-medium text-gray-900 mb-2">Aucun quiz final créé</h4>
              <p className="text-gray-500 mb-4">
                Créez un quiz final pour évaluer la compréhension globale de la formation.
              </p>
              <Button onClick={createCourseQuiz}>
                <Plus className="h-4 w-4 mr-2" />
                Créer un Quiz Final
              </Button>
            </CardContent>
          </Card>
        )}
      </div>

      {/* Continue Button */}
      <div className="flex justify-end pt-4 border-t">
        <Button onClick={handleContinue} size="lg">
          Continuer vers la Révision
          <CheckCircle className="h-4 w-4 ml-2" />
        </Button>
      </div>
    </div>
  );
};

export default QuizCreationForm;