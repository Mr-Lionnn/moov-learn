import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

interface VideoLessonTabProps {
  onComplete: () => void;
}

const VideoLessonTab = ({ onComplete }: VideoLessonTabProps) => {
  return (
    <div className="space-y-4">
      <Card>
        <CardContent className="p-0">
          <div className="aspect-video bg-black rounded-lg relative overflow-hidden">
            <video
              className="w-full h-full object-cover"
              controls
              poster="https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=1600&h=900&q=80"
            >
              <source src="https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4" type="video/mp4" />
              Votre navigateur ne supporte pas la lecture vidéo.
            </video>
          </div>
        </CardContent>
      </Card>
      <Button onClick={onComplete} className="moov-gradient text-white">
        Marquer comme Terminé
      </Button>
    </div>
  );
};

export default VideoLessonTab;