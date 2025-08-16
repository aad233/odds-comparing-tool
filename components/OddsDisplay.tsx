import React from 'react';
import type { GameOdds } from '../types';
import { GameCard } from './GameCard';
import { ErrorMessage } from './ErrorMessage';
import { ChevronLeftIcon } from './Icons';

interface OddsDisplayProps {
  odds: GameOdds[];
  isLoading: boolean;
  error: string | null;
  onBack?: () => void;
}

export const OddsDisplay: React.FC<OddsDisplayProps> = ({ odds, isLoading, error, onBack }) => {
  const renderSkeletons = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
      {Array.from({ length: 6 }).map((_, index) => (
        <div key={index} className="bg-brand-surface rounded-lg p-6 shadow-xl animate-pulse">
          <div className="h-5 bg-gray-600 rounded w-3/4 mb-2"></div>
          <div className="h-4 bg-gray-700 rounded w-1/2 mb-6"></div>
          <div className="space-y-3">
            <div className="h-8 bg-gray-700 rounded"></div>
            <div className="h-8 bg-gray-700 rounded"></div>
            <div className="h-8 bg-gray-700 rounded"></div>
          </div>
        </div>
      ))}
    </div>
  );

  if (error) {
    return <ErrorMessage message={error} />;
  }
  
  if (isLoading) {
    return renderSkeletons();
  }
  
  if (odds.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center text-brand-secondary">
        <h2 className="text-2xl font-bold">Geen Odds Gevonden</h2>
        <p className="mt-2">Er zijn geen odds gevonden voor de geselecteerde wedstrijden.</p>
        {onBack && (
          <button
            onClick={onBack}
            className="mt-6 inline-flex items-center px-4 py-2 text-sm font-medium text-brand-secondary transition-colors bg-brand-surface rounded-md hover:bg-gray-700 hover:text-white"
          >
            <ChevronLeftIcon className="w-5 h-5 mr-2" />
            Terug naar Wedstrijdselectie
          </button>
        )}
      </div>
    );
  }

  return (
    <div>
      {onBack && (
        <div className="mb-6">
          <button
            onClick={onBack}
            className="inline-flex items-center px-4 py-2 text-sm font-medium text-brand-secondary transition-colors bg-brand-surface rounded-md hover:bg-gray-700 hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-bg focus:ring-gray-600"
          >
            <ChevronLeftIcon className="w-5 h-5 mr-2" />
            Terug naar Wedstrijdselectie
          </button>
        </div>
      )}
      <div className="grid grid-cols-1 lg:grid-cols-2 2xl:grid-cols-3 gap-6">
        {odds.map((game) => (
          <GameCard key={game.id} game={game} />
        ))}
      </div>
    </div>
  );
};