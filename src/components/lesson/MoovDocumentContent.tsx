import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Video, Download, Eye, Play, Pause } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useToast } from "@/hooks/use-toast";
import DocumentViewer from "@/components/content/DocumentViewer";
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
  const [showDocumentViewer, setShowDocumentViewer] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);

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
    console.log('🔥 Viewing document:', fileName, fileType);
    setIsViewing(true);
    
    if (fileType.toLowerCase() === 'mp4') {
      // For video files, toggle play state
      setIsPlaying(!isPlaying);
    } else {
      // For documents, open the document viewer
      setShowDocumentViewer(true);
    }
    
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

  const createContentFile = (): ContentFile => {
    const getContentType = (type: string) => {
      switch (type.toLowerCase()) {
        case 'mp4': return 'mp4';
        case 'pdf': return 'pdf';
        case 'docx': return 'docx';
        case 'pptx': return 'pptx';
        default: return 'txt';
      }
    };

    return {
      id: fileName,
      name: fileName,
      type: getContentType(fileType),
      url: `/src/MoovCourse/${fileName}`,
      size: '0 MB',
      uploadDate: new Date().toISOString(),
      author: 'Moov',
      downloads: 0,
      teamIds: [],
      category: 'formation'
    };
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
          <div className="relative aspect-video bg-gradient-to-br from-red-50 to-red-100 rounded-lg border border-red-200 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
               onClick={handleViewDocument}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-red-500 rounded-lg flex items-center justify-center mb-4 mx-auto shadow-lg">
                  <FileText className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-red-700 mb-2">{fileName}</h3>
                <p className="text-sm text-red-600">Document PDF</p>
                <div className="mt-4 px-4 py-2 bg-red-500 text-white rounded-lg inline-flex items-center gap-2 text-sm">
                  <Eye className="h-4 w-4" />
                  Ouvrir le document
                </div>
              </div>
            </div>
          </div>
        );
      case "docx":
        return (
          <div className="relative aspect-video bg-gradient-to-br from-blue-50 to-blue-100 rounded-lg border border-blue-200 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
               onClick={handleViewDocument}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-blue-500 rounded-lg flex items-center justify-center mb-4 mx-auto shadow-lg">
                  <FileText className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-blue-700 mb-2">{fileName}</h3>
                <p className="text-sm text-blue-600">Document Word</p>
                <div className="mt-4 px-4 py-2 bg-blue-500 text-white rounded-lg inline-flex items-center gap-2 text-sm">
                  <Eye className="h-4 w-4" />
                  Ouvrir le document
                </div>
              </div>
            </div>
          </div>
        );
      case "pptx":
        return (
          <div className="relative aspect-video bg-gradient-to-br from-orange-50 to-orange-100 rounded-lg border border-orange-200 overflow-hidden cursor-pointer hover:shadow-lg transition-all duration-300"
               onClick={handleViewDocument}>
            <div className="absolute inset-0 flex items-center justify-center">
              <div className="text-center">
                <div className="w-20 h-20 bg-orange-500 rounded-lg flex items-center justify-center mb-4 mx-auto shadow-lg">
                  <FileText className="h-10 w-10 text-white" />
                </div>
                <h3 className="text-lg font-semibold text-orange-700 mb-2">{fileName}</h3>
                <p className="text-sm text-orange-600">Présentation PowerPoint</p>
                <div className="mt-4 px-4 py-2 bg-orange-500 text-white rounded-lg inline-flex items-center gap-2 text-sm">
                  <Eye className="h-4 w-4" />
                  Ouvrir la présentation
                </div>
              </div>
            </div>
          </div>
        );
      case "mp4":
        return (
          <div className="relative aspect-video bg-black rounded-lg overflow-hidden group cursor-pointer"
               onClick={handleViewDocument}>
            <video 
              className="w-full h-full object-cover" 
              poster="/placeholder.svg"
            >
              <source src={`/src/MoovCourse/${fileName}`} type="video/mp4" />
            </video>
            <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center group-hover:bg-opacity-50 transition-all duration-300">
              <div className="text-center text-white">
                <div className={`w-20 h-20 rounded-full flex items-center justify-center mb-4 mx-auto transition-all duration-300 ${
                  isPlaying ? 'bg-red-600' : 'bg-white bg-opacity-20 backdrop-blur-sm border-2 border-white'
                }`}>
                  {isPlaying ? (
                    <Pause className="h-8 w-8 text-white" />
                  ) : (
                    <Play className="h-8 w-8 text-white ml-1" />
                  )}
                </div>
                <h3 className="text-lg font-semibold mb-2">{title}</h3>
                <p className="text-sm text-gray-200">Vidéo de Formation</p>
                {duration && (
                  <div className="mt-2 px-3 py-1 bg-black bg-opacity-50 rounded-full text-xs">
                    {duration}
                  </div>
                )}
              </div>
            </div>
            {/* Progress bar for video viewing */}
            {isViewing && progress > 0 && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-black bg-opacity-50">
                <div 
                  className="h-full bg-red-500 transition-all duration-300" 
                  style={{ width: `${progress}%` }}
                />
              </div>
            )}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      {/* Main content preview */}
      <div className="space-y-4">
        {getFilePreview()}
        
        {/* Progress bar for non-video content */}
        {isViewing && progress > 0 && fileType.toLowerCase() !== 'mp4' && (
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progression de la consultation</span>
              <span>{progress}%</span>
            </div>
            <div className="w-full bg-secondary rounded-full h-2">
              <div 
                className="bg-primary h-2 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        )}
      </div>

      {/* Document information card */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {getFileIcon()}
                <div>
                  <h3 className="font-semibold text-lg">{title}</h3>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary">{getFileTypeLabel()}</Badge>
                    {duration && <Badge variant="outline">{duration}</Badge>}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4 text-sm text-muted-foreground">
              <div>
                <span className="font-medium">Fichier:</span> {fileName}
              </div>
              <div>
                <span className="font-medium">Type:</span> {getFileTypeLabel()}
              </div>
              {duration && (
                <div className="col-span-2">
                  <span className="font-medium">Durée estimée:</span> {duration}
                </div>
              )}
            </div>

            <div className="flex gap-3 pt-2">
              <Button
                variant="outline"
                onClick={() => {
                  const downloadPath = `/src/MoovCourse/${fileName}`;
                  const link = document.createElement('a');
                  link.href = downloadPath;
                  link.download = fileName;
                  link.click();
                  toast({
                    title: "Téléchargement",
                    description: `${fileName} téléchargé avec succès.`,
                  });
                }}
                className="flex-1"
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

      {/* Document Viewer Modal */}
      <DocumentViewer
        isOpen={showDocumentViewer}
        onClose={() => setShowDocumentViewer(false)}
        file={showDocumentViewer ? createContentFile() : null}
      />
    </div>
  );
};

export default MoovDocumentContent;