
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Play, FileText, Volume2, Clock } from "lucide-react";

interface LessonFormatSelectorProps {
  onFormatSelect: (format: "video" | "text" | "audio") => void;
  selectedFormat: "video" | "text" | "audio";
  lessonTitle: string;
  duration: string;
}

const LessonFormatSelector = ({ 
  onFormatSelect, 
  selectedFormat, 
  lessonTitle, 
  duration 
}: LessonFormatSelectorProps) => {
  const formats = [
    {
      id: "video" as const,
      title: "Regarder la Vidéo",
      description: "Contenu interactif avec démonstrations visuelles",
      icon: Play,
      color: "bg-blue-500 hover:bg-blue-600",
      textColor: "text-blue-700",
      bgColor: "bg-blue-50"
    },
    {
      id: "text" as const,
      title: "Lire le Texte",
      description: "Documentation complète à votre rythme",
      icon: FileText,
      color: "bg-green-500 hover:bg-green-600",
      textColor: "text-green-700",
      bgColor: "bg-green-50"
    },
    {
      id: "audio" as const,
      title: "Écouter l'Audio",
      description: "Parfait pour l'apprentissage en déplacement",
      icon: Volume2,
      color: "bg-orange-500 hover:bg-orange-600",
      textColor: "text-orange-700",
      bgColor: "bg-orange-50"
    }
  ];

  return (
    <Card className="mb-6">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">{lessonTitle}</CardTitle>
          <Badge variant="outline" className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            {duration}
          </Badge>
        </div>
        <p className="text-gray-600">Choisissez votre format d'apprentissage préféré :</p>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {formats.map((format) => (
            <Card
              key={format.id}
              className={`cursor-pointer transition-all duration-200 hover:shadow-md ${
                selectedFormat === format.id 
                  ? `ring-2 ring-primary ${format.bgColor}` 
                  : 'hover:bg-gray-50'
              }`}
              onClick={() => onFormatSelect(format.id)}
            >
              <CardContent className="p-4 text-center">
                <div className={`mx-auto mb-3 w-12 h-12 rounded-full flex items-center justify-center ${
                  selectedFormat === format.id ? format.color : 'bg-gray-100'
                }`}>
                  <format.icon className={`h-6 w-6 ${
                    selectedFormat === format.id ? 'text-white' : 'text-gray-600'
                  }`} />
                </div>
                <h3 className={`font-semibold mb-2 ${
                  selectedFormat === format.id ? format.textColor : 'text-gray-900'
                }`}>
                  {format.title}
                </h3>
                <p className="text-sm text-gray-600">{format.description}</p>
                {selectedFormat === format.id && (
                  <Badge className="mt-2 bg-primary">Sélectionné</Badge>
                )}
              </CardContent>
            </Card>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonFormatSelector;
