import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Users, BookOpen, BarChart3, Clock, CheckCircle, CheckSquare, UserPlus } from "lucide-react";
import QuizCreator from "./QuizCreator";
import ModuleCreator from "./module/ModuleCreator";
import { useAuth } from "@/contexts/AuthContext";
import { Quiz } from "@/types/quiz";
import { LearningModule } from "@/types/module";
import { AdminPanelProps } from "@/types/admin";
import { useAdminData } from "@/hooks/useAdminData";
import CourseCreationTab from "./admin/CourseCreationTab";
import CourseCreationWorkflow from "./admin/CourseCreationWorkflow";
import QuizManagementTab from "./admin/QuizManagementTab";
import DeadlineManagementTab from "./admin/DeadlineManagementTab";
import StudentProgressTab from "./admin/StudentProgressTab";
import AnalyticsTab from "./admin/AnalyticsTab";
import TaskManagementTab from "./admin/TaskManagementTab";
import UserManagementTab from "./admin/UserManagementTab";
import { Team } from "@/types/content";

const AdminPanel = ({ onClose }: AdminPanelProps) => {
  const navigate = useNavigate();
  const { setModuleDeadline, user } = useAuth();
  const [showQuizCreator, setShowQuizCreator] = useState(false);
  const [showModuleCreator, setShowModuleCreator] = useState(false);
  const [showCourseWorkflow, setShowCourseWorkflow] = useState(false);
  const [selectedCourseForQuiz, setSelectedCourseForQuiz] = useState<string | null>(null);
  
  const {
    newCourse,
    setNewCourse,
    failedAttempts,
    questionAnalytics,
    studentProgress
  } = useAdminData();

  const handleCreateCourse = () => {
    if (!newCourse.title || !newCourse.description) return;

    console.log("Création du cours:", newCourse);
    
    // Create course object with unique ID
    const courseId = `course_${Date.now()}`;
    const courseData = {
      id: courseId,
      title: newCourse.title,
      description: newCourse.description,
      instructor: newCourse.instructor || 'Instructeur Expert',
      duration: newCourse.duration || '2h 00min',
      category: newCourse.category || 'Formation',
      level: newCourse.level || 'beginner',
      contentType: 'mixed' as const,
      targetAudience: ['All Employees'],
      learningObjectives: ['Objectif principal de formation'],
      isMandatory: true,
      completionRate: 0,
      enrolledUsers: 0,
      averageScore: 0,
      requiresQuiz: newCourse.requiresQuiz,
      createdBy: user?.name || 'Admin',
      createdAt: new Date().toISOString(),
      isActive: true
    };

    // Save to localStorage
    try {
      const existingCourses = JSON.parse(localStorage.getItem('moov_test_courses') || '[]');
      existingCourses.push(courseData);
      localStorage.setItem('moov_test_courses', JSON.stringify(existingCourses));
      
      console.log('✅ Course saved successfully:', courseData);
      alert(`Formation "${newCourse.title}" créée avec succès!`);
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Erreur lors de la création de la formation');
    }
    
    // If course requires quiz, open quiz creator
    if (newCourse.requiresQuiz) {
      setSelectedCourseForQuiz(courseId);
      setShowQuizCreator(true);
    }

    // Reset form
    setNewCourse({
      title: "",
      description: "",
      instructor: "",
      duration: "",
      category: "",
      level: "",
      requiresQuiz: true
    });
  };

  const handleQuizSave = (quiz: Quiz) => {
    console.log("Quiz créé:", quiz);
    
    // Save quiz to localStorage
    try {
      const existingQuizzes = JSON.parse(localStorage.getItem('moov_test_quizzes') || '[]');
      const quizWithMetadata = {
        ...quiz,
        id: quiz.id || `quiz_${Date.now()}`,
        createdBy: user?.name || 'Admin',
        createdAt: new Date().toISOString(),
        isActive: true
      };
      existingQuizzes.push(quizWithMetadata);
      localStorage.setItem('moov_test_quizzes', JSON.stringify(existingQuizzes));
      
      console.log('✅ Quiz saved successfully:', quizWithMetadata);
      alert(`Quiz "${quiz.title}" créé avec succès!`);
    } catch (error) {
      console.error('Error saving quiz:', error);
      alert('Erreur lors de la création du quiz');
    }
    
    setShowQuizCreator(false);
    setSelectedCourseForQuiz(null);
  };

  const handleModuleSave = (module: LearningModule) => {
    console.log("Module créé:", module);
    
    // Save module to localStorage
    try {
      const existingModules = JSON.parse(localStorage.getItem('moov_learning_modules') || '[]');
      const moduleWithId = {
        ...module,
        id: module.id || `module_${Date.now()}`,
        createdBy: user?.name || 'Admin',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      existingModules.push(moduleWithId);
      localStorage.setItem('moov_learning_modules', JSON.stringify(existingModules));
      
      console.log('✅ Module saved successfully:', moduleWithId);
      alert(`Module "${module.title}" créé avec succès!`);
    } catch (error) {
      console.error('Error saving module:', error);
      alert('Erreur lors de la création du module');
    }
    
    setShowModuleCreator(false);
  };

  const handleSetTimeLimit = (moduleId: string, deadline: string, teamMembers: string[]) => {
    setModuleDeadline(moduleId, deadline, teamMembers);
  };

  const handleCreateQuiz = () => {
    setSelectedCourseForQuiz("standalone_quiz");
    setShowQuizCreator(true);
  };

  const handleCourseWorkflowSave = (courseData: any) => {
    console.log("Course workflow saved:", courseData);
    
    // Save to localStorage
    try {
      const existingCourses = JSON.parse(localStorage.getItem('moov_test_courses') || '[]');
      existingCourses.push(courseData);
      localStorage.setItem('moov_test_courses', JSON.stringify(existingCourses));
      
      console.log('✅ Course saved successfully:', courseData);
      alert(`Formation "${courseData.title}" créée avec succès!`);
    } catch (error) {
      console.error('Error saving course:', error);
      alert('Erreur lors de la création de la formation');
    }
    
    setShowCourseWorkflow(false);
  };

  // Mock teams data for the workflow
  const mockTeams: Team[] = [
    { id: 1, name: "Équipe Développement", memberCount: 8, description: "Équipe de développement", leaderId: 1, createdAt: new Date().toISOString() },
    { id: 2, name: "Équipe Marketing", memberCount: 5, description: "Équipe marketing", leaderId: 2, createdAt: new Date().toISOString() },
    { id: 3, name: "Équipe Support", memberCount: 6, description: "Équipe support", leaderId: 3, createdAt: new Date().toISOString() },
    { id: 4, name: "Équipe Direction", memberCount: 3, description: "Direction", leaderId: 4, createdAt: new Date().toISOString() }
  ];

  // Check if user has permission to upload content
  const canUploadContent = user?.role === 'admin' || user?.role === 'team_chief' || user?.role === 'team_responsible';

  if (showQuizCreator && selectedCourseForQuiz) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
        <div className="bg-white rounded-lg w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center p-3 sm:p-6 border-b">
            <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Créer un Quiz pour le Cours</h2>
            <Button variant="ghost" size="icon" onClick={() => setShowQuizCreator(false)}>
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </Button>
          </div>
          <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-100px)]">
            <QuizCreator
              courseId={selectedCourseForQuiz}
              onSave={handleQuizSave}
              onCancel={() => setShowQuizCreator(false)}
            />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-3 sm:p-6 border-b">
          <h2 className="text-lg sm:text-2xl font-bold text-gray-900">Panneau d'Administration</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4 sm:h-5 sm:w-5" />
          </Button>
        </div>

        <div className="p-3 sm:p-6 overflow-y-auto max-h-[calc(95vh-80px)] sm:max-h-[calc(90vh-100px)]">
          <Tabs defaultValue="users" className="w-full">
            <TabsList className="grid w-full grid-cols-2 sm:grid-cols-3 lg:grid-cols-7 gap-1 h-auto p-1">
              <TabsTrigger value="users" className="text-xs sm:text-sm flex-col sm:flex-row gap-1 h-12 sm:h-10">
                <UserPlus className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline sm:ml-2">Gestion des</span>
                <span>Utilisateurs</span>
              </TabsTrigger>
              <TabsTrigger value="tasks" className="text-xs sm:text-sm flex-col sm:flex-row gap-1 h-12 sm:h-10">
                <CheckSquare className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline sm:ml-2">Gestion des</span>
                <span>Tâches</span>
              </TabsTrigger>
              <TabsTrigger value="courses" className="text-xs sm:text-sm flex-col sm:flex-row gap-1 h-12 sm:h-10">
                <BookOpen className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline sm:ml-2">Gestion des</span>
                <span>Cours</span>
              </TabsTrigger>
              <TabsTrigger value="quizzes" className="text-xs sm:text-sm flex-col sm:flex-row gap-1 h-12 sm:h-10">
                <CheckCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline sm:ml-2">Quiz &</span>
                <span>Évaluations</span>
              </TabsTrigger>
              <TabsTrigger value="deadlines" className="text-xs sm:text-sm flex-col sm:flex-row gap-1 h-12 sm:h-10">
                <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline sm:ml-2">Délais de</span>
                <span>Formation</span>
              </TabsTrigger>
              <TabsTrigger value="students" className="text-xs sm:text-sm flex-col sm:flex-row gap-1 h-12 sm:h-10">
                <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline sm:ml-2">Progrès des</span>
                <span>Employés</span>
              </TabsTrigger>
              <TabsTrigger value="analytics" className="text-xs sm:text-sm flex-col sm:flex-row gap-1 h-12 sm:h-10">
                <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span>Analytiques</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="users" className="space-y-6">
              <UserManagementTab />
            </TabsContent>

            <TabsContent value="tasks" className="space-y-6">
              <TaskManagementTab />
            </TabsContent>

            <TabsContent value="courses" className="space-y-6">
              <div className="space-y-6">
                {/* New Unified Course Creation Button */}
                <div className="text-center space-y-4 p-8 border-2 border-dashed border-gray-300 rounded-lg">
                  <BookOpen className="h-12 w-12 text-gray-400 mx-auto" />
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 mb-2">Créer une Formation Complète</h3>
                    <p className="text-gray-600 mb-4">
                      Workflow guidé en 3 étapes : Structure, Évaluations, et Finalisation
                    </p>
                    <Button 
                      onClick={() => {
                        onClose();
                        navigate('/create-course');
                      }} 
                      size="lg"
                      className="moov-gradient text-white"
                      disabled={!canUploadContent}
                    >
                      <BookOpen className="h-4 w-4 mr-2" />
                      Créer une Formation
                    </Button>
                  </div>
                </div>

                {/* Legacy Course Creation (kept for compatibility) */}
                <CourseCreationTab
                  newCourse={newCourse}
                  setNewCourse={setNewCourse}
                  onCreateCourse={handleCreateCourse}
                  onShowModuleCreator={() => setShowModuleCreator(true)}
                  canUploadContent={canUploadContent}
                />
              </div>
            </TabsContent>

            <TabsContent value="quizzes" className="space-y-6">
              <QuizManagementTab
                failedAttempts={failedAttempts}
                questionAnalytics={questionAnalytics}
                onCreateQuiz={handleCreateQuiz}
              />
            </TabsContent>

            <TabsContent value="deadlines" className="space-y-6">
              <DeadlineManagementTab onSetTimeLimit={handleSetTimeLimit} />
            </TabsContent>

            <TabsContent value="students" className="space-y-6">
              <StudentProgressTab studentProgress={studentProgress} />
            </TabsContent>

            <TabsContent value="analytics" className="space-y-6">
              <AnalyticsTab />
            </TabsContent>
          </Tabs>
        </div>

        {/* Module Creator Modal */}
        {showModuleCreator && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-2 sm:p-4">
            <div className="bg-white rounded-lg w-full max-w-7xl max-h-[98vh] sm:max-h-[95vh] overflow-hidden">
              <div className="h-full overflow-y-auto">
                <ModuleCreator
                  onSave={handleModuleSave}
                  onCancel={() => setShowModuleCreator(false)}
                />
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPanel;