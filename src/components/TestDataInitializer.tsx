
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  Users, 
  BookOpen, 
  CheckCircle, 
  Database,
  User,
  Mail,
  Shield
} from 'lucide-react';
import { testDataService } from '@/services/testDataService';
import { useAuth } from '@/contexts/AuthContext';

const TestDataInitializer = () => {
  const [isInitialized, setIsInitialized] = useState(false);
  const [showTestAccounts, setShowTestAccounts] = useState(false);
  const { login } = useAuth();

  useEffect(() => {
    // Check if test data is already initialized
    const testUsers = localStorage.getItem('moov_test_users');
    if (testUsers) {
      setIsInitialized(true);
    }
  }, []);

  const initializeTestData = () => {
    testDataService.initializeTestData();
    testDataService.generateAnalyticsData();
    setIsInitialized(true);
    console.log('✅ Test data initialized with realistic scenarios');
  };

  const loginAsTestUser = (userId: number) => {
    const testUser = testDataService.getUserById(userId);
    if (testUser) {
      login({
        id: testUser.id,
        email: testUser.email,
        name: testUser.name,
        role: testUser.role,
        department: testUser.department,
        teamId: testUser.teamId
      });
    }
  };

  const getRoleColor = (role: string) => {
    switch (role) {
      case 'admin': return 'bg-red-100 text-red-800';
      case 'team_chief': return 'bg-blue-100 text-blue-800';
      case 'team_responsible': return 'bg-green-100 text-green-800';
      case 'employee': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getRoleLabel = (role: string) => {
    switch (role) {
      case 'admin': return 'Administrateur';
      case 'team_chief': return 'Chef d\'Équipe';
      case 'team_responsible': return 'Responsable';
      case 'employee': return 'Employé';
      default: return role;
    }
  };

  const testUsers = testDataService.getTestUsers();
  const testCourses = testDataService.getTestCourses();
  const testTasks = testDataService.getTestTasks();

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Database className="h-5 w-5" />
            Environnement de Test Moov-Learn
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="flex items-center gap-2 p-3 bg-blue-50 rounded-lg">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="font-semibold">{testUsers.length}</p>
                <p className="text-sm text-gray-600">Utilisateurs Test</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-green-50 rounded-lg">
              <BookOpen className="h-5 w-5 text-green-600" />
              <div>
                <p className="font-semibold">{testCourses.length}</p>
                <p className="text-sm text-gray-600">Cours Complets</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-orange-50 rounded-lg">
              <CheckCircle className="h-5 w-5 text-orange-600" />
              <div>
                <p className="font-semibold">{testTasks.length}</p>
                <p className="text-sm text-gray-600">Tâches Réalistes</p>
              </div>
            </div>
            <div className="flex items-center gap-2 p-3 bg-purple-50 rounded-lg">
              <Shield className="h-5 w-5 text-purple-600" />
              <div>
                <p className="font-semibold">2</p>
                <p className="text-sm text-gray-600">Quiz Interactifs</p>
              </div>
            </div>
          </div>

          <div className="flex gap-4">
            {!isInitialized ? (
              <Button 
                onClick={initializeTestData}
                className="moov-gradient text-white"
              >
                Initialiser les Données de Test
              </Button>
            ) : (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-4 w-4" />
                <span className="text-sm font-medium">Données de test initialisées</span>
              </div>
            )}
            
            <Button 
              variant="outline"
              onClick={() => setShowTestAccounts(!showTestAccounts)}
            >
              {showTestAccounts ? 'Masquer' : 'Voir'} Comptes de Test
            </Button>
          </div>
        </CardContent>
      </Card>

      {showTestAccounts && (
        <Card>
          <CardHeader>
            <CardTitle>Comptes de Test Disponibles</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              {testUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-gray-200 rounded-full flex items-center justify-center">
                      <User className="h-6 w-6 text-gray-600" />
                    </div>
                    <div>
                      <h3 className="font-semibold">{user.name}</h3>
                      <div className="flex items-center gap-2 text-sm text-gray-600">
                        <Mail className="h-3 w-3" />
                        {user.email}
                      </div>
                      <div className="flex items-center gap-2 mt-1">
                        <Badge className={getRoleColor(user.role)}>
                          {getRoleLabel(user.role)}
                        </Badge>
                        {user.department && (
                          <Badge variant="outline" className="text-xs">
                            {user.department}
                          </Badge>
                        )}
                      </div>
                    </div>
                  </div>
                  <Button
                    size="sm"
                    onClick={() => loginAsTestUser(user.id)}
                    className="moov-gradient text-white"
                  >
                    Se Connecter
                  </Button>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {isInitialized && (
        <div className="grid md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Cours de Formation Disponibles</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testCourses.map((course) => (
                  <div key={course.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{course.title}</h4>
                      <div className="flex gap-1">
                        <Badge variant="outline" className="text-xs">
                          {course.level}
                        </Badge>
                        {course.isMandatory && (
                          <Badge variant="destructive" className="text-xs">
                            Obligatoire
                          </Badge>
                        )}
                      </div>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{course.description}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>{course.duration}</span>
                      <span>{course.completionRate}% complété</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Tâches d'Apprentissage</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {testTasks.map((task) => (
                  <div key={task.id} className="p-3 border rounded-lg">
                    <div className="flex justify-between items-start mb-2">
                      <h4 className="font-medium">{task.title}</h4>
                      <Badge className={
                        task.priority === 'high' ? 'bg-red-100 text-red-800' :
                        task.priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-green-100 text-green-800'
                      }>
                        {task.priority === 'high' ? 'Haute' : 
                         task.priority === 'medium' ? 'Moyenne' : 'Basse'}
                      </Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-2">{task.description}</p>
                    <div className="flex justify-between text-xs text-gray-500">
                      <span>Échéance: {new Date(task.deadline).toLocaleDateString()}</span>
                      <span>{task.progress}% terminé</span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>
      )}
    </div>
  );
};

export default TestDataInitializer;
