import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { LogIn } from 'lucide-react';

const AuthButton = () => {
  const navigate = useNavigate();

  return (
    <Button 
      onClick={() => navigate('/auth')}
      className="bg-primary hover:bg-primary/90 text-primary-foreground"
    >
      <LogIn className="mr-2 h-4 w-4" />
      Se Connecter
    </Button>
  );
};

export default AuthButton;