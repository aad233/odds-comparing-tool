import React from 'react';

interface ErrorMessageProps {
  message: string;
}

export const ErrorMessage: React.FC<ErrorMessageProps> = ({ message }) => {
  return (
    <div className="bg-red-900/50 border-l-4 border-brand-highlight text-red-100 p-4 rounded-md shadow-lg" role="alert">
      <p className="font-bold">Er is een Fout Opgetreden</p>
      <p>{message}</p>
    </div>
  );
};