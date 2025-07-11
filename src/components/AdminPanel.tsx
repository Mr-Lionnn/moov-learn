
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { X, Users, BookOpen, BarChart3, Clock, CheckCircle, Bell, AlertTriangle, Settings } from "lucide-react";
import QuizCreator from "./QuizCreator";
import ModuleCreator from "./module/ModuleCreator";
import { useAuth } from "@/contexts/AuthContext";
import { Quiz } from "@/types/quiz";
import { LearningModule } from "@/types/module";
import { AdminPanelProps } from "@/types/admin";
import { useAdminData } from "@/hooks/useAdminData";
import CourseCreationTab from "./admin/CourseCreationTab";
import QuizManagementTab from "./admin/QuizManagementTab";
import DeadlineManagementTab from "./admin/DeadlineManagementTab";
import StudentProgressTab from "./admin/StudentProgressTab";
import AnalyticsTab from "./admin/AnalyticsTab";
import TeamManagementModal from "./TeamManagementModal";
import { Badge } from "@/components/ui/badge";
import AdminDashboard from "./admin/AdminDashboard";
import AdminNotifications from "./admin/AdminNotifications";

const AdminPanel = ({ onClose }: AdminPanelProps) => {
  const { setModuleDeadline, user, notifications } = useAuth();
  const [showQuizCreator, setShowQuizCreator] = useState(false);
  const [showModuleCreator, setShowModuleCreator] = useState(false);
  const [showTeamManagement, setShowTeamManagement] = useState(false);
  const [selectedCourseForQuiz, setSelectedCourseForQuiz] = useState<string | null>(null);
  
  const {
    newCourse,
    setNewCourse,
    failedAttempts,
    questionAnalytics,
    studentProgress
  } = useAdminData();

  // Get actionable notifications
  const actionableNotifications = notifications.filter(notif => 
    notif.type === 'deadline' || notif.type === 'warning'
  ).slice(0, 5);

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

  const handleNotificationClick = (notification: any) => {
    // Navigate to specific issue based on notification type
    if (notification.moduleId) {
      // Navigate to specific module
      window.location.href = `/course/${notification.moduleId}`;
    } else if (notification.type === 'deadline') {
      // Navigate to deadline management
      console.log('Navigate to deadline management for:', notification);
    }
  };

  // Check if user has permission to upload content
  const canUploadContent = user?.role === 'admin' || user?.role === 'team_chief' || user?.role === 'team_responsible';

  if (showQuizCreator && selectedCourseForQuiz) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-lg w-full max-w-6xl max-h-[90vh] overflow-hidden">
          <div className="flex justify-between items-center p-6 border-b">
            <h2 className="text-2xl font-bold text-gray-900">Créer un Quiz pour le Cours</h2>
            <Button variant="ghost" size="icon" onClick={() => setShowQuizCreator(false)}>
              <X className="h-5 w-5" />
            </Button>
          </div>
          <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg w-full max-w-7xl max-h-[90vh] overflow-hidden">
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-900">Administration Unifiée</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="p-6 overflow-y-auto max-h-[calc(90vh-100px)]">
          <Tabs defaultValue="dashboard" className="w-full">
            <TabsList className="grid w-full grid-cols-7">
              <TabsTrigger value="dashboard">
                <Settings className="h-4 w-4 mr-2" />
                Tableau de Bord
              </TabsTrigger>
              <TabsTrigger value="courses">
                <BookOpen className="h-4 w-4 mr-2" />
                Cours
              </TabsTrigger>
              <TabsTrigger value="quizzes">
                <CheckCircle className="h-4 w-4 mr-2" />
                Quiz
              </TabsTrigger>
              <TabsTrigger value="deadlines">
                <Clock className="h-4 w-4 mr-2" />
                Délais
              </TabsTrigger>
              <TabsTrigger value="students">
                <Users className="h-4 w-4 mr-2" />
                Étudiants
              </TabsTrigger>
              <TabsTrigger value="analytics">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytiques
              </TabsTrigger>
              <TabsTrigger value="notifications">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
                {actionableNotifications.length > 0 && (
                  <Badge className="ml-1 bg-red-500 text-white text-xs">
                    {actionableNotifications.length}
                  </Badge>
                )}
              </TabsTrigger>
            </TabsList>

            <TabsContent value="dashboard" className="space-y-6">
              <AdminDashboard
                actionableNotifications={actionableNotifications}
                onShowTeamManagement={() => setShowTeamManagement(true)}
                onShowModuleCreator={() => setShowModuleCreator(true)}
                onCreateQuiz={handleCreateQuiz}
              />
            </TabsContent>

            <TabsContent value="notifications" className="space-y-6">
              <AdminNotifications
                actionableNotifications={actionableNotifications}
                onNotificationClick={handleNotificationClick}
              />
            </TabsContent>

            <TabsContent value="courses" className="space-y-6">
              <CourseCreationTab
                newCourse={newCourse}
                setNewCourse={setNewCourse}
                onCreateCourse={handleCreateCourse}
                onShowModuleCreator={() => setShowModuleCreator(true)}
                canUploadContent={canUploadContent}
              />
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
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg w-full max-w-7xl max-h-[95vh] overflow-hidden">
              <div className="h-full overflow-y-auto">
                <ModuleCreator
                  onSave={handleModuleSave}
                  onCancel={() => setShowModuleCreator(false)}
                />
              </div>
            </div>
          </div>
        )}

        {/* Team Management Modal */}
        <TeamManagementModal
          isOpen={showTeamManagement}
          onClose={() => setShowTeamManagement(false)}
        />
      </div>
    </div>
  );
};

export default AdminPanel;
