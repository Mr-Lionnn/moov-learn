
import Header from "@/components/Header";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { useAuth } from "@/hooks/useAuthCompatibility";
import { Button } from "@/components/ui/button";
import { ArrowLeft } from "lucide-react";
import { useNavigate } from "react-router-dom";

const Analytics = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Map English roles to French display names
  const getRoleDisplayName = (role: string) => {
    const roleMap = {
      admin: "Administrateur",
      team_chief: "Chef d'Équipe", 
      team_responsible: "Responsable d'Équipe",
      team_member: "Membre d'Équipe",
      assistant: "Assistant",
      employee: "Employé"
    };
    return roleMap[role as keyof typeof roleMap] || role;
  };
  
  const userRole = getRoleDisplayName(user?.role || 'employee');
  const userId = user?.id?.toString() || 'current_user';

  return (
    <div className="min-h-screen moov-gradient-subtle">
      <Header />
      <div className="container mx-auto px-4 py-8">
        <Button 
          variant="ghost" 
          onClick={() => navigate("/")}
          className="mb-4"
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour au Tableau de Bord
        </Button>
        
        <AnalyticsDashboard userRole={userRole} userId={userId} />
      </div>
    </div>
  );
};

export default Analytics;
