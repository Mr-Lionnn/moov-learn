import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ArrowLeft, UserPlus, AlertTriangle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { RegistrationData, RegistrationErrors } from "@/types/registration";
import StepIndicator from "@/components/registration/StepIndicator";
import PersonalInfoStep from "@/components/registration/PersonalInfoStep";
import ProfessionalInfoStep from "@/components/registration/ProfessionalInfoStep";
import TeamAssignmentStep from "@/components/registration/TeamAssignmentStep";
import RegistrationStepNavigation from "@/components/registration/RegistrationStepNavigation";

interface RegistrationFormProps {
  onClose: () => void;
}

const RegistrationForm = ({ onClose }: RegistrationFormProps) => {
  const { toast } = useToast();
  
  const [regData, setRegData] = useState<RegistrationData>({
    fullName: "",
    email: "",
    phone: "",
    password: "",
    confirmPassword: "",
    dateOfBirth: "",
    role: "employee",
    team: "none",
    site: "none",
    department: ""
  });
  
  const [regErrors, setRegErrors] = useState<RegistrationErrors>({});
  const [isRegistering, setIsRegistering] = useState(false);
  const [currentStep, setCurrentStep] = useState(1);

  const handleRegistration = async () => {
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
      // Save the new user to localStorage so they can login
      const newUser = {
        id: Date.now(),
        email: regData.email,
        name: regData.fullName,
        role: regData.role,
        department: regData.department,
        teamId: regData.team !== "none" ? regData.team : undefined,
        site: regData.site !== "none" ? regData.site : undefined,
        phone: regData.phone,
        dateOfBirth: regData.dateOfBirth
      };

      // Get existing test users or create new array
      const existingUsers = JSON.parse(localStorage.getItem('moov_test_users') || '[]');
      existingUsers.push(newUser);
      localStorage.setItem('moov_test_users', JSON.stringify(existingUsers));

      // Simulate registration delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      toast({
        title: "Inscription réussie",
        description: `Votre compte a été créé avec succès! Vous pouvez maintenant vous connecter avec ${regData.email}`
      });
      
      onClose();
    } catch (error) {
      setRegErrors({ general: "Erreur lors de l'inscription. Veuillez réessayer." });
    } finally {
      setIsRegistering(false);
    }
  };

  const renderCurrentStep = () => {
    const stepProps = { regData, setRegData, regErrors };
    
    switch (currentStep) {
      case 1:
        return <PersonalInfoStep {...stepProps} />;
      case 2:
        return <ProfessionalInfoStep {...stepProps} />;
      case 3:
        return <TeamAssignmentStep {...stepProps} />;
      default:
        return null;
    }
  };

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
            <StepIndicator currentStep={currentStep} totalSteps={3} />
          </CardHeader>
          <CardContent>
            <form onSubmit={(e) => e.preventDefault()} className="space-y-6">
              {regErrors.general && (
                <div className="flex items-center gap-2 p-3 text-sm text-red-800 bg-red-100 border border-red-200 rounded-md">
                  <AlertTriangle className="h-4 w-4" />
                  {regErrors.general}
                </div>
              )}

              {renderCurrentStep()}

              <RegistrationStepNavigation
                currentStep={currentStep}
                totalSteps={3}
                regData={regData}
                isRegistering={isRegistering}
                onPrevious={() => setCurrentStep(currentStep - 1)}
                onNext={() => setCurrentStep(currentStep + 1)}
                onSubmit={handleRegistration}
              />
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default RegistrationForm;