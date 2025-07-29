import { useToast } from '@/hooks/use-toast';

interface ErrorHandlerOptions {
  toast?: ReturnType<typeof useToast>['toast'];
  fallbackMessage?: string;
  showToast?: boolean;
}

export const handleError = (
  error: any, 
  operation: string, 
  options: ErrorHandlerOptions = {}
) => {
  const { toast, fallbackMessage = 'Une erreur inattendue s\'est produite', showToast = true } = options;
  
  console.error(`Error in ${operation}:`, error);
  
  if (showToast && toast) {
    const message = error?.message || fallbackMessage;
    toast({
      title: "Erreur",
      description: message,
      variant: "destructive"
    });
  }
  
  return {
    success: false,
    error: error?.message || fallbackMessage
  };
};

export const handleSuccess = (
  message: string,
  toast?: ReturnType<typeof useToast>['toast']
) => {
  if (toast) {
    toast({
      title: "Succès",
      description: message,
      variant: "default"
    });
  }
  
  return {
    success: true,
    message
  };
};