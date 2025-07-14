import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  FileText,
  CheckSquare,
  Users, 
  UserCheck, 
  BarChart3 
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

interface MobileNavigationProps {
  showMobileMenu: boolean;
  setShowMobileMenu: (show: boolean) => void;
  onShowAdminPanel?: () => void;
}

const MobileNavigation = ({ 
  showMobileMenu, 
  setShowMobileMenu, 
  onShowAdminPanel 
}: MobileNavigationProps) => {
  const navigate = useNavigate();
  const { user, hasPermission, canManageUsers, canAccessFiles } = useAuth();

  if (!showMobileMenu) return null;

  return (
    <div className="lg:hidden bg-white border-t border-gray-200 px-4 py-4 shadow-lg">
      <nav className="flex flex-col space-y-2">
        <Button 
          variant="ghost" 
          className="justify-start text-gray-600 hover:bg-secondary hover:text-white h-10"
          onClick={() => {
            navigate("/my-trainings");
            setShowMobileMenu(false);
          }}
        >
          <BookOpen className="h-4 w-4 mr-3" />
          Mes Formations
        </Button>
        
        {canAccessFiles() && (
          <Button 
            variant="ghost" 
            className="justify-start text-gray-600 hover:bg-secondary hover:text-white h-10"
            onClick={() => {
              navigate("/files");
              setShowMobileMenu(false);
            }}
          >
            <FileText className="h-4 w-4 mr-3" />
            Fichiers
          </Button>
        )}

        {/* Unified Administration Button - replaces both Tâches and admin access */}
        {(hasPermission('assign_tasks') || user?.role === 'admin' || user?.role === 'team_chief' || user?.role === 'team_responsible') && (
          <Button 
            variant="ghost" 
            className="justify-start text-gray-600 hover:bg-secondary hover:text-white h-10"
            onClick={() => {
              onShowAdminPanel && onShowAdminPanel();
              setShowMobileMenu(false);
            }}
          >
            <CheckSquare className="h-4 w-4 mr-3" />
            Administration
          </Button>
        )}

        {/* Team/Employee Section - Role-based */}
        <Button 
          variant="ghost" 
          className="justify-start text-gray-600 hover:bg-secondary hover:text-white h-10"
          onClick={() => {
            navigate(user?.role === 'admin' ? "/employees" : "/team");
            setShowMobileMenu(false);
          }}
        >
          <Users className="h-4 w-4 mr-3" />
          {user?.role === 'admin' ? 'Employés' : 'Équipe'}
        </Button>
        
        {hasPermission('view_analytics') && (
          <Button 
            variant="ghost" 
            className="justify-start text-gray-600 hover:bg-secondary hover:text-white h-10"
            onClick={() => {
              navigate("/analytics");
              setShowMobileMenu(false);
            }}
          >
            <BarChart3 className="h-4 w-4 mr-3" />
            Analytiques
          </Button>
        )}
      </nav>
    </div>
  );
};

export default MobileNavigation;