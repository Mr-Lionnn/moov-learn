import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { PlayCircle, Headphones } from "lucide-react";

interface MediaPlayerProps {
  type: "video" | "audio";
  title: string;
  duration?: string;
  onComplete: () => void;
}

const MediaPlayer = ({ type, title, duration, onComplete }: MediaPlayerProps) => {
  const mediaRef = useRef<HTMLVideoElement | HTMLAudioElement>(null);
  const [progress, setProgress] = useState(0);
  const [watchTime, setWatchTime] = useState(0);
  const [totalDuration, setTotalDuration] = useState(0);
  const [isCompleted, setIsCompleted] = useState(false);

  useEffect(() => {
    const media = mediaRef.current;
    if (!media) return;

    const handleLoadedMetadata = () => {
      setTotalDuration(media.duration);
    };

    const handleTimeUpdate = () => {
      const currentTime = media.currentTime;
      const duration = media.duration;
      
      if (duration > 0) {
        const progressPercent = (currentTime / duration) * 100;
        setProgress(progressPercent);
        
        // Track actual watch time (not seeking)
        if (currentTime > watchTime) {
          setWatchTime(currentTime);
        }
        
        // Check if 95% or more has been watched (to account for minor seeking)
        const watchPercent = (watchTime / duration) * 100;
        if (watchPercent >= 95 && !isCompleted) {
          setIsCompleted(true);
        }
      }
    };

    const handleEnded = () => {
      setIsCompleted(true);
      setProgress(100);
    };

    media.addEventListener('loadedmetadata', handleLoadedMetadata);
    media.addEventListener('timeupdate', handleTimeUpdate);
    media.addEventListener('ended', handleEnded);

    return () => {
      media.removeEventListener('loadedmetadata', handleLoadedMetadata);
      media.removeEventListener('timeupdate', handleTimeUpdate);
      media.removeEventListener('ended', handleEnded);
    };
  }, [watchTime, isCompleted]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  return (
    <div className="space-y-4">
      {type === "video" ? (
        <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
          <video
            ref={mediaRef as React.RefObject<HTMLVideoElement>}
            className="w-full h-full object-cover"
            controls
            poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&h=900&q=80"
          >
            <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
            Votre navigateur ne supporte pas la lecture vidéo.
          </video>
        </div>
      ) : (
        <div className="bg-gray-50 p-6 rounded-lg">
          <div className="flex items-center gap-4 mb-4">
            <Headphones className="h-8 w-8 text-primary" />
            <div>
              <h3 className="font-medium">{title}</h3>
              <p className="text-sm text-gray-600">Durée: {duration}</p>
            </div>
          </div>
          <audio 
            ref={mediaRef as React.RefObject<HTMLAudioElement>}
            controls 
            className="w-full"
          >
            <source src="https://www.soundjay.com/misc/sounds/bell-ringing-05.wav" type="audio/wav" />
            Votre navigateur ne supporte pas la lecture audio.
          </audio>
        </div>
      )}
      
      {/* Progress indicator */}
      <div className="space-y-2">
        <div className="flex justify-between text-sm text-gray-600">
          <span>Progression de visionnage</span>
          <span>{Math.round(progress)}%</span>
        </div>
        <Progress value={progress} className="h-2" />
        
        {totalDuration > 0 && (
          <div className="flex justify-between text-xs text-gray-500">
            <span>Temps visionné: {formatTime(watchTime)}</span>
            <span>Durée totale: {formatTime(totalDuration)}</span>
          </div>
        )}
      </div>

      {/* Completion button */}
      <Button 
        onClick={onComplete} 
        disabled={!isCompleted}
        className={`w-full ${isCompleted ? 'moov-gradient text-white' : 'opacity-50 cursor-not-allowed'}`}
      >
        {isCompleted ? (
          <span className="flex items-center gap-2">
            <PlayCircle className="h-4 w-4" />
            Marquer comme Terminé
          </span>
        ) : (
          `Terminez le ${type === 'video' ? 'visionnage' : 'contenu audio'} pour continuer`
        )}
      </Button>
    </div>
  );
};

export default MediaPlayer;