import { useState, useRef, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  PlayCircle, 
  PauseCircle, 
  Volume2, 
  VolumeX,
  SkipBack,
  SkipForward,
  Upload,
  FileText,
  Settings,
  Maximize,
  Download
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { ModuleContent, FileUpload } from "@/types/module";

interface EnhancedMediaPlayerProps {
  content?: ModuleContent;
  onSave?: (content: Omit<ModuleContent, 'id' | 'order'>) => void;
  isEditing?: boolean;
}

const EnhancedMediaPlayer = ({ content, onSave, isEditing = false }: EnhancedMediaPlayerProps) => {
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  
  // Form states for editing
  const [title, setTitle] = useState(content?.title || '');
  const [transcript, setTranscript] = useState('');
  const [fileUpload, setFileUpload] = useState<FileUpload | null>(null);
  const [mediaType, setMediaType] = useState<'video' | 'audio'>(content?.type as 'video' | 'audio' || 'video');

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    const handleLoadedMetadata = () => {
      setDuration(media.duration);
    };

    const handleTimeUpdate = () => {
      setCurrentTime(media.currentTime);
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => setIsPlaying(false);
    const handleEnded = () => setIsPlaying(false);

    media.addEventListener('loadedmetadata', handleLoadedMetadata);
    media.addEventListener('timeupdate', handleTimeUpdate);
    media.addEventListener('play', handlePlay);
    media.addEventListener('pause', handlePause);
    media.addEventListener('ended', handleEnded);

    return () => {
      media.removeEventListener('loadedmetadata', handleLoadedMetadata);
      media.removeEventListener('timeupdate', handleTimeUpdate);
      media.removeEventListener('play', handlePlay);
      media.removeEventListener('pause', handlePause);
      media.removeEventListener('ended', handleEnded);
    };
  }, [content]);

  const togglePlay = () => {
    const media = mediaRef.current;
    if (!media) return;

    if (isPlaying) {
      media.pause();
    } else {
      media.play();
    }
  };

  const handleSeek = (newTime: number) => {
    const media = mediaRef.current;
    if (media) {
      media.currentTime = newTime;
      setCurrentTime(newTime);
    }
  };

  const toggleMute = () => {
    const media = mediaRef.current;
    if (media) {
      media.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (newVolume: number) => {
    const media = mediaRef.current;
    if (media) {
      media.volume = newVolume;
      setVolume(newVolume);
    }
  };

  const handlePlaybackRateChange = (rate: number) => {
    const media = mediaRef.current;
    if (media) {
      media.playbackRate = rate;
      setPlaybackRate(rate);
    }
  };

  const skip = (seconds: number) => {
    const media = mediaRef.current;
    if (media) {
      const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
      handleSeek(newTime);
    }
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const newUpload: FileUpload = {
      id: `upload_${Date.now()}`,
      file,
      progress: 0,
      status: 'pending'
    };

    setFileUpload(newUpload);
    
    // Simulate upload progress
    const interval = setInterval(() => {
      setFileUpload(prev => {
        if (!prev || prev.progress >= 100) {
          clearInterval(interval);
          return prev;
        }
        
        const newProgress = Math.min(100, prev.progress + 10);
        const newStatus = newProgress === 100 ? 'completed' : 'uploading';
        
        return {
          ...prev,
          progress: newProgress,
          status: newStatus,
          url: newProgress === 100 ? URL.createObjectURL(file) : undefined
        };
      });
    }, 200);
  };

  const handleSave = () => {
    if (!title || !fileUpload?.url) return;

    const newContent: Omit<ModuleContent, 'id' | 'order'> = {
      type: mediaType,
      title,
      fileUrl: fileUpload.url,
      fileName: fileUpload.file.name,
      fileSize: fileUpload.file.size,
      duration: duration,
      transcriptUrl: transcript ? undefined : undefined // In real app, would upload transcript
    };

    onSave?.(newContent);
  };

  if (isEditing) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Ajouter du Contenu Multimédia</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="media-title">Titre</Label>
            <Input
              id="media-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Titre du contenu multimédia"
            />
          </div>

          <div className="space-y-2">
            <Label>Type de Média</Label>
            <div className="flex gap-2">
              <Button
                variant={mediaType === 'video' ? 'default' : 'outline'}
                onClick={() => setMediaType('video')}
              >
                Vidéo
              </Button>
              <Button
                variant={mediaType === 'audio' ? 'default' : 'outline'}
                onClick={() => setMediaType('audio')}
              >
                Audio
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <Label>Fichier Multimédia</Label>
            <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
              {fileUpload ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium">{fileUpload.file.name}</p>
                  <Progress value={fileUpload.progress} className="w-full" />
                  <p className="text-xs text-gray-500">
                    {fileUpload.status === 'completed' ? 'Téléchargement terminé' : `${fileUpload.progress}% téléchargé`}
                  </p>
                </div>
              ) : (
                <div>
                  <Upload className="h-8 w-8 mx-auto mb-2 text-gray-400" />
                  <p className="text-sm text-gray-600 mb-2">
                    Glissez-déposez votre fichier {mediaType} ou cliquez pour parcourir
                  </p>
                  <Button variant="outline" onClick={() => fileInputRef.current?.click()}>
                    Choisir un Fichier
                  </Button>
                </div>
              )}
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept={mediaType === 'video' ? 'video/*' : 'audio/*'}
              onChange={handleFileUpload}
              className="hidden"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="transcript">Transcription (Optionnel)</Label>
            <Textarea
              id="transcript"
              value={transcript}
              onChange={(e) => setTranscript(e.target.value)}
              placeholder="Ajoutez une transcription pour améliorer l'accessibilité..."
              rows={4}
            />
          </div>

          <div className="flex gap-2">
            <Button 
              onClick={handleSave} 
              disabled={!title || !fileUpload?.url}
              className="moov-gradient text-white"
            >
              Enregistrer le Contenu
            </Button>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Player view
  return (
    <Card>
      <CardContent className="p-0">
        {mediaType === 'video' ? (
          <div className="aspect-video bg-black relative">
            <video
              ref={mediaRef as React.RefObject<HTMLVideoElement>}
              className="w-full h-full object-contain"
              src={content?.fileUrl}
              poster={content?.thumbnailUrl}
            />
            {/* Video Controls Overlay */}
            <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-4">
              <div className="space-y-3">
                {/* Progress Bar */}
                <div className="flex items-center gap-2 text-white text-sm">
                  <span>{formatTime(currentTime)}</span>
                  <div className="flex-1">
                    <Progress
                      value={(currentTime / duration) * 100 || 0}
                      className="h-2 cursor-pointer"
                      onClick={(e) => {
                        const rect = e.currentTarget.getBoundingClientRect();
                        const percent = (e.clientX - rect.left) / rect.width;
                        handleSeek(percent * duration);
                      }}
                    />
                  </div>
                  <span>{formatTime(duration)}</span>
                </div>

                {/* Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => skip(-10)}
                      className="text-white hover:bg-white/20"
                    >
                      <SkipBack className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={togglePlay}
                      className="text-white hover:bg-white/20"
                    >
                      {isPlaying ? <PauseCircle className="h-6 w-6" /> : <PlayCircle className="h-6 w-6" />}
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => skip(10)}
                      className="text-white hover:bg-white/20"
                    >
                      <SkipForward className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="flex items-center gap-2">
                    {/* Volume */}
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={toggleMute}
                        className="text-white hover:bg-white/20"
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
                        className="w-16"
                      />
                    </div>

                    {/* Settings */}
                    <Dialog>
                      <DialogTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          className="text-white hover:bg-white/20"
                        >
                          <Settings className="h-4 w-4" />
                        </Button>
                      </DialogTrigger>
                      <DialogContent>
                        <DialogHeader>
                          <DialogTitle>Paramètres de Lecture</DialogTitle>
                        </DialogHeader>
                        <div className="space-y-4">
                          <div>
                            <Label>Vitesse de Lecture</Label>
                            <div className="flex gap-2 mt-2">
                              {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                                <Button
                                  key={rate}
                                  variant={playbackRate === rate ? 'default' : 'outline'}
                                  size="sm"
                                  onClick={() => handlePlaybackRateChange(rate)}
                                >
                                  {rate}x
                                </Button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </DialogContent>
                    </Dialog>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          // Audio Player
          <div className="p-6 bg-gradient-to-r from-blue-50 to-purple-50">
            <div className="flex items-center gap-4 mb-4">
              <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center">
                <Volume2 className="h-8 w-8 text-white" />
              </div>
              <div>
                <h3 className="font-semibold text-lg">{content?.title}</h3>
                <p className="text-gray-600">
                  {formatTime(duration)} • Audio
                </p>
              </div>
            </div>

            <audio
              ref={mediaRef as React.RefObject<HTMLAudioElement>}
              src={content?.fileUrl}
              className="hidden"
            />

            <div className="space-y-4">
              {/* Progress */}
              <div className="flex items-center gap-2 text-sm">
                <span>{formatTime(currentTime)}</span>
                <div className="flex-1">
                  <Progress
                    value={(currentTime / duration) * 100 || 0}
                    className="h-2 cursor-pointer"
                    onClick={(e) => {
                      const rect = e.currentTarget.getBoundingClientRect();
                      const percent = (e.clientX - rect.left) / rect.width;
                      handleSeek(percent * duration);
                    }}
                  />
                </div>
                <span>{formatTime(duration)}</span>
              </div>

              {/* Controls */}
              <div className="flex items-center justify-center gap-4">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => skip(-10)}
                >
                  <SkipBack className="h-4 w-4" />
                </Button>
                <Button
                  size="lg"
                  onClick={togglePlay}
                  className="rounded-full w-12 h-12"
                >
                  {isPlaying ? <PauseCircle className="h-6 w-6" /> : <PlayCircle className="h-6 w-6" />}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => skip(10)}
                >
                  <SkipForward className="h-4 w-4" />
                </Button>
              </div>
            </div>
          </div>
        )}

        {/* Additional Content Options */}
        {content?.transcriptUrl && (
          <div className="p-4 border-t">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Voir la Transcription
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default EnhancedMediaPlayer;