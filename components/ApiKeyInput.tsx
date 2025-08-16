import React, { useState } from 'react';
import { OddsIcon } from './Icons';

interface ApiKeyInputProps {
  onSubmit: (apiKey: string) => void;
  error: string | null;
  isLoading: boolean;
}

export const ApiKeyInput: React.FC<ApiKeyInputProps> = ({ onSubmit, error, isLoading }) => {
  const [key, setKey] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (key.trim() && !isLoading) {
      onSubmit(key.trim());
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-brand-bg p-4">
      <div className="w-full max-w-md p-8 space-y-8 bg-brand-surface rounded-lg shadow-2xl">
        <div className="text-center">
            <OddsIcon className="w-16 h-16 mx-auto text-brand-primary" />
          <h2 className="mt-6 text-3xl font-bold text-white">
            API-sleutel Vereist
          </h2>
          <p className="mt-2 text-sm text-brand-secondary">
            Voer uw The Odds API-sleutel in om door te gaan. U kunt een gratis sleutel krijgen op <a href="https://the-odds-api.com" target="_blank" rel="noopener noreferrer" className="font-medium text-brand-primary hover:underline focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface focus:ring-brand-primary rounded-sm">the-odds-api.com</a>.
          </p>
        </div>
        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div>
            <label htmlFor="api-key" className="sr-only">API-sleutel</label>
            <input
              id="api-key"
              name="apiKey"
              type="text"
              autoComplete="off"
              required
              className="relative block w-full px-3 py-3 text-white placeholder-gray-500 bg-gray-700 border border-gray-600 rounded-md appearance-none focus:outline-none focus:ring-brand-primary focus:border-brand-primary focus:z-10 sm:text-sm"
              placeholder="API-sleutel"
              value={key}
              onChange={(e) => setKey(e.target.value)}
              disabled={isLoading}
            />
          </div>

          {error && (
            <p className="text-sm text-center text-red-400" role="alert">{error}</p>
          )}

          <div>
            <button
              type="submit"
              className="relative flex justify-center w-full px-4 py-3 text-sm font-medium text-white transition-colors duration-150 border border-transparent rounded-md group bg-brand-primary hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-brand-surface focus:ring-gray-500 disabled:bg-gray-600 disabled:cursor-not-allowed"
              disabled={isLoading || !key.trim()}
            >
              {isLoading ? (
                <>
                  <svg className="w-5 h-5 mr-3 -ml-1 text-white animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Valideren...
                </>
              ) : (
                'Sleutel Opslaan en Doorgaan'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};