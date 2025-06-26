
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Button } from "@/components/ui/button";
import { BookmarkPlus, CheckCircle } from "lucide-react";

interface LessonTextContentProps {
  title: string;
  content: string;
  progress: number;
}

const LessonTextContent = ({ title, content, progress }: LessonTextContentProps) => {
  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{title}</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <BookmarkPlus className="h-4 w-4 mr-2" />
              Marquer
            </Button>
          </div>
        </div>
        <div className="space-y-2">
          <div className="flex justify-between text-sm text-gray-600">
            <span>Progression de lecture</span>
            <span>{progress}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
      </CardHeader>
      <CardContent className="prose max-w-none">
        <div className="space-y-4 text-gray-800 leading-relaxed">
          {content.split('\n\n').map((paragraph, index) => (
            <p key={index} className="text-base">
              {paragraph}
            </p>
          ))}
        </div>
        
        <div className="mt-8 p-4 bg-blue-50 rounded-lg border-l-4 border-blue-500">
          <div className="flex items-center gap-2 mb-2">
            <CheckCircle className="h-5 w-5 text-blue-600" />
            <h4 className="font-semibold text-blue-900">Points Clés à Retenir</h4>
          </div>
          <ul className="list-disc list-inside space-y-1 text-blue-800">
            <li>Les protocoles TCP/IP forment la base d'Internet</li>
            <li>Le modèle OSI structure la communication réseau en 7 couches</li>
            <li>L'encapsulation permet l'acheminement des données</li>
            <li>Chaque couche a un rôle spécifique dans la transmission</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonTextContent;
