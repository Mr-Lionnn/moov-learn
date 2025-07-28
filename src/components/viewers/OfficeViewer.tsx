import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Download, 
  ExternalLink, 
  FileText, 
  Presentation, 
  Table,
  AlertCircle
} from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';

interface OfficeViewerProps {
  url: string;
  type: 'docx' | 'pptx' | 'xlsx';
  fileName: string;
  onDownload?: () => void;
}

const OfficeViewer = ({ url, type, fileName, onDownload }: OfficeViewerProps) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [officeUrl, setOfficeUrl] = useState('');

  useEffect(() => {
    // Create Office Online viewer URL
    const baseUrl = 'https://view.officeapps.live.com/op/embed.aspx';
    const encodedUrl = encodeURIComponent(url);
    const viewerUrl = `${baseUrl}?src=${encodedUrl}`;
    
    setOfficeUrl(viewerUrl);
    setLoading(false);
  }, [url]);

  const getFileIcon = (type: string) => {
    switch (type) {
      case 'docx':
        return <FileText className="h-6 w-6 text-blue-600" />;
      case 'pptx':
        return <Presentation className="h-6 w-6 text-orange-600" />;
      case 'xlsx':
        return <Table className="h-6 w-6 text-green-600" />;
      default:
        return <FileText className="h-6 w-6 text-gray-600" />;
    }
  };

  const getFileTypeLabel = (type: string) => {
    switch (type) {
      case 'docx':
        return 'Document Word';
      case 'pptx':
        return 'Présentation PowerPoint';
      case 'xlsx':
        return 'Classeur Excel';
      default:
        return 'Document Office';
    }
  };

  const openInNewTab = () => {
    window.open(url, '_blank');
  };

  const openInOfficeOnline = () => {
    window.open(officeUrl, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-muted-foreground">Préparation du document...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between p-4 border-b bg-muted/50 rounded-t-lg">
        <div className="flex items-center gap-3">
          {getFileIcon(type)}
          <div>
            <h3 className="font-medium">{fileName}</h3>
            <Badge variant="outline" className="text-xs mt-1">
              {getFileTypeLabel(type)}
            </Badge>
          </div>
        </div>
        
        <div className="flex items-center gap-2">
          <Button variant="ghost" size="sm" onClick={openInOfficeOnline}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Office Online
          </Button>
          {onDownload && (
            <Button variant="ghost" size="sm" onClick={onDownload}>
              <Download className="h-4 w-4" />
            </Button>
          )}
        </div>
      </div>

      {/* Office Online Viewer */}
      <div className="relative">
        <Alert className="mb-4">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Le document est affiché via Microsoft Office Online. Pour une meilleure expérience, 
            vous pouvez l'ouvrir dans un nouvel onglet ou le télécharger.
          </AlertDescription>
        </Alert>

        <div className="bg-muted/30 rounded-lg p-4 min-h-[600px]">
          <iframe
            src={officeUrl}
            className="w-full h-[600px] border-0 rounded-lg"
            title={fileName}
            onLoad={() => setLoading(false)}
            onError={() => setError('Erreur lors du chargement du document')}
          />
        </div>

        {error && (
          <div className="flex items-center justify-center min-h-[400px] bg-muted/50 rounded-lg">
            <div className="text-center">
              <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
              <p className="text-destructive mb-4">{error}</p>
              <div className="space-x-2">
                <Button variant="outline" onClick={openInNewTab}>
                  Ouvrir le fichier original
                </Button>
                {onDownload && (
                  <Button variant="outline" onClick={onDownload}>
                    Télécharger
                  </Button>
                )}
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Alternative Actions */}
      <div className="flex justify-center gap-4 p-4 bg-muted/50 rounded-b-lg">
        <Button variant="outline" onClick={openInNewTab}>
          <ExternalLink className="h-4 w-4 mr-2" />
          Ouvrir dans un nouvel onglet
        </Button>
        <Button variant="outline" onClick={openInOfficeOnline}>
          <ExternalLink className="h-4 w-4 mr-2" />
          Voir dans Office Online
        </Button>
      </div>
    </div>
  );
};

export default OfficeViewer;