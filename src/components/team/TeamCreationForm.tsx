
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Plus } from "lucide-react";

interface Team {
  id: string;
  name: string;
  color: string;
  memberCount: number;
  department: string;
}

interface TeamCreationFormProps {
  onCreateTeam: (name: string, color: string, department: string) => void;
}

const TeamCreationForm = ({ onCreateTeam }: TeamCreationFormProps) => {
  const [newTeamName, setNewTeamName] = useState("");
  const [newTeamColor, setNewTeamColor] = useState("#3B82F6");
  const [newTeamDepartment, setNewTeamDepartment] = useState<string | undefined>(undefined);

  const teamColors = [
    { name: "Bleu", value: "#3B82F6" },
    { name: "Vert", value: "#10B981" },
    { name: "Orange", value: "#F59E0B" },
    { name: "Rouge", value: "#EF4444" },
    { name: "Violet", value: "#8B5CF6" },
    { name: "Rose", value: "#EC4899" },
  ];

  const departments = ["IT Support", "Infrastructure", "Sécurité", "Administration"];

  const handleSubmit = () => {
    if (newTeamName.trim() && newTeamDepartment) {
      onCreateTeam(newTeamName, newTeamColor, newTeamDepartment);
      setNewTeamName("");
      setNewTeamDepartment(undefined);
      setNewTeamColor("#3B82F6");
    }
  };

  return (
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

        <Button onClick={handleSubmit} className="w-full">
          <Plus className="h-4 w-4 mr-2" />
          Créer l'Équipe
        </Button>
      </CardContent>
    </Card>
  );
};

export default TeamCreationForm;
