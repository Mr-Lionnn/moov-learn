
import { useState } from 'react';

export const useQuizManager = () => {
  const [isQuizActive, setIsQuizActive] = useState(false);
  
  const startQuiz = () => {
    setIsQuizActive(true);
  };
  
  const endQuiz = () => {
    setIsQuizActive(false);
  };
  
  return {
    isQuizActive,
    startQuiz,
    endQuiz
  };
};
