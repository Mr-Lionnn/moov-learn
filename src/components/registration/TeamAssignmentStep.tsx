import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { MapPin } from "lucide-react";
import { StepProps } from "@/types/registration";

const teams = [
  { value: "none", label: "Aucune équipe" },
  { value: "dev", label: "Équipe Développement" },
  { value: "design", label: "Équipe Design" },
  { value: "marketing", label: "Équipe Marketing" },
  { value: "sales", label: "Équipe Ventes" },
  { value: "support", label: "Support Client" }
];

const sites = [
  { value: "none", label: "Aucun site" },
  { value: "paris", label: "Paris" },
  { value: "lyon", label: "Lyon" },
  { value: "marseille", label: "Marseille" },
  { value: "remote", label: "Télétravail" }
];

const TeamAssignmentStep = ({ regData, setRegData }: StepProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <MapPin className="h-5 w-5" />
        Affectation Équipe & Site
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="team">Équipe</Label>
          <Select value={regData.team} onValueChange={(value) => setRegData({...regData, team: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner une équipe" />
            </SelectTrigger>
            <SelectContent>
              {teams.map(team => (
                <SelectItem key={team.value} value={team.value}>
                  {team.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="site">Site</Label>
          <Select value={regData.site} onValueChange={(value) => setRegData({...regData, site: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un site" />
            </SelectTrigger>
            <SelectContent>
              {sites.map(site => (
                <SelectItem key={site.value} value={site.value}>
                  {site.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  );
};

export default TeamAssignmentStep;