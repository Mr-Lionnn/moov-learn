import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Play, 
  Pause, 
  Volume2, 
  FileText, 
  Download, 
  BookOpen, 
  Video,
  Headphones,
  Settings,
  Maximize,
  SkipBack,
  SkipForward
} from "lucide-react";

interface ContentItem {
  id: string;
  type: 'video' | 'audio' | 'text' | 'document';
  title: string;
  url?: string;
  content?: string;
  duration?: string;
  transcriptUrl?: string;
  downloadUrl?: string;
  fileName?: string;
}

interface ContentRendererProps {
  contents: ContentItem[];
  title: string;
  onComplete?: () => void;
}

const ContentRenderer = ({ contents, title, onComplete }: ContentRendererProps) => {
  const [activeTab, setActiveTab] = useState(contents[0]?.type || 'video');
  const [videoProgress, setVideoProgress] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);

  const videoContent = contents.filter(c => c.type === 'video');
  const audioContent = contents.filter(c => c.type === 'audio');
  const textContent = contents.filter(c => c.type === 'text');
  const documentContent = contents.filter(c => c.type === 'document');

  const VideoPlayer = ({ content }: { content: ContentItem }) => (
    <div className="space-y-4">
      <div className="relative bg-black rounded-lg overflow-hidden aspect-video">
        <video
          className="w-full h-full"
          controls
          onTimeUpdate={(e) => {
            const video = e.currentTarget;
            setCurrentTime(video.currentTime);
            setVideoProgress((video.currentTime / video.duration) * 100);
          }}
          onLoadedMetadata={(e) => {
            setTotalDuration(e.currentTarget.duration);
          }}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
        >
          <source src={content.url || "/placeholder-video.mp4"} type="video/mp4" />
          Votre navigateur ne supporte pas la lecture vidéo.
        </video>
        
        <div className="absolute top-4 right-4 flex gap-2">
          <Button size="sm" variant="secondary" className="opacity-80">
            <Settings className="h-4 w-4" />
          </Button>
          <Button size="sm" variant="secondary" className="opacity-80">
            <Maximize className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="space-y-2">
        <div className="flex items-center justify-between text-sm text-gray-600">
          <span>{Math.floor(currentTime / 60)}:{(currentTime % 60).toFixed(0).padStart(2, '0')}</span>
          <span>{content.duration || 'En cours...'}</span>
        </div>
        <Progress value={videoProgress} className="h-2" />
      </div>
      
      <div className="flex items-center justify-center gap-4">
        <Button variant="outline" size="sm">
          <SkipBack className="h-4 w-4" />
        </Button>
        <Button 
          variant="default" 
          size="lg"
          onClick={() => setIsPlaying(!isPlaying)}
        >
          {isPlaying ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
        </Button>
        <Button variant="outline" size="sm">
          <SkipForward className="h-4 w-4" />
        </Button>
      </div>

      {content.transcriptUrl && (
        <Card className="mt-4">
          <CardHeader>
            <CardTitle className="text-sm">Transcription</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Transcription disponible pour cette vidéo.</p>
            <Button variant="link" size="sm" className="p-0 h-auto">
              Afficher la transcription
            </Button>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const AudioPlayer = ({ content }: { content: ContentItem }) => (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-6">
          <div className="flex items-center justify-center mb-6">
            <div className="w-24 h-24 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center">
              <Headphones className="h-12 w-12 text-white" />
            </div>
          </div>
          
          <div className="text-center mb-4">
            <h3 className="font-semibold">{content.title}</h3>
            <p className="text-sm text-gray-600">{content.duration}</p>
          </div>
          
          <audio
            className="w-full mb-4"
            controls
            onTimeUpdate={(e) => {
              const audio = e.currentTarget;
              setCurrentTime(audio.currentTime);
              setVideoProgress((audio.currentTime / audio.duration) * 100);
            }}
          >
            <source src={content.url || "/placeholder-audio.mp3"} type="audio/mpeg" />
            Votre navigateur ne supporte pas la lecture audio.
          </audio>
          
          <div className="flex items-center justify-center gap-4">
            <Button variant="outline" size="sm">
              <Volume2 className="h-4 w-4" />
            </Button>
            <Badge variant="secondary">Audio de qualité</Badge>
          </div>
        </CardContent>
      </Card>

      {content.transcriptUrl && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Transcription Audio</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600">Transcription et sous-titres disponibles.</p>
          </CardContent>
        </Card>
      )}
    </div>
  );

  const TextContent = ({ content }: { content: ContentItem }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <BookOpen className="h-5 w-5" />
          {content.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose max-w-none">
          {content.content ? (
            <div dangerouslySetInnerHTML={{ __html: content.content }} />
          ) : (
            <div className="space-y-4">
              <p>
                Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor 
                incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis 
                nostrud exercitation ullamco laboris.
              </p>
              <p>
                Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore 
                eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, 
                sunt in culpa qui officia deserunt mollit anim id est laborum.
              </p>
              <p>
                Sed ut perspiciatis unde omnis iste natus error sit voluptatem accusantium 
                doloremque laudantium, totam rem aperiam, eaque ipsa quae ab illo inventore 
                veritatis et quasi architecto beatae vitae dicta sunt explicabo.
              </p>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );

  const DocumentViewer = ({ content }: { content: ContentItem }) => (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <FileText className="h-5 w-5" />
          {content.title}
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
            <div>
              <p className="font-medium">{content.fileName || 'Document.pdf'}</p>
              <p className="text-sm text-gray-600">Document PDF</p>
            </div>
            <Button variant="outline" size="sm">
              <Download className="h-4 w-4 mr-2" />
              Télécharger
            </Button>
          </div>
          
          <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
            <FileText className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">Aperçu du document</p>
            <p className="text-sm text-gray-500 mt-2">
              Cliquez pour ouvrir dans une nouvelle fenêtre
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
          <div className="flex items-center gap-4">
            <Badge variant="secondary">Contenu Multi-Média</Badge>
            <Progress value={33} className="flex-1" />
            <span className="text-sm text-gray-600">33% Complete</span>
          </div>
        </CardHeader>
      </Card>

      <Tabs value={activeTab} onValueChange={(value) => setActiveTab(value as 'video' | 'audio' | 'text' | 'document')}>
        <TabsList className="grid w-full grid-cols-4">
          {videoContent.length > 0 && (
            <TabsTrigger value="video" className="flex items-center gap-2">
              <Video className="h-4 w-4" />
              Vidéo ({videoContent.length})
            </TabsTrigger>
          )}
          {audioContent.length > 0 && (
            <TabsTrigger value="audio" className="flex items-center gap-2">
              <Headphones className="h-4 w-4" />
              Audio ({audioContent.length})
            </TabsTrigger>
          )}
          {textContent.length > 0 && (
            <TabsTrigger value="text" className="flex items-center gap-2">
              <BookOpen className="h-4 w-4" />
              Texte ({textContent.length})
            </TabsTrigger>
          )}
          {documentContent.length > 0 && (
            <TabsTrigger value="document" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              Documents ({documentContent.length})
            </TabsTrigger>
          )}
        </TabsList>

        {videoContent.length > 0 && (
          <TabsContent value="video" className="space-y-4">
            {videoContent.map((content) => (
              <VideoPlayer key={content.id} content={content} />
            ))}
          </TabsContent>
        )}

        {audioContent.length > 0 && (
          <TabsContent value="audio" className="space-y-4">
            {audioContent.map((content) => (
              <AudioPlayer key={content.id} content={content} />
            ))}
          </TabsContent>
        )}

        {textContent.length > 0 && (
          <TabsContent value="text" className="space-y-4">
            {textContent.map((content) => (
              <TextContent key={content.id} content={content} />
            ))}
          </TabsContent>
        )}

        {documentContent.length > 0 && (
          <TabsContent value="document" className="space-y-4">
            {documentContent.map((content) => (
              <DocumentViewer key={content.id} content={content} />
            ))}
          </TabsContent>
        )}
      </Tabs>

      <div className="flex justify-between items-center pt-6">
        <Button variant="outline">
          Précédent
        </Button>
        <Button onClick={onComplete} className="moov-gradient text-white">
          Marquer comme Terminé
        </Button>
      </div>
    </div>
  );
};

export default ContentRenderer;