
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { 
  Play, 
  Pause, 
  SkipBack, 
  SkipForward, 
  Volume2, 
  Download,
  Clock
} from "lucide-react";

interface LessonAudioContentProps {
  title: string;
  duration: string;
  transcript?: string;
}

const LessonAudioContent = ({ title, duration, transcript }: LessonAudioContentProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(25);
  const [showTranscript, setShowTranscript] = useState(false);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-xl">{title}</CardTitle>
            <Badge variant="outline" className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {duration}
            </Badge>
          </div>
        </CardHeader>
        <CardContent>
          {/* Audio Player Interface */}
          <div className="space-y-6">
            {/* Waveform Visualization */}
            <div className="bg-gradient-to-r from-blue-100 to-orange-100 rounded-lg p-6 text-center">
              <div className="flex items-center justify-center space-x-1 mb-4">
                {Array.from({ length: 20 }).map((_, i) => (
                  <div
                    key={i}
                    className={`w-1 rounded-full transition-all duration-300 ${
                      i < progress / 5 ? 'bg-primary h-8' : 'bg-gray-300 h-4'
                    }`}
                  />
                ))}
              </div>
              <p className="text-gray-600">Contenu audio - Fondamentaux des Réseaux TCP/IP</p>
            </div>

            {/* Progress Bar */}
            <div className="space-y-2">
              <Progress value={progress} className="h-3" />
              <div className="flex justify-between text-sm text-gray-600">
                <span>05:32</span>
                <span>{duration}</span>
              </div>
            </div>

            {/* Controls */}
            <div className="flex items-center justify-center space-x-4">
              <Button variant="outline" size="icon">
                <SkipBack className="h-4 w-4" />
              </Button>
              <Button size="icon" onClick={togglePlay} className="h-12 w-12">
                {isPlaying ? (
                  <Pause className="h-6 w-6" />
                ) : (
                  <Play className="h-6 w-6 ml-1" />
                )}
              </Button>
              <Button variant="outline" size="icon">
                <SkipForward className="h-4 w-4" />
              </Button>
              <div className="flex items-center space-x-2 ml-4">
                <Volume2 className="h-4 w-4" />
                <Progress value={80} className="h-2 w-20" />
              </div>
              <Button variant="outline" size="icon">
                <Download className="h-4 w-4" />
              </Button>
            </div>

            {/* Speed Controls */}
            <div className="flex justify-center space-x-2">
              <Button variant="outline" size="sm">0.5x</Button>
              <Button variant="outline" size="sm">0.75x</Button>
              <Button variant="default" size="sm">1x</Button>
              <Button variant="outline" size="sm">1.25x</Button>
              <Button variant="outline" size="sm">1.5x</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Transcript Toggle */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="text-lg">Transcription</CardTitle>
            <Button
              variant="outline"
              onClick={() => setShowTranscript(!showTranscript)}
            >
              {showTranscript ? 'Masquer' : 'Afficher'}
            </Button>
          </div>
        </CardHeader>
        {showTranscript && (
          <CardContent>
            <div className="prose max-w-none text-sm text-gray-700 leading-relaxed">
              <p>
                Bienvenue dans ce module sur les fondamentaux des réseaux TCP/IP. 
                Dans cette leçon, nous allons explorer les concepts essentiels qui 
                constituent la base d'Internet et des réseaux modernes.
              </p>
              <p>
                Le protocole TCP/IP, qui signifie Transmission Control Protocol/Internet Protocol, 
                est en fait une suite de protocoles qui permettent la communication 
                entre différents appareils sur un réseau.
              </p>
              <p>
                Nous commencerons par comprendre le modèle OSI et son importance dans 
                l'architecture réseau, puis nous étudierons le processus d'encapsulation 
                des données et comment elles voyagent à travers les différentes couches.
              </p>
            </div>
          </CardContent>
        )}
      </Card>
    </div>
  );
};

export default LessonAudioContent;
