import { useEffect, useRef, useState } from 'react';
import * as pdfjsLib from 'pdfjs-dist';
import { ContentFile, ViewerState } from '@/types/content';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Search, X, Loader2 } from 'lucide-react';

// Configure PDF.js worker
pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

interface PDFViewerProps {
  file: ContentFile;
  viewerState: ViewerState;
  onViewerStateChange: (state: Partial<ViewerState>) => void;
}

const PDFViewer = ({ file, viewerState, onViewerStateChange }: PDFViewerProps) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [pdfDoc, setPdfDoc] = useState<pdfjsLib.PDFDocumentProxy | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [searchVisible, setSearchVisible] = useState(false);

  useEffect(() => {
    loadPDF();
    return () => {
      if (pdfDoc) {
        pdfDoc.destroy();
      }
    };
  }, [file.url]);

  useEffect(() => {
    if (pdfDoc) {
      renderPage();
    }
  }, [pdfDoc, viewerState.currentPage, viewerState.zoom, viewerState.rotation]);

  const loadPDF = async () => {
    try {
      onViewerStateChange({ loading: true, error: undefined });
      
      const pdf = await pdfjsLib.getDocument(file.url).promise;
      setPdfDoc(pdf);
      
      onViewerStateChange({ 
        loading: false, 
        totalPages: pdf.numPages,
        currentPage: 1 
      });
    } catch (error) {
      console.error('Error loading PDF:', error);
      onViewerStateChange({ 
        loading: false, 
        error: 'Erreur lors du chargement du PDF. Vérifiez que le fichier est accessible.' 
      });
    }
  };

  const renderPage = async () => {
    if (!pdfDoc || !canvasRef.current) return;

    try {
      const page = await pdfDoc.getPage(viewerState.currentPage);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d')!;

      // Calculate scale based on zoom
      const viewport = page.getViewport({ scale: 1 });
      const scale = (viewerState.zoom / 100) * (canvas.parentElement!.clientWidth / viewport.width);
      const scaledViewport = page.getViewport({ scale, rotation: viewerState.rotation });

      canvas.height = scaledViewport.height;
      canvas.width = scaledViewport.width;

      // Clear previous content
      context.clearRect(0, 0, canvas.width, canvas.height);

      const renderContext = {
        canvasContext: context,
        viewport: scaledViewport,
        canvas: canvas,
      };

      await page.render(renderContext).promise;
    } catch (error) {
      console.error('Error rendering page:', error);
    }
  };

  const handleSearch = async () => {
    if (!pdfDoc || !searchTerm.trim()) return;

    try {
      // Simple search implementation - in production, you'd want more sophisticated text extraction
      for (let i = 1; i <= pdfDoc.numPages; i++) {
        const page = await pdfDoc.getPage(i);
        const textContent = await page.getTextContent();
        const textItems = textContent.items.map((item: any) => item.str).join(' ');
        
        if (textItems.toLowerCase().includes(searchTerm.toLowerCase())) {
          onViewerStateChange({ currentPage: i });
          break;
        }
      }
    } catch (error) {
      console.error('Error searching PDF:', error);
    }
  };

  if (viewerState.loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-muted-foreground">Chargement du PDF...</p>
        </div>
      </div>
    );
  }

  if (viewerState.error) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center text-destructive">
          <X className="h-12 w-12 mx-auto mb-4" />
          <p>{viewerState.error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full flex flex-col">
      {/* Search Bar */}
      {searchVisible && (
        <div className="flex items-center gap-2 p-2 border-b">
          <Input
            placeholder="Rechercher dans le document..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            className="flex-1"
          />
          <Button variant="outline" size="sm" onClick={handleSearch}>
            <Search className="h-4 w-4" />
          </Button>
          <Button variant="ghost" size="sm" onClick={() => setSearchVisible(false)}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {/* Search Toggle */}
      {!searchVisible && (
        <div className="flex justify-end p-2">
          <Button variant="outline" size="sm" onClick={() => setSearchVisible(true)}>
            <Search className="h-4 w-4 mr-2" />
            Rechercher
          </Button>
        </div>
      )}

      {/* PDF Canvas */}
      <div className="flex-1 overflow-auto flex justify-center items-start p-4">
        <canvas
          ref={canvasRef}
          className="border shadow-lg max-w-full"
          style={{
            transform: `rotate(${viewerState.rotation}deg)`,
          }}
        />
      </div>
    </div>
  );
};

export default PDFViewer;