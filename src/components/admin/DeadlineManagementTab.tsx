import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ModuleTimeLimit from "../ModuleTimeLimit";

interface DeadlineManagementTabProps {
  onSetTimeLimit: (moduleId: string, deadline: string, teamMembers: string[]) => void;
}

const DeadlineManagementTab = ({ onSetTimeLimit }: DeadlineManagementTabProps) => {
  return (
    <div className="space-y-6">
      <ModuleTimeLimit onTimeLimit={onSetTimeLimit} />
      
      <Card>
        <CardHeader>
          <CardTitle>Délais Actifs</CardTitle>
          <CardDescription>
            Gérez les délais de formation en cours
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Fondamentaux des Réseaux TCP/IP</h4>
                <p className="text-sm text-gray-600">Équipe Réseau • Échéance: 30 Déc 2024</p>
              </div>
              <Badge className="bg-orange-100 text-orange-800">En cours</Badge>
            </div>
            <div className="flex justify-between items-center p-3 border rounded-lg">
              <div>
                <h4 className="font-medium">Sécurité Informatique Avancée</h4>
                <p className="text-sm text-gray-600">Équipe Sécurité • Échéance: 15 Jan 2025</p>
              </div>
              <Badge className="bg-blue-100 text-blue-800">Planifié</Badge>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DeadlineManagementTab;