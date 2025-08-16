import React from 'react';
import type { GameEvent, Sport } from '../types';

interface MatchListProps {
  sports: Sport[];
  selectedSport: string | null;
  onSelectSport: (sportKey: string) => void;
  isLoadingSports: boolean;
  matches: GameEvent[];
  selectedMatchIds: string[];
  onToggleMatch: (matchId: string) => void;
  onCompareOdds: () => void;
  isLoadingMatches: boolean;
  selectedRegions: string;
  onRegionsChange: (regions: string) => void;
}

export const MatchList: React.FC<MatchListProps> = ({
  sports,
  selectedSport,
  onSelectSport,
  isLoadingSports,
  matches,
  selectedMatchIds,
  onToggleMatch,
  onCompareOdds,
  isLoadingMatches,
  selectedRegions,
  onRegionsChange,
}) => {
  const formatCommenceTime = (time: string) => {
    return new Date(time).toLocaleString('nl-NL', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const getRegionButtonStyle = (region: string) => {
    const baseStyle = 'px-3 py-1 text-xs font-medium focus:z-10 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-bg focus:ring-gray-500 transition-colors';
    if (selectedRegions === region) {
      return `${baseStyle} bg-brand-primary text-brand-bg`;
    }
    return `${baseStyle} bg-brand-surface text-brand-secondary hover:bg-gray-700`;
  };

  const renderMatchSkeletons = () => (
    <div className="space-y-3 pt-4">
      {Array.from({ length: 8 }).map((_, index) => (
        <div key={index} className="bg-brand-surface rounded-lg p-4 shadow-xl animate-pulse flex items-center">
          <div className="h-6 w-6 bg-gray-700 rounded mr-4"></div>
          <div className="flex-1">
            <div className="h-5 bg-gray-600 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-700 rounded w-1/2"></div>
          </div>
        </div>
      ))}
    </div>
  );

  return (
    <div>
      <div className="sticky top-0 bg-brand-bg/80 backdrop-blur-sm z-10 py-4 mb-4">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center space-y-4 md:space-y-0">
          <div className="flex flex-col md:flex-row md:items-end md:space-x-6 space-y-4 md:space-y-0">
            <div>
              <label htmlFor="league-select" className="block text-sm font-medium text-brand-secondary mb-1">
                Competitie
              </label>
              <select
                id="league-select"
                value={selectedSport || ''}
                onChange={(e) => onSelectSport(e.target.value)}
                disabled={isLoadingSports}
                className="w-full md:w-64 bg-brand-surface border border-gray-600 text-white text-sm rounded-lg focus:ring-brand-primary focus:border-brand-primary block p-2.5 disabled:opacity-50"
              >
                {isLoadingSports ? (
                  <option>Competities laden...</option>
                ) : (
                  sports.map((sport) => (
                    <option key={sport.key} value={sport.key}>
                      {sport.title}
                    </option>
                  ))
                )}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-brand-secondary mb-1">Bookmaker Regio</label>
              <div className="inline-flex rounded-md shadow-sm" role="group">
                <button type="button" onClick={() => onRegionsChange('eu,uk')} className={`${getRegionButtonStyle('eu,uk')} rounded-l-lg`}>
                  EU & VK
                </button>
                <button type="button" onClick={() => onRegionsChange('eu')} className={`${getRegionButtonStyle('eu')} border-y border-gray-600`}>
                  Alleen EU
                </button>
                <button type="button" onClick={() => onRegionsChange('uk')} className={`${getRegionButtonStyle('uk')} rounded-r-lg border-y border-r border-gray-600`}>
                  Alleen VK
                </button>
              </div>
            </div>
          </div>

          <div>
            <button
              onClick={onCompareOdds}
              disabled={selectedMatchIds.length === 0 || isLoadingMatches}
              className="w-full md:w-auto px-5 py-2.5 font-semibold text-white bg-brand-primary rounded-md shadow-md transition-colors disabled:bg-gray-700 disabled:text-gray-500 disabled:cursor-not-allowed hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-bg focus:ring-gray-500"
            >
              Vergelijk Odds ({selectedMatchIds.length})
            </button>
          </div>
        </div>
      </div>

      {isLoadingMatches ? (
        renderMatchSkeletons()
      ) : (
        <>
          {matches.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-64 text-center text-brand-secondary">
              <h2 className="text-2xl font-bold">Geen Aankomende Wedstrijden</h2>
              <p className="mt-2">Selecteer een andere competitie of controleer het later opnieuw.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {matches.map((match) => {
                const isSelected = selectedMatchIds.includes(match.id);
                return (
                  <div
                    key={match.id}
                    role="checkbox"
                    aria-checked={isSelected}
                    tabIndex={0}
                    onClick={() => onToggleMatch(match.id)}
                    onKeyDown={(e) => (e.key === ' ' || e.key === 'Enter') && onToggleMatch(match.id)}
                    className={`flex items-center p-4 rounded-lg cursor-pointer transition-all duration-200 border-2 ${
                      isSelected ? 'bg-gray-700/50 border-brand-primary' : 'bg-brand-surface border-transparent hover:border-gray-600'
                    }`}
                  >
                    <div
                      className={`flex-shrink-0 w-6 h-6 rounded-md flex items-center justify-center border-2 transition-colors ${
                        isSelected ? 'bg-brand-primary border-brand-primary' : 'border-gray-500 bg-gray-800'
                      }`}
                    >
                      {isSelected && (
                        <svg className="w-4 h-4 text-brand-bg" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path
                            fillRule="evenodd"
                            d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                            clipRule="evenodd"
                          />
                        </svg>
                      )}
                    </div>
                    <div className="ml-4 flex-grow">
                      <p className="font-bold text-white">
                        {match.home_team} vs {match.away_team}
                      </p>
                      <p className="text-sm text-brand-secondary">{formatCommenceTime(match.commence_time)}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </>
      )}
    </div>
  );
};
