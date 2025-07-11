import React, { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  SkipBack, 
  SkipForward,
  Headphones,
  FileText,
  Download
} from "lucide-react";

interface AudioLessonTabProps {
  onComplete: () => void;
  title?: string;
  duration?: string;
}

const AudioLessonTab = ({ onComplete, title = "Leçon Audio", duration = "18:20" }: AudioLessonTabProps) => {
  const audioRef = useRef<HTMLAudioElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [showTranscript, setShowTranscript] = useState(false);

  const transcript = `
    Bienvenue dans cette leçon audio sur les techniques de désescalade. 
    
    Dans cette session, nous allons explorer les méthodes efficaces pour gérer les situations difficiles avec les clients. 
    
    La première technique importante est l'écoute active. Cela signifie donner toute votre attention au client, 
    reformuler ses préoccupations et montrer de l'empathie.
    
    La deuxième technique est le contrôle de votre propre langage corporel et vocal. Maintenez un ton calme 
    et rassurant, même si le client devient émotionnel.
    
    Enfin, nous discuterons de l'importance de trouver des solutions créatives qui satisfont à la fois 
    les besoins du client et les politiques de l'entreprise.
  `;

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleLoadedMetadata = () => {
      setTotalDuration(audio.duration);
      setIsLoading(false);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
      setProgress((audio.currentTime / audio.duration) * 100);
    };

    const handleError = () => {
      setError("Erreur lors du chargement de l'audio");
      setIsLoading(false);
    };

    const handleLoadedData = () => {
      setIsLoading(false);
    };

    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('error', handleError);
    audio.addEventListener('loadeddata', handleLoadedData);
    audio.addEventListener('play', () => setIsPlaying(true));
    audio.addEventListener('pause', () => setIsPlaying(false));

    return () => {
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('loadeddata', handleLoadedData);
      audio.removeEventListener('play', () => setIsPlaying(true));
      audio.removeEventListener('pause', () => setIsPlaying(false));
    };
  }, []);

  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (audio.paused) {
      audio.play();
    } else {
      audio.pause();
    }
  };

  const toggleMute = () => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.muted = !audio.muted;
    setIsMuted(audio.muted);
  };

  const handleVolumeChange = (newVolume: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = newVolume;
    setVolume(newVolume);
  };

  const handleSeek = (newTime: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleSkip = (seconds: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    const newTime = Math.max(0, Math.min(audio.duration, audio.currentTime + seconds));
    audio.currentTime = newTime;
  };

  const handlePlaybackRateChange = (rate: number) => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.playbackRate = rate;
    setPlaybackRate(rate);
  };

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {error && (
        <Alert className="border-red-200 bg-red-50">
          <AlertDescription className="text-red-700">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Headphones className="h-5 w-5" />
            {title}
          </CardTitle>
          <div className="flex items-center gap-4">
            <Badge variant="secondary">Audio</Badge>
            <span className="text-sm text-muted-foreground">{duration}</span>
          </div>
        </CardHeader>
        
        <CardContent className="space-y-6">
          {/* Audio Visualizer */}
          <div className="flex items-center justify-center p-8 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
            <div className="w-32 h-32 bg-gradient-to-br from-blue-400 to-purple-500 rounded-full flex items-center justify-center relative">
              <Headphones className="h-16 w-16 text-white" />
              {isPlaying && (
                <div className="absolute inset-0 rounded-full border-4 border-white/30 animate-ping" />
              )}
            </div>
          </div>

          {/* Audio Element */}
          <audio
            ref={audioRef}
            onError={() => setError("Impossible de charger l'audio")}
          >
            <source src="/placeholder-audio.mp3" type="audio/mpeg" />
            <source src="/placeholder-audio.ogg" type="audio/ogg" />
            Votre navigateur ne supporte pas la lecture audio.
          </audio>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progress} className="h-2" />
            <div className="flex justify-between text-sm text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(totalDuration)}</span>
            </div>
          </div>

          {/* Main Controls */}
          <div className="flex items-center justify-center gap-4">
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleSkip(-10)}
              disabled={isLoading || error !== null}
            >
              <SkipBack className="h-4 w-4" />
              10s
            </Button>
            
            <Button 
              size="lg"
              onClick={togglePlay}
              disabled={isLoading || error !== null}
              className="w-16 h-16 rounded-full"
            >
              {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
            </Button>
            
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => handleSkip(10)}
              disabled={isLoading || error !== null}
            >
              <SkipForward className="h-4 w-4" />
              10s
            </Button>
          </div>

          {/* Secondary Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                size="sm"
                onClick={toggleMute}
              >
                {isMuted ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              
              <input
                type="range"
                min="0"
                max="1"
                step="0.1"
                value={volume}
                onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
                className="w-20"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground">Vitesse:</span>
              <select 
                value={playbackRate} 
                onChange={(e) => handlePlaybackRateChange(parseFloat(e.target.value))}
                className="text-sm border rounded px-2 py-1"
              >
                <option value={0.5}>0.5x</option>
                <option value={0.75}>0.75x</option>
                <option value={1}>1x</option>
                <option value={1.25}>1.25x</option>
                <option value={1.5}>1.5x</option>
                <option value={2}>2x</option>
              </select>
            </div>
          </div>

          {/* Transcript Section */}
          <div className="space-y-2">
            <Button 
              variant="outline" 
              onClick={() => setShowTranscript(!showTranscript)}
              className="w-full"
            >
              <FileText className="h-4 w-4 mr-2" />
              {showTranscript ? 'Masquer' : 'Afficher'} la Transcription
            </Button>
            
            {showTranscript && (
              <Card>
                <CardContent className="p-4">
                  <div className="prose text-sm max-w-none">
                    {transcript.split('\n').map((line, index) => (
                      <p key={index} className="mb-2">
                        {line.trim()}
                      </p>
                    ))}
                  </div>
                  <Button variant="outline" size="sm" className="mt-4">
                    <Download className="h-4 w-4 mr-2" />
                    Télécharger la Transcription
                  </Button>
                </CardContent>
              </Card>
            )}
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-between items-center">
        <Button 
          variant="outline"
          onClick={() => handleSeek(0)}
          disabled={isLoading || error !== null}
        >
          Recommencer
        </Button>
        
        <Button 
          onClick={onComplete} 
          className="moov-gradient text-white"
          disabled={progress < 80} // Require 80% completion
        >
          Marquer comme Terminé
        </Button>
      </div>
      
      {progress < 80 && (
        <Alert>
          <AlertDescription>
            Écoutez au moins 80% de l'audio pour marquer cette leçon comme terminée.
          </AlertDescription>
        </Alert>
      )}
    </div>
  );
};

export default AudioLessonTab;