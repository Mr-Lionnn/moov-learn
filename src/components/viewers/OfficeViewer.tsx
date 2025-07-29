import { useEffect, useState } from 'react';
import { ContentFile, ViewerState } from '@/types/content';
import { Button } from '@/components/ui/button';
import { Loader2, X, AlertCircle, ExternalLink } from 'lucide-react';
import { sanitizeHtml } from '@/utils/security';
import mammoth from 'mammoth';
import * as XLSX from 'xlsx';

interface OfficeViewerProps {
  file: ContentFile;
  viewerState: ViewerState;
  onViewerStateChange: (state: Partial<ViewerState>) => void;
}

const OfficeViewer = ({ file, viewerState, onViewerStateChange }: OfficeViewerProps) => {
  const [content, setContent] = useState<string>('');
  const [useOfficeOnline, setUseOfficeOnline] = useState(false);

  useEffect(() => {
    loadDocument();
  }, [file.url]);

  const loadDocument = async () => {
    try {
      onViewerStateChange({ loading: true, error: undefined });

      if (file.type === 'docx') {
        await loadWordDocument();
      } else if (file.type === 'pptx') {
        // For PowerPoint, we'll use Office Online
        setUseOfficeOnline(true);
        onViewerStateChange({ loading: false });
      } else if (file.type === 'xlsx') {
        await loadExcelDocument();
      }
    } catch (error) {
      console.error('Error loading document:', error);
      onViewerStateChange({ 
        loading: false, 
        error: 'Erreur lors du chargement du document. Tentative avec Office Online...' 
      });
      setUseOfficeOnline(true);
    }
  };

  const loadWordDocument = async () => {
    try {
      const response = await fetch(file.url);
      const arrayBuffer = await response.arrayBuffer();
      
      const result = await mammoth.convertToHtml({ arrayBuffer });
      setContent(result.value);
      
      if (result.messages.length > 0) {
        console.warn('Mammoth warnings:', result.messages);
      }
      
      onViewerStateChange({ loading: false, totalPages: 1 });
    } catch (error) {
      throw new Error('Failed to load Word document');
    }
  };

  const loadExcelDocument = async () => {
    try {
      const response = await fetch(file.url);
      const arrayBuffer = await response.arrayBuffer();
      
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const htmlTable = XLSX.utils.sheet_to_html(worksheet);
      
      setContent(`
        <div class="excel-viewer">
          <h3>Feuille: ${workbook.SheetNames[0]}</h3>
          ${htmlTable}
        </div>
      `);
      
      onViewerStateChange({ 
        loading: false, 
        totalPages: workbook.SheetNames.length 
      });
    } catch (error) {
      throw new Error('Failed to load Excel document');
    }
  };

  const getOfficeOnlineUrl = () => {
    // Microsoft Office Online viewer URL
    const baseUrl = 'https://view.officeapps.live.com/op/embed.aspx';
    return `${baseUrl}?src=${encodeURIComponent(file.url)}`;
  };

  if (viewerState.loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">
            Chargement du document {file.type.toUpperCase()}...
          </p>
        </div>
      </div>
    );
  }

  if (viewerState.error && !useOfficeOnline) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
          <p className="text-destructive mb-4">{viewerState.error}</p>
          <Button onClick={() => setUseOfficeOnline(true)}>
            <ExternalLink className="h-4 w-4 mr-2" />
            Ouvrir avec Office Online
          </Button>
        </div>
      </div>
    );
  }

  if (useOfficeOnline) {
    return (
      <div className="h-full flex flex-col">
        <div className="p-4 bg-muted/30 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <AlertCircle className="h-4 w-4 text-warning" />
            <span className="text-sm">
              Document affiché via Microsoft Office Online
            </span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(file.url, '_blank')}
          >
            <ExternalLink className="h-4 w-4 mr-2" />
            Ouvrir dans un nouvel onglet
          </Button>
        </div>
        <iframe
          src={getOfficeOnlineUrl()}
          className="flex-1 w-full border-0"
          title={`Viewer for ${file.name}`}
          onError={() => {
            onViewerStateChange({ 
              error: 'Impossible de charger le document. Le fichier pourrait ne pas être accessible publiquement.' 
            });
          }}
        />
      </div>
    );
  }

  return (
    <div className="h-full overflow-auto">
      <div className="p-6">
        <div
          className="prose prose-sm max-w-none"
          style={{
            transform: `scale(${viewerState.zoom / 100}) rotate(${viewerState.rotation}deg)`,
            transformOrigin: 'top left',
          }}
          dangerouslySetInnerHTML={{ __html: sanitizeHtml(content) }}
        />
      </div>
    </div>
  );
};

export default OfficeViewer;