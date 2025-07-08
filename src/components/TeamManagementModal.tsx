import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Users, Plus, Edit, Trash, UserPlus, X } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

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
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamColor, setNewTeamColor] = useState("#3B82F6");
  const [newTeamDepartment, setNewTeamDepartment] = useState("");

  const [teams, setTeams] = useState<Team[]>([
    { id: "1", name: "Équipe Support Alpha", color: "#3B82F6", memberCount: 3, department: "IT Support" },
    { id: "2", name: "Équipe Infrastructure", color: "#10B981", memberCount: 2, department: "Infrastructure" },
    { id: "3", name: "Équipe Sécurité", color: "#F59E0B", memberCount: 1, department: "Sécurité" },
  ]);

  const teamColors = [
    { name: "Bleu", value: "#3B82F6" },
    { name: "Vert", value: "#10B981" },
    { name: "Orange", value: "#F59E0B" },
    { name: "Rouge", value: "#EF4444" },
    { name: "Violet", value: "#8B5CF6" },
    { name: "Rose", value: "#EC4899" },
  ];

  const departments = ["IT Support", "Infrastructure", "Sécurité", "Administration"];

  const handleCreateTeam = () => {
    if (!newTeamName.trim() || !newTeamDepartment) {
      toast({
        title: "Erreur",
        description: "Veuillez remplir tous les champs requis",
        variant: "destructive",
      });
      return;
    }

    const newTeam: Team = {
      id: Date.now().toString(),
      name: newTeamName,
      color: newTeamColor,
      memberCount: 0,
      department: newTeamDepartment,
    };

    setTeams([...teams, newTeam]);
    setNewTeamName("");
    setNewTeamDepartment("");
    
    toast({
      title: "Équipe créée",
      description: `L'équipe "${newTeamName}" a été créée avec succès`,
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

  const getTeamStats = () => {
    const totalMembers = teams.reduce((acc, team) => acc + team.memberCount, 0);
    const departmentDistribution = teams.reduce((acc, team) => {
      acc[team.department] = (acc[team.department] || 0) + team.memberCount;
      return acc;
    }, {} as Record<string, number>);

    return { totalMembers, departmentDistribution };
  };

  const stats = getTeamStats();

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
                <Card key={team.id} className="relative">
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-lg flex items-center gap-2">
                        <div
                          className="w-4 h-4 rounded-full"
                          style={{ backgroundColor: team.color }}
                        />
                        {team.name}
                      </CardTitle>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteTeam(team.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      <Badge variant="outline">{team.department}</Badge>
                      <p className="text-sm text-gray-600">
                        {team.memberCount} membre{team.memberCount !== 1 ? 's' : ''}
                      </p>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>

          <TabsContent value="create" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Créer une Nouvelle Équipe</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Nom de l'équipe *
                  </label>
                  <Input
                    placeholder="Ex: Équipe Support Beta"
                    value={newTeamName}
                    onChange={(e) => setNewTeamName(e.target.value)}
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Département *
                  </label>
                  <Select value={newTeamDepartment} onValueChange={setNewTeamDepartment}>
                    <SelectTrigger>
                      <SelectValue placeholder="Sélectionner un département" />
                    </SelectTrigger>
                    <SelectContent>
                      {departments.map((dept) => (
                        <SelectItem key={dept} value={dept}>
                          {dept}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <label className="text-sm font-medium mb-2 block">
                    Couleur de l'équipe
                  </label>
                  <div className="flex gap-2 flex-wrap">
                    {teamColors.map((color) => (
                      <Button
                        key={color.value}
                        variant={newTeamColor === color.value ? "default" : "outline"}
                        size="sm"
                        onClick={() => setNewTeamColor(color.value)}
                        className="flex items-center gap-2"
                      >
                        <div
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: color.value }}
                        />
                        {color.name}
                      </Button>
                    ))}
                  </div>
                </div>

                <Button onClick={handleCreateTeam} className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Créer l'Équipe
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="overview" className="space-y-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-primary">
                    {teams.length}
                  </div>
                  <div className="text-sm text-gray-600">Équipes Totales</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-green-600">
                    {stats.totalMembers}
                  </div>
                  <div className="text-sm text-gray-600">Membres Totaux</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-orange-600">
                    {Object.keys(stats.departmentDistribution).length}
                  </div>
                  <div className="text-sm text-gray-600">Départements</div>
                </CardContent>
              </Card>
              <Card>
                <CardContent className="p-4 text-center">
                  <div className="text-2xl font-bold text-purple-600">
                    {stats.totalMembers > 0 ? Math.round(stats.totalMembers / teams.length) : 0}
                  </div>
                  <div className="text-sm text-gray-600">Moy. par Équipe</div>
                </CardContent>
              </Card>
            </div>

            <Card>
              <CardHeader>
                <CardTitle>Répartition par Département</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {Object.entries(stats.departmentDistribution).map(([dept, count]) => (
                    <div key={dept} className="flex justify-between items-center">
                      <span className="font-medium">{dept}</span>
                      <Badge variant="secondary">{count} membre{count !== 1 ? 's' : ''}</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TeamManagementModal;