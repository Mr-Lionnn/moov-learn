import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { UserPlus, AlertTriangle, CheckCircle, Users, Trash2 } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { emailSchema, passwordSchema, nameSchema, sanitizeText, generateCSRFToken } from "@/utils/security";

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
  { value: "none", label: "Aucune équipe" },
  { value: "development", label: "Équipe Développement" },
  { value: "marketing", label: "Équipe Marketing" },
  { value: "support", label: "Équipe Support" },
  { value: "management", label: "Direction" }
];

const sites = [
  { value: "none", label: "Aucun site" },
  { value: "abidjan", label: "Abidjan" },
  { value: "bamako", label: "Bamako" },
  { value: "ouagadougou", label: "Ouagadougou" },
  { value: "niamey", label: "Niamey" }
];

interface UserData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: string;
  team: string;
  site: string;
  department: string;
}

const UserManagementTab = () => {
  const { toast } = useToast();
  
  const [userData, setUserData] = useState<UserData>({
    fullName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "employee",
    team: "none",
    site: "none",
    department: ""
  });
  
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
    general?: string;
  }>({});
  
  const [isCreating, setIsCreating] = useState(false);
  const [existingUsers, setExistingUsers] = useState(() => {
    return JSON.parse(localStorage.getItem('moov_test_users') || '[]');
  });

  const validateForm = (): boolean => {
    const newErrors: typeof errors = {};
    
    // Validate name
    const nameValidation = nameSchema.safeParse(userData.fullName);
    if (!nameValidation.success) {
      newErrors.fullName = nameValidation.error.issues[0]?.message;
    }
    
    // Validate email
    const emailValidation = emailSchema.safeParse(userData.email);
    if (!emailValidation.success) {
      newErrors.email = emailValidation.error.issues[0]?.message;
    }
    
    // Check for duplicate email
    const emailExists = existingUsers.some((user: any) => 
      user.email.toLowerCase() === userData.email.toLowerCase()
    );
    if (emailExists) {
      newErrors.email = "Cette adresse email est déjà utilisée";
    }
    
    // Validate password
    const passwordValidation = passwordSchema.safeParse(userData.password);
    if (!passwordValidation.success) {
      newErrors.password = passwordValidation.error.issues[0]?.message;
    }
    
    // Confirm password match
    if (userData.password !== userData.confirmPassword) {
      newErrors.confirmPassword = "Les mots de passe ne correspondent pas";
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreating(true);
    setErrors({});

    if (!validateForm()) {
      setIsCreating(false);
      return;
    }

    try {
      // Simulate secure user creation process
      await new Promise(resolve => setTimeout(resolve, 1500));

      // Create new user object with security considerations
      const newUser = {
        id: Date.now(),
        email: sanitizeText(userData.email.toLowerCase()),
        name: sanitizeText(userData.fullName),
        role: userData.role,
        department: sanitizeText(userData.department),
        teamId: userData.team !== "none" ? userData.team : undefined,
        site: userData.site !== "none" ? userData.site : undefined,
        createdAt: new Date().toISOString(),
        createdBy: "admin", // In real implementation, this would be the current admin's ID
        isActive: true,
        passwordLastChanged: new Date().toISOString()
      };

      // Update users list
      const updatedUsers = [...existingUsers, newUser];
      localStorage.setItem('moov_test_users', JSON.stringify(updatedUsers));
      setExistingUsers(updatedUsers);

      toast({
        title: "Utilisateur créé",
        description: `Le compte de ${userData.fullName} a été créé avec succès.`,
        className: "border-green-200 bg-green-50"
      });

      // Reset form
      setUserData({
        fullName: "",
        email: "",
        password: "",
        confirmPassword: "",
        role: "employee",
        team: "none",
        site: "none",
        department: ""
      });
    } catch (error) {
      setErrors({ general: "Erreur lors de la création de l'utilisateur. Veuillez réessayer." });
    } finally {
      setIsCreating(false);
    }
  };

  const handleDeleteUser = (userId: number) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")) {
      const updatedUsers = existingUsers.filter((user: any) => user.id !== userId);
      localStorage.setItem('moov_test_users', JSON.stringify(updatedUsers));
      setExistingUsers(updatedUsers);
      
      toast({
        title: "Utilisateur supprimé",
        description: "L'utilisateur a été supprimé avec succès.",
        className: "border-yellow-200 bg-yellow-50"
      });
    }
  };

  return (
    <div className="space-y-6">
      {/* User Creation Form */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5 text-primary" />
            Créer un Nouvel Utilisateur
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleCreateUser} className="space-y-4">
            {/* CSRF Protection */}
            <input type="hidden" name="csrf_token" value={generateCSRFToken()} />
            
            {errors.general && (
              <div className="flex items-center gap-2 p-3 text-sm text-red-800 bg-red-100 border border-red-200 rounded-md">
                <AlertTriangle className="h-4 w-4" />
                {errors.general}
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="fullName">Nom complet *</Label>
                <Input
                  id="fullName"
                  value={userData.fullName}
                  onChange={(e) => setUserData({...userData, fullName: sanitizeText(e.target.value)})}
                  className={errors.fullName ? "border-red-500" : ""}
                  disabled={isCreating}
                  required
                />
                {errors.fullName && (
                  <p className="text-sm text-red-600">{errors.fullName}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="email">Adresse email *</Label>
                <Input
                  id="email"
                  type="email"
                  value={userData.email}
                  onChange={(e) => setUserData({...userData, email: sanitizeText(e.target.value)})}
                  className={errors.email ? "border-red-500" : ""}
                  disabled={isCreating}
                  autoComplete="email"
                  required
                />
                {errors.email && (
                  <p className="text-sm text-red-600">{errors.email}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="password">Mot de passe *</Label>
                <Input
                  id="password"
                  type="password"
                  value={userData.password}
                  onChange={(e) => setUserData({...userData, password: sanitizeText(e.target.value)})}
                  className={errors.password ? "border-red-500" : ""}
                  disabled={isCreating}
                  autoComplete="new-password"
                  required
                />
                {errors.password && (
                  <p className="text-sm text-red-600">{errors.password}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword">Confirmer le mot de passe *</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  value={userData.confirmPassword}
                  onChange={(e) => setUserData({...userData, confirmPassword: sanitizeText(e.target.value)})}
                  className={errors.confirmPassword ? "border-red-500" : ""}
                  disabled={isCreating}
                  autoComplete="new-password"
                  required
                />
                {errors.confirmPassword && (
                  <p className="text-sm text-red-600">{errors.confirmPassword}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="role">Rôle *</Label>
                <Select value={userData.role} onValueChange={(value) => setUserData({...userData, role: value})}>
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
                  value={userData.department}
                  onChange={(e) => setUserData({...userData, department: sanitizeText(e.target.value)})}
                  placeholder="IT, RH, Marketing..."
                  disabled={isCreating}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="team">Équipe</Label>
                <Select value={userData.team} onValueChange={(value) => setUserData({...userData, team: value})}>
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
                <Select value={userData.site} onValueChange={(value) => setUserData({...userData, site: value})}>
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

            <Button
              type="submit"
              disabled={isCreating}
              className="w-full bg-gradient-to-r from-primary to-secondary text-white"
            >
              {isCreating ? (
                "Création en cours..."
              ) : (
                <>
                  <CheckCircle className="h-4 w-4 mr-2" />
                  Créer l'Utilisateur
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>

      {/* Existing Users List */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5 text-primary" />
            Utilisateurs Existants ({existingUsers.length})
          </CardTitle>
        </CardHeader>
        <CardContent>
          {existingUsers.length === 0 ? (
            <p className="text-muted-foreground text-center py-4">Aucun utilisateur créé</p>
          ) : (
            <div className="space-y-2">
              {existingUsers.map((user: any) => (
                <div key={user.id} className="flex items-center justify-between p-3 border rounded-lg">
                  <div className="space-y-1">
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                    <div className="text-xs text-muted-foreground">
                      {roles.find(r => r.value === user.role)?.label || user.role} 
                      {user.department && ` • ${user.department}`}
                    </div>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDeleteUser(user.id)}
                    className="text-red-600 hover:text-red-700 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default UserManagementTab;
