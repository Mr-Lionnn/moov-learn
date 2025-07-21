import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Video, Download, Eye, Play, Pause } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";

interface MoovDocumentContentProps {
  title: string;
  fileName: string;
  fileType: string;
  duration?: string;
  onComplete: () => void;
}

const MoovDocumentContent = ({ 
  title, 
  fileName, 
  fileType, 
  duration,
  onComplete 
}: MoovDocumentContentProps) => {
  const { toast } = useToast();
  const [isViewing, setIsViewing] = useState(false);
  const [progress, setProgress] = useState(0);

  const getFileIcon = () => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return <FileText className="h-8 w-8 text-red-600" />;
      case "docx":
        return <FileText className="h-8 w-8 text-blue-600" />;
      case "pptx":
        return <FileText className="h-8 w-8 text-orange-600" />;
      case "mp4":
        return <Video className="h-8 w-8 text-purple-600" />;
      default:
        return <FileText className="h-8 w-8 text-gray-600" />;
    }
  };

  const getFileTypeLabel = () => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return "Document PDF";
      case "docx":
        return "Document Word";
      case "pptx":
        return "Présentation PowerPoint";
      case "mp4":
        return "Vidéo de Formation";
      default:
        return "Document";
    }
  };

  const handleViewDocument = () => {
    setIsViewing(true);
    // Simulate document viewing progress
    let currentProgress = 0;
    const interval = setInterval(() => {
      currentProgress += 10;
      setProgress(currentProgress);
      if (currentProgress >= 100) {
        clearInterval(interval);
        setTimeout(() => {
          toast({
            title: "Document consulté",
            description: "Vous avez terminé la consultation de ce document.",
          });
        }, 1000);
      }
    }, 800);
  };

  const handleComplete = () => {
    if (progress >= 100) {
      onComplete();
      toast({
        title: "Leçon terminée",
        description: `${title} a été marquée comme terminée.`,
      });
    } else {
      toast({
        title: "Document non consulté",
        description: "Veuillez d'abord consulter le document entièrement.",
        variant: "destructive"
      });
    }
  };

  const getFilePreview = () => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return (
          <div className="bg-red-50 p-6 rounded-lg border border-red-200">
            <div className="flex items-center justify-center h-64 bg-white rounded border-2 border-dashed border-red-300">
              <div className="text-center">
                <FileText className="h-16 w-16 text-red-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600">Aperçu du document PDF</p>
                <p className="text-xs text-gray-500 mt-2">Cliquez sur "Consulter" pour ouvrir</p>
              </div>
            </div>
          </div>
        );
      case "docx":
        return (
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <div className="flex items-center justify-center h-64 bg-white rounded border-2 border-dashed border-blue-300">
              <div className="text-center">
                <FileText className="h-16 w-16 text-blue-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600">Document Word</p>
                <p className="text-xs text-gray-500 mt-2">Argumentaires et guides pratiques</p>
              </div>
            </div>
          </div>
        );
      case "pptx":
        return (
          <div className="bg-orange-50 p-6 rounded-lg border border-orange-200">
            <div className="flex items-center justify-center h-64 bg-white rounded border-2 border-dashed border-orange-300">
              <div className="text-center">
                <FileText className="h-16 w-16 text-orange-400 mx-auto mb-4" />
                <p className="text-sm text-gray-600">Présentation PowerPoint</p>
                <p className="text-xs text-gray-500 mt-2">Supports de formation visuels</p>
              </div>
            </div>
          </div>
        );
      case "mp4":
        return (
          <div className="bg-purple-50 p-6 rounded-lg border border-purple-200">
            <div className="flex items-center justify-center h-64 bg-black rounded">
              <div className="text-center text-white">
                <Video className="h-16 w-16 text-purple-400 mx-auto mb-4" />
                <p className="text-sm">Vidéo de Formation</p>
                <p className="text-xs text-gray-300 mt-2">Intelligence Artificielle Moov</p>
              </div>
            </div>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              {getFileIcon()}
              <div>
                <CardTitle className="text-lg">{title}</CardTitle>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{getFileTypeLabel()}</Badge>
                  {duration && <Badge variant="outline">{duration}</Badge>}
                </div>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="text-sm text-muted-foreground">
              <p><strong>Fichier:</strong> {fileName}</p>
              <p><strong>Type:</strong> {getFileTypeLabel()}</p>
              {duration && <p><strong>Durée estimée:</strong> {duration}</p>}
            </div>

            {getFilePreview()}

            {isViewing && progress > 0 && (
              <div className="space-y-2">
                <div className="flex justify-between text-sm">
                  <span>Progression de la consultation</span>
                  <span>{progress}%</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-primary h-2 rounded-full transition-all duration-300" 
                    style={{ width: `${progress}%` }}
                  ></div>
                </div>
              </div>
            )}

            <div className="flex gap-3 flex-wrap">
              <Button
                onClick={handleViewDocument}
                disabled={isViewing && progress < 100}
                className="flex-1 sm:flex-none"
              >
                <Eye className="h-4 w-4 mr-2" />
                {isViewing && progress < 100 ? 'Consultation en cours...' : 'Consulter le Document'}
              </Button>
              
              <Button
                variant="outline"
                onClick={() => {
                  toast({
                    title: "Téléchargement",
                    description: `${fileName} sera téléchargé.`,
                  });
                }}
                className="flex-1 sm:flex-none"
              >
                <Download className="h-4 w-4 mr-2" />
                Télécharger
              </Button>
            </div>

            {progress >= 100 && (
              <Button
                onClick={handleComplete}
                className="w-full"
                size="lg"
              >
                Marquer comme Terminé
              </Button>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MoovDocumentContent;