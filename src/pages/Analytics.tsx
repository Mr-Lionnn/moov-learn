
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { useAuth } from "@/contexts/AuthContext";

const Analytics = () => {
  const { user } = useAuth();
  
  // Default role if user context doesn't have role info
  const userRole = user?.metadata?.role || 'Employé';
  const userId = user?.id || 'current_user';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <AnalyticsDashboard userRole={userRole} userId={userId} />
      </div>
    </div>
  );
};

export default Analytics;
