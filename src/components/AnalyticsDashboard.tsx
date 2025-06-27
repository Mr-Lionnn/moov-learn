
import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Users, 
  Target, 
  TrendingUp, 
  Award, 
  BookOpen, 
  AlertTriangle,
  Trophy,
  Clock
} from "lucide-react";
import { progressService } from "@/services/progressService";

interface AnalyticsDashboardProps {
  userRole: string;
  userId?: string;
}

const AnalyticsDashboard = ({ userRole, userId = 'current_user' }: AnalyticsDashboardProps) => {
  const [analytics, setAnalytics] = useState<any>(null);
  const [userProgress, setUserProgress] = useState<any>(null);
  const [allProgress, setAllProgress] = useState<any>({});

  useEffect(() => {
    const loadData = () => {
      setAnalytics(progressService.getAnalytics());
      setUserProgress(progressService.getUserProgress(userId));
      setAllProgress(progressService.getAllProgress());
    };

    loadData();
    // Refresh data every 30 seconds
    const interval = setInterval(loadData, 30000);
    return () => clearInterval(interval);
  }, [userId]);

  const canViewTeamAnalytics = ['Administrateur', 'Chef d\'Équipe', 'Responsable d\'Équipe'].includes(userRole);

  if (!analytics || !userProgress) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  const PersonalAnalytics = () => (
    <div className="space-y-6">
      {/* Personal Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{userProgress.totalQuizzes}</p>
                <p className="text-sm text-gray-600">Quiz Complétés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Trophy className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{userProgress.averageScore}%</p>
                <p className="text-sm text-gray-600">Score Moyen</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{Object.keys(userProgress.skillAreas).length}</p>
                <p className="text-sm text-gray-600">Domaines Étudiés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-sm font-bold">
                  {userProgress.lastActivity ? 
                    new Date(userProgress.lastActivity).toLocaleDateString() : 
                    'Jamais'
                  }
                </p>
                <p className="text-sm text-gray-600">Dernière Activité</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Skill Areas Progress */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <TrendingUp className="h-5 w-5" />
            Progression par Domaine
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {Object.entries(userProgress.skillAreas).length > 0 ? (
            Object.entries(userProgress.skillAreas).map(([area, data]: [string, any]) => (
              <div key={area} className="space-y-2">
                <div className="flex justify-between items-center">
                  <span className="font-medium">{area}</span>
                  <div className="flex items-center gap-2">
                    <Badge variant="outline">{data.attempts} tentatives</Badge>
                    <span className="text-sm font-bold">{Math.round(data.score)}%</span>
                  </div>
                </div>
                <Progress value={data.score} className="h-2" />
                {data.improvement !== 0 && (
                  <div className={`text-xs ${data.improvement > 0 ? 'text-green-600' : 'text-red-600'}`}>
                    {data.improvement > 0 ? '+' : ''}{Math.round(data.improvement)}% depuis la dernière fois
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center text-gray-500 py-8">
              <BookOpen className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Aucun quiz complété pour le moment</p>
              <p className="text-sm">Commencez un quiz pour voir vos progrès ici</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  const TeamAnalytics = () => (
    <div className="space-y-6">
      {/* Team Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-blue-600" />
              <div>
                <p className="text-2xl font-bold">{analytics.totalUsers}</p>
                <p className="text-sm text-gray-600">Utilisateurs Actifs</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Target className="h-5 w-5 text-green-600" />
              <div>
                <p className="text-2xl font-bold">{analytics.totalQuizzes}</p>
                <p className="text-sm text-gray-600">Quiz Complétés</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-yellow-600" />
              <div>
                <p className="text-2xl font-bold">{analytics.averageScore}%</p>
                <p className="text-sm text-gray-600">Score Moyen</p>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              <div>
                <p className="text-2xl font-bold">{analytics.averageCompletionRate}</p>
                <p className="text-sm text-gray-600">Taux de Complétion</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Top Performers */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Trophy className="h-5 w-5" />
            Meilleurs Performeurs
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.topPerformers.length > 0 ? (
            <div className="space-y-3">
              {analytics.topPerformers.map((performer: any, index: number) => (
                <div key={performer.userId} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                  <div className="flex items-center gap-3">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      index === 0 ? 'bg-yellow-500' : index === 1 ? 'bg-gray-400' : 'bg-orange-400'
                    }`}>
                      {index + 1}
                    </div>
                    <span className="font-medium">{performer.name}</span>
                  </div>
                  <Badge variant="outline">{performer.score}%</Badge>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <Trophy className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune donnée de performance disponible</p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Skill Gaps */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5" />
            Lacunes Identifiées
          </CardTitle>
        </CardHeader>
        <CardContent>
          {analytics.skillGaps.length > 0 ? (
            <div className="space-y-3">
              {analytics.skillGaps.map((gap: any) => (
                <div key={gap.area} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="font-medium">{gap.area}</span>
                    <div className="flex items-center gap-2">
                      <Badge variant="outline">{gap.usersCount} utilisateurs</Badge>
                      <span className={`text-sm font-bold ${
                        gap.averageScore < 60 ? 'text-red-600' : 
                        gap.averageScore < 80 ? 'text-yellow-600' : 'text-green-600'
                      }`}>
                        {gap.averageScore}%
                      </span>
                    </div>
                  </div>
                  <Progress value={gap.averageScore} className="h-2" />
                  {gap.averageScore < 70 && (
                    <div className="text-xs text-red-600">
                      ⚠️ Formation supplémentaire recommandée
                    </div>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center text-gray-500 py-8">
              <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p>Aucune lacune identifiée</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Tableau de Bord Analytique</h2>
        <Badge variant="outline" className="text-sm">
          Rôle: {userRole}
        </Badge>
      </div>

      <Tabs defaultValue="personal" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="personal">Ma Progression</TabsTrigger>
          <TabsTrigger value="team" disabled={!canViewTeamAnalytics}>
            Équipe {!canViewTeamAnalytics && '(Accès Limité)'}
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="personal">
          <PersonalAnalytics />
        </TabsContent>
        
        <TabsContent value="team">
          {canViewTeamAnalytics ? (
            <TeamAnalytics />
          ) : (
            <Card>
              <CardContent className="p-8 text-center">
                <AlertTriangle className="h-12 w-12 mx-auto mb-4 text-gray-300" />
                <p className="text-gray-500">Accès aux analyses d'équipe non autorisé</p>
                <p className="text-sm text-gray-400">Contactez votre administrateur pour plus d'informations</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AnalyticsDashboard;
