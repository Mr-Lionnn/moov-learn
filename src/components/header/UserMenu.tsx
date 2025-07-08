import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator 
} from "@/components/ui/dropdown-menu";
import { 
  User, 
  Settings, 
  LogOut, 
  Users, 
  BookOpen
} from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface UserMenuProps {
  onShowAdminPanel?: () => void;
}

const UserMenu = ({ onShowAdminPanel }: UserMenuProps) => {
  const navigate = useNavigate();
  const { user, logout } = useAuth();
  const { toast } = useToast();

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
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="flex items-center gap-1 sm:gap-2 hover:bg-gray-100 p-1 sm:p-2">
          <Avatar className="h-6 w-6 sm:h-8 sm:w-8">
            <AvatarImage src="/placeholder.svg" />
            <AvatarFallback className="text-xs">
              {user ? getInitials(user.name) : "U"}
            </AvatarFallback>
          </Avatar>
          <span className="hidden sm:block xl:block text-sm font-medium max-w-24 truncate">
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
        {onShowAdminPanel && (user?.role === "admin" || user?.role === "team_chief" || user?.role === "team_responsible") && (
          <DropdownMenuItem onClick={onShowAdminPanel}>
            <BookOpen className="mr-2 h-4 w-4" />
            Panneau d'Administration
          </DropdownMenuItem>
        )}
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
  );
};

export default UserMenu;