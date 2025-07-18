import { Quiz } from "@/types/quiz";

export const MoovCourseQuiz: Quiz = {
  id: "quiz_1",
  courseId: "course_1",
  title: "QUIZZ MENSUEL MAI 2025",
  description: "Testez vos connaissances",
  passingGrade: 70,
  timeLimit: 1800,
  questions: [
    {
      id: "q1",
      question: "Quelle est la syntaxe de désactivation ou de suppression d’un forfait internet activé ?",
      options: [
        "*123*9#",
        "*123*10#",
        "*123*6#",
        "*123*8#"
      ],
      correctAnswer: 1,
      explanation: "La syntaxe de désactivation ou de suppression d’un forfait internet activé est *123*10#.",
      difficulty: "easy"
    },
    {
      id: "q2",
      question: "Quel est le montant maximum de retrait Moovmoney au GAB via UBA ?",
      options: ["400.000F", "2.000.000F", "500.000F", "1.000.000F"],
      correctAnswer: 0,
      explanation: "Le montant maximum de retrait Moovmoney au GAB via UBA est de 400.000F",
      difficulty: "medium"
    },
    {
      id: "q3",
      question: "Combien coûte le service rétablissement de numéro dans nos agences.",
      options: ["200F", "100F", "500F", "1000F"],
      correctAnswer: 2,
      explanation: "Le service rétablissement de numéro dans nos agences 100F.",
      difficulty: "easy"
    },
    {
      id: "q4",
      question: "Par quelle syntaxe consulter le statut de son pack Moovmoney ?",
      options: ["*199*4*11#", "*199*4*10#", "*855*10#", "*855*11#"],
      correctAnswer: 0,
      explanation: "La syntaxe pour consulter le statut de son pack Moovmoney est *199*4*11#.",
      difficulty: "medium"
    },
    {
      id: "q5",
      question: "Pendant combien de temps la régénération du code de recharge SBEE est-elle possible ?",
      options: ["10 Jrs", "5 Jrs", "3 Jrs", "7 Jrs"],
      correctAnswer: 3,
      explanation: "La régénération du code de recharge SBEE est possible pendant 7 jours.",
      difficulty: "easy"
    },
    {
      id: "q6",
      question: "Un abonné MOOV ne peut Avoir la E SIM et la Sim physique fonctionnelle sur le même numéro ?",
      options: ["OUI", "NON", "Possible", "Parfois"],
      correctAnswer: 0,
      explanation: "Un abonné MOOV ne peut Avoir la E SIM et la Sim physique fonctionnelle sur le même numéro.",
      difficulty: "easy"
    },
    {
      id: "q7",
      question: "L’application moovmoney vous donne la possibilité d’avoir l’historique de vos transactions jusqu’aux :",
      options: ["Dernières 24H", "Dernières 12H", "Dernières 10H", "Dernières 48H"],
      correctAnswer: 0,
      explanation: "L’application moovmoney vous donne la possibilité d’avoir l’historique de vos transactions jusqu’aux dernières 24H.",
      difficulty: "easy"
    },
    {
      id: "q8",
      question: "Choisir la bonne réponse",
      options: ["La validité du forfait Moov Ciné est le temps pendant lequel l’abonné est autorisé à regarder des contenus", "La validité du forfait Moov Ciné est le montant disponible sur le compte de l’abonné", "La validité du forfait Moov Ciné est le temps pendant lequel l’abonné est autorisé à télécharger des contenus"],
      correctAnswer: 0,
      explanation: "La validité du forfait Moov Ciné est le temps pendant lequel l’abonné est autorisé à regarder des contenus",
      difficulty: "easy"
    },
    {
      id: "q9",
      question: "Quelle est la syntaxe d’activation de l’offre MOOV ciné?",
      options: ["*708#", "*706#", "*106#", "*108#"],
      correctAnswer: 1,
      explanation: "La syntaxe d’activation de l’offre MOOV ciné.",
      difficulty: "easy"
    },
    {
      id: "q10",
      question: "L’offre switch permet de convertir les forfaits pass bonus internet en forfait appel ",
      options: ["Vrai", "Faux", "Correct", "Incorrect"],
      correctAnswer: 1,
      explanation: "L’offre switch permet de convertir les forfaits pass bonus internet en forfait appel.",
      difficulty: "easy"
    },
    {
      id: "q11",
      question: "Les forfait MOOV Sayaa sont uniquement restreint à la Voix?",
      options: ["Vrai", "Faux", "Correct", "Incorrect"],
      correctAnswer: 0,
      explanation: "Les forfait MOOV Sayaa sont uniquement restreint à la Voix?",
      difficulty: "easy"
    },
    {
      id: "q12",
      question: "A combien de minutes donne droit un forfait MOOV SAYAA hebdo de 1500F?",
      options: ["30 Min", "41 Min", "62 Min", "50 Mins"],
      correctAnswer:2,
      explanation: "Un forfait MOOV SAYAA hebdo de 1500F donne droit à 62 Min",
      difficulty: "easy"
    },
    {
      id: "q13",
      question: "Le portage est le fait de changer sa Sim sans changer de numéro ?",
      options: ["Faux", "Vrai", "Correct", "Incorrect"],
      correctAnswer: 0,
      explanation: "Le portage n'est pas le fait de changer sa Sim sans changer de numéro",
      difficulty: "easy"
    },
    {
      id: "q14",
      question: "Les forfaits Pass bonus sont prioritaires sur les forfaits MOOV sayaa.",
      options: ["Faux", "Vrai", "Correct", "Incorrect"],
      correctAnswer: 0,
      explanation: "Les forfaits Pass bonus ne sont pas prioritaires sur les forfaits MOOV sayaa.",
      difficulty: "easy"
    },
    {
      id: "q15",
      question: "Quelle est la syntaxe permettant d’effectuer un transfert Moovmoney à un tiers?",
      options: ["*855*1*2#", "*855*1*1#", "*855*3*4#", "*855*2*6#"],
      correctAnswer: 0,
      explanation: "La syntaxe permettant d’effectuer un transfert Moovmoney à un tiers est 855*1*2#.",
      difficulty: "easy"
    },
    {
      id: "q16",
      question: "Quelle est la syntaxe permettant d’utiliser le Service de retrait GAB via UBA ?",
      options: ["*855*1*3*3#", "*855*5*3*3#", "*855*3*5*1#", "*855*6*2*1#"],
      correctAnswer: 0,
      explanation: "La syntaxe permettant d’utiliser le Service de retrait GAB via UBA est *855*1*3*3#",
      difficulty: "easy"
    },
    {
      id: "q17",
      question: "Les Pass bonus appel + sms + internet sont éligibles à la conversion MOOV SWITCH",
      options: ["Vrai", "Faux", "Correct", "Incorrect"],
      correctAnswer: 1,
      explanation: "Les Pass bonus appel +sms+ internet ne sont pas éligibles à la conversion MOOV SWITCH.",
      difficulty: "easy"
    },
    {
      id: "q18",
      question: "Quel est le code de désactivation du service notification de reconnaissance de réseau?",
      options: ["*140*0#", "*140*1#", "*104*0#", "*104*1#"],
      correctAnswer: 3,
      explanation: "Le modèle OSI a 7 couches distinctes.",
      difficulty: "easy"
    },
    {
      id: "q19",
      question: "Quelle syntaxe permet la sécurisation d’un transfert erroné par l’abonné ?",
      options: ["*855*7*10#", "*855*5*10#", "*855*6*10#", "*855*8*10#"],
      correctAnswer: 0,
      explanation: "Le modèle OSI a 7 couches distinctes.",
      difficulty: "easy"
    },
    {
      id: "q20",
      question: "Quels sont les avantages du nouveau kit VIVO ?",
      options: ["Un crédit initial de 100F + 60Mo et un solde Moovmoney de 100f", "Un crédit initial de 100F + 100Mo à l’activation de la sim avec un pack kwabo", "Un crédit initial de 100F + 40Mo et un solde Moovmoney de 100f", "Un crédit initial de 100F + 70Mo et un solde Moovmoney de 100f"],
      correctAnswer: 3,
      explanation: "Le modèle OSI a 7 couches distinctes.",
      difficulty: "easy"
    }
  ],
  createdBy: "instructor_1",
  createdAt: "2024-01-15T10:00:00Z",
  isActive: true
};