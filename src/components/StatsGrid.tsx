import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock, Trophy, TrendingUp, Users, GraduationCap } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { testDataService } from "@/services/testDataService";
import { useMemo, useEffect, useState } from "react";

interface StatsGridProps {
  userRole?: "student" | "admin";
}

const StatsGrid = ({ userRole = "student" }: StatsGridProps) => {
  const { user } = useAuth();
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  // Listen for localStorage changes to update stats in real-time
  useEffect(() => {
    const handleStorageChange = () => {
      setRefreshTrigger(prev => prev + 1);
    };

    window.addEventListener('storage', handleStorageChange);
    
    // Also listen for custom events when we update progress
    window.addEventListener('progressUpdated', handleStorageChange);
    
    return () => {
      window.removeEventListener('storage', handleStorageChange);
      window.removeEventListener('progressUpdated', handleStorageChange);
    };
  }, []);

  const stats = useMemo(() => {
    if (userRole === "admin") {
      const allUsers = testDataService.getTestUsers();
      const allCourses = testDataService.getTestCourses();
      
      // Get progress data from localStorage or service
      const storedProgress = localStorage.getItem('moov_test_progress');
      const allProgress = storedProgress ? JSON.parse(storedProgress) : testDataService.getTestProgress();
      
      // Calculate completion rate
      const completedCount = allProgress.filter(p => p.status === 'completed').length;
      const totalProgress = allProgress.length;
      const completionRate = totalProgress > 0 ? Math.round((completedCount / totalProgress) * 100) : 0;
      
      // Calculate total certifications
      const totalCertifications = allProgress.filter(p => p.status === 'completed').length;

      return [
        {
          title: "Total Employés",
          value: allUsers.length.toString(),
          description: "Utilisateurs actifs",
          icon: Users,
          color: "text-blue-600",
          bgColor: "bg-blue-100"
        },
        {
          title: "Modules Créés",
          value: allCourses.length.toString(),
          description: "Contenus disponibles",
          icon: BookOpen,
          color: "text-green-600",
          bgColor: "bg-green-100"
        },
        {
          title: "Taux Réussite",
          value: `${completionRate}%`,
          description: "Moyenne équipe",
          icon: Trophy,
          color: "text-yellow-600",
          bgColor: "bg-yellow-100"
        },
        {
          title: "Certifications",
          value: totalCertifications.toString(),
          description: "Délivrées au total",
          icon: GraduationCap,
          color: "text-purple-600",
          bgColor: "bg-purple-100"
        }
      ];
    } else {
      // Student stats - calculate from actual user data
      if (!user?.id) {
        return [
          {
            title: "Formations Actives",
            value: "0",
            description: "Modules en cours",
            icon: BookOpen,
            color: "text-blue-600",
            bgColor: "bg-blue-100"
          },
          {
            title: "Heures Formation",
            value: "0 h",
            description: "Ce mois-ci",
            icon: Clock,
            color: "text-green-600",
            bgColor: "bg-green-100"
          },
          {
            title: "Certifications",
            value: "0",
            description: "Réussi",
            icon: Trophy,
            color: "text-yellow-600",
            bgColor: "bg-yellow-100"
          },
          {
            title: "Score Moyen",
            value: "0%",
            description: "Aux évaluations",
            icon: TrendingUp,
            color: "text-purple-600",
            bgColor: "bg-purple-100"
          }
        ];
      }

      // Get progress data from localStorage first, then fallback to service
      const storedProgress = localStorage.getItem('moov_test_progress');
      const allProgress = storedProgress ? JSON.parse(storedProgress) : testDataService.getTestProgress();
      const userProgress = allProgress.filter(p => p.userId === user.id);
      
      // Calculate active modules (in progress)
      const activeModules = userProgress.filter(p => p.status === 'in_progress').length;
      
      // Calculate total time spent this month (simplified calculation)
      const totalTimeSpent = userProgress.reduce((total, p) => total + (p.timeSpent || 0), 0);
      const hoursSpent = Math.round(totalTimeSpent / 60 * 10) / 10; // Convert minutes to hours with 1 decimal
      
      // Calculate completed modules
      const completedModules = userProgress.filter(p => p.status === 'completed').length;
      
      // Calculate average score
      const scoresWithResults = userProgress.filter(p => p.quizScore !== undefined && p.quizScore > 0);
      const averageScore = scoresWithResults.length > 0 
        ? Math.round(scoresWithResults.reduce((sum, p) => sum + (p.quizScore || 0), 0) / scoresWithResults.length)
        : 0;

      return [
        {
          title: "Formations Actives",
          value: activeModules.toString(),
          description: "Modules en cours",
          icon: BookOpen,
          color: "text-blue-600",
          bgColor: "bg-blue-100"
        },
        {
          title: "Heures Formation",
          value: `${hoursSpent} h`,
          description: "Ce mois-ci",
          icon: Clock,
          color: "text-green-600",
          bgColor: "bg-green-100"
        },
        {
          title: "Certifications",
          value: `${completedModules}`,
          description: "Réussi",
          icon: Trophy,
          color: "text-yellow-600",
          bgColor: "bg-yellow-100"
        },
        {
          title: "Score Moyen",
          value: `${averageScore}%`,
          description: "Aux évaluations",
          icon: TrendingUp,
          color: "text-purple-600",
          bgColor: "bg-purple-100"
        }
      ];
    }
  }, [user, userRole, refreshTrigger]);

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow duration-300 border-0 shadow-sm">
          <CardContent className="p-4 sm:p-5 lg:p-6">
            <div className="flex items-center gap-3 sm:gap-4">
              <div className={`p-2 sm:p-3 rounded-lg ${stat.bgColor} flex-shrink-0`}>
                <stat.icon className={`h-5 w-5 sm:h-6 sm:w-6 ${stat.color}`} />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xl sm:text-2xl lg:text-3xl font-bold text-gray-900 leading-tight mb-1">
                  {stat.value}
                </p>
                <p className="text-xs sm:text-sm text-gray-600 truncate">
                  {stat.description}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsGrid;
