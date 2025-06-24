
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
import { Network, Bell, User, Settings, LogOut, Trophy, Users, BarChart3, BookOpen, Award, UserCheck, Menu } from "lucide-react";
import { useNavigate } from "react-router-dom";
import NotificationCenter from "./NotificationCenter";

interface HeaderProps {
  userRole?: "student" | "admin";
  onShowAdminPanel?: () => void;
}

const Header = ({ userRole = "student", onShowAdminPanel }: HeaderProps) => {
  const navigate = useNavigate();
  const [showNotifications, setShowNotifications] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);

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
            <Button 
              variant="ghost" 
              className="text-gray-600 hover:text-blue-600 text-sm xl:text-base"
              onClick={() => navigate("/certifications")}
            >
              <Award className="h-4 w-4 mr-2" />
              Certifications
            </Button>
            {userRole === "admin" && (
              <>
                <Button 
                  variant="ghost" 
                  className="text-gray-600 hover:text-blue-600 text-sm xl:text-base" 
                  onClick={() => navigate("/employees")}
                >
                  <Users className="h-4 w-4 mr-2" />
                  Employés
                </Button>
                <Button 
                  variant="ghost" 
                  className="text-gray-600 hover:text-blue-600 text-sm xl:text-base"
                  onClick={() => navigate("/analytics")}
                >
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytiques
                </Button>
              </>
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
                      {userRole === "admin" ? "AD" : "JD"}
                    </AvatarFallback>
                  </Avatar>
                  <span className="hidden xl:block text-sm font-medium">
                    {userRole === "admin" ? "Administrateur IT" : "Jean Dupont"}
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
                      {userRole === "admin" ? "Administrateur IT" : "Jean Dupont"}
                    </span>
                    <span className="text-xs text-gray-500">
                      {userRole === "admin" ? "admin@moovlearn.com" : "jean.dupont@moovlearn.com"}
                    </span>
                  </div>
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profil
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/certifications")}>
                  <Trophy className="mr-2 h-4 w-4" />
                  Certifications
                </DropdownMenuItem>
                {userRole === "admin" && (
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
                <DropdownMenuItem className="text-red-600">
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
              <Button 
                variant="ghost" 
                className="justify-start text-gray-600 hover:text-blue-600"
                onClick={() => {
                  navigate("/certifications");
                  setShowMobileMenu(false);
                }}
              >
                <Award className="h-4 w-4 mr-2" />
                Certifications
              </Button>
              {userRole === "admin" && (
                <>
                  <Button 
                    variant="ghost" 
                    className="justify-start text-gray-600 hover:text-blue-600"
                    onClick={() => {
                      navigate("/employees");
                      setShowMobileMenu(false);
                    }}
                  >
                    <Users className="h-4 w-4 mr-2" />
                    Employés
                  </Button>
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
                </>
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
