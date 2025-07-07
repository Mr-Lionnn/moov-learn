import { Button } from "@/components/ui/button";

interface TextLessonContentProps {
  onComplete: () => void;
}

const sampleContent = `Introduction aux Réseaux TCP/IP

Les réseaux informatiques constituent l'épine dorsale de notre monde numérique moderne. Dans ce chapitre, nous explorerons les fondements des protocoles TCP/IP qui permettent la communication entre les ordinateurs du monde entier.

Le protocole TCP/IP (Transmission Control Protocol/Internet Protocol) est une suite de protocoles de communication qui définit comment les données sont transmises sur Internet. Développé dans les années 1970, il est devenu la norme universelle pour les communications réseau.

Comprendre TCP/IP est essentiel pour tout professionnel de l'informatique, car il sous-tend pratiquement tous les aspects de la connectivité réseau moderne, des sites web aux applications mobiles.`;

const TextLessonContent = ({ onComplete }: TextLessonContentProps) => {
  return (
    <>
      <div className="prose max-w-none">
        <div className="text-gray-700 leading-relaxed space-y-4">
          {sampleContent.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
      <Button onClick={onComplete} className="moov-gradient text-white w-full">
        Marquer comme Terminé
      </Button>
    </>
  );
};

export default TextLessonContent;