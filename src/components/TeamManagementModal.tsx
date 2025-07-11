
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import TeamCard from "@/components/team/TeamCard";
import TeamCreationForm from "@/components/team/TeamCreationForm";
import TeamStatsOverview from "@/components/team/TeamStatsOverview";

interface Team {
  id: string;
  name: string;
  color: string;
  memberCount: number;
  department: string;
}

interface TeamManagementModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const TeamManagementModal = ({ isOpen, onClose }: TeamManagementModalProps) => {
  const { toast } = useToast();

  const [teams, setTeams] = useState<Team[]>([
    { id: "1", name: "Équipe Support Alpha", color: "#3B82F6", memberCount: 3, department: "IT Support" },
    { id: "2", name: "Équipe Infrastructure", color: "#10B981", memberCount: 2, department: "Infrastructure" },
    { id: "3", name: "Équipe Sécurité", color: "#F59E0B", memberCount: 1, department: "Sécurité" },
  ]);

  const handleCreateTeam = (name: string, color: string, department: string) => {
    if (!name.trim() || !department) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive",
      });
      return;
    }

    const newTeam: Team = {
      id: Date.now().toString(),
      name,
      color,
      memberCount: 0,
      department,
    };

    setTeams([...teams, newTeam]);
    
    toast({
      title: "Équipe créée",
      description: `L'équipe "${name}" a été créée avec succès`,
    });
  };

  const handleDeleteTeam = (teamId: string) => {
    const teamToDelete = teams.find(t => t.id === teamId);
    if (teamToDelete && teamToDelete.memberCount > 0) {
      toast({
        title: "Impossible de supprimer",
        description: "Cette équipe contient encore des membres",
        variant: "destructive",
      });
      return;
    }

    setTeams(teams.filter(t => t.id !== teamId));
    toast({
      title: "Équipe supprimée",
      description: "L'équipe a été supprimée avec succès",
    });
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Gestion des Équipes
          </DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="teams" className="w-full">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="teams">Équipes</TabsTrigger>
            <TabsTrigger value="create">Créer Équipe</TabsTrigger>
            <TabsTrigger value="overview">Vue d'ensemble</TabsTrigger>
          </TabsList>

          <TabsContent value="teams" className="space-y-4">
            <div className="grid gap-4 md:grid-cols-2">
              {teams.map((team) => (
                <TeamCard
                  key={team.id}
                  team={team}
                  onDelete={handleDeleteTeam}
                />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <TeamCreationForm onCreateTeam={handleCreateTeam} />
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <TeamStatsOverview teams={teams} />
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TeamManagementModal;
