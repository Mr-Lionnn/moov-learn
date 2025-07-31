import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Users, Target, Clock, CheckCircle } from "lucide-react";
import { Quiz } from "@/types/quiz";

interface Team {
  id: string;
  name: string;
  department: string;
  memberCount: number;
}

interface TrainingProgram {
  id: string;
  title: string;
  description: string;
  teams: string[];
}

interface QuizTeamAssignmentProps {
  quiz: Quiz;
  onAssignmentComplete: (assignment: QuizAssignment) => void;
  onCancel: () => void;
}

export interface QuizAssignment {
  quizId: string;
  assignedTeams: string[];
  trainingProgramId?: string;
  dueDate?: string;
  instructions?: string;
}

const QuizTeamAssignment = ({ quiz, onAssignmentComplete, onCancel }: QuizTeamAssignmentProps) => {
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);
  const [selectedProgram, setSelectedProgram] = useState<string>("");
  const [dueDate, setDueDate] = useState<string>("");
  const [instructions, setInstructions] = useState<string>("");

  // Mock data - in real app, this would come from your backend
  const teams: Team[] = [
    { id: "team1", name: "Équipe Commerciale", department: "Ventes", memberCount: 12 },
    { id: "team2", name: "Support Client", department: "Service", memberCount: 8 },
    { id: "team3", name: "Équipe Technique", department: "IT", memberCount: 15 },
    { id: "team4", name: "Marketing", department: "Marketing", memberCount: 6 },
    { id: "team5", name: "Ressources Humaines", department: "RH", memberCount: 4 },
  ];

  const trainingPrograms: TrainingProgram[] = [
    {
      id: "prog1",
      title: "Formation Moov Services",
      description: "Programme complet sur les services Moov",
      teams: ["team1", "team2"]
    },
    {
      id: "prog2", 
      title: "Formation Technique Avancée",
      description: "Formation technique pour l'équipe IT",
      teams: ["team3"]
    },
    {
      id: "prog3",
      title: "Onboarding Général",
      description: "Formation d'accueil pour nouveaux employés",
      teams: ["team1", "team2", "team3", "team4", "team5"]
    }
  ];

  const handleTeamToggle = (teamId: string) => {
    setSelectedTeams(prev => 
      prev.includes(teamId) 
        ? prev.filter(id => id !== teamId)
        : [...prev, teamId]
    );
  };

  const handleProgramSelect = (programId: string) => {
    setSelectedProgram(programId);
    const program = trainingPrograms.find(p => p.id === programId);
    if (program) {
      setSelectedTeams(program.teams);
    }
  };

  const handleAssign = () => {
    const assignment: QuizAssignment = {
      quizId: quiz.id,
      assignedTeams: selectedTeams,
      trainingProgramId: selectedProgram || undefined,
      dueDate: dueDate || undefined,
      instructions: instructions || undefined
    };
    
    onAssignmentComplete(assignment);
  };

  const totalMembers = selectedTeams.reduce((total, teamId) => {
    const team = teams.find(t => t.id === teamId);
    return total + (team?.memberCount || 0);
  }, 0);

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Target className="h-5 w-5" />
            Assigner le Quiz: {quiz.title}
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4 text-center p-4 bg-muted rounded-lg">
            <div>
              <p className="text-2xl font-bold text-primary">{quiz.questions.length}</p>
              <p className="text-sm text-muted-foreground">Questions</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{quiz.timeLimit || "∞"}</p>
              <p className="text-sm text-muted-foreground">Minutes</p>
            </div>
            <div>
              <p className="text-2xl font-bold text-primary">{quiz.passingGrade}%</p>
              <p className="text-sm text-muted-foreground">Note requise</p>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Programme de Formation</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <Select value={selectedProgram} onValueChange={handleProgramSelect}>
            <SelectTrigger>
              <SelectValue placeholder="Sélectionner un programme de formation (optionnel)" />
            </SelectTrigger>
            <SelectContent>
              {trainingPrograms.map((program) => (
                <SelectItem key={program.id} value={program.id}>
                  <div>
                    <p className="font-medium">{program.title}</p>
                    <p className="text-sm text-muted-foreground">{program.description}</p>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Users className="h-5 w-5" />
            Équipes Assignées
          </CardTitle>
          {selectedTeams.length > 0 && (
            <Badge variant="secondary">
              {totalMembers} membres sélectionnés
            </Badge>
          )}
        </CardHeader>
        <CardContent className="space-y-3">
          {teams.map((team) => (
            <div
              key={team.id}
              className="flex items-center justify-between p-3 border rounded-lg hover:bg-muted/50 transition-colors"
            >
              <div className="flex items-center space-x-3">
                <Checkbox
                  id={team.id}
                  checked={selectedTeams.includes(team.id)}
                  onCheckedChange={() => handleTeamToggle(team.id)}
                />
                <div>
                  <label htmlFor={team.id} className="font-medium cursor-pointer">
                    {team.name}
                  </label>
                  <p className="text-sm text-muted-foreground">
                    {team.department} • {team.memberCount} membres
                  </p>
                </div>
              </div>
              <Badge variant="outline">{team.memberCount}</Badge>
            </div>
          ))}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="h-5 w-5" />
            Paramètres Additionnels
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <label className="text-sm font-medium">Date limite (optionnel)</label>
            <input
              type="datetime-local"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
              className="w-full mt-1 p-2 border rounded-md"
            />
          </div>
          
          <div>
            <label className="text-sm font-medium">Instructions spéciales</label>
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              placeholder="Instructions ou notes pour les participants..."
              className="w-full mt-1 p-2 border rounded-md h-20 resize-none"
            />
          </div>
        </CardContent>
      </Card>

      <div className="flex gap-4 justify-end">
        <Button variant="outline" onClick={onCancel}>
          Annuler
        </Button>
        <Button 
          onClick={handleAssign}
          disabled={selectedTeams.length === 0}
          className="flex items-center gap-2"
        >
          <CheckCircle className="h-4 w-4" />
          Assigner le Quiz ({selectedTeams.length} équipes)
        </Button>
      </div>
    </div>
  );
};

export default QuizTeamAssignment;