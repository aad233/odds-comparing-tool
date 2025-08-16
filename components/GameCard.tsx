import React from 'react';
import type { GameOdds, Bookmaker, Outcome } from '../types';
import { PINNACLE_KEY, TOTTOWINKEL_NL_KEY } from '../constants';
import { StarIcon } from './Icons';

interface GameCardProps {
  game: GameOdds;
}

interface ProcessedBookmakerOdds {
  key: string;
  title: string;
  outcomes: Outcome[];
}

export const GameCard: React.FC<GameCardProps> = ({ game }) => {
  const h2hMarketKey = 'h2h';

  const processedOdds = game.bookmakers
    .map(bookmaker => {
      const h2hMarket = bookmaker.markets.find(market => market.key === h2hMarketKey);
      if (!h2hMarket) return null;
      return {
        key: bookmaker.key,
        title: bookmaker.title,
        outcomes: h2hMarket.outcomes,
      };
    })
    .filter((b): b is ProcessedBookmakerOdds => b !== null);

  if (processedOdds.length === 0) {
    return null; // Don't render a card if there's no head-to-head odds
  }

  const outcomeNames = processedOdds[0].outcomes.map(o => o.name);

  const bestOdds = outcomeNames.map((_, index) => 
    Math.max(...processedOdds.map(b => b.outcomes[index]?.price || 0))
  );

  const formatCommenceTime = (time: string) => {
    return new Date(time).toLocaleString('nl-NL', {
      dateStyle: 'medium',
      timeStyle: 'short',
    });
  };

  const getBookmakerRowClass = (key: string) => {
    if (key === PINNACLE_KEY) {
      return 'bg-gray-600/30 border-l-4 border-gray-500';
    }
    if (key === TOTTOWINKEL_NL_KEY) {
      return 'bg-red-900/50 border-l-4 border-brand-highlight';
    }
    return 'bg-gray-700/50';
  };

  return (
    <div className="bg-brand-surface rounded-lg p-4 md:p-6 shadow-xl flex flex-col transition-transform hover:scale-[1.02] duration-300">
      <div className="mb-4">
        <h3 className="text-lg font-bold text-white truncate">{game.home_team} vs {game.away_team}</h3>
        <p className="text-sm text-brand-secondary">{formatCommenceTime(game.commence_time)}</p>
      </div>
      <div className="flex-1 overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="text-xs text-brand-secondary uppercase">
            <tr>
              <th scope="col" className="py-2 px-3">Bookmaker</th>
              {outcomeNames.map(name => (
                <th key={name} scope="col" className="py-2 px-3 text-center">{name}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {processedOdds.map(bookmaker => (
              <tr key={bookmaker.key} className={`border-b border-gray-700 ${getBookmakerRowClass(bookmaker.key)}`}>
                <th scope="row" className="py-3 px-3 font-medium text-white whitespace-nowrap">
                  {bookmaker.title}
                </th>
                {bookmaker.outcomes.map((outcome, index) => (
                  <td key={`${outcome.name}-${index}`} className="py-3 px-3 text-center">
                    <span className={`font-mono font-semibold py-1 px-2 rounded-md transition-colors ${
                      outcome.price === bestOdds[index] ? 'bg-brand-primary text-brand-bg' : 'text-brand-text'
                    }`}>
                      {outcome.price.toFixed(2)}
                      {outcome.price === bestOdds[index] && <StarIcon className="w-3 h-3 inline-block ml-1 mb-1" />}
                    </span>
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};