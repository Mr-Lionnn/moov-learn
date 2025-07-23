import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  FileText,
  Users, 
  Target
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface DesktopNavigationProps {
  onShowAdminPanel?: () => void;
}

const DesktopNavigation = ({ 
  onShowAdminPanel
}: DesktopNavigationProps) => {
  const navigate = useNavigate();
  const { user, hasPermission, canManageUsers, canAccessFiles } = useAuth();

  return (
    <nav className="hidden lg:flex items-center gap-2 xl:gap-4 flex-1 justify-center">
      <Button 
        variant="ghost" 
        className="text-gray-600 hover:bg-secondary hover:text-white text-sm px-2 xl:px-3"
        onClick={() => navigate("/my-trainings")}
      >
        <BookOpen className="h-4 w-4 mr-1 xl:mr-2" />
        <span className="hidden xl:inline">Mes Formations</span>
        <span className="xl:hidden">Formations</span>
      </Button>

      {canAccessFiles() && (
        <Button 
          variant="ghost" 
          className="text-gray-600 hover:bg-secondary hover:text-white text-sm px-2 xl:px-3"
          onClick={() => navigate("/files")}
        >
          <FileText className="h-4 w-4 mr-1 xl:mr-2" />
          <span>Fichiers</span>
        </Button>
      )}

      {/* Unified Administration Button - replaces both Gestion and Tâches */}
      {(hasPermission('assign_tasks') || user?.role === 'admin' || user?.role === 'team_chief' || user?.role === 'team_responsible') && (
        <Button 
          variant="ghost" 
          className="text-gray-600 hover:bg-secondary hover:text-white text-sm px-2 xl:px-3"
          onClick={() => navigate("/admin")}
        >
          <Target className="h-4 w-4 mr-1 xl:mr-2" />
          <span>Administration</span>
        </Button>
      )}

      {/* Team/Employee Section - Role-based */}
      <Button 
        variant="ghost" 
        className="text-gray-600 hover:bg-secondary hover:text-white text-sm px-2 xl:px-3"
        onClick={() => navigate(user?.role === 'admin' ? "/employees" : "/team")}
      >
        <Users className="h-4 w-4 mr-1 xl:mr-2" />
        <span>{user?.role === 'admin' ? 'Employés' : 'Équipe'}</span>
      </Button>

      {/* Module Creation for Admins and Chiefs */}
      {(user?.role === 'admin' || user?.role === 'team_chief' || user?.role === 'team_responsible') && (
        <Button 
          variant="ghost" 
          className="text-gray-600 hover:bg-secondary hover:text-white text-sm px-2 xl:px-3 bg-blue-50 hover:bg-blue-100 border border-blue-200"
          onClick={() => navigate("/admin?tab=courses")}
        >
          <BookOpen className="h-4 w-4 mr-1 xl:mr-2" />
          <span className="hidden xl:inline">Créer Formation</span>
          <span className="xl:hidden">Créer</span>
        </Button>
      )}
    </nav>
  );
};

export default DesktopNavigation;