import { Button } from "@/components/ui/button";
import { RegistrationData } from "@/types/registration";

interface RegistrationStepNavigationProps {
  currentStep: number;
  totalSteps: number;
  regData: RegistrationData;
  isRegistering: boolean;
  onPrevious: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

const RegistrationStepNavigation = ({
  currentStep,
  totalSteps,
  regData,
  isRegistering,
  onPrevious,
  onNext,
  onSubmit
}: RegistrationStepNavigationProps) => {
  const isStep1Valid = regData.fullName && regData.email && regData.password;

  return (
    <div className="flex justify-between pt-4">
      {currentStep > 1 && (
        <Button
          type="button"
          variant="outline"
          onClick={onPrevious}
        >
          Précédent
        </Button>
      )}
      
      {currentStep < totalSteps ? (
        <Button
          type="button"
          onClick={onNext}
          className="ml-auto"
          disabled={currentStep === 1 && !isStep1Valid}
        >
          Suivant
        </Button>
      ) : (
        <Button
          type="button"
          onClick={onSubmit}
          disabled={isRegistering}
          className="ml-auto bg-green-600 hover:bg-green-700"
        >
          {isRegistering ? "Création..." : "Créer le Compte"}
        </Button>
      )}
    </div>
  );
};

export default RegistrationStepNavigation;