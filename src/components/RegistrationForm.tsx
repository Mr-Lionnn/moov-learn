import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, Building, Users, MapPin, AlertTriangle, ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface RegistrationFormProps {
  onClose: () => void;
}

const RegistrationForm = ({ onClose }: RegistrationFormProps) => {
  const { toast } = useToast();
  
  const [regData, setRegData] = useState({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    role: "employee",
    team: "",
    site: "",
    department: ""
  });
  
  const [regErrors, setRegErrors] = useState<{[key: string]: string}>({});
  const [isRegistering, setIsRegistering] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleRegistration = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsRegistering(true);
    setRegErrors({});

    // Basic validation
    if (regData.password !== regData.confirmPassword) {
      setRegErrors({ confirmPassword: "Les mots de passe ne correspondent pas" });
      setIsRegistering(false);
      return;
    }

    if (!regData.fullName || !regData.email || !regData.password) {
      setRegErrors({ general: "Veuillez remplir tous les champs obligatoires" });
      setIsRegistering(false);
      return;
    }

    try {
      // Simulate registration
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Inscription réussie",
        description: "Votre compte a été créé avec succès!"
      });
      
      onClose();
    } catch (error) {
      setRegErrors({ general: "Erreur lors de l'inscription. Veuillez réessayer." });
    } finally {
      setIsRegistering(false);
    }
  };

  const roles = [
    { value: "admin", label: "Administrateur" },
    { value: "team_chief", label: "Chef d'Équipe" },
    { value: "team_responsible", label: "Responsable d'Équipe" },
    { value: "team_member", label: "Membre d'Équipe" },
    { value: "employee", label: "Employé" },
    { value: "trainee", label: "Stagiaire" },
    { value: "guest", label: "Invité" }
  ];

  const teams = [
    { value: "", label: "Aucune équipe" },
    { value: "dev", label: "Équipe Développement" },
    { value: "design", label: "Équipe Design" },
    { value: "marketing", label: "Équipe Marketing" },
    { value: "sales", label: "Équipe Ventes" },
    { value: "support", label: "Support Client" }
  ];

  const sites = [
    { value: "", label: "Aucun site" },
    { value: "paris", label: "Paris" },
    { value: "lyon", label: "Lyon" },
    { value: "marseille", label: "Marseille" },
    { value: "remote", label: "Télétravail" }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-2 sm:p-4">
      <div className="w-full max-w-2xl">
        <div className="mb-6">
          <Button
            variant="outline"
            onClick={onClose}
            className="mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour à la connexion
          </Button>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-2xl text-center flex items-center justify-center gap-2">
              <UserPlus className="h-6 w-6" />
              Créer un Compte
            </CardTitle>
            <div className="flex justify-center items-center gap-2 mt-4">
              <div className={`w-3 h-3 rounded-full ${currentStep >= 1 ? 'bg-blue-600' : 'bg-gray-300'}`} />
              <div className={`w-3 h-3 rounded-full ${currentStep >= 2 ? 'bg-blue-600' : 'bg-gray-300'}`} />
              <div className={`w-3 h-3 rounded-full ${currentStep >= 3 ? 'bg-blue-600' : 'bg-gray-300'}`} />
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleRegistration} className="space-y-6">
              {regErrors.general && (
                <div className="flex items-center gap-2 p-3 text-sm text-red-800 bg-red-100 border border-red-200 rounded-md">
                  <AlertTriangle className="h-4 w-4" />
                  {regErrors.general}
                </div>
              )}

              {currentStep === 1 && (
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
              )}

              {currentStep === 2 && (
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
              )}

              {currentStep === 3 && (
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
              )}

              <div className="flex justify-between pt-4">
                {currentStep > 1 && (
                  <Button
                    type="button"
                    variant="outline"
                    onClick={() => setCurrentStep(currentStep - 1)}
                  >
                    Précédent
                  </Button>
                )}
                
                {currentStep < 3 ? (
                  <Button
                    type="button"
                    onClick={() => setCurrentStep(currentStep + 1)}
                    className="ml-auto"
                    disabled={currentStep === 1 && (!regData.fullName || !regData.email || !regData.password)}
                  >
                    Suivant
                  </Button>
                ) : (
                  <Button
                    type="submit"
                    disabled={isRegistering}
                    className="ml-auto bg-green-600 hover:bg-green-700"
                  >
                    {isRegistering ? "Création..." : "Créer le Compte"}
                  </Button>
                )}
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegistrationForm;