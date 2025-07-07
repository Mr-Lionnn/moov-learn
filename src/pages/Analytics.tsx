
import Header from "@/components/Header";
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { useAuth } from "@/contexts/AuthContext";

const Analytics = () => {
  const { user } = useAuth();
  
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
        <AnalyticsDashboard userRole={userRole} userId={userId} />
      </div>
    </div>
  );
};

export default Analytics;
