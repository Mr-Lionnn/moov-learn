import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Building } from "lucide-react";
import { StepProps } from "@/types/registration";

const roles = [
  { value: "admin", label: "Administrateur" },
  { value: "team_chief", label: "Chef d'Équipe" },
  { value: "team_responsible", label: "Responsable d'Équipe" },
  { value: "team_member", label: "Membre d'Équipe" },
  { value: "employee", label: "Employé" },
  { value: "trainee", label: "Stagiaire" },
  { value: "guest", label: "Invité" }
];

const ProfessionalInfoStep = ({ regData, setRegData }: StepProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <Building className="h-5 w-5" />
        Informations Professionnelles
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="role">Rôle</Label>
          <Select value={regData.role} onValueChange={(value) => setRegData({...regData, role: value})}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un rôle" />
            </SelectTrigger>
            <SelectContent>
              {roles.map(role => (
                <SelectItem key={role.value} value={role.value}>
                  {role.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="department">Département</Label>
          <Input
            id="department"
            value={regData.department}
            onChange={(e) => setRegData({...regData, department: e.target.value})}
            placeholder="IT, RH, Marketing..."
          />
        </div>
      </div>
    </div>
  );
};

export default ProfessionalInfoStep;