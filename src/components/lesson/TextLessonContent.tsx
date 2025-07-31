import { Button } from "@/components/ui/button";
import DocumentSection from "@/components/DocumentSection";

interface TextLessonContentProps {
  onComplete: () => void;
  lessonTitle?: string;
  courseTitle?: string;
}

const getContentForLesson = (lessonTitle: string, courseTitle: string) => {
  // GDPR Course Content
  if (courseTitle.includes("RGPD") || courseTitle.includes("Conformité")) {
    if (lessonTitle.includes("Principes Fondamentaux")) {
      return {
        content: `Principes Fondamentaux du RGPD

Le Règlement Général sur la Protection des Données (RGPD) est entré en vigueur le 25 mai 2018 dans l'Union européenne. Ce règlement vise à harmoniser les lois sur la protection des données et à renforcer les droits des citoyens européens concernant leurs données personnelles.

Les six principes fondamentaux du RGPD sont :
1. Licéité, loyauté et transparence : Le traitement doit être licite, loyal et transparent
2. Limitation des finalités : Les données doivent être collectées pour des finalités déterminées
3. Minimisation des données : Seules les données nécessaires doivent être collectées
4. Exactitude : Les données doivent être exactes et mises à jour
5. Limitation de la conservation : Les données ne doivent pas être conservées plus longtemps que nécessaire
6. Intégrité et confidentialité : Les données doivent être traitées de manière sécurisée

La compréhension de ces principes est essentielle pour toute organisation qui traite des données personnelles.`,
        documents: [
          {
            id: 1,
            name: "Guide RGPD Complet.pdf",
            type: "pdf",
            size: "3.2 MB",
            description: "Guide complet sur la mise en conformité RGPD",
            author: "Expert Juridique",
            downloads: 245,
            date: "2024-01-10",
            category: "legal"
          }
        ]
      };
    }
    if (lessonTitle.includes("Droits des Personnes")) {
      return {
        content: `Droits des Personnes Concernées

Le RGPD renforce considérablement les droits des personnes concernées. Ces droits permettent aux individus de garder le contrôle sur leurs données personnelles.

Les huit droits principaux sont :
1. Droit à l'information : Les personnes doivent être informées du traitement de leurs données
2. Droit d'accès : Les personnes peuvent demander l'accès à leurs données personnelles
3. Droit de rectification : Les personnes peuvent demander la correction de données inexactes
4. Droit à l'effacement (droit à l'oubli) : Les personnes peuvent demander la suppression de leurs données
5. Droit à la limitation du traitement : Les personnes peuvent demander la suspension du traitement
6. Droit à la portabilité : Les personnes peuvent récupérer leurs données dans un format structuré
7. Droit d'opposition : Les personnes peuvent s'opposer au traitement de leurs données
8. Droits relatifs à la prise de décision automatisée : Protection contre les décisions automatisées

Chaque droit a ses conditions d'application et ses exceptions qu'il convient de maîtriser.`,
        documents: [
          {
            id: 1,
            name: "Modèles Réponses RGPD.docx",
            type: "docx",
            size: "1.8 MB",
            description: "Modèles de réponses aux demandes d'exercice de droits",
            author: "Service Juridique",
            downloads: 156,
            date: "2024-01-15",
            category: "template"
          }
        ]
      };
    }
  }

  // Customer Service Course Content
  if (courseTitle.includes("Service Client")) {
    if (lessonTitle.includes("Communication Efficace")) {
      return {
        content: `Communication Efficace en Service Client

La communication efficace est la pierre angulaire d'un excellent service client. Elle permet de créer une relation de confiance avec le client et de résoudre efficacement les problématiques rencontrées.

Les principes clés d'une communication efficace :

1. L'écoute active : Donner toute son attention au client, reformuler pour s'assurer de la compréhension
2. L'empathie : Comprendre et reconnaître les émotions du client
3. La clarté : Utiliser un langage simple et adapté au niveau du client
4. La courtoisie : Maintenir un ton respectueux et professionnel
5. La patience : Prendre le temps nécessaire pour bien comprendre et expliquer

Techniques de communication :
- Utiliser des questions ouvertes pour obtenir des informations
- Reformuler pour confirmer la compréhension
- Utiliser un vocabulaire positif et orienté solution
- Adapter son style de communication au profil du client

Une communication efficace permet d'améliorer la satisfaction client et de réduire les tensions.`,
        documents: [
          {
            id: 1,
            name: "Guide Communication Client.pdf",
            type: "pdf",
            size: "2.1 MB",
            description: "Techniques avancées de communication client",
            author: "Formateur Expert",
            downloads: 189,
            date: "2024-01-12",
            category: "guide"
          }
        ]
      };
    }
  }

  // Leadership Course Content
  if (courseTitle.includes("Leadership") || courseTitle.includes("Management")) {
    if (lessonTitle.includes("Styles de Management")) {
      return {
        content: `Styles de Management et Leadership

Le style de management adopté par un leader influence directement la performance, la motivation et l'engagement de son équipe. Il n'existe pas un style unique efficace, mais plutôt une adaptation selon les situations et les collaborateurs.

Les principaux styles de management :

1. Le style directif : Le manager donne des instructions précises et contrôle étroitement l'exécution
   - Avantages : Efficace en situation de crise ou avec des équipes novices
   - Inconvénients : Peut limiter l'autonomie et la créativité

2. Le style participatif : Le manager implique l'équipe dans les décisions
   - Avantages : Favorise l'engagement et la motivation
   - Inconvénients : Peut ralentir la prise de décision

3. Le style délégatif : Le manager confie la responsabilité et l'autonomie à l'équipe
   - Avantages : Développe les compétences et la responsabilisation
   - Inconvénients : Nécessite des collaborateurs expérimentés et fiables

4. Le style transformationnel : Le manager inspire et motive vers une vision commune
   - Avantages : Crée une forte adhésion et stimule l'innovation
   - Inconvénients : Demande des qualités charismatiques importantes

L'art du leadership consiste à adapter son style selon la maturité de l'équipe, la complexité de la tâche et le contexte organisationnel.`,
        documents: [
          {
            id: 1,
            name: "Test Styles Management.pdf",
            type: "pdf",
            size: "1.5 MB",
            description: "Auto-évaluation de votre style de management",
            author: "Coach Leadership",
            downloads: 167,
            date: "2024-01-08",
            category: "assessment"
          }
        ]
      };
    }
  }

  // Sales Course Content
  if (courseTitle.includes("Vente") || courseTitle.includes("Sales")) {
    if (lessonTitle.includes("Vente Consultative")) {
      return {
        content: `Techniques de Vente Consultative

La vente consultative représente une approche moderne et efficace qui place le client au centre du processus de vente. Contrairement à la vente traditionnelle, elle se concentre sur la compréhension des besoins réels du client pour proposer des solutions adaptées.

Les étapes de la vente consultative :

1. La préparation : Recherche d'informations sur le client et son secteur d'activité
2. L'approche : Établissement du contact et création d'un climat de confiance
3. La découverte : Identification précise des besoins, enjeux et contraintes du client
4. La proposition : Présentation d'une solution personnalisée et adaptée
5. Le traitement des objections : Écoute et réponse aux préoccupations du client
6. La conclusion : Finalisation de la vente dans l'intérêt mutuel
7. Le suivi : Accompagnement post-vente pour assurer la satisfaction

Techniques clés :
- Poser des questions ouvertes pour découvrir les besoins
- Pratiquer l'écoute active pour comprendre les enjeux
- Présenter les bénéfices plutôt que les caractéristiques
- Créer de la valeur ajoutée dans chaque interaction

Cette approche permet de construire des relations durables et d'augmenter significativement le taux de conversion.`,
        documents: [
          {
            id: 1,
            name: "Guide Vente Consultative.pdf",
            type: "pdf",
            size: "2.8 MB",
            description: "Méthodologie complète de vente consultative",
            author: "Expert Commercial",
            downloads: 234,
            date: "2024-01-05",
            category: "methodology"
          }
        ]
      };
    }
  }

  // Default fallback content
  return {
    content: `${lessonTitle}

Ce module vous présente les concepts essentiels et les meilleures pratiques dans ce domaine. Vous découvrirez les techniques et méthodes recommandées par les experts.

Les objectifs de ce module :
- Comprendre les principes fondamentaux
- Maîtriser les techniques essentielles
- Appliquer les bonnes pratiques
- Développer vos compétences professionnelles

Ce contenu a été conçu pour vous donner les outils nécessaires pour exceller dans votre domaine d'activité.`,
    documents: [
      {
        id: 1,
        name: "Guide de Formation.pdf",
        type: "pdf",
        size: "2.0 MB",
        description: "Guide complet de la formation",
        author: "Formateur Expert",
        downloads: 100,
        date: "2024-01-01",
        category: "guide"
      }
    ]
  };
};

const TextLessonContent = ({ onComplete, lessonTitle = "Module de Formation", courseTitle = "Formation" }: TextLessonContentProps) => {
  const { content, documents } = getContentForLesson(lessonTitle, courseTitle);
  
  return (
    <>
      <div className="prose max-w-none">
        <div className="text-gray-700 leading-relaxed space-y-4">
          {content.split('\n\n').map((paragraph, index) => (
            <p key={index}>{paragraph}</p>
          ))}
        </div>
      </div>
      
      <DocumentSection 
        documents={documents}
        courseTitle={courseTitle}
        lessonTitle={lessonTitle}
      />
      
      <Button onClick={onComplete} className="moov-gradient text-white w-full mt-6">
        Terminer le Module
      </Button>
    </>
  );
};

export default TextLessonContent;