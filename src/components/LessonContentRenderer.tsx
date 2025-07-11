import { Card, CardContent } from "@/components/ui/card";
import LessonHeader from "./lesson/LessonHeader";
import LessonContentSwitch from "./lesson/LessonContentSwitch";
import ContentRenderer from "./content/ContentRenderer";
import { LessonContentProps } from "@/types/lesson";

const LessonContentRenderer = ({ 
  currentLesson, 
  completedLessons, 
  onLessonComplete,
  courseTitle = "Formation"
}: LessonContentProps) => {
  const isCompleted = completedLessons.includes(currentLesson.id);

  return (
    <Card>
      <LessonHeader 
        lesson={currentLesson} 
        isCompleted={isCompleted} 
      />
      <CardContent>
        <div className="space-y-4">
          {currentLesson.type === 'quiz' ? (
            <LessonContentSwitch
              lesson={{
                id: currentLesson.id.toString(),
                title: currentLesson.title,
                type: currentLesson.type,
                content: '',
                duration: parseInt(currentLesson.duration || '0'),
                hasQuiz: currentLesson.type === 'quiz',
                description: currentLesson.title
              }}
              onComplete={onLessonComplete}
              onNext={() => console.log('Next lesson')}
              onPrevious={() => console.log('Previous lesson')}
              hasNext={false}
              hasPrevious={false}
              currentLessonIndex={0}
              totalLessons={1}
            />
          ) : (
            <ContentRenderer
              title={currentLesson.title}
              contents={[
                {
                  id: currentLesson.id.toString(),
                  type: currentLesson.type === 'video' ? 'video' : 
                        currentLesson.type === 'audio' ? 'audio' : 'text',
                  title: currentLesson.title,
                  duration: currentLesson.duration,
                  url: currentLesson.type === 'video' ? '/placeholder-video.mp4' : 
                       currentLesson.type === 'audio' ? '/placeholder-audio.mp3' : undefined,
                  content: currentLesson.type === 'text' ? `
                    <h2>Contenu de la leçon: ${currentLesson.title}</h2>
                    <p>Voici le contenu détaillé de cette leçon de formation. Cette section contient des informations importantes que vous devez comprendre et retenir.</p>
                    <h3>Points clés à retenir:</h3>
                    <ul>
                      <li>Premier point important de la formation</li>
                      <li>Deuxième concept essentiel à maîtriser</li>
                      <li>Troisième élément crucial pour votre apprentissage</li>
                    </ul>
                    <p>Prenez le temps de bien assimiler ces concepts avant de passer à la leçon suivante.</p>
                  ` : undefined,
                  fileName: currentLesson.type === 'text' ? `${currentLesson.title}.pdf` : undefined
                }
              ]}
              onComplete={onLessonComplete}
            />
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default LessonContentRenderer;