import { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { 
  Download, 
  ZoomIn, 
  ZoomOut, 
  Maximize, 
  Minimize, 
  ChevronLeft, 
  ChevronRight, 
  Save,
  FileText,
  File,
  FileImage,
  FileVideo,
  Volume2,
  RotateCcw,
  RotateCw,
  Eye,
  X
} from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface DocumentFile {
  id: number;
  name: string;
  size: string;
  type: string;
  author: string;
  downloads: number;
  date: string;
  category?: string;
  url?: string;
  content?: string;
}

interface DocumentViewerProps {
  isOpen: boolean;
  onClose: () => void;
  file: DocumentFile | null;
  onSave?: (file: DocumentFile) => void;
  onDownload?: (file: DocumentFile) => void;
}

const DocumentViewer = ({ isOpen, onClose, file, onSave, onDownload }: DocumentViewerProps) => {
  const [zoom, setZoom] = useState(100);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [rotation, setRotation] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    if (file) {
      setZoom(100);
      setCurrentPage(1);
      setRotation(0);
      setError(null);
      loadDocument();
    }
  }, [file]);

  const loadDocument = async () => {
    if (!file) return;
    
    setIsLoading(true);
    setError(null);
    
    try {
      // Simulate loading delay
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // Set mock total pages based on file type
      const extension = file.name.split('.').pop()?.toLowerCase();
      switch (extension) {
        case 'pdf':
          setTotalPages(Math.floor(Math.random() * 10) + 3);
          break;
        case 'pptx':
        case 'ppt':
          setTotalPages(Math.floor(Math.random() * 20) + 5);
          break;
        default:
          setTotalPages(1);
      }
    } catch (err) {
      setError('Erreur lors du chargement du document');
    } finally {
      setIsLoading(false);
    }
  };

  const getFileIcon = (filename: string) => {
    const extension = filename.split('.').pop()?.toLowerCase();
    switch (extension) {
      case 'pdf':
      case 'doc':
      case 'docx':
      case 'txt':
        return <FileText className="h-6 w-6 text-red-600" />;
      case 'ppt':
      case 'pptx':
        return <FileText className="h-6 w-6 text-orange-600" />;
      case 'xls':
      case 'xlsx':
        return <FileText className="h-6 w-6 text-green-600" />;
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return <FileImage className="h-6 w-6 text-blue-600" />;
      case 'mp4':
      case 'avi':
      case 'mov':
        return <FileVideo className="h-6 w-6 text-purple-600" />;
      case 'mp3':
      case 'wav':
        return <Volume2 className="h-6 w-6 text-yellow-600" />;
      default:
        return <File className="h-6 w-6 text-gray-600" />;
    }
  };

  const renderDocumentContent = () => {
    if (!file) return null;

    const extension = file.name.split('.').pop()?.toLowerCase();
    
    if (isLoading) {
      return (
        <div className="flex items-center justify-center h-96">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="ml-2">Chargement du document...</span>
        </div>
      );
    }

    if (error) {
      return (
        <div className="flex flex-col items-center justify-center h-96 text-center">
          <FileText className="h-12 w-12 text-gray-400 mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">Erreur de chargement</h3>
          <p className="text-gray-600 mb-4">{error}</p>
          <Button onClick={loadDocument} variant="outline">
            Réessayer
          </Button>
        </div>
      );
    }

    // Mock content based on file type
    const mockContent = generateMockContent(file.name, extension || '');

    return (
      <div 
        className="bg-white shadow-lg rounded-lg p-6 min-h-96 transition-transform duration-200"
        style={{ 
          transform: `scale(${zoom / 100}) rotate(${rotation}deg)`,
          transformOrigin: 'center top'
        }}
      >
        <div className="mb-4 text-center">
          <Badge variant="outline" className="mb-2">{extension?.toUpperCase()}</Badge>
          <h3 className="font-medium text-gray-900">{file.name}</h3>
          {totalPages > 1 && (
            <p className="text-sm text-gray-600">Page {currentPage} sur {totalPages}</p>
          )}
        </div>
        
        <div className="prose max-w-none">
          {mockContent}
        </div>
      </div>
    );
  };

  const generateMockContent = (filename: string, extension: string) => {
    switch (extension) {
      case 'pdf':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Document de Formation - {filename}</h2>
            <p>Ce document contient des informations détaillées sur les concepts abordés dans le module de formation.</p>
            <h3 className="text-lg font-semibold">1. Introduction</h3>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <h3 className="text-lg font-semibold">2. Concepts Clés</h3>
            <ul className="list-disc pl-6">
              <li>Point important numéro 1</li>
              <li>Point important numéro 2</li>
              <li>Point important numéro 3</li>
            </ul>
            <h3 className="text-lg font-semibold">3. Exercices Pratiques</h3>
            <p>Voici quelques exercices pour mettre en pratique les concepts appris.</p>
          </div>
        );
      case 'docx':
      case 'doc':
        return (
          <div className="space-y-3">
            <h1 className="text-2xl font-bold text-center">Rapport de Formation</h1>
            <p className="text-center text-gray-600">Document généré le {new Date().toLocaleDateString('fr-FR')}</p>
            <hr className="my-4" />
            <h2 className="text-lg font-semibold">Résumé Exécutif</h2>
            <p>Ce document présente un aperçu complet des éléments de formation couverts dans ce module.</p>
            <h2 className="text-lg font-semibold">Objectifs d'Apprentissage</h2>
            <ol className="list-decimal pl-6">
              <li>Comprendre les concepts fondamentaux</li>
              <li>Appliquer les techniques apprises</li>
              <li>Évaluer les résultats obtenus</li>
            </ol>
          </div>
        );
      case 'pptx':
      case 'ppt':
        return (
          <div className="bg-gradient-to-br from-blue-50 to-white p-8 rounded-lg text-center">
            <h1 className="text-3xl font-bold text-blue-800 mb-6">Présentation de Formation</h1>
            <div className="bg-white p-6 rounded-lg shadow-sm mb-6">
              <h2 className="text-xl font-semibold mb-4">Diapositive {currentPage}</h2>
              <p className="text-gray-700">Contenu de la présentation pour la formation en cours.</p>
            </div>
            <div className="flex justify-center gap-2">
              {[...Array(Math.min(totalPages, 5))].map((_, i) => (
                <div 
                  key={i} 
                  className={`w-3 h-3 rounded-full ${i + 1 === currentPage ? 'bg-blue-600' : 'bg-gray-300'}`} 
                />
              ))}
            </div>
          </div>
        );
      case 'xlsx':
      case 'xls':
        return (
          <div className="space-y-4">
            <h2 className="text-xl font-bold">Feuille de Calcul - {filename}</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full border-collapse border border-gray-300">
                <thead>
                  <tr className="bg-gray-50">
                    <th className="border border-gray-300 p-2">Élément</th>
                    <th className="border border-gray-300 p-2">Valeur</th>
                    <th className="border border-gray-300 p-2">Statut</th>
                  </tr>
                </thead>
                <tbody>
                  {[...Array(5)].map((_, i) => (
                    <tr key={i}>
                      <td className="border border-gray-300 p-2">Élément {i + 1}</td>
                      <td className="border border-gray-300 p-2">{Math.floor(Math.random() * 100)}</td>
                      <td className="border border-gray-300 p-2">
                        <Badge variant={i % 2 === 0 ? "default" : "secondary"}>
                          {i % 2 === 0 ? "Complété" : "En cours"}
                        </Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        );
      case 'txt':
        return (
          <div className="font-mono text-sm space-y-2">
            <p># Notes de Formation - {filename}</p>
            <p># Créé le: {new Date().toLocaleDateString('fr-FR')}</p>
            <p></p>
            <p>== SECTION 1: Introduction ==</p>
            <p>Ceci est un fichier texte contenant des notes importantes pour la formation.</p>
            <p></p>
            <p>== SECTION 2: Points Clés ==</p>
            <p>- Point important 1</p>
            <p>- Point important 2</p>
            <p>- Point important 3</p>
            <p></p>
            <p>== SECTION 3: Instructions ==</p>
            <p>Suivez les étapes suivantes pour compléter le module:</p>
            <p>1. Lisez attentivement le contenu</p>
            <p>2. Pratiquez les exercices</p>
            <p>3. Passez le quiz final</p>
          </div>
        );
      case 'jpg':
      case 'jpeg':
      case 'png':
      case 'gif':
        return (
          <div className="text-center">
            <div className="bg-gradient-to-br from-gray-100 to-gray-200 rounded-lg p-12 mb-4">
              <FileImage className="h-24 w-24 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Aperçu de l'image: {filename}</p>
              <p className="text-sm text-gray-500 mt-2">Image de formation ou diagramme explicatif</p>
            </div>
          </div>
        );
      default:
        return (
          <div className="text-center py-12">
            <File className="h-16 w-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">Aperçu non disponible</h3>
            <p className="text-gray-600">Ce type de fichier ne peut pas être affiché dans le navigateur.</p>
            <p className="text-sm text-gray-500 mt-2">Utilisez le bouton Télécharger pour ouvrir avec une application externe.</p>
          </div>
        );
    }
  };

  const handleZoomIn = () => {
    setZoom(prev => Math.min(prev + 25, 200));
  };

  const handleZoomOut = () => {
    setZoom(prev => Math.max(prev - 25, 50));
  };

  const handlePreviousPage = () => {
    setCurrentPage(prev => Math.max(prev - 1, 1));
  };

  const handleNextPage = () => {
    setCurrentPage(prev => Math.min(prev + 1, totalPages));
  };

  const handleRotateLeft = () => {
    setRotation(prev => prev - 90);
  };

  const handleRotateRight = () => {
    setRotation(prev => prev + 90);
  };

  const handleSave = () => {
    if (file && onSave) {
      onSave(file);
      toast({
        title: "Document sauvegardé",
        description: `${file.name} a été ajouté à vos documents sauvegardés`,
      });
    }
  };

  const handleDownload = () => {
    if (file && onDownload) {
      onDownload(file);
      toast({
        title: "Téléchargement démarré",
        description: `${file.name} est en cours de téléchargement`,
      });
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  if (!file) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent 
        className={`${
          isFullscreen 
            ? 'max-w-[95vw] max-h-[95vh] w-[95vw] h-[95vh]' 
            : 'max-w-4xl max-h-[90vh] w-full'
        } transition-all duration-300`}
      >
        <DialogHeader className="flex flex-row items-center justify-between space-y-0">
          <DialogTitle className="flex items-center gap-2">
            {getFileIcon(file.name)}
            <span className="truncate">{file.name}</span>
          </DialogTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </DialogHeader>
        
        {/* Document Controls */}
        <div className="flex flex-wrap items-center justify-between gap-2 p-2 bg-gray-50 rounded-lg">
          <div className="flex items-center gap-1">
            {totalPages > 1 && (
              <>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handlePreviousPage}
                  disabled={currentPage === 1}
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <span className="text-sm px-2">
                  {currentPage} / {totalPages}
                </span>
                <Button 
                  variant="outline" 
                  size="sm" 
                  onClick={handleNextPage}
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </>
            )}
          </div>
          
          <div className="flex items-center gap-1">
            <Button variant="outline" size="sm" onClick={handleZoomOut} disabled={zoom <= 50}>
              <ZoomOut className="h-4 w-4" />
            </Button>
            <span className="text-sm px-2 min-w-[4rem] text-center">{zoom}%</span>
            <Button variant="outline" size="sm" onClick={handleZoomIn} disabled={zoom >= 200}>
              <ZoomIn className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="sm" onClick={handleRotateLeft}>
              <RotateCcw className="h-4 w-4" />
            </Button>
            <Button variant="outline" size="sm" onClick={handleRotateRight}>
              <RotateCw className="h-4 w-4" />
            </Button>
            
            <Button variant="outline" size="sm" onClick={toggleFullscreen}>
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
          </div>
        </div>

        {/* Document Content */}
        <ScrollArea className={`${isFullscreen ? 'h-[calc(95vh-12rem)]' : 'h-[60vh]'} border rounded-lg`}>
          <div className="p-4">
            {renderDocumentContent()}
          </div>
        </ScrollArea>

        {/* Document Info and Actions */}
        <div className="space-y-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
            <div>
              <span className="text-gray-600">Taille:</span>
              <p className="font-medium">{file.size}</p>
            </div>
            <div>
              <span className="text-gray-600">Type:</span>
              <Badge variant="outline">{file.type}</Badge>
            </div>
            <div>
              <span className="text-gray-600">Auteur:</span>
              <p className="font-medium">{file.author}</p>
            </div>
            <div>
              <span className="text-gray-600">Téléchargements:</span>
              <p className="font-medium">{file.downloads}</p>
            </div>
          </div>

          <div className="flex gap-2">
            <Button onClick={handleSave} variant="outline" className="flex-1">
              <Save className="h-4 w-4 mr-2" />
              Sauvegarder
            </Button>
            <Button onClick={handleDownload} className="flex-1">
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default DocumentViewer;