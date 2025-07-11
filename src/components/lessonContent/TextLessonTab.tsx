import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  BookOpen, 
  FileText, 
  Download, 
  Search, 
  Bookmark,
  Share,
  ZoomIn,
  ZoomOut,
  Eye
} from "lucide-react";

interface TextLessonTabProps {
  onComplete: () => void;
  title?: string;
  content?: string;
}

const TextLessonTab = ({ onComplete, title = "Contenu Textuel", content }: TextLessonTabProps) => {
  const [readingProgress, setReadingProgress] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [fontSize, setFontSize] = useState(16);
  const [searchTerm, setSearchTerm] = useState("");
  const [bookmarks, setBookmarks] = useState<number[]>([]);
  const [currentSection, setCurrentSection] = useState(0);

  const defaultContent = `
    <h1>Communication Efficace en Service Client</h1>
    
    <h2>Introduction</h2>
    <p>La communication efficace est la pierre angulaire d'un service client exceptionnel. Elle détermine non seulement la satisfaction du client, mais aussi la réputation de votre entreprise.</p>
    
    <h2>1. Les Fondamentaux de la Communication</h2>
    <p>Une communication efficace repose sur plusieurs piliers essentiels :</p>
    <ul>
      <li><strong>L'écoute active :</strong> Portez une attention totale à ce que dit le client</li>
      <li><strong>L'empathie :</strong> Mettez-vous à la place du client pour comprendre ses émotions</li>
      <li><strong>La clarté :</strong> Exprimez-vous de manière simple et compréhensible</li>
      <li><strong>La patience :</strong> Prenez le temps nécessaire pour résoudre les problèmes</li>
    </ul>
    
    <h2>2. Techniques de Communication Verbale</h2>
    <p>Votre façon de parler influence directement la perception du client :</p>
    <ul>
      <li>Utilisez un ton chaleureux et professionnel</li>
      <li>Adaptez votre vocabulaire au niveau du client</li>
      <li>Posez des questions ouvertes pour mieux comprendre</li>
      <li>Reformulez les préoccupations du client pour confirmation</li>
    </ul>
    
    <blockquote>
      <p>"La communication est la compétence la plus importante que vous puissiez développer." - Warren Buffett</p>
    </blockquote>
    
    <h2>3. Gestion des Émotions</h2>
    <p>Les clients peuvent parfois être frustrés ou en colère. Voici comment gérer ces situations :</p>
    <ol>
      <li>Restez calme et composé</li>
      <li>Reconnaissez les émotions du client</li>
      <li>Évitez de prendre les critiques personnellement</li>
      <li>Concentrez-vous sur la solution</li>
    </ol>
    
    <h2>4. Communication Non-Verbale</h2>
    <p>Même au téléphone, votre langage corporel influence votre voix :</p>
    <ul>
      <li>Souriez pendant que vous parlez - cela s'entend</li>
      <li>Maintenez une posture droite</li>
      <li>Utilisez des gestes même si le client ne vous voit pas</li>
    </ul>
    
    <h2>5. Résolution de Problèmes</h2>
    <p>Chaque interaction est une opportunité de résoudre un problème :</p>
    <ol>
      <li>Identifiez clairement le problème</li>
      <li>Explorez toutes les options disponibles</li>
      <li>Proposez des solutions concrètes</li>
      <li>Assurez-vous que le client est satisfait</li>
    </ol>
    
    <h2>Conclusion</h2>
    <p>Une communication efficace transforme les interactions client en opportunités de fidélisation. En appliquant ces principes, vous contribuez non seulement à la satisfaction client, mais aussi au succès de votre entreprise.</p>
    
    <div class="key-points">
      <h3>Points Clés à Retenir :</h3>
      <ul>
        <li>L'écoute active est fondamentale</li>
        <li>Adaptez votre communication à chaque client</li>
        <li>Restez professionnel même dans les situations difficiles</li>
        <li>Chaque interaction est une opportunité d'amélioration</li>
      </ul>
    </div>
  `;

  const sections = [
    "Introduction",
    "Fondamentaux de la Communication", 
    "Techniques de Communication Verbale",
    "Gestion des Émotions",
    "Communication Non-Verbale",
    "Résolution de Problèmes",
    "Conclusion"
  ];

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
      
      // Auto-progress reading based on time spent
      if (timeSpent > 30 && readingProgress < 100) {
        setReadingProgress(prev => Math.min(100, prev + 2));
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [timeSpent, readingProgress]);

  const handleBookmark = (sectionIndex: number) => {
    setBookmarks(prev => 
      prev.includes(sectionIndex) 
        ? prev.filter(b => b !== sectionIndex)
        : [...prev, sectionIndex]
    );
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${minutes}:${secs.toString().padStart(2, '0')}`;
  };

  const handleZoom = (direction: 'in' | 'out') => {
    setFontSize(prev => {
      if (direction === 'in') return Math.min(24, prev + 2);
      return Math.max(12, prev - 2);
    });
  };

  const highlightSearchTerm = (text: string) => {
    if (!searchTerm) return text;
    
    const regex = new RegExp(`(${searchTerm})`, 'gi');
    return text.replace(regex, '<mark>$1</mark>');
  };

  return (
    <div className="space-y-4">
      {/* Reading Controls */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <Badge variant="secondary">
                <Eye className="h-3 w-3 mr-1" />
                Temps de lecture: {formatTime(timeSpent)}
              </Badge>
              <Badge variant="outline">
                Section {currentSection + 1} / {sections.length}
              </Badge>
            </div>
            
            <div className="flex items-center gap-2">
              <Button variant="outline" size="sm" onClick={() => handleZoom('out')}>
                <ZoomOut className="h-4 w-4" />
              </Button>
              <span className="text-sm">{fontSize}px</span>
              <Button variant="outline" size="sm" onClick={() => handleZoom('in')}>
                <ZoomIn className="h-4 w-4" />
              </Button>
            </div>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>Progression de lecture</span>
              <span>{readingProgress}%</span>
            </div>
            <Progress value={readingProgress} className="h-2" />
          </div>
        </CardContent>
      </Card>

      {/* Search Bar */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center gap-2">
            <Search className="h-4 w-4 text-muted-foreground" />
            <input
              type="text"
              placeholder="Rechercher dans le contenu..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="flex-1 px-3 py-2 border rounded-md"
            />
            <Button variant="outline" size="sm">
              <Share className="h-4 w-4 mr-1" />
              Partager
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Content Sections Navigation */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            Table des Matières
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-2">
            {sections.map((section, index) => (
              <div key={index} className="flex items-center justify-between p-2 rounded hover:bg-gray-50">
                <button
                  onClick={() => setCurrentSection(index)}
                  className={`text-left flex-1 ${currentSection === index ? 'font-semibold text-primary' : ''}`}
                >
                  {index + 1}. {section}
                </button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleBookmark(index)}
                  className={bookmarks.includes(index) ? 'text-yellow-500' : ''}
                >
                  <Bookmark className="h-4 w-4" />
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Main Content */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5" />
            {title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div 
            className="prose max-w-none"
            style={{ fontSize: `${fontSize}px`, lineHeight: 1.6 }}
            dangerouslySetInnerHTML={{ 
              __html: highlightSearchTerm(content || defaultContent) 
            }}
          />
          
          <div className="mt-8 pt-4 border-t">
            <div className="flex justify-between items-center">
              <Button variant="outline">
                <Download className="h-4 w-4 mr-2" />
                Télécharger PDF
              </Button>
              
              <div className="flex gap-2">
                <Button 
                  variant="outline"
                  onClick={() => setCurrentSection(Math.max(0, currentSection - 1))}
                  disabled={currentSection === 0}
                >
                  Section Précédente
                </Button>
                
                {currentSection < sections.length - 1 ? (
                  <Button 
                    onClick={() => setCurrentSection(currentSection + 1)}
                  >
                    Section Suivante
                  </Button>
                ) : (
                  <Button 
                    onClick={onComplete} 
                    className="moov-gradient text-white"
                    disabled={readingProgress < 80}
                  >
                    Marquer comme Terminé
                  </Button>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {readingProgress < 80 && (
        <Alert>
          <AlertDescription>
            Lisez au moins 80% du contenu pour marquer cette leçon comme terminée. 
            Temps de lecture recommandé: 5 minutes minimum.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default TextLessonTab;