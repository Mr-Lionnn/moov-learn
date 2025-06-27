
import AnalyticsDashboard from "@/components/AnalyticsDashboard";
import { useAuth } from "@/contexts/AuthContext";

const Analytics = () => {
  const { user } = useAuth();
  
  // Use role directly from user object, with fallback
  const userRole = user?.role || 'employee';
  const userId = user?.id?.toString() || 'current_user';

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="container mx-auto px-4 py-8">
        <AnalyticsDashboard userRole={userRole} userId={userId} />
      </div>
    </div>
  );
};

export default Analytics;
