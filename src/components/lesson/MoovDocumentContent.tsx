import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Video, Download, Eye, Play, Pause, Save, Image } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import UniversalDocumentViewer from "@/components/viewers/UniversalDocumentViewer";
import { ContentFile } from "@/types/content";

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
  const [showViewer, setShowViewer] = useState(false);
  const [currentFile, setCurrentFile] = useState<ContentFile | null>(null);

  const getFileIcon = () => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return <FileText className="h-5 w-5 text-destructive" />;
      case "docx":
        return <FileText className="h-5 w-5 text-primary" />;
      case "pptx":
        return <FileText className="h-5 w-5 text-accent" />;
      case "mp4":
        return <Video className="h-5 w-5 text-secondary" />;
      case "jpg":
      case "png":
        return <Image className="h-5 w-5 text-primary" />;
      default:
        return <FileText className="h-5 w-5 text-muted-foreground" />;
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

  const getFileSize = () => {
    // Mock file sizes based on type
    switch (fileType.toLowerCase()) {
      case "pdf":
        return "2.3 MB";
      case "docx":
        return "1.2 MB";
      case "pptx":
        return "4.8 MB";
      case "mp4":
        return "45.7 MB";
      default:
        return "1.0 MB";
    }
  };

  const getFileDescription = () => {
    switch (fileType.toLowerCase()) {
      case "pdf":
        return "Manuel détaillé sur les protocoles TCP/IP";
      case "docx":
        return "Argumentaires de vente et stratégies commerciales";
      case "pptx":
        return "Présentation des services et solutions Moov";
      case "mp4":
        return "Formation vidéo sur l'Intelligence Artificielle";
      default:
        return "Document de formation";
    }
  };

  const handleViewDocument = () => {
    const file: ContentFile = {
      id: fileName,
      name: fileName,
      type: fileType.toLowerCase() as any,
      size: getFileSize(),
      url: `/public/MoovCourse/${fileName}`,
      author: "Pierre Durand",
      uploadDate: new Date().toISOString(),
      downloads: 156,
      teamIds: [1, 2],
      category: "Formation",
      description: getFileDescription()
    };
    
    setCurrentFile(file);
    setShowViewer(true);
    setIsViewing(true);
    
    // Simulate viewing progress
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

  const handleDownload = () => {
    const downloadPath = `/public/MoovCourse/${fileName}`;
    const link = document.createElement('a');
    link.href = downloadPath;
    link.download = fileName;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Téléchargement",
      description: `${fileName} téléchargé avec succès.`,
    });
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

  // Video preview component
  const VideoPreview = () => (
    <div className="relative w-full h-64 bg-gradient-to-br from-background to-muted rounded-lg overflow-hidden border">
      <div 
        className="w-full h-full bg-cover bg-center relative"
        style={{
          backgroundImage: "url('https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=800&h=400&fit=crop')"
        }}
      >
        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
          <div className="text-center text-white">
            <div className="w-16 h-16 rounded-full bg-primary/80 flex items-center justify-center mb-4 mx-auto">
              <Play className="h-8 w-8 text-white ml-1" />
            </div>
            <p className="text-lg font-medium">{title}</p>
            <p className="text-sm text-white/80 mt-1">Intelligence Artificielle Moov</p>
          </div>
        </div>
      </div>
    </div>
  );

  // Text content with document resources
  const TextContent = () => (
    <div className="space-y-6">
      <div className="prose prose-sm max-w-none">
        <p className="text-muted-foreground leading-relaxed">
          Le protocole TCP/IP (Transmission Control Protocol/Internet Protocol) est une suite de 
          protocoles de communication qui définit comment les données sont transmises sur 
          Internet. Développé dans les années 1970, il est devenu la norme universelle pour les 
          communications réseau.
        </p>
        <p className="text-muted-foreground leading-relaxed mt-4">
          Comprendre TCP/IP est essentiel pour tout professionnel de l'informatique, car il sous-
          tend pratiquement tous les aspects de la connectivité réseau moderne, des sites web 
          aux applications mobiles.
        </p>
      </div>

      <div className="border-t pt-6">
        <div className="flex items-center gap-2 mb-4">
          <FileText className="h-5 w-5 text-muted-foreground" />
          <h3 className="text-lg font-semibold">Documents et Ressources</h3>
        </div>
        
        <div className="space-y-3">
          <div className="flex items-center justify-between p-4 border rounded-lg hover:bg-muted/50 transition-colors">
            <div className="flex items-center gap-3">
              {getFileIcon()}
              <div>
                <h4 className="font-medium">{fileName}</h4>
                <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                  <span>{getFileSize()}</span>
                  <span>{getFileDescription()}</span>
                  <span>Par: Pierre Durand</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleViewDocument}
                className="text-primary hover:text-primary"
              >
                <Eye className="h-4 w-4 mr-1" />
                Voir
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleDownload}
              >
                <Save className="h-4 w-4 mr-1" />
                Sauvegarder
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <div className="space-y-6">
      {/* Progress bar for viewing */}
      {isViewing && progress > 0 && (
        <div className="space-y-2">
          <div className="flex justify-between text-sm">
            <span>Progression de visionnage</span>
            <span>{progress}%</span>
          </div>
          <div className="w-full bg-muted rounded-full h-2">
            <div 
              className="bg-primary h-2 rounded-full transition-all duration-300" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      )}

      {/* Main content */}
      {fileType.toLowerCase() === 'mp4' ? <VideoPreview /> : <TextContent />}

      {/* Mark as complete button */}
      {progress >= 100 && (
        <Button
          onClick={handleComplete}
          className="w-full"
          size="lg"
        >
          Marquer comme Terminé
        </Button>
      )}

      {/* Document Viewer Modal */}
      <UniversalDocumentViewer
        isOpen={showViewer}
        onClose={() => setShowViewer(false)}
        file={currentFile}
        onDownload={handleDownload}
      />
    </div>
  );
};

export default MoovDocumentContent;