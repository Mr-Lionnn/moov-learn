import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  FileText,
  CheckSquare,
  Users, 
  UserCheck, 
  Target,
  ChevronDown
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { DropdownMenu, DropdownMenuContent, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import TaskManagementDropdown from "./TaskManagementDropdown";

interface DesktopNavigationProps {
  onShowAdminPanel?: () => void;
  showTasksDropdown: boolean;
  setShowTasksDropdown: (show: boolean) => void;
}

const DesktopNavigation = ({ 
  onShowAdminPanel, 
  showTasksDropdown, 
  setShowTasksDropdown 
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

      {/* Task Management Dropdown */}
      <DropdownMenu open={showTasksDropdown} onOpenChange={setShowTasksDropdown}>
        <DropdownMenuTrigger asChild>
          <Button 
            variant="ghost" 
            className="text-gray-600 hover:bg-secondary hover:text-white text-sm px-2 xl:px-3"
          >
            <Target className="h-4 w-4 mr-1 xl:mr-2" />
            <span>Gestion</span>
            <ChevronDown className="h-3 w-3 ml-1" />
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="start" className="w-80 p-0">
          <TaskManagementDropdown 
            onNavigate={(path) => {
              navigate(path);
              setShowTasksDropdown(false);
            }}
          />
        </DropdownMenuContent>
      </DropdownMenu>
      
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

      {hasPermission('assign_tasks') && (
        <Button 
          variant="ghost" 
          className="text-gray-600 hover:bg-secondary hover:text-white text-sm px-2 xl:px-3"
          onClick={() => navigate("/tasks")}
        >
          <CheckSquare className="h-4 w-4 mr-1 xl:mr-2" />
          <span>Tâches</span>
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
          onClick={() => {
            if (onShowAdminPanel) {
              onShowAdminPanel();
            }
          }}
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