// Shows a single quiz question
import React from 'react';

interface QuizCardProps {
  title: string;
}

const QuizCard: React.FC<QuizCardProps> = ({ title }) => {
  return <div>{title}</div>;
};

export default QuizCard;
