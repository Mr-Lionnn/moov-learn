import { useState, useRef, useEffect } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Slider } from '@/components/ui/slider';
import { 
  Play, 
  Pause, 
  Volume2, 
  VolumeX, 
  Maximize, 
  Minimize,
  Download,
  SkipBack,
  SkipForward,
  Video,
  Music
} from 'lucide-react';
import { ContentFile } from '@/types/content';
import { useAuth } from '@/contexts/AuthContext';

interface MediaPlayerProps {
  isOpen: boolean;
  onClose: () => void;
  file: ContentFile | null;
  onDownload?: (file: ContentFile) => void;
}

const MediaPlayer = ({ isOpen, onClose, file, onDownload }: MediaPlayerProps) => {
  const { hasPermission } = useAuth();
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(80);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [loading, setLoading] = useState(true);

  // Mock player functionality since we don't have actual media files
  useEffect(() => {
    if (file && isOpen) {
      setLoading(true);
      // Simulate loading
      setTimeout(() => {
        setLoading(false);
        setDuration(file.type === 'mp4' ? 1200 : 300); // 20 min for video, 5 min for audio
      }, 1000);
    }
  }, [file, isOpen]);

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying && !loading) {
      interval = setInterval(() => {
        setCurrentTime(prev => {
          if (prev >= duration) {
            setIsPlaying(false);
            return duration;
          }
          return prev + 1;
        });
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [isPlaying, loading, duration]);

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const toggleMute = () => {
    setIsMuted(!isMuted);
  };

  const handleSeek = (value: number[]) => {
    setCurrentTime(value[0]);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    setIsMuted(value[0] === 0);
  };

  const skip = (seconds: number) => {
    const newTime = Math.max(0, Math.min(duration, currentTime + seconds));
    setCurrentTime(newTime);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getMediaIcon = (type: string) => {
    return type === 'mp4' ? (
      <Video className="h-6 w-6 text-blue-500" />
    ) : (
      <Music className="h-6 w-6 text-green-500" />
    );
  };

  const renderMediaContent = () => {
    if (loading) {
      return (
        <div className="flex items-center justify-center h-96 bg-black rounded-lg">
          <div className="text-center text-white">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-white mx-auto mb-4"></div>
            <p>Chargement du média...</p>
          </div>
        </div>
      );
    }

    if (file?.type === 'mp4') {
      return (
        <div className="bg-black rounded-lg overflow-hidden relative aspect-video">
          <div className="absolute inset-0 flex items-center justify-center text-white">
            <div className="text-center">
              <Video className="h-16 w-16 mx-auto mb-4" />
              <p className="text-lg font-semibold">{file.name}</p>
              <p className="text-sm opacity-75">Lecteur vidéo simulé</p>
              {isPlaying && (
                <div className="mt-4">
                  <div className="animate-pulse w-4 h-4 bg-red-500 rounded-full mx-auto"></div>
                  <p className="text-xs mt-2">En lecture...</p>
                </div>
              )}
            </div>
          </div>
        </div>
      );
    }

    // Audio player visualization
    return (
      <div className="bg-gradient-to-br from-purple-100 to-blue-100 rounded-lg p-8 aspect-video flex items-center justify-center">
        <div className="text-center">
          <Music className="h-24 w-24 mx-auto mb-6 text-purple-600" />
          <h3 className="text-xl font-semibold text-gray-800 mb-2">{file?.name}</h3>
          <p className="text-gray-600 mb-4">Fichier audio</p>
          {isPlaying && (
            <div className="flex justify-center space-x-1">
              {[...Array(5)].map((_, i) => (
                <div
                  key={i}
                  className="w-2 bg-purple-500 rounded-full animate-pulse"
                  style={{
                    height: `${Math.random() * 40 + 20}px`,
                    animationDelay: `${i * 0.1}s`
                  }}
                />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  };

  if (!file) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className={`${isFullscreen ? 'max-w-screen max-h-screen w-full h-full' : 'max-w-4xl'} overflow-hidden`}>
        <DialogHeader className="flex flex-row items-center justify-between pb-4 border-b">
          <div className="flex items-center gap-3">
            {getMediaIcon(file.type)}
            <div>
              <DialogTitle className="text-lg font-semibold">{file.name}</DialogTitle>
              <div className="flex items-center gap-2 mt-1">
                <Badge variant="outline" className="text-xs">{file.type.toUpperCase()}</Badge>
                <span className="text-sm text-gray-500">{file.duration || formatTime(duration)}</span>
                <span className="text-sm text-gray-500">•</span>
                <span className="text-sm text-gray-500">Par {file.author}</span>
              </div>
            </div>
          </div>
          
          <div className="flex items-center gap-2">
            {hasPermission('download_files') && onDownload && (
              <Button variant="ghost" size="sm" onClick={() => onDownload(file)}>
                <Download className="h-4 w-4" />
              </Button>
            )}
            <Button variant="ghost" size="sm" onClick={() => setIsFullscreen(!isFullscreen)}>
              {isFullscreen ? <Minimize className="h-4 w-4" /> : <Maximize className="h-4 w-4" />}
            </Button>
          </div>
        </DialogHeader>
        
        <div className="flex-1 p-4 space-y-4">
          {renderMediaContent()}
          
          {/* Media Controls */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-4">
            {/* Progress Bar */}
            <div className="space-y-2">
              <Slider
                value={[currentTime]}
                max={duration}
                step={1}
                onValueChange={handleSeek}
                className="w-full"
                disabled={loading}
              />
              <div className="flex justify-between text-sm text-gray-500">
                <span>{formatTime(currentTime)}</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            
            {/* Control Buttons */}
            <div className="flex items-center justify-center gap-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => skip(-10)}
                disabled={loading}
              >
                <SkipBack className="h-4 w-4" />
                <span className="ml-1 text-xs">10s</span>
              </Button>
              
              <Button
                variant="default"
                size="lg"
                onClick={togglePlay}
                disabled={loading}
                className="w-12 h-12 rounded-full"
              >
                {isPlaying ? <Pause className="h-6 w-6" /> : <Play className="h-6 w-6" />}
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                onClick={() => skip(10)}
                disabled={loading}
              >
                <span className="mr-1 text-xs">10s</span>
                <SkipForward className="h-4 w-4" />
              </Button>
            </div>
            
            {/* Volume Control */}
            <div className="flex items-center gap-2 max-w-xs mx-auto">
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleMute}
              >
                {isMuted || volume === 0 ? <VolumeX className="h-4 w-4" /> : <Volume2 className="h-4 w-4" />}
              </Button>
              <Slider
                value={[isMuted ? 0 : volume]}
                max={100}
                step={1}
                onValueChange={handleVolumeChange}
                className="flex-1"
              />
              <span className="text-sm text-gray-500 w-8">{isMuted ? 0 : volume}</span>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default MediaPlayer;