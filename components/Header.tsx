import React from 'react';
import { OddsIcon } from './Icons';

interface HeaderProps {
  onResetApiKey: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onResetApiKey }) => {
  return (
    <header className="bg-brand-surface shadow-md p-4 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <OddsIcon className="w-8 h-8 text-brand-primary" />
        <h1 className="text-2xl font-bold text-white tracking-wide">Live Odds Vergelijker</h1>
      </div>
      <button
        onClick={onResetApiKey}
        className="px-3 py-2 text-xs font-medium text-brand-secondary transition-colors bg-gray-700 rounded-md hover:bg-gray-600 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface focus:ring-gray-500"
        aria-label="Verander API-sleutel"
      >
        Verander API-sleutel
      </button>
    </header>
  );
};