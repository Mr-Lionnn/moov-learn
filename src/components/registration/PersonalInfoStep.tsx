import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { UserPlus } from "lucide-react";
import { StepProps } from "@/types/registration";

const PersonalInfoStep = ({ regData, setRegData, regErrors }: StepProps) => {
  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold flex items-center gap-2">
        <UserPlus className="h-5 w-5" />
        Informations Personnelles
      </h3>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="fullName">Nom Complet *</Label>
          <Input
            id="fullName"
            value={regData.fullName}
            onChange={(e) => setRegData({...regData, fullName: e.target.value})}
            placeholder="Jean Dupont"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="regEmail">Email *</Label>
          <Input
            id="regEmail"
            type="email"
            value={regData.email}
            onChange={(e) => setRegData({...regData, email: e.target.value})}
            placeholder="jean.dupont@company.com"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="phone">Téléphone</Label>
          <Input
            id="phone"
            type="tel"
            value={regData.phone}
            onChange={(e) => setRegData({...regData, phone: e.target.value})}
            placeholder="+33 1 23 45 67 89"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="dateOfBirth">Date de Naissance</Label>
          <Input
            id="dateOfBirth"
            type="date"
            value={regData.dateOfBirth}
            onChange={(e) => setRegData({...regData, dateOfBirth: e.target.value})}
          />
        </div>
      </div>
      
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="regPassword">Mot de Passe *</Label>
          <Input
            id="regPassword"
            type="password"
            value={regData.password}
            onChange={(e) => setRegData({...regData, password: e.target.value})}
            placeholder="••••••••"
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword">Confirmer le Mot de Passe *</Label>
          <Input
            id="confirmPassword"
            type="password"
            value={regData.confirmPassword}
            onChange={(e) => setRegData({...regData, confirmPassword: e.target.value})}
            placeholder="••••••••"
            className={regErrors.confirmPassword ? "border-red-500" : ""}
            required
          />
          {regErrors.confirmPassword && (
            <p className="text-sm text-red-600">{regErrors.confirmPassword}</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default PersonalInfoStep;