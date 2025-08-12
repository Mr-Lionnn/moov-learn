import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { X, Lock, AlertTriangle, CheckCircle } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { passwordSchema, sanitizeText, generateCSRFToken } from "@/utils/security";

interface PasswordChangeModalProps {
  onClose: () => void;
}

const PasswordChangeModal = ({ onClose }: PasswordChangeModalProps) => {
  const { toast } = useToast();
  const { user } = useAuth();
  
  const [formData, setFormData] = useState({
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });
  
  const [errors, setErrors] = useState<{
    currentPassword?: string;
    newPassword?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  
  const [isChanging, setIsChanging] = useState(false);

  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsChanging(true);
    setErrors({});

    // Validate current password
    if (!formData.currentPassword) {
      setErrors({ currentPassword: "Veuillez saisir votre mot de passe actuel" });
      setIsChanging(false);
      return;
    }

    // Validate new password
    const passwordValidation = passwordSchema.safeParse(formData.newPassword);
    if (!passwordValidation.success) {
      setErrors({ newPassword: passwordValidation.error.issues[0]?.message });
      setIsChanging(false);
      return;
    }

    // Confirm password match
    if (formData.newPassword !== formData.confirmPassword) {
      setErrors({ confirmPassword: "Les mots de passe ne correspondent pas" });
      setIsChanging(false);
      return;
    }

    // Same password check
    if (formData.currentPassword === formData.newPassword) {
      setErrors({ newPassword: "Le nouveau mot de passe doit être différent de l'actuel" });
      setIsChanging(false);
      return;
    }

    try {
      // Simulate password change with security delay
      await new Promise(resolve => setTimeout(resolve, 1500));

      // In a real implementation, this would call a secure backend API
      // For this demo, we'll simulate a successful password change
      
      // Update user record in localStorage for test users
      const testUsers = JSON.parse(localStorage.getItem('moov_test_users') || '[]');
      const updatedUsers = testUsers.map((u: any) => 
        u.email === user?.email 
          ? { ...u, passwordLastChanged: new Date().toISOString() }
          : u
      );
      localStorage.setItem('moov_test_users', JSON.stringify(updatedUsers));

      toast({
        title: "Mot de passe modifié",
        description: "Votre mot de passe a été mis à jour avec succès.",
        className: "border-green-200 bg-green-50"
      });
      
      onClose();
    } catch (error) {
      setErrors({ general: "Erreur lors de la modification du mot de passe. Veuillez réessayer." });
    } finally {
      setIsChanging(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="w-full max-w-md">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="text-xl flex items-center gap-2">
                <Lock className="h-5 w-5 text-primary" />
                Modifier le Mot de Passe
              </CardTitle>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <form onSubmit={handlePasswordChange} className="space-y-4">
              {/* CSRF Protection */}
              <input type="hidden" name="csrf_token" value={generateCSRFToken()} />
              
              {errors.general && (
                <div className="flex items-center gap-2 p-3 text-sm text-red-800 bg-red-100 border border-red-200 rounded-md">
                  <AlertTriangle className="h-4 w-4" />
                  {errors.general}
                </div>
              )}

              <div className="space-y-2">
                <Label htmlFor="currentPassword">Mot de passe actuel</Label>
                <Input
                  id="currentPassword"
                  type="password"
                  value={formData.currentPassword}
                  onChange={(e) => setFormData({...formData, currentPassword: sanitizeText(e.target.value)})}
                  className={errors.currentPassword ? "border-red-500" : ""}
                  disabled={isChanging}
                  autoComplete="current-password"
                  required
                />
                {errors.currentPassword && (
                  <p className="text-sm text-red-600">{errors.currentPassword}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="newPassword">Nouveau mot de passe</Label>
                <Input
                  id="newPassword"
                  type="password"
                  value={formData.newPassword}
                  onChange={(e) => setFormData({...formData, newPassword: sanitizeText(e.target.value)})}
                  className={errors.newPassword ? "border-red-500" : ""}
                  disabled={isChanging}
                  autoComplete="new-password"
                  required
                />
                {errors.newPassword && (
                  <p className="text-sm text-red-600">{errors.newPassword}</p>
                )}
                <p className="text-xs text-muted-foreground">
                  Minimum 8 caractères avec majuscules, minuscules et chiffres
                </p>
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({...formData, confirmPassword: sanitizeText(e.target.value)})}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                  disabled={isChanging}
                  autoComplete="new-password"
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="flex gap-3 pt-4">
                <Button
                  type="button"
                  variant="outline"
                  onClick={onClose}
                  disabled={isChanging}
                  className="flex-1"
                >
                  Annuler
                </Button>
                <Button
                  type="submit"
                  disabled={isChanging}
                  className="flex-1 bg-gradient-to-r from-primary to-secondary text-white"
                >
                  {isChanging ? (
                    "Modification..."
                  ) : (
                    <>
                      <CheckCircle className="h-4 w-4 mr-2" />
                      Modifier
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PasswordChangeModal;