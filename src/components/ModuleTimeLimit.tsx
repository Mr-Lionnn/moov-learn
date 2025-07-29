
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock, Users, Send } from "lucide-react";
import { useAuth } from "@/hooks/useAuthCompatibility";
import { useToast } from "@/hooks/use-toast";

interface ModuleTimeLimitProps {
  onTimeLimit: (moduleId: string, deadline: string, teamMembers: string[]) => void;
}

const ModuleTimeLimit = ({ onTimeLimit }: ModuleTimeLimitProps) => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [selectedModule, setSelectedModule] = useState<string | undefined>(undefined);
  const [deadline, setDeadline] = useState("");
  const [selectedTeam, setSelectedTeam] = useState<string | undefined>(undefined);

  const modules = [
    { id: "tcp-ip", name: "Fondamentaux des Réseaux TCP/IP" },
    { id: "security", name: "Sécurité Informatique Avancée" },
    { id: "linux-admin", name: "Administration Système Linux" },
    { id: "cloud-basics", name: "Introduction au Cloud Computing" }
  ];

  const teams = [
    { id: "network", name: "Équipe Réseau", members: ["kossi.dossou@moov.bj", "fatima.alassane@moov.bj"] },
    { id: "security", name: "Équipe Sécurité", members: ["christelle.adjovi@moov.bj"] },
    { id: "support", name: "Équipe Support", members: ["aminata.bio@moov.bj"] }
  ];

  const handleSetTimeLimit = () => {
    if (!selectedModule || !deadline || !selectedTeam) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive"
      });
      return;
    }

    const team = teams.find(t => t.id === selectedTeam);
    if (!team) return;

    onTimeLimit(selectedModule, deadline, team.members);
    
    toast({
      title: "Délai défini avec succès",
      description: `L'équipe ${team.name} a été notifiée du nouveau délai`,
    });

    // Reset form
    setSelectedModule(undefined);
    setDeadline("");
    setSelectedTeam(undefined);
  };

  // Only show to authorized roles
  if (!user || !['admin', 'team_chief', 'team_responsible'].includes(user.role)) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Clock className="h-5 w-5" />
          Définir un Délai de Formation
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label>Module de Formation</Label>
          <Select value={selectedModule} onValueChange={setSelectedModule}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un module" />
            </SelectTrigger>
            <SelectContent>
              {modules.map((module) => (
                <SelectItem key={module.id} value={module.id}>
                  {module.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <Label>Date Limite</Label>
          <Input
            type="datetime-local"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
          />
        </div>

        <div className="space-y-2">
          <Label>Équipe Cible</Label>
          <Select value={selectedTeam} onValueChange={setSelectedTeam}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une équipe" />
            </SelectTrigger>
            <SelectContent>
              {teams.map((team) => (
                <SelectItem key={team.id} value={team.id}>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4" />
                    {team.name} ({team.members.length} membres)
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <Button onClick={handleSetTimeLimit} className="w-full moov-gradient text-white">
          <Send className="h-4 w-4 mr-2" />
          Définir le Délai et Notifier l'Équipe
        </Button>
      </CardContent>
    </Card>
  );
};

export default ModuleTimeLimit;
