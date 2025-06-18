
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
import { BookOpen, Bell, User, Settings, LogOut, Trophy, Users, BarChart3 } from "lucide-react";

interface HeaderProps {
  userRole?: "student" | "admin";
  onShowAdminPanel?: () => void;
}

const Header = ({ userRole = "student", onShowAdminPanel }: HeaderProps) => {
  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="container mx-auto px-4 py-4 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-2">
          <div className="p-2 bg-blue-600 rounded-lg">
            <BookOpen className="h-6 w-6 text-white" />
          </div>
          <h1 className="text-xl font-bold text-gray-900">ApprendrePlus</h1>
        </div>

        {/* Navigation */}
        <nav className="hidden md:flex items-center gap-6">
          <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
            Cours
          </Button>
          <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
            Mon Apprentissage
          </Button>
          <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
            Réussites
          </Button>
          {userRole === "admin" && (
            <>
              <Button variant="ghost" className="text-gray-600 hover:text-blue-600" onClick={onShowAdminPanel}>
                <Users className="h-4 w-4 mr-2" />
                Étudiants
              </Button>
              <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
                <BarChart3 className="h-4 w-4 mr-2" />
                Analytiques
              </Button>
            </>
          )}
          <Button variant="ghost" className="text-gray-600 hover:text-blue-600">
            Communauté
          </Button>
        </nav>

        {/* User Actions */}
        <div className="flex items-center gap-4">
          {/* Notifications */}
          <Button variant="ghost" size="icon" className="relative">
            <Bell className="h-5 w-5" />
            <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs bg-red-500">
              3
            </Badge>
          </Button>

          {/* User Menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="flex items-center gap-2 hover:bg-gray-100">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>
                    {userRole === "admin" ? "AD" : "JD"}
                  </AvatarFallback>
                </Avatar>
                <span className="hidden md:block text-sm font-medium">
                  {userRole === "admin" ? "Administrateur" : "Jean Dupont"}
                </span>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-56">
              <div className="flex items-center gap-2 p-2">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg" />
                  <AvatarFallback>
                    {userRole === "admin" ? "AD" : "JD"}
                  </AvatarFallback>
                </Avatar>
                <div className="flex flex-col">
                  <span className="text-sm font-medium">
                    {userRole === "admin" ? "Administrateur" : "Jean Dupont"}
                  </span>
                  <span className="text-xs text-gray-500">
                    {userRole === "admin" ? "admin@example.com" : "jean@example.com"}
                  </span>
                </div>
              </div>
              <DropdownMenuSeparator />
              <DropdownMenuItem>
                <User className="mr-2 h-4 w-4" />
                Profil
              </DropdownMenuItem>
              <DropdownMenuItem>
                <Trophy className="mr-2 h-4 w-4" />
                Réussites
              </DropdownMenuItem>
              {userRole === "admin" && (
                <DropdownMenuItem onClick={onShowAdminPanel}>
                  <Users className="mr-2 h-4 w-4" />
                  Gestion des Étudiants
                </DropdownMenuItem>
              )}
              <DropdownMenuItem>
                <Settings className="mr-2 h-4 w-4" />
                Paramètres
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-red-600">
                <LogOut className="mr-2 h-4 w-4" />
                Déconnexion
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  );
};

export default Header;
