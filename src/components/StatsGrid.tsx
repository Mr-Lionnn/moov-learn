
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Clock, Trophy, TrendingUp, Users, GraduationCap } from "lucide-react";

interface StatsGridProps {
  userRole?: "student" | "admin";
}

const StatsGrid = ({ userRole = "student" }: StatsGridProps) => {
  const studentStats = [
    {
      title: "Cours Inscrits",
      value: "12",
      description: "Parcours d'apprentissage actifs",
      icon: BookOpen,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Heures Apprises",
      value: "24,5",
      description: "Ce mois-ci",
      icon: Clock,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Certificats",
      value: "5",
      description: "Cours terminés",
      icon: Trophy,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      title: "Série",
      value: "7",
      description: "Jours consécutifs",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  const adminStats = [
    {
      title: "Total Étudiants",
      value: "1,250",
      description: "Utilisateurs actifs",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Cours Créés",
      value: "45",
      description: "Contenus disponibles",
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Taux Réussite",
      value: "87%",
      description: "Moyenne plateforme",
      icon: Trophy,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      title: "Certifications",
      value: "2,450",
      description: "Délivrées au total",
      icon: GraduationCap,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  const stats = userRole === "admin" ? adminStats : studentStats;

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {stats.map((stat, index) => (
        <Card key={index} className="hover:shadow-md transition-shadow duration-300">
          <CardContent className="p-4">
            <div className="flex items-center gap-3">
              <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                <stat.icon className={`h-5 w-5 ${stat.color}`} />
              </div>
              <div className="flex-1">
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className="text-xs text-gray-600">{stat.description}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default StatsGrid;
