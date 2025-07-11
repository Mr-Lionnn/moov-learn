
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface Team {
  id: string;
  name: string;
  color: string;
  memberCount: number;
  department: string;
}

interface TeamStatsOverviewProps {
  teams: Team[];
}

const TeamStatsOverview = ({ teams }: TeamStatsOverviewProps) => {
  const getTeamStats = () => {
    const totalMembers = teams.reduce((acc, team) => acc + team.memberCount, 0);
    const departmentDistribution = teams.reduce((acc, team) => {
      acc[team.department] = (acc[team.department] || 0) + team.memberCount;
      return acc;
    }, {} as Record<string, number>);

    return { totalMembers, departmentDistribution };
  };

  const stats = getTeamStats();

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-primary">
              {teams.length}
            </div>
            <div className="text-sm text-gray-600">Équipes Totales</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-green-600">
              {stats.totalMembers}
            </div>
            <div className="text-sm text-gray-600">Membres Totaux</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-orange-600">
              {Object.keys(stats.departmentDistribution).length}
            </div>
            <div className="text-sm text-gray-600">Départements</div>
          </CardContent>
        </Card>
        <Card>
          <CardContent className="p-4 text-center">
            <div className="text-2xl font-bold text-purple-600">
              {stats.totalMembers > 0 ? Math.round(stats.totalMembers / teams.length) : 0}
            </div>
            <div className="text-sm text-gray-600">Moy. par Équipe</div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Répartition par Département</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {Object.entries(stats.departmentDistribution).map(([dept, count]) => (
              <div key={dept} className="flex justify-between items-center">
                <span className="font-medium">{dept}</span>
                <Badge variant="secondary">{count} membre{count !== 1 ? 's' : ''}</Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default TeamStatsOverview;
