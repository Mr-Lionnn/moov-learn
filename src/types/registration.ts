export interface RegistrationData {
  fullName: string;
  email: string;
  phone: string;
  password: string;
  confirmPassword: string;
  dateOfBirth: string;
  role: string;
  team: string;
  site: string;
  department: string;
}

export interface RegistrationErrors {
  [key: string]: string;
}

export interface StepProps {
  regData: RegistrationData;
  setRegData: (data: RegistrationData) => void;
  regErrors: RegistrationErrors;
}