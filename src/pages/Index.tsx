
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { BookOpen, Clock, Users, Award, Search, Play, CheckCircle, TrendingUp } from "lucide-react";
import CourseCard from "@/components/CourseCard";
import Header from "@/components/Header";
import StatsGrid from "@/components/StatsGrid";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");

  const featuredCourses = [
    {
      id: 1,
      title: "Introduction to Web Development",
      instructor: "Sarah Johnson",
      duration: "12 hours",
      students: 1250,
      rating: 4.8,
      progress: 65,
      image: "/placeholder.svg",
      category: "Technology",
      level: "Beginner"
    },
    {
      id: 2,
      title: "Digital Marketing Fundamentals",
      instructor: "Mike Chen",
      duration: "8 hours",
      students: 890,
      rating: 4.9,
      progress: 30,
      image: "/placeholder.svg",
      category: "Marketing",
      level: "Intermediate"
    },
    {
      id: 3,
      title: "Data Science with Python",
      instructor: "Dr. Emily Rodriguez",
      duration: "15 hours",
      students: 2100,
      rating: 4.7,
      progress: 0,
      image: "/placeholder.svg",
      category: "Data Science",
      level: "Advanced"
    }
  ];

  const recentAchievements = [
    { title: "Course Completion", description: "Completed Web Development Basics", date: "2 days ago", icon: Award },
    { title: "Perfect Score", description: "100% on JavaScript Quiz", date: "1 week ago", icon: CheckCircle },
    { title: "Learning Streak", description: "7 days of continuous learning", date: "Today", icon: TrendingUp }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        {/* Welcome Section */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-6">
            <Avatar className="h-16 w-16">
              <AvatarImage src="/placeholder.svg" />
              <AvatarFallback>JD</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Welcome back, John!</h1>
              <p className="text-gray-600">Ready to continue your learning journey?</p>
            </div>
          </div>
          
          <StatsGrid />
        </div>

        {/* Search Bar */}
        <div className="mb-8">
          <div className="relative max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
            <Input
              placeholder="Search courses, topics, or instructors..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Continue Learning */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Continue Learning</h2>
              <div className="grid gap-6">
                {featuredCourses.filter(course => course.progress > 0).map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </section>

            {/* Recommended Courses */}
            <section>
              <h2 className="text-2xl font-bold mb-4 text-gray-900">Recommended for You</h2>
              <div className="grid md:grid-cols-2 gap-6">
                {featuredCourses.filter(course => course.progress === 0).map((course) => (
                  <CourseCard key={course.id} course={course} />
                ))}
              </div>
            </section>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Recent Achievements */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-5 w-5 text-yellow-500" />
                  Recent Achievements
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {recentAchievements.map((achievement, index) => (
                  <div key={index} className="flex items-start gap-3">
                    <div className="p-2 bg-green-100 rounded-full">
                      <achievement.icon className="h-4 w-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <h4 className="font-medium text-gray-900">{achievement.title}</h4>
                      <p className="text-sm text-gray-600">{achievement.description}</p>
                      <span className="text-xs text-gray-400">{achievement.date}</span>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>

            {/* Learning Goal */}
            <Card>
              <CardHeader>
                <CardTitle>Weekly Goal</CardTitle>
                <CardDescription>Complete 5 lessons this week</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span>Progress</span>
                    <span>3/5 lessons</span>
                  </div>
                  <Progress value={60} className="h-2" />
                  <p className="text-xs text-gray-500">2 more lessons to reach your goal!</p>
                </div>
              </CardContent>
            </Card>

            {/* Quick Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Your Learning Stats</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Total Courses</span>
                  <Badge variant="secondary">12</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Completed</span>
                  <Badge className="bg-green-100 text-green-800">8</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Certificates</span>
                  <Badge className="bg-blue-100 text-blue-800">5</Badge>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Learning Time</span>
                  <span className="text-sm font-medium">24.5 hours</span>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
