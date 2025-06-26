import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import { 
  Network, 
  Bell, 
  User, 
  Settings, 
  LogOut, 
  Users, 
  BarChart3, 
  BookOpen, 
  UserCheck, 
  Menu, 
  FileText,
  Tasks
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import NotificationCenter from "./NotificationCenter";

interface HeaderProps {
  onShowAdminPanel?: () => void;
}

const Header = ({ onShowAdminPanel }: HeaderProps) => {
  const navigate = useNavigate();
  const { user, logout, hasPermission, canManageUsers, canAccessFiles } = useAuth();
  const { toast } = useToast();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

  const handleLogout = () => {
    logout();
    toast({
      title: "Déconnexion réussie",
      description: "À bientôt !",
    });
    navigate("/login");
  };

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase();
  };

  const getRoleLabel = (role: string) => {
    const roleLabels = {
      admin: "Administrateur",
      team_chief: "Chef d'Équipe",
      team_responsible: "Responsable d'Équipe",
      team_member: "Membre d'Équipe",
      assistant: "Assistant",
      employee: "Employé"
    };
    return roleLabels[role as keyof typeof roleLabels] || role;
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-40">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 cursor-pointer" onClick={() => navigate("/")}>
            <div className="p-2 bg-blue-600 rounded-lg">
              <Network className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
            </div>
            <h1 className="text-lg sm:text-xl font-bold text-gray-900">MoovLearn</h1>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex items-center gap-4 xl:gap-6">
            <Button 
              variant="ghost" 
              className="text-gray-600 hover:text-blue-600 text-sm xl:text-base"
              onClick={() => navigate("/my-trainings")}
            >
              <BookOpen className="h-4 w-4 mr-2" />
              Mes Formations
            </Button>
            
            {canAccessFiles() && (
              <Button 
                variant="ghost" 
                className="text-gray-600 hover:text-blue-600 text-sm xl:text-base"
                onClick={() => navigate("/files")}
              >
                <FileText className="h-4 w-4 mr-2" />
                Fichiers
              </Button>
            )}

            {hasPermission('assign_tasks') && (
              <Button 
                variant="ghost" 
                className="text-gray-600 hover:text-blue-600 text-sm xl:text-base"
                onClick={() => navigate("/tasks")}
              >
                <Tasks className="h-4 w-4 mr-2" />
                Tâches
              </Button>
            )}

            {canManageUsers() && (
              <Button 
                variant="ghost" 
                className="text-gray-600 hover:text-blue-600 text-sm xl:text-base" 
                onClick={() => navigate("/employees")}
              >
                <Users className="h-4 w-4 mr-2" />
                {user?.role === 'admin' ? 'Employés' : 'Équipe'}
              </Button>
            )}
            
            {hasPermission('view_analytics') && (
              <Button 
                variant="ghost" 
                className="text-gray-600 hover:text-blue-600 text-sm xl:text-base"
                onClick={() => navigate("/analytics")}
              >
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytiques
              </Button>
            )}

            <Button 
              variant="ghost" 
              className="text-gray-600 hover:text-blue-600 text-sm xl:text-base"
              onClick={() => navigate("/team")}
            >
              <UserCheck className="h-4 w-4 mr-2" />
              Équipe
            </Button>
          </nav>

          {/* Mobile Navigation Toggle */}
          <div className="lg:hidden">
            <Button 
              variant="ghost" 
              size="icon"
              onClick={() => setShowMobileMenu(!showMobileMenu)}
            >
              <Menu className="h-5 w-5" />
            </Button>
          </div>

          {/* User Actions */}
          <div className="flex items-center gap-2 sm:gap-4">
            {/* Notifications */}
            <Button 
              variant="ghost" 
              size="icon" 
              className="relative"
              onClick={() => setShowNotifications(true)}
            >
              <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
              <Badge className="absolute -top-1 -right-1 h-4 w-4 sm:h-5 sm:w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
                3
              </Badge>
            </Button>

            {/* User Menu */}
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-100 p-1 sm:p-2">
                  <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback className="text-xs sm:text-sm">
                      {user ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden xl:block text-sm font-medium">
                    {user?.name || "Utilisateur"}
                  </span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <div className="flex items-center gap-2 p-2">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src="/placeholder.svg" />
                    <AvatarFallback>
                      {user ? getInitials(user.name) : "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex flex-col">
                    <span className="text-sm font-medium">
                      {user?.name || "Utilisateur"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {user ? getRoleLabel(user.role) : "Rôle"}
                    </span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profil
                </DropdownMenuItem>
                {onShowAdminPanel && user?.role === "admin" && (
                  <DropdownMenuItem onClick={onShowAdminPanel}>
                    <Users className="mr-2 h-4 w-4" />
                    Gestion des Employés
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem onClick={() => navigate("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Paramètres
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Déconnexion
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        {/* Mobile Navigation Menu */}
        {showMobileMenu && (
          <div className="lg:hidden bg-white border-t border-gray-200 px-4 py-4">
            <nav className="flex flex-col space-y-2">
              <Button 
                variant="ghost" 
                className="justify-start text-gray-600 hover:text-blue-600"
                onClick={() => {
                  navigate("/my-trainings");
                  setShowMobileMenu(false);
                }}
              >
                <BookOpen className="h-4 w-4 mr-2" />
                Mes Formations
              </Button>
              
              {canAccessFiles() && (
                <Button 
                  variant="ghost" 
                  className="justify-start text-gray-600 hover:text-blue-600"
                  onClick={() => {
                    navigate("/files");
                    setShowMobileMenu(false);
                  }}
                >
                  <FileText className="h-4 w-4 mr-2" />
                  Fichiers
                </Button>
              )}

              {canManageUsers() && (
                <Button 
                  variant="ghost" 
                  className="justify-start text-gray-600 hover:text-blue-600"
                  onClick={() => {
                    navigate("/employees");
                    setShowMobileMenu(false);
                  }}
                >
                  <Users className="h-4 w-4 mr-2" />
                  {user?.role === 'admin' ? 'Employés' : 'Équipe'}
                </Button>
              )}
              
              {hasPermission('view_analytics') && (
                <Button 
                  variant="ghost" 
                  className="justify-start text-gray-600 hover:text-blue-600"
                  onClick={() => {
                    navigate("/analytics");
                    setShowMobileMenu(false);
                  }}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytiques
                </Button>
              )}

              <Button 
                variant="ghost" 
                className="justify-start text-gray-600 hover:text-blue-600"
                onClick={() => {
                  navigate("/team");
                  setShowMobileMenu(false);
                }}
              >
                <UserCheck className="h-4 w-4 mr-2" />
                Équipe
              </Button>
            </nav>
          </div>
        )}
      </header>

      {/* Notification Center */}
      {showNotifications && (
        <NotificationCenter onClose={() => setShowNotifications(false)} />
      )}
    </>
  );
};

export default Header;
