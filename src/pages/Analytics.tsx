
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, LineChart, Line, PieChart, Pie, Cell } from 'recharts';
import { TrendingUp, Users, BookOpen, Award, Download, Calendar } from "lucide-react";
import Header from "@/components/Header";

const Analytics = () => {
  const monthlyData = [
    { month: 'Jan', completions: 45, enrollments: 120, avgScore: 82 },
    { month: 'Fév', completions: 52, enrollments: 135, avgScore: 85 },
    { month: 'Mar', completions: 61, enrollments: 150, avgScore: 87 },
    { month: 'Avr', completions: 58, enrollments: 140, avgScore: 84 },
    { month: 'Mai', completions: 67, enrollments: 165, avgScore: 89 },
    { month: 'Jun', completions: 73, enrollments: 180, avgScore: 91 },
  ];

  const departmentData = [
    { name: 'IT Support', value: 45, color: '#3B82F6' },
    { name: 'Infrastructure', value: 35, color: '#10B981' },
    { name: 'Sécurité', value: 25, color: '#F59E0B' },
    { name: 'Développement', value: 40, color: '#8B5CF6' },
  ];

  const topCourses = [
    { name: 'Fondamentaux TCP/IP', completions: 89, rating: 4.8 },
    { name: 'Sécurité Réseau', completions: 76, rating: 4.9 },
    { name: 'Configuration Cisco', completions: 65, rating: 4.7 },
    { name: 'Routage Avancé', completions: 58, rating: 4.6 },
    { name: 'WiFi Enterprise', completions: 52, rating: 4.5 },
  ];

  const stats = [
    {
      title: "Employés Actifs",
      value: "145",
      change: "+12%",
      trend: "up",
      icon: Users,
      color: "text-blue-600",
      bgColor: "bg-blue-100"
    },
    {
      title: "Formations Terminées",
      value: "287",
      change: "+18%",
      trend: "up",
      icon: BookOpen,
      color: "text-green-600",
      bgColor: "bg-green-100"
    },
    {
      title: "Taux de Réussite",
      value: "92%",
      change: "+3%",
      trend: "up",
      icon: Award,
      color: "text-yellow-600",
      bgColor: "bg-yellow-100"
    },
    {
      title: "Engagement Moyen",
      value: "78%",
      change: "+5%",
      trend: "up",
      icon: TrendingUp,
      color: "text-purple-600",
      bgColor: "bg-purple-100"
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Analytiques</h1>
              <p className="text-gray-600">Suivez les performances et tendances de formation</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <Calendar className="h-4 w-4 mr-2" />
                Cette semaine
              </Button>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Exporter
              </Button>
            </div>
          </div>
        </div>

        {/* Key Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat, index) => (
            <Card key={index} className="hover:shadow-md transition-shadow duration-300">
              <CardContent className="p-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${stat.bgColor}`}>
                    <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  </div>
                  <div className="flex-1">
                    <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                    <div className="flex items-center gap-2">
                      <p className="text-xs text-gray-600">{stat.title}</p>
                      <Badge variant="secondary" className="text-green-600 bg-green-100">
                        {stat.change}
                      </Badge>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Charts */}
          <div className="lg:col-span-2 space-y-8">
            {/* Monthly Progress */}
            <Card>
              <CardHeader>
                <CardTitle>Progression Mensuelle</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-80">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="completions" fill="#3B82F6" name="Formations terminées" />
                      <Bar dataKey="enrollments" fill="#10B981" name="Inscriptions" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Score Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Tendance des Scores</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-64">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis domain={[70, 100]} />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey="avgScore" 
                        stroke="#8B5CF6" 
                        strokeWidth={3}
                        name="Score moyen"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Department Distribution */}
            <Card>
              <CardHeader>
                <CardTitle>Répartition par Département</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-48 mb-4">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={departmentData}
                        cx="50%"
                        cy="50%"
                        innerRadius={40}
                        outerRadius={80}
                        dataKey="value"
                      >
                        {departmentData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
                <div className="space-y-2">
                  {departmentData.map((dept, index) => (
                    <div key={index} className="flex justify-between items-center">
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full" 
                          style={{ backgroundColor: dept.color }}
                        ></div>
                        <span className="text-sm">{dept.name}</span>
                      </div>
                      <span className="text-sm font-medium">{dept.value}</span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Top Courses */}
            <Card>
              <CardHeader>
                <CardTitle>Formations Populaires</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {topCourses.map((course, index) => (
                  <div key={index} className="flex justify-between items-center">
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium truncate">{course.name}</p>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-gray-600">{course.completions} terminées</span>
                        <Badge variant="secondary" className="text-xs">
                          ★ {course.rating}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Statistiques Rapides</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Temps moyen par formation</span>
                  <span className="font-medium">18h 30m</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Taux d'abandon</span>
                  <span className="font-medium text-red-600">8%</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Satisfaction moyenne</span>
                  <span className="font-medium text-green-600">4.7/5</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Certifications/mois</span>
                  <span className="font-medium">47</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Analytics;
