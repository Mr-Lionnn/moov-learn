
import { useState } from 'react';
import { Quiz, QuizAttempt, QuizResult, QuizFeedback } from '@/types/quiz';

export const useQuizManager = () => {
  const [isQuizActive, setIsQuizActive] = useState(false);
  const [currentQuiz, setCurrentQuiz] = useState<Quiz | null>(null);
  const [quizAttempt, setQuizAttempt] = useState<QuizAttempt | null>(null);
  
  const startQuiz = (quiz?: Quiz) => {
    if (quiz) {
      setCurrentQuiz(quiz);
      // Initialize quiz attempt
      const attempt: QuizAttempt = {
        id: `attempt_${Date.now()}`,
        quizId: quiz.id,
        userId: 'current_user',
        answers: new Array(quiz.questions.length).fill(-1),
        score: 0,
        passed: false,
        completedAt: '',
        timeSpent: 0
      };
      setQuizAttempt(attempt);
    }
    setIsQuizActive(true);
  };
  
  const endQuiz = () => {
    setIsQuizActive(false);
    setCurrentQuiz(null);
    setQuizAttempt(null);
  };

  const abandonQuiz = () => {
    endQuiz();
  };

  const submitAnswer = (questionIndex: number, answerIndex: number) => {
    if (quizAttempt) {
      const updatedAnswers = [...quizAttempt.answers];
      updatedAnswers[questionIndex] = answerIndex;
      
      setQuizAttempt({
        ...quizAttempt,
        answers: updatedAnswers
      });
    }
  };

  const submitQuiz = (): QuizResult | null => {
    if (!currentQuiz || !quizAttempt) return null;

    // Calculate score
    let correctAnswers = 0;
    const feedback: QuizFeedback[] = [];

    currentQuiz.questions.forEach((question, index) => {
      const userAnswer = quizAttempt.answers[index];
      const isCorrect = userAnswer === question.correctAnswer;
      
      if (isCorrect) {
        correctAnswers++;
      }

      feedback.push({
        questionId: question.id,
        userAnswer: userAnswer,
        correctAnswer: question.correctAnswer,
        explanation: question.explanation,
        isCorrect: isCorrect
      });
    });

    const percentage = Math.round((correctAnswers / currentQuiz.questions.length) * 100);
    const passed = percentage >= currentQuiz.passingGrade;

    const completedAttempt: QuizAttempt = {
      ...quizAttempt,
      score: percentage,
      passed: passed,
      completedAt: new Date().toISOString(),
      timeSpent: 0 // Could be calculated if needed
    };

    const result: QuizResult = {
      attempt: completedAttempt,
      quiz: currentQuiz,
      correctAnswers: correctAnswers,
      totalQuestions: currentQuiz.questions.length,
      percentage: percentage,
      passed: passed,
      feedback: feedback
    };

    return result;
  };
  
  return {
    isQuizActive,
    currentQuiz,
    quizAttempt,
    startQuiz,
    endQuiz,
    abandonQuiz,
    submitAnswer,
    submitQuiz
  };
};
