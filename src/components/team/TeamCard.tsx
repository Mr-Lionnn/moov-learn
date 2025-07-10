
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Trash } from "lucide-react";

interface Team {
  id: string;
  name: string;
  color: string;
  memberCount: number;
  department: string;
}

interface TeamCardProps {
  team: Team;
  onDelete: (teamId: string) => void;
}

const TeamCard = ({ team, onDelete }: TeamCardProps) => {
  return (
    <Card className="relative">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg flex items-center gap-2">
            <div
              className="w-4 h-4 rounded-full"
              style={{ backgroundColor: team.color }}
            />
            {team.name}
          </CardTitle>
          <Button
            variant="ghost"
            size="sm"
            onClick={() => onDelete(team.id)}
            className="text-red-600 hover:text-red-700"
          >
            <Trash className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-2">
          <Badge variant="outline">{team.department}</Badge>
          <p className="text-sm text-gray-600">
            {team.memberCount} membre{team.memberCount !== 1 ? 's' : ''}
          </p>
        </div>
      </CardContent>
    </Card>
  );
};

export default TeamCard;
