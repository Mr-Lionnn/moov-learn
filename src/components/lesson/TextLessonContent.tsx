import { Button } from "@/components/ui/button";
import DocumentSection from "@/components/DocumentSection";

interface TextLessonContentProps {
  onComplete: () => void;
}

const sampleContent = `Introduction aux Réseaux TCP/IP

Les réseaux informatiques constituent l'épine dorsale de notre monde numérique moderne. Dans ce chapitre, nous explorerons les fondements des protocoles TCP/IP qui permettent la communication entre les ordinateurs du monde entier.

Le protocole TCP/IP (Transmission Control Protocol/Internet Protocol) est une suite de protocoles de communication qui définit comment les données sont transmises sur Internet. Développé dans les années 1970, il est devenu la norme universelle pour les communications réseau.

Comprendre TCP/IP est essentiel pour tout professionnel de l'informatique, car il sous-tend pratiquement tous les aspects de la connectivité réseau moderne, des sites web aux applications mobiles.`;

const sampleDocuments = [
  {
    id: 1,
    name: "Guide TCP/IP Complet.pdf",
    type: "pdf",
    size: "2.3 MB",
    description: "Manuel détaillé sur les protocoles TCP/IP",
    author: "Pierre Durand",
    downloads: 156,
    date: "2024-01-15",
    category: "documentation"
  },
  {
    id: 2,
    name: "Schémas Réseau.png",
    type: "image",
    size: "854 KB",
    description: "Diagrammes des architectures réseau",
    author: "Marie Martin",
    downloads: 89,
    date: "2024-01-18",
    category: "diagram"
  },
  {
    id: 3,
    name: "Configuration Réseau.docx",
    type: "docx",
    size: "1.2 MB",
    description: "Instructions de configuration pratique",
    author: "Sophie Laurent",
    downloads: 134,
    date: "2024-01-20",
    category: "tutorial"
  }
];

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
      
      <DocumentSection 
        documents={sampleDocuments}
        courseTitle="Formation Réseau"
        lessonTitle="Introduction aux Réseaux TCP/IP"
      />
      
      <Button onClick={onComplete} className="moov-gradient text-white w-full mt-6">
        Terminer le Module
      </Button>
    </>
  );
};

export default TextLessonContent;