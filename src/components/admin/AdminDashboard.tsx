
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Users, BookOpen, AlertTriangle } from "lucide-react";

interface AdminDashboardProps {
  actionableNotifications: any[];
  onShowTeamManagement: () => void;
  onShowModuleCreator: () => void;
  onCreateQuiz: () => void;
}

const AdminDashboard = ({ 
  actionableNotifications, 
  onShowTeamManagement, 
  onShowModuleCreator, 
  onCreateQuiz 
}: AdminDashboardProps) => {
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={onShowTeamManagement}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Gestion d'Équipe
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Gérer les équipes et les membres</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BookOpen className="h-5 w-5" />
              Formations Actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold">12</p>
            <p className="text-sm text-gray-600">Modules en cours</p>
          </CardContent>
        </Card>

        <Card className="cursor-pointer hover:shadow-lg transition-shadow">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5" />
              Alertes Actives
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-2xl font-bold text-red-600">{actionableNotifications.length}</p>
            <p className="text-sm text-gray-600">Notifications urgentes</p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle>Actions Rapides</CardTitle>
        </CardHeader>
        <CardContent className="flex flex-wrap gap-3">
          <Button onClick={onShowModuleCreator}>
            Créer un Module
          </Button>
          <Button onClick={onCreateQuiz} variant="outline">
            Créer un Quiz
          </Button>
          <Button onClick={onShowTeamManagement} variant="outline">
            Gérer les Équipes
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminDashboard;
