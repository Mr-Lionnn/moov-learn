
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  FileText,
  CheckSquare,
  Users, 
  UserCheck, 
  BarChart3,
  Settings
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

  const handleAdminPanelClick = () => {
    console.log('MobileNavigation: Admin panel button clicked');
    if (onShowAdminPanel) {
      console.log('MobileNavigation: Calling onShowAdminPanel');
      onShowAdminPanel();
    } else {
      console.log('MobileNavigation: onShowAdminPanel is undefined');
    }
    setShowMobileMenu(false);
  };

  if (!showMobileMenu) return null;

  return (
    <div className="bg-white border-t border-gray-200 px-4 py-4 shadow-lg relative z-40">
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

        {hasPermission('assign_tasks') && (
          <Button 
            variant="ghost" 
            className="justify-start text-gray-600 hover:bg-secondary hover:text-white h-10"
            onClick={() => {
              navigate("/tasks");
              setShowMobileMenu(false);
            }}
          >
            <CheckSquare className="h-4 w-4 mr-3" />
            Tâches
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
        
        {/* Fixed Module Creation Button for Mobile */}
        {(user?.role === 'admin' || user?.role === 'team_chief' || user?.role === 'team_responsible') && (
          <Button 
            variant="default"
            className="justify-start bg-blue-600 hover:bg-blue-700 text-white h-10 font-medium"
            onClick={handleAdminPanelClick}
          >
            <Settings className="h-4 w-4 mr-3" />
            Gérer - Créer Formation
          </Button>
        )}
        
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
